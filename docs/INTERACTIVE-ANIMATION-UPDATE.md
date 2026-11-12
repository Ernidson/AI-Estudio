# Estúdio de Vídeos — IK de cena e objetos associados

Atualização do EBOOK AI STUDIO existente, de 5 de novembro de 2026. Autenticação, D1/R2, projetos, eBooks e biblioteca anteriores mantidos. Os campos novos no JSON são opcionais; não há alteração destrutiva nem migração de dados guardados. MP4 continua indisponível.

## O que foi implementado

### Linha do tempo

- Vista dedicada **Pontos-chave**, com alternância para **Elementos e camadas** ou **Tudo**. As curvas deixam de ficar escondidas sob todas as faixas de media.
- Curvas animadas expandidas inicialmente; canais vazios ocultos por predefinição, com botão para os mostrar. Expandir/recolher por personagem e por osso continua disponível.
- Posição global X/Y, rotação, escala, opacidade, articulações, fixações IK e associações de objetos aparecem em linhas próprias. Os objetos também têm os seus canais.
- Losangos maiores, destaque verde no instante atual (tolerância de meio fotograma a 30 fps), seleção dourada, tempos exatos e barras com início/fim das animações.
- Seleção múltipla, arrasto, edição numérica, copiar/colar, apagar, suavidade, zoom horizontal e histórico mantidos. Os estados de fixação/associação são discretos: F = fixado/associado e L = livre, sem interpolação fictícia de booleanos.
- Alterações aos pontos pela nova linha do tempo são validadas antes de entrar no histórico. Conflitos ou referências inválidas não substituem o documento atual.

### IK e fixações

- Mãos/pés podem ser fixados à posição atual no espaço da cena ou a uma ancoragem de um objeto. O IK resolve cadeias de dois ossos e mantém os comprimentos e limites articulares.
- A fixação acompanha a posição, escala, rotação e inversão do objeto de destino. O destino pode ser animado com os canais existentes.
- Fixar, soltar e reativar escrevem pontos de estado no tempo atual. As relações e os pontos fazem parte do documento guardado e do histórico.
- No modo Animação, com fixações ativas, o editor mostra a cena global e os objetos de contexto. Arrastar o tronco/quadril ou usar **Mover corpo X/Y** move o corpo, resolve o IK e grava as rotações dos membros nesse instante.
- O arrasto de translação é limitado ao alcance alcançável quando começa numa pose válida. Não se alongam ossos para cumprir alvos impossíveis. Situações fora do alcance por alterações de objeto, limites, rotação ou escala mostram um aviso e indicador âmbar.
- Durante a reprodução, o IK é novamente calculado entre os pontos-chave, evitando que a interpolação das rotações faça as mãos deslizarem da barra. As fixações ativas têm prioridade sobre os ângulos livres; solte-as antes de reposicionar livremente a mão/pé.

### Objetos associados

- Biblioteca inclui espada, escudo, barra fixa, cadeira, mesa e banco, além das imagens próprias já importáveis.
- A barra incluída recebe duas ancoragens de pega ao ser adicionada à cena. Outros objetos podem usar as ancoragens manuais existentes.
- **Associar objeto à articulação** liga uma imagem a um personagem/ossso. A imagem acompanha a posição e rotação da articulação.
- Pega editável por offsets X/Y, rotação relativa, pivô e escala; arrastar um objeto associado na pré-visualização edita a pega e grava um estado no instante atual. Não escreve X/Y globais que seriam ignorados pela associação.
- **Soltar objeto no tempo atual** guarda a transformação da cena e um estado livre. A largada não altera a posição/rotação das poses anteriores; não acrescenta gravidade.
- Vários personagens podem ter rigs, curvas, posições, objetos e profundidades independentes, reproduzidos pelo mesmo relógio.
- Referências circulares e destinos inexistentes são rejeitados. Remover um personagem/objeto desativa as ligações dependentes e preserva as cópias e preparação restantes. Uma ancoragem em uso não pode ser eliminada inadvertidamente.

### Presets

- Dez presets revistos com amplitude, duração, velocidade e, em aceno/ataque, escolha do braço.
- A orientação frontal usa marcha estilizada de amplitude menor; o perfil usa balanço de pernas e braços coordenado, flexão de joelho na fase de recuperação e entrada/saída gradual.
- Orientações frontal, perfil esquerdo/direito e personalizada são guardadas no personagem do vídeo. Selecionar perfil não transforma a imagem: é necessário usar arte e preparação correspondentes.
- Articulações, hierarquia e limites são verificados. Vistas personalizadas não suportadas para movimento corporal produzem aviso e impedem aplicar o preset incompatível.
- Os presets continuam a produzir pontos reais e editáveis. Remover uma animação não remove o personagem nem a preparação. Repor/limpar também limpa os eventos de fixação, mantendo os ossos, recortes, limites e ancoragens de preparação. Pose neutra solta as fixações no instante atual para permitir a pose de referência.

## Demonstrações e teste manual

Em **Estúdio de Vídeos → Projetos**:

1. **Demo · barra fixa IK**: Lia preparada, barra com duas pegas, posições baixa/alta/retorno, rotações gravadas e fixações de 0 a 9 s. Aos 9 s, as mãos ficam livres. Selecione Lia, abra **Editar articulações → Animação** e arraste o tronco nos instantes de 0 a 8 s. As duas mãos devem permanecer na barra dentro do alcance permitido. Os indicadores das fixações devem ficar verdes.
2. Na vista **Pontos-chave**, altere o Y de uma pose, mova um ponto e edite um estado de fixação. Use desfazer/refazer e confirme que só o movimento selecionado é alterado.
3. **Demo · dois personagens com espadas**: dois personagens com ataque/defesa independentes, espadas nas mãos direitas e largada aos 8 s. A arte é frontal e os movimentos são estilizados, sem colisões.
4. Selecione uma espada. Ajuste o pivô/rotação ou arraste-a na pré-visualização para editar a pega. Avance no tempo e use **Soltar objeto**. A espada deve acompanhar a mão antes da largada e ficar livre depois dela.
5. Aplique um preset num intervalo sem curvas concorrentes, edite os pontos gerados e remova apenas essa animação. A preparação corporal deve continuar intacta.
6. Guarde com um novo título, abra outro projeto e reabra o guardado. Confira posições, curvas, fixações, pegas e eventos de largada. As demonstrações abrem documentos novos sem substituir projetos existentes.

## Testes técnicos executados

- TypeScript e compilação de produção.
- Regressões de rigging e skin binding: hierarquia, IK, limites, imagem única preparada por recortes, imagens separadas, arrasto calculado da mão/cabeça, píxeis do desenho alterados e preservação das poses nas rotas de gravação.
- **Barra fixa:** 90 instantes amostrados entre 0 e 8,9 s; duas mãos mantidas nos alvos dentro de 1,01 píxel de cena; comprimentos e limites verificados em todos os ossos; movimento do corpo e largada verificados.
- Arrasto do corpo para fora do alcance é limitado, sem esticar os braços. Fixação simultânea de dois pés também testada.
- Alvos acompanham translação, rotação e escala do objeto.
- Dois personagens independentes; posição/rotação da espada acompanham a articulação, incluindo o personagem invertido. A largada preserva a transformação da cena.
- Editar a pega no tempo atual cria novo estado sem alterar estados anteriores. Edição de rotação/escala e mover/copiar/colar/apagar pontos de fixação testados.
- Curvas de perfil/frente distintas, amplitude proporcional, vista incompatível e escolha de braço testadas.
- Ciclos, ancoragens inexistentes e eliminação de personagens com objetos ligados testados.
- Gravar/fechar cliente/reabrir através das rotas reais com **D1/R2 simulados** preserva os campos novos e os resultados da animação. Não é um teste de gravação no navegador.
- Renderização no servidor dos componentes reais da linha do tempo e do editor, incluindo destaque do ponto atual, intervalos e linhas de fixação. Renderização SVG/PNG do motor com barra e dois personagens armados em `scene-interactions-proof.png`.

## Estado da validação no navegador

**Não executada.** `sites-preview start` e `sites-preview status` devolveram `preview relay unavailable`. Não foi possível testar interativamente o rato, a reprodução e guardar/fechar/reabrir na interface real. A compilação, os testes automatizados, a renderização SVG e a publicação não substituem essa aceitação interativa. Não foi retomada validação Google.

## Limitações e próximas etapas

- As interações implementadas são relações cinemáticas, não simulação física. Colisões, bloqueios de golpes, impactos, contacto automático entre personagens, gravidade e combate avançado permanecem pendentes.
- IK de dois ossos, sem solver corporal completo ou múltiplas cadeias com prioridades configuráveis. Fixações incompatíveis ou alvos impossíveis produzem avisos. Arrastos de translação são limitados; rotações/escalas e objetos movidos para fora do alcance exigem ajuste manual.
- Eventos de associação/pega são mudanças discretas editáveis. A mão interpola pelo rig; os offsets de pega não têm ainda curvas contínuas próprias.
- Fixar a mão num ponto não trava a sua orientação; objetos seguem a rotação resolvida da articulação. A orientação da arte importada pode exigir ajustar a pega, especialmente num personagem invertido.
- Dividir um elemento que é destino de ligações está protegido: remova as ligações antes de o dividir. Cortar elementos sem dependentes mantém relógios e cópias independentes das curvas.
- Presets estilizados exigem revisão por personagem. A imagem frontal não pode apresentar uma caminhada lateral natural sem arte adequada de perfil. Sentar/levantar ainda não ajusta automaticamente o contacto com cadeiras.
- Os campos são opcionais e preservam a leitura de documentos antigos. Não houve regravação automática de projetos existentes.
- Sem benchmark no i7/16 GB ou GPU integrada. Processamento SVG no navegador, sem chaves comerciais. MP4 continua pendente.
