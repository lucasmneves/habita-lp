import type { Ref } from 'react';

type HabMood = 'neutral' | 'happy' | 'excited' | 'proud' | 'tired' | 'sad';
type HabStage = 1 | 2 | 3 | 4;
const lightColors = {white: '#FFFFFF'};

/**
 * Cores do Hab redesenhado (o mesmo do arquivo Rive): corpo verde-menta, contorno grafite,
 * folhas verde-escuras. É ilustração de marca, então vale nos dois temas, como a chama da
 * celebração.
 */
export const HAB_COLORS = {
  body: '#8EE3C1',
  bodyShade: '#6CC4A6',
  bodyLight: '#D8F3E1',
  outline: '#2E3530',
  leaf: '#2E7D6B',
  leafDark: '#1F5A4C',
  leafLight: '#4E9E80',
  eye: '#2E3530',
  mouth: '#2E3530',
  tongue: '#F4D35E',
  /** Chama da marca (slider de conclusão, ritmo do header): laranja por fora, dourado no núcleo. */
  flameOuter: '#FF6D00',
  flameTip: '#FF8A00',
  flameCore: '#FFE34D',
} as const;

/** Expressões da folha "Expressões e emoções" que o desenho sabe fazer. */
export type HabFace = 'neutral' | 'happy' | 'excited' | 'proud' | 'tired' | 'sad' | 'curious' | 'surprised';

export type HabDrawingProps = {
  size: number;
  face: HabFace;
  stage: HabStage;
  /** Braços para cima (animado, boas-vindas). */
  armsUp: boolean;
  /** O `<svg>` de fora, para quem precisa da imagem (`toDataURL`): a do widget iOS. */
  svgRef?: Ref<SVGSVGElement>;
};

/** O Hab parado, sem reação: a expressão do humor e os braços para cima só quando animado. */
export function restingHabPose(mood: HabMood): { face: HabFace; armsUp: boolean } {
  return { face: mood, armsUp: mood === 'excited' };
}

const VIEWBOX = '0 -8 120 140';
/** Proporção do desenho (altura/largura). */
export const HAB_ASPECT = 140 / 120;

/** Tamanho do corpo e da folhagem por estágio ("Evolução e transformação"). */
const STAGE_BODY_SCALE: Record<HabStage, number> = { 1: 0.84, 2: 0.9, 3: 0.96, 4: 1 };
const STAGE_LEAF_SCALE: Record<HabStage, number> = { 1: 0.9, 2: 1, 3: 1.05, 4: 1.1 };

const LEFT_EYE = { x: 48, y: 74 };
const RIGHT_EYE = { x: 73, y: 73 };
const STROKE = 3.2;

/** Corpo largo e arredondado, com as duas perninhas curtas embaixo. */
const BODY =
  'M60 36 C84 36 99 54 99 80 C99 98 100 110 97 119 C94 126 82 127 75 122 C71 118 67 114 61 114 ' +
  'C55 114 51 118 47 122 C40 127 27 126 24 119 C21 110 21 98 21 80 C21 54 36 36 60 36 Z';

/**
 * O Hab desenhado em SVG: o mesmo personagem do arquivo Rive, sem animação de esqueleto. É o
 * fallback do `HabAvatar` (Expo Go, web, testes e falha do Rive) e o loading enquanto o Rive
 * prepara.
 */
export function HabDrawing({ size, face, stage, armsUp, svgRef }: HabDrawingProps) {
  const bodyScale = STAGE_BODY_SCALE[stage];
  const leafScale = STAGE_LEAF_SCALE[stage];
  const squash = face === 'tired' ? 0.94 : 1;

  return (
    <svg ref={svgRef} width={size} height={size * HAB_ASPECT} viewBox={VIEWBOX} fill="none">
      <defs>
        <linearGradient id="habLeaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={HAB_COLORS.leafDark} />
          <stop offset="1" stopColor={HAB_COLORS.leaf} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="126" rx={38 * bodyScale} ry="5" fill={HAB_COLORS.outline} opacity={0.14} />

      <g transform={`translate(60 126) scale(${bodyScale} ${bodyScale * squash}) translate(-60 -126)`}>
        <Arms up={armsUp} />

        <path d={BODY} fill={HAB_COLORS.body} />
        {/* Sombra do lado esquerdo e brilho do direito, como no arquivo Rive. */}
        <path d="M34 48 C25 62 23 94 26 116 C29 122 35 124 40 123 C34 104 32 78 39 53 Z" fill={HAB_COLORS.bodyShade} />
        <path d="M89 52 C95 64 96 82 93 100" stroke={HAB_COLORS.bodyLight} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        <path d={BODY} stroke={HAB_COLORS.outline} strokeWidth={STROKE} strokeLinejoin="round" />

        <Foliage stage={stage} scale={leafScale} />

        <g data-testid={`hab-eyes-${face}`}>
          <Eyes face={face} />
        </g>
        <Mouth face={face} />

        {face === 'curious' && (
          <text x="96" y="34" fontSize="22" fontWeight="bold" fill={HAB_COLORS.leaf}>
            ?
          </text>
        )}
        {face === 'tired' && (
          <text x="94" y="34" fontSize="16" fontWeight="bold" fill={HAB_COLORS.leaf}>
            z
          </text>
        )}
      </g>
    </svg>
  );
}

function Leaf({ d, rib, fill = 'url(#habLeaf)' }: { d: string; rib?: string; fill?: string }) {
  return (
    <>
      <path d={d} fill={fill} stroke={HAB_COLORS.outline} strokeWidth={STROKE * 0.85} strokeLinejoin="round" />
      {rib && <path d={rib} stroke={HAB_COLORS.outline} strokeWidth={1.4} strokeLinecap="round" opacity={0.55} />}
    </>
  );
}

/** Duas folhas grandes e abertas; a copa ganha folhas nos estágios 3 e 4. */
function Foliage({ stage, scale }: { stage: HabStage; scale: number }) {
  return (
    <g transform={`translate(60 40) scale(${scale}) translate(-60 -40)`}>
      {stage >= 3 && (
        <Leaf d="M58 38 C51 28 49 18 52 8 C60 14 63 26 61 38 Z" rib="M59 36 Q55 24 53 12" fill={HAB_COLORS.leafLight} />
      )}
      {stage === 4 && (
        <g data-testid="hab-crown">
          <Leaf d="M58 40 C46 36 34 38 26 46 C36 52 50 50 58 40 Z" rib="M56 41 Q42 42 30 46" fill={HAB_COLORS.leafLight} />
          <Leaf d="M62 40 C74 35 88 37 95 46 C85 52 70 50 62 40 Z" rib="M64 41 Q78 42 91 46" fill={HAB_COLORS.leafLight} />
        </g>
      )}
      <path d="M60 42 L60 33" stroke={HAB_COLORS.outline} strokeWidth={STROKE} strokeLinecap="round" />
      <Leaf d="M59 38 C48 22 34 14 17 15 C22 32 40 42 59 38 Z" rib="M57 36 Q40 26 22 18" />
      <Leaf d="M61 38 C62 21 72 6 89 -2 C93 15 83 33 61 38 Z" rib="M63 35 Q72 19 86 2" />
    </g>
  );
}

function Arms({ up }: { up: boolean }) {
  const arm = { fill: HAB_COLORS.body, stroke: HAB_COLORS.outline, strokeWidth: STROKE };
  if (up) {
    return (
      <>
        <ellipse cx="18" cy="62" rx="6.5" ry="14" transform="rotate(-38 18 62)" {...arm} />
        <ellipse cx="102" cy="62" rx="6.5" ry="14" transform="rotate(38 102 62)" {...arm} />
      </>
    );
  }
  // Em repouso, o braço esquerdo cai ao lado do corpo e o direito acena (pose do arquivo Rive).
  return (
    <>
      <ellipse cx="22" cy="98" rx="6.5" ry="15" transform="rotate(32 22 98)" {...arm} />
      <g className="hab-wave-arm"><ellipse cx="102" cy="70" rx="6.5" ry="13" transform="rotate(22 102 70)" {...arm} /></g>
    </>
  );
}

function OvalEye({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  return (
    <>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={HAB_COLORS.eye} />
      <ellipse cx={x + rx * 0.35} cy={y - ry * 0.4} rx={rx * 0.32} ry={ry * 0.26} fill={lightColors.white} />
    </>
  );
}

function ArcEye({ x, y, down }: { x: number; y: number; down: boolean }) {
  // `down`: pálpebra fechada de sono (‿); senão, olho sorrindo (^).
  const d = down ? `M${x - 6} ${y} Q${x} ${y + 5} ${x + 6} ${y}` : `M${x - 6} ${y + 2} Q${x} ${y - 6} ${x + 6} ${y + 2}`;
  return <path d={d} stroke={HAB_COLORS.eye} strokeWidth={3} strokeLinecap="round" />;
}

function Eyes({ face }: { face: HabFace }) {
  const l = LEFT_EYE;
  const r = RIGHT_EYE;
  switch (face) {
    case 'proud':
      return (
        <>
          <ArcEye x={l.x} y={l.y} down={false} />
          <ArcEye x={r.x} y={r.y} down={false} />
        </>
      );
    case 'tired':
      return (
        <>
          <ArcEye x={l.x} y={l.y + 2} down />
          <ArcEye x={r.x} y={r.y + 2} down />
        </>
      );
    case 'sad':
      return (
        <>
          <path d={`M${l.x - 7} ${l.y - 10} L${l.x + 4} ${l.y - 13}`} stroke={HAB_COLORS.eye} strokeWidth={2.4} strokeLinecap="round" />
          <path d={`M${r.x + 7} ${r.y - 10} L${r.x - 4} ${r.y - 13}`} stroke={HAB_COLORS.eye} strokeWidth={2.4} strokeLinecap="round" />
          <OvalEye x={l.x} y={l.y + 2} rx={4.2} ry={5} />
          <OvalEye x={r.x} y={r.y + 2} rx={4.2} ry={5} />
        </>
      );
    case 'excited':
    case 'surprised':
      return (
        <>
          <OvalEye x={l.x} y={l.y} rx={6.4} ry={7.6} />
          <OvalEye x={r.x} y={r.y} rx={6.4} ry={7.6} />
        </>
      );
    case 'curious':
      return (
        <>
          <OvalEye x={l.x} y={l.y + 1} rx={4.8} ry={5.6} />
          <OvalEye x={r.x} y={r.y - 1} rx={6} ry={7} />
        </>
      );
    default:
      return (
        <>
          <OvalEye x={l.x} y={l.y} rx={5.6} ry={6.4} />
          <OvalEye x={r.x} y={r.y} rx={5.6} ry={6.4} />
        </>
      );
  }
}

function Mouth({ face }: { face: HabFace }) {
  switch (face) {
    case 'happy':
    case 'excited':
      // Boca aberta com a língua amarela, como no "Feliz" e no "Animado" do arquivo Rive.
      return (
        <>
          <path
            d={face === 'excited' ? 'M52 84 Q61 82 70 84 Q69 97 61 97 Q53 97 52 84 Z' : 'M54 85 Q61 83 68 85 Q67 94 61 94 Q55 94 54 85 Z'}
            fill={HAB_COLORS.mouth}
          />
          <ellipse cx="61" cy={face === 'excited' ? 93 : 91} rx="4.2" ry="2.4" fill={HAB_COLORS.tongue} />
        </>
      );
    case 'surprised':
      return <ellipse cx="61" cy="90" rx="4.5" ry="5.5" fill={HAB_COLORS.mouth} />;
    case 'sad':
      return <path d="M54 92 Q61 86 68 92" stroke={HAB_COLORS.mouth} strokeWidth={2.8} strokeLinecap="round" />;
    case 'tired':
      return <ellipse cx="61" cy="90" rx="3" ry="2.2" fill={HAB_COLORS.mouth} />;
    case 'proud':
      return <path d="M53 86 Q61 94 69 86" stroke={HAB_COLORS.mouth} strokeWidth={2.8} strokeLinecap="round" />;
    case 'curious':
      return <path d="M57 88 Q61 90 65 88" stroke={HAB_COLORS.mouth} strokeWidth={2.4} strokeLinecap="round" />;
    default:
      return <path d="M55 86 Q61 91 67 86" stroke={HAB_COLORS.mouth} strokeWidth={2.6} strokeLinecap="round" />;
  }
}
