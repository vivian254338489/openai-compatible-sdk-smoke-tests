# Test Matrix

The matrix below describes what the smoke test runner validates and why each check matters for OpenAI-compatible SDK usage.

| Check | Endpoint | Method | Default Input | Success Signal |
| --- | --- | --- | --- | --- |
| Models | `/models` | `GET` | none | Response contains `data` array or object payload. |
| Chat | `/chat/completions` | `POST` | Tiny one-turn prompt | Response contains `choices[0].message.content`. |
| Streaming | `/chat/completions` | `POST` | Tiny one-turn prompt with `stream: true` | Response emits at least one `data:` SSE chunk. |
| Embeddings | `/embeddings` | `POST` | Short text input | Response contains `data[0].embedding` array. |
| Offline | none | none | no key or `--offline` | Network checks are skipped cleanly. |

## Compatibility Expectations

An endpoint does not need to match every OpenAI feature to pass these smoke tests. It should only provide the common SDK surfaces most apps expect:

- Bearer token authorization.
- JSON request and response bodies.
- Chat completions for a configured model.
- Embeddings for a configured embedding model.
- SSE-style streaming chunks for streaming chat.

## Suggested Release Gates

- Run `npm run verify` on every pull request.
- Run `npm run check` on a scheduled job with a low-privilege key.
- Run live checks before changing app SDK configuration, proxy routes, or model gateway routing.
