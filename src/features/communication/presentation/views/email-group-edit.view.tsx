import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Spinner,
} from '@/components/ui';
import { useEmailGroupEditViewModel } from '@/features/communication/presentation/view-models/email-group-edit.view-model';
import { EmailGroupEditorView } from '@/features/communication/presentation/views/email-group-editor.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { CircleAlertIcon, RefreshCwIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Carrega o grupo da URL e abre o editor. A cada versão salva o editor recomeça com os dados
// atualizados do servidor.
export const EmailGroupEditView = () => {
  const { errorNotice, group, isLoading, isRetrying, retry } = useEmailGroupEditViewModel();

  const { t } = useTranslation('communication');

  if (group) {
    return <EmailGroupEditorView key={`${group.id}:${group.version}`} group={group} />;
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
                to="/comunicacao/emails/grupos"
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
