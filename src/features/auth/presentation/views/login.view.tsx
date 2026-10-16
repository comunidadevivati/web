import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { FormField, PasswordInput } from '@/components/molecules';
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
  LoadingOverlay,
  Subtitle,
  Text,
} from '@/components/ui';
import { useLoginViewModel } from '@/features/auth/presentation/view-models/login.view-model';
import { RegisterView } from '@/features/auth/presentation/views/register.view';
import { CircleAlertIcon, CircleCheckIcon, LogInIcon, UserPlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LoginView = () => {
  const {
    form,
    fieldErrors,
    handleRegistered,
    isInfoNotice,
    isRegisterOpen,
    isSubmitting,
    notice,
    openRegister,
    setIsRegisterOpen,
    submit,
  } = useLoginViewModel();

  const { register } = form;

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

              <Subtitle className="mt-2">{t('login.subtitle')}</Subtitle>
            </Box>

            <Form className="grid gap-5" noValidate onSubmit={submit}>
              {notice && (
                <Alert variant={isInfoNotice ? 'default' : 'destructive'}>
                  {notice === 'registered' ? <CircleCheckIcon /> : <CircleAlertIcon />}

                  <AlertTitle>{t(`login.notices.${notice}.title`)}</AlertTitle>

                  <AlertDescription>{t(`login.notices.${notice}.description`)}</AlertDescription>
                </Alert>
              )}

              <FormField error={fieldErrors.email} id="login-email" label={t('login.email')}>
                <Input
                  id="login-email"
                  aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-required
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  inputMode="email"
                  placeholder={t('login.emailPlaceholder')}
                  spellCheck={false}
                  type="email"
                  {...register('email')}
                />
              </FormField>

              <FormField
                error={fieldErrors.password}
                id="login-password"
                label={t('login.password')}
              >
                <PasswordInput
                  id="login-password"
                  aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-required
                  autoComplete="current-password"
                  {...register('password')}
                />
              </FormField>

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

            <Box
              className="
                mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center
              "
            >
              <Text>{t('login.noAccount')}</Text>

              <Button
                className="h-10 px-2 text-foreground underline underline-offset-4"
                disabled={isSubmitting}
                type="button"
                variant="link"
                onClick={openRegister}
              >
                <UserPlusIcon data-icon="inline-start" />
                {t('login.createAccount')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <RegisterView
        open={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onRegistered={handleRegistered}
      />
    </>
  );
};
