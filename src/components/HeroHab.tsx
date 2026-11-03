import { useEffect, useRef, useState } from 'react';
import { Alignment, Fit, Layout, Rive, RuntimeLoader } from '@rive-app/canvas';
import wasmUrl from '@rive-app/canvas/rive.wasm?url';
import { HabDrawing } from './HabDrawing';

RuntimeLoader.setWasmUrl(wasmUrl);

/** Aceno oficial de boas-vindas, sem deslocar ou redimensionar o personagem. */
export function HeroHab() {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!canvas.current || !container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let loaded = false;
    let visible = false;
    let greeted = false;
    let lastWidth = 0;
    let lastHeight = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const wave = () => {
      const vm = rive.viewModelInstance;
      const reaction = vm?.enum('reaction');
      if (reaction) reaction.value = 'welcomeBack';
      vm?.trigger('react')?.trigger();
      greeted = true;
    };

    const queueWave = () => {
      clearTimeout(timer);
      if (!loaded || !visible || document.hidden || reduced.matches) return;
      timer = setTimeout(() => {
        wave();
        queueWave();
      }, 8000);
    };

    const updatePlayback = () => {
      if (!loaded) return;
      const motion = rive.viewModelInstance?.boolean('reducedMotion');
      if (motion) motion.value = reduced.matches;
      if (visible && !document.hidden) {
        rive.play();
        if (!reduced.matches && !greeted) wave();
      } else rive.pause();
      queueWave();
    };

    const resizeCanvas = () => {
      if (!loaded) return;
      const rect = canvas.current?.getBoundingClientRect();
      if (!rect || (rect.width === lastWidth && rect.height === lastHeight)) return;
      lastWidth = rect.width;
      lastHeight = rect.height;
      rive.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio || 1, 2));
    };

    const rive = new Rive({
      canvas: canvas.current,
      src: `${import.meta.env.BASE_URL}assets/hab.riv`,
      artboard: 'Hab', stateMachine: 'HabMachine', autoBind: true, autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        const vm = rive.viewModelInstance;
        if (!vm) return;
        const stage = vm.number('stage'); if (stage) stage.value = 2;
        const mood = vm.enum('mood'); if (mood) mood.value = 'happy';
        const energy = vm.number('energy'); if (energy) energy.value = 0.7;
        const flame = vm.boolean('flameEyes'); if (flame) flame.value = false;
        loaded = true;
        const rect = container.current?.getBoundingClientRect();
        visible = !!rect && rect.bottom > 0 && rect.top < window.innerHeight;
        resizeCanvas();
        updatePlayback();
        setReady(true);
      },
      onLoadError: () => setFailed(true),
    });

    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      updatePlayback();
    }, { threshold: 0.1 });
    intersection.observe(container.current);
    const resize = new ResizeObserver(resizeCanvas);
    resize.observe(canvas.current);
    reduced.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);

    return () => {
      clearTimeout(timer);
      intersection.disconnect();
      resize.disconnect();
      reduced.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
      rive.cleanup();
    };
  }, []);

  return <div className="hero-hab" ref={container}>
    {failed && <span className="hero-hab-fallback"><HabDrawing size={280} face="happy" stage={2} armsUp={false} /></span>}
    <canvas ref={canvas} className={`hero-hab-canvas ${ready ? '' : 'hidden'}`} aria-hidden="true" />
  </div>;
}
