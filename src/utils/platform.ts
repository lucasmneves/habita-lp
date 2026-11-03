export type MobilePlatform = 'ios' | 'android' | 'other';

export function mobilePlatform(userAgent: string, touchPoints = 0): MobilePlatform {
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && touchPoints > 1)) return 'ios';
  return 'other';
}
