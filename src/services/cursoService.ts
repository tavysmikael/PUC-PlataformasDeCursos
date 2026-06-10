import { ICurso } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "cursos";

export const listarCursos = () => getAll<ICurso>(ENTIDADE);
export const buscarCurso = (id: string) => getById<ICurso>(ENTIDADE, id);
export const criarCurso = (dados: Omit<ICurso, "id">) => create<ICurso>(ENTIDADE, dados);
export const removerCurso = (id: string) => remove(ENTIDADE, id);
