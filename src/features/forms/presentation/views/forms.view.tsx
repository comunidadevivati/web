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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
} from '@/components/ui';
import type { FormStatusAction } from '@/features/forms/domain/form';
import { DeleteFormDialog } from '@/features/forms/presentation/components/delete-form-dialog';
import { FormPreviewDialog } from '@/features/forms/presentation/components/form-preview-dialog';
import { FormStatusDialog } from '@/features/forms/presentation/components/form-status-dialog';
import {
  FORM_STATUS_FILTERS,
  formStatusTones,
  type FormStatusFilter,
} from '@/features/forms/presentation/models/forms.model';
import { useFormsViewModel } from '@/features/forms/presentation/view-models/forms.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BanIcon,
  BellRingIcon,
  CalendarRangeIcon,
  ChartBarIcon,
  CircleAlertIcon,
  CopyIcon,
  ClipboardListIcon,
  EllipsisVerticalIcon,
  EraserIcon,
  EyeIcon,
  EyeOffIcon,
  InboxIcon,
  ListChecksIcon,
  MailCheckIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  Trash2Icon,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const statusActionIcons: Record<FormStatusAction, LucideIcon> = {
  publish: SendIcon,
  unpublish: EyeOffIcon,
  finish: BadgeCheckIcon,
  cancel: BanIcon,
};

// Lista dos formulários do departamento (Liderança), com filtro por status, pré-visualização e o
// menu de ações de cada formulário (somente as que o status permite).
export const FormsView = () => {
  const {
    cancelDelete,
    cancelStatusChange,
    changePreviewOpen,
    changeStatusFilter,
    confirmDelete,
    confirmStatusChange,
    deleteTarget,
    duplicateForm,
    errorNotice,
    hasNextPage,
    isChangingStatus,
    isDeleting,
    isLoading,
    isLoadingMore,
    isRetrying,
    items,
    loadMore,
    openForm,
    openPreview,
    openReport,
    openResponses,
    preview,
    requestDelete,
    requestStatusChange,
    retry,
    statusFilter,
    statusTarget,
    changeDispatchMessage,
    dispatchMessage,
  } = useFormsViewModel();

  const { t } = useTranslation('forms');

  const hasItems = items.length > 0;

  const statusOptions = FORM_STATUS_FILTERS.map((value) => ({
    value,
    label: value === 'ALL' ? t('list.allStatuses') : t(`status.${value}`),
  }));

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/departamentos/lideranca"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('list.back')}
      </Link>

      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box>
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('list.title')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">{t('list.subtitle')}</Text>
        </Box>

        <Link
          className={cn(buttonVariants(), 'h-11 w-full sm:w-auto sm:px-5')}
          to="/departamentos/lideranca/formularios/novo"
        >
          <PlusIcon data-icon="inline-start" />
          {t('list.create')}
        </Link>
      </Box>

      <Box className="grid gap-2 sm:max-w-xs">
        <Label htmlFor="forms-status-filter">{t('list.statusFilter')}</Label>

        <Select
          items={statusOptions}
          value={statusFilter}
          onValueChange={(next) => changeStatusFilter(next as FormStatusFilter | null)}
        >
          <SelectTrigger id="forms-status-filter">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {statusOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !hasItems && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

            {errorNotice !== 'accessDenied' && (
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
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorNotice && !hasItems && (
        <Card className="border-border surface-card shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <ClipboardListIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">
              {statusFilter === 'ALL' ? t('list.empty') : t('list.emptyFiltered')}
            </Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <Box className="grid gap-3 lg:grid-cols-2">
          {items.map(
            ({
              canDelete,
              canEdit,
              canPurge,
              canRemind,
              purgedSummary,
              emailAction,
              emailSummary,
              form,
              isSendingEmails,
              period,
              questionCount,
              recipientCount,
              statusActions,
            }) => (
              <Box
                key={form.id}
                className="
                  flex items-center gap-4 rounded-xl border border-border surface-card p-4 shadow-sm
                  transition-all duration-200 hover:border-primary/30 hover:shadow-md
                "
              >
                <Box className="flex min-w-0 flex-1 items-start gap-4">
                  <TooltipHint label={t('actions.preview')}>
                    <Button
                      aria-label={t('actions.previewNamed', { title: form.title })}
                      className="
                        size-11 shrink-0 rounded-xl bg-primary/10 text-primary-strong
                        hover:bg-primary/20 hover:text-primary-strong
                      "
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() => openPreview(form)}
                    >
                      <ClipboardListIcon className="size-5" />
                    </Button>
                  </TooltipHint>

                  <Box className="grid min-w-0 flex-1 gap-1.5">
                    <Box className="flex flex-wrap items-center gap-2">
                      <Text className="min-w-0 truncate text-sm font-semibold text-foreground">
                        {form.title}
                      </Text>

                      <StatusBadge
                        label={t(`status.${form.status}`)}
                        tone={formStatusTones[form.status]}
                      />

                      {isSendingEmails && (
                        <Box
                          className="
                            inline-flex h-6 items-center gap-1.5 rounded-full border
                            border-primary/40 bg-primary/10 px-2.5 text-xs font-semibold
                            text-primary-strong
                          "
                          role="status"
                        >
                          <Spinner className="size-3" />
                          {t('emailDispatch.sending')}
                        </Box>
                      )}
                    </Box>

                    <Box className="flex flex-wrap gap-x-4 gap-y-1">
                      <Box className="flex items-center gap-1.5">
                        <CalendarRangeIcon
                          aria-hidden="true"
                          className="size-3.5 text-primary-strong"
                        />

                        <Text className="text-xs">{period}</Text>
                      </Box>

                      <Box className="flex items-center gap-1.5">
                        <ListChecksIcon
                          aria-hidden="true"
                          className="size-3.5 text-primary-strong"
                        />

                        <Text className="text-xs">{questionCount}</Text>
                      </Box>

                      <Box className="flex items-center gap-1.5">
                        <MailIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                        <Text className="text-xs">{recipientCount}</Text>
                      </Box>
                    </Box>

                    {emailSummary && (
                      <Box className="flex items-center gap-1.5">
                        <MailCheckIcon
                          aria-hidden="true"
                          className="size-3.5 text-primary-strong"
                        />

                        <Text className="text-xs text-muted-foreground">{emailSummary}</Text>
                      </Box>
                    )}

                    {purgedSummary && (
                      <Box className="flex items-center gap-1.5">
                        <EraserIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />

                        <Text className="text-xs text-muted-foreground">{purgedSummary}</Text>
                      </Box>
                    )}
                  </Box>
                </Box>

                <DropdownMenu>
                  <TooltipHint
                    label={isSendingEmails ? t('emailDispatch.menuLocked') : t('actions.menu')}
                  >
                    <DropdownMenuTrigger
                      aria-label={t('actions.menuNamed', { title: form.title })}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        'size-10 shrink-0 data-popup-open:bg-accent',
                      )}
                      disabled={isSendingEmails}
                    >
                      <EllipsisVerticalIcon />
                    </DropdownMenuTrigger>
                  </TooltipHint>

                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem className="px-2 py-2" onClick={() => openForm(form)}>
                      {canEdit ? <PencilIcon /> : <EyeIcon />}
                      {canEdit ? t('actions.edit') : t('actions.view')}
                    </DropdownMenuItem>

                    {statusActions.map((action) => {
                      const Icon = statusActionIcons[action];

                      return (
                        <DropdownMenuItem
                          key={action}
                          className="px-2 py-2"
                          onClick={() => requestStatusChange(form, action)}
                        >
                          <Icon />
                          {t(`statusActions.${action}.label`)}
                        </DropdownMenuItem>
                      );
                    })}

                    <DropdownMenuItem className="px-2 py-2" onClick={() => duplicateForm(form)}>
                      <CopyIcon />
                      {t('actions.duplicate')}
                    </DropdownMenuItem>

                    {form.invitedCount > 0 && (
                      <DropdownMenuItem className="px-2 py-2" onClick={() => openResponses(form)}>
                        <InboxIcon />
                        {t('actions.responses')}
                      </DropdownMenuItem>
                    )}

                    {form.invitedCount > 0 && (
                      <DropdownMenuItem className="px-2 py-2" onClick={() => openReport(form)}>
                        <ChartBarIcon />
                        {t('actions.report')}
                      </DropdownMenuItem>
                    )}

                    {canRemind && (
                      <DropdownMenuItem
                        className="px-2 py-2"
                        onClick={() => requestStatusChange(form, 'remindPending')}
                      >
                        <BellRingIcon />
                        {t('statusActions.remindPending.label')}
                      </DropdownMenuItem>
                    )}

                    {canPurge && (
                      <DropdownMenuItem
                        className="px-2 py-2"
                        variant="destructive"
                        onClick={() => requestStatusChange(form, 'purgeAnswers')}
                      >
                        <EraserIcon />
                        {t('statusActions.purgeAnswers.label')}
                      </DropdownMenuItem>
                    )}

                    {emailAction && (
                      <DropdownMenuItem
                        className="px-2 py-2"
                        onClick={() => requestStatusChange(form, emailAction)}
                      >
                        <MailIcon />
                        {t(`statusActions.${emailAction}.label`)}
                      </DropdownMenuItem>
                    )}

                    {canDelete && (
                      <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="px-2 py-2"
                          variant="destructive"
                          onClick={() => requestDelete(form)}
                        >
                          <Trash2Icon />
                          {t('actions.delete')}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Box>
            ),
          )}
        </Box>
      )}

      {hasNextPage && (
        <Button
          aria-busy={isLoadingMore}
          className="mx-auto h-11 px-5"
          disabled={isLoadingMore}
          type="button"
          variant="outline"
          onClick={loadMore}
        >
          {isLoadingMore && <Spinner data-icon="inline-start" />}
          {isLoadingMore ? t('list.loadingMore') : t('list.loadMore')}
        </Button>
      )}

      <DeleteFormDialog
        formTitle={deleteTarget?.title ?? null}
        isPending={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <FormStatusDialog
        isPending={isChangingStatus}
        message={dispatchMessage}
        onMessageChange={changeDispatchMessage}
        target={statusTarget}
        onCancel={cancelStatusChange}
        onConfirm={confirmStatusChange}
      />

      {preview && <FormPreviewDialog open onOpenChange={changePreviewOpen} {...preview} />}
    </Box>
  );
};
