import { Box } from '@/components/ui/box';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useHomeViewModel } from '@/features/home/presentation/view-models/home.view-model';
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
    accent: 'bg-cyan-500',
    border: 'border-cyan-500/20',
    glow: 'bg-cyan-500/10',
    icon: 'bg-cyan-500/10 text-cyan-600',
    value: 'text-cyan-700',
  },
  visitors: {
    accent: 'bg-violet-500',
    border: 'border-violet-500/20',
    glow: 'bg-violet-500/10',
    icon: 'bg-violet-500/10 text-violet-600',
    value: 'text-violet-700',
  },
  events: {
    accent: 'bg-amber-500',
    border: 'border-amber-500/20',
    glow: 'bg-amber-500/10',
    icon: 'bg-amber-500/10 text-amber-600',
    value: 'text-amber-700',
  },
  ministries: {
    accent: 'bg-emerald-500',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500/10',
    icon: 'bg-emerald-500/10 text-emerald-600',
    value: 'text-emerald-700',
  },
};

export const HomeView = () => {
  const { activities, events, summaries } = useHomeViewModel();

  return (
    <Box className="grid gap-8">
      <Box>
        <Heading className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </Heading>

        <Text className="mt-1 text-slate-500">Visão geral da Comunidade Viva.</Text>
      </Box>

      <Box className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map((summary) => {
          const Icon = dashboardIcons[summary.icon];

          const styles = dashboardStyles[summary.icon];

          return (
            <Card
              key={summary.label}
              className={`group relative border ${styles.border} bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <Box
                aria-hidden="true"
                className={`absolute top-0 right-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full blur-2xl ${styles.glow}`}
              />

              <Box
                aria-hidden="true"
                className={`absolute top-0 left-0 h-1 w-full ${styles.accent}`}
              />

              <CardHeader className="relative flex flex-row items-center justify-between">
                <Box>
                  <CardDescription className="font-medium text-slate-500">
                    {summary.label}
                  </CardDescription>

                  <CardTitle
                    className={`mt-2 text-3xl font-semibold tracking-tight ${styles.value}`}
                  >
                    {summary.value}
                  </CardTitle>
                </Box>

                <Box
                  className={`flex size-12 items-center justify-center rounded-xl ${styles.icon} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="size-5" />
                </Box>
              </CardHeader>

              <CardContent className="relative">
                <Text className="text-xs text-slate-500">{summary.description}</Text>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
            <Box className="flex items-center gap-3">
              <Box className="flex size-10 items-center justify-center rounded-xl bg-[#01A9B1]/10 text-[#018f96]">
                <CalendarDaysIcon className="size-5" />
              </Box>

              <Box>
                <CardTitle className="text-base font-semibold text-slate-900">
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
                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-[#01A9B1]/30 hover:bg-[#01A9B1]/[0.025] hover:shadow-md"
              >
                <Box
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-full w-1 bg-[#01A9B1] opacity-0 transition-opacity group-hover:opacity-100"
                />

                <Box className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0b191e] text-white shadow-sm">
                  <Text className="text-[0.6rem] font-semibold tracking-wider text-[#65e3e8] uppercase">
                    Evento
                  </Text>

                  <Text className="text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </Box>

                <Box className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-semibold text-slate-900">
                    {event.title}
                  </Text>

                  <Box className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <Box className="flex items-center gap-1.5">
                      <CalendarDaysIcon className="size-3.5 text-[#01A9B1]" />

                      <Text className="text-xs text-slate-500">{event.date}</Text>
                    </Box>

                    <Box className="flex items-center gap-1.5">
                      <Clock3Icon className="size-3.5 text-[#01A9B1]" />

                      <Text className="text-xs text-slate-500">{event.time}</Text>
                    </Box>
                  </Box>
                </Box>

                <Box className="hidden rounded-full border border-[#01A9B1]/20 bg-[#01A9B1]/5 px-3 py-1 sm:block">
                  <Text className="text-xs font-medium text-[#018f96]">Próximo</Text>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
            <CardTitle className="text-base font-semibold text-slate-900">
              Atividades recentes
            </CardTitle>

            <CardDescription>Últimas movimentações registradas</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-1 pt-3">
            {activities.map((activity) => (
              <Box
                key={activity.id}
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-slate-50"
              >
                <Box className="relative flex size-8 shrink-0 items-center justify-center">
                  <Box className="absolute size-3 rounded-full bg-[#01A9B1]/20" />

                  <Box className="relative size-1.5 rounded-full bg-[#01A9B1]" />
                </Box>

                <Box className="min-w-0 flex-1">
                  <Text className="truncate text-sm font-medium text-slate-700">
                    {activity.description}
                  </Text>
                </Box>

                <Text className="shrink-0 text-xs text-slate-400">{activity.date}</Text>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
