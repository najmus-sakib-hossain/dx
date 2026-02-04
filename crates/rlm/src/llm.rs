use crate::error::{RLMError, Result};
use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize)]
struct GroqRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Debug, Deserialize)]
struct GroqResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize)]
struct Choice {
    message: Message,
}

pub struct LLMClient {
    client: Client,
    api_key: String,
    model: String,
}

impl LLMClient {
    pub fn new(api_key: String, model: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
            model,
        }
    }

    pub async fn complete(&self, messages: Vec<Message>) -> Result<String> {
        let request = GroqRequest {
            model: self.model.clone(),
            messages,
            temperature: 1.0,
            max_tokens: 1024,
        };

        let response = self.client
            .post("https://api.groq.com/openai/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response.text().await.unwrap_or_default();
            return Err(RLMError::LLMError(format!(
                "API error {}: {}",
                status, error_text
            )));
        }

        let groq_response: GroqResponse = response.json().await?;

        groq_response
            .choices
            .first()
            .map(|choice| choice.message.content.clone())
            .ok_or_else(|| RLMError::LLMError("No response from LLM".to_string()))
    }
}
