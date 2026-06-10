import { useState, useEffect } from "react";
import { IMatricula, IUsuario, ICurso } from "../../models/types";
import { listarMatriculas, criarMatricula, removerMatricula } from "../../services/matriculaService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { idUsuario: "", idCurso: "" };

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarDados = async () => {
    const [m, u, c] = await Promise.all([listarMatriculas(), listarUsuarios(), listarCursos()]);
    setMatriculas(m);
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

    const validacao = validarCamposObrigatorios(form, ["idUsuario", "idCurso"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    const jaMatriculado = matriculas.some(
      (m) => m.idUsuario === form.idUsuario && m.idCurso === form.idCurso
    );
    if (jaMatriculado) return setErro("Este usuário já está matriculado neste curso.");

    await criarMatricula({
      idUsuario: form.idUsuario,
      idCurso: form.idCurso,
      dataMatricula: new Date().toLocaleDateString("pt-BR"),
      dataConclusao: null,
    });
    setForm(estadoInicial);
    setSucesso("Matrícula realizada com sucesso!");
    carregarDados();
  };

  const handleRemover = async (id: string) => {
    await removerMatricula(id);
    carregarDados();
  };

  const colunas: Coluna<IMatricula>[] = [
    { key: "id", label: "ID" },
    {
      key: "idUsuario", label: "Aluno",
      render: (item) => usuarios.find((u) => u.id === item.idUsuario)?.nomeCompleto ?? "—",
    },
    {
      key: "idCurso", label: "Curso",
      render: (item) => cursos.find((c) => c.id === item.idCurso)?.titulo ?? "—",
    },
    { key: "dataMatricula", label: "Data da Matrícula" },
    {
      key: "dataConclusao", label: "Conclusão",
      render: (item) => item.dataConclusao ?? "⏳ Em andamento",
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Matrículas</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Nova Matrícula</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <FormField label="Aluno" name="idUsuario" type="select" value={form.idUsuario} onChange={handleChange} options={opcoesUsuario} required />
              </div>
              <div className="col-md-6">
                <FormField label="Curso" name="idCurso" type="select" value={form.idCurso} onChange={handleChange} options={opcoesCurso} required />
              </div>
            </div>
            <button type="submit" className="btn btn-warning fw-bold">➕ Realizar Matrícula</button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Matrículas Realizadas ({matriculas.length})
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={matriculas} onRemover={handleRemover} />
        </div>
      </div>
    </div>
  );
}
