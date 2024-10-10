import data from './data/semesters.json'

async function getAllSemesters(): Promise<string[]> {
  return data
}

export default { getAllSemesters }