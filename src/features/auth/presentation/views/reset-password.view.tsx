import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { FormField, PasswordInput, PasswordStrengthMeter } from '@/components/molecules';
import { PreferencesControls } from '@/components/organisms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  FieldGroup,
  Form,
  Heading,
  Image,
  LoadingOverlay,
  Subtitle,
  Text,
} from '@/components/ui';
import { useResetPasswordViewModel } from '@/features/auth/presentation/view-models/reset-password.view-model';
import { cn } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH } from '@/shared/validation/password-strength';
import { CircleAlertIcon, KeyRoundIcon, LogInIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ResetPasswordView = () => {
  const {
    fieldErrors,
    form,
    goToLogin,
    isLinkMissing,
    isSubmitDisabled,
    isSubmitting,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
  } = useResetPasswordViewModel();

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
              {t('resetPassword.tagline')}
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
                {t('resetPassword.title')}
              </Heading>

              <Subtitle className="mt-2">{t('resetPassword.description')}</Subtitle>
            </Box>

            {isLinkMissing ? (
              <Box className="grid gap-6">
                <Alert variant="destructive">
                  <CircleAlertIcon />

                  <AlertTitle>{t('resetPassword.notices.invalidLink.title')}</AlertTitle>

                  <AlertDescription>
                    {t('resetPassword.notices.invalidLink.description')}
                  </AlertDescription>
                </Alert>

                <Button className="h-11 w-full" type="button" onClick={goToLogin}>
                  <LogInIcon data-icon="inline-start" />
                  {t('resetPassword.backToLogin')}
                </Button>
              </Box>
            ) : (
              <Form className="grid gap-6" noValidate onSubmit={submit}>
                <FieldGroup className="gap-4">
                  <FormField
                    error={fieldErrors.password}
                    id="reset-password-new-password"
                    label={t('resetPassword.password')}
                  >
                    <PasswordInput
                      id="reset-password-new-password"
                      aria-describedby={cn(
                        'reset-password-strength',
                        fieldErrors.password && 'reset-password-new-password-error',
                      )}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-required
                      autoComplete="new-password"
                      autoFocus
                      maxLength={PASSWORD_MAX_LENGTH}
                      {...passwordRegistration}
                    />

                    <PasswordStrengthMeter
                      id="reset-password-strength"
                      requirements={passwordRequirements}
                      strength={passwordStrength}
                    />
                  </FormField>

                  <FormField
                    error={fieldErrors.confirmPassword}
                    id="reset-password-confirm-password"
                    label={t('resetPassword.confirmPassword')}
                  >
                    <PasswordInput
                      id="reset-password-confirm-password"
                      aria-describedby={
                        fieldErrors.confirmPassword
                          ? 'reset-password-confirm-password-error'
                          : undefined
                      }
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      aria-required
                      autoComplete="new-password"
                      maxLength={PASSWORD_MAX_LENGTH}
                      {...register('confirmPassword')}
                    />
                  </FormField>
                </FieldGroup>

                <Text className="sr-only" id="reset-password-submit-hint">
                  {t('resetPassword.submitHint')}
                </Text>

                <Button
                  aria-busy={isSubmitting}
                  aria-describedby={
                    isSubmitDisabled && !isSubmitting ? 'reset-password-submit-hint' : undefined
                  }
                  className="h-11 w-full"
                  disabled={isSubmitDisabled}
                  focusableWhenDisabled
                  type="submit"
                >
                  <KeyRoundIcon data-icon="inline-start" />
                  {isSubmitting ? t('resetPassword.submitting') : t('resetPassword.submit')}
                </Button>

                <Button
                  className="h-11 w-full"
                  disabled={isSubmitting}
                  type="button"
                  variant="outline"
                  onClick={goToLogin}
                >
                  <LogInIcon data-icon="inline-start" />
                  {t('resetPassword.backToLogin')}
                </Button>
              </Form>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
