import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Providers } from './lib/providers'
import Layout from './components/Layout'
import Lab from './pages/Lab'
import Traders from './pages/Traders'
import CreateAgent from './pages/CreateAgent'
import GenomeViewer from './pages/GenomeViewer'
import AgentDashboard from './pages/AgentDashboard'
import EvolutionTree from './pages/EvolutionTree'
import Arena from './pages/Arena'
import ZKVerifiability from './pages/ZKVerifiability'

function App() {
  return (
    <Providers>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Lab />} />
            <Route path="/traders" element={<Traders />} />
            <Route path="/create" element={<CreateAgent />} />
            <Route path="/genome/:id" element={<GenomeViewer />} />
            <Route path="/agent/:id" element={<AgentDashboard />} />
            <Route path="/evolution/:id" element={<EvolutionTree />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/zk-verify" element={<ZKVerifiability />} />
          </Routes>
        </Layout>
      </Router>
    </Providers>
  )
}

export default App
