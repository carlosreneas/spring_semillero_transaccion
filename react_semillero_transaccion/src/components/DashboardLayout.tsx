import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user, primaryRole, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [switchingRole, setSwitchingRole] = useState<RoleType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (role: RoleType) => {
    try {
      setSwitchingRole(role);
      const newRole = await switchDemoRole(role);
      if (newRole === 'ADMINISTRADOR') {
        navigate('/semilleros');
      } else {
        navigate('/mis-semilleros');
      }
    } catch (err) {
      console.error('Error al cambiar de rol:', err);
    } finally {
      setSwitchingRole(null);
    }
  };

  const roleBadgeClasses =
    primaryRole === 'ADMINISTRADOR'
      ? 'text-primary-container bg-error-container/60'
      : primaryRole === 'DIRECTOR'
      ? 'text-[#1D4ED8] bg-[#DBEAFE]'
      : 'text-[#B45309] bg-[#FEF3C7]';

  const currentSectionLabel = location.pathname.includes('mis-semilleros')
    ? 'Mis Semilleros'
    : 'Catálogo de Semilleros';

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-on-surface/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-inverse-surface text-inverse-on-surface z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between bg-inverse-surface/90 border-b border-surface-variant/10">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold tracking-tight">
                  UFPS
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">
                  Semilleros I+D+i
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-secondary-fixed-dim hover:text-surface-container-lowest"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="px-space-md py-space-sm mt-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed-dim px-space-xs">
              Módulos de Gestión
            </span>
          </div>

          <nav className="flex flex-col gap-space-xs px-space-sm">
            <NavLink
              to="/semilleros"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-label-lg border-l-4 border-primary-fixed'
                    : 'font-label-lg text-label-lg text-secondary-fixed-dim hover:bg-surface-variant/20 hover:text-surface-container-lowest'
                }`
              }
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">hub</span>
                <span>Semilleros</span>
              </div>
              <span className="bg-primary-container/80 text-on-primary font-label-sm text-[10px] px-1.5 py-0.5 rounded-full">
                ADMIN
              </span>
            </NavLink>

            <NavLink
              to="/mis-semilleros"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-label-lg border-l-4 border-primary-fixed'
                    : 'font-label-lg text-label-lg text-secondary-fixed-dim hover:bg-surface-variant/20 hover:text-surface-container-lowest'
                }`
              }
            >
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                <span>Mis Semilleros</span>
              </div>
              <span className="bg-surface-variant/20 text-secondary-fixed-dim font-label-sm text-[10px] px-1.5 py-0.5 rounded-full">
                DIR/MIEM
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Info & Logout */}
        <div className="flex flex-col pb-space-md px-space-sm border-t border-surface-variant/10 pt-space-sm">
          <div className="px-space-md py-space-xs mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed-dim px-space-xs">
              Sesión JWT Activa
            </span>
          </div>
          <div className="px-space-md py-space-sm rounded-lg bg-surface-variant/10 text-secondary-fixed-dim text-body-sm mb-2">
            <div className="font-semibold text-surface-container-lowest truncate">
              {user?.email}
            </div>
            <div className="text-[11px] mt-0.5">
              Rol: <span className="text-primary-fixed font-semibold">{primaryRole}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-label-md text-label-md text-primary-fixed hover:bg-error-container/20 transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div className="lg:pl-64">
        {/* TOP HEADER */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest z-30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex items-center justify-between px-space-md lg:px-space-lg">
          <div className="flex items-center gap-space-md flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-secondary hover:bg-surface-container"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden sm:flex items-center gap-space-xs font-label-md text-label-md text-secondary">
              <span className="hover:text-primary transition-colors cursor-pointer">UFPS</span>
              <span className="text-secondary-fixed-dim">/</span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Investigación
              </span>
              <span className="text-secondary-fixed-dim">/</span>
              <span className="text-on-surface font-semibold">{currentSectionLabel}</span>
            </div>
            {onSearchChange && (
              <div className="relative flex-1 max-w-xs ml-space-xs sm:ml-space-md">
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-secondary">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 bg-surface rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                  placeholder="Buscar semilleros, sigla..."
                  type="search"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-space-md">
            {/* Role Switcher Connected to Real Backend JWT */}
            <div className="hidden xl:flex items-center bg-surface-container-low p-1 rounded-lg gap-1">
              <span className="font-label-sm text-label-sm text-secondary px-1.5">
                Simular Rol (JWT):
              </span>
              {(['ADMINISTRADOR', 'DIRECTOR', 'MIEMBRO'] as RoleType[]).map((role) => {
                const isCurrent = primaryRole === role;
                const isBusy = switchingRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    disabled={!!switchingRole}
                    onClick={() => handleRoleSwitch(role)}
                    className={`font-label-sm text-label-sm px-2.5 py-1 rounded transition-colors ${
                      isCurrent
                        ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {isBusy ? '...' : role}
                  </button>
                );
              })}
            </div>

            {/* Active User Profile & Logout */}
            <div className="flex items-center gap-space-sm pl-space-sm">
              <div className="flex items-center gap-space-sm pl-space-xs">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold leading-none">
                    {user?.email}
                  </span>
                  <span
                    className={`inline-block mt-1 font-label-sm text-[10px] uppercase font-bold px-1.5 py-0.5 rounded self-end ${roleBadgeClasses}`}
                  >
                    {user?.autoridades?.[0] || `ROLE_${primaryRole}`}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-headline-sm font-bold flex items-center justify-center shadow-sm">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-secondary hover:bg-error-container hover:text-error transition-colors ml-space-xs"
                title="Cerrar Sesión"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="w-full pt-16 bg-surface min-h-screen">{children}</main>
      </div>
    </div>
  );
};

