import { IPagamento } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "pagamentos";

export const listarPagamentos = () => getAll<IPagamento>(ENTIDADE);
export const criarPagamento = (dados: Omit<IPagamento, "id">) => create<IPagamento>(ENTIDADE, dados);
export const removerPagamento = (id: string) => remove(ENTIDADE, id);
