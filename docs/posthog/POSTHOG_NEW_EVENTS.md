# 📊 Novos Eventos PostHog - Home e Álbum Público

Este documento detalha todos os novos eventos de tracking adicionados após a implementação inicial do PostHog.

---

## 📍 **PÁGINA HOME**

### 🎯 **Seção Hero**

#### **Evento:** `hero_how_it_works_clicked`
**Descrição:** Usuário clicou no botão "Como funciona" no Hero  
**Localização:** `apps/web/src/app/[locale]/(public)/(home)/(sections)/Hero/hero-buttons.tsx`  
**Properties:**
- `button_text` (string): Texto do botão
- `target` (string): "#how-it-works"

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'hero_how_it_works_clicked',
  properties: {
    button_text: 'Como funciona',
    target: '#how-it-works'
  }
}
```

---

#### **Evento:** `hero_see_example_clicked`
**Descrição:** Usuário clicou no botão "Ver exemplo" no Hero  
**Localização:** `apps/web/src/app/[locale]/(public)/(home)/(sections)/Hero/hero-buttons.tsx`  
**Properties:**
- `button_text` (string): Texto do botão
- `target` (string): "/album/a9jrss8qhxerqnsglmpks2da"

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'hero_see_example_clicked',
  properties: {
    button_text: 'Ver exemplo',
    target: '/album/a9jrss8qhxerqnsglmpks2da'
  }
}
```

---

### ❓ **Seção FAQ**

#### **Evento:** `faq_item_clicked`
**Descrição:** Usuário clicou em um item do FAQ para expandir  
**Localização:** `apps/web/src/app/[locale]/(public)/(home)/(sections)/Faq/faq-accordion.tsx`  
**Properties:**
- `question_index` (number): Índice da pergunta (1-based)
- `question_text` (string): Texto da pergunta
- `total_questions` (number): Total de perguntas no FAQ

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'faq_item_clicked',
  properties: {
    question_index: 3,
    question_text: 'Como funciona o pagamento?',
    total_questions: 8
  }
}
```

**Análises sugeridas:**
- Identificar perguntas mais populares
- Melhorar conteúdo das perguntas menos clicadas
- Criar insights baseados em dúvidas frequentes

---

### 📢 **Seção CTA (Final)**

#### **Evento:** `cta_section_clicked`
**Descrição:** Usuário clicou no botão CTA da seção final da home  
**Localização:** `apps/web/src/app/[locale]/(public)/(home)/(sections)/Cta/cta-button.tsx`  
**Properties:**
- `button_text` (string): Texto do botão
- `target` (string): "/sign-in"
- `section` (string): "footer_cta"
- `locale` (string): Idioma do usuário
- `shown_price` (number): Preço exibido

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'cta_section_clicked',
  properties: {
    button_text: 'Começar agora',
    target: '/sign-in',
    section: 'footer_cta',
    locale: 'pt',
    shown_price: 14.90
  }
}
```

---

### 🎯 **Header CTA**

#### **Evento:** `header_cta_clicked`
**Descrição:** Usuário clicou no botão CTA no Header da página home  
**Localização:** `apps/web/src/components/Header/components/Desktop/home-content.tsx`  
**Properties:**
- `button_text` (string): Texto do botão
- `target` (string): "/sign-in"
- `section` (string): "header"

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'header_cta_clicked',
  properties: {
    button_text: 'Acessar conta',
    target: '/sign-in',
    section: 'header'
  }
}
```

---

## 🌐 **PÁGINA DO ÁLBUM PÚBLICO**

### 🔗 **Compartilhamento**

#### **Evento:** `share_modal_opened`
**Descrição:** Modal de compartilhamento foi aberto  
**Localização:** `apps/web/src/components/ShareAlbumModal/index.tsx`  
**Properties:**
- `album_id` (string): ID do álbum
- `album_title` (string): Título do álbum

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'share_modal_opened',
  properties: {
    album_id: 'abc123',
    album_title: 'Viagem para Paris'
  }
}
```

---

#### **Evento:** `album_shared`
**Descrição:** Usuário compartilhou o álbum através de algum método  
**Localização:** `apps/web/src/components/ShareButtons/index.tsx`  
**Properties:**
- `album_id` (string): ID do álbum
- `share_method` (string): Método utilizado
  - `"whatsapp"`: WhatsApp
  - `"native_share"`: Share nativo do navegador/sistema
  - `"copy_link"`: Copiar link manualmente
  - `"copy_link_fallback"`: Copiar link quando share nativo não está disponível
- `album_title` (string): Título do álbum

**Exemplo de uso no PostHog:**
```javascript
// WhatsApp
{
  event: 'album_shared',
  properties: {
    album_id: 'abc123',
    share_method: 'whatsapp',
    album_title: 'Viagem para Paris'
  }
}

// Native Share
{
  event: 'album_shared',
  properties: {
    album_id: 'abc123',
    share_method: 'native_share',
    album_title: 'Viagem para Paris'
  }
}

// Copy Link
{
  event: 'album_shared',
  properties: {
    album_id: 'abc123',
    share_method: 'copy_link',
    album_title: 'Viagem para Paris'
  }
}
```

**Análises sugeridas:**
- Comparar qual método de compartilhamento é mais popular
- Taxa de conversão: share_modal_opened → album_shared
- Identificar álbuns mais compartilhados

---

### 🔲 **QR Code**

#### **Evento:** `qrcode_tab_viewed`
**Descrição:** Usuário clicou na aba "QR Code" do modal de compartilhamento  
**Localização:** `apps/web/src/components/ShareAlbumModal/index.tsx`  
**Properties:**
- `album_id` (string): ID do álbum
- `album_title` (string): Título do álbum

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'qrcode_tab_viewed',
  properties: {
    album_id: 'abc123',
    album_title: 'Viagem para Paris'
  }
}
```

---

#### **Evento:** `qrcode_downloaded`
**Descrição:** Usuário fez download do QR Code do álbum  
**Localização:** `apps/web/src/components/QRCodeShare/index.tsx`  
**Properties:**
- `album_id` (string): ID do álbum
- `qrcode_size` (number): Tamanho do QR Code em pixels
- `file_format` (string): Formato do arquivo ("png")

**Exemplo de uso no PostHog:**
```javascript
{
  event: 'qrcode_downloaded',
  properties: {
    album_id: 'abc123',
    qrcode_size: 200,
    file_format: 'png'
  }
}
```

**Análises sugeridas:**
- Taxa de conversão: qrcode_tab_viewed → qrcode_downloaded
- Identificar usuários que preferem QR Code vs compartilhamento direto

---

## 📊 **RESUMO DE EVENTOS POR CATEGORIA**

### **Home Page (5 eventos)**
1. `hero_how_it_works_clicked` - Botão "Como funciona"
2. `hero_see_example_clicked` - Botão "Ver exemplo"
3. `faq_item_clicked` - Item do FAQ expandido
4. `cta_section_clicked` - CTA da seção final
5. `header_cta_clicked` - CTA do Header

### **Álbum Público (4 eventos)**
1. `share_modal_opened` - Modal de compartilhamento aberto
2. `album_shared` - Álbum compartilhado (4 métodos diferentes)
3. `qrcode_tab_viewed` - Aba QR Code visualizada
4. `qrcode_downloaded` - QR Code baixado

---

## 🎯 **FUNIS SUGERIDOS PARA O POSTHOG**

### **Funil 1: Conversão da Home → Sign In**

```
Passo 1: hero_how_it_works_clicked OU hero_see_example_clicked
Passo 2: faq_item_clicked (opcional)
Passo 3: header_cta_clicked OU cta_section_clicked
Passo 4: sign_in_started
Passo 5: sign_in_completed
```

**Objetivo:** Medir a eficácia da página home em converter visitantes em usuários cadastrados.

---

### **Funil 2: Engajamento com Compartilhamento**

```
Passo 1: share_modal_opened
Passo 2: album_shared (qualquer método)
```

**Breakdown sugerido:** `share_method` (para ver qual método é mais usado)

**Objetivo:** Medir taxa de conversão do modal de compartilhamento.

---

### **Funil 3: Engajamento com QR Code**

```
Passo 1: share_modal_opened
Passo 2: qrcode_tab_viewed
Passo 3: qrcode_downloaded
```

**Objetivo:** Medir adoção e uso da funcionalidade de QR Code.

---

### **Funil 4: FAQ Engagement**

```
Passo 1: $pageview (home page)
Passo 2: faq_item_clicked
Passo 3: header_cta_clicked OU cta_section_clicked
```

**Objetivo:** Verificar se usuários que leem o FAQ têm maior probabilidade de converter.

---

## 📈 **INSIGHTS SUGERIDOS PARA O DASHBOARD**

### **1. Top Perguntas do FAQ**

**Tipo:** Tabela  
**Evento:** `faq_item_clicked`  
**Breakdown:** `question_text`  
**Ordenar por:** Total count (descendente)  
**Período:** Últimos 30 dias

**Utilidade:** Identificar as dúvidas mais comuns dos usuários.

---

### **2. Taxa de Conversão dos CTAs**

**Tipo:** Funil  
**Eventos:**
1. `header_cta_clicked`
2. `sign_in_started`
3. `sign_in_completed`

**Comparar com:**
1. `cta_section_clicked`
2. `sign_in_started`
3. `sign_in_completed`

**Utilidade:** Comparar qual CTA (header vs seção final) é mais efetivo.

---

### **3. Métodos de Compartilhamento Preferidos**

**Tipo:** Gráfico de Pizza / Barras  
**Evento:** `album_shared`  
**Breakdown:** `share_method`  
**Período:** Últimos 7 dias

**Utilidade:** Entender como usuários preferem compartilhar álbuns.

---

### **4. Engajamento com Exemplo de Álbum**

**Tipo:** Tendência (linha)  
**Evento:** `hero_see_example_clicked`  
**Período:** Últimos 30 dias  
**Intervalo:** Diário

**Utilidade:** Monitorar interesse no álbum de exemplo.

---

### **5. Taxa de Download de QR Code**

**Tipo:** Métrica única (%)  
**Cálculo:** `qrcode_downloaded / qrcode_tab_viewed * 100`  
**Período:** Últimos 30 dias

**Utilidade:** Medir conversão da visualização ao download do QR Code.

---

## 🔍 **QUERIES ÚTEIS PARA O POSTHOG**

### **Query 1: Usuários que viram FAQ mas não converteram**

```sql
-- Usuários que clicaram no FAQ mas NÃO fizeram sign-in
SELECT DISTINCT person_id
FROM events
WHERE event = 'faq_item_clicked'
  AND timestamp > now() - interval '7 days'
  AND person_id NOT IN (
    SELECT person_id
    FROM events
    WHERE event = 'sign_in_completed'
      AND timestamp > now() - interval '7 days'
  )
```

---

### **Query 2: Álbuns mais compartilhados**

```sql
SELECT 
  properties->>'album_id' AS album_id,
  properties->>'album_title' AS album_title,
  COUNT(*) AS share_count
FROM events
WHERE event = 'album_shared'
  AND timestamp > now() - interval '30 days'
GROUP BY album_id, album_title
ORDER BY share_count DESC
LIMIT 10
```

---

### **Query 3: Jornada completa de um visitante**

```sql
-- Eventos de um usuário específico desde a home até conversão
SELECT 
  timestamp,
  event,
  properties
FROM events
WHERE person_id = '<pessoa_id>'
  AND event IN (
    'hero_how_it_works_clicked',
    'hero_see_example_clicked',
    'faq_item_clicked',
    'header_cta_clicked',
    'cta_section_clicked',
    'sign_in_started',
    'sign_in_completed'
  )
ORDER BY timestamp ASC
```

---

## 🎨 **DASHBOARD SUGERIDO: "Marketing e Aquisição"**

### **Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Funil: Home → Sign In                                      │
│  (hero_see_example → faq → CTA → sign_in → completed)      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│  Top Perguntas FAQ       │  CTAs: Header vs Footer          │
│  (Tabela)                │  (Gráfico de Barras)             │
└──────────────────────────┴──────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│  Métodos Compartilhamento│  Taxa Download QR Code           │
│  (Gráfico Pizza)         │  (Métrica única %)               │
└──────────────────────────┴──────────────────────────────────┘
```

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [x] Eventos da Home implementados
- [x] Eventos de compartilhamento implementados
- [x] Eventos de QR Code implementados
- [x] Sem erros de lint
- [x] Properties consistentes
- [x] Documentação completa

---

## 📝 **NOTAS TÉCNICAS**

### **Arquitetura:**
- Todos os componentes de tracking são Client Components (`'use client'`)
- Server Components foram mantidos, criando wrappers client quando necessário
- Uso do hook `usePostHog()` para acesso ao PostHog client
- Properties tipadas como `Record<string, unknown>` para flexibilidade

### **Performance:**
- Tracking não bloqueia a UI
- Eventos são enviados de forma assíncrona
- Nenhum impacto perceptível na experiência do usuário

### **Manutenibilidade:**
- Código organizado e documentado
- Fácil adicionar novos eventos seguindo os mesmos padrões
- Separação clara entre lógica de negócio e tracking

---

**Última atualização:** 01/11/2025  
**Versão:** 1.0  
**Autor:** Implementação PostHog - Polotrip

