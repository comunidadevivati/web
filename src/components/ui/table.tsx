import { cn } from 'cn';
import type { ComponentProps } from 'react';

type TableProps = ComponentProps<'table'>;

// O contêiner rola na horizontal somente se a tabela não couber; a página nunca rola.
export const Table = ({ className, ...props }: TableProps) => {
  return (
    <div className="relative w-full overflow-x-auto" data-slot="table-container">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
};

type TableHeaderProps = ComponentProps<'thead'>;

export const TableHeader = ({ className, ...props }: TableHeaderProps) => {
  return (
    <thead
      className={cn('[&_tr]:border-b [&_tr]:border-border', className)}
      data-slot="table-header"
      {...props}
    />
  );
};

type TableBodyProps = ComponentProps<'tbody'>;

export const TableBody = ({ className, ...props }: TableBodyProps) => {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      data-slot="table-body"
      {...props}
    />
  );
};

type TableFooterProps = ComponentProps<'tfoot'>;

export const TableFooter = ({ className, ...props }: TableFooterProps) => {
  return (
    <tfoot
      className={cn(
        'border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
};

type TableRowProps = ComponentProps<'tr'>;

export const TableRow = ({ className, ...props }: TableRowProps) => {
  return (
    <tr
      className={cn(
        `
          border-b border-border transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50
          data-[state=selected]:bg-muted
        `,
        className,
      )}
      data-slot="table-row"
      {...props}
    />
  );
};

type TableHeadProps = ComponentProps<'th'>;

export const TableHead = ({ className, ...props }: TableHeadProps) => {
  return (
    <th
      className={cn(
        `
          h-10 px-3 text-left align-middle font-medium whitespace-nowrap text-foreground
          [&:has([role=checkbox])]:pr-0
        `,
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
};

type TableCellProps = ComponentProps<'td'>;

export const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <td
      className={cn('p-3 align-middle [&:has([role=checkbox])]:pr-0', className)}
      data-slot="table-cell"
      {...props}
    />
  );
};

type TableCaptionProps = ComponentProps<'caption'>;

export const TableCaption = ({ className, ...props }: TableCaptionProps) => {
  return (
    <caption
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      data-slot="table-caption"
      {...props}
    />
  );
};
