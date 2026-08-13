import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { FranjaDemo } from "@/components/layout/FranjaDemo";
import { ConmutadorPerspectiva } from "@/components/layout/ConmutadorPerspectiva";
import { BotonReiniciarDemo } from "@/components/layout/BotonReiniciarDemo";
import { IdentidadActivaHeader } from "@/components/layout/IdentidadActivaHeader";
import { TransicionPagina } from "@/components/layout/TransicionPagina";
import { BotonTutorial } from "@/components/tutorial/BotonTutorial";

import Portada from "@/pages/Portada";
import FlujoCompleto from "@/pages/FlujoCompleto";
import NotFound from "@/pages/NotFound";

import MiPostulacion from "@/pages/postulante/MiPostulacion";
import SeleccionVia from "@/pages/postulante/SeleccionVia";
import CargaDocumentos from "@/pages/postulante/CargaDocumentos";
import Seguimiento from "@/pages/postulante/Seguimiento";
import Resultado from "@/pages/postulante/Resultado";

import Portal from "@/pages/estudiante/Portal";
import SolicitudesAcademicas from "@/pages/estudiante/SolicitudesAcademicas";
import DocumentoPendiente from "@/pages/estudiante/DocumentoPendiente";

import BandejaCasos from "@/pages/backoffice/BandejaCasos";
import DetalleCaso from "@/pages/backoffice/DetalleCaso";
import Indicadores from "@/pages/backoffice/Indicadores";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <FranjaDemo />
        <header className="border-b bg-background sticky top-0 z-40">
          <div className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-foreground">
                IACC · Sistema de Automatización de Vías de Ingreso
              </span>
              <IdentidadActivaHeader />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2" data-tour="header-controles">
              <ConmutadorPerspectiva />
              <BotonTutorial />
              <BotonReiniciarDemo />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-6">
          <TransicionPagina>
            <Routes>
              <Route path="/" element={<Portada />} />
              <Route path="/flujo-completo" element={<FlujoCompleto />} />

              <Route path="/postulante" element={<MiPostulacion />} />
              <Route path="/postulante/via" element={<SeleccionVia />} />
              <Route path="/postulante/documentos" element={<CargaDocumentos />} />
              <Route path="/postulante/seguimiento" element={<Seguimiento />} />
              <Route path="/postulante/resultado" element={<Resultado />} />

              <Route path="/estudiante" element={<Portal />} />
              <Route path="/estudiante/solicitudes" element={<SolicitudesAcademicas />} />
              <Route path="/estudiante/documento-pendiente" element={<DocumentoPendiente />} />

              <Route path="/backoffice" element={<BandejaCasos />} />
              <Route path="/backoffice/casos" element={<BandejaCasos />} />
              <Route path="/backoffice/casos/:casoId" element={<DetalleCaso />} />
              <Route path="/backoffice/indicadores" element={<Indicadores />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </TransicionPagina>
        </main>

        <footer className="border-t py-4">
          <div className="container text-xs text-muted-foreground text-center">
            Demo interna IACC — Sistema de Automatización de Vías de Ingreso. Datos ficticios.
          </div>
        </footer>
      </div>
      <Toaster />
    </HashRouter>
  );
}

export default App;
