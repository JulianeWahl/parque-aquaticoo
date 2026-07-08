<div align="center">

<img src="docs/screenshots/Parque.png" alt="Parque Aquático Olho D'Água" width="120" />

# 🌊 Parque Aquático Olho D'Água

### Sistema de Gestão Operacional

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> Sistema completo de PDV, controle de estoque, cozinha e relatórios  
> desenvolvido para o Parque Aquático Olho D'Água — Canoinhas/SC.  
> **Sistema ERP Web para Gestão de Parque Aquático — Engenharia de Software**

[Demonstração](#-demonstração) · [Funcionalidades](#-funcionalidades) · [Instalação](#-instalação) · [Tecnologias](#-tecnologias)

</div>

---

## 📸 Demonstração

|                Login                 |             Entrada — PDV              |                Lanchonete — PDV                |
| :----------------------------------: | :------------------------------------: | :--------------------------------------------: |
| ![Login](docs/screenshots/login.png) | ![Entrada](docs/screenshots/entry.png) | ![Lanchonete](docs/screenshots/restaurant.png) |

|                      Cozinha                       |                     Estoque                      |                      Relatórios                       |
| :------------------------------------------------: | :----------------------------------------------: | :---------------------------------------------------: |
| ![Cozinha](docs/screenshots/kitchenRestaurant.png) | ![Estoque](docs/screenshots/stockRestaurant.png) | ![Relatórios](docs/screenshots/reportsRestaurant.png) |

|                    Relatório Entrada                    |                     Funcionários Entrada                     |                       Funcionários Lanchonete                        |
| :-----------------------------------------------------: | :----------------------------------------------------------: | :------------------------------------------------------------------: |
| ![Relatório Entrada](docs/screenshots/reportsEntry.png) | ![Funcionários Entrada](docs/screenshots/employeesEntry.png) | ![Funcionários Lanchonete](docs/screenshots/employeesRestaurant.png) |

---

## ✨ Funcionalidades

### 🎟️ Módulo Entrada

- Venda de ingressos (Adulto, Criança, Menor de 5 anos)
- Aplicação de cupons de desconto
- Múltiplas formas de pagamento (PIX, Crédito, Débito, Dinheiro)
- Relatórios de vendas com filtro por período
- Dashboard de faturamento (somente pagamentos aprovados)

### 🍔 Módulo Lanchonete

- PDV com catálogo de produtos por categoria
- Validação de estoque em tempo real
- Carrinho de compras com controle de quantidade máxima
- Cupons de desconto
- Observações por item

### 👨‍🍳 Cozinha

- Painel de pedidos em tempo real (atualização automática a cada 20s)
- Apenas produtos com `precisaPreparo = true` aparecem na cozinha
- Ações: **Entregue** e **Cancelar** (com restauração automática de estoque)
- **Impressão automática** em impressora térmica Bluetooth 58mm via Web Bluetooth API

### 📦 Estoque

- Cadastro de produtos com categorias e marcas
- Autocomplete para nomes e marcas existentes
- Alertas de estoque baixo e sem estoque
- Reposição de estoque com histórico
- Soft delete (preserva histórico de vendas)

### 📊 Relatórios

- Vendas por dia / semana / mês / período personalizado
- Detalhamento por venda: cliente, itens, operador, forma de pagamento
- Breakdown de faturamento por forma de pagamento
- Status visual: Pago (verde) · Não Pago (vermelho) · Cancelado (vermelho)

### 🔐 Autenticação

- Login por módulo (ENTRADA ou LANCHONETE)
- Papéis: ADMIN e FUNCIONARIO
- JWT com proteção de rotas por módulo e papel

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Entrada │  │  Lanchonete  │  │ Admin / Relatórios  │ │
│  │  (azul)  │  │  (laranja)   │  │                    │ │
│  └──────────┘  └──────────────┘  └────────────────────┘ │
│                     Axios (REST)                         │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / JSON
┌────────────────────────▼────────────────────────────────┐
│                  BACKEND (Node.js + Express)              │
│   Routes → Middlewares → Controllers → Services → Prisma │
└────────────────────────┬────────────────────────────────┘
                         │ ORM
┌────────────────────────▼────────────────────────────────┐
│                    PostgreSQL                             │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de uma venda na Lanchonete

```
Operador seleciona produtos
  → Frontend valida estoque disponível
  → POST /restaurant-sales
  → Backend valida novamente + desconta estoque
  → Cria PedidoCozinha para itens com precisaPreparo=true
  → KitchenPanel detecta novo pedido (polling 20s)
  → Impressora térmica Bluetooth imprime ticket automaticamente
```

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia        | Versão | Uso                |
| ----------------- | ------ | ------------------ |
| React             | 18     | UI principal       |
| TypeScript        | 5      | Tipagem estática   |
| Vite              | 5      | Build / Dev server |
| TailwindCSS       | 3      | Estilização        |
| React Router      | 6      | Roteamento SPA     |
| Axios             | —      | Requisições HTTP   |
| Lucide React      | —      | Ícones             |
| Web Bluetooth API | nativa | Impressora térmica |

### Backend

| Tecnologia | Versão | Uso              |
| ---------- | ------ | ---------------- |
| Node.js    | 18+    | Runtime          |
| Express    | 4      | Framework web    |
| TypeScript | 5      | Tipagem estática |
| Prisma ORM | 5      | Acesso ao banco  |
| PostgreSQL | 15     | Banco de dados   |
| JWT        | —      | Autenticação     |

---

## 📁 Estrutura do Projeto

```
parque-aquatico/
├── frontend-parque/
│   ├── public/
│   │   ├── faviconParqueOriginal.png
│   │   ├── icon-entry.png
│   │   ├── icon-restaurant.png
│   │   └── parque-bg.jpg
│   └── src/
│       ├── api/
│       ├── components/ui/
│       ├── contexts/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── entry/
│       │   ├── restaurant/
│       │   └── admin/
│       ├── routes/
│       ├── types/
│       └── utils/
│           └── thermalPrinter.ts  # Driver Web Bluetooth ESC/POS
│
└── backend-parque/
    ├── prisma/
    │   └── schema.prisma
    └── src/
        ├── controllers/
        ├── services/
        ├── middlewares/
        ├── routes/
        └── lib/
            └── prisma.ts
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/parque-aquatico-olho-dagua.git
cd parque-aquatico-olho-dagua
```

### 2. Configure o Backend

```bash
cd backend-parque
npm install

# Crie o arquivo .env
cp .env.example .env
# Edite o .env com suas configurações:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/parque_db"
# JWT_SECRET="sua_chave_secreta_aqui"

# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
# Servidor rodando em http://localhost:3333
```

### 3. Configure o Frontend

```bash
cd ../frontend-parque
npm install

# Crie o arquivo .env
cp .env.example .env
# Edite:
# VITE_API_URL=http://localhost:3333

# Inicie o projeto
npm run dev
# Frontend rodando em http://localhost:5173
```

### 4. Crie o primeiro usuário admin

```bash
# No backend, use o Prisma Studio para criar o primeiro usuário:
cd backend-parque
npx prisma studio
# Ou via POST /usuarios (ver documentação das rotas)
```

Os ingressos padrão (Adulto, Criança, Menor de 5 anos) são criados  
**automaticamente** na primeira inicialização do servidor.

---

## 🖨️ Impressora Térmica Bluetooth

O sistema suporta impressão automática de tickets na cozinha via impressora Bluetooth 58mm.

**Requisitos:**

- Chrome ou Edge no tablet Android
- Impressora BLE com Nordic UART Service (Xprinter, GOOJPRT, MUNBYN, etc.)
- Impressora pareada com o tablet via configurações do Android

**Como usar:**

1. Acesse o módulo **Cozinha** no tablet
2. Clique em **"Conectar impressora"**
3. Selecione a impressora no seletor Bluetooth do Chrome
4. A partir daí, novos pedidos são impressos automaticamente

---

## 🌐 Deploy

| Serviço                        | Uso                    | Plano gratuito    |
| ------------------------------ | ---------------------- | ----------------- |
| [Vercel](https://vercel.com)   | Frontend               | ✅ Sim            |
| [Railway](https://railway.app) | Backend + PostgreSQL   | ✅ Sim (500h/mês) |
| [Render](https://render.com)   | Alternativa ao Railway | ✅ Sim            |

---

## 👨‍💻 Autor

**Juliane Rafaeli Wahl Rocha**  
Curso de Engenharia de Software
Faculdade UGV - Centro Universitário — União da Vitória/PR

[![GitHub](https://img.shields.io/badge/GitHub-JulianeWahl-181717?style=flat&logo=github)](https://github.com/JulianeWahl)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Juliane_Wahl-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/juliane-wahl/)

---

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).  
Todos os direitos reservados © 2026

---

<div align="center">
  Desenvolvido para o Parque Aquático Olho D'Água
</div>
