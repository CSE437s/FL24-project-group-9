import data from './data/minors.json'

async function getAllMinors(): Promise<string[]> {
  return data
}

export default { getAllMinors }
