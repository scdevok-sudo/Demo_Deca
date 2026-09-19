import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../store/AppStore'
import { Card, ChipEstado, Encabezado, IcoQR, TablaScroll } from '../components/ui'
import { CATEGORIAS, agruparPorCategoria, categoriaDe } from '../data/categorias'
import { tipoChecklist } from '../data/checklists'
import { fmtCorta, fmtRelativa } from '../lib/fechas'
import { urlInspeccion } from '../lib/qr'

// El primer filtro es transversal (equipos críticos); los demás son las tres
// categorías que pidió el cliente.
const FILTROS = [
  { clave: 'todos', texto: 'Todas' },
  { clave: 'criticos', texto: 'Críticos' },
  ...CATEGORIAS.map((c) => ({ clave: c.clave, texto: c.corto })),
]

export default function Equipos() {
  const { kpis } = useApp()
  const [filtro, setFiltro] = useState('todos')

  const lista = kpis.porEquipo.filter((p) => {
    if (filtro === 'todos') return true
    if (filtro === 'criticos') return p.estado.tono === 'rojo'
    return categoriaDe(p.equipo).clave === filtro
  })

  // Con "Críticos" se muestra una sola lista; en el resto se agrupa por
  // categoría para que se vea la organización nueva.
  const grupos =
    filtro === 'criticos'
      ? [
          {
            categoria: { clave: 'criticos', nombre: 'Equipos críticos', descripcion: '' },
            items: lista,
          },
        ]
      : agruparPorCategoria(lista).filter((g) => g.items.length > 0)

  return (
    <>
      <Encabezado
        titulo="Equipos"
        descripcion="Organizados en tres categorías. Cada equipo tiene su QR pegado en obra: al escanearlo se abre el checklist correspondiente."
        acciones={
          <Link to="/equipos/qr" className="btn-secondary">
            <IcoQR size={16} />
            Hoja de QR para imprimir
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTROS.map((f) => (
          <button
            key={f.clave}
            onClick={() => setFiltro(f.clave)}
            className={[
              'chip-filtro rounded-full px-3 py-1.5 text-xs font-medium border',
              filtro === f.clave
                ? 'bg-brand-800 text-white border-brand-800'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
            ].join(' ')}
          >
            {f.texto}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {grupos.map(({ categoria, items }) => (
          <section key={categoria.clave}>
            <div className="flex items-baseline justify-between gap-3 mb-2.5 border-b border-slate-200 pb-1.5">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900">{categoria.nombre}</h2>
                {categoria.descripcion && (
                  <p className="text-xs text-slate-500 mt-0.5">{categoria.descripcion}</p>
                )}
              </div>
              <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                {items.length} equipo{items.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map(({ equipo, estado, ultima, proxima, noConformidades }) => (
                <Link
                  key={equipo.id}
                  to={`/equipos/${equipo.id}`}
                  className={[
                    'card p-4 hover:shadow-md transition-shadow flex gap-4',
                    estado.clave === 'no_conforme' ? 'border-red-300 bg-red-50/50' : '',
                  ].join(' ')}
                >
                  <div className="shrink-0">
                    <div className="rounded border border-slate-200 bg-white p-1.5">
                      <QRCodeSVG value={urlInspeccion(equipo.id)} size={62} level="M" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-brand-700">{equipo.id}</p>
                        <p className="font-semibold text-slate-900 leading-tight truncate">
                          {equipo.nombre}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {equipo.marca} {equipo.modelo}
                          {equipo.patente ? ` · ${equipo.patente}` : ''}
                        </p>
                      </div>
                      <ChipEstado estado={estado} />
                    </div>
                    <dl className="mt-2.5 text-xs space-y-0.5">
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-400">Última</dt>
                        <dd className="text-slate-700">
                          {ultima ? fmtCorta(ultima.fecha) : 'Nunca'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-400">Próxima</dt>
                        <dd
                          className={
                            estado.tono === 'rojo' ? 'text-red-600 font-medium' : 'text-slate-700'
                          }
                        >
                          {proxima ? `${fmtCorta(proxima)} (${fmtRelativa(proxima)})` : '—'}
                        </dd>
                      </div>
                    </dl>
                    {noConformidades.length > 0 && (
                      <p className="mt-2 text-[11px] text-red-700 font-medium">
                        {noConformidades.length} ítem(s) que no cumplen
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {lista.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500 text-center py-6">
            No hay equipos que coincidan con el filtro seleccionado.
          </p>
        </Card>
      )}

      <Card className="mt-6" titulo="Resumen" bodyClass="">
        <TablaScroll>
          <thead className="bg-slate-50">
            <tr>
              <th className="th">ID</th>
              <th className="th">Equipo</th>
              <th className="th">Categoría</th>
              <th className="th">Tipo de checklist</th>
              <th className="th">Periodicidad</th>
              <th className="th">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {kpis.porEquipo.map(({ equipo, estado }) => (
              <tr key={equipo.id} className="hover:bg-slate-50/70">
                <td className="td font-mono text-xs font-semibold text-brand-700">{equipo.id}</td>
                <td className="td whitespace-nowrap">{equipo.nombre}</td>
                <td className="td text-slate-600 whitespace-nowrap">{categoriaDe(equipo).corto}</td>
                <td className="td text-slate-600 whitespace-nowrap">{tipoChecklist(equipo)}</td>
                <td className="td text-slate-600 whitespace-nowrap">
                  cada {equipo.frecuenciaDias} días
                </td>
                <td className="td">
                  <ChipEstado estado={estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </TablaScroll>
      </Card>
    </>
  )
}
