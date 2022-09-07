use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("unable to serialize/deserialize given input: {0}")]
    SerdeError(#[from] serde_json::Error),

    #[error("unable to perform io operation: {0}")]
    IOError(#[from] std::io::Error),

    #[error("error while running tauri application")]
    TauriError(#[from] tauri::Error),
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