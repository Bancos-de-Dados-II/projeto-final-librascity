# Documentação API

## 📌 Endpoints da API

### Visão geral

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastro de usuário |
| POST | `/login` | Login e geração de token JWT |
| GET | `/perfil` | Dados do usuário autenticado |
| PUT | `/logout` | Logout do usuário |
| POST | `/uploads/media` | Upload de imagem |
| POST | `/estabelecimentos` | Criar estabelecimento |
| GET | `/estabelecimentos/proximos` | Buscar estabelecimentos por proximidade |
| GET | `/estabelecimentos/:id` | Obter estabelecimento por ID |
| PUT | `/estabelecimentos/:id` | Atualizar estabelecimento |
| DELETE | `/estabelecimentos/:id` | Remover estabelecimento |
| POST | `/places/reviews` | Avaliar estabelecimento |
| GET | `/places/reviews` | Listar avaliações com filtros |
| GET | `/places/reviews/:id` | Obter detalhe da avaliação |
| PUT | `/places/reviews/:id` | Atualizar avaliação (autor ou admin) |
| DELETE | `/places/reviews/:id` | Remover avaliação |
| POST | `/calls/request` | Solicitar atendimento de emergência |
| GET | `/calls` | Listar chamadas do usuário autenticado |
| GET | `/calls/admin` | Listar todas as chamadas (admin) |
| GET | `/calls/:id/status` | Verificar status da chamada |
| GET | `/calls/pending` | Listar chamadas pendentes |
| PUT | `/calls/:id/accept` | Aceitar chamada |
| PUT | `/calls/:id/complete` | Finalizar chamada |
| DELETE | `/calls/:id` | Cancelar chamada pendente |
| POST | `/interpreter/onboarding` | Cadastrar intérprete/voluntário |
| GET | `/interpreter` | Listar voluntários (admin) |
| GET | `/interpreter/:id` | Obter voluntário (admin) |
| PUT | `/interpreter/:id` | Atualizar voluntário (admin) |
| DELETE | `/interpreter/:id` | Remover voluntário (admin) |
| PUT | `/interpreter/status` | Atualizar status online/offline |
| GET | `/admin/usuarios` | Listar usuários (admin) |
| GET | `/admin/usuarios/:id` | Obter usuário por ID (admin) |
| PUT | `/admin/usuarios/:id` | Atualizar usuário (admin) |
| DELETE | `/admin/usuarios/:id` | Remover usuário (admin) |
| PUT | `/users/:id/location` | Atualizar localização do usuário |
| GET | `/admin/dashboards/accessibility-heatmap` | Dashboard de mapa de calor |
| GET | `/admin/dashboards/critical-locations` | Locais críticos |
| GET | `/notificacao/recebidas/:id` | Notificações recebidas |
| GET | `/notificacao/enviadas/:id` | Notificações enviadas |

---

### Autenticação

#### POST `/register`

**Descrição:** Cadastra um novo usuário no sistema.

**Autenticação:** Não

**Body (JSON):**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "83999999999",
  "tipoUsuario": "SURDO",
  "fotoPerfilUrl": "https://exemplo.com/foto.jpg"
}
```

**Resposta (`201 Created`):**

```json
{
  "mensagem": "Usuário criado com sucesso!",
  "id": "67b2c8d4e1a2b3c4d5e6f7a8"
}
```

**Erros comuns:**
- `400` – payload inválido
- `409` – email já cadastrado
- `500` – erro interno

#### POST `/login`

**Descrição:** Faz login e retorna o token JWT.

**Autenticação:** Não

**Body (JSON):**

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta (`200 OK`):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "67b2c8d4e1a2b3c4d5e6f7a8",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipoUsuario": "SURDO",
    "status": "ATIVO"
  }
}
```

**Erros comuns:**
- `400` – campos obrigatórios ausentes
- `401` – credenciais inválidas

#### GET `/perfil`

**Descrição:** Retorna os dados do usuário autenticado.

**Autenticação:** Sim

**Headers:**

```http
Authorization: Bearer <token>
```

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "83999999999",
  "tipoUsuario": "SURDO",
  "status": "ATIVO"
}
```

**Erros comuns:**
- `401` – token ausente ou inválido
- `404` – usuário não encontrado

---

### Upload

#### POST `/uploads/media`

**Descrição:** Faz upload de uma imagem para a API.

**Autenticação:** Sim

**Headers:**

```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
- campo `file` com a imagem

**Resposta (`201 Created`):**

```json
{
  "url_imagem": "http://localhost:5000/uploads/arquivo-1712345678901.jpg"
}
```

**Erros comuns:**
- `400` – nenhuma imagem enviada
- `500` – falha de processamento

---

### Estabelecimentos

#### POST `/estabelecimentos`

**Descrição:** Cria um novo estabelecimento.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "nome": "Loja Acessível",
  "categoria": "Restaurante",
  "fotoUrl": "https://exemplo.com/estabelecimento.jpg",
  "localizacao": {
    "type": "Point",
    "coordinates": [-35.89, -7.12]
  }
}
```

**Resposta (`201 Created`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "Loja Acessível",
  "categoria": "Restaurante",
  "fotoUrl": "https://exemplo.com/estabelecimento.jpg",
  "localizacao": {
    "type": "Point",
    "coordinates": [-35.89, -7.12]
  },
  "notaMedia": 0
}
```

#### GET `/estabelecimentos/proximos`

**Descrição:** Busca estabelecimentos próximos usando latitude, longitude e raio.

**Autenticação:** Sim

**Query params:**
- `lat` – latitude atual
- `lng` – longitude atual
- `raio` – raio em metros (opcional)

**Exemplo:**

```http
GET /estabelecimentos/proximos?lat=-7.12&lng=-35.89&raio=2000
```

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
    "nome": "Loja Acessível",
    "categoria": "Restaurante",
    "localizacao": {
      "type": "Point",
      "coordinates": [-35.89, -7.12]
    }
  }
]
```

#### GET `/estabelecimentos/:id`

**Descrição:** Busca um estabelecimento pelo ID.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "Loja Acessível",
  "categoria": "Restaurante",
  "fotoUrl": "https://exemplo.com/estabelecimento.jpg",
  "localizacao": {
    "type": "Point",
    "coordinates": [-35.89, -7.12]
  }
}
```

#### PUT `/estabelecimentos/:id`

**Descrição:** Atualiza um estabelecimento.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "nome": "Loja Acessível Atualizada",
  "categoria": "Mercado"
}
```

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "Loja Acessível Atualizada",
  "categoria": "Mercado"
}
```

#### DELETE `/estabelecimentos/:id`

**Descrição:** Remove um estabelecimento.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Deletado com sucesso"
}
```

---

### Avaliações

#### POST `/places/reviews`

**Descrição:** Registra uma avaliação de um estabelecimento.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "estabelecimentoId": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nota": 5,
  "comentario": "Estabelecimento excelente para atendimento inclusivo."
}
```

**Resposta (`201 Created`):**

```json
{
  "mensagem": "Avaliação registrada",
  "avaliacao": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7a9",
    "estabelecimentoId": "67b2c8d4e1a2b3c4d5e6f7a8",
    "nota": 5,
    "comentario": "Estabelecimento excelente para atendimento inclusivo.",
    "dataAvaliacao": "2026-08-03T21:00:00.000Z"
  }
}
```

---

### Administração de Usuários

#### GET `/admin/usuarios`

**Descrição:** Lista usuários com filtros opcionais por `tipoUsuario` e `status`, com paginação opcional por `page` e `limit`.

**Autenticação:** Sim, administrador

**Query params:**
- `tipoUsuario` – filtro por tipo, ex.: `SURDO`, `interprete`, `ADMIN`
- `status` – filtro por status, ex.: `ATIVO`
- `page` – número da página
- `limit` – quantidade por página

**Resposta (`200 OK`):**

```json
{
  "usuarios": [
    {
      "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
      "nome": "João Silva",
      "email": "joao@email.com",
      "tipoUsuario": "SURDO",
      "status": "ATIVO"
    }
  ],
  "total": 1
}
```

#### GET `/admin/usuarios/:id`

**Descrição:** Obtém o detalhe de um usuário específico.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "83999999999",
  "tipoUsuario": "SURDO",
  "status": "ATIVO"
}
```

#### PUT `/admin/usuarios/:id`

**Descrição:** Atualiza status, tipo de usuário e campos básicos do usuário pelo administrador.

**Autenticação:** Sim, administrador

**Body (JSON):**

```json
{
  "nome": "João Silva Atualizado",
  "tipoUsuario": "INTERPRETE",
  "status": "ATIVO"
}
```

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Usuário atualizado",
  "usuario": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
    "nome": "João Silva Atualizado",
    "tipoUsuario": "INTERPRETE"
  }
}
```

#### DELETE `/admin/usuarios/:id`

**Descrição:** Remove um usuário e sincroniza a exclusão com a camada de persistência.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Usuário removido",
  "usuario": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7a8"
  }
}
```

---

### Avaliações

#### GET `/places/reviews`

**Descrição:** Lista avaliações com filtros opcionais por estabelecimento, usuário e nota.

**Autenticação:** Sim

**Query params:**
- `estabelecimentoId` – filtro por estabelecimento
- `usuarioId` – filtro pelo autor da avaliação
- `nota` – filtro por nota

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7b0",
    "estabelecimentoId": "67b2c8d4e1a2b3c4d5e6f7a8",
    "usuarioId": "67b2c8d4e1a2b3c4d5e6f7a8",
    "nota": 5,
    "comentario": "Atendimento inclusivo",
    "dataAvaliacao": "2026-08-03T21:00:00.000Z"
  }
]
```

#### GET `/places/reviews/:id`

**Descrição:** Busca uma avaliação pelo identificador.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7b0",
  "estabelecimentoId": "67b2c8d4e1a2b3c4d5e6f7a8",
  "usuarioId": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nota": 5,
  "comentario": "Atendimento inclusivo"
}
```

#### PUT `/places/reviews/:id`

**Descrição:** Atualiza uma avaliação. Apenas o autor ou um administrador pode alterar.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "nota": 4,
  "comentario": "Atendimento melhorou no segundo contato"
}
```

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Avaliação atualizada",
  "avaliacao": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7b0",
    "nota": 4
  }
}
```

#### DELETE `/places/reviews/:id`

**Descrição:** Remove uma avaliação e recalcula a nota média do estabelecimento.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Avaliação removida",
  "avaliacao": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7b0"
  }
}
```

---

### Chamadas / Solicitações de Atendimento

#### GET `/calls`

**Descrição:** Lista chamadas do usuário autenticado, considerando o perfil do token: surdo ou intérprete.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "idSurdo": "67b2c8d4e1a2b3c4d5e6f7a8",
    "status": "AGUARDANDO",
    "dataAbertura": "2026-08-03T21:00:00.000Z"
  }
]
```

#### GET `/calls/admin`

**Descrição:** Lista todas as chamadas para uso administrativo.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "idSurdo": "67b2c8d4e1a2b3c4d5e6f7a8",
    "status": "AGUARDANDO"
  }
]
```

#### DELETE `/calls/:id`

**Descrição:** Cancela uma chamada apenas quando ela ainda está `AGUARDANDO` e foi criada pelo usuário autenticado.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Chamado cancelado",
  "chamado": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "status": "CANCELADA"
  }
}
```

---

### Intérprete / Voluntário

#### GET `/interpreter`

**Descrição:** Lista os cadastros de voluntários com filtro opcional por `statusOnline`.

**Autenticação:** Sim, administrador

**Query params:**
- `statusOnline=true|false` – filtro de disponibilidade online

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ab",
    "idUsuario": "67b2c8d4e1a2b3c4d5e6f7a8",
    "experiencia": "Interprete em eventos comunitários",
    "disponibilidade": "Segunda a sexta, 08:00 às 18:00",
    "statusOnline": false
  }
]
```

#### GET `/interpreter/:id`

**Descrição:** Busca um voluntário pelo identificador do MongoDB.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7ab",
  "idUsuario": "67b2c8d4e1a2b3c4d5e6f7a8",
  "experiencia": "Interprete em eventos comunitários",
  "disponibilidade": "Segunda a sexta, 08:00 às 18:00",
  "statusOnline": false
}
```

#### PUT `/interpreter/:id`

**Descrição:** Atualiza dados do voluntário como experiência e disponibilidade.

**Autenticação:** Sim, administrador

**Body (JSON):**

```json
{
  "experiencia": "Interpretou eventos municipais",
  "disponibilidade": "Fim de semana"
}
```

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Voluntário atualizado",
  "voluntario": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ab",
    "experiencia": "Interpretou eventos municipais"
  }
}
```

#### DELETE `/interpreter/:id`

**Descrição:** Remove o cadastro de voluntário e sincroniza a exclusão com a camada de dados relacional.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Voluntário removido",
  "voluntario": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ab"
  }
}
```

---
#### POST `/calls/request`

**Descrição:** Solicita atendimento emergencial com geolocalização.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "latitudeAtual": -7.12,
  "longitudeAtual": -35.89,
  "fotoContextoUrl": "https://exemplo.com/contexto.png"
}
```

**Resposta (`201 Created`):**

```json
{
  "id": "67b2c8d4e1a2b3c4d5e6f7aa",
  "status": "AGUARDANDO"
}
```

#### GET `/calls/:id/status`

**Descrição:** Consulta o status da chamada.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "status": "EM_CURSO",
  "linkWhatsapp": "https://wa.me/5583999999999"
}
```

#### GET `/calls/pending`

**Descrição:** Lista chamadas pendentes.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "status": "AGUARDANDO",
    "latitudeAtual": -7.12,
    "longitudeAtual": -35.89,
    "prioridade": "ALTA"
  }
]
```

#### PUT `/calls/:id/accept`

**Descrição:** Aceita uma chamada pendente.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Chamado aceito",
  "chamado": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "status": "EM_CURSO"
  },
  "whatsappSolicitante": "83999999999",
  "linkWhatsapp": "https://wa.me/5583999999999"
}
```

#### PUT `/calls/:id/complete`

**Descrição:** Finaliza uma chamada em andamento.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
{
  "mensagem": "Atendimento concluído",
  "chamado": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "status": "FINALIZADA"
  }
}
```

---

### Intérprete / Voluntário

#### POST `/interpreter/onboarding`

**Descrição:** Realiza o onboarding de um usuário intérprete/voluntário.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "experiencia": "Interprete em eventos comunitários",
  "disponibilidade": "Segunda a sexta, 08:00 às 18:00"
}
```

**Resposta (`201 Created`):**

```json
{
  "mensagem": "Cadastro de voluntário realizado com sucesso",
  "voluntario": {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ab",
    "idUsuario": "67b2c8d4e1a2b3c4d5e6f7a8",
    "experiencia": "Interprete em eventos comunitários",
    "disponibilidade": "Segunda a sexta, 08:00 às 18:00",
    "statusOnline": false
  }
}
```

#### PUT `/interpreter/status`

**Descrição:** Atualiza o status online/offline do intérprete.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "online": true
}
```

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7ab",
  "idUsuario": "67b2c8d4e1a2b3c4d5e6f7a8",
  "statusOnline": true
}
```

---

### Usuário / Localização

#### PUT `/users/:id/location`

**Descrição:** Atualiza a localização do usuário.

**Autenticação:** Sim

**Body (JSON):**

```json
{
  "latitude": -7.12,
  "longitude": -35.89
}
```

**Resposta (`200 OK`):**

```json
{
  "_id": "67b2c8d4e1a2b3c4d5e6f7a8",
  "nome": "João Silva",
  "latitude": -7.12,
  "longitude": -35.89
}
```

---

### Administração

#### GET `/admin/dashboards/accessibility-heatmap`

**Descrição:** Retorna registros de chamadas com coordenadas para montar um mapa de calor.

**Autenticação:** Sim, administrador

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7aa",
    "latitudeAtual": -7.12,
    "longitudeAtual": -35.89,
    "dataAbertura": "2026-08-03T21:00:00.000Z",
    "status": "AGUARDANDO"
  }
]
```

#### GET `/admin/dashboards/critical-locations`

**Descrição:** Lista regiões críticas com maior volume de chamados.

**Autenticação:** Sim, administrador

**Query params:**
- `limite` – valor mínimo para considerar uma área crítica

**Exemplo:**

```http
GET /admin/dashboards/critical-locations?limite=3
```

**Resposta (`200 OK`):**

```json
[
  {
    "_id": {
      "lat": -7.12,
      "lng": -35.89
    },
    "totalChamados": 8
  }
]
```

---

### Notificações

#### GET `/notificacao/recebidas/:id`

**Descrição:** Busca notificações recebidas por um usuário.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ac",
    "mensagem": "Nova chamada disponível",
    "visualizada": false
  }
]
```

#### GET `/notificacao/enviadas/:id`

**Descrição:** Busca notificações enviadas por um usuário.

**Autenticação:** Sim

**Resposta (`200 OK`):**

```json
[
  {
    "_id": "67b2c8d4e1a2b3c4d5e6f7ad",
    "mensagem": "Você aceitou uma solicitação",
    "visualizada": true
  }
]
```