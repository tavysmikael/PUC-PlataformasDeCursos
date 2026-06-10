import { IAvaliacao } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "avaliacoes";

export const listarAvaliacoes = () => getAll<IAvaliacao>(ENTIDADE);
export const criarAvaliacao = (dados: Omit<IAvaliacao, "id">) => create<IAvaliacao>(ENTIDADE, dados);
export const removerAvaliacao = (id: string) => remove(ENTIDADE, id);
