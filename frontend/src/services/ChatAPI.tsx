import { ChatResponse } from '../models/Chatbot.tsx'

import { API_URL } from './config.tsx'

async function getRecommendedCourse(
  bearerToken: string,
  message: string
): Promise<ChatResponse> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify({ message }),
  }
  const response = await fetch(`${API_URL}/api/chat/`, options)
  return await response.json()
}

export default { getRecommendedCourse }
