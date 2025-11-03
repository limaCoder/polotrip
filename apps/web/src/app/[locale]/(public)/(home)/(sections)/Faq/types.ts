// eslint-disable-next-line @typescript-eslint/no-unused-vars
const questionNumbers = [1, 2, 3, 4, 5, 6] as const;
type QuestionNumber = (typeof questionNumbers)[number];

type QuestionKey = `q${QuestionNumber}_question`;
type AnswerKey = `q${QuestionNumber}_answer`;

type FaqData = {
  questionKey: QuestionKey;
  answerKey: AnswerKey;
};

type FaqAccordionProps = {
  questions: Array<{
    question: string;
    answer: string;
  }>;
};

export type { FaqData, FaqAccordionProps };
