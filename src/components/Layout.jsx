import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { EMPRESA, PRODUCTO } from '../config/empresa'
import { useApp } from '../store/AppStore'
import LogoEmpresa from './LogoEmpresa'
import PieMarca from './PieMarca'
import {
  Avatar,
  IcoCatalogo,
  IcoCert,
  IcoChat,
  IcoCurso,
  IcoEquipo,
  IcoHistorial,
  IcoOjo,
  IcoPanel,
  IcoPuesto,
  IcoQR,
  IcoSalir,
  IcoUsuario,
} from './ui'

export const ROLES = {
  gerente: { clave: 'gerente', nombre: 'Gerente', descripcion: 'Dashboard de cumplimiento' },
  capacitador: { clave: 'capacitador', nombre: 'Capacitador', descripcion: 'Cursos y evaluaciones' },
  operario: { clave: 'operario', nombre: 'Operario', descripcion: 'Cursos e inspecciones' },
}

// El capacitador ya no ve el historial de inspecciones: su panel queda
// acotado a cursos/capacitaciones más los dos módulos nuevos.
const NAV = {
  gerente: [
    { to: '/dashboard', texto: 'Dashboard', Icono: IcoPanel },
    { to: '/personal', texto: 'Personal', Icono: IcoUsuario },
    { to: '/puestos', texto: 'Puestos', Icono: IcoPuesto },
    { to: '/equipos', texto: 'Equipos', Icono: IcoEquipo },
    { to: '/capacitaciones', texto: 'Capacitaciones', Icono: IcoCurso },
    { to: '/catalogo', texto: 'Catálogo', Icono: IcoCatalogo },
    { to: '/ops', texto: 'OPS', Icono: IcoOjo },
    { to: '/comunicaciones', texto: 'Consultas', Icono: IcoChat },
    { to: '/historial', texto: 'Historial', Icono: IcoHistorial },
  ],
  capacitador: [
    { to: '/personal', texto: 'Personal', Icono: IcoUsuario },
    { to: '/puestos', texto: 'Puestos', Icono: IcoPuesto },
    { to: '/capacitaciones', texto: 'Capacitaciones', Icono: IcoCurso },
    { to: '/catalogo', texto: 'Catálogo', Icono: IcoCatalogo },
    { to: '/equipos/qr', texto: 'Códigos QR', Icono: IcoQR },
    { to: '/ops', texto: 'OPS', Icono: IcoOjo },
    { to: '/comunicaciones', texto: 'Consultas', Icono: IcoChat },
  ],
  operario: [
    { to: '/mis-cursos', texto: 'Mis cursos', Icono: IcoCurso },
    { to: '/inspeccion', texto: 'Inspección', Icono: IcoEquipo },
    { to: '/comunicaciones', texto: 'Consultas', Icono: IcoChat },
    { to: '/mis-certificados', texto: 'Certificados', Icono: IcoCert },
  ],
}

function claseNav({ isActive }) {
  return [
    'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
    isActive ? 'bg-brand-800 text-white' : 'text-brand-100 hover:bg-brand-800/60 hover:text-white',
  ].join(' ')
}

export default function Layout() {
  const { sesion, empleadoActual, cerrarSesion } = useApp()
  const navigate = useNavigate()
  const items = NAV[sesion.rol] ?? []
  const esOperario = sesion.rol === 'operario'

  function salir() {
    cerrarSesion()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* ------------------------------------------------------- Header -- */}
      <header className="bg-brand-900 text-white sticky top-0 z-30 no-print">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-14">
            <div className="flex items-center gap-3 min-w-0">
              <LogoEmpresa size={26} variante="claro" />
              <div className="min-w-0 leading-tight border-l border-white/20 pl-3">
                <p className="text-sm font-semibold truncate">{PRODUCTO.nombre}</p>
                <p className="text-[11px] text-brand-300 truncate">{PRODUCTO.modulo}</p>
              </div>
            </div>

            <button
              onClick={salir}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-brand-800 transition-colors"
              title="Cambiar de rol"
            >
              <div className="text-right hidden sm:block leading-tight">
                <p className="text-xs font-semibold">
                  {empleadoActual?.nombre ?? ROLES[sesion.rol]?.nombre}
                </p>
                <p className="text-[11px] text-brand-300">
                  {esOperario ? empleadoActual?.puesto : ROLES[sesion.rol]?.nombre}
                </p>
              </div>
              <Avatar nombre={empleadoActual?.nombre ?? ROLES[sesion.rol]?.nombre ?? '?'} size="sm" />
              <IcoSalir size={16} className="text-brand-300" />
            </button>
          </div>

          {/* Nav de escritorio */}
          <nav className="hidden md:flex items-center gap-1 pb-2">
            {items.map(({ to, texto, Icono }) => (
              <NavLink key={to} to={to} className={claseNav}>
                <Icono size={16} />
                {texto}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* ------------------------------------------------------ Contenido - */}
      <main className={`flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 py-5 ${esOperario ? 'pb-24 md:pb-6' : 'pb-8'}`}>
        <Outlet />
      </main>

      {/* ----------------------------------------- Nav inferior (celular) - */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 no-print pb-[env(safe-area-inset-bottom)]">
        {/* Tabs en fila: cada una reparte el ancho disponible, pero nunca baja
            de 4.5rem. Con 4 ítems entran justas; con 6 (gerente) la fila se
            desplaza en lugar de apretar la etiqueta "Capacitaciones". */}
        <div className="tabs-scroll flex">
          {items.map(({ to, texto, Icono }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex-1 shrink-0 min-w-[5.25rem] flex flex-col items-center justify-center gap-0.5 px-1.5 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-brand-700' : 'text-slate-500',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icono size={20} />
                  <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>{texto}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <footer className="border-t border-slate-200 bg-white no-print mb-16 md:mb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <PieMarca compacto />
          <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex flex-col sm:flex-row gap-1 sm:justify-between text-center sm:text-left">
            <span>
              {EMPRESA.nombre} — {PRODUCTO.nombre} {PRODUCTO.modulo}
            </span>
            <span>Entorno de demostración · datos de ejemplo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
