# 🍪 PostHog Opt-Out - Implementação Completa

Este documento descreve a implementação do sistema de opt-out do PostHog através do componente de consentimento de cookies.

---

## 📋 **VISÃO GERAL**

A implementação permite que os usuários **aceitem ou recusem** o tracking do PostHog através de um banner de cookies internacionalizado. O PostHog só inicia o tracking **após o consentimento explícito** do usuário.

---

## 🎯 **COMPONENTES IMPLEMENTADOS**

### **1. CookieConsent Component**

**Localização:** `apps/web/src/components/blocks/cookie-consent.tsx`

**Características:**
- ✅ **Internacionalizado** com `next-intl` (pt/en)
- ✅ **3 variantes:** `default`, `small`, `mini`
- ✅ **Integrado com PostHog** para opt-out/opt-in
- ✅ **Persistência:** Cookie + localStorage

**Fluxo:**

```typescript
// Quando usuário ACEITA:
1. Salva cookie: 'cookieConsent=true'
2. Salva localStorage: 'posthog_opt_out=false'
3. Chama: posthog.opt_in_capturing()

// Quando usuário RECUSA:
1. Salva cookie: 'cookieConsent=declined'
2. Salva localStorage: 'posthog_opt_out=true'
3. Chama: posthog.opt_out_capturing()
4. Chama: posthog.reset() (limpa dados existentes)
```

---

### **2. CookieConsentWrapper**

**Localização:** `apps/web/src/components/blocks/cookie-consent-wrapper.tsx`

**Função:**
- ✅ Wrapper client-side que injeta o `locale` no componente
- ✅ Constrói o link correto para a política de privacidade (`/${locale}/privacy-policy`)

---

### **3. PostHogProvider Atualizado**

**Localização:** `apps/web/src/app/providers/PostHogProvider.tsx`

**Mudanças:**

```typescript
// ANTES (sempre iniciava tracking):
posthog.init(..., {
  opt_out_capturing_by_default: false,
});

// DEPOIS (só inicia se consentimento dado):
const shouldOptOut = 
  optOutFromStorage || 
  hasDeclinedCookie || 
  !hasAcceptedCookie; // ← Novo: opt-out por padrão até consentimento

posthog.init(..., {
  opt_out_capturing_by_default: shouldOptOut, // ✅ Respeita consentimento
});
```

**Lógica de Opt-Out:**
1. ✅ Verifica `localStorage.getItem('posthog_opt_out')`
2. ✅ Verifica cookie `cookieConsent=declined`
3. ✅ Verifica cookie `cookieConsent=true`
4. ✅ **Default:** Opt-out até consentimento explícito

---

## 🌐 **INTERNACIONALIZAÇÃO**

### **Traduções Adicionadas**

#### **Português (pt.json):**
```json
"CookieConsent": {
  "title": "Usamos cookies",
  "description": "Usamos cookies para garantir que você tenha a melhor experiência em nosso site. Para mais informações sobre como usamos cookies, consulte nossa política de cookies.",
  "accept_button": "Aceitar",
  "decline_button": "Recusar",
  "learn_more": "Saiba mais",
  "by_accepting": "Ao clicar em \"Aceitar\", você concorda com o uso de cookies.",
  "by_accepting_short": "Ao clicar em \"Aceitar\", você concorda."
}
```

#### **Inglês (en.json):**
```json
"CookieConsent": {
  "title": "We use cookies",
  "description": "We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie policy.",
  "accept_button": "Accept",
  "decline_button": "Decline",
  "learn_more": "Learn more",
  "by_accepting": "By clicking \"Accept\", you agree to our use of cookies.",
  "by_accepting_short": "By clicking \"Accept\", you agree."
}
```

---

## 🔄 **FLUXO DE FUNCIONAMENTO**

### **1. Primeira Visita (Sem Consentimento)**

```
Usuário visita o site
    ↓
CookieConsent aparece (variant="mini")
    ↓
PostHog NÃO inicia tracking (opt_out_capturing_by_default: true)
    ↓
Aguarda escolha do usuário
```

---

### **2. Usuário Aceita Cookies**

```
Usuário clica em "Aceitar"
    ↓
CookieConsent.handleAccept():
  - Salva: cookieConsent=true
  - Salva: localStorage.posthog_opt_out = 'false'
  - Chama: posthog.opt_in_capturing()
    ↓
PostHog inicia tracking normalmente
    ↓
Banner desaparece
```

---

### **3. Usuário Recusa Cookies**

```
Usuário clica em "Recusar"
    ↓
CookieConsent.handleDecline():
  - Salva: cookieConsent=declined
  - Salva: localStorage.posthog_opt_out = 'true'
  - Chama: posthog.opt_out_capturing()
  - Chama: posthog.reset() (limpa dados)
    ↓
PostHog permanece desabilitado
    ↓
Banner desaparece
```

---

### **4. Visita Subsequente (Com Consentimento Salvo)**

```
Usuário visita o site novamente
    ↓
CookieConsent verifica cookie:
  - cookieConsent=true → Banner não aparece, PostHog ativo
  - cookieConsent=declined → Banner não aparece, PostHog inativo
    ↓
PostHogProvider sincroniza status na inicialização
```

---

## 🔐 **SEGURANÇA E PRIVACIDADE**

### **Conformidade com LGPD/GDPR:**

✅ **Opt-In Explícito:** PostHog só inicia após consentimento  
✅ **Opt-Out Eficaz:** `posthog.opt_out_capturing()` + `reset()`  
✅ **Persistência:** Consentimento salvo em cookie (longa duração)  
✅ **Sincronização:** Cookie + localStorage para consistência  

### **Limpeza de Dados:**

Quando o usuário recusa:
```typescript
posthog.opt_out_capturing(); // Desabilita tracking
posthog.reset(); // Remove identificadores e dados do usuário
```

---

## 📊 **INTEGRAÇÃO NO LAYOUT**

**Localização:** `apps/web/src/app/[locale]/layout.tsx`

```typescript
<Providers>
  <PostHogIdentifier user={user} />
  <NuqsAdapter>{children}</NuqsAdapter>
</Providers>
<Toaster />
<CookieConsentWrapper /> {/* ← Adicionado aqui */}
```

**Por que no final?**
- ✅ Renderiza por último (não interfere no conteúdo)
- ✅ Z-index alto (`z-50`) mantém acima de outros elementos
- ✅ Posicionado fixo na parte inferior

---

## 🎨 **VARIANTS DO COOKIECONSENT**

### **Mini (Usado no Layout)**
- ✅ Compacto, ideal para não interferir na experiência
- ✅ Botões pequenos, texto resumido
- ✅ Responsivo (grid em mobile, flex em desktop)

### **Default**
- ✅ Banner completo com título
- ✅ Descrição detalhada
- ✅ Link "Saiba mais" para política

### **Small**
- ✅ Versão intermediária
- ✅ Header compacto
- ✅ Botões arredondados

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [x] Traduções adicionadas (pt/en)
- [x] Componente internacionalizado
- [x] Integração com PostHog opt-out
- [x] PostHogProvider atualizado
- [x] CookieConsent adicionado no layout
- [x] Persistência em cookie e localStorage
- [x] Sincronização de status
- [x] Limpeza de dados ao recusar
- [x] Sem erros de lint
- [x] Link para política de privacidade funcional

---

## 🔍 **TESTANDO A IMPLEMENTAÇÃO**

### **1. Teste de Primeira Visita:**

```javascript
// Limpar cookies e localStorage
document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
localStorage.removeItem('posthog_opt_out');

// Recarregar página
location.reload();

// Verificar:
// ✅ Banner aparece
// ✅ PostHog não envia eventos (verificar Network tab)
```

---

### **2. Teste de Aceitar Cookies:**

```javascript
// Clicar em "Aceitar"

// Verificar:
// ✅ Cookie salvo: cookieConsent=true
// ✅ localStorage: posthog_opt_out = 'false'
// ✅ PostHog envia eventos normalmente
// ✅ Banner desaparece
```

---

### **3. Teste de Recusar Cookies:**

```javascript
// Clicar em "Recusar"

// Verificar:
// ✅ Cookie salvo: cookieConsent=declined
// ✅ localStorage: posthog_opt_out = 'true'
// ✅ PostHog NÃO envia eventos
// ✅ Banner desaparece
```

---

### **4. Teste de Visita Subsequente:**

```javascript
// Com cookieConsent=true salvo

// Recarregar página

// Verificar:
// ✅ Banner NÃO aparece
// ✅ PostHog continua ativo
```

---

## 📝 **NOTAS TÉCNICAS**

### **APIs do PostHog Usadas:**

1. **`posthog.opt_out_capturing()`**
   - Sem argumentos
   - Desabilita tracking permanentemente
   - Remove identificadores

2. **`posthog.opt_in_capturing()`**
   - Sem argumentos
   - Habilita tracking novamente

3. **`posthog.reset()`**
   - Limpa identificadores do usuário
   - Remove dados armazenados localmente
   - Usado quando usuário recusa cookies

4. **`opt_out_capturing_by_default`**
   - Configuração na inicialização
   - Define se tracking inicia desabilitado por padrão

---

### **Armazenamento:**

**Cookie:**
```javascript
// Aceitar:
'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/'

// Recusar:
'cookieConsent=declined; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/'
```

**localStorage:**
```javascript
// Aceitar:
localStorage.setItem('posthog_opt_out', 'false')

// Recusar:
localStorage.setItem('posthog_opt_out', 'true')
```

---

## 🚨 **IMPORTANTE**

1. **Default Opt-Out:** PostHog **NÃO inicia** tracking até consentimento explícito
2. **Reset Completo:** Quando usuário recusa, `reset()` limpa todos os dados
3. **Sincronização:** Cookie e localStorage são sempre sincronizados
4. **Persistência:** Consentimento dura até 9999 (praticamente permanente)

---

## 🎯 **COMPLIANCE LEGAL**

### **LGPD (Lei Geral de Proteção de Dados - Brasil)**

✅ **Artigo 7º, I:** Consentimento explícito obtido  
✅ **Artigo 18º, II:** Direito de retificação (opt-out eficaz)  
✅ **Artigo 18º, III:** Direito de exclusão (`reset()`)  

### **GDPR (General Data Protection Regulation - UE)**

✅ **Art. 6(1)(a):** Consentimento livre e específico  
✅ **Art. 7(3):** Direito de retirar consentimento (opt-out)  
✅ **Art. 13:** Informação sobre uso de cookies (banner)  

---

**Última atualização:** 01/11/2025  
**Versão:** 1.0  
**Autor:** Implementação PostHog - Polotrip

