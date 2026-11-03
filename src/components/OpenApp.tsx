import { useEffect, useRef } from 'react';
import { appLinks, mobilePlatform, storeForPlatform } from '../data/appLinks';

/** Página aberta pelo navegador quando o sistema não entrega o App/Universal Link ao app. */
export function OpenApp() {
  const cancelRedirect = useRef(false);
  const platform = mobilePlatform(navigator.userAgent, navigator.maxTouchPoints);
  const storeUrl = storeForPlatform(platform);

  useEffect(() => {
    // Um retorno pelo histórico nunca deve prender o visitante em um ciclo de redirecionamento.
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!storeUrl || navigation?.type === 'back_forward') return;
    const timer = window.setTimeout(() => {
      if (!cancelRedirect.current && !document.hidden) window.location.replace(storeUrl);
    }, 1800);
    return () => clearTimeout(timer);
  }, [storeUrl]);

  return <main className="open-app-page">
    <a className="logo" href={import.meta.env.BASE_URL}><img src={`${import.meta.env.BASE_URL}assets/habiita-logo.png`} alt="Habiita, início" width="150" height="50" /></a>
    <p className="eyebrow">SEU PRÓXIMO PEQUENO PASSO</p>
    <h1>Uma nova rotina<br /><em>começa com você.</em></h1>
    <p>{storeUrl ? 'Vamos levar você à loja para conhecer o Habiita.' : 'Escolha onde continuar sua jornada com o Habiita.'}</p>
    <div className="open-app-actions">
      {appLinks.iosStoreUrl && <a className="button primary" href={appLinks.iosStoreUrl}>Ver na App Store <span aria-hidden="true">↗</span></a>}
      {appLinks.androidStoreUrl && <a className="button primary" href={appLinks.androidStoreUrl}>Ver no Google Play <span aria-hidden="true">↗</span></a>}
    </div>
    {!storeUrl && platform !== 'other' && <p className="open-app-note">O link da loja para este aparelho ainda não está disponível nesta página.</p>}
    {!appLinks.iosStoreUrl && !appLinks.androidStoreUrl && platform === 'other' && <p className="open-app-note">Os links de download serão disponibilizados aqui.</p>}
    <a className="text-link" href={appLinks.scheme} onClick={() => { cancelRedirect.current = true; }}>Já tenho o app. Abrir o Habiita <span aria-hidden="true">↗</span></a>
    <a className="open-app-home" href={import.meta.env.BASE_URL}>Voltar ao site</a>
  </main>;
}
