import { FormField, PasswordInput, PasswordStrengthMeter } from '@/components/molecules';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Form,
  Spinner,
} from '@/components/ui';
import { useChangePasswordViewModel } from '@/features/profile/presentation/view-models/change-password.view-model';
import { cn } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH } from '@/shared/validation/password-strength';
import { KeyRoundIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ChangePasswordViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal de troca de senha: senha atual, nova senha (com medidor de força) e confirmação.
export const ChangePasswordView = ({ onOpenChange, open }: ChangePasswordViewProps) => {
  const {
    cancel,
    fieldErrors,
    handleOpenChange,
    isSubmitting,
    passwordRequirements,
    passwordStrength,
    register,
    submit,
  } = useChangePasswordViewModel({ onOpenChange });

  const { t } = useTranslation('profile');

  return (
    <Dialog open={open} onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-md sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('changePassword.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('changePassword.title')}
          </DialogTitle>

          <DialogDescription>{t('changePassword.description')}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.currentPassword}
              id="change-password-current"
              label={t('changePassword.currentPassword')}
            >
              <PasswordInput
                id="change-password-current"
                aria-describedby={
                  fieldErrors.currentPassword ? 'change-password-current-error' : undefined
                }
                aria-invalid={Boolean(fieldErrors.currentPassword)}
                aria-required
                autoComplete="current-password"
                autoFocus
                maxLength={1024}
                {...register('currentPassword')}
              />
            </FormField>

            <FormField
              error={fieldErrors.newPassword}
              id="change-password-new"
              label={t('changePassword.newPassword')}
            >
              <PasswordInput
                id="change-password-new"
                aria-describedby={cn(
                  'change-password-strength',
                  fieldErrors.newPassword && 'change-password-new-error',
                )}
                aria-invalid={Boolean(fieldErrors.newPassword)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...register('newPassword')}
              />

              <PasswordStrengthMeter
                id="change-password-strength"
                requirements={passwordRequirements}
                strength={passwordStrength}
              />
            </FormField>

            <FormField
              error={fieldErrors.confirmPassword}
              id="change-password-confirm"
              label={t('changePassword.confirmPassword')}
            >
              <PasswordInput
                id="change-password-confirm"
                aria-describedby={
                  fieldErrors.confirmPassword ? 'change-password-confirm-error' : undefined
                }
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...register('confirmPassword')}
              />
            </FormField>
          </FieldGroup>

          <DialogFooter>
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={cancel}>
              {t('changePassword.cancel')}
            </Button>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <KeyRoundIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('changePassword.submitting') : t('changePassword.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
