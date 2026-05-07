#!/usr/bin/env node

"use strict";

const { existsSync, readFileSync } = require("fs");

const REQUIRED_FILES = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/utm-links.md",
  "docs/publish-checklist.md",
  ".github/ISSUE_TEMPLATE/compatibility-report.md",
  ".github/ISSUE_TEMPLATE/docs-or-claim-fix.md"
];

const REQUIRED_README_SNIPPETS = [
  "Portable smoke tests",
  "https://www.tken.shop/v1",
  "utm_campaign=openai-compatible-sdk-smoke-tests",
  "CONTRIBUTING.md"
];

const REQUIRED_CHECKLIST_SNIPPETS = [
  "Run `npm run verify`",
  "openai-compatible-sdk-smoke-tests",
  "Public Movement Gate"
];

const PROHIBITED_PATTERNS = [
  /\bofficial partner\b/i,
  /\bguaranteed\b/i,
  /\bunlimited\b/i,
  /\bfree GPT\b/i,
  /https:\/\/api\.tken\.shop/i,
  /https:\/\/api\.tken\.ai/i,
  /https:\/\/tken\.shop/i,
  /http:\/\/www\.tken\.shop/i
];

const failures = [];

for (const file of REQUIRED_FILES) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

if (existsSync("README.md")) {
  const readme = readFileSync("README.md", "utf8");
  for (const snippet of REQUIRED_README_SNIPPETS) {
    if (!readme.includes(snippet)) {
      failures.push(`README.md missing required text: ${snippet}`);
    }
  }
}

if (existsSync("docs/publish-checklist.md")) {
  const checklist = readFileSync("docs/publish-checklist.md", "utf8");
  for (const snippet of REQUIRED_CHECKLIST_SNIPPETS) {
    if (!checklist.includes(snippet)) {
      failures.push(`docs/publish-checklist.md missing required text: ${snippet}`);
    }
  }
}

for (const file of REQUIRED_FILES.filter((file) => existsSync(file))) {
  const text = readFileSync(file, "utf8");
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(text)) {
      failures.push(`${file} contains prohibited pattern: ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Readiness check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      checked: REQUIRED_FILES.length,
      campaign: "openai-compatible-sdk-smoke-tests"
    },
    null,
    2
  )
);
