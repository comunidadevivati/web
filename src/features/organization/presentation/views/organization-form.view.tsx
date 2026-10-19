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
import type { Organization } from '@/features/organization/domain/organization';
import { AddressFields } from '@/features/organization/presentation/components/address-fields';
import { MaskedInput } from '@/features/organization/presentation/components/masked-input';
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from '@/features/organization/presentation/models/organization.model';
import { useOrganizationFormViewModel } from '@/features/organization/presentation/view-models/organization-form.view-model';
import { formatCnpj } from '@/shared/validation/brazilian-address';
import { CircleAlertIcon, SaveIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type OrganizationFormViewProps = {
  organization: Organization;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Modal de edição dos dados institucionais da organização (Matriz).
export const OrganizationFormView = ({
  onOpenChange,
  open,
  organization,
}: OrganizationFormViewProps) => {
  const {
    addressFields,
    fieldErrors,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    isSubmitting,
    notice,
    submit,
  } = useOrganizationFormViewModel({ onOpenChange, organization });

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
        closeLabel={t('organizationForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('organizationForm.title')}
          </DialogTitle>

          <DialogDescription>{t('organizationForm.description')}</DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-4">
            <FormField
              error={fieldErrors.legalName}
              id="organization-legal-name"
              label={t('fields.legalName')}
            >
              <Input
                id="organization-legal-name"
                aria-describedby={describedBy('organization-legal-name', fieldErrors.legalName)}
                aria-invalid={Boolean(fieldErrors.legalName)}
                aria-required
                autoComplete="organization"
                maxLength={NAME_MAX_LENGTH}
                type="text"
                {...register('legalName')}
              />
            </FormField>

            <FormField
              error={fieldErrors.tradeName}
              id="organization-trade-name"
              label={t('fields.tradeName')}
            >
              <Input
                id="organization-trade-name"
                aria-describedby={describedBy('organization-trade-name', fieldErrors.tradeName)}
                aria-invalid={Boolean(fieldErrors.tradeName)}
                aria-required
                maxLength={NAME_MAX_LENGTH}
                type="text"
                {...register('tradeName')}
              />
            </FormField>

            <Box className="grid gap-4 sm:grid-cols-2">
              <FormField error={fieldErrors.cnpj} id="organization-cnpj" label={t('fields.cnpj')}>
                <MaskedInput
                  id="organization-cnpj"
                  aria-describedby={describedBy('organization-cnpj', fieldErrors.cnpj)}
                  aria-invalid={Boolean(fieldErrors.cnpj)}
                  aria-required
                  format={formatCnpj}
                  maxLength={18}
                  placeholder={t('fields.cnpjPlaceholder')}
                  {...register('cnpj')}
                />
              </FormField>

              <FormField
                error={fieldErrors.phone}
                id="organization-phone"
                label={t('fields.phone')}
              >
                <PhoneInput
                  id="organization-phone"
                  aria-describedby={describedBy('organization-phone', fieldErrors.phone)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-required
                  placeholder={t('fields.phonePlaceholder')}
                  {...register('phone')}
                />
              </FormField>
            </Box>

            <FormField error={fieldErrors.email} id="organization-email" label={t('fields.email')}>
              <Input
                id="organization-email"
                aria-describedby={describedBy('organization-email', fieldErrors.email)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-required
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

            <AddressFields fields={addressFields} idPrefix="organization-address" />
          </FieldGroup>

          {notice && (
            <Alert variant="destructive">
              <CircleAlertIcon />

              <AlertTitle>{t(`notices.${notice}.title`)}</AlertTitle>

              <AlertDescription>{t(`notices.${notice}.description`)}</AlertDescription>
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
              {isSubmitting ? t('organizationForm.submitting') : t('organizationForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
