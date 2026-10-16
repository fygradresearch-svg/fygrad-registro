export const WHATSAPP_NUMBER = "51993963190";
export const WHATSAPP_MESSAGE =
  "¡Hola, equipo FyGrad! 👋💙 Me interesa conocer sus servicios académicos y las alternativas de pago disponibles. ¿Podrían brindarme información y ayudarme a encontrar la mejor opción para mi proyecto? ¡Muchas gracias!";

export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const privacyEmail = process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() ?? "";
