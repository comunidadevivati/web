import { FormField, PasswordInput } from '@/components/molecules';
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
} from '@/components/ui';
import { EMAIL_MAX_LENGTH } from '@/features/profile/presentation/models/profile.model';
import { useChangeEmailViewModel } from '@/features/profile/presentation/view-models/change-email.view-model';
import { SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ChangeEmailViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal de troca do e-mail de acesso: novo e-mail e senha atual; a troca vale depois do link.
export const ChangeEmailView = ({ onOpenChange, open }: ChangeEmailViewProps) => {
  const { cancel, fieldErrors, handleOpenChange, isSubmitting, register, submit } =
    useChangeEmailViewModel({ onOpenChange });

  const { t } = useTranslation('profile');

  return (
    <Dialog open={open} onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-md sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('changeEmail.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('changeEmail.title')}
          </DialogTitle>

          <DialogDescription>{t('changeEmail.description')}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.newEmail}
              id="change-email-new"
              label={t('changeEmail.newEmail')}
            >
              <Input
                id="change-email-new"
                aria-describedby={fieldErrors.newEmail ? 'change-email-new-error' : undefined}
                aria-invalid={Boolean(fieldErrors.newEmail)}
                aria-required
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                maxLength={EMAIL_MAX_LENGTH}
                placeholder={t('changeEmail.newEmailPlaceholder')}
                spellCheck={false}
                type="email"
                {...register('newEmail')}
              />
            </FormField>

            <FormField
              error={fieldErrors.currentPassword}
              id="change-email-password"
              label={t('changeEmail.currentPassword')}
            >
              <PasswordInput
                id="change-email-password"
                aria-describedby={
                  fieldErrors.currentPassword ? 'change-email-password-error' : undefined
                }
                aria-invalid={Boolean(fieldErrors.currentPassword)}
                aria-required
                autoComplete="current-password"
                maxLength={1024}
                {...register('currentPassword')}
              />
            </FormField>
          </FieldGroup>

          <DialogFooter>
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={cancel}>
              {t('changeEmail.cancel')}
            </Button>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('changeEmail.submitting') : t('changeEmail.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
