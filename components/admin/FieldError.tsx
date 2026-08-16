/** Inline validation message under a form field. Renders nothing when there's no error, so callers can pass it unconditionally. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}
