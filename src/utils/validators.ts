export const validarEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validarCamposObrigatorios = (
  dados: Record<string, unknown>,
  campos: string[]
): { valido: boolean; mensagem?: string } => {
  for (const campo of campos) {
    if (!dados[campo] || dados[campo]!.toString().trim() === "") {
      return { valido: false, mensagem: `O campo "${campo}" é obrigatório.` };
    }
  }
  return { valido: true };
};
