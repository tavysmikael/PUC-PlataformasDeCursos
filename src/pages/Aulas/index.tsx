import { useState, useEffect } from "react";
import { IAula, IModulo, ICurso } from "../../models/types";
import { listarAulas, criarAula, removerAula } from "../../services/aulaService";
import { listarModulos } from "../../services/moduloService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import ApiStatus from "../../components/ui/ApiStatus";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { idModulo: "", titulo: "", tipoConteudo: "", urlConteudo: "", duracaoMinutos: "", ordem: "" };
const tiposConteudo = [
  { value: "Vídeo", label: "🎬 Vídeo" },
  { value: "Texto", label: "📄 Texto" },
  { value: "Quiz", label: "❓ Quiz" },
];

export default function Aulas() {
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState("");
  const [filtroModulo, setFiltroModulo] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregarDados = async () => {
    setCarregando(true); setErroApi("");
    try {
      const [a, m, c] = await Promise.all([listarAulas(), listarModulos(), listarCursos()]);
      setAulas(a); setModulos(m); setCursos(c);
    } catch (error) { setErroApi(error instanceof Error ? error.message : "Erro ao carregar dados."); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const modulosDoCurso = modulos.filter((m) => m.idCurso === cursoSelecionado);
  const opcoesModulo = modulosDoCurso.map((m) => ({ value: m.id, label: `Módulo ${m.ordem} — ${m.titulo}` }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCursoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCursoSelecionado(e.target.value);
    setForm((prev) => ({ ...prev, idModulo: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(""); setSucesso("");
    const validacao = validarCamposObrigatorios(form, ["idModulo", "titulo", "tipoConteudo", "ordem"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);
    try {
      await criarAula({ idModulo: form.idModulo, titulo: form.titulo, tipoConteudo: form.tipoConteudo, urlConteudo: form.urlConteudo, duracaoMinutos: Number(form.duracaoMinutos), ordem: Number(form.ordem) });
      setForm(estadoInicial); setSucesso("Aula cadastrada com sucesso!"); await carregarDados();
    } catch (error) { setErro(error instanceof Error ? error.message : "Erro ao cadastrar aula."); }
  };

  const handleRemover = async (id: string) => {
    try { await removerAula(id); await carregarDados(); }
    catch (error) { setErro(error instanceof Error ? error.message : "Erro ao remover aula."); }
  };

  const aulasFiltradas = filtroModulo ? aulas.filter((a) => a.idModulo === filtroModulo) : aulas;
  const aulasOrdenadas = [...aulasFiltradas].sort((a, b) => a.ordem - b.ordem);

  const colunas: Coluna<IAula>[] = [
    { key: "ordem", label: "Ordem" },
    { key: "titulo", label: "Título da Aula" },
    { key: "tipoConteudo", label: "Tipo" },
    { key: "duracaoMinutos", label: "Duração (min)" },
    { key: "idModulo", label: "Módulo", render: (item) => modulos.find((m) => m.id === item.idModulo)?.titulo ?? "—" },
    { key: "urlConteudo", label: "Link", render: (item) => item.urlConteudo ? (<a href={item.urlConteudo} target="_blank" rel="noreferrer">🔗 Acessar</a>) : "—" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Aulas</h2>
      <ApiStatus carregando={carregando} erroApi={erroApi} recarregar={carregarDados} />
      {!carregando && !erroApi && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white fw-semibold">Nova Aula</div>
            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Filtrar por Curso <span className="text-muted fw-normal">(para carregar módulos)</span></label>
                      <select className="form-select" value={cursoSelecionado} onChange={handleCursoChange}>
                        <option value="">Selecione um curso...</option>
                        {cursos.map((c) => (<option key={c.id} value={c.id}>{c.titulo}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6"><FormField label="Módulo" name="idModulo" type="select" value={form.idModulo} onChange={handleChange} options={opcoesModulo} required /></div>
                </div>
                <div className="row">
                  <div className="col-md-5"><FormField label="Título da Aula" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: O que é JSX?" required /></div>
                  <div className="col-md-3"><FormField label="Tipo de Conteúdo" name="tipoConteudo" type="select" value={form.tipoConteudo} onChange={handleChange} options={tiposConteudo} required /></div>
                  <div className="col-md-2"><FormField label="Duração (min)" name="duracaoMinutos" type="number" value={form.duracaoMinutos} onChange={handleChange} placeholder="Ex: 15" /></div>
                  <div className="col-md-2"><FormField label="Ordem" name="ordem" type="number" value={form.ordem} onChange={handleChange} placeholder="Ex: 1" required /></div>
                </div>
                <FormField label="URL do Conteúdo" name="urlConteudo" value={form.urlConteudo} onChange={handleChange} placeholder="Ex: https://youtube.com/..." />
                <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Aula</button>
              </form>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
              <span>Aulas Cadastradas ({aulasOrdenadas.length})</span>
              <select className="form-select form-select-sm w-auto" value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}>
                <option value="">Todos os módulos</option>
                {modulos.map((m) => (<option key={m.id} value={m.id}>{m.titulo}</option>))}
              </select>
            </div>
            <div className="card-body"><DataTable colunas={colunas} dados={aulasOrdenadas} onRemover={handleRemover} /></div>
          </div>
        </>
      )}
    </div>
  );
}
