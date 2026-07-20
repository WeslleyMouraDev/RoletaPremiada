/**
 * Normaliza o nome do consultor:
 * 1. Remove acentos (diacríticos).
 * 2. Remove caracteres especiais (mantém apenas letras, números e espaços).
 * 3. Normaliza espaços (remove duplos/múltiplos espaços e faz trim).
 * 4. Formata cada palavra com a primeira letra maiúscula e o restante minúscula (Title Case).
 *
 * Exemplo: "joão d'ávila!" -> "Joao Davila"
 * Exemplo: "FERNANDO MOURA" -> "Fernando Moura"
 * Exemplo: "  maria-josé  " -> "Maria Jose"
 */
export function normalizeConsultantName(name: string): string {
  if (!name) return '';

  // 1. Remove acentos e diacríticos
  const withoutAccents = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 2. Remove caracteres especiais (mantém letras, números e espaços)
  const cleanChars = withoutAccents.replace(/[^a-zA-Z0-9\s]/g, '');

  // 3. Normaliza espaços múltiplos e faz trim
  const cleanSpaces = cleanChars.replace(/\s+/g, ' ').trim();

  if (!cleanSpaces) return '';

  // 4. Formata com a primeira letra de cada palavra maiúscula (Title Case)
  return cleanSpaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
