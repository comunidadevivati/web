import { TooltipHint } from '@/components/molecules';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import { DetailItem } from '@/features/organization/presentation/components/detail-item';
import { StatusBadge } from '@/features/organization/presentation/components/status-badge';
import { StatusChangeDialog } from '@/features/organization/presentation/components/status-change-dialog';
import { useCongregationsViewModel } from '@/features/organization/presentation/view-models/congregations.view-model';
import { CongregationFormView } from '@/features/organization/presentation/views/congregation-form.view';
import { cn } from '@/lib/utils';
import {
  ChurchIcon,
  CircleAlertIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  PowerIcon,
  PowerOffIcon,
  RefreshCwIcon,
  StarIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CongregationsView = () => {
  const {
    cancelStatusChange,
    confirmStatusChange,
    errorNotice,
    filters,
    formCongregation,
    formKey,
    hasNextPage,
    isChangingStatus,
    isFormOpen,
    isLoading,
    isLoadingMore,
    isRetrying,
    items,
    loadMore,
    openCreate,
    openEdit,
    retry,
    setIsFormOpen,
    setStatusFilter,
    statusChangeRequest,
    toggleStatus,
  } = useCongregationsViewModel();

  const { t } = useTranslation('organization');

  const hasItems = items.length > 0;

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box>
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('congregationsPage.title')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">{t('congregationsPage.subtitle')}</Text>
        </Box>

        <Button className="h-11 w-full sm:w-auto sm:px-5" type="button" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          {t('congregationsPage.create')}
        </Button>
      </Box>

      <Box
        aria-label={t('congregationsPage.filterLabel')}
        className="flex flex-wrap gap-2"
        role="group"
      >
        {filters.map(({ isSelected, label, value }) => (
          <Button
            key={value}
            aria-pressed={isSelected}
            className="h-10 rounded-full px-4"
            size="sm"
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </Button>
        ))}
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
            <ChurchIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('congregationsPage.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <Box className="grid gap-4 lg:grid-cols-2">
          {items.map(({ addressLine, congregation, phone, region }) => {
            const { email, headquarters, id, code, name, status } = congregation;

            const isActive = status === 'ACTIVE';

            const statusLabel = isActive
              ? t('congregationsPage.deactivateLabel', { name })
              : t('congregationsPage.activateLabel', { name });

            return (
              <Card
                key={id}
                className="
                  relative overflow-hidden border-border surface-card shadow-sm transition-shadow
                  duration-200 hover:shadow-md
                "
              >
                <Box
                  aria-hidden="true"
                  className={cn(
                    'absolute top-0 left-0 h-full w-1',
                    isActive ? 'bg-primary' : 'bg-border',
                  )}
                />

                <CardHeader className="flex items-start justify-between gap-3">
                  <Box className="grid min-w-0 gap-1.5">
                    <Box className="flex flex-wrap items-center gap-2">
                      <Heading
                        className="text-base font-semibold tracking-tight text-foreground"
                        level={2}
                      >
                        {name}
                      </Heading>

                      <StatusBadge status={status} />

                      {headquarters && (
                        <Box
                          className="
                            inline-flex h-6 items-center gap-1 rounded-full border border-primary/30
                            bg-primary/10 px-2.5
                          "
                        >
                          <StarIcon aria-hidden="true" className="size-3 text-primary-strong" />

                          <Text className="text-xs font-semibold text-primary-strong">
                            {t('congregationsPage.headquarters')}
                          </Text>
                        </Box>
                      )}
                    </Box>

                    <Text className="font-mono text-xs tracking-wider">{code}</Text>
                  </Box>

                  <Box className="flex shrink-0 gap-1">
                    <TooltipHint label={t('congregationsPage.editLabel', { name })}>
                      <Button
                        aria-label={t('congregationsPage.editLabel', { name })}
                        size="icon-lg"
                        type="button"
                        variant="ghost"
                        onClick={() => openEdit(congregation)}
                      >
                        <PencilIcon />
                      </Button>
                    </TooltipHint>

                    <TooltipHint label={statusLabel}>
                      <Button
                        aria-label={statusLabel}
                        size="icon-lg"
                        type="button"
                        variant={isActive ? 'destructive' : 'ghost'}
                        onClick={() => toggleStatus(congregation)}
                      >
                        {isActive ? <PowerOffIcon /> : <PowerIcon />}
                      </Button>
                    </TooltipHint>
                  </Box>
                </CardHeader>

                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <DetailItem icon={MapPinIcon} label={t('details.address')}>
                    <Text className="text-foreground">{addressLine}</Text>

                    <Text>{region}</Text>
                  </DetailItem>

                  <DetailItem icon={phone ? PhoneIcon : MailIcon} label={t('details.contact')}>
                    {!phone && !email && <Text>{t('details.notInformed')}</Text>}

                    {phone && <Text className="text-foreground">{phone}</Text>}

                    {email && <Text className="break-all text-foreground">{email}</Text>}
                  </DetailItem>
                </CardContent>
              </Card>
            );
          })}
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
          {isLoadingMore ? t('congregationsPage.loadingMore') : t('congregationsPage.loadMore')}
        </Button>
      )}

      <CongregationFormView
        key={formKey}
        congregation={formCongregation}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <StatusChangeDialog
        isPending={isChangingStatus}
        request={statusChangeRequest}
        onCancel={cancelStatusChange}
        onConfirm={confirmStatusChange}
      />
    </Box>
  );
};
