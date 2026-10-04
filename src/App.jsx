import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './store/AppStore'
import Layout from './components/Layout'

import SeleccionRol from './pages/SeleccionRol'
import Dashboard from './pages/Dashboard'
import Personal from './pages/Personal'
import PersonalDetalle from './pages/PersonalDetalle'
import Puestos from './pages/Puestos'
import CatalogoCapacitaciones from './pages/CatalogoCapacitaciones'
import PlanAnual from './pages/PlanAnual'
import Vencimientos from './pages/Vencimientos'
import ReporteMensual from './pages/ReporteMensual'
import Equipos from './pages/Equipos'
import EquipoDetalle from './pages/EquipoDetalle'
import EquiposQR from './pages/EquiposQR'
import Capacitaciones from './pages/Capacitaciones'
import CursoNuevo from './pages/CursoNuevo'
import CursoDetalle from './pages/CursoDetalle'
import MisCursos from './pages/MisCursos'
import TomarCurso from './pages/TomarCurso'
import Certificado from './pages/Certificado'
import MisCertificados from './pages/MisCertificados'
import ConsultaCertificados from './pages/ConsultaCertificados'
import InspeccionSelector from './pages/InspeccionSelector'
import InspeccionForm from './pages/InspeccionForm'
import Historial from './pages/Historial'
import Ops from './pages/Ops'
import OpsNueva from './pages/OpsNueva'
import Comunicaciones from './pages/Comunicaciones'

/** Pantalla de inicio según el rol elegido. */
const INICIO = {
  gerente: '/dashboard',
  capacitador: '/capacitaciones',
  operario: '/mis-cursos',
}

/**
 * Sin rol elegido se vuelve al selector, conservando el destino para volver
 * ahí después (importante cuando se entra escaneando el QR de un equipo).
 */
function Protegido({ children }) {
  const { sesion } = useApp()
  const location = useLocation()
  if (!sesion.rol) return <Navigate to="/" replace state={{ desde: location.pathname }} />
  return children
}

/**
 * El historial de inspecciones salió del panel del capacitador, así que
 * tampoco se llega escribiendo la URL a mano.
 */
function SoloConHistorial({ children }) {
  const { sesion } = useApp()
  if (sesion.rol === 'capacitador') return <Navigate to="/capacitaciones" replace />
  return children
}

/**
 * Personal (módulo 2) es solo para Gerente y Capacitador — el Operario no
 * administra ni consulta el listado completo de personal.
 */
function SoloStaff({ children }) {
  const { sesion } = useApp()
  if (sesion.rol === 'operario') return <Navigate to="/mis-cursos" replace />
  return children
}

export default function App() {
  const { sesion } = useApp()

  return (
    <Routes>
      <Route
        path="/"
        element={sesion.rol ? <Navigate to={INICIO[sesion.rol] ?? '/dashboard'} replace /> : <SeleccionRol />}
      />

      {/* Módulo 7: consulta pública de certificados, sin login — fuera del
          Protegido a propósito (incluye el link que abre el QR de cada
          certificado). */}
      <Route path="/certificados" element={<ConsultaCertificados />} />
      <Route path="/certificado/:asignacionId" element={<Certificado />} />

      <Route
        element={
          <Protegido>
            <Layout />
          </Protegido>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/personal"
          element={
            <SoloStaff>
              <Personal />
            </SoloStaff>
          }
        />
        <Route
          path="/personal/nuevo"
          element={
            <SoloStaff>
              <PersonalDetalle />
            </SoloStaff>
          }
        />
        <Route
          path="/personal/:id"
          element={
            <SoloStaff>
              <PersonalDetalle />
            </SoloStaff>
          }
        />
        <Route
          path="/puestos"
          element={
            <SoloStaff>
              <Puestos />
            </SoloStaff>
          }
        />
        <Route
          path="/catalogo"
          element={
            <SoloStaff>
              <CatalogoCapacitaciones />
            </SoloStaff>
          }
        />
        <Route
          path="/plan-anual"
          element={
            <SoloStaff>
              <PlanAnual />
            </SoloStaff>
          }
        />
        <Route
          path="/vencimientos"
          element={
            <SoloStaff>
              <Vencimientos />
            </SoloStaff>
          }
        />
        <Route
          path="/reporte-mensual"
          element={
            <SoloStaff>
              <ReporteMensual />
            </SoloStaff>
          }
        />

        <Route path="/equipos" element={<Equipos />} />
        <Route path="/equipos/qr" element={<EquiposQR />} />
        <Route path="/equipos/:equipoId" element={<EquipoDetalle />} />

        <Route path="/capacitaciones" element={<Capacitaciones />} />
        <Route path="/capacitaciones/nuevo" element={<CursoNuevo />} />
        <Route path="/capacitaciones/:cursoId" element={<CursoDetalle />} />

        <Route path="/mis-cursos" element={<MisCursos />} />
        <Route path="/mis-certificados" element={<MisCertificados />} />
        <Route path="/curso/:asignacionId" element={<TomarCurso />} />

        <Route path="/inspeccion" element={<InspeccionSelector />} />
        <Route path="/inspeccion/:equipoId" element={<InspeccionForm />} />

        <Route path="/ops" element={<Ops />} />
        <Route path="/ops/nueva" element={<OpsNueva />} />

        <Route path="/comunicaciones" element={<Comunicaciones />} />

        <Route
          path="/historial"
          element={
            <SoloConHistorial>
              <Historial />
            </SoloConHistorial>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
