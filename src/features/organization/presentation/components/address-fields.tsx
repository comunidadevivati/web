import { FormField } from '@/components/molecules';
import { Box, Input } from '@/components/ui';
import { MaskedInput } from '@/features/organization/presentation/components/masked-input';
import {
  ADDRESS_NUMBER_MAX_LENGTH,
  ADDRESS_TEXT_MAX_LENGTH,
  STREET_MAX_LENGTH,
  type AddressFormInput,
} from '@/features/organization/presentation/models/organization.model';
import { formatPostalCode } from '@/shared/validation/brazilian-address';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type AddressField = keyof AddressFormInput;

export type AddressFieldBinding = {
  registration: UseFormRegisterReturn;
  // Mensagem já traduzida.
  error?: string;
};

type AddressFieldsProps = {
  // Prefixo dos ids dos campos (ex.: organization-address).
  idPrefix: string;
  fields: Record<AddressField, AddressFieldBinding>;
};

const describedBy = (id: string, error?: string) => {
  return error ? `${id}-error` : undefined;
};

// Campos do endereço brasileiro, compartilhados pelos formulários de organização e congregação.
export const AddressFields = ({ fields, idPrefix }: AddressFieldsProps) => {
  const { t } = useTranslation('organization');

  const id = (field: AddressField) => {
    return `${idPrefix}-${field}`;
  };

  const { city, complement, district, number, postalCode, state, street } = fields;

  return (
    <Box className="grid gap-4 sm:grid-cols-6">
      <FormField
        className="sm:col-span-2"
        error={postalCode.error}
        id={id('postalCode')}
        label={t('fields.postalCode')}
      >
        <MaskedInput
          id={id('postalCode')}
          aria-describedby={describedBy(id('postalCode'), postalCode.error)}
          aria-invalid={Boolean(postalCode.error)}
          aria-required
          autoComplete="postal-code"
          format={formatPostalCode}
          maxLength={9}
          placeholder={t('fields.postalCodePlaceholder')}
          {...postalCode.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-4"
        error={street.error}
        id={id('street')}
        label={t('fields.street')}
      >
        <Input
          id={id('street')}
          aria-describedby={describedBy(id('street'), street.error)}
          aria-invalid={Boolean(street.error)}
          aria-required
          autoComplete="address-line1"
          maxLength={STREET_MAX_LENGTH}
          type="text"
          {...street.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-2"
        error={number.error}
        id={id('number')}
        label={t('fields.number')}
      >
        <Input
          id={id('number')}
          aria-describedby={describedBy(id('number'), number.error)}
          aria-invalid={Boolean(number.error)}
          aria-required
          maxLength={ADDRESS_NUMBER_MAX_LENGTH}
          type="text"
          {...number.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-4"
        error={complement.error}
        id={id('complement')}
        label={t('fields.optional', { label: t('fields.complement') })}
      >
        <Input
          id={id('complement')}
          aria-describedby={describedBy(id('complement'), complement.error)}
          aria-invalid={Boolean(complement.error)}
          autoComplete="address-line2"
          maxLength={ADDRESS_TEXT_MAX_LENGTH}
          type="text"
          {...complement.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-6"
        error={district.error}
        id={id('district')}
        label={t('fields.district')}
      >
        <Input
          id={id('district')}
          aria-describedby={describedBy(id('district'), district.error)}
          aria-invalid={Boolean(district.error)}
          aria-required
          autoComplete="address-level3"
          maxLength={ADDRESS_TEXT_MAX_LENGTH}
          type="text"
          {...district.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-4"
        error={city.error}
        id={id('city')}
        label={t('fields.city')}
      >
        <Input
          id={id('city')}
          aria-describedby={describedBy(id('city'), city.error)}
          aria-invalid={Boolean(city.error)}
          aria-required
          autoComplete="address-level2"
          maxLength={ADDRESS_TEXT_MAX_LENGTH}
          type="text"
          {...city.registration}
        />
      </FormField>

      <FormField
        className="sm:col-span-2"
        error={state.error}
        id={id('state')}
        label={t('fields.state')}
      >
        <Input
          id={id('state')}
          aria-describedby={describedBy(id('state'), state.error)}
          aria-invalid={Boolean(state.error)}
          aria-required
          autoCapitalize="characters"
          autoComplete="address-level1"
          className="uppercase"
          maxLength={2}
          placeholder={t('fields.statePlaceholder')}
          type="text"
          {...state.registration}
        />
      </FormField>
    </Box>
  );
};
