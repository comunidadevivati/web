import {
  createMembersFromUsersUseCase,
  MAX_MEMBERS_PER_REQUEST,
} from '@/features/members/application/use-cases/create-members-from-users.use-case';
import type { MembersGateway } from '@/features/members/domain/member';
import { describe, expect, it, vi } from 'vitest';

const createGateway = () => {
  const createMembersFromUsers = vi.fn((_csrfToken: string, userIds: readonly string[]) =>
    Promise.resolve(userIds.map((userId) => ({ userId, status: 'linked' as const }))),
  );

  return {
    createMembersFromUsers,
    gateway: { createMembersFromUsers } as unknown as MembersGateway,
  };
};

describe('createMembersFromUsersUseCase', () => {
  it('sends the selected accounts with the session CSRF token', async () => {
    const { createMembersFromUsers, gateway } = createGateway();

    await expect(createMembersFromUsersUseCase('csrf', ['u-1', 'u-2'], gateway)).resolves.toEqual([
      { userId: 'u-1', status: 'linked' },
      { userId: 'u-2', status: 'linked' },
    ]);

    expect(createMembersFromUsers).toHaveBeenCalledExactlyOnceWith('csrf', ['u-1', 'u-2']);
  });

  it('splits selections larger than the BFF limit into successive requests', async () => {
    const { createMembersFromUsers, gateway } = createGateway();

    const userIds = Array.from({ length: MAX_MEMBERS_PER_REQUEST + 3 }, (_, index) => `u-${index}`);

    const outcomes = await createMembersFromUsersUseCase('csrf', userIds, gateway);

    expect(outcomes.map(({ userId }) => userId)).toEqual(userIds);

    expect(createMembersFromUsers.mock.calls.map(([, ids]) => ids.length)).toEqual([
      MAX_MEMBERS_PER_REQUEST,
      3,
    ]);
  });
});
