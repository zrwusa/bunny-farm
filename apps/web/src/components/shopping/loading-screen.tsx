import Image from 'next/image';

export const LoadingScreen = () => {
    return (
        <div className="relative flex items-center justify-center h-screen">
            <div className="relative w-[400px] h-[400px]">

                <Image
                    priority
                    src="/images/bunny-farm-without-truck.png"
                    alt="loading-background"
                    fill
                    style={{ objectFit: 'contain' }}

                />


                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px]">
                    <Image
                        priority
                        src="/truck-animated.svg"
                        alt="loading-truck"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
            </div>
        </div>
    );
};
