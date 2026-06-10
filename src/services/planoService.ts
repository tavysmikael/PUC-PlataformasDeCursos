import { IPlano } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "planos";

export const listarPlanos = () => getAll<IPlano>(ENTIDADE);
export const buscarPlano = (id: string) => getById<IPlano>(ENTIDADE, id);
export const criarPlano = (dados: Omit<IPlano, "id">) => create<IPlano>(ENTIDADE, dados);
export const removerPlano = (id: string) => remove(ENTIDADE, id);
