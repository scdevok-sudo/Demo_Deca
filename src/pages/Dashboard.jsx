import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import {
  Avatar,
  Barra,
  Card,
  Chip,
  ChipEstado,
  Encabezado,
  IcoAlerta,
  IcoCert,
  IcoOk,
  IcoReloj,
  KPI,
  TablaScroll,
} from '../components/ui'
import { fmtCorta, fmtRelativa, nombreMes } from '../lib/fechas'
import { TONOS } from '../lib/calculos'

export default function Dashboard() {
  const { kpis, empleados } = useApp()
  const {
    porEmpleado,
    porEquipo,
    pctAlDia,
    alDia,
    totalEmpleados,
    inspeccionesVencidas,
    noConformes,
    porVencerEquipos,
    proximoVencimiento,
    certificadosMes,
    coberturaCursos,
  } = kpis

  const tonoCumplimiento = pctAlDia >= 80 ? 'verde' : pctAlDia >= 50 ? 'ambar' : 'rojo'

  return (
    <>
      <Encabezado
        titulo="Dashboard de cumplimiento"
        descripcion="Estado consolidado de capacitaciones e inspecciones de equipos."
      />

      {/* --------------------------------------------------------- KPIs -- */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-5">
        <KPI
          etiqueta="Capacitaciones al día"
          valor={pctAlDia}
          unidad="%"
          detalle={`${alDia} de ${totalEmpleados} empleados sin pendientes ni vencidos`}
          tono={tonoCumplimiento}
          icono={<IcoOk size={18} />}
        />
        <KPI
          etiqueta="Inspecciones vencidas"
          valor={inspeccionesVencidas.length}
          detalle={
            inspeccionesVencidas.length
              ? inspeccionesVencidas.map((p) => p.equipo.id).join(', ')
              : 'Todos los equipos dentro de plazo'
          }
          tono={inspeccionesVencidas.length ? 'rojo' : 'verde'}
          icono={<IcoAlerta size={18} />}
        />
        <KPI
          etiqueta="Próximo vencimiento"
          valor={proximoVencimiento ? fmtCorta(proximoVencimiento.fecha) : '—'}
          detalle={
            proximoVencimiento
              ? `${proximoVencimiento.tipo}: ${proximoVencimiento.titulo} · ${fmtRelativa(
                  proximoVencimiento.fecha
                )}`
              : 'Sin vencimientos futuros'
          }
          tono="ambar"
          icono={<IcoReloj size={18} />}
        />
        <KPI
          etiqueta={`Certificados de ${nombreMes()}`}
          valor={certificadosMes}
          detalle="Emitidos en el mes en curso"
          tono="verde"
          icono={<IcoCert size={18} />}
        />
      </div>

      {/* ------------------------------------------- Alerta no conformes -- */}
      {noConformes.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600">
              <IcoAlerta size={16} />
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Equipos no conformes · fuera de servicio
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {noConformes.map(({ equipo, ultima, noConformidades }) => (
              <Link
                key={equipo.id}
                to={`/equipos/${equipo.id}`}
                className="block rounded-lg border-2 border-red-300 bg-red-50 p-4 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-red-700">{equipo.id}</p>
                    <p className="font-semibold text-slate-900 leading-tight mt-0.5">{equipo.nombre}</p>
                    <p className="text-xs text-slate-600">
                      {equipo.marca} {equipo.modelo}
                    </p>
                  </div>
                  <Chip tono="rojo">No conforme</Chip>
                </div>
                <ul className="mt-3 space-y-1 border-t border-red-200 pt-2.5">
                  {noConformidades.slice(0, 3).map((nc) => (
                    <li key={nc.itemId} className="text-xs text-red-800 flex gap-1.5">
                      <span className="font-mono shrink-0 opacity-70">{nc.itemId}</span>
                      <span className="line-clamp-2">{nc.observacion || nc.nombre}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-red-600/80 mt-2.5">
                  Detectado el {fmtCorta(ultima.fecha)} · {noConformidades.length} ítem
                  {noConformidades.length > 1 ? 's' : ''} no satisfactorio
                  {noConformidades.length > 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ------------------------------------------------- Empleados --- */}
        <Card
          className="lg:col-span-2"
          titulo="Estado de capacitación del personal"
          bodyClass=""
          accion={
            <span className="text-xs text-slate-500">
              {alDia}/{totalEmpleados} al día
            </span>
          }
        >
          <TablaScroll>
            <thead className="bg-slate-50">
              <tr>
                <th className="th">Empleado</th>
                <th className="th">Puesto</th>
                <th className="th text-center">Cursos vigentes</th>
                <th className="th">Próx. vencimiento</th>
                <th className="th">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {porEmpleado.map((p) => (
                <tr key={p.empleado.id} className="hover:bg-slate-50/70">
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <Avatar nombre={p.empleado.nombre} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900 whitespace-nowrap">
                          {p.empleado.nombre}
                        </p>
                        <p className="text-xs text-slate-500">Legajo {p.empleado.legajo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td whitespace-nowrap text-slate-600">{p.empleado.puesto}</td>
                  <td className="td text-center tabular-nums">
                    <span className="font-medium text-slate-900">{p.aprobadosVigentes}</span>
                    <span className="text-slate-400">/{p.total}</span>
                  </td>
                  <td className="td whitespace-nowrap text-slate-600">
                    {p.proximoVencimiento ? (
                      <>
                        {fmtCorta(p.proximoVencimiento)}
                        <span className="text-xs text-slate-400 ml-1.5">
                          {fmtRelativa(p.proximoVencimiento)}
                        </span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="td">
                    <div className="flex flex-col items-start gap-1">
                      <ChipEstado estado={p.estado} />
                      {p.vencidos > 0 && (
                        <span className="text-[11px] text-red-600">{p.vencidos} vencido(s)</span>
                      )}
                      {p.vencidos === 0 && p.pendientes > 0 && (
                        <span className="text-[11px] text-amber-700">{p.pendientes} sin rendir</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TablaScroll>
        </Card>

        {/* ----------------------------------------- Cobertura por curso -- */}
        <Card titulo="Cobertura por curso">
          <ul className="space-y-4">
            {coberturaCursos.map((c) => (
              <li key={c.curso.id}>
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium text-slate-800 leading-tight">{c.curso.nombre}</p>
                  <p className="text-xs tabular-nums text-slate-500 shrink-0">
                    {c.vigentes}/{c.asignados}
                  </p>
                </div>
                <Barra pct={c.pct} tono={c.pct >= 80 ? 'verde' : c.pct >= 50 ? 'ambar' : 'rojo'} />
                <p className="text-[11px] text-slate-400 mt-1">
                  Vigencia {c.curso.vigenciaMeses} meses · {c.pct}% vigente
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ---------------------------------------------------- Equipos ---- */}
      <Card
        className="mt-5"
        titulo="Estado de equipos"
        bodyClass=""
        accion={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${TONOS.rojo.punto}`} />
              {noConformes.length + inspeccionesVencidas.length} críticos
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${TONOS.ambar.punto}`} />
              {porVencerEquipos.length} por vencer
            </span>
            <Link to="/equipos" className="btn-texto text-brand-700 font-medium hover:underline">
              Ver todos
            </Link>
          </div>
        }
      >
        <TablaScroll>
          <thead className="bg-slate-50">
            <tr>
              <th className="th">Equipo</th>
              <th className="th">Ubicación</th>
              <th className="th">Última inspección</th>
              <th className="th">Próxima inspección</th>
              <th className="th">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {porEquipo.map((p) => (
              <tr
                key={p.equipo.id}
                className={p.estado.clave === 'no_conforme' ? 'bg-red-50/60' : 'hover:bg-slate-50/70'}
              >
                <td className="td">
                  <Link to={`/equipos/${p.equipo.id}`} className="group">
                    <p className="font-mono text-xs font-semibold text-brand-700 group-hover:underline">
                      {p.equipo.id}
                    </p>
                    <p className="font-medium text-slate-900 whitespace-nowrap">{p.equipo.nombre}</p>
                    <p className="text-xs text-slate-500">
                      {p.equipo.marca} {p.equipo.modelo}
                    </p>
                  </Link>
                </td>
                <td className="td whitespace-nowrap text-slate-600">{p.equipo.ubicacion}</td>
                <td className="td whitespace-nowrap">
                  {p.ultima ? (
                    <>
                      {fmtCorta(p.ultima.fecha)}
                      <span className="text-xs text-slate-400 ml-1.5">
                        {fmtRelativa(p.ultima.fecha)}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-600 font-medium">Nunca</span>
                  )}
                </td>
                <td className="td whitespace-nowrap">
                  {p.proxima ? (
                    <>
                      {fmtCorta(p.proxima)}
                      <span
                        className={`text-xs ml-1.5 ${
                          p.diasParaProxima < 0 ? 'text-red-600 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {fmtRelativa(p.proxima)}
                      </span>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="td">
                  <ChipEstado estado={p.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </TablaScroll>
      </Card>

      <p className="text-xs text-slate-400 mt-4">
        Los indicadores se calculan sobre {empleados.length} empleados y {porEquipo.length} equipos
        registrados. Un equipo con algún ítem no satisfactorio queda marcado como no conforme hasta
        que una inspección posterior salga conforme.
      </p>
    </>
  )
}
