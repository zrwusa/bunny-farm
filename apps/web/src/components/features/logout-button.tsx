"use client"

import {Button} from "@/components/ui/button";
import {logout} from "@/app/client-actions";
import {useRouter} from "next/navigation";

export const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <Button variant="ghost" onClick={handleLogout}>
            Logout
        </Button>
    );
};