'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playableCards } from '../lib/cards';

type Answer = 'true' | 'false' | 'unknown';
type Result = { id: string; answer: Answer; correct: boolean | null };
const SESSION_SIZE = 10;
function shuffle<T>(items: readonly T[], seed: number): T[] {
  const copy = [...items];
  let state = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('factup-theme');
      if (saved === 'dark' || saved === 'light') setTheme(saved);
    } catch { /* local storage may be unavailable */ }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { window.localStorage.setItem('factup-theme', next); } catch { /* optional persistence */ }
  }
  const [session, setSession] = useState(0);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  useEffect(() => { setShuffleSeed(Math.floor(Math.random() * 0xFFFFFFFF)); }, []);
  function newShuffle() { setShuffleSeed(Math.floor(Math.random() * 0xFFFFFFFF)); }
  const [category, setCategory] = useState('Toutes');
  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(playableCards.map(card => card.category)))], []);
  const filteredCards = useMemo(() => shuffle(category === 'Toutes' ? playableCards : playableCards.filter(card => card.category === category), shuffleSeed), [category, shuffleSeed]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const touchStart = useRef<{x:number;y:number}|null>(null);
  const deck = filteredCards.slice(session * SESSION_SIZE, (session + 1) * SESSION_SIZE);
  const card = deck[index];
  const finished = deck.length > 0 && index >= deck.length;
  const choose = useCallback((value: Answer) => {
    if (!card || answer !== null) return;
    setAnswer(value);
    setResults(prev => [...prev, { id: card.id, answer: value, correct: value === 'unknown' ? null : (value === 'true') === card.answer }]);
  }, [card, answer]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ['INPUT','TEXTAREA','BUTTON'].includes(event.target.tagName)) return;
      if (card && answer === null) {
        if (event.key === 'ArrowLeft') choose('false');
        if (event.key === 'ArrowRight') choose('true');
        if (event.key.toLowerCase() === 'j') choose('unknown');
      }
      if (card && answer !== null && event.key === 'Enter') { setAnswer(null); setIndex(i => i + 1); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, answer, choose]);
  const correct = results.filter(r => r.correct === true).length;
  const answered = results.filter(r => r.correct !== null).length;
  function next() { setAnswer(null); setIndex(i => i + 1); }
  function reset() { setIndex(0); setAnswer(null); setResults([]); }
  function replay() { reset(); setSession(0); newShuffle(); }
  return <main>
    <header className="topbar"><span className="brand">FACT UP<span className="accent">.</span></span><div className="topbar-right"><span className="topbar-label">LES FAITS DERRIÈRE LES DÉBATS</span><button type="button" className="theme-toggle" role="switch" aria-checked={theme === 'dark'} aria-label="Mode sombre" title={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'} onClick={toggleTheme}><span className="theme-icon" aria-hidden="true">☀</span><span className="theme-track" aria-hidden="true"><span className="theme-thumb" /></span><span className="theme-icon" aria-hidden="true">☾</span></button></div></header>
    <section className="hero"><div className="eyebrow">S'informer sans se faire influencer</div><h1>On en parle.<br/>On vérifie.</h1><p className="intro">Des affirmations à explorer, des réponses expliquées et des sources à consulter.</p></section>
    {playableCards.length > 0 && <nav className="category-nav" aria-label="Choisir un thème">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => {setCategory(item);setSession(0);reset();newShuffle();}}>{item}</button>)}</nav>}
    {playableCards.length === 0 ? <section className="empty" role="status"><span className="pill">Vérification éditoriale en cours</span><h2>Les premières cartes se préparent.</h2><p>Le jeu s'ouvrira quand les premières affirmations auront passé la revue de leurs sources, dates et formulations. Aucun résultat ne sera inventé pour remplir la session.</p><p className="muted">L'interface est prête ; le contenu reste en validation.</p></section> :
    deck.length === 0 ? <section className="empty" role="status"><h2>Toutes les cartes de ce thème sont terminées.</h2><p>Tu peux choisir un autre thème ou revenir à toutes les cartes.</p><button onClick={() => {setCategory('Toutes');setSession(0);reset();}}>Voir toutes les cartes</button></section> :
    finished ? <section className="card results" aria-live="polite"><div className="eyebrow">Fin de session</div><h2>Merci d'avoir joué.</h2><p className="score">{correct}<span> / {answered}</span></p><p>Réponses correctes parmi les questions auxquelles tu as répondu. {results.length - answered} réponse(s) « Je ne sais pas ».</p><p className="muted">L'objectif est de découvrir les faits, pas de te noter.</p><div className="actions"><button onClick={replay}>Rejouer avec un nouvel ordre</button>{filteredCards.length > (session+1)*SESSION_SIZE && <button className="secondary" onClick={() => {setSession(s => s+1);reset();}}>Session suivante</button>}</div></section> :
    card ? <section className="play-area" aria-label="Question du jeu">
      <div className="progress-label"><span>QUESTION {index+1} / {deck.length}</span><span>{card.category.toUpperCase()}</span></div>
      <div className="progress" role="progressbar" aria-valuenow={index+1} aria-valuemin={1} aria-valuemax={deck.length} aria-label="Progression de la session"><div style={{width:`${(index+1)/deck.length*100}%`}}/></div>
      <article className="card" onTouchStart={e => {const t=e.touches[0];touchStart.current={x:t.clientX,y:t.clientY};}} onTouchEnd={e => {if(answer!==null || !touchStart.current)return;const t=e.changedTouches[0];const dx=t.clientX-touchStart.current.x;const dy=t.clientY-touchStart.current.y;touchStart.current=null;if(Math.abs(dx)>85 && Math.abs(dx)>Math.abs(dy)*1.5) choose(dx>0?'true':'false');}}>
        <div className="eyebrow">VRAI OU FAUX ?</div><h2>{card.claim}</h2>
        {answer === null ? <><p className="muted helper">Glisse vers la gauche pour Faux, vers la droite pour Vrai, ou utilise les boutons.</p><div className="actions answer-buttons"><button className="secondary" onClick={() => choose('false')}>← Faux</button><button onClick={() => choose('true')}>Vrai →</button></div><button className="unknown" onClick={() => choose('unknown')}>Je ne sais pas</button></> :
        <div className="answer" aria-live="polite"><span className="pill">{card.answer ? 'VRAI' : 'FAUX'}</span><h3>{answer === 'unknown' ? 'Découvrons la réponse.' : (answer === 'true') === card.answer ? 'Bien vu !' : 'Voici ce que disent les faits.'}</h3><p>{card.explanation}</p><div className="sources"><div className="eyebrow">SOURCES CONSULTABLES</div>{card.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></p>)}<p className="muted">Dernière validation : {card.verifiedAt}</p></div><div className="actions reveal-next"><button onClick={next}>{index === deck.length-1 ? 'Voir mon bilan' : 'Question suivante →'}</button></div></div>}
      </article>
      <p className="keyboard-tip">Clavier : ← Faux · → Vrai · J Je ne sais pas · Entrée Suivant</p>
    </section> : null}

    <section className="resource-section" aria-labelledby="resource-heading">
      <div className="eyebrow">POUR ALLER PLUS LOIN</div>
      <h2 id="resource-heading">S'informer par soi-même</h2>
      <p className="resource-intro">Retrouve les données, les textes officiels et les vérifications à la source. Compare les méthodes, les dates et les périmètres : aucune source ne remplace l'esprit critique.</p>
      <ul className="resource-list">
        <li><a href="https://factuel.afp.com/" target="_blank" rel="noopener noreferrer"><strong>AFP Factuel</strong><span>Vérification d'affirmations et d'images</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://www.insee.fr/" target="_blank" rel="noopener noreferrer"><strong>Insee</strong><span>Population, emploi et inégalités</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://www.vie-publique.fr/" target="_blank" rel="noopener noreferrer"><strong>Vie publique</strong><span>Institutions et politiques publiques</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://www.data.gouv.fr/" target="_blank" rel="noopener noreferrer"><strong>data.gouv.fr</strong><span>Jeux de données publiques françaises</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://ec.europa.eu/eurostat" target="_blank" rel="noopener noreferrer"><strong>Eurostat</strong><span>Statistiques comparables dans l'Union européenne</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://eur-lex.europa.eu/" target="_blank" rel="noopener noreferrer"><strong>EUR-Lex</strong><span>Textes officiels du droit européen</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://www.oecd.org/fr/" target="_blank" rel="noopener noreferrer"><strong>OCDE</strong><span>Études et comparaisons internationales</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://data.imf.org/fr-fr" target="_blank" rel="noopener noreferrer"><strong>FMI</strong><span>Données économiques et financières</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://donnees.banquemondiale.org/" target="_blank" rel="noopener noreferrer"><strong>Banque mondiale</strong><span>Indicateurs mondiaux de développement</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
        <li><a href="https://www.who.int/fr" target="_blank" rel="noopener noreferrer"><strong>OMS</strong><span>Données et recommandations de santé publique</span><span className="resource-arrow" aria-hidden="true">↗</span></a></li>
      </ul>
      <p className="resource-disclaimer">Sélection indicative de ressources publiques et journalistiques, sans affiliation ni garantie d'infaillibilité.</p>
    </section>
    <footer className="note"><strong>Notre engagement :</strong> aucune carte jouable sans validation éditoriale, source consultable et date de vérification. Fact Up ne recommande aucun parti ni candidat.</footer>
  </main>;
}
