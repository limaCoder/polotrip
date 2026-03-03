# PostHog - Práticas Oficiais Implementadas no Polotrip

## 📋 Visão Geral

Este documento descreve a implementação do PostHog seguindo as **práticas oficiais recomendadas** pela documentação oficial do PostHog para Next.js App Router.

**Referências:**

- [PostHog Next.js Integration](https://posthog.com/docs/libraries/next-js)
- [PostHog Identify Users](https://posthog.com/docs/product-analytics/identify)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)

---

## ✅ O que ESTÁ implementado (Oficial)

### 1. **PostHogProvider + PostHogPageView**

- ✅ Usa o `PostHogProvider` oficial do `posthog-js/react`
- ✅ Implementa `PostHogPageView` para tracking automático de páginas (padrão Next.js App Router)
- ✅ Desabilita `capture_pageview` automático para usar nosso componente otimizado

### 2. **usePostHog Hook**

- ✅ Usa o hook oficial `usePostHog` do `posthog-js/react`
- ✅ Wrapper simples com helpers tipados

### 3. **User Identification**

- ✅ Usa `posthog.identify()` diretamente (padrão oficial)
- ✅ Usa `posthog.reset()` no logout

### 4. **Error Tracking**

- ✅ `capture_exceptions: true` na inicialização
- ✅ Método `captureError` para erros manuais

---

## ❌ O que NÃO usamos (Removido)

- ❌ `PageViewTracker` customizado → Substituído por `PostHogPageView` oficial
- ❌ `usePageView` hook customizado → Não necessário
- ❌ `lib/posthog/client.ts` → Funções redundantes
- ❌ Tracking manual em cada página → Feito automaticamente

---

## 🏗️ Arquitetura

```
apps/web/src/
├── app/providers/
│   └── PostHogProvider.tsx          # Provider + PostHogPageView (oficial)
├── hooks/
│   └── usePostHog.ts                # Hook wrapper
├── components/
│   └── PostHogIdentifier/           # Identificação automática de usuários
└── lib/
    └── posthog.ts                   # Cliente server-side (PostHog Node)
```

---

## 🚀 Como Usar

### 1. Tracking Automático de Page Views

**Não faça nada!** O `PostHogPageView` no `PostHogProvider` já rastreia todas as páginas automaticamente.

```typescript
// ❌ NÃO FAÇA ISSO (não é mais necessário):
<PageViewTracker eventName="my_page_viewed" />

// ✅ O tracking é AUTOMÁTICO via PostHogPageView no Provider
```

---

### 2. Capturar Eventos Customizados (Client Components)

Use o hook `usePostHog` em qualquer Client Component:

```typescript
'use client';

import { usePostHog } from '@/hooks/usePostHog';

export function MyComponent() {
  const { capture } = usePostHog();

  const handleClick = () => {
    capture('button_clicked', {
      button_name: 'subscribe',
      page: 'pricing',
    });
  };

  return <button onClick={handleClick}>Subscribe</button>;
}
```

---

### 3. Capturar Eventos em Server Components

**Resposta:** Server Components **não capturam eventos diretamente**.

**Por quê?**

- Server Components rodam no servidor (não têm acesso ao PostHog client-side)
- O tracking de pageview acontece automaticamente quando a página carrega no browser via `PostHogPageView`

**Opções:**

#### A) Para tracking de page views específicos:

```typescript
// Server Component renderiza a página
export default async function MyPage() {
  return <MyPageContent />;
}

// Client Component captura evento quando monta
'use client';
function MyPageContent() {
  const { capture } = usePostHog();

  useEffect(() => {
    capture('custom_page_viewed', {
      page_type: 'specific_feature',
    });
  }, [capture]);

  return <div>Content</div>;
}
```

#### B) Para ações do usuário:

```typescript
// Server Component renderiza formulário
export default async function FormPage() {
  return <FormWithTracking />;
}

// Client Component captura submissão
'use client';
function FormWithTracking() {
  const { capture } = usePostHog();

  const handleSubmit = (data) => {
    capture('form_submitted', {
      form_name: 'newsletter',
    });
    // ... rest of logic
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### C) Para Server Actions:

```typescript
// Server Action
'use server';
import PostHogClient from '@/lib/posthog';

export async function createAlbum(data) {
  const album = await db.createAlbum(data);

  // Track server-side
  const client = PostHogClient();
  client.capture({
    distinctId: userId,
    event: 'album_created_server',
    properties: { album_id: album.id },
  });
  await client.shutdown();

  return album;
}
```

---

### 4. Identificar Usuários

**Já está configurado!** O `PostHogIdentifier` no layout raiz já identifica usuários automaticamente.

```typescript
// apps/web/src/app/[locale]/layout.tsx
export default async function RootLayout({ children }) {
  const user = await getCurrentUser(); // Server-side

  return (
    <Providers>
      <PostHogIdentifier user={user} /> {/* Identificação automática */}
      {children}
    </Providers>
  );
}
```

**Para identificação manual em casos específicos:**

```typescript
'use client';
import { usePostHog } from 'posthog-js/react';

function MyComponent() {
  const posthog = usePostHog();

  useEffect(() => {
    if (user) {
      posthog?.identify(user.id, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user, posthog]);
}
```

---

### 5. Error Tracking

**Automático!** O PostHog já captura exceptions automaticamente com `capture_exceptions: true`.

**Para erros manuais:**

```typescript
'use client';
import { usePostHog } from '@/hooks/usePostHog';

function MyComponent() {
  const { captureError } = usePostHog();

  const handleError = () => {
    try {
      // ... code
    } catch (error) {
      captureError(error, {
        component: 'MyComponent',
        action: 'data_fetch',
      });
    }
  };
}
```

---

## 📚 Eventos Implementados

### Autenticação

- `sign_in_started` - Usuário inicia login
- `sign_in_completed` - Login bem-sucedido
- `sign_in_failed` - Erro no login

### Onboarding

- `onboarding_started` - Modal de onboarding aberto
- `onboarding_step_viewed` - Cada passo visualizado
- `onboarding_completed` - Onboarding finalizado
- `onboarding_skipped` - Usuário pulou onboarding

### PWA Install

- `pwa_install_prompt_shown` - Prompt de instalação mostrado
- `pwa_install_accepted` - Usuário aceitou instalar
- `pwa_install_dismissed` - Prompt foi fechado

### Criação de Álbum

- `album_form_started` - Usuário começou a preencher
- `album_plan_selected` - Plano escolhido
- `album_cover_uploaded` - Capa enviada
- `album_form_submitted` - Formulário enviado
- `album_payment_initiated` - Redirecionado para pagamento
- `album_creation_failed` - Erro na criação

### Upload de Fotos

- `photos_selected` - Fotos selecionadas
- `upload_started` - Upload iniciado
- `upload_completed` - Upload concluído com sucesso
- `upload_failed` - Erro no upload
- `metadata_dialog_opened` - Dialog de metadados aberto

### Edição de Álbum

- `photo_selected` - Foto selecionada para edição
- `timeline_viewed` - Timeline visualizada
- `map_viewed` - Mapa visualizado
- `photo_edited` - Foto editada (single/batch)
- `photo_deleted` - Foto(s) deletada(s)
- `finish_edit_clicked` - Botão "Finalizar" clicado
- `edit_completed` - Edição finalizada e álbum publicado
- `undated_photos_dialog_opened` - Dialog de fotos sem data

---

## 🔍 Debugging

### Habilitar Debug Mode

No desenvolvimento, o debug já está ativado:

```typescript
posthog.init(KEY, {
  debug: process.env.NODE_ENV === 'development', // ✅ Já configurado
});
```

### Ver Eventos no Console

Abra o DevTools e veja os logs do PostHog:

```
[PostHog] Event captured: sign_in_started
[PostHog] Properties: { provider: 'google', locale: 'pt' }
```

### Verificar Configuração

```typescript
'use client';
import { usePostHog } from 'posthog-js/react';

function DebugPostHog() {
  const posthog = usePostHog();

  console.log('PostHog loaded:', !!posthog);
  console.log('PostHog config:', posthog?.config);

  return null;
}
```

---

## ⚠️ Perguntas Frequentes

### 1. "Por que remover o PageViewTracker?"

**Resposta:** Ele era redundante. O `PostHogPageView` oficial no Provider já faz isso automaticamente e de forma otimizada para Next.js App Router.

### 2. "Como rastrear eventos em Server Components?"

**Resposta:** Server Components **não rastreiam eventos client-side**. O tracking de pageview acontece automaticamente no browser. Para eventos de ações, use Client Components ou Server Actions com PostHog Node.

### 3. "Preciso identificar usuários manualmente em cada página?"

**Resposta:** **Não!** O `PostHogIdentifier` no layout raiz já faz isso automaticamente para todas as páginas.

### 4. "Como adicionar propriedades customizadas nas page views?"

**Resposta:** Modifique o `PostHogPageView` no Provider:

```typescript
function PostHogPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && posthog) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        custom_property: 'value', // ✅ Adicione aqui
      });
    }
  }, [pathname]);

  return null;
}
```

### 5. "O PostHog funciona com SSR/Server Components?"

**Resposta:**

- **Client-side tracking:** ✅ Sim (automático via PostHogPageView)
- **Server Components:** ✅ Sim (renderizam normalmente, tracking acontece no browser)
- **Server Actions:** ✅ Sim (use PostHog Node para tracking server-side)

---

## 🎯 Checklist de Implementação

- [x] PostHogProvider configurado com PostHogPageView
- [x] Tracking automático de page views
- [x] Identificação automática de usuários
- [x] Error tracking habilitado
- [x] Eventos customizados implementados
- [x] Documentação atualizada
- [x] Debug mode em desenvolvimento

---

## 📚 Recursos Adicionais

- [PostHog Docs](https://posthog.com/docs)
- [PostHog Next.js Guide](https://posthog.com/docs/libraries/next-js)
- [PostHog React SDK](https://posthog.com/docs/libraries/react)
- [PostHog Node SDK](https://posthog.com/docs/libraries/node)
