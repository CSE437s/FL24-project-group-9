import { Term } from '../models/Course.tsx'
import { Planner } from '../models/Planner.tsx'

import data from './data/planner.json'
import { API_URL } from './config.tsx'

async function getPlanner(): Promise<Planner> {
  return data
}

async function updateTakenPlan(term: Term[]): Promise<Planner> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ term }),
  }
  const response = await fetch(`${API_URL}/api/planner/taken`, options)
  return response.json()
}

async function updateSelectedPlan(term: Term[]): Promise<Planner> {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ term }),
  }
  const response = await fetch(`${API_URL}/api/planner/selected`, options)
  return response.json()
}

export default { getPlanner, updateTakenPlan, updateSelectedPlan }
