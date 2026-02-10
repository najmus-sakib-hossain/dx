//! DX Icon Search - World's fastest icon search engine
//!
//! Features:
//! - FST-based prefix search (<0.1ms)
//! - Zero-copy rkyv metadata access
//! - Semantic search with embeddings
//! - Multi-threaded WASM support
//! - LZ4 compression for network transfer

pub mod builder;
pub mod engine;
#[cfg(feature = "gpu")]
pub mod gpu;
pub mod index;
pub mod multipattern;
pub mod optimized;
pub mod parser;
pub mod search;
pub mod types;
pub mod avx_search;
pub mod zero_alloc;
pub mod perfect_hash;
pub mod bloom;
pub mod precomputed;

#[cfg(feature = "wasm")]
pub mod wasm;

pub use engine::IconSearchEngine;
pub use search::SearchResult;
pub use types::{IconMetadata, IconPack};
