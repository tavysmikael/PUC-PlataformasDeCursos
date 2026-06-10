import { IModulo } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "modulos";

export const listarModulos = () => getAll<IModulo>(ENTIDADE);
export const buscarModulo = (id: string) => getById<IModulo>(ENTIDADE, id);
export const criarModulo = (dados: Omit<IModulo, "id">) => create<IModulo>(ENTIDADE, dados);
export const removerModulo = (id: string) => remove(ENTIDADE, id);
