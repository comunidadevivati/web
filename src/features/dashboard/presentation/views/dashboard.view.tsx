import {
  Box,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  Text,
} from '@/components/ui';
import { useDashboardViewModel } from '@/features/dashboard/presentation/view-models/dashboard.view-model';
import { cn } from '@/lib/utils';
import {
  CalendarDaysIcon,
  ChurchIcon,
  Clock3Icon,
  UserRoundPlusIcon,
  UsersIcon,
} from 'lucide-react';

const dashboardIcons = {
  events: CalendarDaysIcon,
  members: UsersIcon,
  ministries: ChurchIcon,
  visitors: UserRoundPlusIcon,
};

const dashboardStyles = {
  members: {
    accent: cn('bg-chart-1'),
    border: cn('border-chart-1/20'),
    glow: cn('bg-chart-1/10'),
    icon: cn('bg-chart-1/10 text-chart-1'),
    value: cn('text-chart-1'),
  },
  visitors: {
    accent: cn('bg-chart-2'),
    border: cn('border-chart-2/20'),
    glow: cn('bg-chart-2/10'),
    icon: cn('bg-chart-2/10 text-chart-2'),
    value: cn('text-chart-2'),
  },
  events: {
    accent: cn('bg-chart-3'),
    border: cn('border-chart-3/20'),
    glow: cn('bg-chart-3/10'),
    icon: cn('bg-chart-3/10 text-chart-3'),
    value: cn('text-chart-3'),
  },
  ministries: {
    accent: cn('bg-chart-4'),
    border: cn('border-chart-4/20'),
    glow: cn('bg-chart-4/10'),
    icon: cn('bg-chart-4/10 text-chart-4'),
    value: cn('text-chart-4'),
  },
};

export const DashboardView = () => {
  const { activities, events, summaries } = useDashboardViewModel();

  return (
    <Box className="grid gap-8">
      <Box>
        <Heading className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </Heading>

        <Text className="mt-1 text-muted-foreground">Visão geral da Comunidade Viva.</Text>
      </Box>

      <Box className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map((summary) => {
          const Icon = dashboardIcons[summary.icon];

          const styles = dashboardStyles[summary.icon];

          return (
            <Card
              key={summary.label}
              className={cn(
                `
                  group relative border surface-card shadow-sm transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                `,
                styles.border,
              )}
            >
              <Box
                aria-hidden="true"
                className={cn(
                  `
                    absolute top-0 right-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full
                    blur-2xl
                  `,
                  styles.glow,
                )}
              />

              <Box
                aria-hidden="true"
                className={cn('absolute top-0 left-0 h-1 w-full', styles.accent)}
              />

              <CardHeader className="relative flex flex-row items-center justify-between">
                <Box>
                  <CardDescription className="font-medium text-muted-foreground">
                    {summary.label}
                  </CardDescription>

                  <CardTitle
                    className={cn('mt-2 text-3xl font-semibold tracking-tight', styles.value)}
                  >
                    {summary.value}
                  </CardTitle>
                </Box>

                <Box
                  className={cn(
                    `
                      flex size-12 items-center justify-center rounded-xl transition-transform
                      duration-300 group-hover:scale-110
                    `,
                    styles.icon,
                  )}
                >
                  <Icon className="size-5" />
                </Box>
              </CardHeader>

              <CardContent className="relative">
                <Text className="text-xs text-muted-foreground">{summary.description}</Text>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-border surface-card shadow-sm">
          <CardHeader className="border-b border-border/60 bg-linear-to-r from-muted/60 to-card">
            <Box className="flex items-center gap-3">
              <Box
                className="
                  flex size-10 items-center justify-center rounded-xl bg-primary/10
                  text-primary-strong
                "
              >
                <CalendarDaysIcon className="size-5" />
              </Box>

              <Box>
                <CardTitle className="text-base font-semibold text-foreground">
                  Próximos eventos
                </CardTitle>

                <CardDescription>Agenda prevista da comunidade</CardDescription>
              </Box>
            </Box>
          </CardHeader>

          <CardContent className="grid gap-3 pt-4">
            {events.map((event, index) => (
              <Box
                key={event.id}
                className="
                  group relative flex items-center gap-4 overflow-hidden rounded-xl border
                  border-border surface-card p-4 transition-all duration-200 hover:border-primary/30
                  hover:bg-primary/[0.025] hover:shadow-md
                "
              >
                <Box
                  aria-hidden="true"
                  className="
                    absolute top-0 left-0 h-full w-1 bg-primary opacity-0 transition-opacity
                    group-hover:opacity-100
                  "
                />

                <Box
                  className="
                    flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary
                    text-primary-foreground shadow-sm
                  "
                >
                  <Text
                    className="
                      text-[0.6rem] font-semibold tracking-wider text-primary-foreground/80
                      uppercase
                    "
                  >
                    Evento
                  </Text>

                  <Text className="text-sm font-semibold text-primary-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </Box>

                <Box className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-semibold text-foreground">
                    {event.title}
                  </Text>

                  <Box className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <Box className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="size-3.5 text-primary" />

                      <Text className="text-xs text-muted-foreground">{event.date}</Text>
                    </Box>

                    <Box className="flex items-center gap-1.5">
                      <Clock3Icon className="size-3.5 text-primary" />

                      <Text className="text-xs text-muted-foreground">{event.time}</Text>
                    </Box>
                  </Box>
                </Box>

                <Box
                  className="
                    hidden rounded-full border border-primary/20 bg-primary/5 px-3 py-1 sm:block
                  "
                >
                  <Text className="text-xs font-medium text-primary-strong">Próximo</Text>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border surface-card shadow-sm">
          <CardHeader className="border-b border-border/60 bg-linear-to-r from-muted/60 to-card">
            <CardTitle className="text-base font-semibold text-foreground">
              Atividades recentes
            </CardTitle>

            <CardDescription>Últimas movimentações registradas</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-1 pt-3">
            {activities.map((activity) => (
              <Box
                key={activity.id}
                className="
                  flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60
                "
              >
                <Box className="relative flex size-8 shrink-0 items-center justify-center">
                  <Box className="absolute size-3 rounded-full bg-primary/20" />

                  <Box className="relative size-1.5 rounded-full bg-primary" />
                </Box>

                <Box className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-medium text-foreground/80">
                    {activity.description}
                  </Text>
                </Box>

                <Text className="shrink-0 text-xs text-muted-foreground/80">{activity.date}</Text>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
