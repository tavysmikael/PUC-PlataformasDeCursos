import { ITrilha } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "trilhas";

export const listarTrilhas = () => getAll<ITrilha>(ENTIDADE);
export const buscarTrilha = (id: string) => getById<ITrilha>(ENTIDADE, id);
export const criarTrilha = (dados: Omit<ITrilha, "id">) => create<ITrilha>(ENTIDADE, dados);
export const removerTrilha = (id: string) => remove(ENTIDADE, id);
