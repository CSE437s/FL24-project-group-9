import { Term } from "./models/Course";

const sortTerms = (terms: string[]): string[] => {
  return terms.sort((a, b) => {
    const [seasonA, yearA] = a.split(' ');
    const [seasonB, yearB] = b.split(' ');

    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }

    if (seasonA === 'Spring' && seasonB === 'Fall') {
      return -1;
    }

    if (seasonA === 'Fall' && seasonB === 'Spring') {
      return 1;
    }

    return 0;
  });
};

const sortTermObjects = (terms: Term[]): Term[] => {
  return terms.sort((a, b) => {
    const [seasonA, yearA] = a.term.split(' ');
    const [seasonB, yearB] = b.term.split(' ');

    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }

    if (seasonA === 'Spring' && seasonB === 'Fall') {
      return -1;
    }

    if (seasonA === 'Fall' && seasonB === 'Spring') {
      return 1;
    }

    return 0;
  });
};

export const utils = {
  sortTerms,
  sortTermObjects
};