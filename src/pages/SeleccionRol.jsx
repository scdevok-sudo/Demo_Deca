import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PRODUCTO } from '../config/empresa'
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

export default function SeleccionRol() {
  const { iniciarSesion, empleados, asignaciones, cursos, reiniciarDemo } = useApp()
  const [eligiendoOperario, setEligiendoOperario] = useState(false)
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Si llegó escaneando el QR de un equipo, después de elegir el rol se vuelve
  // a esa pantalla en lugar de ir al inicio.
  const destinoPendiente = location.state?.desde

  function elegir(op) {
    if (op.clave === 'operario') {
      setEligiendoOperario(true)
      return
    }
    iniciarSesion(op.clave)
    navigate(destinoPendiente ?? op.destino)
  }

  function elegirOperario(emp) {
    iniciarSesion('operario', emp.id)
    navigate(destinoPendiente ?? '/mis-cursos')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
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

          {destinoPendiente && (
            <div className="mb-5 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-center">
              <p className="text-sm text-brand-900 font-medium">
                Identificate para continuar
              </p>
              <p className="text-xs text-brand-700 mt-0.5 font-mono">{destinoPendiente}</p>
            </div>
          )}

          {!eligiendoOperario ? (
            <>
              <p className="text-center text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
                Ingresar como
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {OPCIONES.map((op) => (
                  <button
                    key={op.clave}
                    onClick={() => elegir(op)}
                    className="card p-5 text-left hover:border-brand-400 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 group"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                      <op.Icono size={20} />
                    </span>
                    <p className="mt-3 font-semibold text-slate-900">{op.nombre}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{op.descripcion}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
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
                      onClick={() => elegirOperario(emp)}
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
                <button onClick={() => setEligiendoOperario(false)} className="btn-ghost text-sm">
                  ← Volver
                </button>
              </div>
            </>
          )}

          <p className="text-center text-xs text-slate-400 mt-8">
            Entorno de demostración con datos de ejemplo.{' '}
            {confirmarReinicio ? (
              <>
                <button
                  onClick={() => {
                    reiniciarDemo()
                    setConfirmarReinicio(false)
                  }}
                  className="font-semibold text-red-600 underline hover:text-red-700"
                >
                  Confirmar reinicio
                </button>
                {' · '}
                <button
                  onClick={() => setConfirmarReinicio(false)}
                  className="underline hover:text-slate-600"
                >
                  cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmarReinicio(true)}
                className="underline hover:text-slate-600"
              >
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
