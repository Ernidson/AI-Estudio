# Abertura vertical por recortes inteiros — EBOOK AI STUDIO

Atualização do projeto existente, em 5 de novembro de 2026. Não foi criada outra aplicação. Autenticação, eBooks, tabelas, projetos e recursos anteriores preservados. Não houve alteração destrutiva nem regravação automática dos projetos guardados.

## Estrutura encontrada e reaproveitada

O Estúdio de Vídeos já tinha faixas/camadas, imagens independentes, transformações globais, keyframes, interpolação, histórico, biblioteca por conta, rigs e conexões por ossos. A composição e alguns cálculos geométricos estavam fixos em 1280 × 720; o zoom disponível no editor de articulações era um zoom de edição, não uma câmara do vídeo.

Esta atualização reutiliza os canais e as rotas existentes. Os campos de composição, câmara, grupos, pivôs e preparação de fundo são opcionais para manter a leitura dos documentos antigos.

## Implementado

- Composições 16:9 (1280 × 720) e 9:16 (720 × 1280), selecionáveis em **Câmara · formato**. Posições percentuais, proporções das imagens e geometria das conexões adaptadas às dimensões do documento.
- Camadas de imagens inteiras, sem rig obrigatório: posição, rotação, escala, opacidade, pivô X/Y, curvas e suavidade. As proporções originais são preservadas.
- Painel **Camadas da cena**: selecionar, nomear através de Propriedades, ordenar, mostrar/ocultar, bloquear/desbloquear, duplicar e agrupar. Grupos têm nome, visibilidade e bloqueio. São organizacionais: as curvas dos membros continuam independentes, sem transformação coletiva de grupo nesta versão.
- O bloqueio impede arrasto, cortes e edição dos pontos/propriedades da camada. Desbloqueia-se no painel de camadas/grupos.
- Câmara real com posição X/Y e zoom, separada do zoom de edição. Os canais aparecem na linha do tempo como **Câmara · posição X/Y** e **Câmara · zoom**, com pontos visíveis, editáveis, copiáveis e elimináveis. Posição e zoom são interpolados independentemente.
- Arrasto e importação na pré-visualização usam as coordenadas da cena mesmo com zoom/pan da câmara. A imagem final permanece visível ao parar no fim da sequência.
- Conexões antigas por articulações mantidas. Acrescentadas conexões a pontos marcados em imagens inteiras ou objetos de cena, sem criar ossos fictícios. Um acessório separado acompanha o ponto sob translação, rotação, escala e pivô do personagem, com ajuste local, escala relativa e largada já existentes.
- Objetos reutilizáveis também podem preservar pivô e preparação de fundo.

## As três imagens fornecidas

Foram incluídas, sem alterações aos ficheiros originais, no modelo **Abertura 9:16 · ponte**:

1. Cenário da ponte, com proporção 9:16, ao fundo e inicialmente bloqueado.
2. P.E.K.K.A. inteira, com a espada integrada no desenho. Entrada por opacidade e aproximação por posição/escala, com leve oscilação do recorte para sugerir passos.
3. Arqueira assustada inteira em primeiro plano, com pequena tremida de posição e rotação. Arco e flecha continuam integrados no desenho.

A sequência dura 10 s. A câmara começa a aproximar-se aos 4,5 s e chega ao enquadramento da mão/arco/flecha aos 9 s, mantendo-o até ao fim. O documento guarda uma nota de cena para o corte seguinte para gameplay; não insere gameplay fictício.

Os três PNG têm canal alfa, mas todos os seus píxeis originais estão opacos. Para os dois personagens foi configurada remoção simples do branco: região conectada às bordas, com tolerância/suavidade e marcações adicionais nas zonas fechadas do arco. O cenário não sofre remoção de fundo.

A preparação corre localmente no navegador, é reutilizada em cache durante a animação e não envia imagens a serviços externos. O JSON guarda as opções e os pontos de marcação; os originais permanecem intactos. Ao reabrir, a preparação é recalculada.

## Como utilizar e validar na aplicação

1. Abra **Estúdio de Vídeos → Projetos → Abertura 9:16 · ponte**. O modelo abre um documento novo no editor; não substitui um projeto existente. Clique em **Guardar projeto** para o guardar na sua conta.
2. Reproduza de 0 a 10 s. Confirme a ponte atrás dos personagens, a aproximação da P.E.K.K.A. e a tremida da Arqueira.
3. Clique em **Câmara · formato** ou na linha Câmara. Confirme 720 × 1280 e os pontos de posição/zoom. Edite um losango e a sua suavidade; desfaça para recuperar a sequência.
4. Use o painel **Camadas da cena** para selecionar cada recorte. Confira posição, escala, rotação, opacidade e pivô em Propriedades. Para editar a ponte, desbloqueie-a primeiro. Os grupos permitem ocultar/bloquear os personagens em conjunto.
5. Em **Recorte inteiro e transparência**, reveja as bordas sobre o quadriculado. Desative a remoção para ver o original. Para corrigir uma região branca fechada, escolha **Marcar região de fundo** e clique nela. O método é simples e requer revisão visual; não é segmentação inteligente.
6. Para testar um acessório independente, importe uma espada separada ou adicione a espada de exemplo numa camada própria. Selecione o personagem e use **Marcar mão / ponto de ligação**; ajuste o nome e as coordenadas do ponto. A Arqueira do modelo já tem dois pontos de mão.
7. Selecione a espada e, em **Conectar acessório a osso ou recorte**, escolha a Arqueira e o ponto da mão. Ajuste pivô/offset/rotação da pega. Mova, rode e escale a Arqueira: a espada separada deve acompanhar o ponto. A espada integrada na P.E.K.K.A. não é uma peça independente nesta cena.
8. Guarde, abra outro projeto e reabra o guardado. Confira camadas, grupos, pivôs, preparo de fundo, conexões, curvas e enquadramento da câmara. Use **Guardar cópia** para variantes.

## Testes técnicos realizados

- TypeScript e compilação de produção.
- `test-vertical-cutouts.mjs`: documento vertical válido; cenário no fundo; recortes sem rig; aumento de posição/escala da P.E.K.K.A.; tremida da Arqueira; câmara com zoom final superior a 2×.
- Conversão local/cena e inversa com pivôs não centrais, rotação, escala e inversão horizontal em 16:9 e 9:16.
- Projeção da câmara e inversa; foco da câmara no centro do enquadramento; editar o tempo de uma chave de posição não altera a curva de zoom.
- Espada separada conectada a um ponto da mão num recorte inteiro sob translação, rotação, escala, pivôs e inversão. A posição da pega foi comparada ao ponto esperado na cena.
- Confirmação de que os PNG fornecidos não têm transparência efetiva. Remoção do branco, manutenção de dimensões, regiões fechadas por marcação manual e hashes dos originais preservados.
- Visibilidade/bloqueio por camada e grupo. Gravação, fecho do cliente e reabertura através das rotas reais com D1/R2 simulados, preservando os novos campos e os resultados da câmara.
- Regressões do editor, rigging e skin binding: pontos antigos, presets, IK, objetos associados, dois personagens, partes separadas, recortes, histórico e persistência.
- `render-vertical-opening.mjs`: renderização técnica de três instantes com o mesmo motor geométrico, a mesma função de remoção de fundo e a mesma interpolação da câmara; componentes da câmara, camadas, linha do tempo e conexões renderizados no servidor.
- `vertical-opening-proof.png` foi inspecionada visualmente: cenário, profundidade, recortes sem retângulo branco, aproximação e enquadramento final da mão/arco/flecha.

## Validação visual no navegador

**Não executada.** O serviço de pré-visualização voltou a devolver `preview relay unavailable` no arranque e no diagnóstico. Não foi possível validar o rato, a preparação Canvas, a reprodução e guardar/reabrir na interface real. Os testes automatizados, os componentes renderizados no servidor, a imagem técnica e a publicação não equivalem a aprovação interativa no navegador.

Não foi retomada validação Google. O próximo passo de aceitação é executar o roteiro acima no navegador do utilizador.

## Pendente / limitações

- Caminhada articulada real, espada independente na imagem da P.E.K.K.A. e soltura da flecha exigem peças adicionais. Nesta abertura, são ilustrações inteiras animadas por transformações.
- Remoção de fundo por cor simples pode afetar regiões da mesma cor que estejam ligadas ao fundo. Fundos complexos requerem preparação externa de PNG transparente. Originais e opções de preparação continuam disponíveis para correção.
- A preparação de imagem pode demorar na primeira utilização; o desempenho no computador indicado não foi medido. A animação reutiliza os resultados e não recalcula o recorte a cada fotograma.
- Grupos organizam camadas e controlam visibilidade/bloqueio, mas não têm pivô ou curvas coletivas próprias.
- Seleção de formato não reenquadra artisticamente todos os projetos anteriores: reveja as posições ao mudar um vídeo existente para 9:16. Projetos antigos continuam horizontais até o utilizador escolher outro formato.
- Conexões usam pontos definidos manualmente; não identificam automaticamente mãos ou separam acessórios já desenhados no personagem.
- MP4/serviço de renderização continua pendente. A pré-visualização e a exportação do projeto JSON são distintas da exportação de vídeo. O modelo termina pronto para acrescentar o gameplay real numa etapa seguinte.
