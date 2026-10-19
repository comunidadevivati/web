import { FormField, PhoneInput } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
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
import type { Member } from '@/features/members/domain/member';
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  getTodayIsoDate,
} from '@/features/members/presentation/models/members.model';
import { useMemberFormViewModel } from '@/features/members/presentation/view-models/member-form.view-model';
import { CircleAlertIcon, SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type MemberFormViewProps = {
  // Membro em edição; null registra um novo.
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Modal de registro ou edição dos dados pessoais do membro.
export const MemberFormView = ({ member, onOpenChange, open }: MemberFormViewProps) => {
  const {
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isEditing,
    isSubmitting,
    notice,
    noticeDetail,
    submit,
  } = useMemberFormViewModel({ member, onOpenChange });

  const { register } = form;

  const { t } = useTranslation('members');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-lg sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('memberForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? t('memberForm.editTitle') : t('memberForm.createTitle')}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? t('memberForm.editDescription', { name: member?.fullName ?? '' })
              : t('memberForm.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.fullName}
              id="member-full-name"
              label={t('fields.fullName')}
            >
              <Input
                id="member-full-name"
                aria-describedby={describedBy('member-full-name', fieldErrors.fullName)}
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-required
                autoCapitalize="words"
                autoComplete="off"
                maxLength={FULL_NAME_MAX_LENGTH}
                type="text"
                {...register('fullName')}
              />
            </FormField>

            <Box className="grid gap-4 sm:grid-cols-2">
              <FormField
                error={fieldErrors.birthDate}
                id="member-birth-date"
                label={t('fields.optional', { label: t('fields.birthDate') })}
              >
                <Input
                  id="member-birth-date"
                  aria-describedby={describedBy('member-birth-date', fieldErrors.birthDate)}
                  aria-invalid={Boolean(fieldErrors.birthDate)}
                  autoComplete="off"
                  max={getTodayIsoDate()}
                  min="1900-01-01"
                  type="date"
                  {...register('birthDate')}
                />
              </FormField>

              <FormField
                error={fieldErrors.phone}
                id="member-phone"
                label={t('fields.optional', { label: t('fields.phone') })}
              >
                <PhoneInput
                  id="member-phone"
                  aria-describedby={describedBy('member-phone', fieldErrors.phone)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  autoComplete="off"
                  placeholder={t('fields.phonePlaceholder')}
                  {...register('phone')}
                />
              </FormField>
            </Box>

            <FormField
              error={fieldErrors.email}
              id="member-email"
              label={t('fields.optional', { label: t('fields.email') })}
            >
              <Input
                id="member-email"
                aria-describedby={describedBy('member-email', fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                autoCapitalize="none"
                autoComplete="off"
                inputMode="email"
                maxLength={EMAIL_MAX_LENGTH}
                placeholder={t('fields.emailPlaceholder')}
                spellCheck={false}
                type="email"
                {...register('email')}
              />
            </FormField>
          </FieldGroup>

          {notice && (
            <Alert variant="destructive">
              <CircleAlertIcon />

              <AlertTitle>{t(`notices.${notice}.title`)}</AlertTitle>

              <AlertDescription>
                {noticeDetail ?? t(`notices.${notice}.description`)}
              </AlertDescription>
            </Alert>
          )}

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
                <SaveIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('memberForm.submitting') : t('memberForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
