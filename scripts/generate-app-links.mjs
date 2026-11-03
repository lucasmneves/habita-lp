import fs from 'node:fs';
import { associationFiles } from './app-link-files.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../app-links.config.json', import.meta.url), 'utf8'));
const files = associationFiles(config);
const strict = process.argv.includes('--require-complete');
const missing = [];
if (!config.appleTeamId) missing.push('appleTeamId');
if (!config.androidCertificateFingerprints.length) missing.push('androidCertificateFingerprints');
if (!config.iosStoreUrl) missing.push('iosStoreUrl');
if (!config.androidStoreUrl) missing.push('androidStoreUrl');
for (const [key, hostname] of [['iosStoreUrl', 'apps.apple.com'], ['androidStoreUrl', 'play.google.com']]) {
  if (config[key]) { const url = new URL(config[key]); if (url.protocol !== 'https:' || url.hostname !== hostname || url.username || url.password) throw new Error(`${key}: informe a URL HTTPS oficial da loja.`); }
}
if (missing.length) console.warn(`App Links ainda incompletos: ${missing.join(', ')}. Nenhum valor fictício será publicado.`);
if (strict && missing.length) process.exit(1);
const directory = new URL('../public/.well-known/', import.meta.url);
for (const [name, content] of Object.entries(files)) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(new URL(name, directory), `${JSON.stringify(content, null, 2)}\n`);
  console.log(`Gerado: public/.well-known/${name}`);
}
// Nunca manter uma associação antiga após remover seus identificadores da configuração.
for (const name of ['apple-app-site-association', 'assetlinks.json']) {
  const target = new URL(name, directory);
  if (!Object.hasOwn(files, name) && fs.existsSync(target)) fs.unlinkSync(target);
}
