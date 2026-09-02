'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  label?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Your password',
  required = true,
  autoComplete,
  label = 'Password',
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="dl-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="dl-input pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-2 transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
