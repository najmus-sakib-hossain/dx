use crate::error::{RLMError, Result};
use crate::llm::{LLMClient, Message};
use crate::parser::{extract_final, is_final};
use crate::repl::REPLExecutor;
use rhai::Scope;
use std::time::Instant;

pub struct RLMStats {
    pub llm_calls: usize,
    pub iterations: usize,
    pub elapsed_ms: u128,
}

pub struct RLM {
    llm_client: LLMClient,
    repl: REPLExecutor,
    max_iterations: usize,
    max_depth: usize,
    current_depth: usize,
}

impl RLM {
    pub fn new(api_key: String, model: String) -> Self {
        Self {
            llm_client: LLMClient::new(api_key, model),
            repl: REPLExecutor::new(),
            max_iterations: 30,
            max_depth: 5,
            current_depth: 0,
        }
    }

    pub fn with_max_iterations(mut self, max_iterations: usize) -> Self {
        self.max_iterations = max_iterations;
        self
    }

    pub async fn complete(&self, query: &str, context: &str) -> Result<(String, RLMStats)> {
        let start = Instant::now();

        if self.current_depth >= self.max_depth {
            return Err(RLMError::MaxDepth(self.max_depth));
        }

        // Build system prompt
        let system_prompt = build_system_prompt(context.len(), self.current_depth);

        // Initialize conversation
        let mut messages = vec![
            Message {
                role: "system".to_string(),
                content: system_prompt,
            },
            Message {
                role: "user".to_string(),
                content: query.to_string(),
            },
        ];

        // Initialize REPL scope with context
        let mut scope = Scope::new();
        scope.push("context", context.to_string());
        scope.push("query", query.to_string());

        let mut llm_calls = 0;
        let mut iterations = 0;

        // Main iteration loop
        for iteration in 0..self.max_iterations {
            iterations = iteration + 1;
            llm_calls += 1;

            // Call LLM
            let response = self.llm_client.complete(messages.clone()).await?;

            // Check for FINAL
            if is_final(&response) {
                if let Some(answer) = extract_final(&response) {
                    let elapsed_ms = start.elapsed().as_millis();
                    return Ok((
                        answer,
                        RLMStats {
                            llm_calls,
                            iterations,
                            elapsed_ms,
                        },
                    ));
                }
            }

            // Execute code in REPL
            let exec_result = match self.repl.execute(&response, &mut scope) {
                Ok(result) => result,
                Err(e) => format!("Error: {}", e),
            };

            // Add to conversation
            messages.push(Message {
                role: "assistant".to_string(),
                content: response,
            });
            messages.push(Message {
                role: "user".to_string(),
                content: exec_result,
            });
        }

        Err(RLMError::MaxIterations(self.max_iterations))
    }
}

fn build_system_prompt(context_size: usize, depth: usize) -> String {
    format!(
        r#"You are a Recursive Language Model. You interact with context through a Rhai REPL environment.

The context is stored in variable `context` (not in this prompt). Size: {} characters.
IMPORTANT: You cannot see the context directly. You MUST write Rhai code to search and explore it.

Available in environment:
- context: string (the document to analyze)
- query: string (the question)

SEARCH STRATEGIES (use these to find information):

1. KEYWORD SEARCH - Find exact phrases:
   let idx = context.index_of("keyword");
   if idx >= 0 {{
       print(context.sub_string(idx, idx + 200));
   }}

2. CONTAINS CHECK - Check if text contains keyword:
   if context.contains("keyword") {{
       print("Found keyword");
   }}

3. EXTRACT SECTIONS - Get parts of context:
   let start = 0;
   let end = 500;
   print(context.sub_string(start, end));

4. SEARCH AND EXTRACT:
   let idx = context.index_of("AI market");
   if idx >= 0 {{
       let section = context.sub_string(idx, idx + 300);
       print(section);
   }}

CRITICAL RULES:
- ALWAYS search the context before answering
- Try multiple search strategies if first attempt fails
- Print what you find to verify it's correct
- Do NOT guess or make up answers
- Only use FINAL("answer") after you have found concrete evidence

Example workflow:
1. Search for keywords
2. Extract relevant section
3. Verify information
4. Return FINAL("your answer")

Depth: {}
"#,
        context_size, depth
    )
}
