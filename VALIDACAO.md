# Validação — 02/11/2026

## Resultado local

- Instalação concluída com npm e lockfile gerado.
- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado; saída `dist/`.
- Runtime Rive oficial carregado no navegador, com canvas visível, sem erros ou warnings na aba final.
- Assets WASM, Rive, fontes, favicon, imagem social e logo servidos localmente.
- Logo e Rive conferidos por SHA-256 contra os arquivos originais; conteúdo idêntico.

## Navegador

Verificação pela prévia real no navegador integrado, com screenshots locais na pasta ignorada `qa/`:

| Dimensão | Verificação |
| --- | --- |
| 320 × 740 | Sem overflow horizontal no documento nem na área rolável interna; header e CTAs alcançáveis. |
| 390 × 844 | Menu abre e fecha; Escape funciona; diálogo do CTA abre, contém foco e leva à demonstração. |
| 768 × 1024 | Composição do aplicativo e coluna de texto visíveis; faixa do mascote separada do conteúdo. |
| 1280 px / 1440 × 1000 | Hero, navegação, mascot rail, assets e layout desktop conferidos. |

Em 390 px e 768 px, o limite inferior da área de conteúdo coincide com o topo da faixa do mascote, sem sobreposição. Uma regra de especificidade que estreitava a faixa após a troca de seção foi corrigida e revalidada. O card de consistência também foi corrigido para 320 px; `scrollWidth === clientWidth` na área de conteúdo após a correção.

- Âncoras internas: todos os destinos existem no DOM.
- Imagens: nenhuma imagem quebrada na aba final.
- Navegação para a seção do app atualiza o mascote para `companion-3`.
- Marcar os três hábitos atualiza o progresso para 100% e anuncia a conclusão; desmarcar também funciona.
- As telas ilustrativas de progresso e conquistas abrem por botões acessíveis, sem perder o estado dos hábitos.
- Toque no Hab apresenta a frase contextual e aciona a reação oficial.
- Falas automáticas limitadas a uma ocorrência por seção/visita, com timeout de cinco segundos.
- `prefers-reduced-motion` implementado em CSS e no View Model Rive, incluindo listener de mudança em tempo real. A preferência do sistema operacional não foi alterada para testar essa condição; validação aqui é por inspeção do código e contrato do asset, não uma prova de execução nessa configuração.
- Não houve teste em dispositivo físico ou sessão de leitor de tela.

## Dependências

`npm audit --omit=dev --audit-level=moderate`: **0 vulnerabilidades** nas dependências de produção. A auditoria completa apontou 11 avisos moderados na árvore de ferramentas de desenvolvimento (ESLint/typescript-eslint/minimatch); não são incluídos no site publicado. Não foi aplicada uma substituição forçada e incompatível do linter sugerida pela auditoria.

## Publicação

**Adiada pelo usuário.** Repositório remoto não criado, push não executado, GitHub Actions não executado e URL pública ainda não publicada. O workflow está preparado e documentado no README, seguindo [o fluxo oficial do Vite para GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).

Conta GitHub confirmada com acesso à rede: `lucasmneves`. Nome planejado: `habiita-landing-page`; consulta à API retornou 404 antes da implementação. É necessário conferir novamente ao retomar a publicação.

Pendências: retomar criação do repositório e deploy quando solicitado; configurar `downloadUrl` assim que existir um destino público. Privacidade e redes sociais permanecem ausentes até existirem URLs confirmadas.

Build de produção servido com HTTP 200 para HTML, logo, Rive, favicon, imagem social e fontes. Conferido no navegador em 4173: Rive carregado, fontes disponíveis, sem imagens quebradas, sem overflow e sem mensagens de erro/aviso.

## Atualização — header fixo e animação do Hab

O header agora é fixo no topo e contém o Hab imediatamente à esquerda do logo, no desktop e no celular. A coluna lateral e a faixa móvel inferior foram removidas. O canvas mantém tamanho constante durante a rolagem, sem transições de posição, largura ou estágio; seu buffer só é redimensionado se a área real mudar, com densidade máxima de 2×. O arquivo Rive original permanece intacto. Falas aparecem apenas ao tocar no personagem.

Lint, typecheck e build aprovados após a alteração. Conferido no navegador em desktop (1280 px) e celular (390 px): header em `top: 0` após rolagem, Hab à esquerda do logo, canvas de 60×70 / 48×60 px estável, sem overflow horizontal e sem erros/warnings. Menu móvel e navegação entre seções funcionam. Esta verificação confirma layout e carregamento, não constitui um benchmark de FPS em todos os dispositivos. Evidência: `qa/header-fixed.jpg`.

## Atualização — QR Code e deeplink

Destino único configurado em `src/data/site.ts`: `habita://`. Acima de 800 px, todos os CTAs de conhecer o Habiita abrem um diálogo acessível com QR Code SVG gerado localmente por `qrcode.react`, com margem de quatro módulos. Até 800 px, os CTAs são links diretos “Abrir o Habiita” para o mesmo destino. Um diálogo aberto também se adapta caso a janela passe para a largura móvel.

Lint, typecheck e build aprovados. Verificação no navegador: diálogo desktop com QR visível e sem rolagem interna em 1280×720; em 390 px, QR oculto e botões móveis com `href="habita://"`; sem erros ou warnings. A abertura no app instalado e a leitura com uma câmera física não foram testadas nesta máquina. Evidências: `qa/desktop-qrcode.jpg` e `qa/mobile-deeplink.jpg`.

A pendência antiga de `downloadUrl` foi substituída pelo deeplink fornecido. Publicação continua adiada.

## Atualização — 03/11/2026 — App/Universal Links

Configurado o destino `https://habiita.com.br/open/` no QR e no botão móvel. Criada entrada HTML independente de fallback, com identificação de plataforma, encaminhamento para a loja quando houver URL cadastrada, cancelamento após escolha manual de abrir o app e proteção contra ciclo no histórico. Sem URLs de loja, a página informa que o download ainda não está disponível. Não tenta detectar instalação por timeout.

Landing: lint e typecheck aprovados; quatro testes aprovados (associações restritas, dados ausentes, entradas inválidas e identificação de plataforma); build multi-page aprovado. A validação estrita `npm run links:check` falha intencionalmente porque faltam Apple Team ID, fingerprints Android e as duas URLs das lojas, confirmados como indisponíveis pelo usuário. Nenhum arquivo `.well-known` com identificadores fictícios foi gerado.

App em `E:/Claude/Habita`: TypeScript e lint dos arquivos alterados aprovados; 23 testes de navegação aprovados, incluindo entrada HTTPS sem sessão, com sessão e com onboarding pendente. O filtro de recuperação de senha permanece presente. `git diff --check` aprovado. Alterados somente app.json, RootNavigator.tsx, seu teste e a nova rota src/app/open.tsx. Não houve commit, push ou build nativo.

Navegador local: página de fallback carregou, retorno à landing funcionou, QR e botão móvel apontam para o endereço HTTPS correto e botão manual mantém `habita://`. Sem erros/warnings e sem overflow em 390 px. A página de fallback não carrega o bundle Rive. Screenshots em `qa/https-fallback.jpg` e `qa/https-qrcode.jpg`.

A ativação em produção ainda depende de DNS/hospedagem/HTTPS, publicação, preenchimento das URLs e dados de assinatura, geração/validação HTTP dos arquivos de associação e instalação de novo build nativo. Nenhum teste em dispositivo físico ou em loja foi possível. Detalhes: APP_LINKS.md.

A prévia final passou a usar a raiz http://127.0.0.1:4173/ (mesma base do domínio próprio); /open/ e assets foram revalidados após o build com VITE_BASE_PATH=/. QR final conferido com destino HTTPS e diálogo sem rolagem interna. A abertura em app/lojas reais permanece não testada pelos dados indisponíveis.

## Atualização — 03/11/2026 — Hab acenando na hero

Substituída a ilustração SVG estática por uma instância do Rive oficial em HeroHab.tsx. Usa a reação welcomeBack (aceno), com primeira execução após 350 ms de preparação e repetição em intervalos de oito segundos. Mantém dimensões estáveis, pausa quando sai da área visível ou a aba fica oculta e não agenda acenos com prefers-reduced-motion. O SVG oficial permanece como fallback de carregamento/erro. A instância do header foi preservada.

Lint, typecheck e build aprovados. Runtime da hero carregado no navegador em 1280 e 390 px; sem overflow e sem erros/warnings. A geometria e o arquivo Rive original não foram alterados. Preferência de movimento reduzido conferida por inspeção da implementação/contrato, sem alterar a preferência do sistema. Evidência: qa/hero-wave.jpg.

## Redesign visual — 2026-11-03
- Direção inspirada na referência Nagomi: header fixo flutuante, hero verde profundo, acentos lima, títulos amplos, formas orgânicas e contraste entre seções.
- Conteúdo e ordem das seções preservados. Hab oficial Rive mantido no header e na hero.
- CSS em src/styles/modern.css; entradas suaves via IntersectionObserver/Web Animations, canceladas com prefers-reduced-motion. Conteúdo permanece visível sem animações.
- Build (inclui TypeScript) e lint aprovados. Navegador: desktop 1280 px, mobile 390 px e 320 px sem overflow horizontal; menu abre/fecha; QR usa https://habiita.com.br/open/; hábito interativo atualiza para 33%; sem erros/warnings no console.
- Nenhuma imagem externa gerada, dependência adicionada ou publicação realizada. URLs das lojas e identificadores de associação continuam pendentes.
