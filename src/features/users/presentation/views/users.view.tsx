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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@/components/ui';
import { UserActionDialog } from '@/features/users/presentation/components/user-action-dialog';
import {
  CurrentUserBadge,
  UserStatusBadge,
  UserVerificationBadge,
} from '@/features/users/presentation/components/user-badges';
import { UserRowActions } from '@/features/users/presentation/components/user-row-actions';
import { useUsersViewModel } from '@/features/users/presentation/view-models/users.view-model';
import { UserCreateFormView } from '@/features/users/presentation/views/user-create-form.view';
import { UserEditFormView } from '@/features/users/presentation/views/user-edit-form.view';
import { cn } from '@/lib/utils';
import {
  CircleAlertIcon,
  PhoneIcon,
  RefreshCwIcon,
  SearchIcon,
  UserPlusIcon,
  UsersRoundIcon,
  XIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UsersView = () => {
  const {
    actionRequest,
    cancelAction,
    confirmAction,
    editingUser,
    errorNotice,
    filters,
    formKey,
    hasNextPage,
    isCreateOpen,
    isEditOpen,
    isLoading,
    isLoadingMore,
    isRetrying,
    isRunningAction,
    items,
    loadMore,
    openCreate,
    openEdit,
    requestAction,
    retry,
    searchDraft,
    setIsCreateOpen,
    setIsEditOpen,
    setSearchDraft,
    submitSearch,
    toggleFilter,
  } = useUsersViewModel();

  const { t } = useTranslation('users');

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
          <UserPlusIcon data-icon="inline-start" />
          {t('listPage.create')}
        </Button>
      </Box>

      <Form className="grid gap-2 lg:max-w-2xl" role="search" onSubmit={submitSearch}>
        <Label htmlFor="users-search">{t('listPage.searchLabel')}</Label>

        <Box className="flex gap-2">
          <Input
            id="users-search"
            autoComplete="off"
            maxLength={254}
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

      <Box aria-label={t('listPage.filtersLabel')} className="flex flex-wrap gap-2" role="group">
        {filters.map(({ isRemovable, isSelected, label, removeLabel, value }) => (
          <Button
            key={value}
            aria-label={isRemovable ? removeLabel : undefined}
            aria-pressed={isSelected}
            className="h-10 rounded-full px-4"
            size="sm"
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => toggleFilter(value)}
          >
            {label}
            {isRemovable && <XIcon data-icon="inline-end" />}
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
            <UsersRoundIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('listPage.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasItems && (
        <>
          {/* Celular: um card por conta. */}
          <Box className="grid gap-3 md:hidden">
            {items.map(({ actions, createdAt, isCurrentUser, phone, suspendedAt, user }) => (
              <Card key={user.id} className="border-border surface-card shadow-sm">
                <CardContent className="grid gap-3 py-4">
                  <Box className="grid min-w-0 gap-1">
                    <Text className="text-sm font-semibold text-foreground">{user.name}</Text>

                    <Text className="text-xs break-all">{user.email}</Text>
                  </Box>

                  <Box className="flex flex-wrap items-center gap-2">
                    <UserVerificationBadge user={user} />

                    {isCurrentUser && <CurrentUserBadge />}

                    <UserStatusBadge suspendedAt={suspendedAt} user={user} />
                  </Box>

                  <Box className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {phone && (
                      <Box className="flex items-center gap-1.5">
                        <PhoneIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

                        <Text className="text-xs">{phone}</Text>
                      </Box>
                    )}

                    <Text className="text-xs">{t('listPage.createdAt', { date: createdAt })}</Text>
                  </Box>

                  <UserRowActions
                    actions={actions}
                    user={user}
                    onAction={requestAction}
                    onEdit={openEdit}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* A partir de md: tabela com a coluna de verificação do e-mail. */}
          <Card className="hidden overflow-hidden border-border surface-card shadow-sm md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t('listPage.columns.user')}</TableHead>

                  <TableHead>{t('listPage.columns.phone')}</TableHead>

                  <TableHead>{t('listPage.columns.verification')}</TableHead>

                  <TableHead>{t('listPage.columns.status')}</TableHead>

                  <TableHead>{t('listPage.columns.createdAt')}</TableHead>

                  <TableHead className="text-right">{t('listPage.columns.actions')}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map(({ actions, createdAt, isCurrentUser, phone, suspendedAt, user }) => (
                  <TableRow key={user.id}>
                    <TableCell className="max-w-72">
                      <Box className="grid min-w-0 gap-0.5">
                        <Text className="truncate text-sm font-semibold text-foreground">
                          {user.name}
                        </Text>

                        <Text className="truncate text-xs">{user.email}</Text>
                      </Box>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Text className="text-sm text-foreground">
                        {phone ?? t('listPage.notInformed')}
                      </Text>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <UserVerificationBadge user={user} />

                        {isCurrentUser && <CurrentUserBadge />}
                      </Box>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <UserStatusBadge suspendedAt={suspendedAt} user={user} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Text className="text-sm">{createdAt}</Text>
                    </TableCell>

                    <TableCell>
                      <UserRowActions
                        actions={actions}
                        user={user}
                        onAction={requestAction}
                        onEdit={openEdit}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
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

      <UserCreateFormView
        key={`create-${formKey}`}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {editingUser && (
        <UserEditFormView
          key={`edit-${formKey}`}
          open={isEditOpen}
          user={editingUser}
          onOpenChange={setIsEditOpen}
        />
      )}

      <UserActionDialog
        isPending={isRunningAction}
        request={actionRequest}
        onCancel={cancelAction}
        onConfirm={confirmAction}
      />
    </Box>
  );
};
