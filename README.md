# DocuMind AI

A conversational agent for question-answering over PDF documents, built around a **corrective retrieval-augmented generation (RAG)** pipeline instead of standard single-pass retrieval.

## The problem with standard RAG

Most RAG systems retrieve the top-k most similar chunks once and generate an answer regardless of whether those chunks are actually relevant to the query. If retrieval misses, the generated answer is confidently wrong — grounded in the wrong context.

## How DocuMind is different

DocuMind adds a correction loop on top of retrieval:

1. **Query rewriting** — the user's query is rewritten into a formal, meaning-preserving form before retrieval, reducing ambiguity and phrasing noise.
2. **Relevance evaluation** — each retrieved chunk is evaluated for relevance to the rewritten query, rather than trusting similarity scores alone.
3. **Iterative correction** — if any retrieved chunk fails the relevance check, the query is rerun through retrieval again. This repeats until every chunk returned is confirmed relevant.

This trades single-pass latency for stronger answer grounding — the system does more work per query, but the context it hands to the generator is verified rather than best-effort.

## Tech Stack

- **Retrieval:** FAISS (vector similarity search)
- **Embeddings:** SentenceTransformers
- **Generation / relevance grading:** Groq (LLM inference)

## Architecture

```
User Query
   │
   ▼
Query Rewriter (formal, meaning-preserving rewrite)
   │
   ▼
FAISS Retrieval (top-k chunks) ──┐
   │                             │
   ▼                             │
Relevance Grader                 │
   │                             │
   ├── any chunk irrelevant? ────┘  (rerun retrieval)
   │
   ▼
All chunks relevant → Generate grounded answer
```

## Status

Actively developed. Originally built to explore corrective RAG architectures in depth; extended beyond the initial scope to add the iterative relevance-correction loop described above.