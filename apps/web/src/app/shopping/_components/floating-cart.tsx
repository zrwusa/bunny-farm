'use client'

import {useCart} from '@/app/shopping/_hooks/useCart';
import {useCartItemsCount} from '@/app/shopping/_hooks/useCartItemsCount';
import {ShoppingCart} from 'lucide-react';
import Link from 'next/link';
import {motion} from 'framer-motion';

export default function FloatingCart() {
    const {cartSession} = useCart();
    const count = useCartItemsCount(cartSession);

    return (
        <Link href="/shopping/cart">
            <motion.div
                id="floating-cart"
                data-testid="cart-icon"
                className="fixed bottom-5 right-5 bg-gray-900/80 text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
            >
                <ShoppingCart size={24}/>
                {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {count}
                    </span>
                )}
            </motion.div>
        </Link>
    );
}
