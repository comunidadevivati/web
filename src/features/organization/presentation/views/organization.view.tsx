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
import { useOrganizationViewModel } from '@/features/organization/presentation/view-models/organization.view-model';
import { OrganizationFormView } from '@/features/organization/presentation/views/organization-form.view';
import { cn } from '@/lib/utils';
import {
  Building2Icon,
  CircleAlertIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PowerIcon,
  PowerOffIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OrganizationView = () => {
  const {
    cancelStatusChange,
    confirmStatusChange,
    details,
    editFormKey,
    errorNotice,
    isChangingStatus,
    isEditOpen,
    isLoading,
    isRetrying,
    openEdit,
    organization,
    retry,
    setIsEditOpen,
    statusChangeRequest,
    toggleStatus,
  } = useOrganizationViewModel();

  const { t } = useTranslation('organization');

  const isActive = organization?.status === 'ACTIVE';

  return (
    <Box className="grid gap-8">
      <Box>
        <Heading className="text-2xl font-semibold tracking-tight text-foreground">
          {t('organizationPage.title')}
        </Heading>

        <Text className="mt-1 text-muted-foreground">{t('organizationPage.subtitle')}</Text>
      </Box>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !organization && (
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

      {organization && details && (
        <>
          <Card className="relative overflow-hidden border-border surface-card shadow-sm">
            <Box aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-primary" />

            <CardHeader className="grid gap-4 border-b border-border/60 sm:flex sm:items-start">
              <Box className="flex min-w-0 flex-1 items-start gap-4">
                <Box
                  aria-hidden="true"
                  className="
                    flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10
                    text-primary-strong
                  "
                >
                  <Building2Icon className="size-6" />
                </Box>

                <Box className="grid min-w-0 gap-1.5">
                  <Box className="flex flex-wrap items-center gap-2">
                    <Heading
                      className="text-lg font-semibold tracking-tight text-foreground"
                      level={2}
                    >
                      {organization.tradeName}
                    </Heading>

                    <StatusBadge status={organization.status} />
                  </Box>

                  <Text className="text-sm break-words text-muted-foreground">
                    {organization.legalName}
                  </Text>
                </Box>
              </Box>

              <Box className="flex flex-wrap gap-2">
                <Button className="h-10" type="button" variant="outline" onClick={openEdit}>
                  <PencilIcon data-icon="inline-start" />
                  {t('organizationPage.edit')}
                </Button>

                <Button
                  className="h-10"
                  type="button"
                  variant={isActive ? 'destructive' : 'default'}
                  onClick={toggleStatus}
                >
                  {isActive ? (
                    <PowerOffIcon data-icon="inline-start" />
                  ) : (
                    <PowerIcon data-icon="inline-start" />
                  )}
                  {isActive ? t('actions.deactivate') : t('actions.activate')}
                </Button>
              </Box>
            </CardHeader>

            <CardContent className="grid gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-4">
              <DetailItem icon={FileTextIcon} label={t('fields.cnpj')}>
                <Text className="text-foreground">{details.cnpj}</Text>
              </DetailItem>

              <DetailItem icon={PhoneIcon} label={t('fields.phone')}>
                <Text className="text-foreground">{details.phone}</Text>
              </DetailItem>

              <DetailItem icon={MailIcon} label={t('fields.email')}>
                <Text className="break-all text-foreground">{details.email}</Text>
              </DetailItem>

              <DetailItem icon={MapPinIcon} label={t('details.address')}>
                <Text className="text-foreground">{details.addressLine}</Text>

                {details.complement && <Text>{details.complement}</Text>}

                <Text>{details.district}</Text>

                <Text>{details.region}</Text>
              </DetailItem>
            </CardContent>
          </Card>

          <OrganizationFormView
            key={editFormKey}
            open={isEditOpen}
            organization={organization}
            onOpenChange={setIsEditOpen}
          />
        </>
      )}

      <StatusChangeDialog
        isPending={isChangingStatus}
        request={statusChangeRequest}
        onCancel={cancelStatusChange}
        onConfirm={confirmStatusChange}
      />
    </Box>
  );
};
