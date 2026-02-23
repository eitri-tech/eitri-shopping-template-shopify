# Eitri Shopping Template — Shopify

Template de e-commerce mobile-first para Shopify, construído com o ecossistema Eitri (Luminus UI + Bifrost).

## Eitri-Apps

O projeto é composto por 5 Eitri-Apps independentes:

| App                                 | Versão | Descrição                                                                           |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| `shopping-shopify-template-shared`  | 0.1.3  | Shared app com componentes, serviços e contextos reutilizáveis entre os demais apps |
| `shopping-shopify-template-home`    | 0.1.7  | Vitrine principal: home, categorias, catálogo de produtos e busca                   |
| `shopping-shopify-template-pdp`     | 0.1.7  | Página de detalhe do produto (Product Detail Page)                                  |
| `shopping-shopify-template-cart`    | 0.1.6  | Carrinho de compras e checkout                                                      |
| `shopping-shopify-template-account` | 0.1.0  | Área do cliente: login, perfil, pedidos e endereços                                 |

### Rotas por App

**`shopping-shopify-template-home`**

- `/Home` — Vitrine principal
- `/Categories` — Listagem de categorias
- `/ProductCatalog` — Catálogo / listagem de produtos
- `/Search` — Busca
- `/SignIn` — Login
- `/SignUp` — Cadastro

**`shopping-shopify-template-pdp`**

- `/Home` — Detalhe do produto

**`shopping-shopify-template-cart`**

- `/Home` — Carrinho de compras

**`shopping-shopify-template-account`**

- `/Home` — Dashboard da conta
- `/Profile` — Visualização do perfil
- `/EditProfile` — Edição do perfil
- `/Orders` — Listagem de pedidos
- `/Order/:id` — Detalhe do pedido
- `/Addresses` — Endereços cadastrados

## Como rodar

Cada app é executado individualmente. Acesse o diretório do app desejado e execute:

```bash
# Compilação e teste local
eitri start

# Deploy (lembre de incrementar o `version` no eitri-app.conf.js antes)
eitri push-version
```

Exemplo para rodar o app de home:

```bash
cd shopping-shopify-template-home
eitri start
```

## Configuração — Remote Config

Para utilizar este template, configure as seguintes variáveis no Remote Config da sua aplicação Eitri:

```json
{
	"providerInfo": {
		"host": "https://my-store.myshopify.com",
		"storefrontAccessToken": "",
		"clientId": "",
		"callbackUrl": "myapp://auth/callback",
		"apiVersion": "2026-01"
	}
}
```

### Descrição dos campos

| Campo                                | Obrigatório | Descrição                                                                |
| ------------------------------------ | ----------- | ------------------------------------------------------------------------ |
| `providerInfo.host`                  | Sim         | URL da loja Shopify                                                      |
| `providerInfo.storefrontAccessToken` | Sim         | Token da Storefront API — Shopify Admin → Apps → Storefront API          |
| `providerInfo.clientId`              | Sim         | Client ID da Customer Account API — Shopify Admin → Customer Account API |
| `providerInfo.callbackUrl`           | Sim         | Deep link de redirect após autenticação OAuth                            |
| `providerInfo.apiVersion`            | Não         | Versão da Storefront API. Default: `"2026-01"`                           |

#### Escopos necessários para o `clientId`

Ao configurar o cliente na Customer Account API, habilite o escopo `customer_read_customers`. Ele concede acesso ao objeto `Customer`, que contém os dados de pedidos, endereços e perfil usados por este template.

#### Como encontrar o `callbackUrl`

Você pode obter esse valor pelo painel do Shopify Admin, na seção da Customer Account API. Uma alternativa mais rápida é acessar a página de login da loja pelo navegador e inspecionar a URL — ela contém múltiplos parâmetros `redirect_uri`. O valor correto é o que traz uma URL completa (não um caminho relativo).

Exemplo de URL de login (dados fictícios):

```
https://account.my-store.com/authentication/login
  ?client_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
  &locale=pt-BR
  &redirect_uri=/authentication/oauth/authorize
    ?client_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
    &locale=pt-BR
    &nonce=00000000-1111-2222-3333-444444444444
    &redirect_uri=https%3A%2F%2Faccount.my-store.com%2Fcallback   ← este é o callbackUrl
    &region_country=BR
    &response_type=code
    &scope=openid+email+customer-account-api%3Afull
    &state=AAAAAAAAAAAAAAAAAAAAAAAAA
  &region_country=BR
```

No exemplo acima, o `callbackUrl` é `https://account.my-store.com/callback`.

## Autenticação

O login do cliente é realizado via **OAuth 2.0 com PKCE** através da Shopify Customer Account API, utilizando o método `Shopify.customer.auth.login()` do SDK.

### Fluxo

1. O app abre um web flow para o usuário autenticar-se no Shopify.
2. Após o retorno (redirecionamento pelo `callbackUrl`), o código de autorização é trocado por tokens de acesso, refresh e ID.
3. Os tokens são salvos automaticamente no armazenamento do dispositivo.

### Retorno

O método retorna um objeto `LoginResponse`:

| Campo     | Tipo      | Descrição                                              |
| --------- | --------- | ------------------------------------------------------ |
| `success` | `boolean` | `true` se autenticado com sucesso, `false` caso erro   |
| `data`    | `object`  | Tokens (presente quando `success: true`)               |
| `error`   | `string`  | Descrição do erro (presente quando `success: false`)   |

### Variáveis de Remote Config necessárias

| Campo                    | Descrição                                              |
| ------------------------ | ------------------------------------------------------ |
| `providerInfo.host`      | URL da loja Shopify                                    |
| `providerInfo.clientId`  | Client ID da Customer Account API                      |
| `providerInfo.callbackUrl` | Deep link de redirect após a autenticação OAuth      |

## Dependências compartilhadas

Todos os apps consomem dois shared apps como base:

- `eitri-shopping-shopify-shared` `v0.3.0` — serviços e integrações com a Shopify API
- `shopping-shopify-template-shared` `v0.1.3` — componentes e utilitários internos do template
