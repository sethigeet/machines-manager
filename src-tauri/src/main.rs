#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Mutex;

use error::AppError;
use responses::MachineStatusResponse;
use tauri::State;

use config::{Config, Machine};

mod config;
mod error;
mod responses;
mod shell;

pub type ConfigState = Mutex<Config>;

#[tauri::command(async)]
fn get_machines<'r>(config: State<'r, ConfigState>) -> Result<Vec<Machine>, AppError> {
    let config = config.lock().unwrap();
    Ok(config.machines.clone())
}

#[tauri::command(async)]
fn get_machine_status(ip: String) -> Result<MachineStatusResponse, AppError> {
    let output = shell::get_status_cmd(ip).output()?;
    if let Some(code) = output.status.code() {
        if code != 0 {
            return Ok(MachineStatusResponse::down());
        }
    } else {
        return Ok(MachineStatusResponse::down());
    }

    if cfg!(windows) {
        if let Ok(out) = String::from_utf8(output.stdout) {
            if out.contains("unreachable") {
                return Ok(MachineStatusResponse::down());
            }
        }
    }

    Ok(MachineStatusResponse::up(80))
}

fn main() -> Result<(), AppError> {
    let config = config::load_config()?;

    tauri::Builder::default()
        .manage(Mutex::<Config>::new(config))
        .invoke_handler(tauri::generate_handler![get_machines, get_machine_status])
        .run(tauri::generate_context!())?;

    Ok(())
}
