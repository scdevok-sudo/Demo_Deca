import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Card, Chip, Encabezado, IcoCert, Vacio } from '../components/ui'
import { estadoAsignacion, vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'

const ETIQUETA = {
  al_dia: { texto: 'Vigente', tono: 'verde' },
  por_vencer: { texto: 'Por vencer', tono: 'ambar' },
  vencido: { texto: 'Vencido', tono: 'rojo' },
}

export default function MisCertificados() {
  const { asignaciones, cursos, empleadoActual, empleados, iniciarSesion } = useApp()

  if (!empleadoActual) {
    return (
      <Card titulo="¿Quién sos?">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {empleados.map((e) => (
            <button
              key={e.id}
              onClick={() => iniciarSesion('operario', e.id)}
              className="btn-secondary justify-start"
            >
              {e.nombre} — {e.puesto}
            </button>
          ))}
        </div>
      </Card>
    )
  }

  const certificados = asignaciones
    .filter((a) => a.empleadoId === empleadoActual.id && a.aprobado)
    .sort((a, b) => String(b.fechaCompletado).localeCompare(String(a.fechaCompletado)))

  return (
    <>
      <Encabezado
        titulo="Mis certificados"
        descripcion={`${empleadoActual.nombre} · Legajo ${empleadoActual.legajo}`}
      />

      {certificados.length === 0 ? (
        <Card>
          <Vacio
            titulo="Todavía no tenés certificados"
            descripcion="Al aprobar un curso se emite el certificado automáticamente."
            accion={
              <Link to="/mis-cursos" className="btn-primary">
                Ver mis cursos
              </Link>
            }
          />
        </Card>
      ) : (
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
                    <p className="font-mono text-[10px] text-slate-400 mt-1.5 truncate">
                      {a.certificadoId}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
