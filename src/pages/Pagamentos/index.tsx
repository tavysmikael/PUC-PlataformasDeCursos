import { useState, useEffect } from "react";
import { IPagamento, IPlano, IUsuario, IAssinatura } from "../../models/types";
import { listarPagamentos, criarPagamento } from "../../services/pagamentoService";
import { listarPlanos } from "../../services/planoService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarAssinaturas, criarAssinatura } from "../../services/assinaturaService";
import DataTable, { Coluna } from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

const gerarId = () => Math.random().toString(36).substr(2, 9);

const estadoInicial = { idUsuario: "", idPlano: "", metodoPagamento: "" };

const metodos = [
  { value: "Cartão de Crédito", label: "💳 Cartão de Crédito" },
  { value: "Cartão de Débito", label: "💳 Cartão de Débito" },
  { value: "PIX", label: "⚡ PIX" },
  { value: "Boleto", label: "📄 Boleto" },
];

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<IPagamento[]>([]);
  const [planos, setPlanos] = useState<IPlano[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [assinaturas, setAssinaturas] = useState<IAssinatura[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [ultimaTransacao, setUltimaTransacao] = useState<IPagamento | null>(null);

  const carregarDados = async () => {
    const [p, pl, u, a] = await Promise.all([
      listarPagamentos(), listarPlanos(), listarUsuarios(), listarAssinaturas(),
    ]);
    setPagamentos(p);
    setPlanos(pl);
    setUsuarios(u);
    setAssinaturas(a);
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesUsuario = usuarios.map((u) => ({ value: u.id, label: u.nomeCompleto }));
  const opcoesPlano = planos.map((p) => ({
    value: p.id,
    label: `${p.nome} — R$ ${Number(p.preco).toFixed(2)} / ${p.duracaoMeses} mês(es)`,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const planoSelecionado = planos.find((p) => p.id === form.idPlano);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setUltimaTransacao(null);

    const validacao = validarCamposObrigatorios(form, ["idUsuario", "idPlano", "metodoPagamento"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    if (!planoSelecionado) return setErro("Plano inválido.");

    // 1. Cria a assinatura
    const dataInicio = new Date();
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + planoSelecionado.duracaoMeses);

    const novaAssinatura = await criarAssinatura({
      idUsuario: form.idUsuario,
      idPlano: form.idPlano,
      dataInicio: dataInicio.toLocaleDateString("pt-BR"),
      dataFim: dataFim.toLocaleDateString("pt-BR"),
    });

    // 2. Cria o pagamento vinculado à assinatura
    const novoPagamento = await criarPagamento({
      idAssinatura: novaAssinatura.id,
      valorPago: planoSelecionado.preco,
      metodoPagamento: form.metodoPagamento,
      idTransacaoGateway: "TXN-" + gerarId().toUpperCase(),
      dataPagamento: new Date().toLocaleDateString("pt-BR"),
    });

    setUltimaTransacao(novoPagamento);
    setForm(estadoInicial);
    setSucesso("Pagamento processado com sucesso!");
    carregarDados();
  };

  const colunas: Coluna<IPagamento>[] = [
    { key: "id", label: "ID Pagamento" },
    { key: "idTransacaoGateway", label: "ID Transação" },
    {
      key: "idAssinatura", label: "Assinante",
      render: (item) => {
        const ass = assinaturas.find((a) => a.id === item.idAssinatura);
        if (!ass) return "—";
        return usuarios.find((u) => u.id === ass.idUsuario)?.nomeCompleto ?? "—";
      },
    },
    {
      key: "valorPago", label: "Valor",
      render: (item) => `R$ ${Number(item.valorPago).toFixed(2)}`,
    },
    { key: "metodoPagamento", label: "Método" },
    { key: "dataPagamento", label: "Data" },
  ];

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Checkout — Assinatura e Pagamento</h2>

      {ultimaTransacao && (
        <div className="alert alert-success border-success mb-4">
          <h5 className="fw-bold">Pagamento Confirmado!</h5>
          <p className="mb-1"><strong>ID da Transação:</strong> {ultimaTransacao.idTransacaoGateway}</p>
          <p className="mb-1"><strong>Valor:</strong> R$ {Number(ultimaTransacao.valorPago).toFixed(2)}</p>
          <p className="mb-0"><strong>Método:</strong> {ultimaTransacao.metodoPagamento}</p>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Novo Checkout</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && !ultimaTransacao && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <FormField label="Usuário" name="idUsuario" type="select" value={form.idUsuario} onChange={handleChange} options={opcoesUsuario} required />
              </div>
              <div className="col-md-4">
                <FormField label="Plano" name="idPlano" type="select" value={form.idPlano} onChange={handleChange} options={opcoesPlano} required />
              </div>
              <div className="col-md-4">
                <FormField label="Método de Pagamento" name="metodoPagamento" type="select" value={form.metodoPagamento} onChange={handleChange} options={metodos} required />
              </div>
            </div>

            {planoSelecionado && (
              <div className="alert alert-warning">
                <strong>Resumo:</strong> Plano <strong>{planoSelecionado.nome}</strong> — R$ {Number(planoSelecionado.preco).toFixed(2)} por {planoSelecionado.duracaoMeses} mês(es).
                {planoSelecionado.descricao && ` ${planoSelecionado.descricao}`}
              </div>
            )}

            <button type="submit" className="btn btn-success fw-bold px-4">✅ Confirmar Pagamento</button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Histórico de Pagamentos ({pagamentos.length})
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={pagamentos} />
        </div>
      </div>
    </div>
  );
}
