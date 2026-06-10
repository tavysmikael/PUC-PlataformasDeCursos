const BASE_URL = "http://localhost:3001";

// Função genérica para buscar todos os registros de uma entidade
export async function getAll<T>(entidade: string): Promise<T[]> {
  const res = await fetch(`${BASE_URL}/${entidade}`);
  if (!res.ok) throw new Error(`Erro ao buscar ${entidade}`);
  return res.json();
}

// Função genérica para buscar um registro por ID
export async function getById<T>(entidade: string, id: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${entidade}/${id}`);
  if (!res.ok) throw new Error(`Erro ao buscar ${entidade}/${id}`);
  return res.json();
}

// Função genérica para criar um novo registro
export async function create<T>(entidade: string, dados: Omit<T, "id">): Promise<T> {
  const res = await fetch(`${BASE_URL}/${entidade}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(`Erro ao criar ${entidade}`);
  return res.json();
}

// Função genérica para atualizar um registro
export async function update<T>(entidade: string, id: string, dados: Partial<T>): Promise<T> {
  const res = await fetch(`${BASE_URL}/${entidade}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(`Erro ao atualizar ${entidade}/${id}`);
  return res.json();
}

// Função genérica para remover um registro
export async function remove(entidade: string, id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${entidade}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Erro ao remover ${entidade}/${id}`);
}
