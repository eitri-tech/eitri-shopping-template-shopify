# Eitri Shopping Template — Shopify

Template de e-commerce para Shopify, construído com o ecossistema Eitri (Luminus UI + Bifrost).

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

Pré-requisito: [`eitri-cli`](https://www.npmjs.com/package/eitri-cli) instalado e autenticado.

```bash
npm install -g eitri-cli
eitri login
```

### App completo (recomendado)

Na raiz do repositório, execute:

```bash
eitri app start
```

Esse comando sobe o app completo, com todos os Eitri-Apps listados em [`app-config.yaml`](app-config.yaml) e a simulação da bottom tab definida no mesmo arquivo. A aparência da bottom bar simulada fica em [`dynamic-bottom-tab-view-spec.json`](dynamic-bottom-tab-view-spec.json).

### Um Eitri-App isolado

Também é possível rodar um único Eitri-App. Acesse o diretório dele e execute:

```bash
cd shopping-shopify-template-home
eitri start
```

### Publicação

Para publicar uma nova versão, incremente o `version` no `eitri-app.conf.js` do app e faça push para a `main`. A CI cuida da publicação (veja [docs/ci.md](docs/ci.md)).

## Configuração — Remote Config

As configurações da loja ficam no Remote Config da aplicação, acessível pelo [Eitri Console](https://console.eitri.tech). Ele já vem com diversas configurações prontas para uso pelo template: dados de conexão com a Shopify (Storefront API e Customer Account API), URL do CMS, aparência do header e a [bottom bar](docs/remote-config.md#eitriconfig) do app.

A descrição de cada configuração está em [docs/remote-config.md](docs/remote-config.md).

## Configuração crítica — App headless na Shopify

Antes de preencher o Remote Config, é necessário criar um app do tipo **Headless** no painel da loja Shopify. Esse app é a fonte dos três campos de credenciais do `providerInfo`.

> **Por que um app headless exclusivo?** A Shopify atribui cada pedido ao canal que gerou o carrinho — que é o app dono do `storefrontAccessToken`. Com um headless próprio, as vendas do app aparecem separadas do site nos relatórios e na lista de pedidos. Reutilizar o token do tema ou de outro canal mistura as vendas irreversivelmente.

### 1. Criar o app headless

No painel do Shopify Admin da loja:

1. No menu lateral, acesse **Canais de vendas > Headless**
2. Crie uma nova vitrine virtual pelo canal **Headless**
3. Renomeie para **"App Eitri"** (ou o nome do app da marca)

A URL do app criado será: `admin.shopify.com/store/<loja>/headless/<id>`

### 2. Obter o `storefrontAccessToken`

Na página do app, clique em **Gerenciar** na seção **API Storefront**.

Copie o **Token de acesso público** (hash hexadecimal).

> **Nunca use o token de acesso privado** (começa com `shpat_`). Ele é server-side only e não deve ser exposto no app.

Cole o valor em `providerInfo.storefrontAccessToken` no Remote Config.

### 3. Obter o `clientId` e o `callbackUrl`

Na página do app, clique em **Gerenciar** na seção **API de conta de cliente**.

| Seção na página | Campo | Remote Config |
| --- | --- | --- |
| **Credenciais da API de Conta de Cliente** | ID do cliente | `providerInfo.clientId` |
| **Configuração do app** | URL de callback | `providerInfo.callbackUrl` |

### Resumo — origem de cada credencial

| Remote Config | Origem no painel Shopify |
| --- | --- |
| `providerInfo.storefrontAccessToken` | App headless → API Storefront → Token de acesso **público** |
| `providerInfo.clientId` | App headless → API de conta de cliente → Credenciais → ID do cliente |
| `providerInfo.callbackUrl` | App headless → API de conta de cliente → Configuração do app → URL de callback |

---

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

### Remote Config necessário

O login usa `providerInfo.host`, `providerInfo.clientId` e `providerInfo.callbackUrl`. Veja [docs/remote-config.md](docs/remote-config.md).

## Dependências compartilhadas

Todos os apps consomem dois shared apps como base:

- [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared) `v0.3.0` — serviços e integrações com a Shopify API
- `shopping-shopify-template-shared` `v0.1.3` — componentes e utilitários internos do template

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [CI — Publicação automática de versões](docs/ci.md) | Como a pipeline (GitHub Actions e Bitbucket Pipelines) verifica e publica as versões dos Eitri-Apps, e o que é preciso configurar para ela funcionar |
| [Remote Config](docs/remote-config.md) | Todas as configurações do Remote Config lidas pelo template, com tipo, default e onde cada uma é usada |
