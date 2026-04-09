# 🚀 HireNow - Portal de Recrutamento & Seleção

Este projeto foi desenvolvido focado em criar uma solução eficiente para o recebimento de candidaturas e um dashboard administrativo para gestão de talentos.

O sistema utiliza **Bun** como runtime de alto desempenho, **React** no frontend e um backend orquestrado que se integra ao **n8n** para automação de processos.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, Tailwind CSS, React Hook Form, Zod (Validação), Recharts (Dashboard).
- **Backend:** Bun.serve (API Nativa), PostgreSQL (Persistence).
- **Stack de Modernização:**
  - **Clean Architecture:** Separação clara entre UI, Hooks (Lógica) e Services (Dados).
  - **Inversão de Dependência:** Componentes não conhecem a implementação do fetch.
- **Automação:** Integração com Webhooks n8n para orquestração de currículos.

## 🏗️ Arquitetura do Projeto (Racional)

Durante o desenvolvimento, priorizei a **manutenibilidade** e a **escalabilidade**:

### 1. Separação de Responsabilidades (SOC)
- **`src/components`**: Componentes puramente visuais (Presentational Components).
- **`src/hooks`**: Encapsulamento de lógica complexa (Stateful Logic). Ex: O dashboard não sabe como filtrar candidatos, ele apenas consome o hook `useAdminDashboard`.
- **`src/services`**: Camada de infraestrutura que isola as chamadas de API do restante da aplicação.
- **`src/schemas`**: Validação de contrato de dados única e centralizada com Zod.

### 2. Backend Performante
- O servidor em **Bun** foi modularizado em rotas separadas para evitar o "Big Ball of Mud".
- Implementação de tratamento de erros robusto e validação de `FormData` para garantir integridade no upload de arquivos.

## 🚀 Como Executar

### Pré-requisitos
- [Bun](https://bun.sh) instalado.
- Teórica conexão com PostgreSQL (configurável via variáveis de ambiente).

### Passos
1. **Instalar dependências:**
   ```bash
   bun install
   ```
2. **Construir o frontend (Build):**
   ```bash
   bun run build
   ```
3. **Iniciar o servidor:**
   ```bash
   bun run server.ts
   ```

## 📊 Funcionalidades
- ✅ **Formulário de Candidatura:** Com validação em tempo real e upload de currículo (PDF/Word).
- ✅ **Dashboard Admin:** Gráficos de distribuição de status reativos.
- ✅ **Filtros Inteligentes:** Filtragem por nível de inglês.
- ✅ **Persistência:** Atualização de status do candidato diretamente no banco de dados.

---
*Desenvolvido com foco em qualidade de código, padrões de projeto e performance.*
