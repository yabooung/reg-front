import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${error ? 'has-error' : ''} ${className}`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="input"
        {...props}
      />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input; 