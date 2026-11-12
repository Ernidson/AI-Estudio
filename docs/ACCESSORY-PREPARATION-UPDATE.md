# Acessórios e preparação manual — atualização V8

## Reutilizado e preservado

O mesmo projeto EBOOK AI STUDIO e a mesma identidade de alojamento. Autenticação, tabelas e ficheiros originais não foram alterados. Reutilizados: avaliação recursiva da cena, FK/IK e limites, recortes com skinning rígido, canais e eventos de keyframes, histórico, biblioteca e rotas autenticadas, câmara, camadas/grupos, áudio, gameplay, múltiplos personagens e abertura vertical 9:16.

## Causa encontrada e correções

A avaliação existente já resolvia as articulações antes dos acessórios. A falha reproduzível no fluxo era a escolha do braço: o acessório era ligado por predefinição à mão direita, mas o preset atacava com o braço esquerdo. O preset passa a seguir o braço com o acessório ativo, com preferência por uma espada quando existe também um escudo; a interface mostra o braço e permite escolha explícita. Duas armas em braços diferentes exigem escolha explícita. Uma ligação a um ponto estático de uma imagem não é uma ligação a um osso; essa diferença fica visível.

O editor de articulações anteriormente escondia os acessórios na vista local. Agora utiliza a mesma avaliação de cena e a matriz inversa do personagem para os mostrar nesse espaço, incluindo transformações globais e espelhamento. Em Preparação mostra a referência neutra; em Animação avalia a pose atual. Acessórios podem ser selecionados e ajustados no mesmo editor.

Encontrado no teste real: botões de keyframes próximos sobrepunham as áreas de clique, selecionando por vezes o instante vizinho. A largura das áreas passa a adaptar-se à distância entre pontos. Um clique em 1,500 s foi confirmado como 1,500 s após a correção.

Não se reconstruiu o rig nem o sistema IK existente. Não foi possível verificar o caso específico da Lisa guardada: a consulta disponível de video_projects não devolveu projetos e o navegador local estava sem sessão autenticada. A demonstração chama-se Lia e está identificada como referência de teste.

## Implementado

- Lista de acessórios, indicação de articulação e seleção dentro do editor de articulações.
- Ligação à articulação com offsets, rotação, escala relativa e pivô; estados de ligação e soltura por keyframe.
- Soltura preservando a transformação visual e controlos independentes X/Y, rotação e escala; gravação explícita de pose/pega.
- «Adicionar esqueleto base»: modelo geométrico genérico, editável; acrescenta apenas articulações ausentes e conserva as existentes. Não analisa nem separa a imagem.
- Modelos reutilizáveis de esqueleto sem partes visuais ou animações; aplicação ajustada às dimensões da nova imagem e preservação dos recortes, limites e curvas existentes.
- Pivô ajustável para peças visuais do rig; importação PNG e associação de partes continuam a usar o fluxo existente.
- Separação manual de regiões com polígono/retângulo, pontos arrastáveis e edição numérica. Nova camada com exterior transparente, original imutável, contorno corrigível depois da separação.
- Preenchimento transparente, cor plana ou clone de píxeis vizinhos, pré-visualização e pincéis de pintura, apagar alfa e restaurar original. Não há reconstrução por IA.
- Exportação da peça preparada para PNG transparente; armazenamento não destrutivo das regiões e retoques no documento.
- Estrutura física opcional versionada com enabled/gravity/collisions obrigatoriamente false. Nenhuma física ativa.
- Presets não são apresentados como animação completa quando faltam associações visuais nos membros necessários.
- Dois rascunhos de teste em Projetos: «Teste · espada e ataque» e «Teste · esqueleto da P.E.K.K.A.»; não substituem projetos guardados.

## Testes técnicos executados — passaram

- `npx tsc --noEmit`
- `node scripts/test-accessory-preparation.mjs`: 280 instantes de ataque e poses manuais, pega/rotação/escala sob transformação global e espelhamento; seleção automática do braço; ambiguidade; soltura e curvas livres; modelos de esqueleto; pivôs; recorte nos píxeis reais da P.E.K.K.A.; clone/cor/pincéis; original intacto; física ativa rejeitada.
- `node scripts/test-rig.mjs`
- `node scripts/test-skin-binding.mjs`
- `node scripts/test-animation-editor.mjs`
- `node scripts/test-scene-interactions.mjs`: inclui barra fixa com 90 instantes, IK, limites/comprimentos, dois personagens com espadas e soltura.
- `node scripts/test-vertical-cutouts.mjs`: abertura 9:16, câmara, recortes inteiros, conexões, grupos e pivôs.

Os testes de persistência invocam as rotas reais com D1/R2 simulados, incluindo autenticação, isolamento por proprietário e reabertura. Não equivalem a uma gravação autenticada no navegador de produção.

## Teste visual real no navegador local

Executado no Chrome através da interface:

1. Abrir demonstração de espada; remover e reaplicar Ataque simples. Interface escolheu o braço direito com a espada.
2. Abrir editor de articulações, ativar Animação e percorrer a agulha. Espada visível junto à mão, braço desenhado a acompanhar o ataque.
3. Ajustar pega X de 12 para 14 e observar em 0 s, 1,5 s e pose manual de 5 s. Medição das matrizes efetivamente desenhadas no SVG: discrepância inferior a 0,000001 píxeis locais entre a pega e o alvo da mão nos instantes verificados.
4. Soltar em 5 s, verificar controlos de objeto livre, alterar X e gravar transformação independente. Eventos livres visíveis na linha do tempo.
5. Reproduzir e pausar a sequência principal; a agulha avançou e o objeto chegou à fase livre.
6. Abrir P.E.K.K.A., adicionar base e alterar X de referência para 620. Interface manteve aviso de ausência de peças visuais e bloqueou presets que exigem preparação.
7. Selecionar polígono da espada por coordenadas, pré-visualizar transparência, separar em nova camada, corrigir contorno, sobrepor a peça e verificar ligação para transferir PNG.
8. Tentar guardar modelo e projeto: resposta «Sessão necessária». Não foi contornada a autenticação.

Capturas reais: [ataque e acessório](browser-v8/attack-editor.png), [separação manual](browser-v8/piece-editor.png).

Não foram aprovados como testes interativos: arrasto direto da mão/acessório por rato, pintura livre/retângulo, importação PNG autenticada, reabertura autenticada da Lisa, barra fixa ou dois personagens nesta sessão. A lógica correspondente foi coberta tecnicamente; as interações precisam de confirmação numa sessão autenticada real.

## Como testar na aplicação

1. Estúdio de Vídeos → Projetos → Teste · espada e ataque. É um rascunho de demonstração, não a Lisa guardada.
2. Selecionar Lia → Editar articulações → Animação. Percorrer 0–3 s (ataque), 4–6 s (poses manuais), 7 s (soltura) e 8 s (objeto livre).
3. No painel Acessórios selecionar espada, ajustar pega, voltar ao corpo e aplicar outro preset sem sobrepor o intervalo existente. Para duas espadas, escolher o braço explicitamente.
4. Guardar com sessão iniciada, fechar e reabrir por Projetos. Verificar as mesmas poses e eventos. Esta etapa permanece por validar no navegador.
5. Projetos → Teste · esqueleto da P.E.K.K.A. → selecionar personagem → Editar articulações. Ajustar a base e guardar só esqueleto; aplicar depois pelo seletor de modelos.
6. Separar peça em camada / corrigir corpo → selecionar espada → pré-visualizar → separar. Afinar contorno, preparar a pega e ligar ao pulso. Preparar braços/tronco como peças próprias antes de exigir ataque articulado.

## Limitações e próximos passos

A separação é manual e pode deixar regiões incompletas; clone e pintura exigem correção. Não existem segmentação automática ou reconstrução de regiões escondidas. Recortar a espada não prepara os braços. Uma imagem inteira continua utilizável como recorte animável na abertura vertical, sem pressupor membros independentes.

Limites de edição: 40 pontos por contorno, 24 regiões e 40 retoques por imagem; histórico existente e limites gerais do projeto mantidos. O polígono pendente só é guardado ao separar/atualizar; contornos já aplicados e retoques ficam no documento. Sem benchmark no hardware solicitado.

Falta aceitação na Lisa real e gravação/reabertura em sessão autenticada, incluindo arrasto interativo. A autenticação foi preservada; não foi retomada validação Google. Exportação MP4, gravidade e colisões continuam pendentes/desativadas.
