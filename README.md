# LIBRASCity

## 📖 Descrição

O LIBRASCity é uma plataforma acadêmica voltada para promover inclusão, acessibilidade e comunicação entre a comunidade surda, intérpretes de Libras e gestores públicos. O backend da aplicação foi implementado com Node.js, Express e TypeScript e integra autenticação, geolocalização, avaliações e fluxos de atendimento para apoiar a comunidade surda de forma prática e acessível.

A API permite:
- cadastro e autenticação de usuários com JWT;
- registro e consulta de estabelecimentos;
- avaliações de atendimento;
- solicitações de atendimento emergencial;
- onboarding de intérpretes/voluntários;
- dashboards administrativos com dados de acessibilidade.

## 🛠️ Tecnologias

- Node.js + Express
- TypeScript
- MongoDB
- PostgreSQL
- Redis
- JWT
- Multer

## 👥 Equipe

- José Antonio
- Wendell
- Francieverton
- João Victor

## ⚙️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Bancos-de-Dados-II/projeto-final-librascity.git
cd projeto-final-librascity
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=
POSTGRES_URI=
REDIS_URL=
JWT_SECRET=
```

> Para gerar um valor seguro de `JWT_SECRET`, execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Execute a API

Modo de desenvolvimento:

```bash
npm run dev
```

Modo de produção:

```bash
npm run build
npm start
```

## 🔐 Autenticação

A maioria das rotas protegidas exige um token JWT no header `Authorization`.

Formato esperado:

```http
Authorization: Bearer <token>
```

O token é gerado pelo endpoint `/login` e precisa ser enviado nas requisições protegidas.
