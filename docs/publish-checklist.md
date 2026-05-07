# Publish Checklist

Use this checklist before turning the local SDK smoke-test kit into a public GitHub repo or release.

## Required QA

- Run `npm run verify`.
- Confirm `.env.example` contains placeholders only.
- Confirm every CTA uses `https://www.tken.shop/` with the `openai-compatible-sdk-smoke-tests` UTM campaign.
- Confirm API examples use `https://www.tken.shop/v1` only as a disclosed example endpoint.
- Confirm README copy stays provider-neutral and avoids unsupported claims.
- Confirm no screenshots, logs, JSON responses, or issue examples contain API keys or private account data.

## Suggested GitHub Metadata

- Repository name: `openai-compatible-sdk-smoke-tests`
- Description: `Portable smoke tests for OpenAI-compatible SDK endpoints: models, chat, embeddings, and streaming.`
- Homepage: `https://www.tken.shop/?utm_source=github&utm_medium=repo&utm_campaign=openai-compatible-sdk-smoke-tests&utm_content=repo_homepage`
- Topics: `openai-compatible`, `openai-api`, `base-url`, `sdk`, `smoke-test`, `chat-completions`, `embeddings`, `streaming`, `llm-tools`, `nodejs`

## Release Angle

Use a practical release title:

`OpenAI-compatible SDK smoke tests for base_url validation`

Keep the release note focused on:

- verifying `/v1/models`
- testing non-streaming and streaming chat completions
- checking embeddings responses
- validating provider wiring before app or CI integration
- keeping API keys in local environment variables

## Public Movement Gate

Do not create the public repo, push code, publish a release, open issues, submit to directories, or post externally until the owner explicitly approves that exact action.
