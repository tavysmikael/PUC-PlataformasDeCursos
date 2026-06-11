import { useState, useEffect } from "react";
import { ITrilha, ITrilhaCurso, ICategoria, ICurso } from "../../models/types";
import { listarTrilhas, criarTrilha, removerTrilha } from "../../services/trilhaService";
import { listarTrilhasCursos, criarTrilhaCurso } from "../../services/trilhaCursoService";
import { listarCategorias } from "../../services/categoriaService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import ApiStatus from "../../components/ui/ApiStatus";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { titulo: "", descricao: "", idCategoria: "" };

export default function Trilhas() {
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  const [trilhasCursos, setTrilhasCursos] = useState<ITrilhaCurso[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [trilhaSelecionada, setTrilhaSelecionada] = useState<ITrilha | null>(null);
  const [cursoParaAdicionar, setCursoParaAdicionar] = useState("");
  const [ordemCurso, setOrdemCurso] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregarDados = async () => {
    setCarregando(true); setErroApi("");
    try {
      const [t, tc, cat, c] = await Promise.all([listarTrilhas(), listarTrilhasCursos(), listarCategorias(), listarCursos()]);
      setTrilhas(t); setTrilhasCursos(tc); setCategorias(cat); setCursos(c);
    } catch (error) { setErroApi(error instanceof Error ? error.message : "Erro ao carregar dados."); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesCategoria = categorias.map((c) => ({ value: c.id, label: c.nome }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(""); setSucesso("");
    const validacao = validarCamposObrigatorios(form, ["titulo", "idCategoria"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);
    try {
      await criarTrilha(form);
      setForm(estadoInicial); setSucesso("Trilha cadastrada com sucesso!"); await carregarDados();
    } catch (error) { setErro(error instanceof Error ? error.message : "Erro ao cadastrar trilha."); }
  };

  const handleAdicionarCurso = async () => {
    if (!cursoParaAdicionar || !ordemCurso || !trilhaSelecionada) return;
    const jaExiste = trilhasCursos.some((tc) => tc.idTrilha === trilhaSelecionada.id && tc.idCurso === cursoParaAdicionar);
    if (jaExiste) return;
    try {
      await criarTrilhaCurso({ idTrilha: trilhaSelecionada.id, idCurso: cursoParaAdicionar, ordem: Number(ordemCurso) });
      setCursoParaAdicionar(""); setOrdemCurso(""); await carregarDados();
    } catch (error) { setErro(error instanceof Error ? error.message : "Erro ao adicionar curso à trilha."); }
  };

  const handleRemover = async (id: string) => {
    try { await removerTrilha(id); await carregarDados(); }
    catch (error) { setErro(error instanceof Error ? error.message : "Erro ao remover trilha."); }
  };

  const cursosDaTrilha = trilhaSelecionada
    ? trilhasCursos.filter((tc) => tc.idTrilha === trilhaSelecionada.id).sort((a, b) => a.ordem - b.ordem)
        .map((tc) => ({ ...tc, tituloCurso: cursos.find((c) => c.id === tc.idCurso)?.titulo ?? "—" }))
    : [];

  const colunasTrilhas: Coluna<ITrilha>[] = [
    { key: "id", label: "ID" }, { key: "titulo", label: "Título" }, { key: "descricao", label: "Descrição" },
    { key: "idCategoria", label: "Categoria", render: (item) => categorias.find((c) => c.id === item.idCategoria)?.nome ?? "—" },
    { key: "acoes", label: "Cursos", render: (item) => (<button className="btn btn-sm btn-outline-warning" onClick={() => setTrilhaSelecionada(item)}>🛤️ Gerenciar</button>) },
  ];
  const colunasCursosTrilha: Coluna<ITrilhaCurso & { tituloCurso: string }>[] = [
    { key: "ordem", label: "Ordem" }, { key: "tituloCurso", label: "Curso" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Trilhas</h2>
      <ApiStatus carregando={carregando} erroApi={erroApi} recarregar={carregarDados} />
      {!carregando && !erroApi && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white fw-semibold">Nova Trilha</div>
            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-5"><FormField label="Título da Trilha" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Trilha Full Stack" required /></div>
                  <div className="col-md-4"><FormField label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva a trilha..." /></div>
                  <div className="col-md-3"><FormField label="Categoria" name="idCategoria" type="select" value={form.idCategoria} onChange={handleChange} options={opcoesCategoria} required /></div>
                </div>
                <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Trilha</button>
              </form>
            </div>
          </div>
          {trilhaSelecionada && (
            <div className="card shadow-sm mb-4 border-warning">
              <div className="card-header bg-warning text-dark fw-semibold d-flex justify-content-between">
                <span>🛤️ Cursos da Trilha: {trilhaSelecionada.titulo}</span>
                <button className="btn btn-sm btn-dark" onClick={() => setTrilhaSelecionada(null)}>✕ Fechar</button>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-7">
                    <select className="form-select" value={cursoParaAdicionar} onChange={(e) => setCursoParaAdicionar(e.target.value)}>
                      <option value="">Selecione um curso...</option>
                      {cursos.map((c) => (<option key={c.id} value={c.id}>{c.titulo}</option>))}
                    </select>
                  </div>
                  <div className="col-md-3"><input className="form-control" type="number" placeholder="Ordem" value={ordemCurso} onChange={(e) => setOrdemCurso(e.target.value)} /></div>
                  <div className="col-md-2"><button className="btn btn-warning w-100 fw-bold" onClick={handleAdicionarCurso}>➕ Adicionar</button></div>
                </div>
                <DataTable colunas={colunasCursosTrilha} dados={cursosDaTrilha} />
              </div>
            </div>
          )}
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold">Trilhas Cadastradas ({trilhas.length})</div>
            <div className="card-body"><DataTable colunas={colunasTrilhas} dados={trilhas} onRemover={handleRemover} /></div>
          </div>
        </>
      )}
    </div>
  );
}
