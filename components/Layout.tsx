// FIXME: change this to next.js app router's layout.tsx

export const siteTitle = 'Digital Backroom - An Internet Archive';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div>
      <main className='theme-light'>{children}</main>
    </div>
  );
}
