import { Box, Text } from '@/components/ui';
import { StarIcon } from 'lucide-react';

type OverallRatingCardProps = {
  title: string;
  // Nota já formatada (ex.: "4,3").
  value: string;
  // Preenchimento de cada estrela, de 0 a 1.
  stars: number[];
  // Leitura acessível (ex.: "Nota geral 4,3 de 5").
  label: string;
};

// Card da nota geral do relatório: a nota em destaque e as estrelas preenchidas proporcionalmente.
export const OverallRatingCard = ({ label, stars, title, value }: OverallRatingCardProps) => (
  <Box className="grid gap-1 rounded-xl border border-border surface-card p-4">
    <Text className="text-xs font-medium text-muted-foreground uppercase">{title}</Text>

    <Box aria-label={label} className="grid gap-1" role="img">
      <Text aria-hidden="true" className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </Text>

      <Box aria-hidden="true" className="flex gap-0.5">
        {stars.map((fill, index) => (
          <Box key={index} className="relative size-5">
            <StarIcon className="size-5 text-rating" strokeWidth={1.75} />

            <Box
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className="size-5 max-w-none fill-rating text-rating" strokeWidth={1.75} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);
