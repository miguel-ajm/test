import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Characters from "./pages/Characters"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Characters />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App