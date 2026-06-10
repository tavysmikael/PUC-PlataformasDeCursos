import React from "react";

export interface Coluna<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  colunas: Coluna<T>[];
  dados: T[];
  onRemover?: (id: string) => void;
}

export default function DataTable<T extends { id: string }>({
  colunas,
  dados,
  onRemover,
}: DataTableProps<T>) {
  if (dados.length === 0) {
    return (
      <div className="alert alert-info text-center">
        Nenhum registro encontrado. Cadastre um novo item acima.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            {colunas.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {onRemover && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id}>
              {colunas.map((col) => (
                <td key={col.key}>
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
              {onRemover && (
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemover(item.id)}
                  >
                    🗑️ Remover
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
