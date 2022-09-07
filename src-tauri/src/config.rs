use std::path::{Path, PathBuf};

use dirs::config_dir;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};

use crate::error::AppError;

lazy_static! {
    static ref CONFIG_DIR_PATH: PathBuf = config_dir().unwrap().join("machines-manager");
    static ref CONFIG_FILE_PATH: PathBuf = config_dir()
        .unwrap()
        .join("machines-manager")
        .join("config.json");
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Machine {
    name: String,
    ip: String,
    user: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub machines: Vec<Machine>,
}

pub fn load_config() -> Result<Config, AppError> {
    if !Path::new(CONFIG_FILE_PATH.as_path()).exists() {
        let cfg = Config { machines: vec![] };
        save_config(&cfg)?;
        return Ok(cfg);
    }

    let contents = std::fs::read_to_string(CONFIG_FILE_PATH.as_path())?;
    let config: Config = serde_json::from_str(&contents)?;
    Ok(config)
}

pub fn save_config(cfg: &Config) -> Result<(), AppError> {
    std::fs::create_dir_all(CONFIG_DIR_PATH.as_path())?;

    std::fs::write(CONFIG_FILE_PATH.as_path(), serde_json::to_string(cfg)?)?;

    Ok(())
}
