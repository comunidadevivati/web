import type { FormAnswer, FormAnswersGateway } from '@/features/forms/domain/form-answer';
import { formAnswersHttpGateway } from '@/features/forms/infrastructure/http/form-answers-http.gateway';

type SubmitAnswersCommand = {
  token: string;
  answers: FormAnswer[];
  consentAccepted: boolean;
  sendCopy: boolean;
};

export const submitAnswersUseCase = (
  { answers, consentAccepted, sendCopy, token }: SubmitAnswersCommand,
  gateway: FormAnswersGateway = formAnswersHttpGateway,
) => {
  return gateway.submit(token, answers, consentAccepted, sendCopy);
};
