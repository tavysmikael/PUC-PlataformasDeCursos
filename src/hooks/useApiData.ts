import { useState, useEffect, useCallback } from "react";

/**
 * Hook customizado para carregar dados da API com tratamento de erros.
 * Retorna { dados, carregando, erroApi, recarregar }.
 */
export function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErroApi("");
    try {
      const resultado = await fetcher();
      setDados(resultado);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido ao carregar dados.";
      setErroApi(msg);
      console.error("Erro ao carregar dados:", error);
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { dados, carregando, erroApi, recarregar: carregar };
}
