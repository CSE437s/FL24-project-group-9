import { Term } from "./Course";

export type Student = {
  id: string;
  name: string;
  email: string;
  major: string;
  minor: string;
  year: string;
  taken: Term[];
  recommended: Term[];
};