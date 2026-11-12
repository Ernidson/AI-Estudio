# Estúdio de Vídeos · atualização 14

Atualização incremental do EBOOK AI STUDIO existente. Nenhuma migração destrutiva, alteração de autenticação ou substituição dos dados existentes. Os novos campos do documento são opcionais e mantêm a versão 1. Exportação MP4 continua indisponível.

## Reutilizado

Renderização das peças por matrizes de skinning, FK/IK com limites, fixações, ancoragens e pega local, avaliação hierárquica da cena, presets e aproximação frontal, montagem assistida e imagem original, linha do tempo por canais, histórico, biblioteca e APIs de projetos com revisões/isolamento por conta. Os exemplos anteriores continuam disponíveis.

## Funcional

- Barra contextual Mover / Rodar / Escalar / Articular, gravação de pontos ligada por defeito, pegas visuais de rotação e escala, pivô arrastável em camadas ainda sem animação. Edições de preparação do pivô são recusadas em camadas animadas para não alterar outros instantes. Com gravação desligada, o editor pede para a reativar antes de editar uma animação existente. Agulha numérica com precisão de milissegundos. Modo Ampliar editor.
- Arrasto de mãos/pés com IK e transformação imediata das peças na própria cena. Articulações fixadas precisam de ser soltas antes do arrasto individual; tronco com fixações utiliza o movimento corporal limitado pelo alcance. Editor completo de articulações continua disponível.
- Criar arco e flecha: SVGs originais e determinísticos, três cores, curvatura/espessura, prévia, duas mãos selecionáveis, corda separada. Parâmetros seguros ficam no projeto e podem ser guardados na biblioteca autenticada da conta. Não há geração por IA simulada nem necessidade de API. A biblioteca é reutilizável; para variar um conjunto guarda-se uma nova versão.
- Preparar disparo / Disparar para…: clicar no alvo da cena, ajustar preparação/libertação, duração/velocidade aproximada, curva, intensidade, efeito, recuo, câmara e som. Testar cria pontos reais e reproduz. Disparos consecutivos usam flechas independentes e preservam o anterior.
- A mira é refinada com a posição efetiva da mão no instante da largada. Primeiro avalia-se o braço que segura o arco; a mão de puxada procura a corda desse arco já transformado. A pega de repouso é separada das rotações produzidas pelos presets, evitando rotação acumulada em disparos sucessivos. Tolerância temporal corrige associação de grupos em tempos decimais.
- Flecha liga-se temporariamente à mão da corda, desliga-se no instante escolhido e voa com canais independentes. Selecionar a flecha mostra o percurso e pegas arrastáveis de curvatura/destino; a confirmação do arrasto recalcula contacto e pontos gerados. Pontos manuais e animações alheias em conflito são recusados sem alteração parcial.
- Áreas retangulares de colisão locais, configuráveis no painel de cada imagem. Deteção geométrica amostrada e refinada contra o alvo escolhido durante a geração/recalculação. Considera posição, rotação, escala e atividade/visibilidade do alvo em cada amostra.
- Impacto: faíscas/partículas, clarão ou onda; intensidade editável, tremor da câmara, recuo opcional e áudio importado/opcional. Comportamentos ficar presa (ancoragem real), ricochete estilizado, queda por keyframes ou desaparecer. Impacto tem uma linha própria na linha do tempo. Recalcular limpa os efeitos/recuo/som anteriores do respetivo grupo.
- Ligar objeto no contexto abre uma ligação simples à personagem/articulação, preservando a posição visual. Desligar grava um estado e a transformação livre sem salto. A pega pode ser movida na cena; rotação e escala usam a mesma transformação hierárquica. Painéis detalhados anteriores preservados.
- Aproximar no contexto dá acesso direto ao preset frontal já existente. Biblioteca conserva Direita, Esquerda, Frente e Trás, com parâmetros avançados. Aproximação altera Y/escala, sem utilizar X como profundidade. Imagens inteiras usam oscilação de recorte; personagens preparados mantêm o ciclo articulado.
- Projetos → Primeira batalha · impacto 9:16: ponte original, P.E.K.K.A. inteira aproxima-se, Arqueira de referência articulada recua/prepara arco SVG, dispara contra a armadura, contacto/faíscas/recuo/queda. Largada aos 5,040 s; contacto aproximadamente aos 5,364 s. Notas deixam a sequência pronta para continuar com gameplay; não há MP4 gerado.

## Testes técnicos executados

- `npx tsc --noEmit` e `git diff --check`.
- `node scripts/test-battle-studio.mjs`: 13 grupos novos, além da base importada. SVG validado, isolamento da biblioteca vetorial, ligação ao pulso, Lia com partes que mudam de matriz, disparos consecutivos, continuidade angular da largada, quatro consequências do impacto, acerto/erro/alvo oculto ou desativado, trajetória curva, alvo transformado/em movimento, tremor, edição do evento, conflitos atómicos, limpeza de recuo/som, guardar/reabrir.
- Regressões: `test-skin-binding.mjs`, `test-assisted-studio.mjs`, `test-scene-interactions.mjs`, `test-motion-library.mjs`, `test-accessory-preparation.mjs`, `test-animation-editor.mjs`. Incluem imagem efetivamente alterada (14 408 píxeis), mãos fixadas, barra, espadas em 280 amostras, 83 combinações de presets/personagens, locomoção/apoio dos pés, múltiplas personagens, conexões, recortes, pivôs e pontos manuais.
- Persistência técnica utiliza os handlers reais das APIs com D1/R2 e utilizadores simulados. Não equivale a testar armazenamento de produção numa sessão real autenticada.

## Testes reais no navegador

Chrome no ambiente de pré-visualização, com ações normais da interface e arrastos reais do rato:

1. Criar um conjunto vetorial, pré-visualizá-lo e ligá-lo à mão, sem API comercial. Selecionar P.E.K.K.A. diretamente na cena e Testar disparo. Um segundo disparo foi criado preservando o primeiro.
2. Arrastar a pega da curva da flecha: ponto de controlo mudou aproximadamente de (373,824; 766,271) para (440,712; 668,514) em píxeis da cena, com recálculo e prévia atualizados.
3. Lia: arrastar o pulso direito; antebraço e braço desenhados acompanharam o esqueleto. Matriz do braço passou de identidade para rotação efetiva. Mover personagem, rodar cerca de 31°, escalar para 1,281 e desfazer a escala.
4. Barra fixa: arrastar tronco de Y=64% para aproximadamente 58,410%; mãos continuaram nas posições de cena (582,4; 240) e (697,6; 240), com erro numérico desprezável. Cotovelos/imagens ajustaram-se.
5. P.E.K.K.A. na ponte: escala 0,3 → 0,6, Y=38% → 50%, X permaneceu 37%. Verificadas as duas composições visuais.
6. Corda tensionada e relaxada, flecha independente e efeito no ponto de contacto foram observados na prévia. Capturas em `docs/browser-v14`.
7. Guardar no navegador devolveu “Sessão necessária”. Não foi contornada a autenticação e **não foi validado guardar/fechar/reabrir na conta real**. A biblioteca autenticada de vetores também tem teste técnico, mas não gravação visual aprovada nessa conta.

Não foram testadas individualmente no navegador todas as consequências de impacto, todas as configurações da janela Ligar objeto, o áudio opcional ou todos os presets. Essas partes têm cobertura técnica ou reutilizam os sistemas anteriores; não se apresenta a compilação como aprovação interativa.

## Limitações / próxima etapa

- Colisão é calculada ao preparar/recalcular e fica em pontos/eventos editáveis, não é um motor físico em execução contínua. Depois de mover manualmente alvo, largada ou percurso, recalcule o disparo. Um alvo escolhido e um primeiro impacto por flecha; outros obstáculos não intercetam automaticamente o voo.
- Retângulos aproximam o corpo/armadura; não há colisão por píxel ou entre membros. Ricochete e queda são trajetórias estilizadas por pontos, sem gravidade/colisões secundárias.
- Recuo automático recusa curvas de posição/rotação posteriores ao impacto para preservar animações do alvo. Pode desativar Recuo e animar a reação manualmente. Alterar apenas a intensidade do evento muda efeitos/câmara, não recompõe automaticamente os pontos já gerados do recuo.
- Preparação de arco depende de duas cadeias IK e das peças visuais do personagem. Alvos fora do alcance/poses extremas podem exigir ajustes na pega, proporções ou pontos gerados. Uma imagem inteira não ganha membros independentes só por receber um esqueleto.
- P.E.K.K.A. desta demonstração usa a ilustração inteira para aproximação; a referência articulada da Arqueira reutiliza os recortes existentes e pode exigir correção de sobreposição em poses extremas. Não se reconstruíram regiões escondidas nem se redesenharam imagens por IA.
- Alterar pivô numa camada já animada continua a exigir preparação cuidadosa; a pega contextual impede alterações globais acidentais. Ajustes avançados existentes continuam disponíveis.
- Desempenho observado apenas neste navegador; não há certificação de desempenho no i7/16 GB sem GPU. A prévia usa SVG/transformações 2D e cálculo de contacto na preparação.
- MP4, física completa, impactos contínuos com vários obstáculos e geração de imagens por IA permanecem pendentes.
