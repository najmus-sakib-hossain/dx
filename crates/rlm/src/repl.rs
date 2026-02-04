use crate::error::{RLMError, Result};
use rhai::{Engine, Scope, AST};
use std::time::Duration;

pub struct REPLExecutor {
    engine: Engine,
    max_output_chars: usize,
}

impl REPLExecutor {
    pub fn new() -> Self {
        let mut engine = Engine::new();
        
        // Configure engine for safety
        engine.set_max_expr_depths(50, 50);
        engine.set_max_operations(100_000);
        engine.set_max_string_size(10_000_000); // 10MB max string
        
        Self {
            engine,
            max_output_chars: 2000,
        }
    }

    pub fn execute(&self, code: &str, scope: &mut Scope) -> Result<String> {
        // Extract code from markdown blocks if present
        let code = self.extract_code(code);

        if code.trim().is_empty() {
            return Ok("No code to execute".to_string());
        }

        // Compile the script
        let ast = self.engine
            .compile(&code)
            .map_err(|e| RLMError::REPLError(format!("Compilation error: {}", e)))?;

        // Execute with scope
        let result: rhai::Dynamic = self.engine
            .eval_ast_with_scope(scope, &ast)
            .map_err(|e| RLMError::REPLError(format!("Execution error: {}", e)))?;

        // Convert result to string
        let output = result.to_string();

        // Truncate if too long
        if output.len() > self.max_output_chars {
            Ok(format!(
                "{}\n\n[Output truncated: {} chars total, showing first {}]",
                &output[..self.max_output_chars],
                output.len(),
                self.max_output_chars
            ))
        } else if output.is_empty() {
            Ok("Code executed successfully (no output)".to_string())
        } else {
            Ok(output)
        }
    }

    fn extract_code(&self, text: &str) -> String {
        // Check for markdown code blocks
        if text.contains("```") {
            if let Some(start) = text.find("```rhai") {
                let start = start + 7;
                if let Some(end) = text[start..].find("```") {
                    return text[start..start + end].trim().to_string();
                }
            }
            
            if let Some(start) = text.find("```") {
                let start = start + 3;
                if let Some(end) = text[start..].find("```") {
                    return text[start..start + end].trim().to_string();
                }
            }
        }

        text.to_string()
    }
}

impl Default for REPLExecutor {
    fn default() -> Self {
        Self::new()
    }
}
