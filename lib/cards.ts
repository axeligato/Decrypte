export type Source = { label: string; url: string; publishedAt?: string };
export type Card = { id: string; category: string; claim: string; answer: boolean; explanation: string; sources: Source[]; status: 'verified' | 'research' | 'rejected'; verifiedAt?: string };
/** All entries are research-only until their source, wording and context have been independently checked. */
export const cards: Card[] = [
  { id: 'oqtf-definition', category: 'Immigration', claim: 'Une OQTF est, à elle seule, une condamnation pénale.', answer: false, explanation: 'Une obligation de quitter le territoire français est une mesure administrative. Elle ne constitue pas en elle-même une condamnation pénale.', sources: [{ label: 'Service-Public — Obligation de quitter le territoire français', url: 'https://www.service-public.fr/particuliers/vosdroits/F18362' }], status: 'research' },
  { id: 'vote-blanc', category: 'Démocratie', claim: 'Les votes blancs entrent dans les suffrages exprimés en France.', answer: false, explanation: 'Les bulletins blancs sont décomptés séparément des suffrages exprimés.', sources: [{ label: 'Code électoral — Article L65', url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000028397603' }], status: 'research' }
];
export const playableCards = cards.filter(card => card.status === 'verified' && Boolean(card.verifiedAt) && card.sources.length > 0 && card.sources.every(source => /^https:\/\//.test(source.url)));
