import { loginSchema, type LoginFormData } from '@/features/auth/presentation/models/login.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const useLoginViewModel = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const isSubmitDisabled = !isDirty || !isValid || isSubmitting;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((currentValue) => !currentValue);
  };

  const submit = form.handleSubmit(async (_data) => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1_000);
    });
  });

  return {
    form,
    isPasswordVisible,
    isSubmitDisabled,
    submit,
    togglePasswordVisibility,
  };
};
