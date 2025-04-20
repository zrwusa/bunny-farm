import {AnimatePresence, motion} from 'framer-motion';
import {FC} from 'react';

interface FlyingItemProps {
    flyingItem: {
        id: string;
        color: string;
        size: string;
        price: number;
        imageUrl: string;
        startX: number;
        startY: number;
        cartX: number;
        cartY: number;
    } | null;
}

export const FlyingItemAnimation: FC<FlyingItemProps> = ({flyingItem}) => {
    return (
        <AnimatePresence>
            {flyingItem && (
                <motion.div
                    initial={{x: flyingItem.startX, y: flyingItem.startY, scale: 1, opacity: 1}}
                    animate={{x: flyingItem.cartX, y: flyingItem.cartY, scale: 0.2, opacity: 0}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.6, ease: 'easeInOut'}}
                    className="fixed flex items-center bg-white shadow-lg rounded-lg border p-2"
                    style={{width: '150px', height: '80px', zIndex: 1000}}
                >
                    <img src={flyingItem.imageUrl} alt={flyingItem.color}
                         className="w-10 h-10 rounded-md object-cover"/>
                    <div className="ml-2">
                        <p className="text-sm font-bold">{flyingItem.color}</p>
                        <p className="text-xs text-gray-500">Size: {flyingItem.size}</p>
                        <p className="text-xs text-black">${flyingItem.price.toFixed(2)}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
