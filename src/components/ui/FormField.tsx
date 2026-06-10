import React from "react";

export interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  options?: Option[];
  placeholder?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  options,
  placeholder,
}: FormFieldProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      {type === "select" ? (
        <select
          className="form-select"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Selecione...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className="form-control"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
