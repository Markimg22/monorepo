import type { Metadata } from 'next';

import '@monorepo/ui/styles.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Web',
    description: 'A simple template web aplication for Monorepo',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
