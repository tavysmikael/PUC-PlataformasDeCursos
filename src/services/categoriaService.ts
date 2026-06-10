import { ICategoria } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "categorias";

export const listarCategorias = () => getAll<ICategoria>(ENTIDADE);
export const buscarCategoria = (id: string) => getById<ICategoria>(ENTIDADE, id);
export const criarCategoria = (dados: Omit<ICategoria, "id">) => create<ICategoria>(ENTIDADE, dados);
export const removerCategoria = (id: string) => remove(ENTIDADE, id);
