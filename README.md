# 🚀 API Pay - Gateway de Pagamentos

## 📋 Visão Geral
Gateway de pagamentos que integra com múltiplos provedores externos, oferecendo:
- Processamento de pagamentos com fallback automático
- Sistema de reembolsos
- Armazenamento de transações

## 🛠 Pré-requisitos
- [Node.js 20.0.0 ou superior](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- npm ou yarn

## ⚙️ Configuração do Ambiente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/BrunodePaula/api-pay.git
   cd api-pay
2. **Instale as dependências:**:
   ```bash
   npm install
3. **Configure as variáveis de ambiente:**
    Crie um arquivo .env na raiz do projeto com:
   ```bash
    PORT=3000
    PROVIDER1_API_URL=http://localhost:4000
    PROVIDER2_API_URL=http://localhost:4000
    DATABASE_URL="postgresql://user:password@127.0.0.1:5433/database?schema=public"
4. **Configure as variáveis de ambiente:**
Modo desenvolvimento (com hot-reload):
     ```bash
        npm run dev
5. **Executar testes:**
     ```bash
        npm run test