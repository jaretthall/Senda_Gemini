import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, requireAuth, router]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user
  };
}

export function useRequireRole(allowedRoles: string[]) {
  const { session, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      if (!allowedRoles.includes(session.user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [session, status, allowedRoles, router]);

  return {
    session,
    status,
    hasAccess: session?.user?.role ? allowedRoles.includes(session.user.role) : false
  };
}