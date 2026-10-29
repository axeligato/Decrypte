'use client';
import { useState } from 'react';
import { playableCards } from '../lib/cards';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const card = playableCards[index];
  function respond(value: boolean) { if (choice !== null || !card) return; setChoice(value); if (value === card.answer) setCorrect(n => n + 1); }
  function next() { setChoice(null); setIndex(n => n + 1); }
  return <main>
    <header className="brand">DÉCRYPTE<span style={{color:'#738c15'}}>.</span></header>
    <section className="hero"><div className="eyebrow">Les faits derrière les débats</div><h1>On en parle.<br/>On vérifie.</h1><p className="intro">Des questions courtes, des réponses documentées et des sources accessibles. Pour comprendre les enjeux de société sans jugement ni parti pris.</p></section>
    {playableCards.length === 0 ? <section className="empty"><span className="pill">Édition en cours</span><h2>Les premières cartes arrivent.</h2><p>Nous vérifions chaque affirmation et ses sources avant de la rendre jouable. Aucun chiffre ni résultat ne sera publié sans contrôle éditorial.</p><p className="muted">Le registre de recherche est distinct des cartes publiées.</p></section> :
    card ? <section className="card" aria-live="polite"><div className="eyebrow">{card.category} · Carte {index + 1} / {playableCards.length}</div><h2>{card.claim}</h2>{choice === null ? <div className="actions"><button onClick={() => respond(true)}>Vrai</button><button className="secondary" onClick={() => respond(false)}>Faux</button></div> : <div className="answer"><strong>{card.answer ? 'Vrai' : 'Faux'} — {choice === card.answer ? 'Bonne réponse' : 'À découvrir'}</strong><p>{card.explanation}</p><p className="eyebrow">Sources</p>{card.sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></p>)}<div className="actions"><button onClick={next}>Carte suivante →</button></div></div>}</section> :
    <section className="card"><span className="pill">Session terminée</span><h2>{correct} / {playableCards.length} réponses correctes</h2><p>L'essentiel, c'est ce qu'on apprend en chemin.</p><div className="actions"><button onClick={() => {setIndex(0);setChoice(null);setCorrect(0);}}>Recommencer</button></div></section>}
    <footer className="note">Décrypte est un projet pédagogique indépendant. Les cartes ne sont publiées qu'après vérification des sources et du contexte.</footer>
  </main>;
}
