import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

type PasswordInputProps = Omit<ComponentProps<'input'>, 'type'> & {
  groupClassName?: string;
};

// Campo de senha com botão para mostrar/ocultar o conteúdo.
export const PasswordInput = ({ disabled, groupClassName, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const { t } = useTranslation();

  const toggleLabel = isVisible ? t('password.hide') : t('password.show');

  const toggleVisibility = () => {
    setIsVisible((visible) => !visible);
  };

  return (
    <InputGroup className={cn('h-11', groupClassName)}>
      <InputGroupInput
        autoCapitalize="none"
        autoCorrect="off"
        disabled={disabled}
        spellCheck={false}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />

      <InputGroupAddon align="inline-end">
        <TooltipHint label={toggleLabel}>
          <InputGroupButton
            aria-label={toggleLabel}
            aria-pressed={isVisible}
            className="size-9"
            disabled={disabled}
            size="icon-sm"
            onClick={toggleVisibility}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </TooltipHint>
      </InputGroupAddon>
    </InputGroup>
  );
};
