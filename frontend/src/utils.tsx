import { Semester } from './models/Semester'

const getTotalUnits = (term: Semester) => {
  return term.planned_courses.reduce((acc, course) => acc + course.units, 0)
}

const sortSemestersObjects = (semesters: Semester[]): Semester[] => {
  return semesters.sort((a, b) => {
    const [seasonA, yearA] = a.name.split(' ')
    const [seasonB, yearB] = b.name.split(' ')

    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB)
    }

    if (seasonA === 'Spring' && seasonB === 'Fall') {
      return -1
    }

    if (seasonA === 'Fall' && seasonB === 'Spring') {
      return 1
    }

    return 0
  })
}

export const utils = {
  getTotalUnits,
  sortSemestersObjects,
}
