import { IAula } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "aulas";

export const listarAulas = () => getAll<IAula>(ENTIDADE);
export const buscarAula = (id: string) => getById<IAula>(ENTIDADE, id);
export const criarAula = (dados: Omit<IAula, "id">) => create<IAula>(ENTIDADE, dados);
export const removerAula = (id: string) => remove(ENTIDADE, id);
