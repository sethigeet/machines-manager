use std::sync::Mutex;

use error::AppError;
use lazy_static::lazy_static;
use regex::Regex;
use responses::MachineStatusResponse;
use tauri::State;

use config::{Config, Machine};

mod config;
mod error;
mod responses;
mod shell;

lazy_static! {
    static ref PING_RE: Regex = Regex::new(r"\stime=(\d+\.?\d*)\s?ms").unwrap();
}

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

    let out = match String::from_utf8(output.stdout) {
        Ok(o) => {
            if cfg!(windows) {
                if o.contains("unreachable") {
                    return Ok(MachineStatusResponse::down());
                }
            }
            o
        }
        Err(err) => {
            return Err(AppError::ShellCmdError(format!(
                "unable to read the output of shell cmd: ping\nerr: {err}"
            )))
        }
    };

    let ping = match PING_RE.captures_iter(out.as_str()).next() {
        Some(cap) => cap[1].parse()?,
        None => return Ok(MachineStatusResponse::up(1.0)),
    };

    Ok(MachineStatusResponse::up(ping))
}

#[tauri::command(async)]
fn add_machine<'r>(machine: Machine, config: State<'r, ConfigState>) -> Result<(), AppError> {
    let mut config = config.lock().unwrap();
    config.machines.push(machine);
    config::save_config(&config)?;

    Ok(())
}

#[tauri::command(async)]
fn edit_machine<'r>(machine: Machine, config: State<'r, ConfigState>) -> Result<(), AppError> {
    let mut config = config.lock().unwrap();
    let idx = match config.machines.iter().position(|m| m.name == machine.name) {
        Some(i) => i,
        None => return Err(AppError::MachineDoesNotExistError(machine.name)),
    };
    let m = config.machines.get_mut(idx).unwrap();
    *m = machine;

    config.machines.sort_by(|m1, m2| m1.name.cmp(&m2.name));

    config::save_config(&config)?;

    Ok(())
}

#[tauri::command(async)]
fn delete_machine<'r>(
    machine_name: String,
    config: State<'r, ConfigState>,
) -> Result<(), AppError> {
    let mut config = config.lock().unwrap();
    let idx = match config.machines.iter().position(|m| m.name == machine_name) {
        Some(i) => i,
        None => return Err(AppError::MachineDoesNotExistError(machine_name)),
    };
    config.machines.remove(idx);

    config::save_config(&config)?;

    Ok(())
}

#[tauri::command(async)]
fn shutdown_machine<'r>(
    machine_name: String,
    password: String,
    config: State<'r, ConfigState>,
) -> Result<(), AppError> {
    let config = config.lock().unwrap();
    let machine = match config.machines.iter().find(|m| m.name == machine_name) {
        Some(m) => m,
        None => return Err(AppError::MachineDoesNotExistError(machine_name)),
    };
    let mut cmd = shell::get_shutdown_cmd(machine, password)?;
    if let Err(err) = cmd.output() {
        return Err(AppError::ShellCmdError(err.to_string()));
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() -> Result<(), AppError> {
    let config = config::load_config()?;

    tauri::Builder::default()
        .manage(Mutex::<Config>::new(config))
        .invoke_handler(tauri::generate_handler![
            get_machines,
            get_machine_status,
            get_auto_refresh,
            set_auto_refresh,
            add_machine,
            edit_machine,
            delete_machine,
            shutdown_machine
        ])
        .run(tauri::generate_context!())?;

    Ok(())
}
