import { Link } from 'react-router-dom'
import { EMPRESA, PRODUCTO } from '../config/empresa'
import LogoEmpresa from './LogoEmpresa'
import PieMarca from './PieMarca'

/**
 * Envoltorio liviano para las pantallas públicas que no requieren login
 * (módulo 7: consulta de certificados por DNI y la vista de un certificado
 * puntual, pensada para abrirse también desde el QR de verificación). Sin
 * nav de rol — solo la marca y el contenido.
 */
export default function PaginaPublica({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="no-print bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <LogoEmpresa size={26} />
            <div className="leading-tight border-l border-slate-200 pl-3">
              <p className="text-sm font-semibold text-slate-900">{PRODUCTO.nombre}</p>
              <p className="text-[11px] text-slate-400">{EMPRESA.nombreCorto} · acceso público</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-6">{children}</main>

      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-5">
          <PieMarca compacto />
        </div>
      </footer>
    </div>
  )
}
