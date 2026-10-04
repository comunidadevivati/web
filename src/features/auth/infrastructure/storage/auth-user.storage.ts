import type { AuthUser } from '@/features/auth/domain/auth-user';

const AUTH_USER_KEY = '@comunidade-viva:web:auth:user';

export const getStoredAuthUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(storedUser);

    if (
      typeof user === 'object' &&
      user !== null &&
      'email' in user &&
      typeof user.email === 'string'
    ) {
      return {
        email: user.email,
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const storeAuthUser = (user: AuthUser) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const removeStoredAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};
