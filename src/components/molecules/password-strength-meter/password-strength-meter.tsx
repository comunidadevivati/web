import { Box, Progress, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import type {
  PasswordRequirementStatus,
  PasswordStrength,
} from '@/shared/validation/password-strength';
import { CheckIcon, CircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PasswordStrengthMeterProps = {
  strength: PasswordStrength;
  requirements: PasswordRequirementStatus[];
  id?: string;
  className?: string;
};

const strengthValues: Record<PasswordStrength, number> = {
  empty: 0,
  weak: 34,
  medium: 67,
  strong: 100,
};

const indicatorClassNames: Record<PasswordStrength, string> = {
  empty: cn('bg-muted'),
  weak: cn('bg-destructive'),
  medium: cn('bg-chart-3'),
  strong: cn('bg-chart-4'),
};

// Medidor de força da senha (Progress do shadcn) com a lista de requisitos atendidos.
export const PasswordStrengthMeter = ({
  className,
  id,
  requirements,
  strength,
}: PasswordStrengthMeterProps) => {
  const { t } = useTranslation();

  const level = t(`passwordStrength.levels.${strength}`);

  return (
    <Box className={cn('grid gap-2', className)} id={id}>
      <Progress
        aria-label={t('passwordStrength.label')}
        getAriaValueText={() => level}
        indicatorClassName={indicatorClassNames[strength]}
        value={strengthValues[strength]}
      />

      <Text aria-live="polite" className="text-sm text-muted-foreground">
        {t('passwordStrength.summary', { level })}
      </Text>

      <Box
        aria-label={t('passwordStrength.requirementsLabel')}
        className="grid gap-1 sm:grid-cols-2"
        role="list"
      >
        {requirements.map(({ isMet, requirement }) => (
          <Box
            className={cn(
              'flex items-center gap-1.5 text-xs',
              isMet ? 'text-primary-strong' : 'text-muted-foreground',
            )}
            key={requirement}
            role="listitem"
          >
            {isMet ? (
              <CheckIcon aria-hidden="true" className="size-3.5 shrink-0" />
            ) : (
              <CircleIcon aria-hidden="true" className="size-3.5 shrink-0" />
            )}

            <Text className="text-xs text-current">
              {t(`passwordStrength.requirements.${requirement}`)}
            </Text>

            <Text className="sr-only">
              {isMet ? t('passwordStrength.met') : t('passwordStrength.notMet')}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
