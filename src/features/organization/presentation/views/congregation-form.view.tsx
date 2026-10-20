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
  Separator,
  Spinner,
  Subtitle,
} from '@/components/ui';
import type { Congregation } from '@/features/organization/domain/organization';
import { AddressFields } from '@/features/organization/presentation/components/address-fields';
import { MaskedInput } from '@/features/organization/presentation/components/masked-input';
import {
  CODE_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from '@/features/organization/presentation/models/organization.model';
import { useCongregationFormViewModel } from '@/features/organization/presentation/view-models/congregation-form.view-model';
import { cn } from '@/lib/utils';
import { formatCnpj } from '@/shared/validation/brazilian-address';
import { CircleAlertIcon, SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type CongregationFormViewProps = {
  // Congregação em edição; null registra uma nova.
  congregation: Congregation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Modal de registro ou edição de uma congregação.
export const CongregationFormView = ({
  congregation,
  onOpenChange,
  open,
}: CongregationFormViewProps) => {
  const {
    addressFields,
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isEditing,
    isSubmitting,
    notice,
    noticeDetail,
    submit,
  } = useCongregationFormViewModel({ congregation, onOpenChange });

  const { register } = form;

  const { t } = useTranslation('organization');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-5 sm:max-w-2xl sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('congregationForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? t('congregationForm.editTitle') : t('congregationForm.createTitle')}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? t('congregationForm.editDescription', { name: congregation?.name ?? '' })
              : t('congregationForm.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <Box className="grid gap-4 sm:grid-cols-3">
              <FormField
                description={isEditing ? undefined : t('fields.codeHint')}
                error={fieldErrors.code}
                id="congregation-code"
                label={t('fields.code')}
              >
                <Input
                  id="congregation-code"
                  aria-describedby={
                    cn(
                      !isEditing && 'congregation-code-description',
                      fieldErrors.code && 'congregation-code-error',
                    ) || undefined
                  }
                  aria-invalid={Boolean(fieldErrors.code)}
                  aria-required
                  autoCapitalize="characters"
                  className="uppercase"
                  maxLength={CODE_MAX_LENGTH}
                  readOnly={isEditing}
                  spellCheck={false}
                  type="text"
                  {...register('code')}
                />
              </FormField>

              <FormField
                className="sm:col-span-2"
                error={fieldErrors.name}
                id="congregation-name"
                label={t('fields.name')}
              >
                <Input
                  id="congregation-name"
                  aria-describedby={describedBy('congregation-name', fieldErrors.name)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-required
                  maxLength={NAME_MAX_LENGTH}
                  type="text"
                  {...register('name')}
                />
              </FormField>
            </Box>

            <Box className="grid gap-4 sm:grid-cols-2">
              <FormField
                error={fieldErrors.cnpj}
                id="congregation-cnpj"
                label={t('fields.optional', { label: t('fields.cnpj') })}
              >
                <MaskedInput
                  id="congregation-cnpj"
                  aria-describedby={describedBy('congregation-cnpj', fieldErrors.cnpj)}
                  aria-invalid={Boolean(fieldErrors.cnpj)}
                  format={formatCnpj}
                  maxLength={18}
                  placeholder={t('fields.cnpjPlaceholder')}
                  {...register('cnpj')}
                />
              </FormField>

              <FormField
                error={fieldErrors.phone}
                id="congregation-phone"
                label={t('fields.optional', { label: t('fields.phone') })}
              >
                <PhoneInput
                  id="congregation-phone"
                  aria-describedby={describedBy('congregation-phone', fieldErrors.phone)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  placeholder={t('fields.phonePlaceholder')}
                  {...register('phone')}
                />
              </FormField>
            </Box>

            <FormField
              error={fieldErrors.email}
              id="congregation-email"
              label={t('fields.optional', { label: t('fields.email') })}
            >
              <Input
                id="congregation-email"
                aria-describedby={describedBy('congregation-email', fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                autoCapitalize="none"
                autoComplete="email"
                inputMode="email"
                maxLength={EMAIL_MAX_LENGTH}
                placeholder={t('fields.emailPlaceholder')}
                spellCheck={false}
                type="email"
                {...register('email')}
              />
            </FormField>

            <Separator />

            <Subtitle>{t('details.address')}</Subtitle>

            <AddressFields fields={addressFields} idPrefix="congregation-address" />
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
              {isSubmitting ? t('congregationForm.submitting') : t('congregationForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
