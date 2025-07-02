import Me from '../../auth/me';
import {Query} from '@/types/generated/graphql';
interface FlowNavBarProps {
    me?: Query["me"]
}
export const FlowNavBar = ({me}: FlowNavBarProps) => {
    return (
        <nav
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full flex h-14 items-center px-4">
                <div className="mr-4 flex">
                    <a className="mr-6 flex items-center space-x-2" href="/shopping">
                        <span className="font-bold">Bunny Farm</span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center justify-end">
                        <Me me={me}/>
                    </div>
                </div>
            </div>
        </nav>
    );
};