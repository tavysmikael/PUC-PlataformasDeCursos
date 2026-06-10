import { ITrilhaCurso } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "trilhasCursos";

export const listarTrilhasCursos = () => getAll<ITrilhaCurso>(ENTIDADE);
export const criarTrilhaCurso = (dados: Omit<ITrilhaCurso, "id">) => create<ITrilhaCurso>(ENTIDADE, dados);
export const removerTrilhaCurso = (id: string) => remove(ENTIDADE, id);
