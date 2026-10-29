import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Fact Up — Les faits derrière les débats', description: 'Un jeu pédagogique pour comprendre les grands enjeux de société, sources à l’appui.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="fr"><body>{children}</body></html>; }
