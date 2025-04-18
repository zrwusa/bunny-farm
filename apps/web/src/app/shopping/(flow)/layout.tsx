import { ReactNode } from 'react';

export default function FlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/shopping">
              <span className="font-bold">Bunny Farm</span>
            </a>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}