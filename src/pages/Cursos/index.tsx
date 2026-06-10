import { useState, useEffect } from "react";
import { ICurso, IUsuario, ICategoria } from "../../models/types";
import { listarCursos, criarCurso, removerCurso } from "../../services/cursoService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarCategorias } from "../../services/categoriaService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = {
  titulo: "", descricao: "", idInstrutor: "", idCategoria: "",
  nivel: "", totalAulas: "", totalHoras: "",
};

const niveis = [
  { value: "Iniciante", label: "Iniciante" },
  { value: "Intermediário", label: "Intermediário" },
  { value: "Avançado", label: "Avançado" },
];

export default function Cursos() {
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroCat, setFiltroCat] = useState("");

  const carregarDados = async () => {
    const [c, u, cat] = await Promise.all([listarCursos(), listarUsuarios(), listarCategorias()]);
    setCursos(c);
    setUsuarios(u);
    setCategorias(cat);
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesInstrutor = usuarios.map((u) => ({ value: u.id, label: u.nomeCompleto }));
  const opcoesCategoria = categorias.map((c) => ({ value: c.id, label: c.nome }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const validacao = validarCamposObrigatorios(form, ["titulo", "idInstrutor", "idCategoria", "nivel"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    await criarCurso({
      titulo: form.titulo,
      descricao: form.descricao,
      idInstrutor: form.idInstrutor,
      idCategoria: form.idCategoria,
      nivel: form.nivel,
      totalAulas: Number(form.totalAulas),
      totalHoras: Number(form.totalHoras),
      dataPublicacao: new Date().toLocaleDateString("pt-BR"),
    });
    setForm(estadoInicial);
    setSucesso("Curso cadastrado com sucesso!");
    carregarDados();
  };

  const cursosFiltrados = filtroCat ? cursos.filter((c) => c.idCategoria === filtroCat) : cursos;

  const colunas: Coluna<ICurso>[] = [
    { key: "id", label: "ID" },
    { key: "titulo", label: "Título" },
    {
      key: "idCategoria", label: "Categoria",
      render: (item) => categorias.find((c) => c.id === item.idCategoria)?.nome ?? "—",
    },
    {
      key: "idInstrutor", label: "Instrutor",
      render: (item) => usuarios.find((u) => u.id === item.idInstrutor)?.nomeCompleto ?? "—",
    },
    { key: "nivel", label: "Nível" },
    { key: "totalAulas", label: "Aulas" },
    { key: "totalHoras", label: "Horas" },
    { key: "dataPublicacao", label: "Publicado em" },
  ];

  const handleRemover = async (id: string) => {
    await removerCurso(id);
    carregarDados();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Cursos</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Novo Curso</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <FormField label="Título do Curso" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: React do Zero ao Avançado" required />
              </div>
              <div className="col-md-3">
                <FormField label="Instrutor" name="idInstrutor" type="select" value={form.idInstrutor} onChange={handleChange} options={opcoesInstrutor} required />
              </div>
              <div className="col-md-3">
                <FormField label="Categoria" name="idCategoria" type="select" value={form.idCategoria} onChange={handleChange} options={opcoesCategoria} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <FormField label="Nível" name="nivel" type="select" value={form.nivel} onChange={handleChange} options={niveis} required />
              </div>
              <div className="col-md-4">
                <FormField label="Total de Aulas" name="totalAulas" type="number" value={form.totalAulas} onChange={handleChange} placeholder="Ex: 40" />
              </div>
              <div className="col-md-4">
                <FormField label="Total de Horas" name="totalHoras" type="number" value={form.totalHoras} onChange={handleChange} placeholder="Ex: 20" />
              </div>
            </div>
            <FormField label="Descrição" name="descricao" type="textarea" value={form.descricao} onChange={handleChange} placeholder="Descreva o curso..." />
            <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Curso</button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
          <span>Cursos Cadastrados ({cursosFiltrados.length})</span>
          <select className="form-select form-select-sm w-auto" value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
          </select>
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={cursosFiltrados} onRemover={handleRemover} />
        </div>
      </div>
    </div>
  );
}
