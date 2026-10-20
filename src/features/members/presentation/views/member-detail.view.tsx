import { CardSectionHeader } from '@/components/molecules';
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
import { ConfirmActionDialog } from '@/features/members/presentation/components/confirm-action-dialog';
import {
  MemberStatusBadge,
  MembershipStatusBadge,
} from '@/features/members/presentation/components/member-status-badge';
import { useMemberDetailViewModel } from '@/features/members/presentation/view-models/member-detail.view-model';
import { MembershipFormView } from '@/features/members/presentation/views/membership-form.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ArrowLeftIcon,
  CakeIcon,
  ChurchIcon,
  CircleAlertIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  PowerIcon,
  PowerOffIcon,
  RefreshCwIcon,
  StarIcon,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const memberActionIcons: Record<'activate' | 'deactivate' | 'archive' | 'restore', LucideIcon> = {
  activate: PowerIcon,
  deactivate: PowerOffIcon,
  archive: ArchiveIcon,
  restore: ArchiveRestoreIcon,
};

// Ficha do membro (rota /membros/$memberId).
export const MemberDetailView = () => {
  const {
    cancelAction,
    canAddMembership,
    confirmAction,
    confirmContent,
    errorNotice,
    formKey,
    hasMembershipsError,
    isLoading,
    isLoadingMemberships,
    isMembershipFormOpen,
    isRetrying,
    isRunningAction,
    member,
    memberActions,
    membershipItems,
    openMembershipForm,
    profile,
    requestMemberAction,
    requestMembershipAction,
    retry,
    setIsMembershipFormOpen,
  } = useMemberDetailViewModel();

  const { t } = useTranslation('members');

  return (
    <Box className="grid gap-6">
      <Link
        className="
          inline-flex h-10 w-fit items-center gap-2 rounded-lg text-sm font-medium
          text-primary-strong hover:underline
        "
        to="/membros"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t('detailPage.back')}
      </Link>

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && !member && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

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
          </AlertDescription>
        </Alert>
      )}

      {member && profile && (
        <>
          <Card className="relative overflow-hidden border-border surface-card shadow-sm">
            <Box aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-primary" />

            <CardHeader className="grid gap-4 border-b border-border/60 sm:flex sm:items-start">
              <Box className="flex min-w-0 flex-1 items-start gap-4">
                <Box
                  aria-hidden="true"
                  className="
                    flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10
                    font-semibold text-primary-strong uppercase
                  "
                >
                  {member.person.fullName.slice(0, 2)}
                </Box>

                <Box className="grid min-w-0 gap-1.5">
                  <Box className="flex flex-wrap items-center gap-2">
                    <Heading className="text-xl font-semibold break-words text-foreground">
                      {member.person.fullName}
                    </Heading>

                    <MemberStatusBadge status={member.status} />
                  </Box>

                  <Text>{t('detailPage.profile')}</Text>
                </Box>
              </Box>

              <Box className="flex flex-wrap gap-2">
                {memberActions.map((action) => {
                  const Icon = memberActionIcons[action];

                  return (
                    <Button
                      key={action}
                      className="h-10"
                      type="button"
                      variant={
                        action === 'deactivate' || action === 'archive' ? 'destructive' : 'default'
                      }
                      onClick={() => requestMemberAction(action)}
                    >
                      <Icon data-icon="inline-start" />
                      {t(`actions.${action}`)}
                    </Button>
                  );
                })}
              </Box>
            </CardHeader>

            <CardContent className="grid gap-5 pt-2 sm:grid-cols-3">
              {[
                { icon: CakeIcon, label: t('fields.birthDate'), value: profile.birthDate },
                { icon: PhoneIcon, label: t('fields.phone'), value: profile.phone },
                { icon: MailIcon, label: t('fields.email'), value: profile.email },
              ].map(({ icon: Icon, label, value }) => (
                <Box key={label} className="flex min-w-0 items-start gap-3">
                  <Box
                    aria-hidden="true"
                    className="
                      flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10
                      text-primary-strong
                    "
                  >
                    <Icon className="size-4" />
                  </Box>

                  <Box className="grid min-w-0 gap-1">
                    <Text className="text-xs font-medium tracking-wide uppercase">{label}</Text>

                    <Text className="text-sm break-all text-foreground">
                      {value ?? t('detailPage.notInformed')}
                    </Text>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border surface-card shadow-sm">
            <CardSectionHeader
              description={t('detailPage.membershipsDescription')}
              icon={ChurchIcon}
              title={t('detailPage.memberships')}
            />

            <CardContent className="grid gap-3 pt-4">
              <Box className="flex flex-wrap items-center justify-between gap-3">
                {!canAddMembership && <Text>{t('detailPage.inactiveHint')}</Text>}

                <Button
                  className="ml-auto h-10"
                  disabled={!canAddMembership}
                  type="button"
                  onClick={openMembershipForm}
                >
                  <LinkIcon data-icon="inline-start" />
                  {t('detailPage.addMembership')}
                </Button>
              </Box>

              {isLoadingMemberships && (
                <Box className="flex justify-center py-6">
                  <Spinner className="size-6 text-primary-strong" />
                </Box>
              )}

              {hasMembershipsError && (
                <Alert variant="destructive">
                  <CircleAlertIcon />

                  <AlertTitle>{t('notices.unavailable.title')}</AlertTitle>

                  <AlertDescription>{t('notices.unavailable.description')}</AlertDescription>
                </Alert>
              )}

              {!isLoadingMemberships && !hasMembershipsError && membershipItems.length === 0 && (
                <Text className="py-6 text-center">{t('detailPage.membershipsEmpty')}</Text>
              )}

              {membershipItems.map(
                ({ congregationCode, congregationName, endedOn, membership, startedOn }) => (
                  <Box
                    key={membership.id}
                    className={cn(
                      `
                        relative flex flex-wrap items-center gap-3 overflow-hidden rounded-xl border
                        border-border p-4
                      `,
                      membership.status === 'INACTIVE' && 'opacity-80',
                    )}
                  >
                    <Box
                      aria-hidden="true"
                      className={cn(
                        'absolute top-0 left-0 h-full w-1',
                        membership.status === 'ACTIVE' ? 'bg-primary' : 'bg-border',
                      )}
                    />

                    <Box className="grid min-w-0 flex-1 gap-1.5">
                      <Box className="flex flex-wrap items-center gap-2">
                        <Text className="text-sm font-semibold text-foreground">
                          {congregationName}
                        </Text>

                        {congregationCode && (
                          <Text className="font-mono text-xs tracking-wider">
                            {congregationCode}
                          </Text>
                        )}

                        <MembershipStatusBadge status={membership.status} />

                        {membership.primary && (
                          <Box
                            className="
                              inline-flex h-6 items-center gap-1 rounded-full border
                              border-primary/30 bg-primary/10 px-2.5
                            "
                          >
                            <StarIcon aria-hidden="true" className="size-3 text-primary-strong" />

                            <Text className="text-xs font-semibold text-primary-strong">
                              {t('detailPage.primary')}
                            </Text>
                          </Box>
                        )}
                      </Box>

                      {(startedOn ?? endedOn) && (
                        <Box className="flex flex-wrap gap-x-4 gap-y-1">
                          {startedOn && <Text className="text-xs">{startedOn}</Text>}

                          {endedOn && <Text className="text-xs">{endedOn}</Text>}
                        </Box>
                      )}
                    </Box>

                    <Box className="flex gap-2">
                      {membership.status === 'PENDING' && (
                        <Button
                          className="h-10"
                          size="sm"
                          type="button"
                          onClick={() =>
                            requestMembershipAction(membership, 'activate', congregationName)
                          }
                        >
                          <PowerIcon data-icon="inline-start" />
                          {t('actions.activate')}
                        </Button>
                      )}

                      {membership.status !== 'INACTIVE' && (
                        <Button
                          className="h-10"
                          size="sm"
                          type="button"
                          variant="destructive"
                          onClick={() =>
                            requestMembershipAction(membership, 'deactivate', congregationName)
                          }
                        >
                          <PowerOffIcon data-icon="inline-start" />
                          {t('actions.end')}
                        </Button>
                      )}
                    </Box>
                  </Box>
                ),
              )}
            </CardContent>
          </Card>

          <MembershipFormView
            key={`membership-${formKey}`}
            member={member}
            open={isMembershipFormOpen}
            onOpenChange={setIsMembershipFormOpen}
          />
        </>
      )}

      <ConfirmActionDialog
        content={confirmContent}
        isPending={isRunningAction}
        onCancel={cancelAction}
        onConfirm={confirmAction}
      />
    </Box>
  );
};
