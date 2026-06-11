import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  path: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: "/", label: " Dashboard" },
  { path: "/usuarios", label: " Usuários" },
  { path: "/categorias", label: " Categorias" },
  { path: "/cursos", label: " Cursos" },
  { path: "/modulos", label: " Módulos" },
  { path: "/aulas", label: " Aulas" },
  { path: "/matriculas", label: " Matrículas" },
  { path: "/trilhas", label: " Trilhas" },
  { path: "/certificados", label: " Certificados" },
  { path: "/planos", label: " Planos" },
  { path: "/pagamentos", label: " Pagamentos" },
  { path: "/avaliacoes", label: " Avaliações" },
  { path: "/progresso", label: " Progresso" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          CURSOS TCS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto gap-1">
            {menuItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link px-3 rounded ${location.pathname === item.path ? "active bg-warning text-dark fw-bold" : ""}`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
