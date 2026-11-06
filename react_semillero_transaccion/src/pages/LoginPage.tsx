import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS, HttpError } from '../services/api';
import { DemoAccountPreset } from '../types/api';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@universidad.edu.co');
  const [password, setPassword] = useState('Clave123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorStatus(null);
    setSubmitting(true);

    try {
      const role = await login({ email: email.trim(), password });
      if (role === 'ADMINISTRADOR') {
        navigate('/semilleros');
      } else {
        navigate('/mis-semilleros');
      }
    } catch (err) {
      if (err instanceof HttpError) {
        setErrorStatus(err.status);
        setErrorMessage(err.message);
      } else {
        setErrorStatus(500);
        setErrorMessage(
          'No fue posible conectar con el servidor backend en http://localhost:8080. Verifique que Spring Boot esté en ejecución.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPreset = async (preset: DemoAccountPreset, autoLogin = false) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setErrorMessage(null);
    setErrorStatus(null);

    if (autoLogin) {
      setSubmitting(true);
      try {
        const role = await login({ email: preset.email, password: preset.password });
        if (role === 'ADMINISTRADOR') {
          navigate('/semilleros');
        } else {
          navigate('/mis-semilleros');
        }
      } catch (err) {
        if (err instanceof HttpError) {
          setErrorStatus(err.status);
          setErrorMessage(err.message);
        } else {
          setErrorStatus(500);
          setErrorMessage(
            'No fue posible conectar con el servidor backend en http://localhost:8080.'
          );
        }
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-space-md bg-surface font-body-md text-on-surface antialiased">
      <div className="flex flex-col w-full">
        <div className="w-full max-w-7xl mx-auto rounded-xl shadow-xl overflow-hidden bg-surface-container-lowest flex flex-col lg:flex-row min-h-[780px]">
          {/* LEFT PANEL: Institutional Branding & Academic Context */}
          <div className="relative w-full lg:w-[45%] bg-gradient-to-br from-primary-container via-primary to-on-primary-fixed p-8 lg:p-12 text-on-primary flex flex-col justify-between overflow-hidden">
            {/* Decorative Architectural & Shield Geometry Background */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
              <svg className="w-[500px] h-[500px] text-on-primary" fill="currentColor" viewBox="0 0 200 200">
                <path
                  d="M100 15 L160 45 L160 115 C160 155 100 185 100 185 C100 185 40 155 40 115 L40 45 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M100 35 L145 58 L145 110 C145 142 100 168 100 168 C100 168 55 142 55 110 L55 58 Z"
                  fill="currentColor"
                  opacity="0.15"
                />
                <circle cx="100" cy="95" fill="none" r="28" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M100 68 C96 82 88 92 88 102 C88 108 93 114 100 114 C107 114 112 108 112 102 C112 92 104 82 100 68 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col">
              {/* University Academic Bar */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/15 backdrop-blur-sm flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-on-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    local_fire_department
                  </span>
                </div>
                <div>
                  <span className="block font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed opacity-90">
                    UFPS • Cúcuta, Colombia
                  </span>
                  <span className="block font-headline-sm text-headline-sm font-bold tracking-tight">
                    Universidad Francisco de Paula Santander
                  </span>
                </div>
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-surface-container-lowest/10 backdrop-blur-sm self-start mb-6">
                <p className="font-label-sm text-label-sm text-on-primary font-semibold tracking-wide">
                  Vicerrectoría Asistente de Investigación y Extensión (VAIE)
                </p>
              </div>

              <h1 className="font-display text-display font-bold leading-tight tracking-tight text-on-primary mb-4">
                Sistema Integrado de Gestión de Semilleros
              </h1>
              <p className="font-body-md text-body-md text-primary-fixed opacity-90 mb-8 max-w-md">
                Ecosistema institucional para la trazabilidad, divulgación y fomento de la producción científica y la formación investigativa.
              </p>

              {/* Academic Value Bullets */}
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest/15 backdrop-blur-sm shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-on-primary">verified_user</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-primary font-semibold">
                      MinCiencias &amp; Categorización
                    </h2>
                    <p className="font-body-sm text-body-sm text-primary-fixed opacity-80 mt-0.5">
                      Registro centralizado de semilleros y líneas de investigación reconocidas formalmente.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest/15 backdrop-blur-sm shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-on-primary">groups_3</span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-primary font-semibold">
                      Talento &amp; Investigadores Líderes
                    </h2>
                    <p className="font-body-sm text-body-sm text-primary-fixed opacity-80 mt-0.5">
                      Vinculación y seguimiento continuo de planes de trabajo y formación estudiantil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest/15 backdrop-blur-sm shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-on-primary">
                      security_update_good
                    </span>
                  </div>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-primary font-semibold">
                      Seguridad JWT Institucional
                    </h2>
                    <p className="font-body-sm text-body-sm text-primary-fixed opacity-80 mt-0.5">
                      Trazabilidad y control granular de accesos por roles académicos auditados.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Institutional Footer Badge */}
            <div className="relative z-10 pt-8 mt-8 border-t border-on-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary-fixed"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  award_star
                </span>
                <span className="font-label-sm text-label-sm font-semibold tracking-wide text-on-primary uppercase">
                  Acreditación Institucional de Alta Calidad
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-fixed opacity-75">
                Spring Boot + JWT
              </span>
            </div>
          </div>

          {/* RIGHT PANEL: Authentication Form & Live Testing Controls */}
          <div className="w-full lg:w-[55%] p-8 lg:p-14 bg-surface-container-lowest flex flex-col justify-between">
            <div className="max-w-md w-full mx-auto flex flex-col">
              {/* Logo & Title Header */}
              <div className="flex flex-col items-start mb-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-display font-bold text-xl shadow-sm">
                    UFPS
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Portal SIAWEB • I+D+i
                    </span>
                    <span className="font-body-sm text-body-sm text-secondary">
                      Autenticación OAuth2 Resource Server (JWT)
                    </span>
                  </div>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Iniciar Sesión Institucional
                </h2>
                <p className="font-body-md text-body-md text-secondary mt-1">
                  Accede con tus credenciales asignadas en el backend de Semilleros.
                </p>
              </div>

              {/* Error Alert Banner (401 / Connection Error) */}
              {errorMessage && (
                <div
                  className="w-full mb-6 p-4 rounded-xl bg-error-container text-on-error-container flex items-start justify-between shadow-sm transition-all duration-300"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="material-symbols-outlined text-error shrink-0 mt-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      error
                    </span>
                    <div className="text-left">
                      <span className="font-label-md text-label-md font-bold text-error block">
                        {errorStatus === 401
                          ? 'Error 401: Credenciales inválidas'
                          : `Error ${errorStatus || ''}: Fallo de autenticación`}
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-dim transition-colors"
                    onClick={() => setErrorMessage(null)}
                    title="Descartar"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-body-md">close</span>
                  </button>
                </div>
              )}

              {/* Authentication Form */}
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Institutional Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-label-md text-label-md text-on-surface flex justify-between items-center"
                    htmlFor="email"
                  >
                    <span>Correo Institucional</span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      @universidad.edu.co
                    </span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-body-lg">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@universidad.edu.co"
                      className="w-full h-11 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-surface-dim text-on-surface placeholder:text-secondary-fixed-dim text-body-md shadow-sm outline-none transition-all duration-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                    />
                  </div>
                </div>

                {/* Password Input with Toggle */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                      Contraseña Institucional
                    </label>
                    <span className="font-label-sm text-label-sm text-secondary">
                      Demo: <code className="text-primary font-mono">Clave123!</code>
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-body-lg">
                      lock
                    </span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña del portal"
                      className="w-full h-11 pl-11 pr-11 rounded-lg bg-surface-container-lowest border border-surface-dim text-on-surface placeholder:text-secondary-fixed-dim text-body-md shadow-sm outline-none transition-all duration-200 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
                    />
                    <button
                      aria-label="Alternar visibilidad de contraseña"
                      className="absolute right-3.5 text-secondary hover:text-on-surface flex items-center justify-center p-1"
                      onClick={() => setShowPassword((prev) => !prev)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-body-md">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2.5">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer"
                  />
                  <label
                    className="font-body-sm text-body-sm text-secondary cursor-pointer select-none"
                    htmlFor="remember"
                  >
                    Mantener sesión activa en este equipo de cómputo
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  disabled={submitting}
                  className="w-full h-12 rounded-lg bg-primary-container hover:bg-primary disabled:opacity-60 text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 mt-1"
                  type="submit"
                >
                  <span>{submitting ? 'Autenticando con JWT...' : 'Iniciar Sesión en el Portal'}</span>
                  <span className="material-symbols-outlined text-body-lg">
                    {submitting ? 'sync' : 'arrow_forward'}
                  </span>
                </button>
              </form>

              {/* Fast Role-Profile Mock Injectors for Institutional Demo (DemoData Accounts) */}
              <div className="mt-7 pt-5 border-t border-surface-container-high">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-primary text-body-md"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      badge
                    </span>
                    <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider text-secondary">
                      Perfiles JWT para Evaluación de Roles (DemoData):
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] text-secondary">
                    Clic para cargar • Doble clic para entrar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_ACCOUNTS.map((preset) => {
                    const isSelected = email === preset.email;
                    const badgeStyle =
                      preset.role === 'ADMINISTRADOR'
                        ? 'bg-error-container text-primary'
                        : preset.role === 'DIRECTOR'
                        ? 'bg-secondary-container text-tertiary'
                        : 'bg-[#FEF3C7] text-[#B45309]';

                    return (
                      <button
                        key={preset.email}
                        type="button"
                        onClick={() => handleSelectPreset(preset, false)}
                        onDoubleClick={() => handleSelectPreset(preset, true)}
                        className={`p-2.5 rounded-lg text-left transition-all focus:outline-none border ${
                          isSelected
                            ? 'bg-surface-container-high border-primary-container/50 shadow-sm'
                            : 'bg-surface-container border-transparent hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-label-sm font-bold ${badgeStyle}`}
                          >
                            {preset.badge}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-primary-container" />
                          )}
                        </div>
                        <span className="block font-body-sm text-body-sm font-semibold text-on-surface truncate">
                          {preset.email.split('@')[0]}
                        </span>
                        <span className="block font-label-sm text-[11px] text-secondary truncate">
                          {preset.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Institutional Support & Helpdesk Footer */}
            <div className="max-w-md w-full mx-auto mt-6 pt-4 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="material-symbols-outlined text-body-sm">api</span>
                <span className="font-body-sm text-body-sm">Backend: POST /api/auth/login</span>
              </div>
              <a
                className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant font-semibold transition-colors flex items-center gap-1"
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
              >
                <span>Swagger OpenAPI</span>
                <span className="material-symbols-outlined text-label-sm">launch</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

