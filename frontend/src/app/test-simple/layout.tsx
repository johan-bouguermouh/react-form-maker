'use client';

/** add a simple layout with side barre */
import { usePathname } from 'next/navigation';
import React from 'react';
import TestSimplePage from './page';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();
  const pageposition = pathname.replace('/test-simple', '');
  const ClassNameAsideLiMenuDafult =
    'relative flex cursor-default shadow-sm select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border  hover:cursor-pointer hover:bg-accent hover:text-accent-foreground';
  const ClassNameAsideLiMenuActive =
    'bg-primary text-white hover:cursor-default hover:bg-primary hover:text-white';
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-white shadow-lg p-4 fixed h-min-[100vh] h-[100vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul className="space-y-2">
          <li
            className={cn(
              ClassNameAsideLiMenuDafult,
              pageposition === '/stepper' && ClassNameAsideLiMenuActive,
            )}
          >
            <Link href="/test-simple/stepper">RFM Stepper</Link>
          </li>
          <li
            className={cn(
              ClassNameAsideLiMenuDafult,
              pageposition === '' && ClassNameAsideLiMenuActive,
            )}
          >
            {pageposition === '' && <Check className="mr-2 h-4 w-4" />}
            <Link href="/test-simple">Simple formulaire</Link>
          </li>
          <hr className="my-2" />
          <li
            className={cn(
              ClassNameAsideLiMenuDafult,
              pageposition === '/text' && ClassNameAsideLiMenuActive,
            )}
          >
            {pageposition === '/text' && <Check className="mr-2 h-4 w-4" />}
            <a href="/test-simple/text">TextField</a>
          </li>
        </ul>
      </aside>
      <main className="bg-[#f7f7fb] text-foreground ml-64 p-4 w-full overflow-auto">
        {children}
      </main>
    </div>
  );
}
