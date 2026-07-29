import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
import Layout from './components/Layout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Home from './modules/Home.jsx'
import Fundamentals from './modules/Fundamentals.jsx'
import Harmony from './modules/Harmony.jsx'
import ScalesSolos from './modules/ScalesSolos.jsx'
import Arpejos from './modules/Arpejos.jsx'
import MelodicMinor from './modules/MelodicMinor.jsx'
import Advanced from './modules/Advanced.jsx'
import HarmoniaFuncional from './modules/HarmoniaFuncional.jsx'
import EscalasAvancadas from './modules/EscalasAvancadas.jsx'
import CAGED from './modules/CAGED.jsx'
import Tecnicas from './modules/Tecnicas.jsx'
import Progresso from './modules/Progresso.jsx'
import EarLab from './modules/EarLab.jsx'
import FretboardPlayground from './modules/FretboardPlayground.jsx'
import JazzBlues from './modules/JazzBlues.jsx'
import Historia from './modules/Historia.jsx'
import MaquinaAcordes from './modules/MaquinaAcordes.jsx'
import Quiz from './modules/Quiz.jsx'
import Roadmap from './modules/Roadmap.jsx'
import Landing from './modules/Landing.jsx'
import CicloQuintas from './modules/CicloQuintas.jsx'
import FigurasRitmicas from './modules/FigurasRitmicas.jsx'
import LaboratorioGroove from './modules/LaboratorioGroove.jsx'
import PadroesPentatonica from './modules/PadroesPentatonica.jsx'
import Improviso from './modules/Improviso.jsx'
import Djavan from './modules/Djavan.jsx'
import ChicoBuarque from './modules/ChicoBuarque.jsx'
import Cartola from './modules/Cartola.jsx'
import Cazuza from './modules/Cazuza.jsx'
import Paralamas from './modules/Paralamas.jsx'
import RoupaNova from './modules/RoupaNova.jsx'
import StevieWonder from './modules/StevieWonder.jsx'
import MichaelJackson from './modules/MichaelJackson.jsx'
import VocabularioLicks from './modules/VocabularioLicks.jsx'
import ClichesBlues from './modules/ClichesBlues.jsx'
import Planos from './modules/Planos.jsx'

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* Todas as outras rotas — dentro do Layout com sidebar */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/inicio"              element={<Home />} />
                <Route path="/fundamentos"         element={<Fundamentals />} />
                <Route path="/ciclo-das-quintas"   element={<CicloQuintas />} />
                <Route path="/figuras-ritmicas"    element={<FigurasRitmicas />} />
                <Route path="/harmonia"            element={<Harmony />} />
                <Route path="/harmonia-funcional"  element={<HarmoniaFuncional />} />
                <Route path="/escalas-solos"       element={<ScalesSolos />} />
                <Route path="/arpejos"             element={<Arpejos />} />
                <Route path="/menor-melodica"      element={<MelodicMinor />} />
                <Route path="/escalas-avancadas"   element={<EscalasAvancadas />} />
                <Route path="/caged"               element={<CAGED />} />
                <Route path="/tecnicas"            element={<Tecnicas />} />
                <Route path="/avancado"            element={<Advanced />} />
                <Route path="/ear-lab"             element={<EarLab />} />
                <Route path="/laboratorio-groove"  element={<LaboratorioGroove />} />
                <Route path="/padroes-pentatonica" element={<PadroesPentatonica />} />
                <Route path="/improviso"           element={<Improviso />} />
                {/* ── Páginas de artistas individuais (desativadas) ──────────────────
                <Route path="/lendas/djavan"           element={<Djavan />} />
                <Route path="/lendas/chico-buarque"    element={<ChicoBuarque />} />
                <Route path="/lendas/cartola"          element={<Cartola />} />
                <Route path="/lendas/cazuza"           element={<Cazuza />} />
                <Route path="/lendas/paralamas"        element={<Paralamas />} />
                <Route path="/lendas/roupa-nova"       element={<RoupaNova />} />
                <Route path="/lendas/stevie-wonder"    element={<StevieWonder />} />
                <Route path="/lendas/michael-jackson"  element={<MichaelJackson />} />
                ── */}
                <Route path="/lendas/licks"          element={<VocabularioLicks />} />
                <Route path="/lendas/cliches-blues"  element={<ClichesBlues />} />
                <Route path="/planos"                element={<Planos />} />
                <Route path="/braco-violao"        element={<FretboardPlayground />} />
                <Route path="/jazz-blues"          element={<JazzBlues />} />
                <Route path="/historia"            element={<Historia />} />
                <Route path="/quiz"                 element={<Quiz />} />
                <Route path="/roadmap"              element={<Roadmap />} />
                <Route path="/maquina-acordes"     element={<MaquinaAcordes />} />
                <Route path="/progresso"           element={<Progresso />} />
                <Route path="*"                    element={<Navigate to="/inicio" replace />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
    </>
  )
}
