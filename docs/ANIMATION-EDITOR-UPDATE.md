# Estúdio de Vídeos — canais, movimentos, presets e objetos

Atualização do projeto existente. Autenticação e tabelas anteriores preservadas; sem chaves comerciais. Migração 0003 apenas acrescenta `prepared_objects`. Nenhuma alteração ou regravação automática dos projetos existentes. A conversão dos pontos globais antigos só ocorre ao editá-los. MP4 continua indisponível.

## Implementação

- Canais independentes de posição X/Y, rotação, escala, opacidade e curvas por articulação; posição global e deformação rígida por recortes combinadas na pré-visualização. Cortes mantêm o relógio das curvas para preservar interpolação suave.
- Linha do tempo: expandir personagens, grupo de ossos e cada curva; seleção individual, Ctrl/Cmd para múltiplos, Shift para intervalo do mesmo personagem, arrasto horizontal, copiar/colar, apagar seleção, tempo a 0,001 s e edição de valores e suavidade. Colagens/movimentos com colisões são recusados. Histórico do projeto inclui estas operações.
- Zoom horizontal da linha do tempo mantém a escala comum das faixas e curvas.
- Preparação/animação: zoom de edição de 25% a 500%, roda, +/−, Ajustar à tela, ferramenta Deslocar vista, botão do meio ou Alt+arrasto. O zoom é transitório e não se torna movimento de câmara. Arrasto das articulações usa a inversa de `getScreenCTM`, incluindo o zoom, a posição global e a inversão horizontal.
- Em Animação: Ver cena global mostra a posição do personagem no enquadramento 1280×720. Mover corpo X/Y arrasta o personagem completo e escreve chaves de posição; desligar permite voltar a mover os membros. A vista global deste modal mostra o personagem selecionado; a composição com objetos e outros media continua na pré-visualização principal.
- Dez presets manuais, editáveis: respiração, acenar, caminhar, correr, saltar, agachar, sentar, levantar, ataque e defesa. Produzem chaves reais, respeitam limites e exigem articulações compatíveis. Duração base/velocidade determinam o intervalo, com opções de deslocação X ou altura Y. Sem física ou contactos automáticos com objetos. Não substituem silenciosamente curvas existentes.
- Remover animação selecionada só elimina as suas chaves. Repor pose original / Limpar todos os pontos-chave eliminam curvas e trocas de pose, preservando o personagem, a transformação base, ossos, recortes, limites e ligações. Criar pose neutra no tempo atual insere rotações de referência e mantém a posição X/Y atual.
- Biblioteca: cadeira, mesa e barra fixa demonstrativas; importação de PNG e outras imagens próprias na categoria Objetos. Objetos usam os controlos existentes de transformação e camadas. Guardar objeto preserva imagem, transformação base, inversão e pontos de ancoragem numa biblioteca por conta. As cópias nos projetos não dependem da existência do modelo reutilizável.
- Ancoragens editáveis com nome e coordenadas percentuais. São referências preparadas para futuras interações, sem constrangimentos de contacto atuais. Imagens referenciadas por objetos guardados não podem ser eliminadas inadvertidamente.

## Como testar na aplicação

1. Estúdio de Vídeos → Projetos → Demo · caminhada, salto e aceno. Cria um documento de demonstração novo; não substitui um projeto guardado.
2. Selecione Lia. Expanda os canais e Articulações. Caminhada 0–5 s; salto 6–9 s; aceno 10–14 s. A cadeira inclui ancoragem Assento.
3. Clique num losango; edite o tempo/valor. Use Ctrl/Cmd ou Shift, arraste vários pontos, copie e cole numa posição sem colisões. Apague e desfaça.
4. Abra Editar articulações → Animação. Amplie com a roda e arraste a mão. Use Alt+arrasto para deslocar a vista sem criar chaves. Ajustar à tela repõe apenas a vista.
5. Ative Ver cena global / Mover corpo X/Y. Arraste o corpo e observe a posição global; desligue a ferramenta para editar os membros. Verifique a composição completa na pré-visualização principal.
6. Em Animações, selecione Acenar → Remover animação selecionada. A caminhada e o salto permanecem. Repor pose original remove todas as curvas, mantendo a preparação. Desfaça para recuperar o exemplo.
7. Aplique outro preset num intervalo livre, ajustando duração/velocidade; edite as chaves geradas. Use a linha do tempo para modificar o início/fim de movimentos antigos sem etiquetas.
8. Guarde, abra outro projeto e reabra o guardado. Confira X/Y, chaves, partes e ancoragens. Importe uma imagem em Objetos, acrescente ancoragem, guarde como objeto reutilizável e reutilize noutro vídeo.

## Liza e animações antigas

As novas ferramentas operam sobre qualquer personagem guardado. Curvas antigas sem identificação de preset aparecem como «Animação existente (editável)», com início/fim e todos os pontos acessíveis. Remover esse grupo remove todas as curvas antigas sem etiqueta; se houver vários movimentos misturados, selecione apenas os pontos do aceno na linha do tempo. Não é possível inferir com segurança as fronteiras semânticas de animações antigas sem etiquetas.

Não foi disponibilizado um projeto guardado da Liza para este teste. Foi usada Lia, preparada por recortes de uma imagem única. Não se alterou, substituiu ou renomeou um personagem da conta para simular a Liza.

## Verificação realizada

- `npx tsc --noEmit`: passou.
- `node scripts/test-animation-editor.mjs`: canais X/Y, chaves e colisões, copiar/colar, curvas antigas, cortes suaves, dez presets, duração/velocidade, limites, incompatibilidades, remoção, pose neutra, coordenadas inversas a 25/100/200/500%, persistência, objetos e isolamento por conta. D1/R2 simulados, código real das rotas.
- `node scripts/test-rig.mjs`: FK/IK, limites, hierarquia, três poses, interpolação, preparação por imagem única e partes separadas, histórico, cortes e validação do detetor.
- `node scripts/test-skin-binding.mjs`: arrasto calculado da mão/cabeça move a imagem, braço reto dobra, Ana sem recortes é assinalada como não preparada, partes separadas herdam transformações, renderização muda 14 408 píxeis após movimento, persistência das poses.
- `node scripts/render-animation-proof.mjs`: renderização dos componentes reais da linha do tempo e editor no servidor; prova SVG/PNG do motor com caminhada, salto e aceno. `animation-motion-proof.png` é uma renderização técnica, não uma captura de navegador.

## Não verificado / limitações

O comando de pré-visualização e o diagnóstico devolveram `preview relay unavailable`. Não foi possível executar teste de rato, reprodução, guardar/reabrir na interface real do navegador. Não se retomou validação Google, conforme pedido. A atualização está tecnicamente testada, mas a aceitação visual interativa permanece pendente.

Não houve benchmark em i7 de 11.ª geração/16 GB ou GPU integrada. As animações usam SVG e recortes rígidos, sem IA, física pesada, malha deformável ou geração MP4. Os presets são movimentos estilizados aproximados, exigindo revisão por personagem; esqueleto personalizado deve usar identificadores canónicos ou nomes reconhecidos em português/inglês. Ossos ausentes são assinalados. Sem reconstrução de partes escondidas ou contacto automático ao sentar/andar.

Seleção múltipla e clipboard de chaves são por personagem; não há edição em lote entre vários personagens. O zoom da vista e os estados de expansão são preferências temporárias da sessão. Limites existentes mantêm-se: 5 min, 12 faixas, 120 elementos, 80 chaves por osso, 160 por canal global, 24 MiB por recurso. O servidor continua a validar o documento e os recursos antes de guardar.
