import { useState, useEffect } from "react";
import { IProgressoAula, IUsuario, IAula, IModulo, ICurso } from "../../models/types";
import { listarProgressoAulas, criarProgressoAula, removerProgressoAula } from "../../services/progressoAulaService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarAulas } from "../../services/aulaService";
import { listarModulos } from "../../services/moduloService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { idUsuario: "", idAula: "" };

export default function Progresso() {
  const [progressos, setProgressos] = useState<IProgressoAula[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [moduloSelecionado, setModuloSelecionado] = useState("");

  const carregarDados = async () => {
    const [p, u, a, m, c] = await Promise.all([
      listarProgressoAulas(), listarUsuarios(), listarAulas(), listarModulos(), listarCursos(),
    ]);
    setProgressos(p);
    setUsuarios(u);
    setAulas(a);
    setModulos(m);
    setCursos(c);
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesUsuario = usuarios.map((u) => ({ value: u.id, label: u.nomeCompleto }));

  // Filtra módulos pelo curso selecionado
  const modulosDoCurso = modulos.filter((m) => m.idCurso === cursoSelecionado);
  // Filtra aulas pelo módulo selecionado
  const aulasDoModulo = aulas.filter((a) => a.idModulo === moduloSelecionado);
  const opcoesAula = aulasDoModulo.map((a) => ({
    value: a.id,
    label: `Aula ${a.ordem} — ${a.titulo}`,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const validacao = validarCamposObrigatorios(form, ["idUsuario", "idAula"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    const jaConcluiu = progressos.some(
      (p) => p.idUsuario === form.idUsuario && p.idAula === form.idAula
    );
    if (jaConcluiu) return setErro("Este usuário já concluiu esta aula.");

    await criarProgressoAula({
      idUsuario: form.idUsuario,
      idAula: form.idAula,
      dataConclusao: new Date().toLocaleDateString("pt-BR"),
      status: "Concluído",
    });
    setForm(estadoInicial);
    setSucesso("Aula marcada como concluída!");
    carregarDados();
  };

  const handleRemover = async (id: string) => {
    await removerProgressoAula(id);
    carregarDados();
  };

  const colunas: Coluna<IProgressoAula>[] = [
    { key: "id", label: "ID" },
    {
      key: "idUsuario", label: "Aluno",
      render: (item) => usuarios.find((u) => u.id === item.idUsuario)?.nomeCompleto ?? "—",
    },
    {
      key: "idAula", label: "Aula",
      render: (item) => {
        const aula = aulas.find((a) => a.id === item.idAula);
        if (!aula) return "—";
        const modulo = modulos.find((m) => m.id === aula.idModulo);
        return `${aula.titulo} (${modulo?.titulo ?? "—"})`;
      },
    },
    {
      key: "status", label: "Status",
      render: (item) => (
        <span className="badge bg-success">{item.status}</span>
      ),
    },
    { key: "dataConclusao", label: "Data de Conclusão" },
  ];

  // Calcula progresso por usuário e curso
  const progressoPorUsuario = usuarios.map((u) => {
    const aulasConcluidasIds = progressos
      .filter((p) => p.idUsuario === u.id)
      .map((p) => p.idAula);

    return cursos.map((c) => {
      const modulosDoCurso = modulos.filter((m) => m.idCurso === c.id);
      const aulasIds = modulosDoCurso.flatMap((m) =>
        aulas.filter((a) => a.idModulo === m.id).map((a) => a.id)
      );
      const totalAulas = aulasIds.length;
      const concluidas = aulasIds.filter((id) => aulasConcluidasIds.includes(id)).length;
      return { usuario: u.nomeCompleto, curso: c.titulo, totalAulas, concluidas };
    }).filter((r) => r.concluidas > 0);
  }).flat();

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Controle de Progresso</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Marcar Aula como Concluída</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3">
                <FormField label="Aluno" name="idUsuario" type="select" value={form.idUsuario} onChange={handleChange} options={opcoesUsuario} required />
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Curso</label>
                  <select className="form-select" value={cursoSelecionado} onChange={(e) => { setCursoSelecionado(e.target.value); setModuloSelecionado(""); setForm((prev) => ({ ...prev, idAula: "" })); }}>
                    <option value="">Selecione...</option>
                    {cursos.map((c) => (<option key={c.id} value={c.id}>{c.titulo}</option>))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Módulo</label>
                  <select className="form-select" value={moduloSelecionado} onChange={(e) => { setModuloSelecionado(e.target.value); setForm((prev) => ({ ...prev, idAula: "" })); }}>
                    <option value="">Selecione...</option>
                    {modulosDoCurso.map((m) => (<option key={m.id} value={m.id}>Módulo {m.ordem} — {m.titulo}</option>))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <FormField label="Aula" name="idAula" type="select" value={form.idAula} onChange={handleChange} options={opcoesAula} required />
              </div>
            </div>
            <button type="submit" className="btn btn-success fw-bold">✅ Marcar como Concluída</button>
          </form>
        </div>
      </div>

      {/* Resumo de progresso */}
      {progressoPorUsuario.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-dark text-white fw-semibold">Resumo de Progresso por Aluno</div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Aluno</th>
                    <th>Curso</th>
                    <th>Progresso</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progressoPorUsuario.map((r, i) => {
                    const percent = r.totalAulas > 0 ? Math.round((r.concluidas / r.totalAulas) * 100) : 0;
                    return (
                      <tr key={i}>
                        <td>{r.usuario}</td>
                        <td>{r.curso}</td>
                        <td>
                          <div className="progress" style={{ height: "20px" }}>
                            <div className="progress-bar bg-success" style={{ width: `${percent}%` }}>
                              {r.concluidas}/{r.totalAulas} ({percent}%)
                            </div>
                          </div>
                        </td>
                        <td>
                          {percent === 100 ? (
                            <span className="badge bg-success">Completo</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Em andamento</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Aulas Concluídas ({progressos.length})
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={progressos} onRemover={handleRemover} />
        </div>
      </div>
    </div>
  );
}
