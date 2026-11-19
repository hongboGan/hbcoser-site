import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { ROUTES } from '../dist-ssr/entry-server.js';
const dist = path.resolve('dist');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if(entry.isDirectory()) walk(file);
    else if(file.endsWith('.html')) files.push(file);
  }
}
walk(dist);
let pages = 0;
let verifications = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if(!html.includes('<body')) { verifications++; continue; }
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, file);
  assert.equal((html.match(/src="\/analytics-bootstrap\.js"/g)||[]).length,1,file);
  assert.match(head, /^\s*<script src="\/analytics-bootstrap\.js"><\/script>/, file);
  assert.equal(/src="https:\/\/www\.googletagmanager\.com\//.test(html), false, file);
  pages++;
}
for (const route of ROUTES) {
  const rel = route === '/' ? 'index.html' : route.replace(/^\//,'') + '.html';
  assert.ok(fs.existsSync(path.join(dist,rel)), rel);
}
assert.equal(pages, ROUTES.length + 1);
assert.equal(fs.readFileSync(path.join(dist,'analytics-bootstrap.js'),'utf8'),fs.readFileSync('public/analytics-bootstrap.js','utf8'));
console.log(JSON.stringify({passed:true,routeCount:ROUTES.length,htmlPagesIncluding404:pages,verificationFiles:verifications,singleGuardedLoaderPerPage:true,unconditionalGoogleLoaders:0},null,2));
