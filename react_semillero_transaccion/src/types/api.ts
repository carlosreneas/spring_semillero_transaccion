export type RoleType = 'ADMINISTRADOR' | 'DIRECTOR' | 'MIEMBRO';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface UserIdentity {
  email: string;
  autoridades: string[];
}

export interface DirectorResumen {
  id: number;
  nombre: string;
  correo: string;
}

export interface IntegranteResumen {
  id: number;
  codigo: string;
  nombre: string;
  programa: string;
  esLider: boolean;
}

export interface SemilleroResponse {
  id: number;
  nombre: string | null;
  sigla: string;
  grupoInvestigacion: string | null;
  mision: string | null;
  vision: string | null;
  objetivoGeneral: string | null;
  totalIntegrantes: number;
  estado: string;
  director: DirectorResumen | null;
  lineas: string[];
  integrantes: IntegranteResumen[];
}

export interface ApiError {
  status: number;
  error?: string;
  mensaje?: string;
}

export interface DemoAccountPreset {
  label: string;
  badge: string;
  email: string;
  password: string;
  role: RoleType;
  subtitle: string;
  codigoEstudiantil?: string;
}

