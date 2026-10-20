import type { MemberFromUserOutcome } from '@/features/members/domain/member';
import { summarizeMemberCreation } from '@/features/members/presentation/models/members.model';
import { describe, expect, it } from 'vitest';

const outcome = (status: MemberFromUserOutcome['status']): MemberFromUserOutcome => ({
  userId: `u-${status}`,
  status,
});

describe('summarizeMemberCreation', () => {
  it('counts accounts already linked as created', () => {
    expect(summarizeMemberCreation([outcome('linked'), outcome('already_linked')])).toEqual({
      created: 2,
      total: 2,
      failure: null,
    });
  });

  it('reports the failure reason when a single account was sent', () => {
    expect(summarizeMemberCreation([outcome('rejected')])).toEqual({
      created: 0,
      total: 1,
      failure: 'rejected',
    });
  });

  it('only counts failures when several accounts were sent', () => {
    expect(
      summarizeMemberCreation([outcome('linked'), outcome('unverified'), outcome('unavailable')]),
    ).toEqual({ created: 1, total: 3, failure: null });
  });
});
