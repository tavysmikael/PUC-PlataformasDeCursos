import { useState, useEffect } from "react";
import { IAvaliacao, IUsuario, ICurso } from "../../models/types";
import { listarAvaliacoes, criarAvaliacao, removerAvaliacao } from "../../services/avaliacaoService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { idUsuario: "", idCurso: "", nota: "", comentario: "" };

const opcoesNota = [
  { value: "1", label: "⭐ 1 — Péssimo" },
  { value: "2", label: "⭐⭐ 2 — Ruim" },
  { value: "3", label: "⭐⭐⭐ 3 — Regular" },
  { value: "4", label: "⭐⭐⭐⭐ 4 — Bom" },
  { value: "5", label: "⭐⭐⭐⭐⭐ 5 — Excelente" },
];

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<IAvaliacao[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarDados = async () => {
    const [a, u, c] = await Promise.all([listarAvaliacoes(), listarUsuarios(), listarCursos()]);
    setAvaliacoes(a);
    setUsuarios(u);
    setCursos(c);
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesUsuario = usuarios.map((u) => ({ value: u.id, label: u.nomeCompleto }));
  const opcoesCurso = cursos.map((c) => ({ value: c.id, label: c.titulo }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const validacao = validarCamposObrigatorios(form, ["idUsuario", "idCurso", "nota"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    const jaAvaliou = avaliacoes.some(
      (a) => a.idUsuario === form.idUsuario && a.idCurso === form.idCurso
    );
    if (jaAvaliou) return setErro("Este usuário já avaliou este curso.");

    await criarAvaliacao({
      idUsuario: form.idUsuario,
      idCurso: form.idCurso,
      nota: Number(form.nota),
      comentario: form.comentario || null,
      dataAvaliacao: new Date().toLocaleDateString("pt-BR"),
    });
    setForm(estadoInicial);
    setSucesso("Avaliação registrada com sucesso!");
    carregarDados();
  };

  const handleRemover = async (id: string) => {
    await removerAvaliacao(id);
    carregarDados();
  };

  const colunas: Coluna<IAvaliacao>[] = [
    { key: "id", label: "ID" },
    {
      key: "idUsuario", label: "Aluno",
      render: (item) => usuarios.find((u) => u.id === item.idUsuario)?.nomeCompleto ?? "—",
    },
    {
      key: "idCurso", label: "Curso",
      render: (item) => cursos.find((c) => c.id === item.idCurso)?.titulo ?? "—",
    },
    {
      key: "nota", label: "Nota",
      render: (item) => "⭐".repeat(item.nota),
    },
    {
      key: "comentario", label: "Comentário",
      render: (item) => item.comentario ?? "—",
    },
    { key: "dataAvaliacao", label: "Data" },
  ];

  // Calcula média por curso
  const mediasPorCurso = cursos.map((c) => {
    const avaliacoesCurso = avaliacoes.filter((a) => a.idCurso === c.id);
    const media = avaliacoesCurso.length > 0
      ? avaliacoesCurso.reduce((acc, a) => acc + a.nota, 0) / avaliacoesCurso.length
      : 0;
    return { ...c, media, totalAvaliacoes: avaliacoesCurso.length };
  }).filter((c) => c.totalAvaliacoes > 0).sort((a, b) => b.media - a.media);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Avaliações de Cursos</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Nova Avaliação</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <FormField label="Aluno" name="idUsuario" type="select" value={form.idUsuario} onChange={handleChange} options={opcoesUsuario} required />
              </div>
              <div className="col-md-4">
                <FormField label="Curso" name="idCurso" type="select" value={form.idCurso} onChange={handleChange} options={opcoesCurso} required />
              </div>
              <div className="col-md-4">
                <FormField label="Nota" name="nota" type="select" value={form.nota} onChange={handleChange} options={opcoesNota} required />
              </div>
            </div>
            <FormField label="Comentário (opcional)" name="comentario" type="textarea" value={form.comentario} onChange={handleChange} placeholder="Deixe sua opinião sobre o curso..." />
            <button type="submit" className="btn btn-warning fw-bold">➕ Registrar Avaliação</button>
          </form>
        </div>
      </div>

      {/* Médias por curso */}
      {mediasPorCurso.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white fw-semibold">Ranking de Cursos por Avaliação</div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              {mediasPorCurso.map((c, i) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <span className="fw-bold text-warning me-2">#{i + 1}</span>
                    {c.titulo}
                  </span>
                  <span>
                    <span className="badge bg-warning text-dark me-2">
                      {"⭐".repeat(Math.round(c.media))} {c.media.toFixed(1)}
                    </span>
                    <span className="badge bg-secondary">{c.totalAvaliacoes} avaliação(ões)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Avaliações Registradas ({avaliacoes.length})
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={avaliacoes} onRemover={handleRemover} />
        </div>
      </div>
    </div>
  );
}
