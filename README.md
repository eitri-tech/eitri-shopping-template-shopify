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

Esse comando sobe o app completo, com todos os Eitri-Apps listados em [`app-config.yaml`](app-config.yaml) e a simulação da bottom tab definida no mesmo arquivo.

### Um Eitri-App isolado

Também é possível rodar um único Eitri-App. Acesse o diretório dele e execute:

```bash
cd shopping-shopify-template-home
eitri start
```

### Publicação

Para publicar uma nova versão, incremente o `version` no `eitri-app.conf.js` do app e faça push para a `main`. A CI cuida da publicação (veja [docs/ci.md](docs/ci.md)).

## Configuração — Remote Config

As configurações da loja ficam no Remote Config da aplicação, acessível pelo [Eitri Console](https://console.eitri.tech). Ele já vem com diversas configurações prontas para uso pelo template: dados de conexão com a Shopify (Storefront API e Customer Account API), URL do CMS e aparência do header.

A descrição de cada configuração está em [docs/remote-config.md](docs/remote-config.md).

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
