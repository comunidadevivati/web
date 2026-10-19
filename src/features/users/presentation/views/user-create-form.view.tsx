import {
  FormField,
  PasswordInput,
  PasswordStrengthMeter,
  PhoneInput,
} from '@/components/molecules';
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
  Input,
  Spinner,
  Text,
} from '@/components/ui';
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
} from '@/features/auth/presentation/models/register.model';
import { useUserCreateFormViewModel } from '@/features/users/presentation/view-models/user-create-form.view-model';
import { cn } from '@/lib/utils';
import { PASSWORD_MAX_LENGTH } from '@/shared/validation/password-strength';
import { UserPlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UserCreateFormViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal "Novo usuário": os mesmos campos, regras e textos do cadastro da tela de login.
export const UserCreateFormView = ({ onOpenChange, open }: UserCreateFormViewProps) => {
  const {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitDisabled,
    isSubmitting,
    passwordRegistration,
    passwordRequirements,
    passwordStrength,
    submit,
  } = useUserCreateFormViewModel({ onOpenChange });

  const { register } = form;

  const { t: tAuth } = useTranslation('auth');

  const { t } = useTranslation('users');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('createForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('createForm.title')}
          </DialogTitle>

          <DialogDescription>{t('createForm.description')}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.fullName}
              id="user-full-name"
              label={tAuth('register.fullName')}
            >
              <Input
                id="user-full-name"
                aria-describedby={fieldErrors.fullName ? 'user-full-name-error' : undefined}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-required
                autoCapitalize="words"
                autoComplete="off"
                maxLength={FULL_NAME_MAX_LENGTH}
                placeholder={tAuth('register.fullNamePlaceholder')}
                type="text"
                {...register('fullName')}
              />
            </FormField>

            <FormField error={fieldErrors.phone} id="user-phone" label={tAuth('register.phone')}>
              <PhoneInput
                id="user-phone"
                aria-describedby={fieldErrors.phone ? 'user-phone-error' : undefined}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-required
                autoComplete="off"
                placeholder={tAuth('register.phonePlaceholder')}
                {...register('phone')}
              />
            </FormField>

            <FormField error={fieldErrors.email} id="user-email" label={tAuth('register.email')}>
              <Input
                id="user-email"
                aria-describedby={fieldErrors.email ? 'user-email-error' : undefined}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-required
                autoCapitalize="none"
                autoComplete="off"
                inputMode="email"
                maxLength={EMAIL_MAX_LENGTH}
                placeholder={tAuth('register.emailPlaceholder')}
                spellCheck={false}
                type="email"
                {...register('email')}
              />
            </FormField>

            <FormField
              error={fieldErrors.password}
              id="user-password"
              label={tAuth('register.password')}
            >
              <PasswordInput
                id="user-password"
                aria-describedby={cn(
                  'user-password-strength',
                  fieldErrors.password && 'user-password-error',
                )}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...passwordRegistration}
              />

              <PasswordStrengthMeter
                id="user-password-strength"
                requirements={passwordRequirements}
                strength={passwordStrength}
              />
            </FormField>

            <FormField
              error={fieldErrors.confirmPassword}
              id="user-confirm-password"
              label={tAuth('register.confirmPassword')}
            >
              <PasswordInput
                id="user-confirm-password"
                aria-describedby={
                  fieldErrors.confirmPassword ? 'user-confirm-password-error' : undefined
                }
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-required
                autoComplete="new-password"
                maxLength={PASSWORD_MAX_LENGTH}
                {...register('confirmPassword')}
              />
            </FormField>
          </FieldGroup>

          <Text className="sr-only" id="user-create-submit-hint">
            {tAuth('register.submitHint')}
          </Text>

          <DialogFooter>
            <Button
              aria-busy={isSubmitting}
              aria-describedby={
                isSubmitDisabled && !isSubmitting ? 'user-create-submit-hint' : undefined
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
              {isSubmitting ? t('createForm.submitting') : t('createForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
