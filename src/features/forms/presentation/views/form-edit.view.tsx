import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Spinner,
} from '@/components/ui';
import { useFormEditViewModel } from '@/features/forms/presentation/view-models/form-edit.view-model';
import { FormEditorView } from '@/features/forms/presentation/views/form-editor.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { CircleAlertIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Carrega o formulário da URL e abre o editor. A cada versão salva o editor recomeça com os dados
// atualizados do servidor.
export const FormEditView = () => {
  const { errorNotice, form, isLoading, isRetrying, retry } = useFormEditViewModel();

  const { t } = useTranslation('forms');

  if (form) {
    return <FormEditorView key={`${form.id}:${form.version}`} form={form} />;
  }

  return (
    <Box className="grid gap-6">
      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

            <Box className="flex flex-wrap gap-2">
              {errorNotice === 'unavailable' && (
                <Button
                  className="w-fit"
                  disabled={isRetrying}
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={retry}
                >
                  <RefreshCwIcon
                    className={cn(isRetrying && 'animate-spin')}
                    data-icon="inline-start"
                  />
                  {t('actions.retry')}
                </Button>
              )}

              <Link
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-fit')}
                to="/departamentos/lideranca/formularios"
              >
                {t('editor.backToList')}
              </Link>
            </Box>
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
};
