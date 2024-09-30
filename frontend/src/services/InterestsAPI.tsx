import data from './data/interests.json'

async function getAllInterests(): Promise<string[]> {
  return data;
}

export default { getAllInterests }