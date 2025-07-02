import {ReactNode} from 'react';
import {FlowNavBar} from '@/components/features/shopping/layout/flow-nav-bar';
import {getMe} from '@/lib/api/actions';

export default async function FlowLayout({children}: { children: ReactNode }) {
    const me = await getMe();
    return (
        <div className="min-h-screen bg-background">
            <FlowNavBar me={me}/>
            <main className="py-6">{children}</main>
        </div>
    );
}