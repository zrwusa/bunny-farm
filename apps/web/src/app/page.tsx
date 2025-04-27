import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Link href="/shopping">Shopping</Link>
            <Link href="/cms">CMS</Link>
        </>
    );
}
