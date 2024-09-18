import { Course } from "./Course";

export type Student = {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  taken: Course[];
  recommended: Course[];
};