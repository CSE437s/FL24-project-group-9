import { Planner } from '../models/Planner.tsx';
// import { API_URL } from './config.tsx'
import data from './data/planner.json'

async function getPlanner(): Promise<Planner> {
  return data;
}

export default { getPlanner }