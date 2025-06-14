import Link from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps {
  children: ReactNode;
  href: string;
}

export default function CustomLink({ children, href }: CustomLinkProps) {
  // If the link is local it will start with a "/"
  // Otherwise it'll be something like "https://"
  return href.startsWith('/') || href === '' ? (
    <Link href={href} className={'tuancao'}>
      <a>{children}</a>
    </Link>
  ) : (
    <a href={href} target='_blank' rel='noopener noreferrer' className={'tuan'}>
      {children}
    </a>
  );
}
