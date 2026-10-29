# Déployer Décrypte sur GitHub Pages

1. Fusionner la PR de déploiement dans `main`.
2. Ouvrir **Settings → Pages** du dépôt.
3. Dans **Build and deployment**, choisir **GitHub Actions** comme source.
4. Dans **Actions**, lancer **Deploy GitHub Pages** si le workflow ne démarre pas automatiquement.
5. Vérifier le site à https://axeligato.github.io/Decrypte/.

Le workflow utilise l'export statique de Next.js et publie le répertoire `out/`. Le `basePath` est activé uniquement lorsque `DEPLOY_TARGET=github-pages`, pour ne pas imposer `/Decrypte` à Vercel.

Les cartes au statut `research` ne sont pas affichées comme jouables. L'écran d'attente est normal tant que la revue éditoriale n'est pas terminée.

## Limites
GitHub Pages ne fournit pas de serveur Next.js, de routes API ni de secrets serveur. Prévoir Vercel si ces fonctionnalités deviennent nécessaires.
