# Animação visual — Lia, P.E.K.K.A. e Arqueira

## Diagnóstico e prioridade Lia

A Lia do «Teste articulado · 3 poses» foi testada no navegador antes da nova preparação. O braço desenhado acompanhou o arrasto da mão, com 16 partes e matrizes de skinning atualizadas. Não foi reproduzida uma falha do renderizador neste rig preparado.

Foi encontrada uma diferença concreta no fluxo: a entrada Lia da biblioteca era uma imagem única, sem rig/partes, enquanto o teste articulado incluía a preparação visual. A versão anterior passou a permitir animar só o esqueleto, o que expunha essa diferença: adicionar ossos a essa imagem não associava automaticamente os membros desenhados.

Correções:

- Lia da biblioteca passa a entrar com a preparação visual de referência conhecida, sem alterar cópias já guardadas.
- Em personagens sem associações, o editor lista as articulações sem peça visível. Para recursos de referência conhecidos existe «Aplicar peças visuais de referência», com confirmação, histórico e conservação dos pontos/limites dos ossos coincidentes. A aplicação da referência substitui a geometria atual; não é uma segmentação automática de qualquer imagem.
- A preparação estrutural livre continua disponível. Sem peças, o editor continua a identificar a imagem como referência estática.
- O motor FK/IK e a ligação visual existente foram reutilizados.

Não foi possível verificar um projeto pessoal guardado do utilizador: o navegador de teste estava sem sessão autenticada. Não se declara uma reparação automática de todos os projetos antigos.

## Interação e acessórios

Foi identificado e corrigido um problema real de seleção com recortes de uma folha grande: o retângulo transparente de um acessório podia capturar cliques destinados ao corpo e abrir o editor do acessório sem rig. A pré-visualização principal passa a limitar a área de clique ao polígono do recorte.

As juntas são desenhadas acima dos acessórios no editor de articulações, permitindo agarrar uma mão mesmo com espada/arco sobrepostos. Seleção e ajuste dos acessórios pela lista continuam disponíveis. Posição, rotação, escala, pega, ligação/desligação e curvas livres usam o sistema existente.

## Preparação das imagens fornecidas

Os dois ficheiros são folhas de 1448 × 1086 com fundo preto opaco, sem transparência real. Foram copiados integralmente para os recursos do mesmo projeto. Os originais permanecem intactos.

Criadas preparações manuais em código, com polígonos editáveis em coordenadas originais:

- P.E.K.K.A.: cabeça/capacete, pescoço, tronco, quadril, braços, antebraços, mãos, coxas, pernas e pés associados aos respetivos ossos. Espada isolada numa camada independente, ligada ao pulso direito. Preset de ataque de 0–3 s com amplitude moderada.
- Arqueira: cabeça, pescoço, tronco, capa/quadril, braços, antebraços, mãos, coxas, pernas e pés. Arco independente ligado à mão direita. Sequência de 5 s com poses de mira, puxada e recuperação, por pontos-chave reais.
- Regiões sobrepostas são excluídas das peças inferiores para evitar cópias estáticas de membros. As exclusões podem ser removidas nas propriedades da peça.
- Pequenas sobreposições geométricas manuais nas juntas ajudam a cobrir as uniões. São peças editáveis identificadas como sobreposições, não reconstrução automática, e não contam como preparação anatómica completa nos diagnósticos.
- Remoção local do fundo preto; semente adicional remove a zona preta fechada dentro do arco.
- Corda desenhada entre as pontas do arco e a mão de puxar, usando as transformações de cena atuais. Ao atingir o tempo de libertação, regressa à posição de repouso. O tempo é editável nas propriedades do acessório.
- A imagem fornecida não contém flecha solta. Foi adicionado um recurso vetorial de exemplo, claramente nomeado. Tem ajustes de ligação para a direção de mira, desligação aos 3,6 s, deslocação independente e ocultação depois de sair. Não há física realista.

Disponíveis em Projetos: «P.E.K.K.A. · ataque preparado» e «Arqueira · apontar e disparar». São rascunhos reproduzíveis, não registos inseridos na conta sem sessão. As novas imagens preparadas e a flecha estão também na biblioteca de exemplos. As imagens anteriores, abertura vertical e todos os projetos antigos mantêm-se.

## Testes reais no navegador local

### Lia

- Aberto o teste articulado antes de alterar a preparação; arrastada a mão por IK. O antebraço desenhado mudou de posição e rotação.
- Removida a animação existente e aplicado Acenar; percorrido 1,5 s e confirmado o desenho animado.
- Testada a nova entrada da biblioteca: entrou com 16 partes associadas.
- Tentativa de guardar retornou «Sessão necessária».

### P.E.K.K.A.

- Aberta a preparação com peças e espada independente; observada pose de ataque a 1,5 s.
- Arrastada a mão com o rato em Animação; armadura e espada acompanharam o movimento. Matrizes do antebraço mudaram.
- Confirmados acessórios dentro da área de articulações e modo 9:16.

### Arqueira

- Aberta preparação com peças e arco ligado; inspecionada pose de puxar aos 2,7 s, braços, arco, corda e flecha alinhada.
- Arrastada a mão direita com o rato, alterando braço e arco.
- Percorridos 3,7 s: corda em repouso após a libertação. O evento da flecha e as curvas independentes existem na linha do tempo; não foi feito um teste visual contínuo de toda a trajetória final.
- Lia adicionada à mesma cena da Arqueira, mantendo personagens distintos.
- Tentativa de guardar retornou «Sessão necessária».

Capturas reais: [Lia](browser-v10/lia-arm.png), [P.E.K.K.A.](browser-v10/pekka-arm-sword.png), [Arqueira](browser-v10/archer-aim.png).

A gravação/reabertura autenticada no navegador e o upload autenticado dos ficheiros continuam por validar. Não se contornou a autenticação, não se retomou a validação Google e não se alteraram os dados existentes.

## Testes técnicos

- `npx tsc --noEmit` e compilação de produção.
- `node scripts/test-prepared-characters.mjs`: imagens reais renderizadas sem ossos sobrepostos; comparação de píxeis antes/depois de IK (mais de 100 píxeis alterados por personagem), cobertura de associações, matrizes durante preset, 80 instantes por acessório, corda a puxar/soltar, flecha ligada/livre, formato 9:16 e persistência integral pelas rotas reais com D1/R2 simulados.
- `node scripts/test-skin-binding.mjs`: movimentos manuais, cabeça, singularidade IK e persistência do skinning.
- `node scripts/test-skeleton-workflow.mjs`: imagem única, esqueleto livre, nota não bloqueadora e modelos.
- `node scripts/test-accessory-preparation.mjs`: acessórios, transformações globais, espelhamento, recortes e persistência.
- `node scripts/test-scene-interactions.mjs`: barra fixa/IK, 90 instantes, limites, dois personagens, acessórios e largada.
- `node scripts/test-animation-editor.mjs`: keyframes, dez presets, remoção e pose neutra, histórico e zoom.
- `node scripts/test-vertical-cutouts.mjs`: abertura 9:16, câmara, recortes inteiros, grupos e ligações.

Os testes de API usam autenticação e D1/R2 simulados; não equivalem a uma gravação na conta real no navegador.

## Limitações

A montagem é de peças rígidas com recortes e sobreposições manuais, sem malha deformável ou reconstrução de regiões escondidas. Em poses extremas ainda existem folgas, descontinuidades e regiões que precisam de afinação de contorno, pivô, limite e sobreposição; a roupa/armadura não se deforma como tecido. A corda é uma linha calculada, sem física. A flecha é um exemplo vetorial. A mudança dos tempos da flecha e da corda deve ser coordenada manualmente.

Os modelos fornecidos só são válidos para estas imagens exatas; não se aplicam automaticamente a qualquer importação. Para outro ficheiro, preparar o esqueleto e as peças pelo fluxo existente. Sem benchmark no computador de 16 GB. Exportação MP4 continua indisponível.
