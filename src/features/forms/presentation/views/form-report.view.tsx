import {
  Alert,
  AlertDescription,
  AlertTitle,
  Anchor,
  Box,
  Button,
  buttonVariants,
  Card,
  CardContent,
  Heading,
  Input,
  Label,
  Spinner,
  Text,
} from '@/components/ui';
import { OverallRatingCard } from '@/features/forms/presentation/components/overall-rating-card';
import { useFormReportViewModel } from '@/features/forms/presentation/view-models/form-report.view-model';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CalendarRangeIcon,
  CircleAlertIcon,
  EraserIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  InboxIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Relatório consolidado: participação (convidados, respostas pelo link e em papel, pendentes) e, por
// pergunta, barras com quantidade e porcentagem, médias e as respostas de texto com busca. Exporta
// CSV (Excel) e abre o PDF consolidado numa nova aba.
// Com a nota geral, a linha de resumo ganha a sexta coluna.
const getSummaryColumns = (rating: unknown) => (rating ? 'lg:grid-cols-6' : 'lg:grid-cols-5');

export const FormReportView = () => {
  const {
    changeSearch,
    csvPath,
    errorNotice,
    form,
    formId,
    hasAnswers,
    isAnonymous,
    isLoading,
    isRetrying,
    openPdf,
    paperCount,
    purgedAt,
    period,
    questions,
    retry,
    summary,
    rating,
  } = useFormReportViewModel();

  const { t } = useTranslation('forms');

  return (
    <Box className="grid gap-6">
      <Box className="flex flex-wrap gap-x-6 gap-y-2">
        <Link
          className="
            inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
            hover:underline
          "
          to="/departamentos/lideranca/formularios"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          {t('editor.backToList')}
        </Link>

        <Link
          className="
            inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary-strong
            hover:underline
          "
          params={{ formId }}
          to="/departamentos/lideranca/formularios/$formId/respostas"
        >
          <InboxIcon aria-hidden="true" className="size-4" />
          {t('report.toResponses')}
        </Link>
      </Box>

      <Box className="flex flex-wrap items-end justify-between gap-4">
        <Box className="min-w-0">
          <Heading className="text-2xl font-semibold tracking-tight text-foreground">
            {t('report.title')}
          </Heading>

          {form && <Text className="mt-1 text-muted-foreground">{form.title}</Text>}

          {form && (
            <Box className="mt-2 flex items-center gap-1.5">
              <CalendarRangeIcon aria-hidden="true" className="size-3.5 text-primary-strong" />

              <Text className="text-xs">{period}</Text>
            </Box>
          )}
        </Box>

        <Box className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Anchor
            className={cn(buttonVariants({ variant: 'outline' }), 'h-11 sm:px-5')}
            download
            href={csvPath}
          >
            <FileSpreadsheetIcon data-icon="inline-start" />
            {t('report.exportCsv')}
          </Anchor>

          <Button className="h-11 sm:px-5" type="button" onClick={openPdf}>
            <FileTextIcon data-icon="inline-start" />
            {t('report.openPdf')}
          </Button>
        </Box>
      </Box>

      {isAnonymous && (
        <Alert>
          <ShieldCheckIcon />

          <AlertTitle>{t('responses.anonymous.title')}</AlertTitle>

          <AlertDescription>{t('report.anonymous')}</AlertDescription>
        </Alert>
      )}

      {purgedAt && (
        <Alert>
          <EraserIcon />

          <AlertTitle>{t('report.purged.title')}</AlertTitle>

          <AlertDescription>{t('report.purged.description', { date: purgedAt })}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Box className="flex min-h-64 items-center justify-center">
          <Spinner className="size-8 text-primary-strong" />
        </Box>
      )}

      {errorNotice && (
        <Alert variant="destructive">
          <CircleAlertIcon />

          <AlertTitle>{t(`notices.${errorNotice}.title`)}</AlertTitle>

          <AlertDescription className="grid gap-3">
            {t(`notices.${errorNotice}.description`)}

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
          </AlertDescription>
        </Alert>
      )}

      {summary.length > 0 && (
        <Box className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', getSummaryColumns(rating))}>
          {summary.map(({ key, label, value }) => (
            <Box key={key} className="grid gap-1 rounded-xl border border-border surface-card p-4">
              <Text className="text-xs font-medium text-muted-foreground uppercase">{label}</Text>

              <Text className="text-2xl font-semibold tracking-tight text-foreground">{value}</Text>
            </Box>
          ))}

          {rating && <OverallRatingCard {...rating} title={t('report.rating.title')} />}
        </Box>
      )}

      {paperCount > 0 && (
        <Text className="text-xs text-muted-foreground">{t('report.paperNote')}</Text>
      )}

      {!isLoading && !errorNotice && !hasAnswers && (
        <Card className="border-border surface-card shadow-sm">
          <CardContent className="flex flex-col items-center gap-3 py-10">
            <InboxIcon aria-hidden="true" className="size-8 text-primary-strong" />

            <Text className="text-center">{t('report.empty')}</Text>
          </CardContent>
        </Card>
      )}

      {hasAnswers &&
        questions.map(
          (
            {
              average,
              averageLabel,
              bars,
              maximum,
              minimum,
              question,
              scaleEnds,
              search,
              texts,
              totalTexts,
            },
            index,
          ) => (
            <Card key={question.questionId} className="border-border surface-card shadow-sm">
              <CardContent className="grid gap-4 pt-6">
                <Box className="grid gap-1">
                  <Heading className="text-base font-semibold text-foreground" level={2}>
                    {index + 1}. {question.title}
                  </Heading>

                  <Text className="text-xs text-muted-foreground">
                    {t('report.answeredCount', { count: question.answeredCount })}
                  </Text>
                </Box>

                {average !== null && question.fieldType === 'SCALE' && question.scale && (
                  <Box className="flex items-baseline gap-2">
                    <Text className="text-3xl font-semibold tracking-tight text-foreground">
                      {average}
                    </Text>

                    {averageLabel && (
                      <Text className="text-base font-semibold text-foreground">
                        · {averageLabel}
                      </Text>
                    )}

                    <Text className="text-sm text-muted-foreground">
                      {t('report.scaleAverage', { max: question.scale.max })}
                    </Text>
                  </Box>
                )}

                {bars.length > 0 && (
                  <Box
                    aria-label={t('report.chartLabel', { title: question.title })}
                    className="grid gap-2"
                    role="list"
                  >
                    {bars.map(({ key, label, percent, value }) => (
                      <Box
                        key={key}
                        className="
                          grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] items-center gap-3
                        "
                        role="listitem"
                      >
                        <Text className="truncate text-sm text-foreground" title={label}>
                          {label}
                        </Text>

                        <Box aria-hidden="true" className="h-2.5 rounded-full bg-muted">
                          <Box
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percent > 0 ? Math.max(percent, 2) : 0}%` }}
                          />
                        </Box>

                        <Text className="text-right text-sm font-semibold tabular-nums">
                          {value}
                        </Text>
                      </Box>
                    ))}

                    {scaleEnds && (
                      <Text className="text-xs text-muted-foreground">{scaleEnds}</Text>
                    )}
                  </Box>
                )}

                {question.fieldType === 'NUMBER' && average !== null && (
                  <Box className="grid grid-cols-3 gap-3 sm:max-w-md">
                    {(
                      [
                        { key: 'average', value: average },
                        { key: 'minimum', value: minimum },
                        { key: 'maximum', value: maximum },
                      ] as const
                    ).map(({ key, value }) => (
                      <Box key={key} className="grid gap-1 rounded-lg border border-border p-3">
                        <Text className="text-xs text-muted-foreground">
                          {t(`report.stats.${key}`)}
                        </Text>

                        <Text className="text-lg font-semibold text-foreground">{value}</Text>
                      </Box>
                    ))}
                  </Box>
                )}

                {totalTexts > 0 && (
                  <Box className="grid gap-3">
                    <Box className="relative sm:max-w-sm">
                      <SearchIcon
                        aria-hidden="true"
                        className="
                          pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2
                          text-muted-foreground
                        "
                      />

                      <Label className="sr-only" htmlFor={`report-search-${index}`}>
                        {t('report.searchLabel', { title: question.title })}
                      </Label>

                      <Input
                        id={`report-search-${index}`}
                        className="pl-9"
                        placeholder={t('report.searchPlaceholder')}
                        type="search"
                        value={search}
                        onChange={({ target }) => changeSearch(question.questionId, target.value)}
                      />
                    </Box>

                    <Box className="grid max-h-80 gap-2 overflow-y-auto" role="list">
                      {texts.map((text, textIndex) => (
                        <Text
                          // A mesma resposta pode se repetir: o índice completa a chave.
                          key={`${textIndex}-${text}`}
                          className="
                            rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm
                            whitespace-pre-line
                          "
                          role="listitem"
                        >
                          {text}
                        </Text>
                      ))}

                      {texts.length === 0 && (
                        <Text className="text-sm text-muted-foreground">
                          {t('report.noMatches')}
                        </Text>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ),
        )}
    </Box>
  );
};
