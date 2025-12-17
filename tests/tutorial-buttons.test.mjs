import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert";

test("Tutorial buttons wiring", async (t) => {
  await t.test("TutorialOverlay finish and close paths dismiss overlay", () => {
    const content = readFileSync("src/components/tutorial-overlay.tsx", "utf8");
    assert.match(content, /setIsDismissed\(true\)/);
    assert.match(content, /dismiss\("finish"\)/);
    assert.match(content, /dismiss\("close"\)/);
    assert.match(content, /onClick=\{\(e\) => \{\s*e\.preventDefault\(\);\s*e\.stopPropagation\(\);\s*handleClose\(\);\s*\}\}/m);
  });

  await t.test("Settings persistence failures do not throw", () => {
    const content = readFileSync("src/hooks/use-attihc.ts", "utf8");
    assert.match(content, /try\s*\{\s*persistSettings\(next\);\s*\}\s*catch\s*\(error\)/m);
  });
});

