import { FormField, PhoneInput } from '@/components/molecules';
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
} from '@/components/ui';
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
} from '@/features/auth/presentation/models/register.model';
import type { UserAccount } from '@/features/users/domain/user';
import { useUserEditFormViewModel } from '@/features/users/presentation/view-models/user-edit-form.view-model';
import { MailWarningIcon, SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type UserEditFormViewProps = {
  user: UserAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal de edição de nome, telefone e e-mail. A senha não é alterada aqui (recuperação de senha).
export const UserEditFormView = ({ onOpenChange, open, user }: UserEditFormViewProps) => {
  const {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isChangingEmail,
    isSubmitDisabled,
    isSubmitting,
    submit,
  } = useUserEditFormViewModel({ onOpenChange, user });

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
        closeLabel={t('editForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('editForm.title')}
          </DialogTitle>

          <DialogDescription>{t('editForm.description', { name: user.name })}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.fullName}
              id="user-edit-full-name"
              label={tAuth('register.fullName')}
            >
              <Input
                id="user-edit-full-name"
                aria-describedby={fieldErrors.fullName ? 'user-edit-full-name-error' : undefined}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-required
                autoCapitalize="words"
                autoComplete="off"
                maxLength={FULL_NAME_MAX_LENGTH}
                type="text"
                {...register('fullName')}
              />
            </FormField>

            <FormField
              error={fieldErrors.phone}
              id="user-edit-phone"
              label={tAuth('register.phone')}
            >
              <PhoneInput
                id="user-edit-phone"
                aria-describedby={fieldErrors.phone ? 'user-edit-phone-error' : undefined}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-required
                autoComplete="off"
                placeholder={tAuth('register.phonePlaceholder')}
                {...register('phone')}
              />
            </FormField>

            <FormField
              error={fieldErrors.email}
              id="user-edit-email"
              label={tAuth('register.email')}
            >
              <Input
                id="user-edit-email"
                aria-describedby={fieldErrors.email ? 'user-edit-email-error' : undefined}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-required
                autoCapitalize="none"
                autoComplete="off"
                inputMode="email"
                maxLength={EMAIL_MAX_LENGTH}
                spellCheck={false}
                type="email"
                {...register('email')}
              />
            </FormField>
          </FieldGroup>

          {isChangingEmail && (
            <Alert>
              <MailWarningIcon />

              <AlertTitle>{t('editForm.emailAlertTitle')}</AlertTitle>

              <AlertDescription>{t('editForm.emailHint')}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              aria-busy={isSubmitting}
              className="h-11 w-full sm:w-auto sm:px-5"
              disabled={isSubmitDisabled}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SaveIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('editForm.submitting') : t('editForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
