import { Button } from '@monorepo/ui/button';

export default function Home() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-2">
            <p>A Button from @monorepo/ui</p>
            <Button>Hello</Button>
        </div>
    );
}
