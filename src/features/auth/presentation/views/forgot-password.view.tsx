import { FormField } from '@/components/molecules';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  Input,
  Spinner,
} from '@/components/ui';
import { EMAIL_MAX_LENGTH } from '@/features/auth/presentation/models/register.model';
import { useForgotPasswordViewModel } from '@/features/auth/presentation/view-models/forgot-password.view-model';
import { MailCheckIcon, SendIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ForgotPasswordViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal de recuperação de senha, aberto a partir do login.
export const ForgotPasswordView = ({ onOpenChange, open }: ForgotPasswordViewProps) => {
  const {
    emailError,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSent,
    isSubmitting,
    sentEmail,
    submit,
    successTitle,
  } = useForgotPasswordViewModel({ onOpenChange });

  const { register } = form;

  const { t } = useTranslation('auth');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-md sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('forgotPassword.close')}
      >
        {isSent ? (
          // Recebe o foco ao trocar de conteúdo (o botão "Enviar" deixa de existir) e é anunciado
          // pelo leitor de tela.
          <Box
            autoFocus
            className="flex flex-col items-center gap-4 px-6 py-2 text-center outline-none"
            role="status"
            tabIndex={-1}
          >
            <Box className="flex size-14 items-center justify-center rounded-full bg-success/15">
              <MailCheckIcon aria-hidden="true" className="size-7 text-success-strong" />
            </Box>

            <DialogHeader className="items-center">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {successTitle}
              </DialogTitle>

              <DialogDescription>
                {t('forgotPassword.success.description', { email: sentEmail })}
              </DialogDescription>
            </DialogHeader>
          </Box>
        ) : (
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {t('forgotPassword.title')}
              </DialogTitle>

              <DialogDescription>{t('forgotPassword.description')}</DialogDescription>
            </DialogHeader>

            <Form className="grid gap-6" noValidate onSubmit={submit}>
              <FormField
                error={emailError}
                id="forgot-password-email"
                label={t('forgotPassword.email')}
              >
                <Input
                  id="forgot-password-email"
                  aria-describedby={emailError ? 'forgot-password-email-error' : undefined}
                  aria-invalid={Boolean(emailError)}
                  aria-required
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                  inputMode="email"
                  maxLength={EMAIL_MAX_LENGTH}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  spellCheck={false}
                  type="email"
                  {...register('email')}
                />
              </FormField>

              <DialogFooter>
                <Button
                  aria-busy={isSubmitting}
                  className="h-11 w-full sm:w-auto sm:px-5"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <SendIcon data-icon="inline-start" />
                  )}
                  {isSubmitting ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
                </Button>
              </DialogFooter>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
