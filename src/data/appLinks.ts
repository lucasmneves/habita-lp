import config from '../../app-links.config.json';

import type { MobilePlatform } from '../utils/platform';
export { mobilePlatform } from '../utils/platform';

function httpsUrl(value: string): string {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : ''; }
  catch { return ''; }
}

export const appLinks = {
  appUrl: httpsUrl(config.appLinkUrl),
  iosStoreUrl: httpsUrl(config.iosStoreUrl),
  androidStoreUrl: httpsUrl(config.androidStoreUrl),
  scheme: 'habita://',
};

export function storeForPlatform(platform: MobilePlatform): string {
  return platform === 'ios' ? appLinks.iosStoreUrl : platform === 'android' ? appLinks.androidStoreUrl : '';
}
