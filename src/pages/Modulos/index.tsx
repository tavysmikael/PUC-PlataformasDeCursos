import { useState, useEffect } from "react";
import { IModulo, ICurso } from "../../models/types";
import { listarModulos, criarModulo, removerModulo } from "../../services/moduloService";
import { listarCursos } from "../../services/cursoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import ApiStatus from "../../components/ui/ApiStatus";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { idCurso: "", titulo: "", ordem: "" };

export default function Modulos() {
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregarDados = async () => {
    setCarregando(true); setErroApi("");
    try {
      const [m, c] = await Promise.all([listarModulos(), listarCursos()]);
      setModulos(m); setCursos(c);
    } catch (error) { setErroApi(error instanceof Error ? error.message : "Erro ao carregar dados."); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesCurso = cursos.map((c) => ({ value: c.id, label: c.titulo }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(""); setSucesso("");
    const validacao = validarCamposObrigatorios(form, ["idCurso", "titulo", "ordem"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);
    try {
      await criarModulo({ idCurso: form.idCurso, titulo: form.titulo, ordem: Number(form.ordem) });
      setForm(estadoInicial); setSucesso("Módulo cadastrado com sucesso!"); await carregarDados();
    } catch (error) { setErro(error instanceof Error ? error.message : "Erro ao cadastrar módulo."); }
  };

  const handleRemover = async (id: string) => {
    try { await removerModulo(id); await carregarDados(); }
    catch (error) { setErro(error instanceof Error ? error.message : "Erro ao remover módulo."); }
  };

  const modulosFiltrados = filtroCurso ? modulos.filter((m) => m.idCurso === filtroCurso) : modulos;
  const modulosOrdenados = [...modulosFiltrados].sort((a, b) => a.ordem - b.ordem);

  const colunas: Coluna<IModulo>[] = [
    { key: "ordem", label: "Ordem" },
    { key: "titulo", label: "Título do Módulo" },
    { key: "idCurso", label: "Curso", render: (item) => cursos.find((c) => c.id === item.idCurso)?.titulo ?? "—" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Módulos</h2>
      <ApiStatus carregando={carregando} erroApi={erroApi} recarregar={carregarDados} />
      {!carregando && !erroApi && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white fw-semibold">Novo Módulo</div>
            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-5"><FormField label="Curso" name="idCurso" type="select" value={form.idCurso} onChange={handleChange} options={opcoesCurso} required /></div>
                  <div className="col-md-5"><FormField label="Título do Módulo" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Introdução ao React" required /></div>
                  <div className="col-md-2"><FormField label="Ordem" name="ordem" type="number" value={form.ordem} onChange={handleChange} placeholder="Ex: 1" required /></div>
                </div>
                <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Módulo</button>
              </form>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
              <span>Módulos Cadastrados ({modulosOrdenados.length})</span>
              <select className="form-select form-select-sm w-auto" value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
                <option value="">Todos os cursos</option>
                {cursos.map((c) => (<option key={c.id} value={c.id}>{c.titulo}</option>))}
              </select>
            </div>
            <div className="card-body"><DataTable colunas={colunas} dados={modulosOrdenados} onRemover={handleRemover} /></div>
          </div>
        </>
      )}
    </div>
  );
}
