# Episódio 1 — integração incremental dos recursos fornecidos

## Abrir no editor

Estúdio de Vídeos → **Episódio 1 · 60 PNGs e montagem**. O painel permite inspecionar o alfa, pesquisar nomes e grupos, importar os originais para a conta, abrir os protótipos individuais, **Campo de Treino**, **Arena de Batalha** ou **Episódio 1 — Treino e Primeiro Confronto**. São novos projetos editáveis, nunca substituições de projetos guardados. A importação requer a sessão normal da conta. Sem sessão, o catálogo e a inspeção de protótipos do pacote continuam disponíveis, claramente separados dos recursos importados.

## Implementado

- 60 PNGs originais copiados byte a byte do ZIP. Manifesto original e README preservados em public/ep01. Inventário medido em lib/video/episode-manifest.json: 25 Arqueira A3, 16 P.E.K.K.A., 1 Mãe/Mentora, 16 Cenários e 2 Efeitos. SHA-256 e dimensões conferidos para todos. Total: 82 235 345 bytes. Nenhuma imagem redesenhada ou reconstruída por IA.
- Catálogo por grupo e nome, inspeção sobre xadrez, dimensões, alfa real, origem, hash, avisos de espelhamento e estado protótipo.
- Importação sequencial autenticada para R2/D1 usando a API existente. Progresso e resultado por ficheiro, cancelamento e retoma. Identidade estável por conta + identificador original + hash; cópias espelháveis com bytes iguais continuam recursos individuais. Novos metadados não substituem versões anteriores.
- Metadados específicos são registos internos de kind video-asset-meta na tabela existente, associados ao recurso/owner; escrita em lote atómica juntamente com a linha do recurso. Não houve migração destrutiva nem recriação de tabelas. O endpoint do dashboard filtra estes registos internos, mantendo os tipos anteriores.
- Arqueira: proposta com 16 peças reais; P.E.K.K.A.: proposta com 14. As peças usam recortes do original, landmarks propostos e escala uniforme. Originais e resolução permanecem intactos. Limites medidos de alfa e de conteúdo são separados; não são contornos artisticamente aprovados.
- Articulação → textura usa o mesmo skinMatrix no SVG e no renderizador Canvas/MP4. Novo flipX opcional por peça, compatível com projetos antigos, aplicado uma única vez às cópias do manifesto e editável. Coordenadas da peça, ordem, ossos, limites e pivôs continuam editáveis no RigEditor existente. A associação não desenha a imagem-mestra por cima da animação.
- Comparação da imagem-mestra com slider de opacidade exclusivamente no modo Preparação. O modo Animação não tem essa sobreposição.
- Cenários em camadas independentes, fundos em cover uniforme para 1080×1920, sem deformação. Propriedades e enquadramento editáveis. Guias 9:16 opcionais na prévia, não exportadas.
- Demonstração de 24 s: treino com mãe inteira e Arqueira por peças; arco/flecha PNGs, trajetória e colisão; efeito PNG de impacto; corte para arena; P.E.K.K.A. por peças, aproximação, espada ligada à mão, golpe e recuo; fissura/poeira independentes. Faixa gameplay vazia, identificada para importação de vídeo real. Nenhuma gameplay ou áudio inventados.
- Persistência usa o documento/API existentes; JSON guarda as peças, flipX, recortes, pivôs, ligações, keyframes, cenários e câmara. Rigs podem ser guardados na biblioteca de preparados pelo comando existente.

## Estado de aceitação

| Recurso | Estado | Limite |
|---|---|---|
| 60 originais | Auditados e disponíveis no pacote | Importação na conta real ainda não executada nesta sessão |
| Arqueira A3 | Montada como protótipo; movimento visual IK verificado | Encaixes de anca/coxa, joelhos/botas, ombros e punhos por rever; poses extremas não aprovadas |
| P.E.K.K.A. | Montada como protótipo; renderizada na cena | Proporções e ombreiras, encaixes dos membros e pivô/ângulo da espada por ajustar artisticamente |
| Mãe/Mentora | Imagem inteira | Rig avançado indisponível; não existem peças próprias no pacote |
| Campo de Treino/Arena | Presets editáveis | Composição artística e profundidade por afinar |
| Arco/flecha/espada | Objetos separados com sistemas existentes de ligação e trajetória | Peças têm margens e perspetivas próprias; pega, corda e orientação visual da flecha exigem revisão. O disparo não foi aprovado artisticamente |
| Demonstração | Timeline funcional de inspeção, não episódio final aprovado | Faltam aprovação de encaixes, expressões/mãos por keyframe e acabamento das ações |

## Testes efetivamente executados

**Antes das alterações:** test-director, test-skin-binding e test-scene-interactions passaram.

**Depois:** TypeScript e git diff --check; scripts/test-episode.mjs verifica upload dos 60 PNGs via handler real com D1/R2 e utilizadores simulados, hashes, deduplicação, isolamento de contas, rejeição de hash adulterado, preservação de ebook anterior, metadados fora do dashboard, flip único, matrizes de pele em ombro 45°/cotovelo 90°, rig sem imagem-mestra estática, dois rigs na timeline, mãe sem rig, espada acompanhando transformações, flecha com colisão, efeito PNG e guardar/reabrir integral pela API. Testes de regressão: test-director, test-skin-binding, test-scene-interactions, test-assisted-studio, test-battle-studio, test-animation-editor e test-studio.

**Navegador real:** catálogo, pesquisa/inspeção e avisos; tentativa de importação recebe Sessão necessária, mantendo 0/60 na conta; abertura da montagem e demonstração; modo Animação sem referência estática; arrasto da mão esquerda da Arqueira com IK alterou visivelmente mão, antebraço e braço, confirmado também pela matriz de desenho; cena de confronto com duas personagens; exportação MP4 de 17–21 s; transferência e reabertura do projeto JSON como cópia. Não foi feita gravação autenticada na conta real nem repetida toda a regressão interativa de barra fixa, espadas e personagens anteriores.

**MP4 real:** 4,000 s, H.264, 1080×1920, 30 FPS, 120 frames, sem áudio (o pacote não contém som). A aplicação validou o ficheiro antes da descarga; FFprobe confirmou os parâmetros e FFmpeg descodificou o ficheiro completo sem erros. Não foi repetido um teste de sincronização AAC nesta atualização; a implementação de áudio da V15 foi preservada. Provas em docs/browser-ep01/.

## Pendências e correções específicas

1. A sessão de desenvolvimento não tem autenticação da conta; não se declarou que os 60 recursos já estão importados no utilizador real. O importador está implementado e testado com armazenamento simulado; falta executá-lo autenticado e confirmar a reabertura em produção.
2. Rever os encaixes em 45°/90° e poses extremas nos dois rigs. A Arqueira revelou aberturas no primeiro alinhamento; foram melhorados os limites de conteúdo, a escala uniforme e o alinhamento dos segmentos. A melhoria não equivale a aprovação de todos os encaixes. Usar o RigEditor para ajustar sobreposições, pivôs e ordem; importar peças adicionais onde a imagem não contém zonas escondidas.
3. Rever pega/ângulo da espada, pivô do arco, pontos da corda e orientação da flecha PNG. A colisão e as ligações têm testes técnicos, mas a ação completa não é artisticamente validada. A fissura/poeira do golpe são cues temporizados editáveis, não uma colisão física nova da espada com o chão.
4. Expressões e mãos alternativas estão importáveis e podem substituir peças pelos controlos existentes; ainda não foi implementada troca de imagem por peça em keyframes nesta atualização. Não se finge uma sequência de expressões/mãos inexistente.
5. Parallax por profundidade de cada camada e aprovação explícita de rig validado continuam pendentes. O movimento de câmara global foi preservado. O estado dos recursos do pacote permanece protótipo, sem botão que aprove automaticamente.
6. Performance não medida no computador físico do utilizador. Codificação é local, por software, sem servidor FFmpeg configurado; exportação remota continua pendente. Os PNGs não foram reduzidos para esconder limitações.

## Módulos principais

components/video/EpisodePack.tsx; lib/video/episode-assets.ts, episode-manifest.json, episode-rigs.ts, episode-demo.ts; public/ep01; integração em VideoStudio/RigEditor/Preview; extensão opcional de partSchema/skinMatrix; metadados e deduplicação nos endpoints existentes; scripts/test-episode.mjs. O teste usa a infraestrutura simulada já existente com adição de TextEncoder/batch ao harness.
