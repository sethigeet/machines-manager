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
fn get_machines<'r>(config: State<'r, ConfigState>) -> Vec<Machine> {
    let config = config.lock().unwrap();
    config.machines.clone()
}

#[tauri::command(async)]
fn get_auto_refresh<'r>(config: State<'r, ConfigState>) -> bool {
    let config = config.lock().unwrap();
    config.auto_refresh.clone()
}

#[tauri::command(async)]
fn set_auto_refresh<'r>(
    auto_refresh: bool,
    config: State<'r, ConfigState>,
) -> Result<(), AppError> {
    let mut config = config.lock().unwrap();
    config.auto_refresh = auto_refresh;
    config::save_config(&config)?;

    Ok(())
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
        .invoke_handler(tauri::generate_handler![
            get_machines,
            get_machine_status,
            get_auto_refresh,
            set_auto_refresh
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
