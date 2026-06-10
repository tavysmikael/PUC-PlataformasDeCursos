import { IUsuario } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "usuarios";

export const listarUsuarios = () => getAll<IUsuario>(ENTIDADE);
export const buscarUsuario = (id: string) => getById<IUsuario>(ENTIDADE, id);
export const criarUsuario = (dados: Omit<IUsuario, "id">) => create<IUsuario>(ENTIDADE, dados);
export const removerUsuario = (id: string) => remove(ENTIDADE, id);
