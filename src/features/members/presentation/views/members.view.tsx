import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Form,
  Heading,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
} from '@/components/ui';
import { MemberStatusBadge } from '@/features/members/presentation/components/member-status-badge';
import { useMembersViewModel } from '@/features/members/presentation/view-models/members.view-model';
import { MemberFormView } from '@/features/members/presentation/views/member-form.view';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  CakeIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const MembersView = () => {
  const {
    congregationFilter,
    congregationOptions,
    createFormKey,
    errorNotice,
    filters,
    hasNextPage,
    isCreateOpen,
    isLoading,
    isLoadingMore,
    isRetrying,
    items,
    loadMore,
    openCreate,
    retry,
    searchDraft,
    setCongregationFilter,
    setIsCreateOpen,
    setSearchDraft,
    setStatusFilter,
    submitSearch,
  } = useMembersViewModel();

  const { t } = useTranslation('members');

  const hasItems = items.length > 0;

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box>
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('listPage.title')}
          </Heading>

          <Text className="mt-1 text-muted-foreground">{t('listPage.subtitle')}</Text>
        </Box>

        <Button className="h-11 w-full sm:w-auto sm:px-5" type="button" onClick={openCreate}>
          <PlusIcon data-icon="inline-start" />
          {t('listPage.create')}
        </Button>
      </Box>

      <Box className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Form className="grid gap-2" role="search" onSubmit={submitSearch}>
          <Label htmlFor="members-search">{t('listPage.searchLabel')}</Label>

          <Box className="flex gap-2">
            <Input
              id="members-search"
              autoComplete="off"
              maxLength={120}
              placeholder={t('listPage.searchPlaceholder')}
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
            />

            <Button className="h-11 shrink-0 px-4" type="submit" variant="outline">
              <SearchIcon data-icon="inline-start" />
              {t('listPage.search')}
            </Button>
          </Box>
        </Form>

        <Box className="grid gap-2">
          <Label htmlFor="members-congregation">{t('listPage.congregationLabel')}</Label>

          <Select
            items={congregationOptions}
            value={congregationFilter}
            onValueChange={(next) => setCongregationFilter(next ?? congregationFilter)}
          >
            <SelectTrigger id="members-congregation">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {congregationOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Box>
      </Box>

      <Box
        aria-label={t('listPage.statusFilterLabel')}
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
            <UsersIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('listPage.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <Box className="grid gap-3 lg:grid-cols-2">
          {items.map(({ birthDate, member, phone }) => (
            <Link
              key={member.id}
              className="
                group relative flex items-center gap-4 overflow-hidden rounded-xl border
                border-border surface-card p-4 shadow-sm transition-all duration-200
                hover:border-primary/30 hover:shadow-md
              "
              params={{ memberId: member.id }}
              to="/membros/$memberId"
            >
              <Box
                aria-hidden="true"
                className="
                  flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm
                  font-semibold text-primary-strong uppercase
                "
              >
                {member.fullName.slice(0, 2)}
              </Box>

              <Box className="grid min-w-0 flex-1 gap-1.5">
                <Box className="flex flex-wrap items-center gap-2">
                  <Text className="truncate text-sm font-semibold text-foreground">
                    {member.fullName}
                  </Text>

                  <MemberStatusBadge status={member.status} />
                </Box>

                <Box className="flex flex-wrap gap-x-4 gap-y-1">
                  {phone && (
                    <Box className="flex items-center gap-1.5">
                      <PhoneIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="text-xs">{phone}</Text>
                    </Box>
                  )}

                  {member.email && (
                    <Box className="flex min-w-0 items-center gap-1.5">
                      <MailIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="truncate text-xs">{member.email}</Text>
                    </Box>
                  )}

                  {birthDate && (
                    <Box className="flex items-center gap-1.5">
                      <CakeIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                      <Text className="text-xs">{birthDate}</Text>
                    </Box>
                  )}
                </Box>
              </Box>

              <ChevronRightIcon
                aria-hidden="true"
                className="
                  size-5 shrink-0 text-muted-foreground transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </Link>
          ))}
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
          {isLoadingMore ? t('listPage.loadingMore') : t('listPage.loadMore')}
        </Button>
      )}

      <MemberFormView
        key={createFormKey}
        member={null}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </Box>
  );
};
