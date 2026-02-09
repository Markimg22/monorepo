import { Button } from '@monorepo/ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col gap-4 items-center justify-center p-24">
            <h1 className="text-4xl font-bold">Web</h1>
            <p className="mt-4 text-lg text-gray-600">
                A simple template web aplication for Monorepo
            </p>
            <Button>Button from Package UI</Button>
        </main>
    );
}
