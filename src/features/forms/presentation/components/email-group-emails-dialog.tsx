import {
  Box,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Text,
} from '@/components/ui';
import type { RecipientEntry } from '@/features/forms/presentation/view-models/form-recipients.view-model';
import { useTranslation } from 'react-i18next';

type EmailGroupEmailsDialogProps = {
  // Grupo exibido; null mantém o diálogo fechado.
  group: { name: string; entries: RecipientEntry[]; ineligibleCount: number } | null;
  onClose: () => void;
};

// Somente os e-mails de um grupo (contas elegíveis com o nome e e-mails avulsos), para conferência.
export const EmailGroupEmailsDialog = ({ group, onClose }: EmailGroupEmailsDialogProps) => {
  const { t } = useTranslation('forms');

  return (
    <Dialog
      open={group !== null}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="gap-4 p-5 sm:max-w-lg sm:p-6"
        closeLabel={t('recipients.dialog.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">{group?.name}</DialogTitle>

          <DialogDescription>
            {t('recipients.dialog.count', { count: group?.entries.length ?? 0 })}
          </DialogDescription>
        </DialogHeader>

        {group && group.entries.length === 0 && (
          <Text className="text-sm text-muted-foreground">{t('recipients.dialog.empty')}</Text>
        )}

        {group && group.entries.length > 0 && (
          <Box
            className="grid max-h-[60vh] overflow-y-auto rounded-lg border border-border"
            role="list"
          >
            {group.entries.map(({ email, name }) => (
              <Box
                key={email}
                className="grid gap-0.5 border-b border-border px-3 py-2 last:border-b-0"
                role="listitem"
              >
                <Text className="truncate text-sm text-foreground">{email}</Text>

                <Text className="text-xs text-muted-foreground">
                  {name ?? t('recipients.dialog.external')}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        {group && group.ineligibleCount > 0 && (
          <Text className="text-xs text-muted-foreground">
            {t('recipients.dialog.ineligible', { count: group.ineligibleCount })}
          </Text>
        )}
      </DialogContent>
    </Dialog>
  );
};
