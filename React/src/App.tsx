import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@pages/index/index'
import MakeProfilePage from '@pages/makeProfile/index'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/make-profile" element={<MakeProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App