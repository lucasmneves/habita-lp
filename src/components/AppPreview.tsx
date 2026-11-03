import { useState } from 'react';

const habits = [ { icon: '◉', name: 'Beber água', category: 'Corpo', detail: 'Um copo de cada vez', color: 'blue' }, { icon: '▤', name: 'Ler um pouco', category: 'Foco', detail: 'Abra espaço para novas ideias', color: 'pink' }, { icon: '✳', name: 'Respirar e pausar', category: 'Mente', detail: 'Seu momento de presença', color: 'gold' } ];

export function AppPreview({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState([false, false, false]);
  const [view, setView] = useState('dia');
  const total = done.filter(Boolean).length;
  return <div className={`app-preview ${compact ? 'compact' : ''}`}>
    <div className="phone-status"><span>9:41</span><span aria-hidden="true">▮▮▮ ▰</span></div>
    <div className="app-top"><span className="mini-mark">habiita<span>✳</span></span><span className="avatar" aria-hidden="true">H</span></div>
    <p className="app-kicker">UM NOVO DIA PARA CRESCER</p><h3>{view === 'dia' ? <>Seu ritmo.<br />Suas pequenas vitórias.</> : view === 'progresso' ? <>Olhe o quanto<br />você já caminhou.</> : <>Cada passo<br />merece ser celebrado.</>}</h3>
    {view === 'dia' ? <>
    <div className="app-progress"><div><span>Progresso de hoje</span><strong>{Math.round(total / 3 * 100)}<small>%</small></strong></div><span className="progress-flower" aria-hidden="true">✳</span><progress max="3" value={total} aria-label={`${total} de 3 hábitos concluídos`} /><span>{total} de 3 hábitos concluídos</span></div>
    <div className="habits-title"><strong>Hábitos de hoje</strong><span>+ Um passo</span></div>
    <div className="habit-list">{habits.map((habit, i) => <button key={habit.name} className={`habit ${done[i] ? 'done' : ''}`} aria-pressed={done[i]} onClick={() => setDone(old => old.map((value, j) => i === j ? !value : value))}>
      <span className={`habit-icon ${habit.color}`} aria-hidden="true">{habit.icon}</span><span className="habit-text"><strong>{habit.name}</strong><small>{habit.category} · {habit.detail}</small></span><span className="habit-check" aria-hidden="true">{done[i] ? '✓' : '+'}</span>
    </button>)}</div>
    <p className="demo-feedback" role="status">{total === 3 ? 'Um dia de pequenas conquistas. Muito bem! ✨' : 'Experimente marcar um hábito acima.'}</p>
    </> : view === 'progresso' ? <div className="phone-panel"><div className="app-progress"><div><span>Seus hábitos nesta demonstração</span><strong>{total}<small> / 3</small></strong></div><progress max="3" value={total} aria-label={`${total} de 3 hábitos concluídos`} /><span>Pequenos passos também contam.</span></div><h4>Uma semana de consistência</h4><div className="mini-chart" aria-label="Gráfico ilustrativo de sete dias de atividade">{[35, 55, 42, 75, 58, 90, 70].map((height, i) => <span key={i} style={{height: `${height}%`}} />)}</div><p className="phone-note">Histórico ilustrativo. Seu progresso real aparece no aplicativo.</p></div> : <div className="phone-panel"><div className="achievement-hero"><span aria-hidden="true">✷</span><strong>Pequenas vitórias,<br />novas possibilidades.</strong></div><div className="demo-achievements"><div><span aria-hidden="true">✳</span><strong>Primeiro passo</strong><small>Todo começo tem valor.</small></div><div><span aria-hidden="true">↗</span><strong>Um novo ritmo</strong><small>Continue cultivando.</small></div></div><p className="phone-note">Representações ilustrativas de conquistas. Não correspondem a regras ou prêmios desbloqueados.</p></div>}
    <nav className="app-tabs" aria-label="Telas da demonstração ilustrativa">{[['dia','⌂','Meu dia'],['progresso','▥','Progresso'],['conquistas','✷','Conquistas']].map(([key,icon,label]) => <button key={key} className={view === key ? 'selected' : ''} aria-pressed={view === key} onClick={() => setView(key)}><span aria-hidden="true">{icon}</span><small>{label}</small></button>)}</nav>
    <div className="phone-home" />
  </div>;
}
