import { authSessionQueryOptions } from '@/features/auth/application/queries/auth-session.query';
import { profileQueryOptions } from '@/features/profile/application/queries/profile.query';
import { removeAvatarUseCase } from '@/features/profile/application/use-cases/remove-avatar.use-case';
import { uploadAvatarUseCase } from '@/features/profile/application/use-cases/upload-avatar.use-case';
import {
  AVATAR_CONTENT_TYPES,
  AvatarTransferError,
  ProfileConflictError,
} from '@/features/profile/domain/profile';
import {
  getAvatarFileIssue,
  getProfileNotice,
} from '@/features/profile/presentation/models/profile.model';
import { notify } from '@/shared/feedback/notify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

// Foto do perfil: envio direto ao bucket e remoção. As falhas aparecem em toast.
export const useProfileAvatarViewModel = () => {
  const { t } = useTranslation('profile');

  const queryClient = useQueryClient();

  const { data: session } = useQuery(authSessionQueryOptions);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showError = (error: Error) => {
    // A recusa da foto (conteúdo inválido, envio perdido) vem como conflito com a explicação.
    if (error instanceof ProfileConflictError && error.detail) {
      notify.error({ title: t('notices.avatarType.title'), description: error.detail });

      return;
    }

    const notice =
      error instanceof AvatarTransferError ? 'avatarTransfer' : getProfileNotice(error);

    notify.error({
      title: t(`notices.${notice}.title`),
      description: t(`notices.${notice}.description`),
    });
  };

  const upload = useMutation({
    mutationFn: ({ csrfToken, file }: { csrfToken: string; file: File }) =>
      uploadAvatarUseCase(csrfToken, file),
    onSuccess: (saved) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, saved);

      notify.success({
        title: t('success.avatarSaved.title'),
        description: t('success.avatarSaved.description'),
      });
    },
    onError: showError,
  });

  const remove = useMutation({
    mutationFn: (csrfToken: string) => removeAvatarUseCase(csrfToken),
    onSuccess: (saved) => {
      queryClient.setQueryData(profileQueryOptions.queryKey, saved);

      notify.success({
        title: t('success.avatarRemoved.title'),
        description: t('success.avatarRemoved.description'),
      });
    },
    onError: showError,
  });

  const isBusy = upload.isPending || remove.isPending;

  const chooseFile = () => {
    if (!isBusy) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Permite escolher o mesmo arquivo de novo depois de uma falha.
    event.target.value = '';

    if (!file || !session || isBusy) {
      return;
    }

    const issue = getAvatarFileIssue(file);

    if (issue) {
      notify.error({
        title: t(`notices.${issue}.title`),
        description: t(`notices.${issue}.description`),
      });

      return;
    }

    upload.mutate({ csrfToken: session.csrfToken, file });
  };

  const removeAvatar = () => {
    if (session && !isBusy) {
      remove.mutate(session.csrfToken);
    }
  };

  return {
    accept: AVATAR_CONTENT_TYPES.join(','),
    chooseFile,
    fileInputRef,
    handleFileChange,
    isRemoving: remove.isPending,
    isUploading: upload.isPending,
    removeAvatar,
  };
};
