import { useState, useEffect } from "react";
import { ICertificado, IUsuario, ICurso, ITrilha } from "../../models/types";
import { listarCertificados, criarCertificado } from "../../services/certificadoService";
import { listarUsuarios } from "../../services/usuarioService";
import { listarCursos } from "../../services/cursoService";
import { listarTrilhas } from "../../services/trilhaService";
import FormField from "../../components/ui/FormField";
import { validarCamposObrigatorios } from "../../utils/validators";

// Gera ID aleatório para código de verificação
const gerarId = () => Math.random().toString(36).substr(2, 9);

export default function Certificados() {
  const [certificados, setCertificados] = useState<ICertificado[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  const [form, setForm] = useState({ idUsuario: "", idCurso: "", idTrilha: "" });
  const [erro, setErro] = useState("");
  const [certGerado, setCertGerado] = useState<ICertificado | null>(null);

  const carregarDados = async () => {
    const [cert, u, c, t] = await Promise.all([
      listarCertificados(), listarUsuarios(), listarCursos(), listarTrilhas(),
    ]);
    setCertificados(cert);
    setUsuarios(u);
    setCursos(c);
    setTrilhas(t);
  };

  useEffect(() => { carregarDados(); }, []);

  const opcoesUsuario = usuarios.map((u) => ({ value: u.id, label: u.nomeCompleto }));
  const opcoesCurso = cursos.map((c) => ({ value: c.id, label: c.titulo }));
  const opcoesTrilha = [
    { value: "", label: "Nenhuma (certificado de curso)" },
    ...trilhas.map((t) => ({ value: t.id, label: t.titulo })),
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCertGerado(null);

    const validacao = validarCamposObrigatorios(form, ["idUsuario", "idCurso"]);
    if (!validacao.valido) return setErro(validacao.mensagem!);

    const jaExiste = certificados.some(
      (c) => c.idUsuario === form.idUsuario && c.idCurso === form.idCurso
    );
    if (jaExiste) return setErro("Este usuário já possui certificado para este curso.");

    const novoCert = await criarCertificado({
      idUsuario: form.idUsuario,
      idCurso: form.idCurso,
      idTrilha: form.idTrilha || null,
      codigoVerificacao: "CERT-" + gerarId().toUpperCase(),
      dataEmissao: new Date().toLocaleDateString("pt-BR"),
    });

    setCertGerado(novoCert);
    setForm({ idUsuario: "", idCurso: "", idTrilha: "" });
    carregarDados();
  };

  const resolverNome = <T extends { id: string }>(lista: T[], id: string, campo: keyof T) =>
    (lista.find((i) => i.id === id)?.[campo] as string) ?? "—";

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Emissão de Certificados</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-semibold">Emitir Novo Certificado</div>
        <div className="card-body">
          {erro && <div className="alert alert-danger">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <FormField label="Aluno" name="idUsuario" type="select" value={form.idUsuario} onChange={handleChange} options={opcoesUsuario} required />
              </div>
              <div className="col-md-4">
                <FormField label="Curso Concluído" name="idCurso" type="select" value={form.idCurso} onChange={handleChange} options={opcoesCurso} required />
              </div>
              <div className="col-md-4">
                <FormField label="Trilha (opcional)" name="idTrilha" type="select" value={form.idTrilha} onChange={handleChange} options={opcoesTrilha} />
              </div>
            </div>
            <button type="submit" className="btn btn-warning fw-bold">Emitir Certificado</button>
          </form>
        </div>
      </div>

      {certGerado && (
        <div
          className="card border-warning shadow-lg mb-4 text-center p-4"
          style={{ background: "linear-gradient(135deg, #fffbe6, #fff8d6)", borderWidth: 3 }}
        >
          <div style={{ borderBottom: "2px solid #ffc107" }} className="pb-3 mb-3">
            <h1 className="fw-bold text-warning" style={{ fontSize: "2rem" }}>🎓 EduPlataforma</h1>
            <p className="text-muted mb-0">Certificado de Conclusão</p>
          </div>
          <p className="fs-5 text-muted mb-1">Certificamos que</p>
          <h2 className="fw-bold text-dark mb-1">
            {resolverNome(usuarios, certGerado.idUsuario, "nomeCompleto")}
          </h2>
          <p className="fs-5 text-muted mb-1">concluiu com êxito o curso</p>
          <h3 className="fw-bold text-warning mb-1">
            {resolverNome(cursos, certGerado.idCurso, "titulo")}
          </h3>
          {certGerado.idTrilha && (
            <p className="text-muted">
              como parte da Trilha: <strong>{resolverNome(trilhas, certGerado.idTrilha, "titulo")}</strong>
            </p>
          )}
          <div className="mt-4 pt-3" style={{ borderTop: "2px solid #ffc107" }}>
            <p className="mb-1 text-muted">Emitido em: <strong>{certGerado.dataEmissao}</strong></p>
            <p className="mb-0">
              Código de Verificação: <span className="badge bg-dark fs-6 px-3 py-2">{certGerado.codigoVerificacao}</span>
            </p>
          </div>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-semibold">
          Certificados Emitidos ({certificados.length})
        </div>
        <div className="card-body">
          {certificados.length === 0 ? (
            <div className="alert alert-info text-center">Nenhum certificado emitido ainda.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Aluno</th>
                    <th>Curso</th>
                    <th>Trilha</th>
                    <th>Código</th>
                    <th>Emitido em</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.map((cert) => (
                    <tr key={cert.id}>
                      <td>{resolverNome(usuarios, cert.idUsuario, "nomeCompleto")}</td>
                      <td>{resolverNome(cursos, cert.idCurso, "titulo")}</td>
                      <td>{cert.idTrilha ? resolverNome(trilhas, cert.idTrilha, "titulo") : "—"}</td>
                      <td><span className="badge bg-dark">{cert.codigoVerificacao}</span></td>
                      <td>{cert.dataEmissao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
