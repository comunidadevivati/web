import { TooltipHint } from '@/components/molecules';
import { Box, Button } from '@/components/ui';
import type { UserAccount, UserAction } from '@/features/users/domain/user';
import type { UserActionRequest } from '@/features/users/presentation/models/users.model';
import { PencilIcon, PowerIcon, PowerOffIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const actionIcons = {
  suspend: PowerOffIcon,
  reactivate: PowerIcon,
  delete: Trash2Icon,
};

type UserRowActionsProps = {
  user: UserAccount;
  actions: UserAction[];
  onEdit: (user: UserAccount) => void;
  onAction: (request: UserActionRequest) => void;
};

// Ações de uma conta: editar e, conforme a conta, suspender/reativar e excluir.
export const UserRowActions = ({ actions, onAction, onEdit, user }: UserRowActionsProps) => {
  const { t } = useTranslation('users');

  const editLabel = t('listPage.actionLabels.edit', { name: user.name });

  return (
    <Box className="flex justify-end gap-1">
      <TooltipHint label={editLabel}>
        <Button
          aria-label={editLabel}
          size="icon-lg"
          type="button"
          variant="ghost"
          onClick={() => onEdit(user)}
        >
          <PencilIcon />
        </Button>
      </TooltipHint>

      {actions.map((action) => {
        const Icon = actionIcons[action];

        const label = t(`listPage.actionLabels.${action}`, { name: user.name });

        return (
          <TooltipHint key={action} label={label}>
            <Button
              aria-label={label}
              size="icon-lg"
              type="button"
              variant={action === 'reactivate' ? 'ghost' : 'destructive'}
              onClick={() => onAction({ action, user })}
            >
              <Icon />
            </Button>
          </TooltipHint>
        );
      })}
    </Box>
  );
};
