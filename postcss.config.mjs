import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const globalsPath = resolve(process.cwd(), "src/index.css");

try {
  const buf = readFileSync(globalsPath);
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    writeFileSync(globalsPath, buf.subarray(3));
  }
} catch {
  /* ignore */
}

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
