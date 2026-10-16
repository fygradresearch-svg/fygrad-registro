import { whatsappUrl } from "@/lib/site";

function WhatsAppIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" width="29" height="29" fill="currentColor">
    <path d="M16.03 2.5a13.37 13.37 0 0 0-11.6 20.04L2.5 29.5l7.15-1.87a13.45 13.45 0 0 0 6.38 1.62h.01A13.38 13.38 0 0 0 16.03 2.5Zm0 24.48a11.16 11.16 0 0 1-5.68-1.56l-.41-.24-4.25 1.11 1.13-4.14-.27-.43a11.12 11.12 0 1 1 9.48 5.26Zm6.1-8.36c-.33-.17-1.98-.98-2.29-1.1-.3-.11-.52-.16-.74.17-.22.33-.85 1.1-1.04 1.32-.19.22-.39.25-.72.08-.33-.17-1.4-.52-2.66-1.64-.98-.88-1.65-1.97-1.84-2.3-.19-.33-.02-.5.15-.67.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.05-.41-.03-.58-.08-.17-.74-1.78-1.02-2.44-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.16 1.35 3.38c.17.22 2.33 3.56 5.66 4.98.79.34 1.4.54 1.88.69.79.25 1.52.21 2.09.13.64-.1 1.98-.81 2.25-1.59.28-.78.28-1.45.2-1.59-.08-.14-.3-.22-.63-.39Z"/>
  </svg>;
}

export function WhatsAppFloating() {
  return <a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noopener noreferrer"
    aria-label="Consultar a FyGrad por WhatsApp, abre en una nueva pestaña">
    <span className="whatsapp-tooltip" aria-hidden="true">¿Necesitas orientación? Escríbenos</span>
    <span className="whatsapp-icon"><WhatsAppIcon/></span>
  </a>;
}
