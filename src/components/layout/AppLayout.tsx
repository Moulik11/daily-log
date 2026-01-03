import { ReactNode } from 'react';
import { TopBar } from './TopBar';

export function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-emerald-500/30">
            <div className="max-w-md mx-auto min-h-screen bg-neutral-900/20 shadow-2xl shadow-black ring-1 ring-white/5 relative">
                <TopBar />
                <main className="pb-20">
                    {children}
                </main>
            </div>
        </div>
    );
}
