export function validateUrl(input: string): { valid: boolean; url?: string; error?: string } {
  let url = input.trim();

  if (!url) {
    return { valid: false, error: 'Por favor, introduce una URL' };
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        valid: false,
        error: 'La URL no parece válida. Incluye el dominio completo (ej: ejemplo.com)',
      };
    }

    return { valid: true, url: parsed.toString() };
  } catch {
    return { valid: false, error: 'La URL no tiene un formato válido' };
  }
}
