'use client';

import { ThemeProvider } from '@/lib/components/ThemeProvider';
import { ConfirmProvider } from '@/lib/components/ConfirmProvider';
import AuthGuard from '@/lib/components/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ConfirmProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </ConfirmProvider>
    </ThemeProvider>
  );
}