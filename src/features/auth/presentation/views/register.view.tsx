import {
  FormField,
  PasswordInput,
  PasswordStrengthMeter,
  PhoneInput,
} from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Form,
  Input,
  Spinner,
  Text,
} from '@/components/ui';
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
} from '@/features/auth/presentation/models/register.model';
import { useRegisterViewModel } from '@/features/auth/presentation/view-models/register.view-model';
import { cn } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH } from '@/shared/validation/password-strength';
import { CircleAlertIcon, UserPlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RegisterViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistered: (email: string) => void;
};

// Modal de novo cadastro, aberto a partir do login.
export const RegisterView = ({ onOpenChange, onRegistered, open }: RegisterViewProps) => {
  const {
    form,
    fieldErrors,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitDisabled,
    isSubmitting,
    notice,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
  } = useRegisterViewModel({ onOpenChange, onRegistered });

  const { register } = form;

  const { t } = useTranslation('auth');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('register.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('register.title')}
          </DialogTitle>

          <DialogDescription>{t('register.description')}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.fullName}
              id="register-full-name"
              label={t('register.fullName')}
            >
              <Input
                id="register-full-name"
                aria-describedby={fieldErrors.fullName ? 'register-full-name-error' : undefined}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-required
                autoCapitalize="words"
                autoComplete="name"
                maxLength={FULL_NAME_MAX_LENGTH}
                placeholder={t('register.fullNamePlaceholder')}
                type="text"
                {...register('fullName')}
              />
            </FormField>

            <FormField error={fieldErrors.phone} id="register-phone" label={t('register.phone')}>
              <PhoneInput
                id="register-phone"
                aria-describedby={fieldErrors.phone ? 'register-phone-error' : undefined}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-required
                placeholder={t('register.phonePlaceholder')}
                {...register('phone')}
              />
            </FormField>

            <FormField error={fieldErrors.email} id="register-email" label={t('register.email')}>
              <Input
                id="register-email"
                aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-required
                autoCapitalize="none"
                autoComplete="email"
                inputMode="email"
                maxLength={EMAIL_MAX_LENGTH}
                placeholder={t('register.emailPlaceholder')}
                spellCheck={false}
                type="email"
                {...register('email')}
              />
            </FormField>

            <FormField
              error={fieldErrors.password}
              id="register-password"
              label={t('register.password')}
            >
              <PasswordInput
                id="register-password"
                aria-describedby={cn(
                  'register-password-strength',
                  fieldErrors.password && 'register-password-error',
                )}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...passwordRegistration}
              />

              <PasswordStrengthMeter
                id="register-password-strength"
                requirements={passwordRequirements}
                strength={passwordStrength}
              />
            </FormField>

            <FormField
              error={fieldErrors.confirmPassword}
              id="register-confirm-password"
              label={t('register.confirmPassword')}
            >
              <PasswordInput
                id="register-confirm-password"
                aria-describedby={
                  fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined
                }
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...register('confirmPassword')}
              />
            </FormField>
          </FieldGroup>

          {notice && (
            <Alert variant="destructive">
              <CircleAlertIcon />

              <AlertTitle>{t(`register.notices.${notice}.title`)}</AlertTitle>

              <AlertDescription>{t(`register.notices.${notice}.description`)}</AlertDescription>
            </Alert>
          )}

          <Text className="sr-only" id="register-submit-hint">
            {t('register.submitHint')}
          </Text>

          <DialogFooter>
            <Button
              aria-busy={isSubmitting}
              aria-describedby={
                isSubmitDisabled && !isSubmitting ? 'register-submit-hint' : undefined
              }
              className="h-11 w-full sm:w-auto sm:px-5"
              disabled={isSubmitDisabled}
              focusableWhenDisabled
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <UserPlusIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('register.submitting') : t('register.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
