import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  DEMO_ACCOUNTS,
  fetchMisSemillerosApi,
  fetchSemilleroPorIdApi,
  fetchTodosSemillerosApi,
  HttpError,
} from '../services/api';
import { SemilleroResponse } from '../types/api';

interface SemillerosPageProps {
  mode: 'all' | 'mios';
}

export const SemillerosPage: React.FC<SemillerosPageProps> = ({ mode }) => {
  const { token, user, primaryRole, expiresInSeconds, login } = useAuth();

  const [semilleros, setSemilleros] = useState<SemilleroResponse[]>([]);
  const [selectedSemillero, setSelectedSemillero] = useState<SemilleroResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [sortBy, setSortBy] = useState<'nombre' | 'miembros' | 'recientes'>('nombre');

  // HTTP 403 / Error Banner state
  const [forbiddenAlert, setForbiddenAlert] = useState<{
    status: number;
    title: string;
    message: string;
    endpoint: string;
  } | null>(null);

  // ID input to test GET /api/semilleros/{id} access control
  const [testSemilleroId, setTestSemilleroId] = useState<string>('1');

  const loadList = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setForbiddenAlert(null);

    try {
      const data =
        mode === 'all'
          ? await fetchTodosSemillerosApi(token)
          : await fetchMisSemillerosApi(token);
      setSemilleros(data);
      if (data.length > 0) {
        setSelectedSemillero((prev) => {
          const found = prev ? data.find((s) => s.id === prev.id) : null;
          return found || data[0];
        });
      } else {
        setSelectedSemillero(null);
      }
    } catch (err) {
      setSemilleros([]);
      setSelectedSemillero(null);
      if (err instanceof HttpError) {
        setForbiddenAlert({
          status: err.status,
          title:
            err.status === 403
              ? `Acceso Restringido al Endpoint ${
                  mode === 'all' ? 'GET /api/semilleros' : 'GET /api/semilleros/mios'
                }`
              : `Error HTTP ${err.status}`,
          message:
            err.status === 403
              ? mode === 'all'
                ? 'El listado general (GET /api/semilleros) requiere el rol ADMINISTRADOR. Tu rol actual es ' +
                  primaryRole +
                  '. Usa la vista "Mis Semilleros" (GET /api/semilleros/mios) o cambia al perfil ADMINISTRADOR.'
                : 'El endpoint GET /api/semilleros/mios está reservado para los roles DIRECTOR y MIEMBRO. Como ADMINISTRADOR debes consultar el Catálogo General (GET /api/semilleros).'
              : err.message,
          endpoint: mode === 'all' ? 'GET /api/semilleros' : 'GET /api/semilleros/mios',
        });
      } else {
        setForbiddenAlert({
          status: 500,
          title: 'Error de conexión con el Backend',
          message:
            'No se pudo conectar con http://localhost:8080. Asegúrate de que el backend Spring Boot esté en ejecución.',
          endpoint: mode === 'all' ? 'GET /api/semilleros' : 'GET /api/semilleros/mios',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [token, mode, primaryRole]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSelectSemillero = async (semillero: SemilleroResponse) => {
    setSelectedSemillero(semillero);
    if (!token) return;
    setDetailLoading(true);
    try {
      const freshDetail = await fetchSemilleroPorIdApi(semillero.id, token);
      setSelectedSemillero(freshDetail);
      setForbiddenAlert(null);
    } catch (err) {
      if (err instanceof HttpError) {
        setForbiddenAlert({
          status: err.status,
          title: `Acceso Restringido: Semillero #${semillero.id} (${semillero.sigla})`,
          message: err.message,
          endpoint: `GET /api/semilleros/${semillero.id}`,
        });
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const handleTestObtenerPorId = async (idToFetch: number) => {
    if (!token || Number.isNaN(idToFetch)) return;
    setDetailLoading(true);
    try {
      const detail = await fetchSemilleroPorIdApi(idToFetch, token);
      setSelectedSemillero(detail);
      setForbiddenAlert(null);
    } catch (err) {
      if (err instanceof HttpError) {
        setForbiddenAlert({
          status: err.status,
          title:
            err.status === 403
              ? `Acceso Restringido: Semillero ID #${idToFetch} (HTTP 403 Forbidden)`
              : `Respuesta HTTP ${err.status} en Semillero ID #${idToFetch}`,
          message:
            err.status === 403
              ? `No tiene privilegios para consultar el semillero ID #${idToFetch}. Según la regla @PreAuthorize("@acceso.puedeVer(#semilleroId, authentication)"), los directores e integrantes solo pueden consultar semilleros donde figuren vinculados.`
              : err.message,
          endpoint: `GET /api/semilleros/${idToFetch}`,
        });
      }
    } finally {
      setDetailLoading(false);
    }
  };

  // Unique research groups for filter dropdown
  const gruposUnicos = useMemo(() => {
    const set = new Set<string>();
    semilleros.forEach((s) => {
      if (s.grupoInvestigacion) set.add(s.grupoInvestigacion);
    });
    return Array.from(set);
  }, [semilleros]);

  // Filtered and sorted semilleros
  const filteredSemilleros = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return semilleros
      .filter((s) => {
        if (selectedGrupo && s.grupoInvestigacion !== selectedGrupo) return false;
        if (selectedEstado && s.estado !== selectedEstado) return false;
        if (!q) return true;
        const matchNombre = s.nombre?.toLowerCase().includes(q);
        const matchSigla = s.sigla.toLowerCase().includes(q);
        const matchGrupo = s.grupoInvestigacion?.toLowerCase().includes(q);
        const matchDirector = s.director?.nombre.toLowerCase().includes(q);
        const matchLinea = s.lineas?.some((l) => l.toLowerCase().includes(q));
        return matchNombre || matchSigla || matchGrupo || matchDirector || matchLinea;
      })
      .sort((a, b) => {
        if (sortBy === 'miembros') {
          return b.totalIntegrantes - a.totalIntegrantes;
        }
        if (sortBy === 'recientes') {
          return b.id - a.id;
        }
        return (a.nombre || a.sigla).localeCompare(b.nombre || b.sigla);
      });
  }, [semilleros, searchTerm, selectedGrupo, selectedEstado, sortBy]);

  // KPI metrics calculated from backend response
  const metrics = useMemo(() => {
    const total = semilleros.length;
    const activos = semilleros.filter((s) => s.estado === 'REGISTRADO').length;
    const directoresUnicos = new Set(
      semilleros.map((s) => s.director?.correo).filter(Boolean)
    ).size;
    const totalEstudiantes = semilleros.reduce((acc, s) => acc + (s.totalIntegrantes || 0), 0);
    return { total, activos, directoresUnicos, totalEstudiantes };
  }, [semilleros]);

  const currentAccountPreset = useMemo(
    () => DEMO_ACCOUNTS.find((a) => a.email === user?.email),
    [user]
  );

  return (
    <DashboardLayout searchQuery={searchTerm} onSearchChange={setSearchTerm}>
      <div className="flex flex-col w-full px-space-md lg:px-margin py-space-lg gap-space-lg text-on-surface max-w-[1580px] mx-auto">
        {/* JWT CONTEXT BANNER (Shown in Mis Semilleros or when switching profiles) */}
        {mode === 'mios' && (
          <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div className="flex items-start sm:items-center gap-space-md">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary font-display text-2xl font-bold flex items-center justify-center shadow-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#16A34A] ring-2 ring-surface-container-lowest flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-surface-container-lowest">
                      check
                    </span>
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      {currentAccountPreset?.label || user?.email}
                    </h1>
                    <span
                      className={`font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-semibold tracking-wide ${
                        primaryRole === 'DIRECTOR'
                          ? 'bg-secondary-container text-on-secondary-fixed'
                          : primaryRole === 'MIEMBRO'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-error-container text-primary'
                      }`}
                    >
                      {primaryRole === 'DIRECTOR'
                        ? 'DIRECTOR DOCENTE'
                        : primaryRole === 'MIEMBRO'
                        ? 'MIEMBRO / ESTUDIANTE'
                        : 'ADMINISTRADOR'}
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary">
                      Endpoint: GET /api/semilleros/mios
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">alternate_email</span>
                    <span>{user?.email}</span>
                    {currentAccountPreset?.codigoEstudiantil && (
                      <>
                        <span className="text-secondary-fixed-dim">|</span>
                        <span className="font-mono font-semibold text-primary">
                          Cód. Estudiantil: {currentAccountPreset.codigoEstudiantil}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Quick switcher between Director and Miembro accounts */}
              <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-low p-1.5 rounded-xl">
                <div className="flex items-center gap-1.5 px-2 py-1">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified_user
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-medium">
                    Probar Cuenta:
                  </span>
                </div>
                {DEMO_ACCOUNTS.filter((a) => a.role !== 'ADMINISTRADOR').map((preset) => {
                  const active = user?.email === preset.email;
                  return (
                    <button
                      key={preset.email}
                      type="button"
                      onClick={() => login({ email: preset.email, password: preset.password })}
                      className={`px-2.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1 ${
                        active
                          ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                          : 'text-secondary hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {preset.role === 'DIRECTOR' ? 'school' : 'badge'}
                      </span>
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical JWT Bar & 403 Test Trigger */}
            <div className="bg-surface-container-low rounded-lg p-space-sm sm:px-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-sm text-body-sm text-secondary">
                <span className="flex items-center gap-1 text-on-surface font-semibold font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  Token HS256 Activo
                </span>
                <span className="text-secondary-fixed-dim hidden sm:inline">•</span>
                <span>
                  Sub: <strong className="text-on-surface font-medium">{user?.email}</strong>
                </span>
                <span className="text-secondary-fixed-dim hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    schedule
                  </span>
                  Vigencia:{' '}
                  <span className="font-medium text-on-surface">
                    {expiresInSeconds ? `${Math.round(expiresInSeconds / 60)} min` : '60 min'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-secondary">
                  Probar GET /api/semilleros/{'{id}'}:
                </span>
                <input
                  type="number"
                  min={1}
                  value={testSemilleroId}
                  onChange={(e) => setTestSemilleroId(e.target.value)}
                  className="w-16 h-8 px-2 rounded bg-surface-container-lowest border border-surface-dim font-mono text-body-sm text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => handleTestObtenerPorId(Number(testSemilleroId))}
                  className="font-label-sm text-label-sm bg-surface-container hover:bg-primary-container hover:text-on-primary text-primary font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">security</span>
                  <span>Verificar Acceso</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* PAGE HEADER */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <div className="flex items-center gap-space-xs text-primary font-label-md">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span className="tracking-wide uppercase">
                Vicerrectoría Asistente de Investigación y Extensión (VAIE)
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {mode === 'all'
                ? 'Catálogo General de Semilleros de Investigación'
                : 'Mis Semilleros Bajo Gestión e Integración'}
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              {mode === 'all'
                ? 'Consulta institucional en tiempo real desde GET /api/semilleros para el rol ADMINISTRADOR.'
                : 'Consulta de ámbito estricto desde GET /api/semilleros/mios según el director o código estudiantil autenticado.'}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-space-sm">
            <button
              onClick={loadList}
              className="h-10 px-space-md rounded-lg font-label-lg text-label-lg bg-surface-container hover:bg-surface-variant text-on-surface transition-colors flex items-center gap-space-xs shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">refresh</span>
              <span>Sincronizar con Backend</span>
            </button>
          </div>
        </header>

        {/* HTTP 403 FORBIDDEN / ERROR NOTIFICATION CARD */}
        {forbiddenAlert && (
          <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-md space-y-space-md relative overflow-hidden transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#DC2626]" />
            <div className="flex flex-col sm:flex-row items-start justify-between gap-space-md pl-2">
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">gpp_maybe</span>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-[#FEE2E2] text-[#DC2626] font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                      HTTP {forbiddenAlert.status} • ÁMBITO RESTRINGIDO POR ROL
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-mono">
                      Endpoint: {forbiddenAlert.endpoint}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {forbiddenAlert.title}
                  </h3>
                  <p className="font-body-md text-body-md text-secondary max-w-4xl">
                    {forbiddenAlert.message}
                  </p>
                </div>
              </div>
              <button
                className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
                onClick={() => setForbiddenAlert(null)}
                title="Cerrar advertencia"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </section>
        )}

        {/* METRICS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                Total Semilleros
              </span>
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </span>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display text-display text-on-surface">{metrics.total}</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-primary font-bold">
                <span className="material-symbols-outlined text-[14px]">database</span>
                PostgreSQL
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-secondary mt-1">
              {mode === 'all' ? 'Registrados en plataforma I+D+i' : 'Vinculados a tu perfil'}
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                Semilleros Activos
              </span>
              <span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </span>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display text-display text-on-surface">{metrics.activos}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-[#DCFCE7] text-[#15803D] font-semibold">
                100% operativos
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-body-sm text-body-sm text-secondary">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" />
              <span>{metrics.activos} con estado 'REGISTRADO'</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                Directores Vinculados
              </span>
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">school</span>
              </span>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display text-display text-on-surface">
                {metrics.directoresUnicos}
              </span>
              <span className="font-label-sm text-label-sm text-secondary">
                Docentes Investigadores
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-secondary mt-1">
              Responsables de semillero en vista
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
                Estudiantes Integrantes
              </span>
              <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </span>
            </div>
            <div className="mt-space-md flex items-baseline justify-between">
              <span className="font-display text-display text-on-surface">
                {metrics.totalEstudiantes}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary font-bold">
                Pregrado UFPS
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-secondary mt-1">
              Miembros activos con código institucional
            </span>
          </div>
        </section>

        {/* SEARCH AND FILTERS BAR */}
        <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-secondary">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-surface rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/30"
              placeholder="Filtrar por nombre, sigla, director o línea de investigación (ej. SIAWEB, SIS-01, SAD-01)..."
              type="text"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-space-sm items-center">
            <div className="flex items-center gap-1.5 bg-surface px-3 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-secondary">science</span>
              <select
                value={selectedGrupo}
                onChange={(e) => setSelectedGrupo(e.target.value)}
                className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none py-1 max-w-[200px]"
              >
                <option value="">Todos los Grupos I+D</option>
                {gruposUnicos.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-surface px-3 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none py-1"
              >
                <option value="">Estado: Todos</option>
                <option value="REGISTRADO">REGISTRADO (Activo)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-surface px-3 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[18px] text-secondary">sort</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'nombre' | 'miembros' | 'recientes')
                }
                className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none py-1"
              >
                <option value="nombre">Ordenar: Alfabeto A-Z</option>
                <option value="miembros">Mayor número integrantes</option>
                <option value="recientes">Más recientes (ID)</option>
              </select>
            </div>
          </div>
        </section>

        {/* LOADING STATE */}
        {loading ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 shadow-sm flex flex-col items-center justify-center gap-3 text-secondary">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">
              progress_activity
            </span>
            <p className="font-headline-sm text-headline-sm text-on-surface">
              Consultando semilleros en el backend...
            </p>
          </div>
        ) : filteredSemilleros.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-12 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-4xl text-secondary">folder_off</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              No se encontraron semilleros para mostrar
            </h3>
            <p className="font-body-sm text-body-sm text-secondary max-w-md">
              Verifica los filtros de búsqueda o cambia de perfil JWT en la barra superior para consultar los semilleros asociados a otro rol.
            </p>
          </div>
        ) : (
          /* MAIN GRID: SEMILLEROS CARDS & EXPANDED DETAIL VIEW */
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
            {/* LEFT LISTING COLUMN (5 cols on xl) */}
            <div className="xl:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center justify-between px-space-xs">
                <span className="font-label-md text-label-md uppercase text-secondary font-bold tracking-wider">
                  Semilleros en Registro Activo ({filteredSemilleros.length} Mostrados)
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  {mode === 'all' ? 'GET /api/semilleros' : 'GET /api/semilleros/mios'}
                </span>
              </div>

              {filteredSemilleros.map((semillero) => {
                const isSelected = selectedSemillero?.id === semillero.id;
                return (
                  <article
                    key={semillero.id}
                    onClick={() => handleSelectSemillero(semillero)}
                    className={`rounded-xl p-space-md shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-space-sm border ${
                      isSelected
                        ? 'bg-surface-container-low/60 border-primary-container/40 ring-1 ring-primary-container/20'
                        : 'bg-surface-container-lowest border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <span
                          className={`font-headline-sm text-headline-sm px-2.5 py-1 rounded-lg font-bold ${
                            isSelected
                              ? 'bg-primary-container text-on-primary'
                              : 'bg-secondary text-on-secondary'
                          }`}
                        >
                          {semillero.sigla}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-secondary font-semibold line-clamp-1">
                            Grupo: {semillero.grupoInvestigacion || 'Sin grupo especificado'}
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary font-mono">
                            ID #{semillero.id}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-[#DCFCE7] text-[#15803D] font-semibold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        {semillero.estado}
                      </span>
                    </div>

                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {semillero.nombre || `Semillero ${semillero.sigla}`}
                    </h2>

                    <div className="flex items-center gap-space-xs text-secondary font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span>
                        Director:{' '}
                        <strong className="text-on-surface font-semibold">
                          {semillero.director?.nombre || 'No registrado'}
                        </strong>
                      </span>
                    </div>

                    {/* Research lines chips */}
                    {semillero.lineas && semillero.lineas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-space-xs">
                        {semillero.lineas.map((linea) => (
                          <span
                            key={linea}
                            className="bg-surface-container text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded"
                          >
                            {linea}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-space-xs text-secondary font-body-sm text-body-sm">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-secondary">
                          group
                        </span>
                        <span>{semillero.totalIntegrantes} Integrantes vinculados</span>
                      </span>
                      <span
                        className={`font-label-sm text-label-sm flex items-center gap-0.5 ${
                          isSelected ? 'text-primary font-bold' : 'text-secondary'
                        }`}
                      >
                        {isSelected ? 'Ver detalle activo' : 'Explorar ficha'}
                        <span className="material-symbols-outlined text-[16px]">
                          {isSelected ? 'arrow_forward' : 'chevron_right'}
                        </span>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* RIGHT DETAIL VIEW COLUMN (7 cols on xl) */}
            <div className="xl:col-span-7 flex flex-col gap-space-md">
              {selectedSemillero && (
                <section className="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-lg flex flex-col gap-space-lg relative">
                  {detailLoading && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-label-sm font-label-sm text-primary bg-surface-container px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px] animate-spin">
                        sync
                      </span>
                      <span>GET /api/semilleros/{selectedSemillero.id}</span>
                    </div>
                  )}

                  {/* HEADER OF DETAIL */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md pb-space-md border-b border-surface-container">
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span className="bg-primary-container text-on-primary font-label-md text-label-md px-3 py-1 rounded-full font-bold shadow-sm">
                          {selectedSemillero.sigla} - ID #{selectedSemillero.id}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm bg-[#DCFCE7] text-[#15803D] font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                          ESTADO: {selectedSemillero.estado} VIGENTE
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary font-mono">
                          GET /api/semilleros/{selectedSemillero.id}
                        </span>
                      </div>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
                        {selectedSemillero.nombre || `Semillero ${selectedSemillero.sigla}`}
                      </h2>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Grupo de Investigación Adscrito:{' '}
                        <strong className="text-on-surface">
                          {selectedSemillero.grupoInvestigacion || 'General'}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* DIRECTOR PROFILE CARD */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className="w-14 h-14 rounded-full bg-secondary-container text-tertiary font-display text-xl font-bold flex items-center justify-center shadow-sm ring-2 ring-primary-container/20 shrink-0">
                        {selectedSemillero.director?.nombre
                          ? selectedSemillero.director.nombre.charAt(0).toUpperCase()
                          : 'D'}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            {selectedSemillero.director?.nombre || 'Director no asignado'}
                          </span>
                          <span className="bg-[#DBEAFE] text-[#1D4ED8] font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                            DIRECTOR
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-secondary">
                          {selectedSemillero.director?.correo || 'Sin correo registrado'} • Docente Investigador UFPS
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-semibold mt-0.5">
                          Grupo Principal: {selectedSemillero.grupoInvestigacion}
                        </span>
                      </div>
                    </div>
                    <div className="flex md:flex-col items-end gap-1 shrink-0">
                      <span className="font-label-sm text-label-sm text-secondary">
                        ID Director:
                      </span>
                      <span className="font-label-md text-label-md font-bold text-on-surface font-mono">
                        #{selectedSemillero.director?.id || '-'}
                      </span>
                    </div>
                  </div>

                  {/* SECTION: MISIÓN, VISIÓN & OBJETIVO GENERAL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Mision */}
                    <div className="bg-surface rounded-xl p-space-md flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs text-primary font-label-md font-bold">
                        <span className="material-symbols-outlined text-[20px]">flag</span>
                        <span>MISIÓN DEL SEMILLERO</span>
                      </div>
                      <p className="font-body-md text-body-md text-secondary leading-relaxed italic bg-surface-container-lowest/60 p-3 rounded-lg">
                        “
                        {selectedSemillero.mision ||
                          'Fomentar en los estudiantes competencias científicas y tecnológicas avanzadas mediante proyectos de investigación formativa.'}
                        ”
                      </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-surface rounded-xl p-space-md flex flex-col gap-space-xs">
                      <div className="flex items-center gap-space-xs text-primary font-label-md font-bold">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                        <span>VISIÓN PROYECTADA</span>
                      </div>
                      <p className="font-body-md text-body-md text-secondary leading-relaxed italic bg-surface-container-lowest/60 p-3 rounded-lg">
                        “
                        {selectedSemillero.vision ||
                          'Consolidarse como semillero de referencia institucional por la calidad de sus proyectos tecnológicos y producción académica.'}
                        ”
                      </p>
                    </div>
                  </div>

                  {/* OBJETIVO GENERAL & LÍNEAS */}
                  <div className="bg-surface rounded-xl p-space-md flex flex-col gap-space-xs">
                    <div className="flex items-center gap-space-xs text-primary font-label-md font-bold">
                      <span className="material-symbols-outlined text-[20px]">track_changes</span>
                      <span>OBJETIVO GENERAL DE INVESTIGACIÓN</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {selectedSemillero.objetivoGeneral ||
                        'Fortalecer competencias investigativas y técnicas en el área de estudio del semillero.'}
                    </p>

                    <div className="flex flex-col gap-1.5 mt-space-sm pt-space-xs">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                        Líneas de Investigación Institucionales Asociadas:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedSemillero.lineas && selectedSemillero.lineas.length > 0 ? (
                          selectedSemillero.lineas.map((linea) => (
                            <span
                              key={linea}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary-container" />
                              {linea}
                            </span>
                          ))
                        ) : (
                          <span className="text-body-sm text-secondary">
                            Sin líneas registradas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* INTEGRANTES ESTUDIANTILES TABLE SECTION */}
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[22px]">
                          badge
                        </span>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                          Nómina de Integrantes Estudiantiles
                        </h3>
                        <span className="bg-surface-container text-on-surface font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ml-1">
                          {selectedSemillero.totalIntegrantes} Estudiantes
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary">
                        Regla R6: Exactamente 1 Líder por Semillero
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest border border-surface-container shadow-sm">
                      <table className="w-full text-left font-body-sm text-body-sm">
                        <thead className="bg-surface-container font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-space-md" scope="col">
                              Código
                            </th>
                            <th className="py-3 px-space-md" scope="col">
                              Nombre Completo
                            </th>
                            <th className="py-3 px-space-md" scope="col">
                              Programa Académico
                            </th>
                            <th className="py-3 px-space-md" scope="col">
                              Rol en Semillero
                            </th>
                            <th className="py-3 px-space-md" scope="col">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          {selectedSemillero.integrantes &&
                          selectedSemillero.integrantes.length > 0 ? (
                            selectedSemillero.integrantes.map((integrante) => (
                              <tr
                                key={integrante.codigo}
                                className={
                                  integrante.esLider
                                    ? 'bg-surface-container-low/70 hover:bg-surface-container transition-colors'
                                    : 'hover:bg-surface-container-low transition-colors'
                                }
                              >
                                <td
                                  className={`py-3.5 px-space-md font-mono ${
                                    integrante.esLider
                                      ? 'font-bold text-primary'
                                      : 'text-secondary'
                                  }`}
                                >
                                  {integrante.codigo}
                                </td>
                                <td className="py-3.5 px-space-md">
                                  <div className="flex items-center gap-2">
                                    {integrante.esLider && (
                                      <span
                                        className="material-symbols-outlined text-primary-container text-[20px]"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                        title="Líder Estudiantil Reconocido"
                                      >
                                        star
                                      </span>
                                    )}
                                    <div className="flex flex-col">
                                      <span
                                        className={`${
                                          integrante.esLider
                                            ? 'font-bold text-on-surface font-body-md text-body-md'
                                            : 'font-semibold text-on-surface'
                                        } leading-tight`}
                                      >
                                        {integrante.nombre}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-space-md text-on-surface">
                                  {integrante.programa}
                                </td>
                                <td className="py-3.5 px-space-md">
                                  {integrante.esLider ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-[#FEF3C7] text-[#B45309] font-bold shadow-sm">
                                      <span className="material-symbols-outlined text-[14px]">
                                        workspace_premium
                                      </span>
                                      LÍDER DEL SEMILLERO
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-secondary">
                                      Miembro Activo
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-space-md">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-[#DCFCE7] text-[#15803D] font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                                    Activo
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-6 px-space-md text-center text-secondary"
                              >
                                No hay integrantes registrados para este semillero.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

