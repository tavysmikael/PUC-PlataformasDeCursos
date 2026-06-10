import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Categorias from "./pages/Categorias";
import Cursos from "./pages/Cursos";
import Modulos from "./pages/Modulos";
import Aulas from "./pages/Aulas";
import Matriculas from "./pages/Matriculas";
import Trilhas from "./pages/Trilhas";
import Certificados from "./pages/Certificados";
import Planos from "./pages/Planos";
import Pagamentos from "./pages/Pagamentos";
import Avaliacoes from "./pages/Avaliacoes";
import Progresso from "./pages/Progresso";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="bg-light min-vh-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/modulos" element={<Modulos />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/matriculas" element={<Matriculas />} />
          <Route path="/trilhas" element={<Trilhas />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/avaliacoes" element={<Avaliacoes />} />
          <Route path="/progresso" element={<Progresso />} />
        </Routes>
      </main>
    </>
  );
}
