import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { PreferencesControls } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Heading,
  Image,
  LoadingOverlay,
  Text,
} from '@/components/ui';
import { useLoginViewModel } from '@/features/auth/presentation/view-models/login.view-model';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, LogInIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoginView = () => {
  const { isLoginDisabled, isRedirecting, isRetrying, login, notice, retry } = useLoginViewModel();

  const { t } = useTranslation(['auth', 'common']);

  return (
    <>
      {isRedirecting && <LoadingOverlay />}

      <Box className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Box
          className="
            relative hidden overflow-hidden bg-brand-gradient-middle lg:flex lg:items-center
            lg:justify-center
          "
        >
          <Box
            className="
              absolute inset-0 bg-linear-to-br from-brand-gradient-start via-brand-gradient-middle
              to-brand-gradient-end
            "
          />

          <Box className="relative z-10 flex max-w-xl flex-col items-center gap-8 px-12 text-center">
            <Image
              alt={t('common:app.fullName')}
              className="w-full max-w-md object-contain"
              src={logoVivaWhite}
            />

            <Box className="h-px w-24 bg-brand-foreground/40" />

            <Text className="max-w-md text-base leading-7 text-brand-foreground/85">
              {t('login.tagline')}
            </Text>
          </Box>
        </Box>

        <Box
          className="
            relative flex min-h-dvh items-center justify-center bg-background px-4 pt-20 pb-10
            sm:px-10 lg:px-16
          "
        >
          <PreferencesControls className="absolute top-4 right-4 sm:right-6" tone="surface" />

          <Box className="w-full max-w-md rounded-2xl surface-card p-6 shadow-elevated-lg sm:p-8">
            <Box className="mb-10 flex flex-col items-center text-center">
              <Image
                alt=""
                aria-hidden="true"
                className="mb-6 size-20 object-contain"
                src={livingStoneGreen}
              />

              <Heading className="text-3xl font-semibold tracking-tight">
                {t('login.title')}
              </Heading>

              <Text className="mt-2 text-base">{t('login.subtitle')}</Text>
            </Box>

            <Box className="grid gap-5">
              {notice && (
                <Alert variant={notice === 'unavailable' ? 'destructive' : 'default'}>
                  <CircleAlertIcon />

                  <AlertTitle>{t(`login.notices.${notice}.title`)}</AlertTitle>

                  <AlertDescription>{t(`login.notices.${notice}.description`)}</AlertDescription>
                </Alert>
              )}

              {notice === 'unavailable' && (
                <Button
                  className="h-11 w-full"
                  disabled={isRetrying}
                  type="button"
                  variant="outline"
                  onClick={retry}
                >
                  <RefreshCwIcon
                    className={cn(isRetrying && 'animate-spin')}
                    data-icon="inline-start"
                  />
                  {t('login.retry')}
                </Button>
              )}

              <Button
                aria-busy={isRedirecting}
                autoFocus
                className="h-11 w-full"
                disabled={isLoginDisabled}
                type="button"
                onClick={login}
              >
                <LogInIcon data-icon="inline-start" />
                {isRedirecting ? t('login.redirecting') : t('login.submit')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
