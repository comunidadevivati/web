import type {
  DashboardActivity,
  DashboardEvent,
  DashboardSummary,
} from '@/features/home/presentation/models/home.model';

const summaries: DashboardSummary[] = [
  {
    label: 'Membros',
    value: 248,
    description: 'Membros cadastrados',
    icon: 'members',
  },
  {
    label: 'Visitantes',
    value: 34,
    description: 'Visitantes no período',
    icon: 'visitors',
  },
  {
    label: 'Eventos',
    value: 6,
    description: 'Próximos eventos',
    icon: 'events',
  },
  {
    label: 'Ministérios',
    value: 12,
    description: 'Ministérios ativos',
    icon: 'ministries',
  },
];

const events: DashboardEvent[] = [
  {
    id: '1',
    title: 'Culto de Celebração',
    date: '11/10/2026',
    time: '19:00',
  },
  {
    id: '2',
    title: 'Encontro de Líderes',
    date: '14/10/2026',
    time: '19:30',
  },
  {
    id: '3',
    title: 'Conferência de Famílias',
    date: '17/10/2026',
    time: '18:00',
  },
];

const activities: DashboardActivity[] = [
  {
    id: '1',
    description: 'Novo membro cadastrado',
    date: 'Hoje',
  },
  {
    id: '2',
    description: 'Novo visitante registrado',
    date: 'Hoje',
  },
  {
    id: '3',
    description: 'Evento atualizado',
    date: 'Ontem',
  },
];

export const useHomeViewModel = () => {
  return {
    activities,
    events,
    summaries,
  };
};
