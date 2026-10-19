import { FormField } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  Form,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
} from '@/components/ui';
import type { Member } from '@/features/members/domain/member';
import { useMembershipFormViewModel } from '@/features/members/presentation/view-models/membership-form.view-model';
import { CircleAlertIcon, LinkIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type MembershipFormViewProps = {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal de registro de um vínculo do membro com uma congregação ativa.
export const MembershipFormView = ({ member, onOpenChange, open }: MembershipFormViewProps) => {
  const {
    congregationError,
    congregationOptions,
    form,
    handleOpenChange,
    handleOpenChangeComplete,
    hasNoCongregations,
    isSubmitting,
    notice,
    noticeDetail,
    submit,
  } = useMembershipFormViewModel({ member, onOpenChange });

  const { control, register } = form;

  const { t } = useTranslation('members');

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="gap-6 p-5 sm:max-w-md sm:p-6"
        closeDisabled={isSubmitting}
        closeLabel={t('membershipForm.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('membershipForm.title')}
          </DialogTitle>

          <DialogDescription>
            {t('membershipForm.description', { name: member.fullName })}
          </DialogDescription>
        </DialogHeader>

        <Form className="grid gap-6" noValidate onSubmit={submit}>
          <FieldGroup className="gap-5">
            <FormField
              error={congregationError}
              id="membership-congregation"
              label={t('fields.congregation')}
            >
              <Controller
                control={control}
                name="congregationId"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Select
                    disabled={hasNoCongregations}
                    items={congregationOptions}
                    value={value || null}
                    onValueChange={(next) => onChange(next ?? '')}
                  >
                    <SelectTrigger
                      id="membership-congregation"
                      aria-describedby={
                        congregationError ? 'membership-congregation-error' : undefined
                      }
                      aria-invalid={Boolean(congregationError)}
                      aria-required
                      onBlur={onBlur}
                    >
                      <SelectValue placeholder={t('fields.congregationPlaceholder')} />
                    </SelectTrigger>

                    <SelectContent>
                      {congregationOptions.map(({ label, value: optionValue }) => (
                        <SelectItem key={optionValue} value={optionValue}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {hasNoCongregations && <Text>{t('membershipForm.noCongregations')}</Text>}

            <Box className="flex items-start gap-3">
              <Checkbox
                id="membership-primary"
                aria-describedby="membership-primary-hint"
                className="mt-0.5"
                {...register('primary')}
              />

              <Box className="grid gap-1">
                <Label htmlFor="membership-primary">{t('fields.primary')}</Label>

                <Text className="text-xs" id="membership-primary-hint">
                  {t('fields.primaryHint')}
                </Text>
              </Box>
            </Box>
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
              disabled={isSubmitting || hasNoCongregations}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <LinkIcon data-icon="inline-start" />
              )}
              {isSubmitting ? t('membershipForm.submitting') : t('membershipForm.submit')}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
