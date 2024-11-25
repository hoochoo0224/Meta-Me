import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@pages/index/index'
import MakeProfilePage from '@pages/makeProfile/index'
import CreateProfilePage from './pages/createProfile'
import SettingsPage from './pages/settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/make-profile" element={<MakeProfilePage />} />
        <Route path="/create-profile" element={<CreateProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App