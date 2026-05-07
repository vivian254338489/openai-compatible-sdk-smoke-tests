# Setup

This repo checks OpenAI-compatible APIs with plain HTTP requests from Node.js. It does not require the OpenAI SDK, which makes it useful for validating base URL compatibility before choosing a client library.

## Requirements

- Node.js 18 or newer.
- An OpenAI-compatible base URL ending in `/v1`.
- An API key for real network checks.

## Install

```bash
git clone https://github.com/vivian254338489/openai-compatible-sdk-smoke-tests.git
cd openai-compatible-sdk-smoke-tests
npm run verify
```

No package install is required because the scripts use Node's built-in `fetch`.

## Run Against Any Compatible Endpoint

```bash
export OPENAI_BASE_URL="https://your-provider.example/v1"
export OPENAI_API_KEY="your-api-key"
export OPENAI_MODEL="your-chat-model"
export OPENAI_EMBEDDING_MODEL="your-embedding-model"
npm run check
```

## TKEN Example

TKEN is included as a disclosed example of an OpenAI-compatible endpoint:

```bash
export OPENAI_BASE_URL="https://www.tken.shop/v1"
```

Visit [TKEN](https://www.tken.shop/?utm_source=github&utm_medium=repo&utm_campaign=openai-compatible-sdk-smoke-tests&utm_content=setup-doc) for endpoint details.

## CI Usage

Use offline verification for pull requests that should not call external APIs:

```bash
npm run verify
```

Use live checks only in a protected CI job with secrets configured:

```bash
npm run scan:secrets
npm run check
```
