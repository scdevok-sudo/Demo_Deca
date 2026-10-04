import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../store/AppStore'
import { EMPRESA } from '../config/empresa'
import LogoEmpresa from '../components/LogoEmpresa'
import PaginaPublica from '../components/PaginaPublica'
import { Card, IcoImprimir, IcoVolver, Vacio } from '../components/ui'
import { vencimientoCapacitacion } from '../lib/calculos'
import { fmtCorta, fmtLarga } from '../lib/fechas'

// Ruta pública (módulo 7): no requiere login — es la que abre el QR de
// verificación de cada certificado y la que linkea la consulta por DNI.

export default function Certificado() {
  const { asignacionId } = useParams()
  const navigate = useNavigate()
  const { asignaciones, cursos, empleados } = useApp()

  const asignacion = asignaciones.find((a) => a.id === asignacionId)
  const curso = cursos.find((c) => c.id === asignacion?.cursoId)
  const empleado = empleados.find((e) => e.id === asignacion?.empleadoId)

  if (!asignacion || !curso || !empleado || !asignacion.aprobado) {
    return (
      <PaginaPublica>
        <Card>
          <Vacio
            titulo="Certificado no disponible"
            descripcion="El enlace no corresponde a una capacitación aprobada, o no existe en esta demo."
            accion={
              <Link to="/certificados" className="btn-secondary">
                Consultar por DNI
              </Link>
            }
          />
        </Card>
      </PaginaPublica>
    )
  }

  const vence = vencimientoCapacitacion(asignacion, curso)
  const codigo = asignacion.certificadoId ?? `CERT-${asignacion.id}`
  const verificacion =
    typeof window !== 'undefined' ? `${window.location.origin}/certificado/${asignacion.id}` : codigo

  return (
    <PaginaPublica>
      <div className="no-print flex items-center justify-between gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-sm">
          <IcoVolver size={16} />
          Volver
        </button>
        <button onClick={() => window.print()} className="btn-primary">
          <IcoImprimir size={16} />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* ---------------------------------------------------- Certificado -- */}
      <div className="print-area card overflow-hidden">
        <div className="border-[6px] border-double border-brand-800 m-3 sm:m-5 p-5 sm:p-10">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-center gap-3.5">
              <LogoEmpresa size={44} />
              <div className="border-l border-slate-200 pl-3.5">
                <p className="text-xs text-slate-500">CUIT {EMPRESA.cuit}</p>
                <p className="text-xs text-slate-500">{EMPRESA.domicilio}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Certificado N.º
              </p>
              <p className="font-mono text-xs text-slate-700 mt-0.5">{codigo}</p>
            </div>
          </div>

          {/* Cuerpo */}
          <div className="text-center py-8 sm:py-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand-700 font-semibold">
              Certificado de capacitación
            </p>
            <p className="text-sm text-slate-500 mt-6">Se certifica que</p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1.5 tracking-tight">
              {empleado.nombre}
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              DNI {empleado.dni} · Legajo {empleado.legajo} · {empleado.puesto}
            </p>

            <p className="text-sm text-slate-500 mt-7">
              ha completado y aprobado satisfactoriamente la capacitación
            </p>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mt-1.5">{curso.nombre}</h2>
            <p className="text-sm text-slate-500 mt-1.5">
              con una carga horaria de {curso.duracionMin} minutos y una calificación de{' '}
              <span className="font-semibold text-slate-800">{asignacion.puntaje}%</span>
            </p>

            <p className="text-sm text-slate-600 mt-7">
              Emitido el {fmtLarga(asignacion.fechaCompletado)}
            </p>
          </div>

          {/* Pie */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-end pt-6 border-t border-slate-200">
            <div className="text-center order-2 sm:order-1">
              <div className="border-t border-slate-400 pt-2 mx-4">
                <p className="text-xs font-semibold text-slate-800">
                  {EMPRESA.responsableSyH.nombre}
                </p>
                <p className="text-[10px] text-slate-500">{EMPRESA.responsableSyH.cargo}</p>
                <p className="text-[10px] text-slate-500">{EMPRESA.responsableSyH.matricula}</p>
              </div>
            </div>

            <div className="text-center order-1 sm:order-2">
              <div className="inline-block rounded border border-slate-200 p-1.5 bg-white">
                <QRCodeSVG value={verificacion} size={78} level="M" />
              </div>
              <p className="text-[9px] text-slate-400 mt-1.5 uppercase tracking-wide">
                Verificación
              </p>
            </div>

            <div className="text-center order-3 text-xs">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Válido hasta
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{fmtCorta(vence)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Vigencia {curso.vigenciaMeses} meses
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="no-print text-xs text-slate-400 text-center mt-4">
        Vista imprimible: desde el diálogo de impresión se puede guardar como PDF.
      </p>
    </PaginaPublica>
  )
}
