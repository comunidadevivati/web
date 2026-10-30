import { StatusBadge, TooltipHint } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  buttonVariants,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import { FormAnswersDialog } from '@/features/forms/presentation/components/form-answers-dialog';
import { PaperAnswerDialog } from '@/features/forms/presentation/components/paper-answer-dialog';
import { UnmarkPaperAnswerDialog } from '@/features/forms/presentation/components/unmark-paper-answer-dialog';
import { useFormResponsesViewModel } from '@/features/forms/presentation/view-models/form-responses.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CalendarRangeIcon,
  ChartBarIcon,
  CircleAlertIcon,
  EllipsisVerticalIcon,
  ExternalLinkIcon,
  EyeIcon,
  FileTextIcon,
  FileUpIcon,
  InboxIcon,
  MailIcon,
  PaperclipIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  Undo2Icon,
  UserRoundIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Respostas de um formulário: quem recebeu o convite por e-mail, quem respondeu (pelo link ou em
// papel) e as ações de cada um (ver e imprimir respostas digitais, registrar resposta em papel com
// anexo, baixar o anexo e desfazer o registro).
export const FormResponsesView = () => {
  const {
    answeredCount,
    answersDialog,
    closeAnswers,
    closePaperDialog,
    closeUnmarkDialog,
    confirmPaper,
    confirmUnmark,
    errorNotice,
    form,
    formId,
    invitedCount,
    isLoading,
    isRegistering,
    isRetrying,
    isUnmarking,
    items,
    openAnswers,
    openAttachment,
    openPaperDialog,
    openUnmarkDialog,
    paperDialog,
    paperFile,
    paperIssue,
    period,
    openPdf,
    retry,
    selectPaperFile,
    unmarkName,
  } = useFormResponsesViewModel();

  const { t } = useTranslation('forms');

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/departamentos/lideranca/formularios"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('editor.backToList')}
      </Link>

      <Box>
        <Heading className="text-2xl font-semibold tracking-tight text-foreground">
          {t('responses.title')}
        </Heading>

        {form && <Text className="mt-1 text-muted-foreground">{form.title}</Text>}

        <Link
          className="
            mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
            hover:underline
          "
          params={{ formId }}
          to="/departamentos/lideranca/formularios/$formId/relatorio"
        >
          <ChartBarIcon aria-hidden="true" className="size-4" />
          {t('responses.toReport')}
        </Link>

        {form && (
          <Box className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <Box className="flex items-center gap-1.5">
              <CalendarRangeIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

              <Text className="text-xs">{period}</Text>
            </Box>

            <Box className="flex items-center gap-1.5">
              <InboxIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

              <Text className="text-xs">
                {t('responses.summary', { answered: answeredCount, invited: invitedCount })}
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {form?.anonymous && (
        <Alert>
          <ShieldCheckIcon />

          <AlertTitle>{t('responses.anonymous.title')}</AlertTitle>

          <AlertDescription>{t('responses.anonymous.description')}</AlertDescription>
        </Alert>
      )}

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
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorNotice && items.length === 0 && (
        <Card className="border-border surface-card shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <InboxIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('responses.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {items.length > 0 && (
        <Box className="grid gap-3 lg:grid-cols-2">
          {items.map(
            ({
              attachment,
              date,
              delivery,
              deliveryProblem,
              invitation,
              state,
              stateLabel,
              stateTone,
            }) => (
              <Box
                key={invitation.id}
                className="
                  flex items-center gap-4 rounded-xl border border-border surface-card p-4 shadow-sm
                "
              >
                <Box
                  aria-hidden="true"
                  className="
                    flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10
                    text-primary-strong
                  "
                >
                  <UserRoundIcon className="size-5" />
                </Box>

                <Box className="grid min-w-0 flex-1 gap-1">
                  <Box className="flex flex-wrap items-center gap-2">
                    <Text className="min-w-0 truncate text-sm font-semibold text-foreground">
                      {invitation.recipientName}
                    </Text>

                    <StatusBadge label={stateLabel} tone={stateTone} />
                  </Box>

                  <Text className="truncate text-xs text-muted-foreground">
                    {invitation.recipientEmail}
                  </Text>

                  <Text className="text-xs">{date}</Text>

                  {delivery && (
                    <Box className="flex items-center gap-1.5">
                      <MailIcon
                        aria-hidden="true"
                        className={cn(
                          'size-3.5',
                          deliveryProblem ? 'text-destructive-strong' : 'text-primary-strong',
                        )}
                      />

                      <Text className={cn('text-xs', deliveryProblem && 'text-destructive-strong')}>
                        {delivery}
                      </Text>
                    </Box>
                  )}

                  {attachment && (
                    <Box className="flex min-w-0 items-center gap-1.5">
                      <PaperclipIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="truncate text-xs">{attachment}</Text>
                    </Box>
                  )}
                </Box>

                {(state !== 'DIGITAL' || !form?.anonymous) && (
                  <DropdownMenu>
                    <TooltipHint label={t('actions.menu')}>
                      <DropdownMenuTrigger
                        aria-label={t('responses.menuNamed', { name: invitation.recipientName })}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'icon' }),
                          'size-10 shrink-0 data-popup-open:bg-accent',
                        )}
                      >
                        <EllipsisVerticalIcon />
                      </DropdownMenuTrigger>
                    </TooltipHint>

                    <DropdownMenuContent align="end" className="w-64">
                      {state === 'DIGITAL' && !form?.anonymous && (
                        <DropdownMenuItem
                          className="px-2 py-2"
                          onClick={() => openAnswers(invitation)}
                        >
                          <EyeIcon />
                          {t('responses.actions.viewAnswers')}
                        </DropdownMenuItem>
                      )}

                      {state === 'PENDING' && (
                        <DropdownMenuItem
                          className="px-2 py-2"
                          onClick={() => openPaperDialog(invitation)}
                        >
                          <FileTextIcon />
                          {t('responses.actions.markPaper')}
                        </DropdownMenuItem>
                      )}

                      {state === 'PAPER' && (
                        <>
                          {invitation.paperAttachment && (
                            <DropdownMenuItem
                              className="px-2 py-2"
                              onClick={() => openAttachment(invitation)}
                            >
                              <ExternalLinkIcon />
                              {invitation.paperAttachment.contentType === 'application/pdf'
                                ? t('responses.actions.openPdf')
                                : t('responses.actions.openImage')}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem
                            className="px-2 py-2"
                            onClick={() => openPaperDialog(invitation)}
                          >
                            <FileUpIcon />
                            {invitation.paperAttachment
                              ? t('responses.actions.replaceAttachment')
                              : t('responses.actions.attach')}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="px-2 py-2"
                            variant="destructive"
                            onClick={() => openUnmarkDialog(invitation)}
                          >
                            <Undo2Icon />
                            {t('responses.actions.unmark')}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Box>
            ),
          )}
        </Box>
      )}

      <FormAnswersDialog answers={answersDialog} onClose={closeAnswers} onOpenPdf={openPdf} />

      <PaperAnswerDialog
        file={paperFile}
        isPending={isRegistering}
        issue={paperIssue}
        target={paperDialog}
        onCancel={closePaperDialog}
        onConfirm={confirmPaper}
        onSelectFile={selectPaperFile}
      />

      <UnmarkPaperAnswerDialog
        isPending={isUnmarking}
        recipientName={unmarkName}
        onCancel={closeUnmarkDialog}
        onConfirm={confirmUnmark}
      />
    </Box>
  );
};
