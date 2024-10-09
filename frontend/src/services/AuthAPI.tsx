import { API_URL } from './config.tsx'

interface LoginResponse {
  access: string;
  refresh: string;
}

async function login(email: string, password: string): Promise<LoginResponse> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username: email.split('@')[0] }) // TODO: remove username
  }
  const response = await fetch(`${API_URL}/auth/login/`, options)
  return await response.json()
}

async function register(email: string, password: string, firstName: string, lastName: string): Promise<LoginResponse> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username: email, password, password2: password, first_name: firstName, last_name: lastName }) // TODO: remove username and password2
  }
  const response = await fetch(`${API_URL}/auth/register/`, options)
  return await response.json()
}

async function logout(): Promise<boolean> {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }
  const response = await fetch(`${API_URL}/api/logout/`, options)
  return response.ok
}

export default { login, register, logout }