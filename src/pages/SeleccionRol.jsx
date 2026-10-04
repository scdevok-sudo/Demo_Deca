import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPRESA, PRODUCTO } from '../config/empresa'
import LogoEmpresa from './../components/LogoEmpresa'
import PieMarca from './../components/PieMarca'
import { Avatar } from '../components/ui'
import { useApp } from '../store/AppStore'

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
  const { iniciarSesion, empleados, reiniciarDemo } = useApp()
  const [paso, setPaso] = useState('inicio') // inicio | google-cargando | google-cuentas
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)

  useEffect(() => {
    if (paso !== 'google-cargando') return
    const t = setTimeout(() => setPaso('google-cuentas'), 850)
    return () => clearTimeout(t)
  }, [paso])

  // No navega acá: solo marca la sesión. App.jsx es quien decide a dónde ir
  // una vez que `sesion.rol` está puesto — ver el comentario en App.jsx
  // sobre por qué (evita una carrera entre el login y la navegación que
  // podía mandar a la pantalla por defecto del rol en vez de a la ruta
  // pendiente, por ejemplo al volver de escanear el QR de un equipo).
  function entrar(rol, empleadoId = null) {
    iniciarSesion(rol, empleadoId)
  }

  const cuentas = [
    { ...CUENTA_GERENTE, email: slugEmail(CUENTA_GERENTE.nombre), empleadoId: null },
    { ...CUENTA_CAPACITADOR, email: slugEmail(CUENTA_CAPACITADOR.nombre), empleadoId: null },
    ...empleados.map((emp) => ({
      rol: 'operario',
      nombre: emp.nombre,
      email: slugEmail(emp.nombre),
      etiqueta: `Operario · ${emp.puesto}`,
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

              <p className="text-center text-xs text-slate-400 mt-5">
                ¿Sos empleado y querés ver tus certificados sin iniciar sesión?{' '}
                <Link to="/certificados" className="font-semibold text-brand-700 hover:underline">
                  Consultar por DNI
                </Link>
              </p>
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
                    onClick={() => entrar(c.rol, c.empleadoId)}
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
