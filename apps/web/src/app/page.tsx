import { Button } from '@monorepo/ui/button';

export default function Home() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">Welcome to your Next.js app</h1>
            <Button>Click me</Button>
        </div>
    );
}
