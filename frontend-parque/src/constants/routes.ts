export const SYSTEM_NAME = "Parque Aquático Olho D'Água";
export const SYSTEM_SHORT = "Olho D'Água";

export const ROUTES = {
  LOGIN: "/login",
  ENTRADA: {
    ROOT: "/entrada",
    RELATORIOS: "/entrada/relatorios",
    PAGAMENTO: "/entrada/pagamento",
  },
  LANCHONETE: {
    ROOT: "/lanchonete",
    ESTOQUE: "/lanchonete/estoque",
    COZINHA: "/lanchonete/cozinha",
    RELATORIOS: "/lanchonete/relatorios",
    PAGAMENTO: "/lanchonete/pagamento",
  },
} as const;
