# Biblioteca de animações — caminhada, disparos e substituição de peças

## Implementado no EBOOK AI STUDIO existente

Sem nova aplicação, alteração de autenticação ou reescrita dos projetos anteriores. Reutilizados rigging/IK, skinning, biblioteca de recursos, histórico, canais, eventos, camadas, acessórios, persistência e composição 9:16. Os dez presets anteriores continuam disponíveis em «Presets anteriores · compatibilidade».

### Biblioteca por categorias

38 entradas nativas em Locomoção, Combate, Arco e flecha, Movimentos corporais e Reações, além da categoria Animações personalizadas. Inclui caminhada/corrida para a frente e para trás, marcha lenta/agachada, salto/aterragem, rotação 2D, desaceleração, recuo, preparação de ataque, três direções de espada, defesa/bloqueio, avanço/ataque com salto, dois/três golpes, aceno, apontar, abaixar/agachar, sentar/levantar, olhar, inclinar, medo/recuo, vitória, combate, impacto, queda/recuperação e tiro com arco.

Controlos de início, duração, velocidade, amplitude, direção, braço quando aplicável, grupos de articulações, distância e repetição. Ações que terminam numa pose (por exemplo, cair ou sentar) não são apresentadas como ciclos repetíveis: devem ser encadeadas com recuperação. «Virar» é inclinação/rotação 2D; não cria uma imagem de costas.

Pré-visualização temporária real com imagens, sem alterar o projeto; aplicação gera pontos reais. Avisos para associação de funções, falta de peças ou hierarquia incompatível. Funções do esqueleto podem ser associadas a juntas diferentes sem renomear/remover os ossos. Pontos manuais em conflito são recusados; as mutações da biblioteca são aplicadas como uma alteração no histórico.

### Caminhada

A nova caminhada usa trajetórias de tornozelos adaptadas às proporções do rig, IK, apoio alternado e eventos temporários de fixação dos pés. Durante o apoio mantém posição e orientação do calçado. A distância, o avanço X/Y, a direção, a duração e o número de ciclos são coordenados com os passos. Há marcha no lugar e limites de distância/alcance. A corrida tem menor duração de apoio e intervalos sem pé fixado.

O apoio respeita a altura de referência de cada pé, incluindo a perspetiva das imagens frontais. Não é uma simulação de colisão com um chão 3D. A primeira abordagem de nivelar ambos os pés causava flexão exagerada na P.E.K.K.A.; foi revista após o teste visual. As imagens frontais continuam com marcha estilizada, sem conversão automática para perfil.

A posição final é mantida ao encadear movimentos. A agulha pode avançar automaticamente até ao fim do preset para aplicar o próximo. Apoios gerados acompanham a remoção/alteração de duração da respetiva animação.

### Arco e flecha

Sequência por keyframes de levantar/apontar, carregar, puxar, manter mira, libertar, voo e recuperação. Repete até três ciclos por aplicação, respeitando os limites do projeto. O arco mantém a pega e acompanha a mão; a mira ajusta a orientação. A corda usa eventos reais e acompanha a mão de puxar antes da libertação. A flecha acompanha a mão durante a preparação, desliga-se no instante configurado e segue uma trajetória linear independente.

Direção/ângulo, velocidade, distância e percentagem exata de libertação são configuráveis. Os eventos da corda aparecem na faixa «Corda · puxar / libertar»; a flecha tem eventos de associação e canais de transformação. Podem ser editados individualmente; ao editar eventos isolados, o utilizador deve coordenar os tempos da corda, da largada e da trajetória. A alteração de duração/remoção da sequência pelo grupo é propagada aos elementos associados.

Não há física realista, colisão ou geração de imagens. Para arcos importados, o painel de acessórios permite configurar as pontas da corda e a mão de puxar. A flecha disponível é o exemplo vetorial independente da versão anterior.

### Trocar peças e corrigir o tronco

Nas propriedades da parte: «Substituir imagem desta peça» e importação de PNG/WebP pela infraestrutura existente. A substituição conserva o identificador da peça, a articulação, o tamanho colocado, a rotação e o pivô; os ossos, limites, ligações e curvas não são reconstruídos. Limpa o recorte/exclusões da imagem anterior para usar a nova imagem completa. Os controlos existentes permitem ajustar pivô, colocação, tamanho e ordem das peças, e pré-visualizar antes de guardar.

Adicionada uma cobertura manual completa do tronco da Arqueira para reduzir o vazio atrás dos braços. É uma base vetorial provisória, identificada na biblioteca, sem reconstrução por IA. Não substitui uma nova ilustração final do tronco com textura original. Os projetos guardados não são modificados automaticamente: podem usar o fluxo de substituição quando necessário.

### Presets personalizados

Captura de um intervalo manual de ossos e posição global, com associação por funções e adaptação à largura do personagem. Duração, amplitude e direção editáveis ao reutilizar. Não copia conexões a objetos, fixações externas, escala/rotação globais ou uma cena completa; esses elementos continuam no projeto e exigem ajuste separado.

Presets ficam no documento editável e são também enviados para a biblioteca autenticada da conta. A nova rota `/api/video/animations` usa registos separados por proprietário na tabela existente, sem migração. Guardar nova versão cria novo identificador. Sem sessão, a interface explica que só foi incluído no rascunho do projeto; é necessário guardar o projeto ou transferir JSON para persistir esse rascunho.

## Testes técnicos executados — passaram

- TypeScript (`npx tsc --noEmit`) e compilação de produção.
- `scripts/test-motion-library.mjs`: 75 combinações de catálogo/personagem; quatro ensaios de caminhada (P.E.K.K.A./Arqueira, duas direções), cada um com 399 amostras de apoio, posição e orientação fixas durante o contacto; ciclos relativos sem salto; deslocamento real; sequência caminhada/preparação/ataque sem reposicionamento; proteção atómica de keyframes manuais; dois disparos, largada/voo, eventos de corda, retiming e remoção coordenados; presets personalizados, substituição de tronco conservando juntas/curvas/pivô, gravação/reabertura pelas rotas reais e isolamento por proprietário.
- Teste específico P.E.K.K.A.: ambas as mãos fixadas às pegas de uma barra enquanto o corpo se move, com erro inferior a 1 píxel nos alvos.
- Regressões: `test-prepared-characters.mjs`, `test-skin-binding.mjs`, `test-animation-editor.mjs`, `test-scene-interactions.mjs`, `test-skeleton-workflow.mjs`, `test-vertical-cutouts.mjs`, `test-accessory-preparation.mjs`, `test-studio.mjs` (alguns importam também os testes base de vídeo).

Os testes de persistência usam as rotas reais com D1/R2 simulados. Não equivalem a gravação/reabertura autenticada em produção.

## Testes efetivamente realizados no navegador local

- Aberta «Biblioteca · caminhada e combate»: imagens articuladas, pés alternados, arma ligada e avanço global observados em instantes da sequência. Revisto o excesso inicial de flexão das pernas.
- Pré-visualizada uma caminhada temporária e aplicada em 8–11 s depois da sequência original. X passou de 68% para 76%; a agulha avançou até 11 s e a sequência anterior foi mantida.
- Capturado «Passada PEKKA · teste» no projeto, reutilizado em 11–13 s com duração de 2 s e amplitude de 0,5. O envio à conta devolveu «Sessão necessária», com mensagem clara.
- Selecionado um keyframe real do cotovelo direito em 8,750 s e alterado para -18° pela interface.
- Aberta «Biblioteca · recuo e disparos»: observada a corda puxada aos 5 s, em repouso aos 5,8 s e novamente puxada aos 9 s; observada flecha separada após a primeira libertação. As partes desenhadas acompanharam as poses.
- Substituído o tronco pela base completa manual através do seletor de imagens; rodado o ombro esquerdo para 45°. O tronco permaneceu preenchido. Este teste usou SVG transparente já disponível, não um novo PNG enviado pelo utilizador.
- Confirmada a faixa «Corda · puxar / libertar» na linha do tempo.
- Tentativas de guardar projetos/preset na conta: «Sessão necessária». Não se contornou a autenticação nem se retomou validação Google.

Capturas reais: [substituição do tronco](browser-v11/torso-replacement.png), [controlos da biblioteca e do disparo](browser-v11/animation-library.png). As capturas registam o estado durante a validação; alguns campos sem efeito em certas categorias foram depois ocultados.

Não foram revistos visualmente no navegador todos os 38 movimentos, todos os ângulos de disparo, a barra fixa nesta sessão, a importação autenticada de novas peças PNG nem a gravação/reabertura real. Estas verificações continuam pendentes onde aplicável.

## Como experimentar

1. Estúdio de Vídeos → Projetos → «Biblioteca · caminhada e combate» ou «Biblioteca · recuo e disparos».
2. Selecionar personagem → Editar articulações → Animação. Percorrer o tempo ou reproduzir.
3. Na Biblioteca de animações escolher categoria/preset, intervalo livre e parâmetros; pré-visualizar e aplicar. Ativar avanço da agulha para encadear. Usar «Editar keyframes na linha do tempo» para ajustar pontos.
4. Para substituir o tronco, selecionar «Tronco · parte», importar/selecionar PNG transparente completo e ajustar pivô/colocação. Os dados do esqueleto permanecem.
5. Guardar com sessão iniciada e reabrir por Projetos. Esta última etapa permanece por confirmar no navegador autenticado.

## Limitações restantes

A biblioteca é uma primeira versão procedural para bonecos 2D rígidos, não captura de movimento. As imagens e recortes atuais ainda exigem afinação em poses amplas, na ligação de membros, na roupa e na armadura. Sentar não ajusta automaticamente o contacto com uma cadeira. Os pés usam planos de apoio de referência e alcance IK; não há física ou colisão com geometria do cenário.

O corpo da Arqueira tem cobertura provisória manual; a arte final precisa das peças corrigidas fornecidas pelo utilizador. Os presets personalizados capturam ossos e posição, sem copiar vínculos externos. Há limites de 80 pontos por articulação, 160 por canal, três ciclos por aplicação, 40 presets no documento e os limites de faixas/elementos já existentes; sequências maiores podem exigir dividir o elemento.

A aceitação visual de todos os movimentos, a sessão autenticada e testes no computador de 16 GB continuam pendentes. MP4 permanece indisponível.
