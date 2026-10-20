import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@/components/ui';
import { useMemberCreateViewModel } from '@/features/members/presentation/view-models/member-create.view-model';
import { cn } from '@/lib/utils';
import { CircleAlertIcon, LinkIcon, RefreshCwIcon, UsersRoundIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type MemberCreateViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Modal "Criar membro": um membro nunca é cadastrado do zero; ele é gerado a partir de contas com
// e-mail verificado. Converte uma conta pelo botão da linha ou as marcadas por "Vincular todos".
export const MemberCreateView = ({ onOpenChange, open }: MemberCreateViewProps) => {
  const {
    candidates,
    canLinkSelected,
    errorNotice,
    handleOpenChange,
    handleOpenChangeComplete,
    hasNextPage,
    isAllSelected,
    isLinking,
    isLinkingSelected,
    isLoading,
    isLoadingMore,
    isRetrying,
    link,
    linkSelected,
    loadMore,
    retry,
    selectedCount,
    toggleAll,
    toggleSelected,
  } = useMemberCreateViewModel({ open, onOpenChange });

  const { t } = useTranslation('members');

  const hasItems = candidates.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, { reason }) => handleOpenChange(nextOpen, reason)}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto p-5 sm:max-w-3xl sm:p-6"
        closeDisabled={isLinking}
        closeLabel={t('memberCreate.close')}
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {t('memberCreate.title')}
          </DialogTitle>

          <DialogDescription>{t('memberCreate.description')}</DialogDescription>
        </DialogHeader>

        <Box className="flex flex-wrap items-center justify-between gap-3">
          <Text aria-live="polite" className="text-sm">
            {t('memberCreate.selected', { count: selectedCount })}
          </Text>

          <Button
            aria-busy={isLinkingSelected}
            className="h-11 w-full sm:w-auto sm:px-5"
            disabled={!canLinkSelected}
            type="button"
            onClick={linkSelected}
          >
            {isLinkingSelected ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LinkIcon data-icon="inline-start" />
            )}
            {isLinkingSelected ? t('memberCreate.linking') : t('memberCreate.linkAll')}
          </Button>
        </Box>

        {isLoading && (
          <Box className="flex min-h-40 items-center justify-center">
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
          <Box className="flex flex-col items-center gap-3 rounded-xl border border-border py-10">
            <UsersRoundIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="px-4 text-center">{t('memberCreate.empty')}</Text>
          </Box>
        )}

        {hasItems && (
          <Box className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      aria-label={t('memberCreate.selectAll')}
                      checked={isAllSelected}
                      disabled={isLinking}
                      onChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>{t('memberCreate.columns.user')}</TableHead>

                  <TableHead className="hidden sm:table-cell">
                    {t('memberCreate.columns.phone')}
                  </TableHead>

                  <TableHead className="text-right">{t('memberCreate.columns.action')}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {candidates.map(({ isLinking: isLinkingRow, isSelected, phone, user }) => (
                  <TableRow key={user.id} data-state={isSelected ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={t('memberCreate.select', { name: user.name })}
                        checked={isSelected}
                        disabled={isLinking}
                        onChange={() => toggleSelected(user.id)}
                      />
                    </TableCell>

                    <TableCell className="max-w-64">
                      <Box className="grid min-w-0 gap-0.5">
                        <Text className="truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </Text>

                        <Text className="truncate text-xs">{user.email}</Text>
                      </Box>
                    </TableCell>

                    <TableCell className="hidden whitespace-nowrap sm:table-cell">
                      <Text className="text-sm text-foreground">
                        {phone ?? t('detailPage.notInformed')}
                      </Text>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        aria-busy={isLinkingRow}
                        aria-label={t('memberCreate.linkUser', { name: user.name })}
                        className="h-9 px-3"
                        disabled={isLinking}
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => link(user)}
                      >
                        {isLinkingRow ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <LinkIcon data-icon="inline-start" />
                        )}
                        {t('memberCreate.link')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {hasNextPage && (
          <Button
            aria-busy={isLoadingMore}
            className="mx-auto h-11 px-5"
            disabled={isLoadingMore || isLinking}
            type="button"
            variant="outline"
            onClick={loadMore}
          >
            {isLoadingMore && <Spinner data-icon="inline-start" />}
            {isLoadingMore ? t('listPage.loadingMore') : t('listPage.loadMore')}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
