import { useEffect, useRef, useState } from 'react';
import { Rive, RuntimeLoader, Layout, Fit, Alignment } from '@rive-app/canvas';
import { HabDrawing } from './HabDrawing';
import { journey } from '../data/site';

RuntimeLoader.setWasmUrl(`${import.meta.env.BASE_URL}assets/rive.wasm`);

export function Mascot({ active }: { active: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const runtime = useRef<Rive | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [phrase, setPhrase] = useState('');
  const current = journey[active];

  useEffect(() => {
    if (!canvas.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lastWidth = 0;
    let lastHeight = 0;
    // Só redimensionar quando necessário: a operação reinicia o buffer do canvas.
    const resizeCanvas = () => {
      const rect = canvas.current?.getBoundingClientRect();
      if (!rect || (rect.width === lastWidth && rect.height === lastHeight)) return;
      lastWidth = rect.width;
      lastHeight = rect.height;
      rive.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio || 1, 2));
    };
    const rive = new Rive({
      canvas: canvas.current, src: `${import.meta.env.BASE_URL}assets/hab.riv`,
      artboard: 'Hab', stateMachine: 'HabMachine', autoplay: true, autoBind: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        const vm = rive.viewModelInstance;
        if (!vm) return;
        const motion = vm.boolean('reducedMotion'); if (motion) motion.value = reduced.matches;
        const flame = vm.boolean('flameEyes'); if (flame) flame.value = false;
        // Escala constante: rolagem não altera as dimensões do personagem.
        const stage = vm.number('stage'); if (stage) stage.value = 2;
        const energy = vm.number('energy'); if (energy) energy.value = 0.7;
        lastWidth = 0;
        resizeCanvas();
        setReady(true);
      },
      onLoadError: () => setReady(false),
    });
    runtime.current = rive;
    const resize = new ResizeObserver(resizeCanvas);
    resize.observe(canvas.current);
    const motionChange = () => { const prop = rive.viewModelInstance?.boolean('reducedMotion'); if (prop) prop.value = reduced.matches; };
    const visibility = () => { if (document.hidden) rive.pause(); else rive.play(); };
    reduced.addEventListener('change', motionChange);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearTimeout(timer.current);
      resize.disconnect();
      reduced.removeEventListener('change', motionChange);
      document.removeEventListener('visibilitychange', visibility);
      rive.cleanup(); runtime.current = null;
    };
  }, []);

  useEffect(() => {
    const mood = runtime.current?.viewModelInstance?.enum('mood');
    if (mood && ready && mood.value !== current.mood) mood.value = current.mood;
  }, [current.mood, ready]);

  function greet() {
    clearTimeout(timer.current);
    setPhrase(current.phrase);
    timer.current = setTimeout(() => setPhrase(''), 4000);
    const vm = runtime.current?.viewModelInstance;
    const reaction = vm?.enum('reaction'); if (reaction) reaction.value = 'tap';
    vm?.trigger('react')?.trigger();
  }

  return <div className="header-mascot">
    <button className="header-mascot-button" onClick={greet} aria-label="Diga oi ao Hab, seu companheiro de hábitos">
      <span className={`header-mascot-fallback ${ready ? 'is-ready' : ''}`}><HabDrawing size={60} face={current.mood} stage={2} armsUp={current.mood === 'excited'} /></span>
      <canvas ref={canvas} className={`header-mascot-canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
    </button>
    <div className={`header-speech ${phrase ? 'is-speaking' : ''}`} role="status">{phrase}</div>
  </div>;
}
