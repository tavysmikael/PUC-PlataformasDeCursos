import { useState, useEffect } from "react";
import { IUsuario } from "../../models/types";
import { listarUsuarios, criarUsuario, removerUsuario } from "../../services/usuarioService";
import DataTable from "../../components/ui/DataTable";
import FormField from "../../components/ui/FormField";
import { validarEmail, validarCamposObrigatorios } from "../../utils/validators";
import { Coluna } from "../../components/ui/DataTable";

const estadoInicial = { nomeCompleto: "", email: "", senhaHash: "" };

const colunas: Coluna<IUsuario>[] = [
  { key: "id", label: "ID" },
  { key: "nomeCompleto", label: "Nome Completo" },
  { key: "email", label: "E-mail" },
  { key: "dataCadastro", label: "Data de Cadastro" },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarDados = async () => {
    const data = await listarUsuarios();
    setUsuarios(data);
  };

  useEffect(() => { carregarDados(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const validacao = validarCamposObrigatorios(form, ["nomeCompleto", "email", "senhaHash"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    if (!validarEmail(form.email)) return setErro("E-mail inválido.");

    const emailJaExiste = usuarios.some((u) => u.email === form.email);
    if (emailJaExiste) return setErro("Este e-mail já está cadastrado.");

    await criarUsuario({
      ...form,
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
    });
    setForm(estadoInicial);
    setSucesso("Usuário cadastrado com sucesso!");
    carregarDados();
  };

  const handleRemover = async (id: string) => {
    await removerUsuario(id);
    carregarDados();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Gestão de Usuários</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Novo Usuário</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}
          {sucesso && <div className="alert alert-success">{sucesso}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <FormField label="Nome Completo" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} placeholder="Ex: João Silva" required />
              </div>
              <div className="col-md-4">
                <FormField label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ex: joao@email.com" required />
              </div>
              <div className="col-md-4">
                <FormField label="Senha" name="senhaHash" type="password" value={form.senhaHash} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
              </div>
            </div>
            <button type="submit" className="btn btn-warning fw-bold">➕ Cadastrar Usuário</button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Usuários Cadastrados ({usuarios.length})
        </div>
        <div className="card-body">
          <DataTable colunas={colunas} dados={usuarios} onRemover={handleRemover} />
        </div>
      </div>
    </div>
  );
}
