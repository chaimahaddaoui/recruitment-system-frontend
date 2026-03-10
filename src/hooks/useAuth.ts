'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export function useRequireAuth(allowedRoles?: string[]) {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [router, allowedRoles]);
}