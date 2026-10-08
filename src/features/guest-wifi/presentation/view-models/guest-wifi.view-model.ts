import { authorizeGuestWifiUseCase } from '@/features/guest-wifi/application/use-cases/authorize-guest-wifi.use-case';
import { resolveGuestWifiAccessUseCase } from '@/features/guest-wifi/application/use-cases/resolve-guest-wifi-access.use-case';
import {
  GuestWifiAuthorizationError,
  type GuestWifiAuthorization,
} from '@/features/guest-wifi/domain/guest-wifi';
import { GUEST_WIFI_TERMS_VERSION } from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';
import {
  formatPhone,
  getPhoneDigits,
  guestWifiFormSchema,
  type GuestWifiFormData,
  type GuestWifiStep,
} from '@/features/guest-wifi/presentation/models/guest-wifi.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';

export const useGuestWifiViewModel = () => {
  const search = useSearch({ from: '/wifi-visitantes' });

  const access = resolveGuestWifiAccessUseCase(search);

  const [step, setStep] = useState<GuestWifiStep>('terms');

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const form = useForm<GuestWifiFormData>({
    resolver: zodResolver(guestWifiFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
    },
    mode: 'onTouched',
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  const authorization = useMutation({
    mutationFn: (variables: GuestWifiAuthorization) => authorizeGuestWifiUseCase(variables),
    onSuccess: () => {
      setStep('success');
    },
  });

  const isSubmitting = authorization.isPending;

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  const phoneRegistration = form.register('phone');

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatPhone(event.target.value);

    void phoneRegistration.onChange(event);
  };

  const toggleTermsAcceptance = (isAccepted: boolean) => {
    setHasAcceptedTerms(isAccepted);
  };

  const continueToForm = () => {
    if (hasAcceptedTerms) {
      setStep('form');
    }
  };

  const backToTerms = () => {
    authorization.reset();

    setStep('terms');
  };

  const submit = form.handleSubmit(({ fullName, phone }) => {
    if (!access || isSubmitting) {
      return;
    }

    authorization.mutate({
      client: access.client,
      visitor: {
        fullName: fullName.trim().replace(/\s+/g, ' '),
        phone: getPhoneDigits(phone),
      },
      terms: {
        accepted: true,
        version: GUEST_WIFI_TERMS_VERSION,
      },
    });
  });

  return {
    backToTerms,
    continueToForm,
    continueUrl: access?.redirectUrl ?? null,
    form,
    hasAcceptedTerms,
    hasAccess: access !== null,
    errorCode:
      authorization.error instanceof GuestWifiAuthorizationError ? authorization.error.code : null,
    hasError: authorization.isError,
    isSubmitDisabled,
    isSubmitting,
    phoneRegistration: {
      ...phoneRegistration,
      onChange: handlePhoneChange,
    },
    step,
    submit,
    toggleTermsAcceptance,
  };
};
