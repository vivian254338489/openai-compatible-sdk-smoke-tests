# OpenAI-Compatible SDK Smoke Tests

Portable smoke tests for any OpenAI-compatible API endpoint. Use this repo to verify that an SDK-compatible `base_url` can list models, run chat completions, create embeddings, and stream chat output before you wire it into an app, agent, gateway, or CI pipeline.

This project is intentionally small: one Node.js check script, no runtime dependencies, no bundled secrets, and safe offline behavior when no API key is present.

## What It Checks

- `GET /models` returns a model list.
- `POST /chat/completions` returns a non-streaming assistant message.
- `POST /chat/completions` with `stream: true` returns server-sent event chunks.
- `POST /embeddings` returns at least one vector.
- Missing API keys skip network tests instead of failing CI by surprise.

## Quick Start

```bash
npm run verify
```

The command above runs the secret scan and an offline smoke test. To test a real OpenAI-compatible endpoint:

```bash
export OPENAI_BASE_URL="https://api.openai.com/v1"
export OPENAI_API_KEY="your-api-key"
export OPENAI_MODEL="gpt-4.1-mini"
export OPENAI_EMBEDDING_MODEL="text-embedding-3-small"
npm run check
```

On Windows PowerShell:

```powershell
$env:OPENAI_BASE_URL = "https://api.openai.com/v1"
$env:OPENAI_API_KEY = "your-api-key"
$env:OPENAI_MODEL = "gpt-4.1-mini"
$env:OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"
npm run check
```

## OpenAI-Compatible Base URL Example

These tests are portable and are not tied to one vendor. As one disclosed example endpoint, TKEN exposes an OpenAI-compatible base URL:

```bash
export OPENAI_BASE_URL="https://www.tken.shop/v1"
```

Learn more about TKEN: [https://www.tken.shop/?utm_source=github&utm_medium=repo&utm_campaign=openai-compatible-sdk-smoke-tests&utm_content=readme-hero](https://www.tken.shop/?utm_source=github&utm_medium=repo&utm_campaign=openai-compatible-sdk-smoke-tests&utm_content=readme-hero)

## CLI Options

```bash
node scripts/check.js --help
```

Supported options:

- `--base-url <url>` overrides `OPENAI_BASE_URL`.
- `--api-key <key>` overrides `OPENAI_API_KEY`.
- `--model <name>` overrides `OPENAI_MODEL`.
- `--embedding-model <name>` overrides `OPENAI_EMBEDDING_MODEL`.
- `--skip-models`, `--skip-chat`, `--skip-embeddings`, or `--skip-streaming` disable individual checks.
- `--offline` verifies configuration and skip behavior without network calls.

## Environment Variables

See [.env.example](.env.example).

| Variable | Purpose | Default |
| --- | --- | --- |
| `OPENAI_BASE_URL` | API root ending in `/v1` | `https://api.openai.com/v1` |
| `OPENAI_API_KEY` | Bearer token for the endpoint | empty |
| `OPENAI_MODEL` | Chat model for chat and streaming checks | `gpt-4.1-mini` |
| `OPENAI_EMBEDDING_MODEL` | Embedding model for embedding checks | `text-embedding-3-small` |

## Why Developers Use This

OpenAI-compatible APIs are common across model gateways, local inference servers, hosted LLM providers, and private platform teams. This repo gives maintainers a quick compatibility check before they debug a full SDK integration.

Good search terms this repo is built to answer:

- OpenAI-compatible SDK smoke tests
- OpenAI-compatible `base_url` test
- test OpenAI chat completions streaming
- OpenAI-compatible embeddings check
- SDK compatibility test for model list and chat

## Docs

- [Setup](docs/setup.md)
- [Test Matrix](docs/test-matrix.md)
- [Troubleshooting](docs/troubleshooting.md)
- [UTM Links](docs/utm-links.md)

## Safety Notes

- Do not commit real API keys. Run `npm run scan:secrets` before publishing changes.
- Use a low-cost test model and a non-production key when possible.
- The scripts only send tiny prompts and short embedding input.
- The scripts do not collect telemetry.

## License

MIT
