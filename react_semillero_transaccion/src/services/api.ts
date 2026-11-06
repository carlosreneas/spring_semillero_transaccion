import {
  DemoAccountPreset,
  LoginRequest,
  LoginResponse,
  SemilleroResponse,
  UserIdentity,
} from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const DEMO_ACCOUNTS: DemoAccountPreset[] = [
  {
    label: 'Administración VAIE',
    badge: 'ADMIN',
    email: 'admin@universidad.edu.co',
    password: 'Clave123!',
    role: 'ADMINISTRADOR',
    subtitle: 'Super Administrador',
  },
  {
    label: 'Directora Software',
    badge: 'DIRECTOR',
    email: 'director.software@universidad.edu.co',
    password: 'Clave123!',
    role: 'DIRECTOR',
    subtitle: 'Dirige SIS-01',
  },
  {
    label: 'Director Datos',
    badge: 'DIRECTOR',
    email: 'director.datos@universidad.edu.co',
    password: 'Clave123!',
    role: 'DIRECTOR',
    subtitle: 'Dirige SAD-01',
  },
  {
    label: 'Miembro Uno (Líder)',
    badge: 'MIEMBRO',
    email: 'miembro1@universidad.edu.co',
    password: 'Clave123!',
    role: 'MIEMBRO',
    subtitle: 'Cód. 2026901 • SIS-01',
    codigoEstudiantil: '2026901',
  },
  {
    label: 'Miembro Dos',
    badge: 'MIEMBRO',
    email: 'miembro2@universidad.edu.co',
    password: 'Clave123!',
    role: 'MIEMBRO',
    subtitle: 'Cód. 2026902 • SIS-01',
    codigoEstudiantil: '2026902',
  },
  {
    label: 'Miembro Tres (Líder)',
    badge: 'MIEMBRO',
    email: 'miembro3@universidad.edu.co',
    password: 'Clave123!',
    role: 'MIEMBRO',
    subtitle: 'Cód. 2026903 • SAD-01',
    codigoEstudiantil: '2026903',
  },
];

export class HttpError extends Error {
  status: number;
  detail?: string;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: { mensaje?: string; error?: string } = {};
    try {
      errorBody = await response.json();
    } catch {
      // Sin cuerpo JSON
    }
    const msg =
      errorBody.mensaje ||
      errorBody.error ||
      (response.status === 401
        ? 'Credenciales inválidas o sesión expirada'
        : response.status === 403
        ? 'No tiene permisos para acceder a este recurso (HTTP 403 Forbidden)'
        : `Error HTTP ${response.status}`);
    throw new HttpError(response.status, msg, errorBody.error);
  }
  return response.json() as Promise<T>;
}

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<LoginResponse>(response);
}

export async function fetchYoApi(token: string): Promise<UserIdentity> {
  const response = await fetch(`${API_BASE}/api/auth/yo`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<UserIdentity>(response);
}

export async function fetchTodosSemillerosApi(token: string): Promise<SemilleroResponse[]> {
  const response = await fetch(`${API_BASE}/api/semilleros`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<SemilleroResponse[]>(response);
}

export async function fetchMisSemillerosApi(token: string): Promise<SemilleroResponse[]> {
  const response = await fetch(`${API_BASE}/api/semilleros/mios`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<SemilleroResponse[]>(response);
}

export async function fetchSemilleroPorIdApi(
  id: number,
  token: string
): Promise<SemilleroResponse> {
  const response = await fetch(`${API_BASE}/api/semilleros/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<SemilleroResponse>(response);
}

