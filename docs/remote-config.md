# Remote Config

O Remote Config da aplicação fica no [Eitri Console](https://console.eitri.tech). O template lê dele os dados de conexão com a Shopify e algumas configurações visuais. A maior parte de `providerInfo` não é lida diretamente pelo código do template, e sim pela lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared), que todos os Eitri-Apps usam.

## Exemplo

```json
{
	"providerInfo": {
		"host": "https://my-store.myshopify.com",
		"storefrontAccessToken": "",
		"clientId": "",
		"callbackUrl": "myapp://auth/callback",
		"apiVersion": "2026-01",
		"cmsUrl": "https://..."
	},
	"appConfigs": {
		"headerLogo": "https://.../logo.png",
		"headerScrollEffect": true
	}
}
```

## `providerInfo`

Dados de conexão com a loja Shopify.

| Campo | Obrigatório | Tipo | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `host` | Sim | string (URL) | URL da loja Shopify | Lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared): chamadas à Shopify e login |
| `storefrontAccessToken` | Sim | string | Token da Storefront API (Shopify Admin → Apps → Storefront API) | Lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared) |
| `clientId` | Sim | string | Client ID da Customer Account API (Shopify Admin → Customer Account API) | Lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared): login OAuth e renovação do token |
| `callbackUrl` | Sim | string (URL ou deep link) | URL de redirect após a autenticação OAuth | Lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared): login |
| `apiVersion` | Não | string | Versão da Storefront API. Default: `"2026-01"` | Lib [`eitri-shopping-shopify-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-shopify-shared) |
| `cmsUrl` | Sim, para ter conteúdo na Home e em Categorias | string (URL) | URL do CMS que fornece as seções das páginas. A resposta deve conter `data.docs[]`, e cada documento tem um `type` (`home` ou `category`) e as suas `sections`. Sem esse campo, a Home e as Categorias ficam sem conteúdo | `shopping-shopify-template-home`: `src/services/cmsService.ts` |

### Escopos necessários para o `clientId`

Ao configurar o cliente na Customer Account API, habilite o escopo `customer_read_customers`. Ele concede acesso ao objeto `Customer`, que contém os dados de pedidos, endereços e perfil usados por este template.

### Como encontrar o `callbackUrl`

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

## `appConfigs`

Aparência do app.

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `headerLogo` | string (URL de imagem) | sem logo | Logo exibido no header principal | `shopping-shopify-template-shared`: `HeaderLogo` (usado no header da home) |
| `headerScrollEffect` | boolean | `false` | Esconde o header ao rolar a tela. A configuração vale só nas telas cujo header não define o efeito no próprio código. Hoje a PDP sempre usa o efeito, independentemente desse valor | `shopping-shopify-template-shared`: `HeaderContentWrapper` (home, cart e account) |
