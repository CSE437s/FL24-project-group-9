import data from './data/majors.json'

async function getAllMajors(): Promise<string[]> {
  return data
}

export default { getAllMajors }