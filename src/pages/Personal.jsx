import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppStore'
import { Aviso, Card, Chip, Encabezado, IcoMas, TablaScroll } from '../components/ui'
import { fmtCorta } from '../lib/fechas'

const POR_PAGINA = 25

/** Parser de CSV chico y sin dependencias: alcanza para el formato que pide
 * la especificación (DNI, nombre, puesto, legajo, ingreso, obra), con comas
 * simples o campos entre comillas. No pretende ser RFC 4180 completo. */
function parsearCSV(texto) {
  const lineas = texto
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  if (lineas.length === 0) return []

  function partirLinea(linea) {
    const campos = []
    let actual = ''
    let entreComillas = false
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i]
      if (c === '"') entreComillas = !entreComillas
      else if (c === ',' && !entreComillas) {
        campos.push(actual)
        actual = ''
      } else actual += c
    }
    campos.push(actual)
    return campos.map((c) => c.trim())
  }

  const encabezado = partirLinea(lineas[0]).map((h) => h.toLowerCase())
  const idx = {
    dni: encabezado.indexOf('dni'),
    nombre: encabezado.findIndex((h) => h === 'nombre' || h === 'nombre y apellido'),
    puesto: encabezado.indexOf('puesto'),
    legajo: encabezado.indexOf('legajo'),
    ingreso: encabezado.findIndex((h) => h === 'ingreso' || h === 'fecha de ingreso'),
    obra: encabezado.indexOf('obra'),
  }

  return lineas.slice(1).map((linea) => {
    const campos = partirLinea(linea)
    const val = (clave) => (idx[clave] >= 0 ? campos[idx[clave]] ?? '' : '')
    return {
      dni: val('dni'),
      nombre: val('nombre'),
      puesto: val('puesto'),
      legajo: val('legajo'),
      ingreso: val('ingreso'),
      obra: val('obra'),
    }
  })
}

export default function Personal() {
  const { empleados, sesion, importarEmpleados } = useApp()
  const puedeEditar = sesion.rol === 'gerente'

  const [busqueda, setBusqueda] = useState('')
  const [filtroPuesto, setFiltroPuesto] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('activos')
  const [orden, setOrden] = useState('nombre') // nombre | ingreso
  const [pagina, setPagina] = useState(1)

  const [mostrarImport, setMostrarImport] = useState(false)
  const [archivoCSV, setArchivoCSV] = useState(null)
  const [resumenImport, setResumenImport] = useState(null)

  const puestos = useMemo(
    () => [...new Set(empleados.map((e) => e.puesto).filter(Boolean))].sort(),
    [empleados]
  )

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    let lista = empleados.filter((e) => {
      if (filtroEstado === 'activos' && e.activo === false) return false
      if (filtroEstado === 'inactivos' && e.activo !== false) return false
      if (filtroPuesto !== 'todos' && e.puesto !== filtroPuesto) return false
      if (!q) return true
      return (
        e.nombre.toLowerCase().includes(q) ||
        (e.dni || '').toLowerCase().includes(q) ||
        (e.puesto || '').toLowerCase().includes(q) ||
        (e.legajo || '').toLowerCase().includes(q)
      )
    })
    lista = [...lista].sort((a, b) =>
      orden === 'ingreso' ? String(b.ingreso).localeCompare(String(a.ingreso)) : a.nombre.localeCompare(b.nombre)
    )
    return lista
  }, [empleados, busqueda, filtroPuesto, filtroEstado, orden])

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaSegura - 1) * POR_PAGINA, paginaSegura * POR_PAGINA)

  function procesarImport() {
    if (!archivoCSV) return
    const reader = new FileReader()
    reader.onload = () => {
      const filas = parsearCSV(String(reader.result || ''))
      const resumen = importarEmpleados(filas)
      setResumenImport(resumen)
    }
    reader.readAsText(archivoCSV)
  }

  return (
    <>
      <Encabezado
        titulo="Personal"
        descripcion={
          puedeEditar
            ? 'Altas, bajas y datos del personal de Deca. La base de la que depende todo lo demás.'
            : 'Consulta del personal de Deca, para saber a quién corresponde cada capacitación.'
        }
        acciones={
          puedeEditar && (
            <>
              <button onClick={() => setMostrarImport((v) => !v)} className="btn-secondary">
                Importar CSV
              </button>
              <Link to="/personal/nuevo" className="btn-primary">
                <IcoMas size={16} />
                Nueva persona
              </Link>
            </>
          )
        }
      />

      {puedeEditar && mostrarImport && (
        <Card titulo="Importación masiva por CSV" className="mb-4">
          <p className="text-xs text-slate-500 mb-3">
            Columnas esperadas: <code className="text-[11px]">dni, nombre, puesto, legajo, ingreso, obra</code>{' '}
            (legajo, ingreso y obra son opcionales). La primera fila tiene que ser el encabezado.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                setArchivoCSV(e.target.files?.[0] ?? null)
                setResumenImport(null)
              }}
              className="input sm:flex-1"
            />
            <button onClick={procesarImport} disabled={!archivoCSV} className="btn-primary">
              Procesar archivo
            </button>
          </div>

          {resumenImport && (
            <div className="mt-3">
              <Aviso tono={resumenImport.rechazados.length ? 'ambar' : 'verde'} titulo="Resultado de la importación">
                {resumenImport.procesados} fila(s) procesadas · {resumenImport.importados} importada(s) ·{' '}
                {resumenImport.rechazados.length} rechazada(s)
                {resumenImport.rechazados.length > 0 && (
                  <ul className="list-disc pl-4 mt-1.5 space-y-0.5">
                    {resumenImport.rechazados.map((r, i) => (
                      <li key={i}>
                        Fila {r.fila}: {r.motivo}
                      </li>
                    ))}
                  </ul>
                )}
              </Aviso>
            </div>
          )}
        </Card>
      )}

      {/* ----------------------------------------------------- Filtros -- */}
      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
          <input
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value)
              setPagina(1)
            }}
            placeholder="Buscar por DNI, nombre, puesto o legajo…"
            className="input sm:col-span-2"
          />
          <select
            value={filtroPuesto}
            onChange={(e) => {
              setFiltroPuesto(e.target.value)
              setPagina(1)
            }}
            className="input"
          >
            <option value="todos">Todos los puestos</option>
            {puestos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value)
              setPagina(1)
            }}
            className="input"
          >
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
            <option value="todos">Todos los estados</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-xs text-slate-500">Ordenar por:</span>
          {[
            { clave: 'nombre', texto: 'Nombre (A-Z)' },
            { clave: 'ingreso', texto: 'Fecha de ingreso' },
          ].map((o) => (
            <button
              key={o.clave}
              onClick={() => setOrden(o.clave)}
              className={`chip-filtro rounded-md px-2.5 py-1 text-xs font-semibold border ${
                orden === o.clave
                  ? 'bg-brand-800 text-white border-brand-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {o.texto}
            </button>
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------- Tabla -- */}
      <Card bodyClass="p-0">
        <TablaScroll>
          <thead>
            <tr>
              <th className="th">Nombre</th>
              <th className="th">DNI</th>
              <th className="th">Puesto</th>
              <th className="th">Legajo</th>
              <th className="th">Ingreso</th>
              <th className="th">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibles.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="td font-medium text-slate-900">
                  <Link to={`/personal/${e.id}`} className="hover:underline hover:text-brand-700">
                    {e.nombre}
                  </Link>
                </td>
                <td className="td tabular-nums">{e.dni}</td>
                <td className="td">{e.puesto}</td>
                <td className="td tabular-nums">{e.legajo || '—'}</td>
                <td className="td tabular-nums">{fmtCorta(e.ingreso)}</td>
                <td className="td">
                  <Chip tono={e.activo === false ? 'rojo' : 'verde'}>
                    {e.activo === false ? 'Inactivo' : 'Activo'}
                  </Chip>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td className="td text-center text-slate-400 py-8" colSpan={6}>
                  No hay personal que coincida con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </TablaScroll>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
            <span className="text-slate-500">
              Página {paginaSegura} de {totalPaginas} · {filtrados.length} persona(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={paginaSegura <= 1}
                className="btn-secondary"
              >
                Anterior
              </button>
              <button
                onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                disabled={paginaSegura >= totalPaginas}
                className="btn-secondary"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
