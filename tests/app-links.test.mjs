import test from 'node:test';
import assert from 'node:assert/strict';
import { associationFiles } from '../scripts/app-link-files.mjs';
import { mobilePlatform } from '../src/utils/platform.ts';

const fixture = { appLinkUrl: 'https://example.test/open/', appleTeamId: 'ABCDE12345', iosBundleIdentifier: 'com.test.app', androidPackage: 'com.test.app', androidCertificateFingerprints: [Array(32).fill('AB').join(':')] };

test('associa apenas a entrada do app, sem capturar recuperação de senha ou todas as páginas', () => {
  const files = associationFiles(fixture);
  assert.deepEqual(files['apple-app-site-association'].applinks.details[0].components, [{ '/': '/open' }, { '/': '/open/' }]);
  assert.equal(files['assetlinks.json'][0].target.package_name, 'com.test.app');
  assert.equal(files['assetlinks.json'][0].target.sha256_cert_fingerprints[0], fixture.androidCertificateFingerprints[0]);
});
test('não gera associações fictícias quando os dados de assinatura ainda não existem', () => {
  assert.deepEqual(associationFiles({ ...fixture, appleTeamId: '', androidCertificateFingerprints: [] }), {});
});
test('recusa domínio inseguro, caminhos diferentes e identificadores inválidos', () => {
  for (const appLinkUrl of ['http://example.test/open/', 'https://example.test/reset-password', 'https://example.test/open/?other=1']) assert.throws(() => associationFiles({ ...fixture, appLinkUrl }));
  assert.throws(() => associationFiles({ ...fixture, appleTeamId: '123' }));
  assert.throws(() => associationFiles({ ...fixture, androidCertificateFingerprints: ['AB:CD'] }));
});
test('distingue iPhone, Android, iPad com agente de desktop e computadores', () => {
  assert.equal(mobilePlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'), 'ios');
  assert.equal(mobilePlatform('Mozilla/5.0 (Linux; Android 16; Pixel 10)'), 'android');
  assert.equal(mobilePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5), 'ios');
  assert.equal(mobilePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0), 'other');
  assert.equal(mobilePlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'), 'other');
});
