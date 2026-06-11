export interface IUsuario {
  id: string;
  nomeCompleto: string;
  email: string;
  senhaHash: string;
  dataCadastro: string;
}

export interface ICategoria {
  id: string;
  nome: string;
  descricao: string;
}

export interface ICurso {
  id: string;
  titulo: string;
  descricao: string;
  idInstrutor: string;
  idCategoria: string;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}

export interface IModulo {
  id: string;
  idCurso: string;
  titulo: string;
  ordem: number;
}

export interface IAula {
  id: string;
  idModulo: string;
  titulo: string;
  tipoConteudo: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

export interface IMatricula {
  id: string;
  idUsuario: string;
  idCurso: string;
  dataMatricula: string;
  dataConclusao: string | null;
}

export interface IProgressoAula {
  id: string;
  idUsuario: string;
  idAula: string;
  dataConclusao: string;
  status: string;
}

export interface IAvaliacao {
  id: string;
  idUsuario: string;
  idCurso: string;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string;
}


export interface ITrilha {
  id: string;
  titulo: string;
  descricao: string;
  idCategoria: string;
}

export interface ITrilhaCurso {
  id: string;
  idTrilha: string;
  idCurso: string;
  ordem: number;
}

export interface ICertificado {
  id: string;
  idUsuario: string;
  idCurso: string;
  idTrilha: string | null;
  codigoVerificacao: string;
  dataEmissao: string;
}


export interface IPlano {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
}

export interface IAssinatura {
  id: string;
  idUsuario: string;
  idPlano: string;
  dataInicio: string;
  dataFim: string;
}

export interface IPagamento {
  id: string;
  idAssinatura: string;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}
