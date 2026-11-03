# Entrada HTTPS do Habiita

Endereço configurado: **https://habiita.com.br/open/**.

O mesmo endereço é usado no QR Code do desktop e nos botões móveis. Com App/Universal Links verificados, o sistema pode entregar a URL diretamente ao app instalado. Quando a navegação continua no navegador, `/open/` identifica a plataforma e abre a URL da loja configurada após 1,8 s. Isso não é uma consulta da lista de apps instalados. Preferências do usuário, navegador e origem do toque podem manter o link no navegador mesmo com o app instalado; por isso o fallback também oferece “Já tenho o app”.

## O que já está implementado

- `open/index.html` e `src/open.tsx`: entrada estática independente da landing; não carrega a animação Rive.
- Seleção de loja Android/iOS, incluindo iPad com user agent de computador. Computadores mostram as lojas disponíveis, sem redirecionamento automático.
- Campos vazios não viram links inventados. Sem uma URL para o aparelho, a página informa que o download ainda não está disponível.
- Ao tocar em “Já tenho o app”, o redirecionamento pendente para a loja é cancelado. Retorno pelo histórico não inicia outro redirecionamento.
- `app-links.config.json`: domínio, URLs das lojas e identificadores públicos da assinatura.
- `npm run build`: gera apenas associações cujos identificadores foram preenchidos e validados. Não publica Team ID ou certificados fictícios.
- `npm run links:check`: validação estrita de prontidão; falha enquanto faltar algum dos quatro campos obrigatórios abaixo.
- O site é publicado inicialmente em `https://lucasmneves.github.io/habita-lp/`; o domínio próprio será ativado após configurar DNS, CNAME e build na raiz.

## Pendências para ativação

| Campo/etapa | Estado |
| --- | --- |
| Domínio | `habiita.com.br`, fornecido pelo usuário. DNS e hospedagem ainda não configurados nesta tarefa. |
| `iosStoreUrl` | Aguardando URL pública real na App Store. |
| `androidStoreUrl` | Aguardando URL pública real no Google Play. |
| `appleTeamId` | Aguardando Apple Developer Team ID de 10 caracteres. Verificar o prefixo real do App ID se a conta usar prefixo legado. |
| `androidCertificateFingerprints` | Aguardando SHA-256 do certificado que assina a versão distribuída. Com Play App Signing, usar o certificado de **assinatura do app**, não apenas o certificado de upload. |
| Publicação e build do app | O build nativo do app ainda não foi executado. |

O bundle/package confirmado é `com.lucasmneves.habita`. O `ascAppId` encontrado em `eas.json` é `6822100681`; isso não comprova publicação na loja. Não foi convertido em link de download sem confirmação.

## Arquivos de associação

Depois de preencher os dados em `app-links.config.json`:

```powershell
npm run links:check
npm run build
```

O gerador escreve:

- `public/.well-known/apple-app-site-association`: associa somente `/open` e `/open/` a `APPLE_TEAM_ID.com.lucasmneves.habita`.
- `public/.well-known/assetlinks.json`: associa o pacote Android aos fingerprints fornecidos.

Esses arquivos precisam responder diretamente com HTTP 200 no **domínio raiz**, em `https://habiita.com.br/.well-known/...`, sem autenticação ou redirecionamentos. Verificar JSON e `Content-Type: application/json` na hospedagem real, especialmente para AASA, que não tem extensão. Um `_headers` em um repositório GitHub Pages não configura cabeçalhos: se a resposta real não cumprir os requisitos, configurar o servidor/proxy do domínio para servir o arquivo corretamente antes de declarar a integração pronta.

Para ativar o domínio próprio, configure o DNS, adicione `public/CNAME` com `habiita.com.br`, altere o workflow para `VITE_BASE_PATH=/` e atualize canonical, OG, robots e sitemap. Depois configure o domínio em Settings → Pages e verifique HTTPS. O endereço `habiita.com.br/open/` usado pelo QR Code só funcionará após essa etapa.

## Alterações no app

Em `E:/Claude/Habita`:

- `app.json`: `ios.associatedDomains` inclui `applinks:habiita.com.br`.
- `app.json`: novo intent filter Android com `autoVerify` para os caminhos exatos `/open` e `/open/` em `habiita.com.br`.
- O filtro existente de `habita-bff.onrender.com/reset-password` foi preservado.
- `src/app/open.tsx`: retorna à rota inicial do aplicativo, que mantém a proteção de login/onboarding.
- `RootNavigator.tsx`: registra a entrada após os grupos protegidos para preservar a escolha da tela inicial.
- Testes de navegação incluem a nova rota e os estados sem sessão, com sessão e com onboarding pendente.

Essas alterações de associação exigem novo build nativo com provisioning/entitlements atualizados no iOS. Não basta uma atualização JavaScript para ativá-las nas instalações existentes. Nenhum `prebuild`, assinatura, submissão ou publicação foi executado aqui.

## Verificação em produção

1. Publicar a landing e os arquivos `.well-known`, configurar DNS/HTTPS e verificar as respostas HTTP/JSON.
2. Gerar/instalar um novo build do app com a configuração de domínio.
3. Android: `adb shell pm verify-app-links --re-verify com.lucasmneves.habita` e `adb shell pm get-app-links com.lucasmneves.habita`; conferir `habiita.com.br` como `verified`.
4. Abrir o link via câmera/mensagem em dispositivo físico com app instalado; confirmar login, onboarding ou Home conforme a sessão.
5. Sem o app instalado, confirmar a página e o encaminhamento para a loja correta. Em desktop, confirmar QR Code.
6. iOS: testar também a partir de Notas/Mensagens. Links do mesmo domínio tocados no Safari podem continuar na web; usar uma origem separada/subdomínio para os links é uma alternativa se esse comportamento impactar o fluxo. O subdomínio precisará da sua própria associação.

Referências: [Expo iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/), [Expo Android App Links](https://docs.expo.dev/linking/android-app-links/), [Apple — depuração](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links), [Google — certificados e associação](https://developer.android.com/training/app-links/configure-assetlinks).
