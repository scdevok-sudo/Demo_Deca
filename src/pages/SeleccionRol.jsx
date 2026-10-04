import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { EMPRESA, PRODUCTO } from '../config/empresa'
import LogoEmpresa from './../components/LogoEmpresa'
import PieMarca from './../components/PieMarca'
import { Avatar, IcoCurso, IcoPanel, IcoUsuario } from '../components/ui'
import { useApp } from '../store/AppStore'
import { estadoEmpleado } from '../lib/calculos'

const OPCIONES = [
  {
    clave: 'gerente',
    nombre: 'Gerente',
    descripcion: 'Dashboard de cumplimiento, estado de personal y equipos.',
    Icono: IcoPanel,
    destino: '/dashboard',
  },
  {
    clave: 'capacitador',
    nombre: 'Capacitador',
    descripcion: 'Cargar cursos, asignarlos y ver resultados de las evaluaciones.',
    Icono: IcoCurso,
    destino: '/capacitaciones',
  },
  {
    clave: 'operario',
    nombre: 'Operario',
    descripcion: 'Tomar los cursos asignados y registrar inspecciones de equipos.',
    Icono: IcoUsuario,
    destino: '/mis-cursos',
  },
]

// --------------------------------------------------- cuentas simuladas ----
// Solo para que el flujo de "Continuar con Google" tenga nombres y mails
// realistas. No hay conexión real a ninguna cuenta: es una puesta en escena
// para que la demo se sienta como el sistema final va a verse.

function slugEmail(nombre) {
  return (
    nombre
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.') + '@gmail.com'
  )
}

const CUENTA_GERENTE = { rol: 'gerente', nombre: 'Juan Sequeira', etiqueta: 'Gerente · SGI' }
const CUENTA_CAPACITADOR = { rol: 'capacitador', nombre: 'Laura Benítez', etiqueta: 'Capacitador · SGI' }

function IcoGoogle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6C29.5 35 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 39.5 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.6 5.6c-.5.4 7.3-5.3 7.3-15.7 0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

export default function SeleccionRol() {
  const { iniciarSesion, empleados, asignaciones, cursos, reiniciarDemo } = useApp()
  const [paso, setPaso] = useState('inicio') // inicio | google-cargando | google-cuentas | manual | manual-operario
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Si llegó escaneando el QR de un equipo, después de elegir el rol se vuelve
  // a esa pantalla en lugar de ir al inicio.
  const destinoPendiente = location.state?.desde

  useEffect(() => {
    if (paso !== 'google-cargando') return
    const t = setTimeout(() => setPaso('google-cuentas'), 850)
    return () => clearTimeout(t)
  }, [paso])

  function entrar(rol, destino, empleadoId = null) {
    iniciarSesion(rol, empleadoId)
    navigate(destinoPendiente ?? destino)
  }

  function elegir(op) {
    if (op.clave === 'operario') {
      setPaso('manual-operario')
      return
    }
    entrar(op.clave, op.destino)
  }

  const cuentas = [
    { ...CUENTA_GERENTE, email: slugEmail(CUENTA_GERENTE.nombre), destino: '/dashboard', empleadoId: null },
    {
      ...CUENTA_CAPACITADOR,
      email: slugEmail(CUENTA_CAPACITADOR.nombre),
      destino: '/capacitaciones',
      empleadoId: null,
    },
    ...empleados.map((emp) => ({
      rol: 'operario',
      nombre: emp.nombre,
      email: slugEmail(emp.nombre),
      etiqueta: `Operario · ${emp.puesto}`,
      destino: '/mis-cursos',
      empleadoId: emp.id,
    })),
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* ------------------------------------------------ Encabezado -- */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <LogoEmpresa size={72} className="max-w-[min(340px,80vw)]" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
              {PRODUCTO.nombre} — {PRODUCTO.modulo}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Sistema de Gestión Integrado</p>
          </div>

          {destinoPendiente && paso !== 'google-cuentas' && (
            <div className="mb-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-center">
              <p className="text-sm text-brand-900 font-medium">Identificate para continuar</p>
              <p className="text-xs text-brand-700 mt-0.5 font-mono">{destinoPendiente}</p>
            </div>
          )}

          {/* --------------------------------------------------- inicio -- */}
          {paso === 'inicio' && (
            <>
              <button
                onClick={() => setPaso('google-cargando')}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-medium text-slate-700 shadow-sm hover:shadow-md hover:border-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              >
                <IcoGoogle size={20} />
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] uppercase tracking-wide text-slate-400">o acceso directo</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {OPCIONES.map((op) => (
                  <button
                    key={op.clave}
                    onClick={() => elegir(op)}
                    className="card p-3.5 text-left flex items-center gap-3 hover:border-brand-400 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 group"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                      <op.Icono size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">{op.nombre}</span>
                      <span className="block text-xs text-slate-500 truncate">{op.descripcion}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ------------------------------------------- google-cargando -- */}
          {paso === 'google-cargando' && (
            <div className="card p-8 flex flex-col items-center text-center">
              <span className="h-9 w-9 rounded-full border-2 border-slate-200 border-t-brand-600 animate-spin" />
              <p className="text-sm text-slate-500 mt-4">Conectando con Google…</p>
            </div>
          )}

          {/* --------------------------------------------- google-cuentas -- */}
          {paso === 'google-cuentas' && (
            <div className="card overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-center gap-2.5">
                <IcoGoogle size={20} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Elegí una cuenta</p>
                  <p className="text-xs text-slate-500">
                    para continuar a {PRODUCTO.nombre} · {EMPRESA.nombreCorto}
                  </p>
                </div>
              </div>

              <div className="max-h-[22rem] overflow-y-auto divide-y divide-slate-100">
                {cuentas.map((c) => (
                  <button
                    key={c.email}
                    onClick={() => entrar(c.rol, c.destino, c.empleadoId)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
                  >
                    <Avatar nombre={c.nombre} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{c.nombre}</p>
                      <p className="text-xs text-slate-500 truncate">{c.email}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5">
                      {c.etiqueta}
                    </span>
                  </button>
                ))}
              </div>

              <div className="px-5 py-3 border-t border-slate-100">
                <button onClick={() => setPaso('inicio')} className="btn-ghost text-sm w-full justify-center">
                  ← Usar otra cuenta
                </button>
              </div>
            </div>
          )}

          {/* -------------------------------------------- manual-operario -- */}
          {paso === 'manual-operario' && (
            <>
              <p className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                ¿Quién sos?
              </p>
              <div className="card divide-y divide-slate-200 overflow-hidden">
                {empleados.map((emp) => {
                  const est = estadoEmpleado(emp, asignaciones, cursos)
                  const pendientes = asignaciones.filter(
                    (a) => a.empleadoId === emp.id && a.estado === 'pendiente'
                  ).length
                  return (
                    <button
                      key={emp.id}
                      onClick={() => entrar('operario', '/mis-cursos', emp.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <Avatar nombre={emp.nombre} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{emp.nombre}</p>
                        <p className="text-xs text-slate-500">
                          {emp.puesto} · Legajo {emp.legajo}
                        </p>
                      </div>
                      {pendientes > 0 && (
                        <span className="shrink-0 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5">
                          {pendientes} pendiente{pendientes > 1 ? 's' : ''}
                        </span>
                      )}
                      {pendientes === 0 && est.estado.clave === 'vencido' && (
                        <span className="shrink-0 rounded-full bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5">
                          Vencido
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="text-center mt-4">
                <button onClick={() => setPaso('inicio')} className="btn-ghost text-sm">
                  ← Volver
                </button>
              </div>
            </>
          )}

          <p className="text-center text-xs text-slate-400 mt-8">
            {paso === 'google-cuentas'
              ? 'Simulación con fines de demostración: no se conecta con una cuenta de Google real.'
              : 'Entorno de demostración con datos de ejemplo.'}{' '}
            {confirmarReinicio ? (
              <>
                <button
                  onClick={() => {
                    reiniciarDemo()
                    setConfirmarReinicio(false)
                    setPaso('inicio')
                  }}
                  className="font-semibold text-red-600 underline hover:text-red-700"
                >
                  Confirmar reinicio
                </button>
                {' · '}
                <button onClick={() => setConfirmarReinicio(false)} className="underline hover:text-slate-600">
                  cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmarReinicio(true)} className="underline hover:text-slate-600">
                Reiniciar datos
              </button>
            )}
          </p>
        </div>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-5">
          <PieMarca />
        </div>
      </footer>
    </div>
  )
}
