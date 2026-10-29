# Décrypte — MVP

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000.

## Politique de publication

Les données de démonstration sont au statut `research`. L'interface affiche un état d'attente tant qu'aucune carte n'a été vérifiée. Pour rendre une carte jouable, effectuer une revue éditoriale documentée, puis définir `status: 'verified'` et `verifiedAt` (date ISO) dans `lib/cards.ts`. Le filtre de publication ne remplace pas une vérification humaine.

## Prochaines étapes

1. Auditer les 60 propositions du registre et conserver leurs sources précises.
2. Ajouter un jeu de 10 cartes validées, avec date, périmètre et limites.
3. Implémenter les estimations chiffrées, les gestes tactiles, la progression et l'accessibilité.
4. Mettre en place une politique de corrections et des tests.
