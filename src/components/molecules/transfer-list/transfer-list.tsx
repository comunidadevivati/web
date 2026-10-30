import { StatusBadge } from '@/components/molecules/status-badge/status-badge';
import { TooltipHint } from '@/components/molecules/tooltip-hint/tooltip-hint';
import { Box, Button, Checkbox, Input, Label, Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from 'lucide-react';
import { useState } from 'react';

export type TransferListItem = {
  id: string;
  label: string;
  // Linha secundária (ex.: e-mail) e marcação opcional ao lado do rótulo (ex.: "Membro"), já traduzidas.
  description?: string;
  badge?: string;
};

// Textos já traduzidos.
export type TransferListLabels = {
  availableTitle: string;
  selectedTitle: string;
  searchPlaceholder: string;
  searchLabel: (listTitle: string) => string;
  empty: string;
  noMatches: string;
  count: (shown: number, total: number) => string;
  addChecked: string;
  addAll: string;
  removeChecked: string;
  removeAll: string;
};

type TransferListProps = {
  id: string;
  items: TransferListItem[];
  // IDs que estão na lista da direita (selecionados).
  selectedIds: readonly string[];
  onChange: (selectedIds: string[]) => void;
  labels: TransferListLabels;
  disabled?: boolean;
};

const matches = ({ description, label }: TransferListItem, search: string) => {
  const term = search.trim().toLocaleLowerCase('pt-BR');

  return (
    term === '' ||
    label.toLocaleLowerCase('pt-BR').includes(term) ||
    (description?.toLocaleLowerCase('pt-BR').includes(term) ?? false)
  );
};

type PanelProps = {
  id: string;
  title: string;
  items: TransferListItem[];
  total: number;
  checkedIds: ReadonlySet<string>;
  search: string;
  onSearch: (value: string) => void;
  onToggle: (id: string) => void;
  labels: TransferListLabels;
  disabled: boolean;
};

// Uma das duas listas: busca, contagem e itens marcáveis.
const TransferPanel = ({
  checkedIds,
  disabled,
  id,
  items,
  labels,
  onSearch,
  onToggle,
  search,
  title,
  total,
}: PanelProps) => {
  const searchId = `${id}-search`;

  return (
    <Box
      aria-labelledby={`${id}-title`}
      className="grid min-w-0 flex-1 gap-3 rounded-xl border border-border surface-card p-3"
      role="group"
    >
      <Box className="flex items-baseline justify-between gap-2">
        <Text className="text-sm font-semibold text-foreground" id={`${id}-title`}>
          {title}
        </Text>

        <Text className="text-xs text-muted-foreground">{labels.count(items.length, total)}</Text>
      </Box>

      <Box className="relative">
        <SearchIcon
          aria-hidden="true"
          className="
            pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2
            text-muted-foreground
          "
        />

        <Label className="sr-only" htmlFor={searchId}>
          {labels.searchLabel(title)}
        </Label>

        <Input
          id={searchId}
          autoComplete="off"
          className="pl-9"
          disabled={disabled}
          placeholder={labels.searchPlaceholder}
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </Box>

      <Box className="h-80 overflow-y-auto rounded-lg border border-border/60">
        {items.length === 0 && (
          <Text className="p-4 text-center text-sm text-muted-foreground">
            {total === 0 ? labels.empty : labels.noMatches}
          </Text>
        )}

        {items.map((item) => {
          const checkboxId = `${id}-item-${item.id}`;

          const isChecked = checkedIds.has(item.id);

          return (
            <Label
              key={item.id}
              className={cn(
                `
                  flex cursor-pointer items-center gap-3 border-b border-border/60 px-3 py-2
                  font-normal last:border-b-0 hover:bg-primary/5
                `,
                isChecked && 'bg-primary/10',
                disabled && 'cursor-not-allowed opacity-60',
              )}
              htmlFor={checkboxId}
            >
              <Checkbox
                checked={isChecked}
                disabled={disabled}
                id={checkboxId}
                onChange={() => onToggle(item.id)}
              />

              <Box className="grid min-w-0 flex-1 gap-0.5">
                <Box className="flex min-w-0 items-center gap-2">
                  <Text className="truncate text-sm font-medium text-foreground">{item.label}</Text>

                  {item.badge && <StatusBadge label={item.badge} tone="success" />}
                </Box>

                {item.description && (
                  <Text className="truncate text-xs text-muted-foreground">{item.description}</Text>
                )}
              </Box>
            </Label>
          );
        })}
      </Box>
    </Box>
  );
};

// Duas listas lado a lado (disponíveis e selecionados): marque itens e mova os marcados, ou todos os
// itens visíveis (respeitando a busca), de uma lista para a outra.
export const TransferList = ({
  disabled = false,
  id,
  items,
  labels,
  onChange,
  selectedIds,
}: TransferListProps) => {
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());

  const [availableSearch, setAvailableSearch] = useState('');

  const [selectedSearch, setSelectedSearch] = useState('');

  const selected = new Set(selectedIds);

  const availableItems = items.filter((item) => !selected.has(item.id));

  // Na ordem de items (ex.: alfabética), não na ordem em que foram adicionados.
  const selectedItems = items.filter((item) => selected.has(item.id));

  const visibleAvailable = availableItems.filter((item) => matches(item, availableSearch));

  const visibleSelected = selectedItems.filter((item) => matches(item, selectedSearch));

  const checkedAvailable = visibleAvailable.filter((item) => checkedIds.has(item.id));

  const checkedSelected = visibleSelected.filter((item) => checkedIds.has(item.id));

  const toggle = (itemId: string) => {
    setCheckedIds((current) => {
      const next = new Set(current);

      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }

      return next;
    });
  };

  const add = (toAdd: TransferListItem[]) => {
    const ids = new Set(toAdd.map((item) => item.id));

    // IDs selecionados que não estão em items (ex.: conta removida) são mantidos.
    onChange([...selectedIds, ...ids]);

    setCheckedIds((current) => new Set([...current].filter((itemId) => !ids.has(itemId))));
  };

  const remove = (toRemove: TransferListItem[]) => {
    const ids = new Set(toRemove.map((item) => item.id));

    onChange(selectedIds.filter((itemId) => !ids.has(itemId)));

    setCheckedIds((current) => new Set([...current].filter((itemId) => !ids.has(itemId))));
  };

  const actions = [
    {
      label: labels.addChecked,
      icon: ChevronRightIcon,
      isDisabled: checkedAvailable.length === 0,
      onClick: () => add(checkedAvailable),
    },
    {
      label: labels.addAll,
      icon: ChevronsRightIcon,
      isDisabled: visibleAvailable.length === 0,
      onClick: () => add(visibleAvailable),
    },
    {
      label: labels.removeChecked,
      icon: ChevronLeftIcon,
      isDisabled: checkedSelected.length === 0,
      onClick: () => remove(checkedSelected),
    },
    {
      label: labels.removeAll,
      icon: ChevronsLeftIcon,
      isDisabled: visibleSelected.length === 0,
      onClick: () => remove(visibleSelected),
    },
  ];

  return (
    <Box className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <TransferPanel
        checkedIds={checkedIds}
        disabled={disabled}
        id={`${id}-available`}
        items={visibleAvailable}
        labels={labels}
        search={availableSearch}
        title={labels.availableTitle}
        total={availableItems.length}
        onSearch={setAvailableSearch}
        onToggle={toggle}
      />

      <Box className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
        {actions.map(({ icon: Icon, isDisabled, label, onClick }) => (
          <TooltipHint key={label} label={label}>
            <Button
              className="h-10 justify-start px-3 lg:justify-center"
              disabled={disabled || isDisabled}
              type="button"
              variant="outline"
              onClick={onClick}
            >
              {/* Empilhadas (telas menores), as listas ficam uma acima da outra: a seta aponta para baixo. */}
              <Icon className="max-lg:rotate-90" data-icon="inline-start" />
              <Text className="text-sm lg:sr-only">{label}</Text>
            </Button>
          </TooltipHint>
        ))}
      </Box>

      <TransferPanel
        checkedIds={checkedIds}
        disabled={disabled}
        id={`${id}-selected`}
        items={visibleSelected}
        labels={labels}
        search={selectedSearch}
        title={labels.selectedTitle}
        total={selectedItems.length}
        onSearch={setSelectedSearch}
        onToggle={toggle}
      />
    </Box>
  );
};
