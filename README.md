# Habiita — landing page

Landing page estática em português, com React, TypeScript, Vite e CSS. Sem backend, coleta de dados, cookies, analytics ou cadastro. Node.js 24.

## Executar

```powershell
npm ci
npm run dev
```

Abra o endereço impresso pelo Vite. A configuração padrão serve o site na raiz `/`, como no domínio habiita.com.br.

```powershell
npm run lint
npm run typecheck
npm run build
npm run preview
```

`dist/` contém o site pronto para hospedagem. O WASM do Rive, fontes, logo e assets são servidos pelo próprio site, sem CDN de runtime.

## Configuração de destinos

O QR Code e os botões móveis usam `https://habiita.com.br/open/`. As URLs das lojas e os identificadores de assinatura ficam em `app-links.config.json`. Enquanto as lojas não tiverem URLs confirmadas, a página de fallback informa a indisponibilidade e mantém um botão manual `habita://` para quem já tem o app. Não há tentativa de inferir instalação por timeout.

A página `/open/` é uma entrada HTML independente; em iOS/Android, com a URL da loja cadastrada, redireciona em 1,8 s para a loja correspondente. O sistema operacional entrega o link diretamente ao app quando o domínio está verificado e o usuário não optou pela navegação web. No computador, mostra os destinos disponíveis. [Configuração e ativação completas](APP_LINKS.md).

Links opcionais de privacidade e redes sociais continuam em `src/data/site.ts`.

## Identidade e assets

- `public/assets/habiita-logo.png`: cópia binária do logo fornecido em Downloads, com transparência e proporções preservadas. Nenhuma reconstrução, recorte ou alteração da imagem original.
- `public/assets/hab.riv`: asset oficial atual de `E:/Claude/Habita/assets/hab/hab.riv`, sem alteração. Artboard `Hab`, state machine `HabMachine`, View Model `Hab`. O runtime utiliza `mood`, `stage`, `energy`, `reducedMotion`, `reaction` e `react`; `flameEyes` permanece desligado.
- `src/components/HabDrawing.tsx`: fallback SVG oficial do app, adaptado de React Native SVG para elementos SVG nativos da web. Geometria e cores preservadas. Aparece durante carregamento e em caso de falha do Rive.
- Fontes locais Plus Jakarta Sans 800 e Inter 400, as mesmas famílias do app. Licenças em `public/assets/*-LICENSE.txt`.
- Verde do mascote: `#8EE3C1`, `#2E7D6B`, `#1F5A4C`. Superfícies escuras do app: `#17111C`, `#211A28`; detalhes magenta `#E44BC7` e dourado `#E1AA40`. O verde principal da landing e os fundos claros complementam os tokens do app para atender ao briefing; não há afirmação de que o app tenha tema claro.
- Capturas antigas em `E:/Claude/visual-check` foram avaliadas, mas não utilizadas por estarem desatualizadas em relação ao mascote. A interface da landing é explicitamente **ilustrativa**, com dados de exemplo locais, e não uma screenshot do app. Somente funcionalidades verificadas no código/README do app são descritas.
- Favicon e compartilhamento derivados do fallback SVG oficial e do logo fornecido.

## Mascote e acessibilidade

O header permanece fixo no topo e o Hab animado fica à esquerda do logo. Seu canvas mantém dimensões constantes durante a rolagem; a superfície só é redimensionada quando a área real muda, com densidade limitada a 2×. O estágio permanece em 2, enquanto o humor acompanha a seção visível. A hero usa outra instância do Rive oficial: o Hab acena com a reação `welcomeBack` ao aparecer e repete o aceno com intervalo de oito segundos. Essa instância pausa fora da área visível e em abas ocultas; com movimento reduzido, não agenda acenos. O SVG oficial aparece apenas enquanto o arquivo carrega ou em caso de falha.

As falas aparecem por quatro segundos após tocar no Hab, com anúncio acessível e reação oficial `tap`. A faixa inferior e a coluna lateral reservadas ao mascote foram removidas. A página usa rolagem normal, com compensação para a altura do header nas âncoras. `prefers-reduced-motion` continua respeitado no CSS e no View Model do Rive, e o runtime pausa quando a aba fica oculta.

Há menu móvel com `aria-expanded`, fechamento por Escape, foco visível, link de salto, landmarks, botões semânticos, progresso acessível e diálogo nativo com contenção de foco/fechamento por Escape.

## Publicar no GitHub Pages

O repositório público é `lucasmneves/habita-lp`. O GitHub Actions em `.github/workflows/deploy.yml` valida e publica após push em `main`; pull requests apenas validam. A URL inicial é `https://lucasmneves.github.io/habita-lp/`, com `VITE_BASE_PATH=/habita-lp/`.

O domínio `habiita.com.br` ainda precisa de DNS. Quando estiver pronto, configure o CNAME, mude `VITE_BASE_PATH` para `/` e atualize canonical, OG, robots e sitemap. O QR Code já aponta para `https://habiita.com.br/open/`, que depende dessa configuração e dos dados de associação descritos em `APP_LINKS.md`.

A prévia local usa `/` por padrão. A integração nativa foi adicionada ao app em `E:/Claude/Habita`; ela depende dos identificadores de assinatura e de um novo build nativo.