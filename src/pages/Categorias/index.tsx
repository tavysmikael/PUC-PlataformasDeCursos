import { useState, useEffect } from "react";
import { ICategoria } from "../../models/types";
import { listarCategorias, criarCategoria, removerCategoria } from "../../services/categoriaService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import ApiStatus from "../../components/ui/ApiStatus";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { nome: "", descricao: "" };

const colunas: Coluna<ICategoria>[] = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "descricao", label: "Descrição" },
];

export default function Categorias() {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregarDados = async () => {
    setCarregando(true);
    setErroApi("");
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      setErroApi(error instanceof Error ? error.message : "Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const validacao = validarCamposObrigatorios(form, ["nome"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    const nomeJaExiste = categorias.some(
      (c) => c.nome.toLowerCase() === form.nome.toLowerCase()
    );
    if (nomeJaExiste) return setErro("Já existe uma categoria com esse nome.");

    try {
      await criarCategoria(form);
      setForm(estadoInicial);
      setSucesso("Categoria cadastrada com sucesso!");
      await carregarDados();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao cadastrar categoria.");
    }
  };

  const handleRemover = async (id: string) => {
    try {
      await removerCategoria(id);
      await carregarDados();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao remover categoria.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Categorias</h2>

      <ApiStatus carregando={carregando} erroApi={erroApi} recarregar={carregarDados} />

      {!carregando && !erroApi && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white fw-semibold">Nova Categoria</div>
            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4">
                    <FormField label="Nome" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Programação" required />
                  </div>
                  <div className="col-md-8">
                    <FormField label="Descrição" name="descricao" type="textarea" value={form.descricao} onChange={handleChange} placeholder="Descreva a categoria..." />
                  </div>
                </div>
                <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Categoria</button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold">
              Categorias Cadastradas ({categorias.length})
            </div>
            <div className="card-body">
              <DataTable colunas={colunas} dados={categorias} onRemover={handleRemover} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
