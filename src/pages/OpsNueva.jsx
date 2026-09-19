import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { ORDEN_TIPOS_OPS, TIPOS_OPS, seguimientoHasta } from '../data/ops'
import { Aviso, Card, Chip, IcoOk, IcoVolver } from '../components/ui'
import { ROLES } from '../components/Layout'
import { fmtCorta, hoyISO } from '../lib/fechas'

/**
 * Formulario de campo de una Observación Preventiva de Seguridad.
 * Lo usan gerente y capacitador; se completa parado al lado del trabajo,
 * así que está pensado para una sola columna en celular.
 */
export default function OpsNueva() {
  const navigate = useNavigate()
  const { empleados, sesion, empleadoActual, guardarOps } = useApp()

  const [tipo, setTipo] = useState('negativa')
  const [acto, setActo] = useState('')
  const [supervisorId, setSupervisorId] = useState(empleados[0]?.id ?? '')
  const [responsableId, setResponsableId] = useState('')
  const [accionInmediata, setAccionInmediata] = useState('')
  const [accionCorrectiva, setAccionCorrectiva] = useState('')
  const [plazoDias, setPlazoDias] = useState(7)
  const [firmaNombre, setFirmaNombre] = useState('')
  const [firmado, setFirmado] = useState(false)
  const [intento, setIntento] = useState(false)
  const [guardada, setGuardada] = useState(null)

  const t = TIPOS_OPS[tipo]
  const fecha = hoyISO()
  const vence = seguimientoHasta(fecha, plazoDias)

  const faltantes = []
  if (!acto.trim()) faltantes.push('la descripción de lo observado')
  if (!supervisorId) faltantes.push('el supervisor a cargo')
  if (!responsableId) faltantes.push('el responsable de ejecución')

  function elegirResponsable(id) {
    setResponsableId(id)
    // La firma suele ser la del responsable: se precarga, pero se puede editar.
    const emp = empleados.find((e) => e.id === id)
    if (emp && !firmaNombre) setFirmaNombre(emp.nombre)
  }

  function guardar() {
    setIntento(true)
    if (faltantes.length > 0) return

    const nueva = guardarOps({
      tipo,
      acto: acto.trim(),
      supervisorId,
      responsableId,
      accionInmediata: accionInmediata.trim(),
      accionCorrectiva: accionCorrectiva.trim(),
      plazoDias,
      firmaNombre: firmaNombre.trim(),
      firmado,
      cargadaPor: empleadoActual?.nombre ?? ROLES[sesion.rol]?.nombre ?? '',
    })
    setGuardada(nueva)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ------------------------------------------------------- confirmación ---

  if (guardada) {
    const tg = TIPOS_OPS[guardada.tipo]
    return (
      <div className="max-w-xl mx-auto">
        <div
          className={`card p-6 text-center border-2 ${
            guardada.tipo === 'positiva'
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-amber-300 bg-amber-50/50'
          }`}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white">
            <IcoOk size={28} />
          </span>
          <h1 className="text-lg font-semibold text-slate-900 mt-4">Observación registrada</h1>
          <p className="text-sm text-slate-600 mt-1.5">
            OPS {tg.texto.toLowerCase()} · {fmtCorta(guardada.fecha)}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-left text-sm border-t border-slate-200 pt-4">
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Supervisor</dt>
              <dd className="text-slate-800">
                {empleados.find((e) => e.id === guardada.supervisorId)?.nombre ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Responsable</dt>
              <dd className="text-slate-800">
                {empleados.find((e) => e.id === guardada.responsableId)?.nombre ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Seguimiento</dt>
              <dd className="text-slate-800">
                {guardada.plazoDias} días · {fmtCorta(guardada.seguimientoHasta)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400 uppercase tracking-wide">Firma</dt>
              <dd className="text-slate-800">
                {guardada.firmado ? guardada.firmaNombre || 'Firmada' : 'Pendiente de firma'}
              </dd>
            </div>
          </dl>

          <p className="text-[11px] text-slate-400 mt-4 font-mono">Registro {guardada.id}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={() => {
              setGuardada(null)
              setActo('')
              setAccionInmediata('')
              setAccionCorrectiva('')
              setFirmaNombre('')
              setFirmado(false)
              setResponsableId('')
              setIntento(false)
            }}
            className="btn-primary flex-1"
          >
            Cargar otra observación
          </button>
          <Link to="/ops" className="btn-secondary flex-1">
            Ver historial y ranking
          </Link>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------ formulario -

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/ops')} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Observaciones
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Nueva observación preventiva
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Se completa en el lugar de trabajo, en el momento de la observación.
        </p>
      </div>

      {/* ------------------------------------------- Tipo de observación -- */}
      <Card titulo="Tipo de observación" className="mb-3">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {ORDEN_TIPOS_OPS.map((clave) => {
            const op = TIPOS_OPS[clave]
            const activo = tipo === clave
            return (
              <button
                key={clave}
                type="button"
                onClick={() => setTipo(clave)}
                aria-pressed={activo}
                className={[
                  'rounded-lg border-2 p-3.5 text-left transition-colors',
                  activo
                    ? clave === 'positiva'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{op.texto}</span>
                  <Chip tono={op.tono}>{activo ? 'Seleccionada' : 'Elegir'}</Chip>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{op.descripcion}</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* --------------------------------------------- Acto reconocido ---- */}
      <Card titulo={t.etiquetaActo} className="mb-3">
        <textarea
          rows={4}
          value={acto}
          onChange={(e) => setActo(e.target.value)}
          placeholder={t.ayudaActo}
          className="input"
        />
        {intento && !acto.trim() && (
          <p className="text-xs text-red-600 mt-1.5">Este campo es obligatorio.</p>
        )}
      </Card>

      {/* --------------------------------------------------- Responsables - */}
      <Card titulo="Responsables" className="mb-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ops-supervisor">
              Supervisor a cargo
            </label>
            <select
              id="ops-supervisor"
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
              className="input"
            >
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.puesto}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ops-responsable">
              Responsable de ejecución
            </label>
            <select
              id="ops-responsable"
              value={responsableId}
              onChange={(e) => elegirResponsable(e.target.value)}
              className="input"
            >
              <option value="">Elegir empleado…</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre} — {e.puesto}
                </option>
              ))}
            </select>
            {intento && !responsableId && (
              <p className="text-xs text-red-600 mt-1.5">Elegí el responsable de ejecución.</p>
            )}
            <p className="text-[11px] text-slate-400 mt-1.5">
              El ranking por empleado se arma sobre este campo.
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------- Acciones - */}
      <Card titulo="Acciones" className="mb-3">
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="ops-inmediata">
              Acción inmediata
            </label>
            <textarea
              id="ops-inmediata"
              rows={2}
              value={accionInmediata}
              onChange={(e) => setAccionInmediata(e.target.value)}
              placeholder="Qué se hizo en el momento, frente a la observación."
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="ops-correctiva">
              Acción correctiva
            </label>
            <textarea
              id="ops-correctiva"
              rows={2}
              value={accionCorrectiva}
              onChange={(e) => setAccionCorrectiva(e.target.value)}
              placeholder="Qué se va a hacer para que no vuelva a pasar."
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="ops-plazo">
              Plazo de seguimiento
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="ops-plazo"
                type="number"
                min="0"
                inputMode="numeric"
                value={plazoDias}
                onChange={(e) => setPlazoDias(e.target.value)}
                className="w-24 min-h-11 sm:min-h-0 rounded-md border border-slate-300 px-3 py-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
              <span className="text-sm text-slate-500">
                días
                {vence && (
                  <span className="text-slate-400 ml-1.5">· vence el {fmtCorta(vence)}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------------------------------------------------- Firma - */}
      <Card titulo="Firma" className="mb-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-end">
          <div>
            <label className="label" htmlFor="ops-firma">
              Nombre de quien firma
            </label>
            <input
              id="ops-firma"
              type="text"
              value={firmaNombre}
              onChange={(e) => setFirmaNombre(e.target.value)}
              placeholder="Nombre y apellido"
              className="input"
            />
          </div>
          <label className="flex items-center min-h-11 gap-2.5 rounded-md border border-slate-300 bg-white px-3 py-2.5 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={firmado}
              onChange={(e) => setFirmado(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500/30"
            />
            <span className="text-sm font-medium text-slate-700">Firmado</span>
          </label>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Si queda sin firmar, la observación se registra igual y aparece marcada como pendiente de
          firma en el historial.
        </p>
      </Card>

      {intento && faltantes.length > 0 && (
        <div className="mb-3">
          <Aviso tono="ambar" titulo="Faltan datos obligatorios">
            Completá {faltantes.join(', ')}.
          </Aviso>
        </div>
      )}

      <div className="sticky bottom-16 md:bottom-4 z-20">
        <div className="card p-3 flex items-center gap-3 shadow-lg">
          <p className="flex-1 min-w-0 text-xs text-slate-500 leading-tight">
            {fmtCorta(fecha)} · OPS {t.texto.toLowerCase()}
          </p>
          <button onClick={guardar} className="btn-primary shrink-0">
            Guardar observación
          </button>
        </div>
      </div>
    </div>
  )
}
