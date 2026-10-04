import type { SidebarMode } from '@/app/layouts/authenticated/authenticated-layout.model';
import {
  getStoredAuthUser,
  removeStoredAuthUser,
} from '@/features/auth/infrastructure/storage/auth-user.storage';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const useAuthenticatedLayoutViewModel = () => {
  const navigate = useNavigate();

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('expanded');

  const [lastVisibleSidebarMode, setLastVisibleSidebarMode] =
    useState<Exclude<SidebarMode, 'hidden'>>('expanded');

  const userEmail = getStoredAuthUser()?.email ?? '';

  const toggleSidebarVisibility = () => {
    if (sidebarMode === 'hidden') {
      setSidebarMode(lastVisibleSidebarMode);

      return;
    }

    setLastVisibleSidebarMode(sidebarMode);

    setSidebarMode('hidden');
  };

  const toggleSidebarCollapse = () => {
    const nextMode = sidebarMode === 'expanded' ? 'collapsed' : 'expanded';

    setSidebarMode(nextMode);

    setLastVisibleSidebarMode(nextMode);
  };

  const logout = () => {
    removeStoredAuthUser();

    void navigate({
      to: '/login',
      replace: true,
    });
  };

  return {
    logout,
    sidebarMode,
    toggleSidebarCollapse,
    toggleSidebarVisibility,
    userEmail,
  };
};
