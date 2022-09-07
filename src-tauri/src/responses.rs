use serde::Serialize;

#[derive(Debug, Serialize)]
enum MachineStatus {
    Up,
    Down,
}

#[derive(Debug, Serialize)]
pub struct MachineStatusResponse {
    status: MachineStatus,
    ping: Option<u32>,
}

impl MachineStatusResponse {
    pub fn up(ping: u32) -> Self {
        Self {
            status: MachineStatus::Up,
            ping: Some(ping),
        }
    }

    pub fn down() -> Self {
        Self {
            status: MachineStatus::Down,
            ping: None,
        }
    }
}
