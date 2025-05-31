import {ReactNode} from 'react';
import {FlowNavBar} from '@/components/features/shopping/layout/flow-nav-bar';

export default function FlowLayout({children}: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <FlowNavBar/>
            <main className="container py-6">{children}</main>
        </div>
    );
}