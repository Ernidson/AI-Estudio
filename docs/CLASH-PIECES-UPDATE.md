# Importação por peças e abertura Clash · atualização 12

## O que foi reutilizado

A aplicação e o alojamento são os mesmos. Foram reutilizados os projetos e recursos existentes, autenticação, armazenamento D1/R2, biblioteca de personagens preparados, esqueleto humano, IK, matrizes de skinning, pivôs, camadas, eventos de ligação/largada, curvas de transformação, editor de pontos-chave, histórico e câmara. Não há migrações, limpeza de dados ou alteração da partilha.

As personagens e demonstrações anteriores continuam disponíveis. Esta atualização acrescenta referências e demonstrações; não substitui as personagens que o utilizador já guardou. Os novos desenhos só aparecem quando se adicionam os novos modelos ou se substituem peças explicitamente.

## Implementado

### Importar personagem por peças

Na Biblioteca do Estúdio existe agora **Importar personagem por peças**:

1. Selecionar um personagem da cena ou criar um esqueleto humano sobre uma referência.
2. Importar PNGs/WebP/JPEG, sequencialmente, pela API autenticada existente; ou escolher a folha/peças fornecidas.
3. Na folha, selecionar um contorno poligonal ou arrastar um retângulo. Os pontos podem ser arrastados para corrigir o contorno.
4. Pré-visualizar o recorte real em PNG com transparência. O branco ligado ao exterior pode ser removido; não há segmentação por IA nem reconstrução escondida. Seleções vazias são rejeitadas.
5. Confirmar o recorte e guardá-lo como imagem independente na biblioteca da conta. Se a sessão falhar, o recorte fica disponível para transferir e voltar a tentar.
6. Dar nome, confirmar o osso e o pivô e adicionar/substituir uma peça. Nomes portugueses/ingleses reconhecíveis sugerem funções, com confirmação manual; um braço sem lado definido não é associado arbitrariamente.
7. Rever a montagem; abrir o editor existente para dimensões, colocação, pivôs, ordem, IK e prévia animada. Guardar o personagem reutilizável em **Preparados**.

A substituição neste assistente preserva juntas, limites, curvas e preparação; ajusta a imagem dentro da dimensão anterior sem a distorcer e realinha o pivô. O original da folha permanece disponível. A preparação do esqueleto não depende dos recortes.

### Personagens da folha fornecida

A folha JPEG foi recortada manualmente em 45 PNGs RGBA, incluindo variantes espelhadas, subdivisões e montagens de referência. A receita explícita está em `scripts/prepare-clash-sheet.py`; não é deteção automática.

- **P.E.K.K.A.**: 17 peças visuais associadas, com capacete, tronco, quadril, ombreiras, braços, antebraços, mãos, coxas, pernas e pés; espada independente.
- **Arqueira**: 17 peças visuais associadas, incluindo cabeça/cabelo, tronco completo, saia/quadril, braços e antebraços subdivididos separadamente, mãos, pernas/pés, capa e aljava; arco e flecha independentes. A cabeça assustada é usada na ponte.
- As coxas e alguns segmentos não existem como desenhos completos isolados na folha. Foram feitas subdivisões e extensões manuais com os píxeis disponíveis, e espelhamentos. São peças rígidas editáveis, não anatomia reconstruída por IA. Poses extremas ainda podem exigir retoque/novos PNGs.
- O tronco novo da Arqueira não tem exclusões dos braços; levantar o braço não retira píxeis do peito. Os modelos antigos não são alterados automaticamente.

No editor das novas personagens há botões para adicionar a espada ou o conjunto arco/flecha da biblioteca. As três demonstrações novas já incluem as ligações.

### Movimento e acessórios

- Novos presets **Caminhar em direção à câmara**, **Afastar-se da câmara** e **Correr em direção à câmara**. Geram pontos reais de pernas/braços, posição Y e escala progressiva; X é preservado. Duração, velocidade, amplitude, ciclos, fator de escala, deslocação Y e suavidade são configuráveis.
- Simulação de profundidade 2D: não altera a câmara nem gera uma vista de costas. O apoio dos pés é relativo à projeção do personagem; não é uma simulação de contacto no chão 3D.
- **Tremer de medo**, e tremor corporal no recuo assustado. A biblioteca tem agora 42 entradas; os dez presets antigos continuam disponíveis.
- O disparo existente foi adaptado às proporções e à posição dos ombros, levantando efetivamente os braços de um personagem inicialmente de braços para baixo.
- Os novos pontos de pega do disparo optam por interpolação numérica suave. Corrige a rotação da flecha/arco entre pontos, sem mudar o comportamento discreto das ligações antigas. Ligar/desligar continua a ser um evento exato.
- Corda própria, ajustável, deformada até à mão de puxar; a corda estática e o branco interior do recorte do arco foram retirados manualmente. A flecha recortada é usada em vez da flecha vetorial nestes modelos.
- A flecha fica invisível até ser colocada, segue a mão durante a preparação, é largada no instante definido, percorre uma trajetória independente e desaparece após o voo. O ciclo pode repetir-se. O arco permanece ligado à mão.
- Espadas usam o sistema existente de pega, rotação/escala relativa e largada por keyframe. Não foi acrescentada física.

### Ponte 9:16

**Projetos → Clash · ponte articulada 9:16**:

- Ponte ao fundo, P.E.K.K.A. atrás e Arqueira assustada à frente, ambas articuladas.
- P.E.K.K.A.: três ciclos de passos em 0–6 s, escala 0,55 → 1,10 e Y 43 → 55%, mantendo X 43%.
- Arqueira: recuo/tensão em 0–3 s, depois levantar o arco, colocar a flecha, puxar e apontar.
- Câmara: aproximação em 6–9 s; centro 77%/60%, zoom 2,4. O enquadramento fica dentro do cenário.
- **Corte sugerido para gameplay aos 9,3 s**, antes da largada aos 9,4 s. A continuação até 14 s permite inspecionar o disparo; pode ser cortada na linha do tempo.
- Todos os ossos, transformações, eventos da corda/flecha e enquadramentos são editáveis e guardados no documento existente.

Outras entradas: **Clash · P.E.K.K.A. por peças** e **Clash · Arqueira por peças**. Não substituem projetos guardados.

## Testes técnicos executados

- `npx tsc --noEmit` e compilação de produção.
- `test-clash-library.mjs`: regressão prioritária da Lia; PNGs independentes e metadados/alpha; associação/sugestões; substituição sem perda de joints/keys/pivôs; proporções; tronco independente do braço; aproximação/afastamento e manutenção da escala entre presets; espada ligada; dois disparos com flecha raster, continuidade e voo independente; alinhamento entre pontos e mão da corda; composição vertical/câmara; importação real de PNG pela rota e gravação; guardar/reabrir projetos e modelo preparado pelas rotas reais, com D1/R2 simulados.
- `test-motion-library.mjs`: 83 combinações de catálogo/personagem; contactos da marcha lateral, ciclos, corrida, encadeamento e remoção sem perder preparação, conflitos com pontos manuais, disparos, presets personalizados e barra fixa.
- Regressões: `test-skin-binding`, `test-scene-interactions`, `test-accessory-preparation`, `test-animation-editor`, `test-skeleton-workflow`, `test-vertical-cutouts`, `test-prepared-characters`, `test-studio` e testes-base de vídeo/autenticação.
- A persistência técnica usa as rotas da aplicação com armazenamento simulado; não substitui a validação autenticada no alojamento.

## Verificado visualmente no navegador local

1. Lia: modo Animação, ombro a 70°; os recortes desenhados do braço acompanharam a rotação.
2. Nova P.E.K.K.A.: ataque a 4,8 s com braço/armadura e espada a acompanharem-se.
3. Assistente: substituir tronco da P.E.K.K.A.; montagem mantida. Arrastar uma seleção retangular na folha e gerar prévia de recorte transparente da espada.
4. Arqueira: corpo e braços visuais, corda puxada a 4,3 s, corda de repouso e flecha em voo a 4,5 s; reprodução acionada.
5. Arrasto real da mão esquerda com o rato/IK: mão e antebraço moveram-se, mantendo o tronco completo.
6. Ponte: cenário atrás dos personagens; P.E.K.K.A. em escala 0,55/Y43 e depois 1,10/Y55; zoom da câmara no arco/flecha, com expressão assustada da Arqueira.
7. Keyframe de escala editado de 1,10 para 1,12 e desfeito para 1,10 na interface.
8. Revisão final da Arqueira a 3,2 s após a subdivisão dos braços/antebraços: peças visuais e arco/flecha alinhados.
9. A gravação do recorte e do projeto respondeu **Sessão necessária**. Não foi tentada nova validação Google nem contornada a autenticação.

## Limites e validação pendente

- Falta confirmar importação/gravação de novos ficheiros, guardar modelo na conta e fechar/reabrir o projeto numa sessão autenticada real. As rotas passaram nos testes técnicos; o navegador não tinha sessão válida.
- Nem todos os presets, direções, ângulos, esqueletos e poses extremas foram revistos visualmente. Testes de IK/barra fixa e compatibilidade com projetos antigos passaram tecnicamente; não foram todos repetidos interativamente nesta atualização.
- Os recortes vêm de uma referência raster pequena/JPEG. Contornos, sobreposição, coxas e juntas podem precisar de novos desenhos/PNGs para planos muito próximos e poses de grande amplitude. A aparência não é um rig 3D nem uma reconstrução perfeita.
- Partes brancas fechadas dentro de uma imagem podem exigir recorte mais preciso ou sementes/remoção manual no sistema de preparação existente. A remoção simples de branco não é uma máscara semântica.
- As diferentes fases do arco são keyframes editáveis da sequência completa; não foram criados presets autónomos para todas as microações.
- Física, colisões, corda elástica física, costas geradas automaticamente, áudio novo e exportação MP4 continuam pendentes.
- Não foi realizado benchmark num i7/16 GB sem GPU dedicada. O processamento de importação é sequencial, em canvas; a prévia usa os elementos SVG/2D existentes.
