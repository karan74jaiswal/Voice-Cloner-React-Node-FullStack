export function Button({
  className = "",
  disabled = false,
  onClick,
  children,
  visibility = "visible",
}) {
  return (
    <button
      className={`btn ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={{ opacity: `${disabled ? 0.3 : 1}`, visibility }}
    >
      {children}
    </button>
  );
}
