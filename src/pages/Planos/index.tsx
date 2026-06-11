import { useState, useEffect } from "react";
import { IPlano } from "../../models/types";
import { listarPlanos, criarPlano, removerPlano } from "../../services/planoService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import ApiStatus from "../../components/ui/ApiStatus";
import { validarCamposObrigatorios } from "../../utils/validators";

const estadoInicial = { nome: "", descricao: "", preco: "", duracaoMeses: "" };
const colunas: Coluna<IPlano>[] = [
  { key: "id", label: "ID" }, { key: "nome", label: "Nome" }, { key: "descricao", label: "Descrição" },
  { key: "preco", label: "Preço", render: (item) => `R$ ${Number(item.preco).toFixed(2)}` },
  { key: "duracaoMeses", label: "Duração (meses)" },
];

export default function Planos() {
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregarDados = async () => {
    setCarregando(true); setErroApi("");
    try { const data = await listarPlanos(); setPlanos(data); }
    catch (error) { setErroApi(error instanceof Error ? error.message : "Erro ao carregar dados."); }
    finally { setCarregando(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErro(""); setSucesso("");
    const validacao = validarCamposObrigatorios(form, ["nome", "preco", "duracaoMeses"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);
    if (Number(form.preco) <= 0) return setErro("O preço deve ser maior que zero.");
    try {
      await criarPlano({ nome: form.nome, descricao: form.descricao, preco: Number(form.preco), duracaoMeses: Number(form.duracaoMeses) });
      setForm(estadoInicial); setSucesso("Plano cadastrado com sucesso!"); await carregarDados();
    } catch (error) { setErro(error instanceof Error ? error.message : "Erro ao cadastrar plano."); }
  };

  const handleRemover = async (id: string) => {
    try { await removerPlano(id); await carregarDados(); }
    catch (error) { setErro(error instanceof Error ? error.message : "Erro ao remover plano."); }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Planos</h2>
      <ApiStatus carregando={carregando} erroApi={erroApi} recarregar={carregarDados} />
      {!carregando && !erroApi && (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-dark text-white fw-semibold">Novo Plano</div>
            <div className="card-body">
              {erro && <div className="alert alert-danger">{erro}</div>}
              {sucesso && <div className="alert alert-success">{sucesso}</div>}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4"><FormField label="Nome do Plano" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Plano Pro" required /></div>
                  <div className="col-md-4"><FormField label="Preço (R$)" name="preco" type="number" value={form.preco} onChange={handleChange} placeholder="Ex: 59.90" required /></div>
                  <div className="col-md-4"><FormField label="Duração (meses)" name="duracaoMeses" type="number" value={form.duracaoMeses} onChange={handleChange} placeholder="Ex: 12" required /></div>
                </div>
                <FormField label="Descrição" name="descricao" type="textarea" value={form.descricao} onChange={handleChange} placeholder="Descreva os benefícios do plano..." />
                <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Plano</button>
              </form>
            </div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white fw-semibold">Planos Cadastrados ({planos.length})</div>
            <div className="card-body"><DataTable colunas={colunas} dados={planos} onRemover={handleRemover} /></div>
          </div>
        </>
      )}
    </div>
  );
}
