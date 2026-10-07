import { loginUseCase } from '@/features/auth/application/use-cases/login.use-case';
import { loginSchema, type LoginFormData } from '@/features/auth/presentation/models/login.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const useLoginViewModel = () => {
  const navigate = useNavigate();

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

  const submit = form.handleSubmit(async ({ email }) => {
    loginUseCase({
      email,
    });

    await navigate({
      to: '/dashboard',
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
