import { TooltipHint } from '@/components/molecules';
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
import { DeleteEmailGroupDialog } from '@/features/communication/presentation/components/delete-email-group-dialog';
import { useEmailGroupsViewModel } from '@/features/communication/presentation/view-models/email-groups.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CircleAlertIcon,
  EllipsisVerticalIcon,
  MailIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  UsersRoundIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Lista dos grupos de e-mails (em ordem alfabética), com edição e exclusão pelo menu de cada grupo.
export const EmailGroupsView = () => {
  const {
    cancelDelete,
    confirmDelete,
    deleteTarget,
    errorNotice,
    isDeleting,
    isLoading,
    isRetrying,
    items,
    openGroup,
    requestDelete,
    retry,
  } = useEmailGroupsViewModel();

  const { t } = useTranslation('communication');

  const hasItems = items.length > 0;

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
          hover:underline
        "
        to="/comunicacao/emails"
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
          to="/comunicacao/emails/grupos/novo"
        >
          <PlusIcon data-icon="inline-start" />
          {t('list.create')}
        </Link>
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
            <UsersRoundIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('list.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <Box className="grid gap-3 lg:grid-cols-2">
          {items.map(({ group, recipientCount }) => (
            <Box
              key={group.id}
              className="
                flex items-center gap-4 rounded-xl border border-border surface-card p-4 shadow-sm
                transition-all duration-200 hover:border-primary/30 hover:shadow-md
              "
            >
              <Box
                aria-hidden="true"
                className="
                  flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10
                  text-primary-strong
                "
              >
                <UsersRoundIcon className="size-5" />
              </Box>

              <Box className="grid min-w-0 flex-1 gap-1">
                <Text className="truncate text-sm font-semibold text-foreground">{group.name}</Text>

                {group.description && (
                  <Text className="truncate text-xs text-muted-foreground">
                    {group.description}
                  </Text>
                )}

                <Box className="flex items-center gap-1.5">
                  <MailIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                  <Text className="text-xs">{recipientCount}</Text>
                </Box>
              </Box>

              <DropdownMenu>
                <TooltipHint label={t('actions.menu')}>
                  <DropdownMenuTrigger
                    aria-label={t('actions.menuNamed', { name: group.name })}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'size-10 shrink-0 data-popup-open:bg-accent',
                    )}
                  >
                    <EllipsisVerticalIcon />
                  </DropdownMenuTrigger>
                </TooltipHint>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="px-2 py-2" onClick={() => openGroup(group)}>
                    <PencilIcon />
                    {t('actions.edit')}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="px-2 py-2"
                    variant="destructive"
                    onClick={() => requestDelete(group)}
                  >
                    <Trash2Icon />
                    {t('actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Box>
          ))}
        </Box>
      )}

      <DeleteEmailGroupDialog
        groupName={deleteTarget?.name ?? null}
        isPending={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};
