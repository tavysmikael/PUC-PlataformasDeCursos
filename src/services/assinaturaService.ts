import { IAssinatura } from "../models/types";
import { getAll, create, remove } from "./api";

const ENTIDADE = "assinaturas";

export const listarAssinaturas = () => getAll<IAssinatura>(ENTIDADE);
export const criarAssinatura = (dados: Omit<IAssinatura, "id">) => create<IAssinatura>(ENTIDADE, dados);
export const removerAssinatura = (id: string) => remove(ENTIDADE, id);
