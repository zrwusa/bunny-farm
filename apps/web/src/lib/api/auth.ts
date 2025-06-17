import { cookies } from 'next/headers';


export const getCookieTokens = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;
    return {accessToken, refreshToken};
};

export const removeCookieTokens = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
};
