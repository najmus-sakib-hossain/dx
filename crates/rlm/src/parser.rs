use regex::Regex;

pub fn is_final(response: &str) -> bool {
    response.contains("FINAL(")
}

pub fn extract_final(response: &str) -> Option<String> {
    // Try different FINAL patterns
    let patterns = vec![
        r#"FINAL\s*\(\s*"""(.*)"""\s*\)"#,  // Triple double quotes
        r#"FINAL\s*\(\s*'''(.*)'''\s*\)"#,  // Triple single quotes
        r#"FINAL\s*\(\s*"([^"]*)"\s*\)"#,   // Double quotes
        r#"FINAL\s*\(\s*'([^']*)'\s*\)"#,   // Single quotes
    ];

    for pattern in patterns {
        if let Ok(re) = Regex::new(pattern) {
            if let Some(caps) = re.captures(response) {
                if let Some(answer) = caps.get(1) {
                    return Some(answer.as_str().trim().to_string());
                }
            }
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_final() {
        assert_eq!(
            extract_final(r#"FINAL("test answer")"#),
            Some("test answer".to_string())
        );

        assert_eq!(
            extract_final(r#"FINAL('test answer')"#),
            Some("test answer".to_string())
        );

        assert_eq!(
            extract_final(r#"Some code\nFINAL("the answer is 42")"#),
            Some("the answer is 42".to_string())
        );

        assert_eq!(
            extract_final("No final here"),
            None
        );
    }
}
