import {
  Box,
  Button,
  Card,
  CardContent,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
} from '@/components/ui';
import { useFormCreateViewModel } from '@/features/forms/presentation/view-models/form-create.view-model';
import { FormEditorView } from '@/features/forms/presentation/views/form-editor.view';
import { CopyIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Novo formulário: em branco (editor abaixo) ou copiando um existente como modelo.
export const FormCreateView = () => {
  const { changeTemplate, isCopying, templateId, templates, applyTemplate } =
    useFormCreateViewModel();

  const { t } = useTranslation('forms');

  return (
    <Box className="grid gap-6">
      {templates.length > 0 && (
        <Card className="border-border surface-card shadow-sm">
          <CardContent className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Box className="grid gap-2">
              <Label htmlFor="form-template">{t('templates.label')}</Label>

              <Select
                disabled={isCopying}
                items={templates}
                value={templateId}
                onValueChange={(next) => changeTemplate((next as string | null) ?? null)}
              >
                <SelectTrigger id="form-template">
                  <SelectValue placeholder={t('templates.placeholder')} />
                </SelectTrigger>

                <SelectContent>
                  {templates.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Text className="text-xs text-muted-foreground">{t('templates.hint')}</Text>
            </Box>

            <Button
              aria-busy={isCopying}
              className="h-11 sm:px-5"
              disabled={!templateId || isCopying}
              type="button"
              variant="outline"
              onClick={applyTemplate}
            >
              {isCopying ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <CopyIcon data-icon="inline-start" />
              )}
              {t('templates.use')}
            </Button>
          </CardContent>
        </Card>
      )}

      <FormEditorView form={null} />
    </Box>
  );
};
