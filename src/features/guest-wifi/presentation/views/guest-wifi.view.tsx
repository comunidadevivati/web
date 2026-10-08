import logoVivaWhite from '@/assets/brand/logo-viva-white.png';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Form,
  Heading,
  Image,
  Input,
  Label,
  LoadingOverlay,
  Text,
} from '@/components/ui';
import { GuestWifiTerms } from '@/features/guest-wifi/presentation/components/guest-wifi-terms';
import { useGuestWifiViewModel } from '@/features/guest-wifi/presentation/view-models/guest-wifi.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleCheckIcon,
  HouseIcon,
  TriangleAlertIcon,
  WifiIcon,
} from 'lucide-react';

const cardClassName = cn(`
  grid gap-5 rounded-2xl bg-card p-5 text-card-foreground shadow-elevated-lg sm:gap-6 sm:p-8
`);

const primaryButtonClassName = cn('h-11 w-full text-base sm:w-auto sm:px-6');

const homeLinkClassName = cn(`
  inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base
  font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:ring-3
  focus-visible:ring-ring/50 focus-visible:outline-none
`);

const stepClassName = cn(`
  flex items-center gap-2 text-sm font-medium text-muted-foreground
  aria-[current=step]:text-primary-strong
`);

const stepNumberClassName = cn(`
  flex size-6 items-center justify-center rounded-full border border-current text-xs
`);

export const GuestWifiView = () => {
  const {
    backToTerms,
    continueToForm,
    errorCode,
    form,
    hasAcceptedTerms,
    hasAccess,
    hasError,
    isSubmitDisabled,
    isSubmitting,
    phoneRegistration,
    redirectMessage,
    step,
    submit,
    toggleTermsAcceptance,
  } = useGuestWifiViewModel();

  const {
    formState: { errors },
    register,
  } = form;

  return (
    <Box className="min-h-dvh overflow-x-hidden bg-background">
      <Box className="border-b border-header-border bg-header shadow-elevated" role="banner">
        <Box className="mx-auto flex h-16 w-full max-w-360 items-center justify-center px-4 md:h-18">
          <Image
            alt="Comunidade Viva e Eficaz"
            className="h-8 w-auto object-contain sm:h-9 md:h-10"
            src={logoVivaWhite}
          />
        </Box>
      </Box>

      <Box role="main">
        <Box className="mx-auto grid w-full max-w-2xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12">
          <Box className="grid justify-items-center gap-3 text-center">
            <Box
              className="
                flex size-12 items-center justify-center rounded-xl bg-primary/10
                text-primary-strong ring-1 ring-primary/20
              "
            >
              <WifiIcon aria-hidden="true" className="size-6" />
            </Box>

            <Text
              className="
                text-xs font-semibold tracking-widest text-primary-strong uppercase sm:text-sm
              "
            >
              Wi-Fi VIVA - Visitantes
            </Text>

            <Heading className="text-2xl text-foreground sm:text-3xl">
              Bem-vindo à Comunidade Viva!
            </Heading>

            <Text className="text-base leading-relaxed text-muted-foreground">
              Que alegria ter você aqui. Para usar a internet, aceite os termos de uso e informe seu
              nome e telefone.
            </Text>
          </Box>

          {!hasAccess && (
            <Box className="grid justify-items-center gap-6">
              <Alert>
                <TriangleAlertIcon />

                <AlertTitle>Acesso indisponível</AlertTitle>

                <AlertDescription>
                  Esta página é aberta automaticamente quando você se conecta à rede Wi-Fi
                  &quot;VIVA - Visitantes&quot;. Conecte-se à rede e aguarde a página abrir.
                </AlertDescription>
              </Alert>

              <Link className={homeLinkClassName} to="/">
                <HouseIcon className="size-4" />
                Ir para o site da Comunidade Viva
              </Link>
            </Box>
          )}

          {hasAccess && step !== 'success' && (
            <Box aria-label="Etapas" className="flex items-center justify-center gap-3" role="list">
              <Box
                aria-current={step === 'terms' ? 'step' : undefined}
                className={stepClassName}
                role="listitem"
              >
                <Box className={stepNumberClassName}>1</Box>
                Termos
              </Box>

              <Box aria-hidden="true" className="h-px w-8 bg-border" />

              <Box
                aria-current={step === 'form' ? 'step' : undefined}
                className={stepClassName}
                role="listitem"
              >
                <Box className={stepNumberClassName}>2</Box>
                Seus dados
              </Box>
            </Box>
          )}

          {hasAccess && step === 'terms' && (
            <Box aria-labelledby="guest-wifi-terms-title" className={cardClassName} role="region">
              <Heading className="text-lg sm:text-xl" id="guest-wifi-terms-title" level={2}>
                Termos de uso e política de privacidade
              </Heading>

              <GuestWifiTerms />

              <Label className="items-start gap-3 text-sm leading-snug" htmlFor="guest-wifi-terms">
                <Checkbox
                  checked={hasAcceptedTerms}
                  className="mt-0.5"
                  id="guest-wifi-terms"
                  onChange={(event) => toggleTermsAcceptance(event.target.checked)}
                />
                Li e aceito os termos de uso, a política de privacidade e a autorização de uso de
                imagem e voz.
              </Label>

              <Button
                className={cn(primaryButtonClassName, 'justify-self-end')}
                disabled={!hasAcceptedTerms}
                type="button"
                onClick={continueToForm}
              >
                Continuar
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Box>
          )}

          {hasAccess && step === 'form' && (
            <Box aria-labelledby="guest-wifi-form-title" className={cardClassName} role="region">
              <Box className="grid gap-1">
                <Heading className="text-lg sm:text-xl" id="guest-wifi-form-title" level={2}>
                  Seus dados
                </Heading>

                <Text>Preencha para liberar o acesso à internet.</Text>
              </Box>

              <Form className="grid gap-5" noValidate onSubmit={submit}>
                <Box className="grid gap-2">
                  <Label htmlFor="guest-wifi-full-name">Nome completo</Label>

                  <Input
                    id="guest-wifi-full-name"
                    aria-invalid={Boolean(errors.fullName)}
                    autoComplete="name"
                    autoFocus
                    className="h-11"
                    placeholder="Seu nome e sobrenome"
                    type="text"
                    {...register('fullName')}
                  />

                  {errors.fullName?.message && (
                    <Text className="text-destructive" role="alert">
                      {errors.fullName.message}
                    </Text>
                  )}
                </Box>

                <Box className="grid gap-2">
                  <Label htmlFor="guest-wifi-phone">Telefone (WhatsApp)</Label>

                  <Input
                    id="guest-wifi-phone"
                    aria-invalid={Boolean(errors.phone)}
                    autoComplete="tel-national"
                    className="h-11"
                    inputMode="tel"
                    placeholder="(67) 99999-9999"
                    type="tel"
                    {...phoneRegistration}
                  />

                  {errors.phone?.message && (
                    <Text className="text-destructive" role="alert">
                      {errors.phone.message}
                    </Text>
                  )}
                </Box>

                {hasError && (
                  <Alert variant="destructive">
                    <TriangleAlertIcon />

                    <AlertTitle>Não foi possível liberar o acesso</AlertTitle>

                    <AlertDescription>
                      Verifique se você ainda está conectado à rede &quot;VIVA - Visitantes&quot; e
                      tente novamente. Se o problema continuar, procure a recepção.
                      {errorCode && (
                        <Text className="mt-1 font-mono text-xs text-destructive/80">
                          Código do erro: {errorCode}
                        </Text>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <Box className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    className="h-11 w-full text-base sm:w-auto"
                    disabled={isSubmitting}
                    type="button"
                    variant="outline"
                    onClick={backToTerms}
                  >
                    <ArrowLeftIcon data-icon="inline-start" />
                    Voltar aos termos
                  </Button>

                  <Button
                    className={primaryButtonClassName}
                    disabled={isSubmitDisabled}
                    type="submit"
                  >
                    <WifiIcon data-icon="inline-start" />
                    Conectar
                  </Button>
                </Box>
              </Form>
            </Box>
          )}

          {hasAccess && step === 'success' && (
            <Box
              aria-live="polite"
              className={cn(cardClassName, 'justify-items-center text-center')}
              role="status"
            >
              <CircleCheckIcon aria-hidden="true" className="size-12 text-primary" />

              <Box className="grid gap-2">
                <Heading className="text-xl sm:text-2xl" level={2}>
                  Você está conectado!
                </Heading>

                <Text className="text-base">
                  A internet foi liberada. Aproveite e seja muito bem-vindo à Comunidade Viva.
                </Text>
              </Box>

              <Link className={homeLinkClassName} to="/">
                Continuar navegando
                <ArrowRightIcon className="size-4" />
              </Link>

              <Text className="text-sm">{redirectMessage}</Text>
            </Box>
          )}
        </Box>
      </Box>

      {isSubmitting && <LoadingOverlay />}
    </Box>
  );
};
