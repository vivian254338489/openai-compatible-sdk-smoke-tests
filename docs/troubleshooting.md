# Troubleshooting

## The Script Skips Network Tests

This is expected when `OPENAI_API_KEY` is empty or when `--offline` is used. Add a key only when you intentionally want live endpoint checks.

## 401 or 403

- Confirm the API key is valid for the selected endpoint.
- Confirm the provider expects `Authorization: Bearer <key>`.
- Use a low-privilege test key where possible.

## 404 on `/v1/chat/completions`

- Confirm `OPENAI_BASE_URL` ends in `/v1`.
- Confirm the endpoint supports OpenAI-compatible chat completions.
- Some local servers expose only a subset of the OpenAI API.

## Model Not Found

- Set `OPENAI_MODEL` to a chat-capable model exposed by the endpoint.
- Set `OPENAI_EMBEDDING_MODEL` to an embedding-capable model.
- Run with `--skip-embeddings` if the endpoint intentionally does not provide embeddings.

## Streaming Fails

- Confirm the provider supports server-sent event streaming.
- Try `--skip-streaming` for providers that only support non-streaming chat.
- If a proxy sits in front of the endpoint, confirm it does not buffer the stream.

## Embeddings Fail

- Confirm the selected model is an embedding model.
- Use `--skip-embeddings` if you only need chat compatibility.

## Secret Scan Fails

Remove real credentials from the working tree, rotate exposed keys, and run:

```bash
npm run scan:secrets
```
