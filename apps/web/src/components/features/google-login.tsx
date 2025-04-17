"use client"

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { googleLogin } from '@/app/client-actions';

interface GoogleLoginButtonProps {
  from?: string;
}

export function GoogleLoginButton({ from }: GoogleLoginButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleGoogleLogin = async () => {
    try {
      const response = await googleLogin({
        type: 'google',
        oauthToken: 'dummy-token' // This should be replaced with actual OAuth token
      });

      if (response?.accessToken) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // If no from parameter is specified, use current pathname
        const redirectPath = from || pathname;
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
        />
      </svg>
      Sign in with Google
    </button>
  );
}
