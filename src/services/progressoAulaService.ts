import { IProgressoAula } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "progressoAulas";

export const listarProgressoAulas = () => getAll<IProgressoAula>(ENTIDADE);
export const criarProgressoAula = (dados: Omit<IProgressoAula, "id">) => create<IProgressoAula>(ENTIDADE, dados);
export const removerProgressoAula = (id: string) => remove(ENTIDADE, id);
