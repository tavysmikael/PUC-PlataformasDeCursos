import { ICertificado } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "certificados";

export const listarCertificados = () => getAll<ICertificado>(ENTIDADE);
export const criarCertificado = (dados: Omit<ICertificado, "id">) => create<ICertificado>(ENTIDADE, dados);
export const removerCertificado = (id: string) => remove(ENTIDADE, id);
