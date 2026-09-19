import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../store/AppStore'
import { EMPRESA } from '../config/empresa'
import LogoEmpresa from '../components/LogoEmpresa'
import { Encabezado, IcoImprimir } from '../components/ui'
import { urlInspeccion } from '../lib/qr'
import { fmtCorta, hoyISO } from '../lib/fechas'

export default function EquiposQR() {
  const { equipos } = useApp()

  return (
    <>
      <div className="no-print">
        <Encabezado
          titulo="Etiquetas QR de equipos"
          descripcion="Imprimir, plastificar y pegar en cada equipo. El operario escanea con la cámara del celular y entra directo al checklist."
          acciones={
            <button onClick={() => window.print()} className="btn-primary">
              <IcoImprimir size={16} />
              Imprimir hoja
            </button>
          }
        />
      </div>

      <div className="print-area card p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3.5">
            <LogoEmpresa size={36} />
            <div className="border-l border-slate-200 pl-3.5">
              <p className="text-xs text-slate-500">Identificación de equipos — Higiene y Seguridad</p>
              <p className="text-xs text-slate-400">CUIT {EMPRESA.cuit}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-right">
            Emitido el {fmtCorta(hoyISO())}
            <br />
            {equipos.length} etiquetas
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {equipos.map((eq) => (
            <div
              key={eq.id}
              className="border-2 border-slate-300 rounded-lg p-3 flex flex-col items-center text-center break-inside-avoid"
            >
              <p className="font-mono text-base font-bold text-slate-900 tracking-tight">{eq.id}</p>
              <p className="text-[11px] font-semibold text-slate-700 leading-tight mt-0.5 h-8 flex items-center">
                {eq.nombre}
              </p>
              <div className="my-1.5">
                <QRCodeSVG value={urlInspeccion(eq.id)} size={104} level="M" />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {eq.marca} {eq.modelo}
              </p>
              <p className="text-[9px] text-slate-400 mt-1.5 uppercase tracking-wide font-semibold">
                Escanear antes de usar
              </p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-200">
          Uso obligatorio: toda inspección debe registrarse antes de poner el equipo en servicio.
          Ante un ítem no satisfactorio el equipo queda fuera de servicio hasta su regularización.
        </p>
      </div>
    </>
  )
}
