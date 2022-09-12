use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("unable to serialize/deserialize given input: {0}")]
    SerdeError(#[from] serde_json::Error),

    #[error("unable to perform io operation: {0}")]
    IOError(#[from] std::io::Error),

    #[error("error while running tauri application")]
    TauriError(#[from] tauri::Error),

    #[error("a machine with the given name does not exist: {0}")]
    MachineDoesNotExistError(String),

    #[error("the current platform does not have support for the command: {0}")]
    UnsupportedPlatform(String),

    #[error("the shell command that was executed resulted in an error: {0}")]
    ShellCmdError(String),

    #[error("unable to parse the output of the shell cmd: {0}")]
    ParseFloatError(#[from] std::num::ParseFloatError),
}

// we must manually implement serde::Serialize
impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
