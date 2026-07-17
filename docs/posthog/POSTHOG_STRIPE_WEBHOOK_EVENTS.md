# 📊 Eventos PostHog - Stripe Webhook

Este documento detalha todos os eventos de tracking implementados no webhook do Stripe usando PostHog server-side.

---

## 🎯 **EVENTOS TRACKEADOS**

### ✅ **1. Pagamento Bem-Sucedido (Cartão de Crédito)**

#### **Evento:** `payment_completed`
**Descrição:** Pagamento realizado com sucesso via cartão de crédito  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `checkout.session.completed` com `payment_status === 'paid'`

**Properties:**
- `album_id` (string): ID do álbum
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares (convertido de centavos)
- `currency` (string): Moeda (BRL, USD, etc.)
- `gateway` (string): "stripe"
- `is_additional_photos` (boolean): Se é pagamento por fotos adicionais
- `additional_photos_count` (number): Quantidade de fotos adicionais
- `payment_type` (string): "credit_card"
- `session_id` (string): ID da sessão do Stripe

**Exemplo:**
```javascript
{
  event: 'payment_completed',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'credit_card',
    amount: 14.90,
    currency: 'BRL',
    gateway: 'stripe',
    is_additional_photos: false,
    additional_photos_count: 0,
    payment_type: 'credit_card',
    session_id: 'cs_test_...'
  }
}
```

---

### 💳 **2. Boleto Gerado**

#### **Evento:** `boleto_generated`
**Descrição:** Boleto foi gerado para pagamento  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `checkout.session.completed` com `payment_status === 'unpaid'` e `payment_intent` presente

**Properties:**
- `album_id` (string): ID do álbum
- `session_id` (string): ID da sessão do Stripe
- `payment_intent_id` (string): ID do payment intent
- `amount` (number | null): Valor em reais/dólares
- `currency` (string): Moeda
- `has_voucher_url` (boolean): Se tem URL do boleto

**Exemplo:**
```javascript
{
  event: 'boleto_generated',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    session_id: 'cs_test_...',
    payment_intent_id: 'pi_...',
    amount: 14.90,
    currency: 'BRL',
    has_voucher_url: true
  }
}
```

---

### ✅ **3. Pagamento Boleto Confirmado**

#### **Evento:** `payment_completed`
**Descrição:** Pagamento por boleto foi confirmado  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `checkout.session.async_payment_succeeded` com `payment_status === 'paid'`

**Properties:**
- `album_id` (string): ID do álbum
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares
- `currency` (string): Moeda
- `gateway` (string): "stripe"
- `is_additional_photos` (boolean): Se é pagamento por fotos adicionais
- `additional_photos_count` (number): Quantidade de fotos adicionais
- `payment_type` (string): "boleto"
- `session_id` (string): ID da sessão do Stripe

**Exemplo:**
```javascript
{
  event: 'payment_completed',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'boleto',
    amount: 14.90,
    currency: 'BRL',
    gateway: 'stripe',
    is_additional_photos: false,
    additional_photos_count: 0,
    payment_type: 'boleto',
    session_id: 'cs_test_...'
  }
}
```

**Nota:** Mesmo evento `payment_completed`, mas com `payment_type: 'boleto'` para diferenciar.

---

### ⏰ **4. Checkout Expirado**

#### **Evento:** `checkout_expired`
**Descrição:** Sessão de checkout expirou antes do pagamento  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `checkout.session.expired` com `payment_status === 'unpaid'`

**Properties:**
- `album_id` (string): ID do álbum
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares
- `currency` (string): Moeda
- `session_id` (string): ID da sessão do Stripe
- `expiration_reason` (string): "session_timeout"

**Exemplo:**
```javascript
{
  event: 'checkout_expired',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'credit_card',
    amount: 14.90,
    currency: 'BRL',
    session_id: 'cs_test_...',
    expiration_reason: 'session_timeout'
  }
}
```

---

### ❌ **5. Falha de Pagamento (Boleto)**

#### **Evento:** `payment_failed`
**Descrição:** Boleto não foi pago e expirou  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `checkout.session.async_payment_failed` com `payment_status === 'unpaid'`

**Properties:**
- `album_id` (string): ID do álbum
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares
- `currency` (string): Moeda
- `payment_type` (string): "boleto"
- `failure_reason` (string): "boleto_expired"
- `session_id` (string): ID da sessão do Stripe

**Exemplo:**
```javascript
{
  event: 'payment_failed',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'boleto',
    amount: 14.90,
    currency: 'BRL',
    payment_type: 'boleto',
    failure_reason: 'boleto_expired',
    session_id: 'cs_test_...'
  }
}
```

---

### ❌ **6. Falha de Payment Intent (Cartão)**

#### **Evento:** `payment_failed`
**Descrição:** Pagamento com cartão de crédito falhou  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `payment_intent.payment_failed`

**Properties:**
- `album_id` (string | null): ID do álbum (pode ser null)
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares
- `currency` (string): Moeda
- `payment_type` (string): "credit_card"
- `failure_reason` (string): Mensagem de erro do Stripe
- `failure_code` (string | null): Código de erro do Stripe
- `payment_intent_id` (string): ID do payment intent

**Exemplo:**
```javascript
{
  event: 'payment_failed',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'credit_card',
    amount: 14.90,
    currency: 'BRL',
    payment_type: 'credit_card',
    failure_reason: 'Your card was declined.',
    failure_code: 'card_declined',
    payment_intent_id: 'pi_...'
  }
}
```

---

### 🚫 **7. Pagamento Cancelado**

#### **Evento:** `payment_canceled`
**Descrição:** Usuário cancelou o pagamento  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `payment_intent.canceled`

**Properties:**
- `album_id` (string | null): ID do álbum (pode ser null)
- `payment_id` (string): ID do pagamento no banco
- `payment_method` (string): Método de pagamento
- `amount` (number): Valor em reais/dólares
- `currency` (string): Moeda
- `payment_type` (string): "credit_card"
- `cancellation_reason` (string): "user_canceled"
- `payment_intent_id` (string): ID do payment intent

**Exemplo:**
```javascript
{
  event: 'payment_canceled',
  distinctId: 'user_123',
  properties: {
    album_id: 'abc123',
    payment_id: 'pay_xyz',
    payment_method: 'credit_card',
    amount: 14.90,
    currency: 'BRL',
    payment_type: 'credit_card',
    cancellation_reason: 'user_canceled',
    payment_intent_id: 'pi_...'
  }
}
```

---

### 📋 **8. Subscrição Cancelada**

#### **Evento:** `subscription_canceled`
**Descrição:** Subscrição foi cancelada  
**Localização:** `apps/web/src/app/api/v1/webhooks/stripe/route.ts`  
**Trigger:** `customer.subscription.deleted`

**Properties:**
- `subscription_id` (string): ID da subscrição no Stripe
- `customer_id` (string | null): ID do cliente no Stripe
- `canceled_at` (string | null): Data/hora do cancelamento (ISO string)
- `cancellation_reason` (string): "user_requested"

**Exemplo:**
```javascript
{
  event: 'subscription_canceled',
  distinctId: 'user_123',
  properties: {
    subscription_id: 'sub_...',
    customer_id: 'cus_...',
    canceled_at: '2025-01-01T12:00:00.000Z',
    cancellation_reason: 'user_requested'
  }
}
```

---

## 📊 **RESUMO DE EVENTOS POR STATUS**

### **✅ Sucesso (2 eventos)**
1. `payment_completed` (credit_card)
2. `payment_completed` (boleto)

### **⏳ Em Processo (1 evento)**
1. `boleto_generated`

### **❌ Falha/Cancelamento (4 eventos)**
1. `checkout_expired`
2. `payment_failed` (boleto)
3. `payment_failed` (credit_card)
4. `payment_canceled`

### **📋 Outros (1 evento)**
1. `subscription_canceled`

---

## 🎯 **FUNIS SUGERIDOS PARA O POSTHOG**

### **Funil 1: Conversão de Pagamento (Cartão de Crédito)**

```
Passo 1: album_payment_initiated (client-side)
Passo 2: payment_completed (payment_type: 'credit_card')
```

**Breakdown sugerido:** `amount` (para ver valores que convertem mais)

**Objetivo:** Medir taxa de conversão de pagamentos com cartão de crédito.

---

### **Funil 2: Conversão de Pagamento (Boleto)**

```
Passo 1: album_payment_initiated (client-side)
Passo 2: boleto_generated
Passo 3: payment_completed (payment_type: 'boleto')
```

**Objetivo:** Medir taxa de conversão de pagamentos por boleto (gera → paga).

---

### **Funil 3: Análise de Abandono**

```
Passo 1: album_payment_initiated (client-side)
Passo 2: checkout_expired OU payment_canceled OU payment_failed
```

**Breakdown sugerido:** Por tipo de falha (`expiration_reason`, `failure_reason`, `cancellation_reason`)

**Objetivo:** Identificar principais causas de abandono no checkout.

---

### **Funil 4: Taxa de Sucesso vs Falha**

```
Passo 1: Qualquer evento de pagamento iniciado
Passo 2: payment_completed
Passo 3: payment_failed OU checkout_expired
```

**Comparar:** Taxa de sucesso vs taxa de falha

**Objetivo:** Monitorar saúde geral dos pagamentos.

---

## 📈 **INSIGHTS SUGERIDOS PARA O DASHBOARD**

### **1. Taxa de Conversão por Método de Pagamento**

**Tipo:** Métrica única (%)  
**Cálculo:**
- Cartão: `payment_completed (credit_card) / album_payment_initiated * 100`
- Boleto: `payment_completed (boleto) / boleto_generated * 100`

**Utilidade:** Comparar eficácia de cada método de pagamento.

---

### **2. Top Razões de Falha**

**Tipo:** Tabela  
**Evento:** `payment_failed`  
**Breakdown:** `failure_reason`  
**Ordenar por:** Total count (descendente)  
**Período:** Últimos 30 dias

**Utilidade:** Identificar problemas recorrentes (cartão recusado, saldo insuficiente, etc.).

---

### **3. Receita por Método de Pagamento**

**Tipo:** Gráfico de Barras  
**Evento:** `payment_completed`  
**Breakdown:** `payment_type`  
**Métrica:** Soma de `amount`  
**Período:** Últimos 7 dias

**Utilidade:** Ver qual método gera mais receita.

---

### **4. Taxa de Expiração de Checkout**

**Tipo:** Métrica única (%)  
**Cálculo:** `checkout_expired / (checkout_expired + payment_completed) * 100`  
**Período:** Últimos 7 dias

**Utilidade:** Medir quantos usuários não completam o checkout a tempo.

---

### **5. Tempo Médio entre Boleto Gerado e Pago**

**Tipo:** Métrica única (horas)  
**Cálculo:** Diferença entre `boleto_generated` e `payment_completed (boleto)`  
**Período:** Últimos 30 dias

**Utilidade:** Entender comportamento de pagamento via boleto.

---

### **6. Distribuição de Valores Pagos**

**Tipo:** Histograma  
**Evento:** `payment_completed`  
**Propriedade:** `amount`  
**Buckets:** 0-10, 10-20, 20-50, 50-100, 100+  
**Período:** Últimos 30 dias

**Utilidade:** Ver distribuição de valores pagos.

---

## 🔍 **QUERIES ÚTEIS PARA O POSTHOG**

### **Query 1: Taxa de Conversão Boleto**

```sql
-- Calcular taxa de conversão: boleto_generated -> payment_completed (boleto)
SELECT 
  COUNT(DISTINCT CASE WHEN event = 'payment_completed' AND properties->>'payment_type' = 'boleto' THEN distinct_id END) * 100.0 / 
  COUNT(DISTINCT CASE WHEN event = 'boleto_generated' THEN distinct_id END) AS conversion_rate
FROM events
WHERE timestamp > now() - interval '30 days'
  AND event IN ('boleto_generated', 'payment_completed')
```

---

### **Query 2: Receita Total por Método**

```sql
SELECT 
  properties->>'payment_type' AS payment_type,
  SUM((properties->>'amount')::numeric) AS total_revenue,
  COUNT(*) AS payment_count
FROM events
WHERE event = 'payment_completed'
  AND timestamp > now() - interval '30 days'
GROUP BY payment_type
ORDER BY total_revenue DESC
```

---

### **Query 3: Top 10 Razões de Falha**

```sql
SELECT 
  properties->>'failure_reason' AS failure_reason,
  COUNT(*) AS failure_count,
  AVG((properties->>'amount')::numeric) AS avg_amount
FROM events
WHERE event = 'payment_failed'
  AND timestamp > now() - interval '30 days'
GROUP BY failure_reason
ORDER BY failure_count DESC
LIMIT 10
```

---

## 🎨 **DASHBOARD SUGERIDO: "Pagamentos e Monetização"**

### **Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  Funil: Conversão Pagamento (Cartão vs Boleto)              │
│  (Side-by-side comparison)                                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│  Taxa Conversão Cartão   │  Taxa Conversão Boleto           │
│  (Métrica única %)       │  (Métrica única %)               │
└──────────────────────────┴──────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────┐
│  Receita por Método      │  Taxa Expiração Checkout         │
│  (Gráfico de Barras)     │  (Métrica única %)               │
└──────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Top Razões de Falha                                       │
│  (Tabela)                                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Distribuição de Valores                                    │
│  (Histograma)                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ **CHECKLIST DE VERIFICAÇÃO**

- [x] Import do PostHogClient adicionado
- [x] Tracking em todos os eventos críticos
- [x] Shutdown do cliente após cada uso
- [x] Properties consistentes e informativos
- [x] Conversão de valores de centavos para reais/dólares
- [x] Tratamento de valores null/undefined
- [x] Sem erros de lint
- [x] Documentação completa

---

## 📝 **NOTAS TÉCNICAS**

### **Arquitetura:**
- ✅ Uso do PostHog server-side (`posthog-node`)
- ✅ Cliente criado e destruído a cada evento (evita memory leaks)
- ✅ `distinctId` vem do `metadata.userId` do Stripe
- ✅ Valores convertidos de centavos para unidade monetária

### **Performance:**
- ✅ `flushAt: 1` e `flushInterval: 0` para envio imediato
- ✅ `await posthog.shutdown()` após cada uso
- ✅ Tracking não bloqueia processamento do webhook

### **Segurança:**
- ✅ Apenas eventos verificados pelo Stripe são processados
- ✅ Nenhum dado sensível (número de cartão, etc.) é trackeado
- ✅ Apenas IDs e metadados seguros são enviados

---

## 🚨 **IMPORTANTE**

1. **DistinctId:** Sempre use `userId` do metadata do Stripe. Se não estiver disponível, o evento não é trackeado.

2. **Valores:** Todos os valores são convertidos de centavos para unidade monetária (`amount / 100`).

3. **Payment Type:** Use `payment_type: 'credit_card'` ou `'boleto'` para diferenciar métodos no mesmo evento `payment_completed`.

4. **Shutdown:** **SEMPRE** chame `await posthog.shutdown()` após usar o cliente para evitar memory leaks.

---

**Última atualização:** 01/11/2025  
**Versão:** 1.0  
**Autor:** Implementação PostHog - Polotrip

