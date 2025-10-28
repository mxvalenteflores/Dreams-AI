
export interface Question {
  question: string;
  options: string[];
}

export type Answers = Record<string, string[] | null>;

export interface DreamAnalysis {
  narrative: string;
  interpretation: string;
}
