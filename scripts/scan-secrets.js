#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IGNORE_DIRS = new Set([".git", "node_modules", "coverage", "dist", ".nyc_output"]);
const IGNORE_FILES = new Set([".env.example", "package-lock.json"]);
const PATTERNS = [
  {
    name: "OpenAI-style API key",
    regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g
  },
  {
    name: "GitHub token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/g
  },
  {
    name: "Bearer token assignment",
    regex: /(?:api[_-]?key|token|secret|password)\s*[:=]\s*["']?(?!process\.env\b)[A-Za-z0-9_./+=-]{24,}/gi
  }
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function isBinary(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 1024));
  return sample.includes(0);
}

function scanFile(file) {
  const relative = path.relative(ROOT, file).replace(/\\/g, "/");
  if (IGNORE_FILES.has(relative) || IGNORE_FILES.has(path.basename(relative))) {
    return [];
  }

  const buffer = fs.readFileSync(file);
  if (isBinary(buffer)) {
    return [];
  }

  const text = buffer.toString("utf8");
  const findings = [];
  for (const pattern of PATTERNS) {
    for (const match of text.matchAll(pattern.regex)) {
      const before = text.slice(0, match.index);
      const line = before.split(/\r?\n/).length;
      findings.push({
        file: relative,
        line,
        type: pattern.name
      });
    }
  }
  return findings;
}

const findings = walk(ROOT).flatMap(scanFile);
if (findings.length > 0) {
  console.error("Potential secrets found:");
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} ${finding.type}`);
  }
  process.exitCode = 1;
} else {
  console.log("No obvious secrets found.");
}
