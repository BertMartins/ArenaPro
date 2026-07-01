# BolinhaClub 🏐

Sistema de gestão de jogos de vôlei/futevôlei: cadastro de jogadores, criação de jogos, lista de espera com regras de prioridade (mensalista x diarista), sorteio de times balanceados, placar de partidas, controle de mensalidades e caixinha.

Stack: **Next.js (App Router) + TypeScript + Prisma + PostgreSQL**, tudo num único projeto (frontend, backend e acesso a banco).

## Arquitetura

O backend segue uma **Clean Architecture simplificada**: cada camada só conhece a de baixo, e a lógica de negócio fica isolada do Next.js e do Prisma.

```
src/
  domain/          regras de negócio puras, sem banco/HTTP (ex: elegibilidade de suplente)
  application/      casos de uso (services) que orquestram o Prisma e as regras de domain
  infrastructure/    acesso a banco (Prisma) e autenticação (JWT/cookies)
  shared/            utilitários transversais (datas, helpers de resposta HTTP)
  app/
    api/**/route.ts  controllers finos: recebem a request, chamam um service e devolvem a resposta
    (auth)/, (dashboard)/, ...   páginas (React Server/Client Components)
  components/        componentes de UI reutilizáveis
```

Fluxo de uma requisição: `route.ts` (controller) → `application/*Service.ts` (caso de uso) → `infrastructure/db/prisma.ts` (banco), usando quando necessário as regras de `domain/`.

## Pré-requisitos

Antes de rodar o projeto, instale:

- **[Node.js](https://nodejs.org/) 20 ou superior** (inclui o `npm`)
- **[Git](https://git-scm.com/)**
- Uma conta gratuita no **[Neon](https://neon.tech/)** (banco PostgreSQL na nuvem — veja o passo a passo abaixo)

Opcional, mas recomendado:
- **[VS Code](https://code.visualstudio.com/)** como editor

## Passo a passo para rodar o projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd BolinhaClub
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o banco de dados no Neon

1. Acesse [neon.tech](https://neon.tech/) e crie uma conta gratuita.
2. Crie um novo **Project** (dê o nome que quiser, ex: `bolinhaclub`).
3. Dentro do projeto, vá em **Connection Details** / **Connection String**.
4. Copie a **connection string** no formato `psql`/Prisma (com `?sslmode=require` no final).

### 4. Configurar as variáveis de ambiente

Crie um arquivo chamado **`.env`** na raiz do projeto (mesma pasta do `package.json`) e cole o conteúdo abaixo, substituindo os valores fictícios pelos seus:

```env
# String de conexão copiada do Neon (Connection Details > Connection String)
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST.neon.tech/SEU_BANCO?sslmode=require"

# Qualquer texto longo e secreto — usado para assinar o token de login (JWT)
JWT_SECRET="COLOQUE_AQUI_UMA_FRASE_SECRETA_BEM_GRANDE_E_ALEATORIA"

# Senha usada pelo cron de reconciliação de jogos (rota /api/cron/reconcile-games)
CRON_SECRET="COLOQUE_AQUI_OUTRA_SENHA_SECRETA"
```

> ⚠️ O `.env` nunca deve ser commitado no Git (ele já está no `.gitignore`). Cada pessoa/ambiente tem o seu próprio, com suas próprias credenciais.

### 5. Criar as tabelas no banco

Com o `.env` configurado, rode as migrations do Prisma para criar as tabelas no banco do Neon:

```bash
npx prisma migrate deploy
```

### 6. Rodar o projeto em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Exemplo prático: criando uma tela nova (do banco até a tela)

Para deixar mais claro como as camadas conversam entre si, segue um exemplo fictício completo: um **mural de avisos**, onde o admin cadastra um aviso e todo mundo vê a lista na tela inicial. A ideia é usar exatamente esse mesmo caminho (Prisma → domain/application → route.ts → página) para qualquer tela nova que for criada no projeto.

### 1. Modelo no Prisma (`prisma/schema.prisma`)

Primeiro descreve a tabela no schema:

```prisma
model Announcement {
  id        String   @id @default(cuid())
  message   String
  createdAt DateTime @default(now())

  createdById String
  createdBy   User   @relation(fields: [createdById], references: [id])
}
```

Depois de editar o schema, gera a migration (isso já cria a tabela no banco do Neon):

```bash
npx prisma migrate dev --name add_announcement
```

### 2. Regra de negócio + service (`src/application/announcements/announcementsService.ts`)

Se a tela não tem nenhuma regra de negócio especial (é só listar/criar), o service já pode chamar o Prisma direto — sem precisar de nada em `domain/`. `domain/` só entra quando existe uma regra a proteger (ex: "só admin pode apagar aviso com mais de 1 dia").

```ts
import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";

export async function listAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: true },
  });
}

export async function createAnnouncement(message: string, createdById: string) {
  if (!message?.trim()) {
    throw new HttpError(400, "Mensagem obrigatória");
  }

  return prisma.announcement.create({
    data: { message: message.trim(), createdById },
  });
}
```

### 3. Controller / rota (`src/app/api/announcements/route.ts`)

A rota fica "burra": só valida quem pode chamar e repassa pro service.

```ts
import { NextResponse } from "next/server";
import { requireAuth, requireAdmin, jsonFromError } from "@/shared/http";
import { listAnnouncements, createAnnouncement } from "@/application/announcements/announcementsService";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const announcements = await listAnnouncements();
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { message } = await req.json();
    const announcement = await createAnnouncement(message, auth.id);
    return NextResponse.json({ ok: true, announcement }, { status: 201 });
  } catch (err) {
    return jsonFromError(err, "Erro ao criar aviso");
  }
}
```

### 4. Tela (`src/app/avisos/page.tsx`)

No front, é o mesmo padrão usado em `src/app/games/page.tsx`: `"use client"` + `fetch` para a própria API + `useState`/`useEffect`.

```tsx
"use client";

import { useEffect, useState } from "react";

type Announcement = { id: string; message: string; createdAt: string };

export default function AvisosPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnnouncements() {
    setLoading(true);
    const res = await fetch("/api/announcements");
    const data = await res.json();
    if (res.ok) setAnnouncements(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold text-white">📢 Avisos</h2>

      {loading && <div className="text-gray-400">Carregando...</div>}

      {!loading &&
        announcements.map((a) => (
          <div key={a.id} className="glass-card p-4 rounded">
            <p className="text-white">{a.message}</p>
          </div>
        ))}
    </div>
  );
}
```

### Resumo do fluxo

```
prisma/schema.prisma          → define a tabela (Announcement)
        ↓ npx prisma migrate dev
application/.../*Service.ts   → regra de negócio + chamada ao Prisma
        ↓
app/api/.../route.ts          → controller fino (auth + chama o service)
        ↓ fetch("/api/...")
app/.../page.tsx               → tela (React) que consome a API
```

Esse é o mesmo caminho seguido por qualquer funcionalidade já existente no projeto — por exemplo, siga `src/app/api/games/route.ts` → `src/application/games/gamesService.ts` → `src/app/games/page.tsx` para ver um caso real.

## Outros comandos úteis

| Comando | O que faz |
|---|---|
| `npm run build` | Gera a build de produção |
| `npm run start` | Roda a build de produção (depois do `build`) |
| `npm run lint` | Roda o linter |
| `npx prisma studio` | Abre uma interface visual para ver/editar os dados do banco |
| `npx prisma migrate dev` | Cria uma nova migration ao alterar `prisma/schema.prisma` |
