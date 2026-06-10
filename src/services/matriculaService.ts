import { IMatricula } from "../models/types";
import { getAll, getById, create, remove } from "./api";

const ENTIDADE = "matriculas";

export const listarMatriculas = () => getAll<IMatricula>(ENTIDADE);
export const buscarMatricula = (id: string) => getById<IMatricula>(ENTIDADE, id);
export const criarMatricula = (dados: Omit<IMatricula, "id">) => create<IMatricula>(ENTIDADE, dados);
export const removerMatricula = (id: string) => remove(ENTIDADE, id);
