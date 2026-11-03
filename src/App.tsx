import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Mascot } from './components/Mascot';
import { HeroHab } from './components/HeroHab';
import { AppPreview } from './components/AppPreview';
import { site } from './data/site';
import { useJourney } from './hooks/useJourney';
import { appLinks } from './data/appLinks';

const base = import.meta.env.BASE_URL;
const steps = [
  ['01', 'Escolha o que faz bem.', 'Um hábito que combina com você é um ótimo lugar para começar.', '↗'],
  ['02', 'Encontre seu ritmo.', 'Transforme pequenas ações em momentos da sua rotina.', '◷'],
  ['03', 'Veja o caminho percorrido.', 'Acompanhe seu progresso e reconheça sua consistência.', '▥'],
  ['04', 'Celebre cada conquista.', 'Dê valor a cada passo. Até os pequenos merecem uma comemoração.', '✳'],
];

export function App() {
  const [menu, setMenu] = useState(false);
  const active = useJourney();
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (motion.matches) continue;
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.process .section-heading, .step, .evolution .section-heading, .growth-grid article, .application-copy, .phone-scene, .journey-section h2, .final-cta h2').forEach(element => observer.observe(element));
    const cancelMotion = () => { if (motion.matches) animations.forEach(animation => animation.cancel()); };
    motion.addEventListener('change', cancelMotion);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); motion.removeEventListener('change', cancelMotion); };
  }, []);

  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === 'Escape' && menu) { setMenu(false); menuButton.current?.focus(); } }
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [menu]);

  const cta = (label = 'Quero conhecer o Habiita', className = 'button primary') => <>
    <button className={`${className} cta-desktop`} onClick={() => dialog.current?.showModal()}>{label}<span aria-hidden="true">↗</span></button>
    <a className={`${className} cta-mobile`} href={site.appDeepLink}>Abrir o Habiita<span aria-hidden="true">↗</span></a>
  </>;

  return <>
    <div className="site-scroll">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="header-brand">
          <Mascot active={active} />
          <a className="logo" href="#inicio" aria-label="Habiita, início"><img src={`${base}assets/habiita-logo.png`} alt="Habiita" width="150" height="50" /></a>
        </div>
        <button ref={menuButton} className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenu(!menu)}>{menu ? '✕' : '☰'}</button>
        <nav id="main-nav" className={menu ? 'nav open' : 'nav'} aria-label="Navegação principal">
          <a href="#como-funciona" onClick={() => setMenu(false)}>Como funciona</a><a href="#aplicativo" onClick={() => setMenu(false)}>O aplicativo</a><a href="#jornada" onClick={() => setMenu(false)}>Nossa jornada</a>
        </nav>
        <div className="header-cta">{cta('Conheça o Habiita', 'button small')}</div>
      </header>
      <main id="conteudo">
        <section id="inicio" className="hero section">
          <div className="hero-copy"><p className="eyebrow"><span className="live-dot" /> SUA ROTINA, COM MAIS VIDA</p>
            <h1>Pequenos hábitos.<br /><em>Grandes<br className="desktop-break" /> mudanças.</em></h1>
            <p className="intro">Uma rotina melhor não nasce de uma vez.<br className="desktop-break" /> Cultive pequenos hábitos, acompanhe sua evolução e celebre cada conquista com o Habiita.</p>
            <div className="actions">{cta()}<a className="text-link" href="#como-funciona">Como funciona <span aria-hidden="true">↓</span></a></div>
            <div className="hero-note"><span className="tiny-seed" aria-hidden="true">✳</span><p>Sem pressa de ser perfeito.<br /><strong>Só a vontade de começar.</strong></p></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-portrait"><HeroHab /></div><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span><div className="floating-tag tag-one"><span>✓</span> Um passo de cada vez</div><div className="floating-tag tag-two"><span>↗</span> Seu próximo capítulo</div><span className="art-caption">CULTIVE O SEU MELHOR.</span></div>
          <div className="hero-bottom"><span>PEQUENAS AÇÕES. NOVAS POSSIBILIDADES.</span><a href="#como-funciona" aria-label="Explorar como funciona">Explore a jornada <span aria-hidden="true">↓</span></a></div>
        </section>
        <div className="principles"><span>Um hábito de cada vez</span><i aria-hidden="true">✳</i><span>No seu próprio ritmo</span><i aria-hidden="true">✳</i><span>Cada passo conta</span><i aria-hidden="true">✳</i><span>Com você na jornada</span></div>
        <section id="como-funciona" className="section process">
          <div className="section-heading"><p className="eyebrow">01 / O COMEÇO DE ALGO BOM</p><h2>Menos complicação.<br /><em>Mais ação.</em></h2><p>Da intenção ao primeiro passo.<br />E do primeiro passo a uma nova rotina.</p></div>
          <div className="steps">{steps.map(([n, title, text, icon]) => <article className="step" key={n}><div className="step-top"><span>{n}</span><span className="step-icon" aria-hidden="true">{icon}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>
        <section id="evolua" className="section evolution dark-section">
          <div className="section-heading"><p className="eyebrow">02 / CADA DIA CONTA</p><h2>Evolua um dia<br /><em>de cada vez.</em></h2><p>Você não precisa fazer tudo.<br />Precisa encontrar o seu próximo pequeno passo.</p></div>
          <div className="growth-grid"><article className="consistency"><span className="card-label">CONSISTÊNCIA</span><h3>Presença vale mais<br />que perfeição.</h3><div className="week" aria-label="Exemplo ilustrativo: cinco dias de hábitos concluídos">{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => <div key={i}><span className={i < 5 ? 'checked' : ''}>{i < 5 ? '✓' : '·'}</span><small>{day}</small></div>)}</div><p>Construa uma rotina para a vida real.</p></article>
            <article className="progress-card"><span className="card-label">PROGRESSO</span><div className="bars" aria-hidden="true">{[25, 39, 32, 57, 51, 75, 92].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><h3>O seu esforço<br />ganha forma.</h3><p>Enxergue o caminho que já percorreu.</p></article>
            <article className="reward-card"><span className="reward-icon" aria-hidden="true"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h10v5a5 5 0 0 1-10 0V3Z" /><path d="M7 5H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4M12 13v5m-4 3v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1H8Z" /></svg></span><div><span className="card-label">CONQUISTAS</span><h3>Celebre o que você cultivou.</h3><p>Progresso, XP e conquistas para dar valor à sua dedicação.</p></div></article>
          </div><p className="illustration-note">Representações ilustrativas de progresso e consistência.</p>
        </section>
        <section id="aplicativo" className="section application">
          <div className="application-copy"><p className="eyebrow">03 / CONHEÇA O HABIITA</p><h2>Seu dia a dia.<br /><em>Com um novo<br />olhar.</em></h2><p>Hábitos, progresso e pequenas vitórias reunidos em uma jornada que é sua.</p><ul className="feature-list"><li><span aria-hidden="true">✓</span> Escolha e organize seus hábitos</li><li><span aria-hidden="true">✓</span> Registre as ações do seu dia</li><li><span aria-hidden="true">✓</span> Acompanhe sua evolução</li><li><span aria-hidden="true">✓</span> Tenha o Hab como companheiro</li></ul><div className="preview-caption"><span aria-hidden="true">↗</span><p><strong>Um gostinho da experiência.</strong><br />Toque nos hábitos ao lado para experimentar.</p></div><small className="mockup-disclosure">Demonstração interativa ilustrativa, inspirada no aplicativo. Não é uma captura de tela; os dados são exemplos e não são salvos.</small></div>
          <div className="phone-scene"><span className="scene-label">PEQUENOS CHECKS.<br />GRANDES COMEÇOS.</span><AppPreview /></div>
        </section>
        <section id="jornada" className="section journey-section"><p className="eyebrow">04 / CRESCER É UMA JORNADA</p><h2>Você não precisa<br />mudar tudo hoje.<br /><em>Só precisa começar.</em></h2><div className="journey-line" aria-hidden="true"><span>INTENÇÃO</span><i>· · · · · ·</i><b>PRIMEIRO PASSO</b><i>· · · · · ·</i><span>EVOLUÇÃO</span><span className="line-sprout">✳</span></div><p>Alguns dias serão mais fáceis. Outros, nem tanto.<br />O Hab segue com você, um hábito de cada vez.</p></section>
        <section id="comece" className="section final-cta"><div className="cta-stamp" aria-hidden="true">✳</div><p className="eyebrow">SEU PRÓXIMO CAPÍTULO</p><h2>Sua próxima evolução<br />começa com<br /><em>um pequeno passo.</em></h2><p>Comece a construir uma rotina que combina com você.</p>{cta()}<small>Uma nova relação com os seus hábitos.</small></section>
      </main>
      <footer className="site-footer"><div><a className="logo" href="#inicio"><img src={`${base}assets/habiita-logo.png`} alt="Habiita, início" width="150" height="50" /></a><p>Cultive sua rotina. Floresça no seu tempo.</p></div><nav aria-label="Navegação do rodapé"><a href="#como-funciona">Como funciona</a><a href="#aplicativo">O aplicativo</a><a href="#jornada">Nossa jornada</a>{site.privacyUrl && <a href={site.privacyUrl}>Privacidade</a>}{site.socialLinks.map(link => <a key={link.url} href={link.url}>{link.label}</a>)}</nav><div className="footer-bottom"><span>© {new Date().getFullYear()} Habiita. Todos os direitos reservados.</span><span>Feito para pequenos recomeços. <i aria-hidden="true">✳</i></span></div></footer>
    </div>
    <dialog ref={dialog} className="availability-dialog" aria-labelledby="availability-title" onClick={event => { if (event.target === dialog.current) dialog.current?.close(); }}>
      <div className="dialog-content app-access-content">
        <p className="eyebrow">UM PEQUENO PASSO PARA COMEÇAR</p>
        <h2 id="availability-title">Leve o Habiita<br />com você.</h2>
        <div className="app-access-desktop">
          <p>Escaneie o QR Code com a câmera do seu celular para abrir o Habiita ou conhecer as opções de download.</p>
          <div className="app-qr"><QRCodeSVG value={site.appDeepLink} size={220} marginSize={4} level="M" title={`QR Code para abrir o Habiita: ${site.appDeepLink}`} /></div>
          <code className="app-deeplink">{site.appDeepLink}</code>
        </div>
        <div className="app-access-mobile"><p>Seu próximo passo está no aplicativo.</p><a className="button primary" href={site.appDeepLink}>Abrir o Habiita <span aria-hidden="true">↗</span></a></div>
        <p className="app-install-note">{appLinks.appUrl ? 'Abra o Habiita ou confira as opções de download no celular.' : 'O Habiita precisa estar instalado no celular para abrir este link.'}</p>
        <a className="app-demo-link" href="#aplicativo" onClick={() => dialog.current?.close()}>Conhecer a demonstração</a>
        <button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Fechar QR Code">✕</button>
      </div>
    </dialog>
  </>;
}
