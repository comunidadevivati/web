import type { TranslationKey } from '@/app/i18n/translation-key';
import { authorizeGuestWifiUseCase } from '@/features/guest-wifi/application/use-cases/authorize-guest-wifi.use-case';
import { resolveGuestWifiAccessUseCase } from '@/features/guest-wifi/application/use-cases/resolve-guest-wifi-access.use-case';
import {
  GuestWifiAuthorizationError,
  type GuestWifiAuthorization,
} from '@/features/guest-wifi/domain/guest-wifi';
import { GUEST_WIFI_TERMS_VERSION } from '@/features/guest-wifi/presentation/models/guest-wifi-terms.model';
import {
  formatPhone,
  GUEST_WIFI_REDIRECT_SECONDS,
  getPhoneDigits,
  guestWifiFormSchema,
  type GuestWifiFormData,
  type GuestWifiStep,
} from '@/features/guest-wifi/presentation/models/guest-wifi.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useGuestWifiViewModel = () => {
  const search = useSearch({ from: '/wifi-visitantes' });

  const access = resolveGuestWifiAccessUseCase(search);

  const navigate = useNavigate();

  const { t } = useTranslation('guestWifi');

  const [step, setStep] = useState<GuestWifiStep>('terms');

  const [redirectCountdown, setRedirectCountdown] = useState(GUEST_WIFI_REDIRECT_SECONDS);

  // Após a liberação, conta os segundos e leva o visitante para a home se ele não clicar antes.
  useEffect(() => {
    if (step !== 'success') {
      return;
    }

    if (redirectCountdown <= 0) {
      void navigate({
        to: '/',
      });

      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRedirectCountdown((seconds) => seconds - 1);
    }, 1_000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate, redirectCountdown, step]);

  const redirectMessage = t('success.redirect', { count: redirectCountdown });

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
    handleSubmit,
    register,
  } = form;

  const { error, isError, isPending, mutate, reset } = useMutation({
    mutationFn: (variables: GuestWifiAuthorization) => authorizeGuestWifiUseCase(variables),
    onSuccess: () => {
      setStep('success');
    },
  });

  const isSubmitting = isPending;

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  const phoneRegistration = register('phone');

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = formatPhone(event.target.value);

    void phoneRegistration.onChange(event);
  };

  // Mensagens do Zod são chaves de tradução do namespace "guestWifi".
  const getFieldError = (message?: string) => {
    return message ? t(message as TranslationKey<'guestWifi'>) : undefined;
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
    reset();

    setStep('terms');
  };

  const submit = handleSubmit(({ fullName, phone }) => {
    if (!access || isSubmitting) {
      return;
    }

    mutate({
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
    form,
    getFieldError,
    hasAcceptedTerms,
    hasAccess: access !== null,
    errorCode: error instanceof GuestWifiAuthorizationError ? error.code : null,
    hasError: isError,
    isSubmitDisabled,
    isSubmitting,
    redirectMessage,
    phoneRegistration: {
      ...phoneRegistration,
      onChange: handlePhoneChange,
    },
    step,
    submit,
    toggleTermsAcceptance,
  };
};
