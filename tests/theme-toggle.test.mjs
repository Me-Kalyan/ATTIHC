import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert";

test("Theme toggle integration", async (t) => {
  await t.test("Tailwind dark variant and theme transitions exist", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    assert.match(css, /@custom-variant dark/);
    assert.match(css, /\.theme-transition/);
  });

  await t.test("Global hook exposes resolvedTheme and toggleTheme", () => {
    const hook = readFileSync("src/hooks/use-attihc.ts", "utf8");
    assert.match(hook, /resolvedTheme/);
    assert.match(hook, /toggleTheme/);
    assert.match(hook, /attihc:theme-changed/);
  });

  await t.test("Header theme button uses global toggleTheme", () => {
    const header = readFileSync("src/components/header-nav.tsx", "utf8");
    assert.match(header, /toggleTheme/);
    assert.doesNotMatch(header, /document\.documentElement\.classList\.contains\("dark"\)/);
  });
});

