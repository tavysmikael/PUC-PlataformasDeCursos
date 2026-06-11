const BASE_URL = "http://localhost:3001";

// Função auxiliar para lidar com erros de fetch (inclui conexão recusada)
async function fetchComErro(url: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
    }
    return res;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        "Não foi possível conectar ao servidor. Certifique-se de que o JSON Server está rodando na porta 3001.\n\nExecute: npm run dev:all"
      );
    }
    throw error;
  }
}

// Função genérica para buscar todos os registros de uma entidade
export async function getAll<T>(entidade: string): Promise<T[]> {
  const res = await fetchComErro(`${BASE_URL}/${entidade}`);
  return res.json();
}

// Função genérica para buscar um registro por ID
export async function getById<T>(entidade: string, id: string): Promise<T> {
  const res = await fetchComErro(`${BASE_URL}/${entidade}/${id}`);
  return res.json();
}

// Função genérica para criar um novo registro
export async function create<T>(entidade: string, dados: Omit<T, "id">): Promise<T> {
  const res = await fetchComErro(`${BASE_URL}/${entidade}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
}

// Função genérica para atualizar um registro
export async function update<T>(entidade: string, id: string, dados: Partial<T>): Promise<T> {
  const res = await fetchComErro(`${BASE_URL}/${entidade}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return res.json();
}

// Função genérica para remover um registro
export async function remove(entidade: string, id: string): Promise<void> {
  await fetchComErro(`${BASE_URL}/${entidade}/${id}`, {
    method: "DELETE",
  });
}
