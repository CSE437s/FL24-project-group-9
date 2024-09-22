export type Term = {
  id: string,
  term: string;
  courses: Course[];
};

export type Course = {
  id: string;
  code: string;
  department: string;
  description?: string;
  title: string;
  credits: number;
  url?: string;
};