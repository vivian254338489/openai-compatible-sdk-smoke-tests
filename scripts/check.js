#!/usr/bin/env node

"use strict";

const DEFAULTS = {
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1-mini",
  embeddingModel: "text-embedding-3-small"
};

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.OPENAI_BASE_URL || DEFAULTS.baseUrl,
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || DEFAULTS.model,
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || DEFAULTS.embeddingModel,
    offline: false,
    skipModels: false,
    skipChat: false,
    skipEmbeddings: false,
    skipStreaming: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) {
        throw new Error(`Missing value for ${arg}`);
      }
      return argv[index];
    };

    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--base-url") {
      args.baseUrl = next();
    } else if (arg === "--api-key") {
      args.apiKey = next();
    } else if (arg === "--model") {
      args.model = next();
    } else if (arg === "--embedding-model") {
      args.embeddingModel = next();
    } else if (arg === "--offline") {
      args.offline = true;
    } else if (arg === "--skip-models") {
      args.skipModels = true;
    } else if (arg === "--skip-chat") {
      args.skipChat = true;
    } else if (arg === "--skip-embeddings") {
      args.skipEmbeddings = true;
    } else if (arg === "--skip-streaming") {
      args.skipStreaming = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  args.baseUrl = normalizeBaseUrl(args.baseUrl);
  return args;
}

function normalizeBaseUrl(value) {
  if (!value || typeof value !== "string") {
    return DEFAULTS.baseUrl;
  }
  return value.replace(/\/+$/, "");
}

function printHelp() {
  console.log(`OpenAI-compatible SDK smoke tests

Usage:
  node scripts/check.js [options]

Options:
  --base-url <url>          API base URL, usually ending in /v1
  --api-key <key>           Bearer token for live checks
  --model <name>            Chat model name
  --embedding-model <name>  Embedding model name
  --offline                 Skip network and validate offline behavior
  --skip-models             Skip GET /models
  --skip-chat               Skip non-streaming chat
  --skip-streaming          Skip streaming chat
  --skip-embeddings         Skip embeddings
  -h, --help                Show this help
`);
}

async function requestJson(args, path, options = {}) {
  const response = await fetch(`${args.baseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(`${path} returned non-JSON response: ${text.slice(0, 160)}`);
    }
  }

  if (!response.ok) {
    const message = data && data.error && data.error.message ? data.error.message : text;
    throw new Error(`${path} failed with ${response.status}: ${message || response.statusText}`);
  }

  return data;
}

async function checkModels(args) {
  const data = await requestJson(args, "/models", { method: "GET" });
  if (!data || (!Array.isArray(data.data) && typeof data !== "object")) {
    throw new Error("/models response did not include a recognizable model payload");
  }
  return Array.isArray(data.data) ? `${data.data.length} model(s)` : "model payload";
}

async function checkChat(args) {
  const data = await requestJson(args, "/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: args.model,
      messages: [
        {
          role: "user",
          content: "Reply with the word smoke."
        }
      ],
      max_tokens: 16,
      temperature: 0
    })
  });

  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content || typeof content !== "string") {
    throw new Error("chat completion response did not include choices[0].message.content");
  }
  return content.trim().slice(0, 80);
}

async function checkEmbeddings(args) {
  const data = await requestJson(args, "/embeddings", {
    method: "POST",
    body: JSON.stringify({
      model: args.embeddingModel,
      input: "OpenAI-compatible SDK smoke test"
    })
  });

  const embedding = data && data.data && data.data[0] && data.data[0].embedding;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("embedding response did not include data[0].embedding");
  }
  return `${embedding.length} dimensions`;
}

async function checkStreaming(args) {
  const response = await fetch(`${args.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: args.model,
      messages: [
        {
          role: "user",
          content: "Reply with the word stream."
        }
      ],
      max_tokens: 16,
      temperature: 0,
      stream: true
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`/chat/completions streaming failed with ${response.status}: ${text.slice(0, 160)}`);
  }

  if (!response.body || typeof response.body.getReader !== "function") {
    throw new Error("streaming response did not expose a readable body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let combined = "";
  let chunks = 0;

  while (chunks < 20) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const text = decoder.decode(value, { stream: true });
    combined += text;
    chunks += 1;
    if (combined.includes("data:")) {
      try {
        await reader.cancel();
      } catch (error) {
        // Some runtimes throw after the stream is already closed.
      }
      return `${chunks} chunk(s)`;
    }
  }

  throw new Error("streaming response did not include SSE data chunks");
}

async function runStep(label, skipped, fn) {
  if (skipped) {
    console.log(`- ${label}: skipped`);
    return { label, status: "skipped" };
  }

  try {
    const detail = await fn();
    console.log(`- ${label}: ok (${detail})`);
    return { label, status: "ok" };
  } catch (error) {
    console.error(`- ${label}: failed`);
    console.error(`  ${error.message}`);
    return { label, status: "failed" };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  console.log("OpenAI-compatible SDK smoke tests");
  console.log(`base_url: ${args.baseUrl}`);
  console.log(`chat model: ${args.model}`);
  console.log(`embedding model: ${args.embeddingModel}`);

  const noKey = !args.apiKey || args.apiKey.trim() === "";
  if (args.offline || noKey) {
    const reason = args.offline ? "--offline requested" : "OPENAI_API_KEY is empty";
    console.log(`network: skipped (${reason})`);
    console.log("- offline safety: ok");
    return;
  }

  const results = [];
  results.push(await runStep("models", args.skipModels, () => checkModels(args)));
  results.push(await runStep("chat", args.skipChat, () => checkChat(args)));
  results.push(await runStep("streaming", args.skipStreaming, () => checkStreaming(args)));
  results.push(await runStep("embeddings", args.skipEmbeddings, () => checkEmbeddings(args)));

  const failed = results.filter((result) => result.status === "failed");
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
