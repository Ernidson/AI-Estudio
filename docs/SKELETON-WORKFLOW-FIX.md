# Preparação livre do esqueleto em imagens únicas

## Causa

O editor misturava preparação estrutural e preparação visual. O aviso «Preparação visual incompleta» era permanente, não recolhível e ocupava espaço fixo acima da área de trabalho, insistindo nos recortes. A edição em Preparação já existia, mas o modo Animação, a reprodução e os gestos de animação eram condicionados à existência de partes visuais. Isso tornava o fluxo de esqueleto sem recortes confuso e impedia a prévia estrutural.

## Correção

- O aviso fixo foi retirado. A informação fica em «Imagem única · recortes por preparar», um painel recolhível na barra lateral, fechado inicialmente. Não ocupa o canvas nem captura eventos sobre a imagem.
- Etapa A · Esqueleto: adicionar base, ajustar juntas/hierarquia/proporções, guardar modelo e guardar personagem, antes da preparação visual.
- Etapa B · Peças visuais: recortes e peças continuam disponíveis separadamente, quando forem necessários.
- «Adicionar esqueleto base» passa sempre para Preparação/Selecionar, repõe o enquadramento, apresenta a referência e limpa apenas a seleção de recorte pendente. Preserva os ossos, partes, curvas e ligações já existentes.
- Animação estrutural permitida com articulações e zero recortes: arrasto IK, rotações, keyframes e reprodução. A referência permanece estática e isso é indicado no cabeçalho e nas instruções. Não se apresenta o movimento dos ossos como movimento da imagem.
- Presets visuais continuam a exigir as peças necessárias; preparar só o esqueleto não inventa braços, pernas ou acessórios separados.
- Rigging, IK, limites, skinning, conexões e armazenamento anteriores foram reutilizados. Sem migrações de dados, mudanças de autenticação ou novos serviços. Sem alteração à exportação MP4.

## Teste real no navegador

Executado na pré-visualização local do EBOOK AI STUDIO, com a imagem única original da P.E.K.K.A. já disponível na biblioteca de demonstração:

1. Abrir o teste de esqueleto da P.E.K.K.A., selecionar a imagem e abrir Editar articulações.
2. Clicar Adicionar esqueleto base: ossos visíveis sobre a imagem, Preparação e Selecionar ativos, sem aviso sobre a área central.
3. Arrastar pulso direito, ombro direito e joelho esquerdo com o rato. Confirmadas alterações nas coordenadas e no desenho dos ossos.
4. Entrar em Animação com zero peças. Criar keyframes no joelho em 0 e 2 segundos, alterar rotação para 35 graus e reproduzir; a agulha avançou.
5. Fechar e reabrir o editor dentro do mesmo rascunho: ajustes e dois keyframes mantidos. Isto verifica o estado do cliente, não uma recarga da página ou reabertura a partir do servidor.
6. Arrastar a mão por IK no modo Animação: o pulso passou de aproximadamente (994,66; 738,21) para (962,14; 589,15), com keyframes nos ossos do braço. A imagem continuou estática, como indicado.
7. Tentadas gravações do modelo e do projeto: resposta «Sessão necessária». A sessão local não estava autenticada. Não foi contornada a autenticação nem retomada a validação Google.

Captura real: [prévia estrutural](browser-v9/skeleton-workflow.png).

Importação autenticada de um novo ficheiro, gravação/reabertura do servidor e reutilização pela biblioteca numa sessão real continuam por validar no navegador. A imagem usada foi a mesma P.E.K.K.A. original fornecida e incluída no projeto, não um upload realizado neste teste.

## Testes técnicos executados — passaram

- `npx tsc --noEmit`
- `node scripts/test-skeleton-workflow.mjs`: imagem inteira, base sem recortes, coordenadas editáveis, hierarquia, interface com nota lateral recolhida e animação estrutural permitida, keyframes e gravação/reabertura de projeto/modelo pelas rotas reais com D1/R2 simulados.
- `node scripts/test-accessory-preparation.mjs`: acessórios, peças e modelos reutilizáveis.
- `node scripts/test-scene-interactions.mjs`: IK/barra fixa, limites, conexões, dois personagens e soltura.
- `node scripts/test-animation-editor.mjs`: keyframes, presets, neutralização e histórico.
- `node scripts/test-vertical-cutouts.mjs`: composição 9:16, câmara, recortes inteiros e persistência.

## Como usar

Importar/selecionar imagem → Editar articulações → Adicionar esqueleto base → arrastar juntas em Preparação → Guardar só esqueleto como modelo (ou Guardar personagem na biblioteca), com sessão iniciada. O modelo pode ser aplicado depois através de Reutilizar esqueleto guardado. A preparação visual pode ser feita numa sessão posterior. Para testar sem upload, Projetos → Teste · esqueleto da P.E.K.K.A.

Animação permite testar os ossos e guardar poses estruturais. Para os membros desenhados acompanharem independentemente, continuam necessários recortes ou PNGs separados associados aos ossos. A imagem inteira pode continuar a ser animada como uma camada com posição, escala e rotação no Estúdio. MP4 continua indisponível.
