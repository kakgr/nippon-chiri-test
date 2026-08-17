import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the geography quiz landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>ニッポン地理テスト｜旅する知識を20問で<\/title>/i);
  assert.match(html, /知っているようで/);
  assert.match(html, /テストをはじめる/);
  assert.match(html, /旅行先で役立つ地理/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("contains the requested quiz and sharing features", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.equal((page.match(/id: \d+,/g) ?? []).length, 20);
  assert.match(page, /localStorage/);
  assert.match(page, /social-plugins\.line\.me\/lineit\/share/);
  assert.match(page, /Discordにコピー/);
  assert.match(page, /高難度/);
  assert.match(layout, /lang="ja"/);
});
