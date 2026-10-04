import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import PaginaPublica from '../components/PaginaPublica'
import { Avatar, Card, Chip, IcoBuscar, IcoCert, Vacio } from '../components/ui'
import { estadoAsignacion, vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

const ETIQUETA = {
  al_dia: { texto: 'Vigente', tono: 'verde' },
  por_vencer: { texto: 'Por vencer', tono: 'ambar' },
  vencido: { texto: 'Vencido', tono: 'rojo' },
}

/**
 * Módulo 7: consulta pública de certificados por DNI, sin login — tal como
 * pide la especificación. El punto más sensible de este módulo es la
 * privacidad: nunca se lista ni se busca por nombre, solo por DNI exacto, y
 * la respuesta es la misma (sin resultados) tanto si el DNI no existe como
 * si existe pero no tiene certificados, para no confirmar ni negar que una
 * persona está en el sistema.
 */
export default function ConsultaCertificados() {
  const { empleados, asignaciones, cursos } = useApp()
  const [dni, setDni] = useState('')
  const [buscado, setBuscado] = useState(null) // null = todavía no buscó

  function buscar(e) {
    e.preventDefault()
    const q = dni.trim()
    if (!q) return
    const empleado = empleados.find((emp) => emp.dni.replace(/\D/g, '') === q.replace(/\D/g, ''))
    setBuscado({ dni: q, empleado })
  }

  const certificados = buscado?.empleado
    ? asignaciones
        .filter((a) => a.empleadoId === buscado.empleado.id && a.aprobado && a.certificadoId)
        .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))
    : []

  return (
    <PaginaPublica>
      <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Consulta de certificados</h1>
      <p className="text-sm text-slate-500 mt-1 mb-5">
        Ingresá tu DNI para ver y descargar tus certificados de capacitación. No hace falta iniciar sesión.
      </p>

      <Card>
        <form onSubmit={buscar} className="flex flex-col sm:flex-row gap-2.5">
          <input
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ej.: 30.123.456"
            inputMode="numeric"
            className="input flex-1"
            autoFocus
          />
          <button type="submit" className="btn-primary shrink-0">
            <IcoBuscar size={16} />
            Buscar
          </button>
        </form>
      </Card>

      {buscado && (
        <div className="mt-4">
          {!buscado.empleado || certificados.length === 0 ? (
            <Card>
              <Vacio
                titulo="No se encontraron certificados"
                descripcion="Revisá que el DNI esté bien escrito. Si el problema sigue, consultá con tu capacitador."
              />
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Avatar nombre={buscado.empleado.nombre} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{buscado.empleado.nombre}</p>
                  <p className="text-xs text-slate-500">{buscado.empleado.puesto}</p>
                </div>
              </div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {certificados.map((a) => {
                  const curso = cursos.find((c) => c.id === a.cursoId)
                  const sit = estadoAsignacion(a, curso)
                  const et = ETIQUETA[sit] ?? ETIQUETA.al_dia
                  const vence = vencimientoCapacitacion(a, curso)
                  return (
                    <li key={a.id}>
                      <Link
                        to={`/certificado/${a.id}`}
                        className="card p-4 flex gap-3.5 hover:border-brand-300 hover:shadow-md transition-all"
                      >
                        <span className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                          <IcoCert size={22} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="font-semibold text-slate-900 leading-tight">{curso?.nombre}</h2>
                            <Chip tono={et.tono}>{et.texto}</Chip>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Emitido el {fmtCorta(a.fechaCompletado)} · nota {a.puntaje}%
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Válido hasta {fmtCorta(vence)} ({fmtRelativa(vence)})
                          </p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </PaginaPublica>
  )
}
