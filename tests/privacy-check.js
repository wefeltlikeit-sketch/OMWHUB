const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const includedExtensions = new Set([".html", ".js", ".json", ".md", ".csv"]);
const ignored = new Set(["node_modules", ".git", "package-lock.json"]);
const prohibitedPatterns = [
  { name: "private IPv4 address", regex: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g },
  { name: "credential assignment", regex: /\b(?:password|passwd|api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']+["']/gi },
  { name: "external tracking script", regex: /(?:google-analytics|googletagmanager|segment\.com|mixpanel|amplitude|hotjar)/gi },
  { name: "browser network call", regex: /\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/g }
];

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (ignored.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return includedExtensions.has(path.extname(entry.name)) ? [full] : [];
  });
}

const failures = [];
for (const file of files(root)) {
  if (file === __filename) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of prohibitedPatterns) {
    if (pattern.regex.test(text)) failures.push(`${path.relative(root, file)}: ${pattern.name}`);
    pattern.regex.lastIndex = 0;
  }
}

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const phrase of ["Use synthetic or approved aggregate data only", "Do not upload PHI", "Synthetic scenario"]) {
  if (!index.includes(phrase)) failures.push(`index.html: missing required safety label "${phrase}"`);
}

if (failures.length) {
  console.error("Privacy check failed:\n" + failures.map(x => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log("Privacy check passed: no browser network calls, telemetry markers, embedded credentials, or private IPs detected.");
