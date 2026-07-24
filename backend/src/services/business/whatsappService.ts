export function gerarLinkWhatsApp(numero: string): string {
  return `https://wa.me/55${numero.replace(/\D/g, '')}`;
}