import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IUsuario, ICategoria, ICurso, IMatricula, ICertificado, IAssinatura, IPagamento, IModulo, IAula, ITrilha, IPlano } from "../../models/types";
import { listarUsuarios } from "../../services/usuarioService";
import { listarCategorias } from "../../services/categoriaService";
import { listarCursos } from "../../services/cursoService";
import { listarModulos } from "../../services/moduloService";
import { listarAulas } from "../../services/aulaService";
import { listarMatriculas } from "../../services/matriculaService";
import { listarTrilhas } from "../../services/trilhaService";
import { listarCertificados } from "../../services/certificadoService";
import { listarPlanos } from "../../services/planoService";
import { listarAssinaturas } from "../../services/assinaturaService";
import { listarPagamentos } from "../../services/pagamentoService";

interface DadosState {
  usuarios: IUsuario[];
  categorias: ICategoria[];
  cursos: ICurso[];
  modulos: IModulo[];
  aulas: IAula[];
  matriculas: IMatricula[];
  trilhas: ITrilha[];
  certificados: ICertificado[];
  planos: IPlano[];
  assinaturas: IAssinatura[];
  pagamentos: IPagamento[];
}

const cards = [
  { label: "Usuários", chave: "usuarios" as keyof DadosState, emoji: "👤", path: "/usuarios", cor: "primary" },
  { label: "Categorias", chave: "categorias" as keyof DadosState, emoji: "📂", path: "/categorias", cor: "secondary" },
  { label: "Cursos", chave: "cursos" as keyof DadosState, emoji: "🎓", path: "/cursos", cor: "success" },
  { label: "Módulos", chave: "modulos" as keyof DadosState, emoji: "📦", path: "/modulos", cor: "info" },
  { label: "Aulas", chave: "aulas" as keyof DadosState, emoji: "🎬", path: "/aulas", cor: "warning" },
  { label: "Matrículas", chave: "matriculas" as keyof DadosState, emoji: "📋", path: "/matriculas", cor: "danger" },
  { label: "Trilhas", chave: "trilhas" as keyof DadosState, emoji: "🛤️", path: "/trilhas", cor: "primary" },
  { label: "Certificados", chave: "certificados" as keyof DadosState, emoji: "🏆", path: "/certificados", cor: "warning" },
  { label: "Planos", chave: "planos" as keyof DadosState, emoji: "💳", path: "/planos", cor: "success" },
  { label: "Pagamentos", chave: "pagamentos" as keyof DadosState, emoji: "💰", path: "/pagamentos", cor: "danger" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [dados, setDados] = useState<DadosState>({
    usuarios: [], categorias: [], cursos: [], modulos: [], aulas: [],
    matriculas: [], trilhas: [], certificados: [], planos: [],
    assinaturas: [], pagamentos: [],
  });

  useEffect(() => {
    const carregarDados = async () => {
      const [usuarios, categorias, cursos, modulos, aulas, matriculas, trilhas, certificados, planos, assinaturas, pagamentos] =
        await Promise.all([
          listarUsuarios(), listarCategorias(), listarCursos(), listarModulos(),
          listarAulas(), listarMatriculas(), listarTrilhas(), listarCertificados(),
          listarPlanos(), listarAssinaturas(), listarPagamentos(),
        ]);
      setDados({ usuarios, categorias, cursos, modulos, aulas, matriculas, trilhas, certificados, planos, assinaturas, pagamentos });
    };
    carregarDados();
  }, []);

  // Calcula receita total
  const receitaTotal = dados.pagamentos.reduce(
    (acc, p) => acc + Number(p.valorPago), 0
  );

  // Curso mais popular (com mais matrículas)
  const cursosComMatriculas = dados.cursos
    .map((c) => ({
      ...c,
      total: dados.matriculas.filter((m) => m.idCurso === c.id).length,
    }))
    .sort((a, b) => b.total - a.total);

  // Últimos 5 certificados emitidos
  const ultimosCerts = [...dados.certificados].reverse().slice(0, 5);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <p className="text-muted">Visão geral da plataforma.</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-6 col-md-4 col-lg-3" key={card.chave}>
            <div
              className={`card border-${card.cor} shadow-sm h-100`}
              style={{ cursor: "pointer", transition: "transform 0.15s" }}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "2rem" }}>{card.emoji}</div>
                <h3 className={`fw-bold text-${card.cor} mb-0`}>
                  {dados[card.chave]?.length ?? 0}
                </h3>
                <small className="text-muted">{card.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Faixa de receita */}
      <div className="card bg-dark text-white shadow mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
          <div>
            <p className="mb-0 text-warning fw-semibold">Receita Total Simulada</p>
            <h2 className="fw-bold mb-0">R$ {receitaTotal.toFixed(2)}</h2>
          </div>
          <div className="text-end">
            <p className="mb-0 text-muted">Total de assinaturas ativas</p>
            <h4 className="fw-bold text-warning mb-0">{dados.assinaturas.length}</h4>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Curso mais popular */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-semibold">
              Ranking de Cursos por Matrículas
            </div>
            <div className="card-body">
              {cursosComMatriculas.length === 0 ? (
                <p className="text-muted text-center">Nenhum curso cadastrado.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {cursosComMatriculas.slice(0, 5).map((curso, i) => (
                    <li key={curso.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        <span className="fw-bold text-warning me-2">#{i + 1}</span>
                        {curso.titulo}
                      </span>
                      <span className="badge bg-dark rounded-pill">
                        {curso.total} matrícula{curso.total !== 1 ? "s" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Últimos certificados */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-semibold">
              Últimos Certificados Emitidos
            </div>
            <div className="card-body">
              {ultimosCerts.length === 0 ? (
                <p className="text-muted text-center">Nenhum certificado emitido ainda.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {ultimosCerts.map((cert) => {
                    const usuario = dados.usuarios.find((u) => u.id === cert.idUsuario);
                    const curso = dados.cursos.find((c) => c.id === cert.idCurso);
                    return (
                      <li key={cert.id} className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <span>
                            <strong>{usuario?.nomeCompleto ?? "—"}</strong>
                            <small className="text-muted d-block">{curso?.titulo ?? "—"}</small>
                          </span>
                          <span className="badge bg-warning text-dark align-self-center">
                            {cert.dataEmissao}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Últimas matrículas */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold">
              Últimas Matrículas
            </div>
            <div className="card-body">
              {dados.matriculas.length === 0 ? (
                <p className="text-muted text-center">Nenhuma matrícula ainda.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {[...dados.matriculas].reverse().slice(0, 5).map((mat) => {
                    const usuario = dados.usuarios.find((u) => u.id === mat.idUsuario);
                    const curso = dados.cursos.find((c) => c.id === mat.idCurso);
                    return (
                      <li key={mat.id} className="list-group-item d-flex justify-content-between">
                        <span>
                          <strong>{usuario?.nomeCompleto ?? "—"}</strong>
                          <small className="text-muted d-block">{curso?.titulo ?? "—"}</small>
                        </span>
                        <span className="badge bg-success align-self-center">{mat.dataMatricula}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Últimos pagamentos */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold">
              Últimos Pagamentos
            </div>
            <div className="card-body">
              {dados.pagamentos.length === 0 ? (
                <p className="text-muted text-center">Nenhum pagamento ainda.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {[...dados.pagamentos].reverse().slice(0, 5).map((pag) => {
                    const ass = dados.assinaturas.find((a) => a.id === pag.idAssinatura);
                    const usuario = dados.usuarios.find((u) => u.id === ass?.idUsuario);
                    return (
                      <li key={pag.id} className="list-group-item d-flex justify-content-between">
                        <span>
                          <strong>{usuario?.nomeCompleto ?? "—"}</strong>
                          <small className="text-muted d-block">{pag.metodoPagamento}</small>
                        </span>
                        <span className="badge bg-success align-self-center">
                          R$ {Number(pag.valorPago).toFixed(2)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
