import { useEffect } from 'react'
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
 * ahí después (importante cuando se entra escaneando el QR de un equipo) —
 * EXCEPTO cuando el "sin sesión" es consecuencia de un cierre de sesión
 * deliberado (botón "Cambiar de rol" en el header). Ahí no hay que recordar
 * nada: si no, al loguearse de nuevo (con el rol que sea) se termina
 * volviendo a la página que había dejado la sesión anterior en vez de caer
 * en la pantalla por defecto del rol nuevo — y de paso, como esa página
 * puede no existir para el rol nuevo, podía rebotar de nuevo para acá.
 *
 * `logoutDeliberadoRef` es la marca que deja `cerrarSesion()`. Se lee acá
 * (durante el render, nunca se escribe en el render) y se apaga después, en
 * un efecto — así no importa si React vuelve a renderizar este componente
 * de más (p.ej. en desarrollo con StrictMode): leer un ref no tiene efectos
 * secundarios, solo escribirlo los tiene.
 *
 * A propósito es un ref y no un estado más de `sesion`: si limpiar la marca
 * fuera un `setSesion`, ese mismo cambio de estado dispararía otro render de
 * Protegido ANTES de que la navegación a "/" se concrete, y ese nuevo render
 * ya vería la marca apagada — reapareciendo el `desde` que se quería evitar.
 * Un ref no fuerza ningún render extra, así que no hay ese efecto rebote.
 */
function Protegido({ children }) {
  const { sesion, logoutDeliberadoRef } = useApp()
  const location = useLocation()
  const sinSesion = !sesion.rol
  // Lectura intencional del ref durante el render (ver el comentario de la
  // función): es la única forma de que no haya un render extra que vuelva a
  // prender el `desde` antes de navegar afuera.
  // oxlint-disable-next-line react/refs
  const esLogoutDeliberado = sinSesion && logoutDeliberadoRef.current

  useEffect(() => {
    if (sinSesion) logoutDeliberadoRef.current = false
  })

  if (sinSesion) {
    return <Navigate to="/" replace state={esLogoutDeliberado ? undefined : { desde: location.pathname }} />
  }
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
  const location = useLocation()

  // A dónde mandar a alguien que ya tiene sesión y está parado en "/": al
  // destino que estaba esperando (si llegó rebotado desde una ruta
  // protegida, p.ej. el QR de un equipo, o un link directo sin estar
  // logueado) o si no al destino por defecto de su rol.
  //
  // Esto se resuelve acá y no con un `navigate()` en SeleccionRol porque
  // `iniciarSesion()` actualiza el contexto y un `navigate()` inmediatamente
  // después pueden no quedar en el mismo render: si `Protegido` llega a
  // evaluarse todavía con el `sesion.rol` viejo en la ruta de destino,
  // rebota de nuevo para acá — y como para entonces `sesion.rol` ya está
  // puesto, esta misma ruta "/" redirige derecho al destino por defecto del
  // rol, pisando el destino pendiente sin que se note el error. Leyendo acá
  // `location.state.desde` en vez de navegar explícitamente, no hay
  // carrera: se resuelve en el mismo render en el que cambia `sesion.rol`.
  const destinoAlEntrar = sesion.rol ? (location.state?.desde ?? INICIO[sesion.rol] ?? '/dashboard') : null

  return (
    <Routes>
      <Route path="/" element={destinoAlEntrar ? <Navigate to={destinoAlEntrar} replace /> : <SeleccionRol />} />

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
