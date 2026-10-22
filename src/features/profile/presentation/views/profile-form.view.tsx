import { CardSectionHeader, FormField, PhoneInput } from '@/components/molecules';
import {
  Box,
  Button,
  Card,
  CardContent,
  Form,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@/components/ui';
import { SOCIAL_NETWORKS, type Profile } from '@/features/profile/domain/profile';
import {
  ADDRESS_NUMBER_MAX_LENGTH,
  ADDRESS_TEXT_MAX_LENGTH,
  COUNTRY_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  REFERENCE_MAX_LENGTH,
  SOCIAL_LINK_MAX_LENGTH,
  STREET_MAX_LENGTH,
} from '@/features/profile/presentation/models/profile.model';
import { useProfileFormViewModel } from '@/features/profile/presentation/view-models/profile-form.view-model';
import { MapPinIcon, SaveIcon, Share2Icon, UndoIcon, UserIcon } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ProfileFormViewProps = {
  profile: Profile;
};

const describedBy = (id: string, error?: string, hint = false) => {
  const ids = [error && `${id}-error`, hint && `${id}-description`].filter(Boolean);

  return ids.length > 0 ? ids.join(' ') : undefined;
};

const SEX_OPTIONS = ['', 'MALE', 'FEMALE'] as const;

// Dados pessoais, endereço e redes sociais do Perfil, gravados juntos.
export const ProfileFormView = ({ profile }: ProfileFormViewProps) => {
  const {
    addressErrors,
    control,
    discard,
    fieldErrors,
    formatPostalCode,
    isDirty,
    isSubmitting,
    maxBirthDate,
    register,
    socialErrors,
    submit,
  } = useProfileFormViewModel({ profile });

  const { t } = useTranslation('profile');

  const optional = (label: string) => t('fields.optional', { label });

  const sexItems = SEX_OPTIONS.map((value) => ({
    value,
    label: t(`fields.sexes.${value || 'none'}`),
  }));

  const postalCodeRegistration = register('address.postalCode');

  const handlePostalCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatPostalCode(event.target.value);

    void postalCodeRegistration.onChange(event);
  };

  return (
    <Form className="grid gap-6" noValidate onSubmit={submit}>
      <Card className="border-border surface-card shadow-sm">
        <CardSectionHeader
          description={t('sections.personal.description')}
          icon={UserIcon}
          title={t('sections.personal.title')}
        />

        <CardContent className="grid gap-4 sm:grid-cols-6">
          <FormField
            className="sm:col-span-6"
            error={fieldErrors.fullName}
            id="profile-full-name"
            label={t('fields.fullName')}
          >
            <Input
              id="profile-full-name"
              aria-describedby={describedBy('profile-full-name', fieldErrors.fullName)}
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-required
              autoComplete="name"
              maxLength={FULL_NAME_MAX_LENGTH}
              type="text"
              {...register('fullName')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={fieldErrors.sex}
            id="profile-sex"
            label={optional(t('fields.sex'))}
          >
            <Controller
              control={control}
              name="sex"
              render={({ field: { onBlur, onChange, value } }) => (
                <Select
                  items={sexItems}
                  value={value}
                  onValueChange={(next) => onChange(next ?? '')}
                >
                  <SelectTrigger id="profile-sex" onBlur={onBlur}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {sexItems.map(({ label, value: optionValue }) => (
                      <SelectItem key={optionValue || 'none'} value={optionValue}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={fieldErrors.birthDate}
            id="profile-birth-date"
            label={optional(t('fields.birthDate'))}
          >
            <Input
              id="profile-birth-date"
              aria-describedby={describedBy('profile-birth-date', fieldErrors.birthDate)}
              aria-invalid={Boolean(fieldErrors.birthDate)}
              autoComplete="bday"
              max={maxBirthDate}
              min="1900-01-01"
              type="date"
              {...register('birthDate')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={fieldErrors.phone}
            id="profile-phone"
            label={optional(t('fields.phone'))}
          >
            <PhoneInput
              id="profile-phone"
              aria-describedby={describedBy('profile-phone', fieldErrors.phone)}
              aria-invalid={Boolean(fieldErrors.phone)}
              {...register('phone')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={fieldErrors.secondaryPhone}
            id="profile-secondary-phone"
            label={optional(t('fields.secondaryPhone'))}
          >
            <PhoneInput
              id="profile-secondary-phone"
              aria-describedby={describedBy('profile-secondary-phone', fieldErrors.secondaryPhone)}
              aria-invalid={Boolean(fieldErrors.secondaryPhone)}
              autoComplete="off"
              {...register('secondaryPhone')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            description={t('fields.emailHint')}
            id="profile-email"
            label={t('fields.email')}
          >
            <Input
              id="profile-email"
              aria-describedby="profile-email-description"
              readOnly
              type="email"
              value={profile.email ?? ''}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            description={t('fields.secondaryEmailHint')}
            error={fieldErrors.secondaryEmail}
            id="profile-secondary-email"
            label={optional(t('fields.secondaryEmail'))}
          >
            <Input
              id="profile-secondary-email"
              aria-describedby={describedBy(
                'profile-secondary-email',
                fieldErrors.secondaryEmail,
                true,
              )}
              aria-invalid={Boolean(fieldErrors.secondaryEmail)}
              autoComplete="email"
              maxLength={EMAIL_MAX_LENGTH}
              type="email"
              {...register('secondaryEmail')}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card className="border-border surface-card shadow-sm">
        <CardSectionHeader
          description={t('sections.address.description')}
          icon={MapPinIcon}
          title={t('sections.address.title')}
        />

        <CardContent className="grid gap-4 sm:grid-cols-6">
          <FormField
            className="sm:col-span-2"
            error={addressErrors.postalCode}
            id="profile-postal-code"
            label={t('fields.postalCode')}
          >
            <Input
              id="profile-postal-code"
              aria-describedby={describedBy('profile-postal-code', addressErrors.postalCode)}
              aria-invalid={Boolean(addressErrors.postalCode)}
              autoComplete="postal-code"
              maxLength={20}
              placeholder={t('fields.postalCodePlaceholder')}
              type="text"
              {...postalCodeRegistration}
              onChange={handlePostalCodeChange}
            />
          </FormField>

          <FormField
            className="sm:col-span-4"
            error={addressErrors.street}
            id="profile-street"
            label={t('fields.street')}
          >
            <Input
              id="profile-street"
              aria-describedby={describedBy('profile-street', addressErrors.street)}
              aria-invalid={Boolean(addressErrors.street)}
              autoComplete="address-line1"
              maxLength={STREET_MAX_LENGTH}
              type="text"
              {...register('address.street')}
            />
          </FormField>

          <FormField
            className="sm:col-span-2"
            error={addressErrors.number}
            id="profile-number"
            label={t('fields.number')}
          >
            <Input
              id="profile-number"
              aria-describedby={describedBy('profile-number', addressErrors.number)}
              aria-invalid={Boolean(addressErrors.number)}
              maxLength={ADDRESS_NUMBER_MAX_LENGTH}
              type="text"
              {...register('address.number')}
            />
          </FormField>

          <FormField
            className="sm:col-span-4"
            error={addressErrors.complement}
            id="profile-complement"
            label={optional(t('fields.complement'))}
          >
            <Input
              id="profile-complement"
              aria-describedby={describedBy('profile-complement', addressErrors.complement)}
              aria-invalid={Boolean(addressErrors.complement)}
              autoComplete="address-line2"
              maxLength={ADDRESS_TEXT_MAX_LENGTH}
              type="text"
              {...register('address.complement')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={addressErrors.district}
            id="profile-district"
            label={t('fields.district')}
          >
            <Input
              id="profile-district"
              aria-describedby={describedBy('profile-district', addressErrors.district)}
              aria-invalid={Boolean(addressErrors.district)}
              autoComplete="address-level3"
              maxLength={ADDRESS_TEXT_MAX_LENGTH}
              type="text"
              {...register('address.district')}
            />
          </FormField>

          <FormField
            className="sm:col-span-3"
            error={addressErrors.city}
            id="profile-city"
            label={t('fields.city')}
          >
            <Input
              id="profile-city"
              aria-describedby={describedBy('profile-city', addressErrors.city)}
              aria-invalid={Boolean(addressErrors.city)}
              autoComplete="address-level2"
              maxLength={ADDRESS_TEXT_MAX_LENGTH}
              type="text"
              {...register('address.city')}
            />
          </FormField>

          <FormField
            className="sm:col-span-2"
            error={addressErrors.state}
            id="profile-state"
            label={t('fields.state')}
          >
            <Input
              id="profile-state"
              aria-describedby={describedBy('profile-state', addressErrors.state)}
              aria-invalid={Boolean(addressErrors.state)}
              autoComplete="address-level1"
              maxLength={ADDRESS_TEXT_MAX_LENGTH}
              placeholder={t('fields.statePlaceholder')}
              type="text"
              {...register('address.state')}
            />
          </FormField>

          <FormField
            className="sm:col-span-4"
            error={addressErrors.country}
            id="profile-country"
            label={t('fields.country')}
          >
            <Input
              id="profile-country"
              aria-describedby={describedBy('profile-country', addressErrors.country)}
              aria-invalid={Boolean(addressErrors.country)}
              autoComplete="country-name"
              maxLength={COUNTRY_MAX_LENGTH}
              type="text"
              {...register('address.country')}
            />
          </FormField>

          <FormField
            className="sm:col-span-6"
            error={addressErrors.reference}
            id="profile-reference"
            label={optional(t('fields.reference'))}
          >
            <Input
              id="profile-reference"
              aria-describedby={describedBy('profile-reference', addressErrors.reference)}
              aria-invalid={Boolean(addressErrors.reference)}
              maxLength={REFERENCE_MAX_LENGTH}
              type="text"
              {...register('address.reference')}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card className="border-border surface-card shadow-sm">
        <CardSectionHeader
          description={t('sections.social.description')}
          icon={Share2Icon}
          title={t('sections.social.title')}
        />

        <CardContent className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_NETWORKS.map((network) => (
            <FormField
              key={network}
              error={socialErrors[network]}
              id={`profile-${network}`}
              label={t(`fields.${network}`)}
            >
              <Input
                id={`profile-${network}`}
                aria-describedby={describedBy(`profile-${network}`, socialErrors[network])}
                aria-invalid={Boolean(socialErrors[network])}
                autoCapitalize="none"
                autoComplete="url"
                inputMode="url"
                maxLength={SOCIAL_LINK_MAX_LENGTH}
                placeholder={t(`fields.socialPlaceholders.${network}`)}
                spellCheck={false}
                type="url"
                {...register(`socialLinks.${network}`)}
              />
            </FormField>
          ))}
        </CardContent>
      </Card>

      <Box className="flex flex-wrap justify-end gap-3">
        <Button
          className="h-11"
          disabled={!isDirty || isSubmitting}
          type="button"
          variant="outline"
          onClick={discard}
        >
          <UndoIcon data-icon="inline-start" />
          {t('actions.discard')}
        </Button>

        <Button className="h-11" disabled={!isDirty || isSubmitting} type="submit">
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SaveIcon data-icon="inline-start" />
          )}
          {isSubmitting ? t('actions.saving') : t('actions.save')}
        </Button>
      </Box>
    </Form>
  );
};
