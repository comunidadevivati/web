import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { profileQueryOptions } from '@/features/profile/application/queries/profile.query';
import { getProfileNotice } from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Página do Perfil: carrega o cadastro da Pessoa e controla os modais de segurança.
export const useProfileViewModel = () => {
  const { data: session } = useQuery(authSessionQueryOptions);

  const { data: profile, error, isFetching, isPending, refetch } = useQuery(profileQueryOptions);

  const { t } = useTranslation('profile');

  const errorNotice = error && !profile ? getProfileNotice(error) : null;

  // Falha ao carregar é retorno de request: aparece em toast; a página mostra só o botão de repetir.
  useEffect(() => {
    if (errorNotice) {
      notify.error({
        title: t(`notices.${errorNotice}.title`),
        description: t(`notices.${errorNotice}.description`),
      });
    }
  }, [errorNotice, t]);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);

  // Nova chave a cada abertura: o modal começa sempre limpo.
  const [dialogKey, setDialogKey] = useState(0);

  const openChangePassword = () => {
    setDialogKey((key) => key + 1);

    setIsChangePasswordOpen(true);
  };

  const openChangeEmail = () => {
    setDialogKey((key) => key + 1);

    setIsChangeEmailOpen(true);
  };

  const retry = () => {
    void refetch();
  };

  return {
    accessEmail: session?.user.email ?? profile?.email ?? '',
    dialogKey,
    errorNotice,
    isChangeEmailOpen,
    isChangePasswordOpen,
    isLoading: isPending,
    isRetrying: isFetching,
    openChangeEmail,
    openChangePassword,
    profile,
    retry,
    setIsChangeEmailOpen,
    setIsChangePasswordOpen,
  };
};
