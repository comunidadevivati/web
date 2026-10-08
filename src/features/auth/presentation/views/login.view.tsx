import livingStoneGreen from '@/assets/brand/living-stone-green.png';
import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/ui/text';
import { useLoginViewModel } from '@/features/auth/presentation/view-models/login.view-model';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react';

export const LoginView = () => {
  const { form, isPasswordVisible, isSubmitDisabled, submit, togglePasswordVisibility } =
    useLoginViewModel();

  const {
    formState: { errors, isSubmitting },
    register,
  } = form;

  return (
    <>
      {isSubmitting && <LoadingOverlay />}

      <Box className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Box
          className="
            relative hidden overflow-hidden bg-primary lg:flex lg:items-center lg:justify-center
          "
        >
          <Box
            className="
              absolute inset-0 bg-linear-to-br from-primary via-primary-gradient-middle
              to-primary-gradient-end
            "
          />

          <Box className="relative z-10 flex max-w-xl flex-col items-center gap-8 px-12 text-center">
            <Image
              alt="Comunidade Viva e Eficaz"
              className="w-full max-w-md object-contain"
              src={logoVivaWhite}
            />

            <Box className="h-px w-24 bg-primary-foreground/40" />

            <Text className="max-w-md text-base leading-7 text-primary-foreground/85">
              Um ambiente criado para conectar pessoas, ministérios e propósitos.
            </Text>
          </Box>
        </Box>

        <Box
          className="
            flex min-h-dvh items-center justify-center bg-background px-6 py-10 sm:px-10 lg:px-16
          "
        >
          <Box className="w-full max-w-md">
            <Box className="mb-10 flex flex-col items-center text-center">
              <Image
                alt=""
                aria-hidden="true"
                className="mb-6 size-20 object-contain"
                src={livingStoneGreen}
              />

              <Heading className="text-3xl font-semibold tracking-tight">Bem-vindo</Heading>

              <Text className="mt-2 text-base">
                Entre com suas credenciais para acessar sua conta.
              </Text>
            </Box>

            <Form className="grid gap-5" noValidate onSubmit={submit}>
              <Box className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>

                <Input
                  id="email"
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  autoFocus
                  className="h-11"
                  placeholder="seuemail@exemplo.com"
                  type="email"
                  {...register('email')}
                />

                {errors.email?.message && (
                  <Text className="text-destructive">{errors.email.message}</Text>
                )}
              </Box>

              <Box className="grid gap-2">
                <Label htmlFor="password">Senha</Label>

                <Box className="relative">
                  <Input
                    id="password"
                    aria-invalid={Boolean(errors.password)}
                    autoComplete="current-password"
                    className="h-11 pr-11"
                    placeholder="Digite sua senha"
                    type={isPasswordVisible ? 'text' : 'password'}
                    {...register('password')}
                  />

                  <Button
                    aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                </Box>

                {errors.password?.message && (
                  <Text className="text-destructive">{errors.password.message}</Text>
                )}
              </Box>

              <Button
                className="mt-2 h-11 w-full hover:bg-primary-strong"
                disabled={isSubmitDisabled}
                type="submit"
              >
                <LogInIcon data-icon="inline-start" />
                Entrar
              </Button>
            </Form>
          </Box>
        </Box>
      </Box>
    </>
  );
};
