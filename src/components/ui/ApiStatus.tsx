interface ApiStatusProps {
  carregando: boolean;
  erroApi: string;
  recarregar: () => void;
}

export default function ApiStatus({ carregando, erroApi, recarregar }: ApiStatusProps) {
  if (carregando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-muted mt-2">Carregando dados...</p>
      </div>
    );
  }

  if (erroApi) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">⚠️ Erro de Conexão</h5>
        <p>{erroApi}</p>
        <hr />
        <p className="mb-0">
          Execute <code>npm run dev:all</code> para iniciar o front-end e o JSON Server juntos.
        </p>
        <button className="btn btn-outline-danger btn-sm mt-2" onClick={recarregar}>
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  return null;
}
