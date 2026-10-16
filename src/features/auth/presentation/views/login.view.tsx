import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { PreferencesControls } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Form,
  Heading,
  Image,
  Input,
  Label,
  LoadingOverlay,
  Text,
} from '@/components/ui';
import { useLoginViewModel } from '@/features/auth/presentation/view-models/login.view-model';
import { CircleAlertIcon, LogInIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoginView = () => {
  const { form, getFieldError, isSubmitting, notice, submit } = useLoginViewModel();

  const {
    formState: { errors },
    register,
  } = form;

  const { t } = useTranslation(['auth', 'common']);

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

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
            <Box className="mb-8 flex flex-col items-center text-center">
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

            <Form className="grid gap-5" noValidate onSubmit={submit}>
              {notice && (
                <Alert variant={notice === 'expired' ? 'default' : 'destructive'}>
                  <CircleAlertIcon />

                  <AlertTitle>{t(`login.notices.${notice}.title`)}</AlertTitle>

                  <AlertDescription>{t(`login.notices.${notice}.description`)}</AlertDescription>
                </Alert>
              )}

              <Box className="grid gap-2">
                <Label htmlFor="login-email">{t('login.email')}</Label>

                <Input
                  id="login-email"
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  autoFocus
                  className="h-11"
                  inputMode="email"
                  placeholder={t('login.emailPlaceholder')}
                  type="email"
                  {...register('email')}
                />

                {errors.email?.message && (
                  <Text className="text-destructive" role="alert">
                    {getFieldError(errors.email.message)}
                  </Text>
                )}
              </Box>

              <Box className="grid gap-2">
                <Label htmlFor="login-password">{t('login.password')}</Label>

                <Input
                  id="login-password"
                  aria-invalid={Boolean(errors.password)}
                  autoComplete="current-password"
                  className="h-11"
                  type="password"
                  {...register('password')}
                />

                {errors.password?.message && (
                  <Text className="text-destructive" role="alert">
                    {getFieldError(errors.password.message)}
                  </Text>
                )}
              </Box>

              <Button
                aria-busy={isSubmitting}
                className="mt-1 h-11 w-full"
                disabled={isSubmitting}
                type="submit"
              >
                <LogInIcon data-icon="inline-start" />
                {isSubmitting ? t('login.submitting') : t('login.submit')}
              </Button>
            </Form>
          </Box>
        </Box>
      </Box>
    </>
  );
};
