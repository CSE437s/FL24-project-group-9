import { API_URL } from './config.tsx'
import { Planner } from '../models/Planner.tsx';
import data from './data/planner.json'

async function getPlanner(): Promise<Planner> {
  return data;
}

async function updateSelectedPlan(planner: Planner): Promise<Planner> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({planner}),
  }
  const response = await fetch(`${API_URL}/api/planner/`, options)
  return response.json()
}

export default { getPlanner, updateSelectedPlan }