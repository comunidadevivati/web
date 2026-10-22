import { CardSectionHeader } from '@/components/molecules';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Heading,
  Input,
  Label,
  Spinner,
  Text,
} from '@/components/ui';
import type { Profile } from '@/features/profile/domain/profile';
import { useProfileAvatarViewModel } from '@/features/profile/presentation/view-models/profile-avatar.view-model';
import { useProfileSubscriptionsViewModel } from '@/features/profile/presentation/view-models/profile-subscriptions.view-model';
import { useProfileViewModel } from '@/features/profile/presentation/view-models/profile.view-model';
import { ChangeEmailView } from '@/features/profile/presentation/views/change-email.view';
import { ChangePasswordView } from '@/features/profile/presentation/views/change-password.view';
import { ProfileFormView } from '@/features/profile/presentation/views/profile-form.view';
import { cn } from '@/lib/utils';
import {
  BellIcon,
  CameraIcon,
  KeyRoundIcon,
  MailIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Iniciais do nome (ex.: Thiago Figueiredo → TF), exibidas sem foto.
const getInitials = (fullName: string) => {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  const initials =
    words.length >= 2
      ? `${words[0]?.charAt(0) ?? ''}${words.at(-1)?.charAt(0) ?? ''}`
      : fullName.slice(0, 2);

  return initials.toLocaleUpperCase() || '?';
};

type ProfileAvatarCardProps = {
  profile: Profile;
};

const ProfileAvatarCard = ({ profile }: ProfileAvatarCardProps) => {
  const {
    accept,
    chooseFile,
    fileInputRef,
    handleFileChange,
    isRemoving,
    isUploading,
    removeAvatar,
  } = useProfileAvatarViewModel();

  const { t } = useTranslation('profile');

  const isBusy = isUploading || isRemoving;

  return (
    <Card className="relative overflow-hidden border-border surface-card shadow-sm">
      <Box aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-primary" />

      <CardContent className="flex flex-col items-center gap-4 pt-4 text-center">
        <Box className="relative">
          <Avatar className="size-32 after:border-primary/30">
            {profile.avatarUrl && (
              <AvatarImage
                alt={t('avatar.alt', { name: profile.fullName })}
                src={profile.avatarUrl}
              />
            )}

            <AvatarFallback className="bg-primary/15 text-3xl font-semibold text-primary-strong">
              {getInitials(profile.fullName)}
            </AvatarFallback>
          </Avatar>

          {isBusy && (
            <Box
              className="
                absolute inset-0 flex items-center justify-center rounded-full bg-background/70
              "
              role="status"
            >
              <Spinner className="size-8 text-primary-strong" />
            </Box>
          )}
        </Box>

        <Box className="grid min-w-0 gap-1">
          <Heading className="text-lg font-semibold tracking-tight break-words" level={2}>
            {profile.fullName}
          </Heading>

          <Text className="text-sm break-all text-muted-foreground">{profile.email}</Text>
        </Box>

        <Input
          ref={fileInputRef}
          accept={accept}
          aria-hidden="true"
          className="hidden"
          tabIndex={-1}
          type="file"
          onChange={handleFileChange}
        />

        <Box className="flex flex-wrap justify-center gap-2">
          <Button disabled={isBusy} size="sm" type="button" onClick={chooseFile}>
            {isUploading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <CameraIcon data-icon="inline-start" />
            )}
            {isUploading
              ? t('avatar.uploading')
              : profile.avatarUrl
                ? t('avatar.change')
                : t('avatar.add')}
          </Button>

          {profile.avatarUrl && (
            <Button
              disabled={isBusy}
              size="sm"
              type="button"
              variant="outline"
              onClick={removeAvatar}
            >
              <Trash2Icon data-icon="inline-start" />
              {t('avatar.remove')}
            </Button>
          )}
        </Box>

        <Text className="text-xs text-muted-foreground">{t('avatar.hint')}</Text>
      </CardContent>
    </Card>
  );
};

type ProfileSecurityCardProps = {
  accessEmail: string;
  onChangeEmail: () => void;
  onChangePassword: () => void;
};

const ProfileSecurityCard = ({
  accessEmail,
  onChangeEmail,
  onChangePassword,
}: ProfileSecurityCardProps) => {
  const { t } = useTranslation('profile');

  return (
    <Card className="border-border surface-card shadow-sm">
      <CardSectionHeader
        description={t('sections.security.description')}
        icon={ShieldCheckIcon}
        title={t('sections.security.title')}
      />

      <CardContent className="grid gap-5">
        <Box className="grid gap-2">
          <Text className="text-sm font-medium text-foreground">{t('security.accessEmail')}</Text>

          <Text className="text-sm break-all text-muted-foreground">{accessEmail}</Text>

          <Button
            className="w-fit"
            size="sm"
            type="button"
            variant="outline"
            onClick={onChangeEmail}
          >
            <MailIcon data-icon="inline-start" />
            {t('security.changeEmail')}
          </Button>
        </Box>

        <Box className="grid gap-2">
          <Text className="text-sm font-medium text-foreground">{t('security.password')}</Text>

          <Text className="text-sm text-muted-foreground">{t('security.passwordHint')}</Text>

          <Button
            className="w-fit"
            size="sm"
            type="button"
            variant="outline"
            onClick={onChangePassword}
          >
            <KeyRoundIcon data-icon="inline-start" />
            {t('security.changePassword')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProfileSubscriptionsCard = () => {
  const { isDisabled, news, toggleNews } = useProfileSubscriptionsViewModel();

  const { t } = useTranslation('profile');

  return (
    <Card className="border-border surface-card shadow-sm">
      <CardSectionHeader
        description={t('sections.subscriptions.description')}
        icon={BellIcon}
        title={t('sections.subscriptions.title')}
      />

      <CardContent>
        <Label className="items-start gap-3 text-sm leading-snug" htmlFor="profile-news">
          <Checkbox
            aria-describedby="profile-news-hint"
            checked={news}
            className="mt-0.5"
            disabled={isDisabled}
            id="profile-news"
            onChange={(event) => toggleNews(event.target.checked)}
          />

          <Box className="grid gap-1">
            <Text className="font-medium text-foreground">{t('subscriptions.news')}</Text>

            <Text className="text-xs text-muted-foreground" id="profile-news-hint">
              {t('subscriptions.newsHint')}
            </Text>
          </Box>
        </Label>
      </CardContent>
    </Card>
  );
};

// Perfil da pessoa logada (somente membros): foto, cadastro, segurança e inscrições.
export const ProfileView = () => {
  const {
    accessEmail,
    dialogKey,
    errorNotice,
    isChangeEmailOpen,
    isChangePasswordOpen,
    isLoading,
    isRetrying,
    openChangeEmail,
    openChangePassword,
    profile,
    retry,
    setIsChangeEmailOpen,
    setIsChangePasswordOpen,
  } = useProfileViewModel();

  const { t } = useTranslation('profile');

  return (
    <Box className="grid gap-8">
      <Box>
        <Heading className="text-2xl font-semibold tracking-tight text-foreground">
          {t('page.title')}
        </Heading>

        <Text className="mt-1 text-muted-foreground">{t('page.subtitle')}</Text>
      </Box>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && errorNotice !== 'accessDenied' && (
        <Box className="flex min-h-64 items-center justify-center">
          <Button disabled={isRetrying} type="button" variant="outline" onClick={retry}>
            <RefreshCwIcon className={cn(isRetrying && 'animate-spin')} data-icon="inline-start" />
            {t('actions.retry')}
          </Button>
        </Box>
      )}

      {profile && (
        <Box className="grid items-start gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <Box className="grid gap-6 lg:sticky lg:top-0">
            <ProfileAvatarCard profile={profile} />

            <ProfileSecurityCard
              accessEmail={accessEmail}
              onChangeEmail={openChangeEmail}
              onChangePassword={openChangePassword}
            />

            <ProfileSubscriptionsCard />
          </Box>

          <ProfileFormView profile={profile} />
        </Box>
      )}

      <ChangePasswordView
        key={`password-${dialogKey}`}
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />

      <ChangeEmailView
        key={`email-${dialogKey}`}
        open={isChangeEmailOpen}
        onOpenChange={setIsChangeEmailOpen}
      />
    </Box>
  );
};
