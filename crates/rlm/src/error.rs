use thiserror::Error;

pub type Result<T> = std::result::Result<T, RLMError>;

#[derive(Error, Debug)]
pub enum RLMError {
    #[error("Max iterations ({0}) exceeded")]
    MaxIterations(usize),

    #[error("Max recursion depth ({0}) exceeded")]
    MaxDepth(usize),

    #[error("REPL execution error: {0}")]
    REPLError(String),

    #[error("LLM API error: {0}")]
    LLMError(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("HTTP error: {0}")]
    HttpError(#[from] reqwest::Error),

    #[error("JSON error: {0}")]
    JsonError(#[from] serde_json::Error),

    #[error("Rhai error: {0}")]
    RhaiError(#[from] Box<rhai::EvalAltResult>),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}
