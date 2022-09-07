use std::process::Command;

pub fn get_status_cmd(ip: String) -> Command {
    let mut cmd = Command::new("ping");

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
