# Contributing

This project is a provider-neutral smoke-test kit for OpenAI-compatible endpoints. Contributions should help developers verify SDK-facing behavior without turning the repo into a ranking, pricing claim, or promotional list.

## Good Contributions

- Reproducible compatibility reports for `/v1/models`, `/v1/chat/completions`, streaming chat, or `/v1/embeddings`.
- Docs fixes that make setup, CI usage, or troubleshooting clearer.
- Small test coverage improvements that keep the project dependency-light.
- Safety fixes that reduce the chance of committed secrets or private logs.

## Provider Mentions

TKEN may appear as one disclosed example endpoint because this repo is part of TKEN growth work. Other compatible providers can be discussed when the note is factual, reproducible, and useful to developers.

Do not add:

- absolute price, performance, availability, or partnership claims
- copied private dashboard data, API responses with account identifiers, or fake benchmarks
- real API keys, bearer tokens, cookies, recovery codes, or screenshots containing secrets
- affiliate-style copy that makes the tests less useful with non-TKEN endpoints

## Local QA

Before opening a public issue, PR, release, or repo push, run:

```bash
npm run verify
```

The verification command scans for common secret patterns, validates offline smoke-test behavior, and checks the repo-readiness docs required before public movement.

## Public Movement Gate

This local project does not authorize publishing, pushing, posting, opening upstream PRs, or editing GitHub metadata. Public movement requires an explicit owner approval line and a fresh QA pass.
