export function associationFiles(config) {
  const url = new URL(config.appLinkUrl);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash || url.pathname !== '/open/') {
    throw new Error('appLinkUrl deve ser https://SEU_DOMINIO/open/, sem porta, query ou fragmento.');
  }
  const files = {};
  if (config.appleTeamId) {
    if (!/^[A-Z0-9]{10}$/.test(config.appleTeamId)) throw new Error('Apple Team ID deve conter 10 caracteres alfanuméricos maiúsculos.');
    files['apple-app-site-association'] = {
      applinks: { details: [{ appIDs: [`${config.appleTeamId}.${config.iosBundleIdentifier}`], components: [{ '/': '/open' }, { '/': '/open/' }] }] },
    };
  }
  if (config.androidCertificateFingerprints.length) {
    if (!config.androidCertificateFingerprints.every(value => /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/.test(value))) throw new Error('Use fingerprints Android SHA-256 completos, em maiúsculas e separados por dois-pontos.');
    files['assetlinks.json'] = [{ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: config.androidPackage, sha256_cert_fingerprints: config.androidCertificateFingerprints } }];
  }
  return files;
}
