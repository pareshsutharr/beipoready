"use client";

import { useState } from "react";
import { inputClass, labelClass } from "@/components/admin/cms/FormControls";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function ImageUploadField({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        name={name}
        type="file"
        accept="image/*"
        required={required}
        className={inputClass}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file && file.size > MAX_UPLOAD_BYTES) {
            event.target.value = "";
            setError(`That file is ${(file.size / (1024 * 1024)).toFixed(1)}MB — please choose one under 8MB.`);
          } else {
            setError(null);
          }
        }}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
