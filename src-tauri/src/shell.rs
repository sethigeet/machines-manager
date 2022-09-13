use std::process::Command;

use crate::{config::Machine, error::AppError};

#[cfg(windows)]
fn set_windows_creation_flags(cmd: &mut Command) {
    use std::os::windows::process::CommandExt;
    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
}

pub fn get_status_cmd(ip: String) -> Command {
    let mut cmd = Command::new("ping");

    #[cfg(windows)]
    set_windows_creation_flags(&mut cmd);

    if cfg!(windows) {
        // windows version of `ping` uses `-n` for number of requests
        cmd.arg("-n");
    } else {
        // unix version of `ping` uses `-c` for number of requests
        cmd.arg("-c");
    }

    cmd.arg("1");
    cmd.arg(ip);

    return cmd;
}

pub fn get_shutdown_cmd(machine: &Machine, password: String) -> Result<Command, AppError> {
    if !cfg!(windows) {
        return Err(AppError::UnsupportedPlatform("shutdown".to_string()));
    }

    let mut cmd = Command::new("powershell");

    #[cfg(windows)]
    set_windows_creation_flags(&mut cmd);

    cmd.arg("-c");
    cmd.arg(format!(r#"Import-Module RunAs; $pass = $(ConvertTo-SecureString '{}' -AsPlainText -Force); $credential = New-Object System.Management.Automation.PsCredential "{}\{}",$pass; RunAs -netOnly -user $credential -program "shutdown" -arguments "/s /t 0 /m {}""#, password, machine.ip, machine.user, machine.ip));

    Ok(cmd)
}
