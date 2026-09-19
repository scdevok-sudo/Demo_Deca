import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../store/AppStore'
import { Aviso, Card, ChipEstado, Encabezado, IcoVolver, Vacio } from '../components/ui'
import { estadoEquipo, inspeccionesDe } from '../lib/calculos'
import { fmtCorta, fmtRelativa } from '../lib/fechas'
import { urlInspeccion } from '../lib/qr'
import DetalleInspeccion from '../components/DetalleInspeccion'

export default function EquipoDetalle() {
  const { equipoId } = useParams()
  const { equipos, inspecciones, empleados } = useApp()
  const navigate = useNavigate()

  const equipo = equipos.find((e) => e.id === equipoId)
  if (!equipo) {
    return (
      <Card>
        <Vacio
          titulo="Equipo no encontrado"
          descripcion={`No existe ningún equipo con el identificador ${equipoId}.`}
          accion={
            <Link to="/equipos" className="btn-secondary">
              Volver a equipos
            </Link>
          }
        />
      </Card>
    )
  }

  const { estado, ultima, proxima, noConformidades } = estadoEquipo(equipo, inspecciones)
  const historial = inspeccionesDe(equipo.id, inspecciones)

  return (
    <>
      <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 mb-2 text-sm">
        <IcoVolver size={16} />
        Volver
      </button>

      <Encabezado
        titulo={`${equipo.id} · ${equipo.nombre}`}
        descripcion={`${equipo.marca} ${equipo.modelo}${equipo.patente ? ` · Patente ${equipo.patente}` : ''}`}
        acciones={
          <>
            <ChipEstado estado={estado} className="text-sm px-3 py-1" />
            <Link to={`/inspeccion/${equipo.id}`} className="btn-primary">
              Inspeccionar ahora
            </Link>
          </>
        }
      />

      {estado.clave === 'no_conforme' && (
        <div className="mb-5">
          <Aviso tono="rojo" titulo="Equipo no conforme — fuera de servicio">
            <ul className="mt-1.5 space-y-1">
              {noConformidades.map((nc) => (
                <li key={nc.itemId} className="flex gap-2">
                  <span className="font-mono text-xs opacity-70 shrink-0 pt-0.5">{nc.itemId}</span>
                  <span>
                    <span className="font-medium">{nc.nombre}</span>
                    {nc.observacion && <span className="block opacity-90">{nc.observacion}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Aviso>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card titulo="Ficha del equipo" className="lg:col-span-2">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
            <Dato termino="Identificación interna" valor={equipo.id} mono />
            <Dato termino="Denominación" valor={equipo.nombre} />
            <Dato termino="Marca / modelo" valor={`${equipo.marca} ${equipo.modelo}`} />
            <Dato termino="N.º de serie" valor={equipo.serie} mono />
            {equipo.patente && <Dato termino="Dominio" valor={equipo.patente} mono />}
            <Dato termino="Ubicación" valor={equipo.ubicacion} />
            <Dato
              termino="Tipo de checklist"
              valor={
                equipo.tipo === 'vehiculo'
                  ? `Vehículo / plataforma${equipo.tieneHidrogrua ? ' (incluye hidrogrúa)' : ''}`
                  : 'Máquina / herramienta'
              }
            />
            <Dato termino="Periodicidad" valor={`Cada ${equipo.frecuenciaDias} días`} />
            <Dato
              termino="Última inspección"
              valor={ultima ? `${fmtCorta(ultima.fecha)} (${fmtRelativa(ultima.fecha)})` : 'Sin registros'}
            />
            <Dato
              termino="Próxima inspección"
              valor={proxima ? `${fmtCorta(proxima)} (${fmtRelativa(proxima)})` : '—'}
            />
          </dl>
        </Card>

        <Card titulo="Código QR del equipo">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <QRCodeSVG value={urlInspeccion(equipo.id)} size={150} level="M" />
            </div>
            <p className="font-mono text-sm font-semibold text-slate-900 mt-3">{equipo.id}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Escaneándolo con la cámara del celular se abre directamente el checklist de este equipo.
            </p>
            <Link to="/equipos/qr" className="btn-secondary mt-3 w-full">
              Ver hoja imprimible
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-5" titulo={`Historial de inspecciones (${historial.length})`}>
        {historial.length === 0 ? (
          <Vacio
            titulo="Sin inspecciones registradas"
            descripcion="Este equipo todavía no tiene ninguna inspección cargada en el sistema."
            accion={
              <Link to={`/inspeccion/${equipo.id}`} className="btn-primary">
                Registrar la primera
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {historial.map((ins) => (
              <DetalleInspeccion
                key={ins.id}
                inspeccion={ins}
                equipo={equipo}
                empleado={empleados.find((e) => e.id === ins.empleadoId)}
              />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

function Dato({ termino, valor, mono }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{termino}</dt>
      <dd className={`text-slate-800 mt-0.5 ${mono ? 'font-mono text-sm' : ''}`}>{valor}</dd>
    </div>
  )
}
