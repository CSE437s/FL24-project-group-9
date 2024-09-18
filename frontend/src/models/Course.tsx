export type Term = {
  id: string,
  term: string;
  courses: Course[];
};

export type Course = {
  id: string;
  code: string;
  department: string;
  title: string;
  credits: number;
};