# Correção de ligação visual e arrasto do personagem

5 de novembro de 2026. Mesmo EBOOK AI STUDIO, sem alterações à autenticação, à estrutura persistente dos projetos ou aos eBooks.

## Estado de aceitação

**Candidato a correção; validação de interface pendente.** Não considerar a correção concluída antes de executar no navegador o teste de Lia por arrasto, reprodução, gravação e reabertura. Os testes técnicos e de píxeis descritos abaixo não substituem esse teste.

A pré-visualização gerida está indisponível (`preview relay unavailable`). A aplicação privada exige uma sessão ChatGPT no navegador de teste. Não foi desativada nem contornada a autenticação.

## Defeitos encontrados no código

1. O modo Animação podia ser ativado apenas por existirem articulações, mesmo quando o personagem não tinha nenhuma parte visual ligada. Os modelos genéricos e a proposta de deteção automática criam articulações, não recortes. Nesse caso a imagem era estática e apenas os ossos mudavam.
2. Arrastar a **parte desenhada da mão** usava o mesmo caminho de rotação local de qualquer parte: rodava o pulso. Só arrastar o ponto do esqueleto chamava o IK. Por isso pegar na mão desenhada não deslocava o braço inteiro.
3. O IK anterior, baseado apenas em CCD, podia permanecer imóvel quando o braço estava perfeitamente esticado e o destino ficava na mesma linha, mais perto do ombro.
4. A imagem completa de referência podia continuar sobreposta no modo Animação, criando uma silhueta estática por baixo das partes.

A confirmação da causa exata no caso observado pelo utilizador, especialmente numa Lia já preparada, exige reprodução no navegador. Não se afirma que esses quatro caminhos expliquem todos os casos sem esse teste.

## Alterações no candidato

- Matriz de skinning comum para cada parte: posição/rotação mundial da articulação, colocação relativa ao pivô, rotação própria, escala do recorte e coordenadas da imagem-fonte.
- Renderização direta das imagens recortadas, eliminando a dependência de referências SVG `<use>` no carregamento, transformação e hit testing das partes.
- Arrasto da mão/pé desenhados aciona IK dos dois segmentos ascendentes. Preserva a diferença entre o ponto onde o utilizador pegou e o pivô, para evitar saltos no início do arrasto.
- Arrasto de cabeça/braço/antebraço continua a rodar a articulação respetiva e a propagar para descendentes.
- IK com ponto de partida analítico de dois segmentos e refinamento CCD limitado, incluindo o caso de braço inicialmente esticado.
- Captura do ponteiro, filtragem de pointerId e limpeza dos listeners; uma entrada de histórico por arrasto.
- Bloqueio explícito do modo Animação/reprodução articulada quando não existem recortes visíveis associados. Aviso e entrada direta na preparação manual.
- A imagem estática de referência é exclusiva do modo Preparação. A animação mostra as partes reais.
- Falhas ao carregar imagens das partes são apresentadas como erro, nunca como animação visual bem-sucedida.
- Para Lia sem recortes, há uma ação explícita para aplicar a preparação manual de referência, com confirmação e possibilidade de desfazer. Não altera automaticamente os personagens guardados.
- Projetos anteriores, dados de rig, poses, áudio, gameplay e biblioteca mantêm os seus formatos. Não foi criada migração nem modificado qualquer registo de produção para estes testes.

## Ana e imagens únicas

A Ana original é uma imagem única sem recortes no modelo genérico. É corretamente classificada como **preparação visual incompleta** até associar partes. Criar apenas o esqueleto não basta. Recortar cabeça, tronco, braço e antebraço, associar as partes aos pivôs e corrigir sobreposições continua a ser necessário.

Partes em ficheiros separados usam a mesma matriz de ligação. Não há reconstrução de regiões escondidas nem deformação de malha. MP4 permanece pendente.

## Testes técnicos realizados

`node scripts/test-skin-binding.mjs` inclui os testes anteriores de vídeo e acrescenta:

- Arrasto da parte desenhada da mão modifica as matrizes do braço e do antebraço e cria pontos-chave em ambos.
- A posição agarrada da mão é preservada, sem salto para o pivô.
- Arrasto da cabeça modifica a sua imagem e não executa IK do braço.
- Braço esticado dobra para um destino colinear mais próximo; limites continuam a ser respeitados.
- Ana sem recortes é identificada como não preparada.
- Uma parte num ficheiro de imagem separado herda o movimento do ascendente.
- Rasterização do componente real de partes: 14 408 píxeis alterados após os arrastos de mão/cabeça, sem pontos, ossos ou referência estática no render. É uma prova do motor de imagem, não da interação do navegador.
- Três poses criadas pelo mesmo código de arrasto e respetivas matrizes são preservadas após gravação/reabertura da API com D1/R2/identidade simulados.

Também passaram `node scripts/test-rig.mjs`, `node scripts/test-studio.mjs` e `npx tsc --noEmit`.

## Teste de aceitação no navegador (obrigatório, ainda por executar)

- [ ] Autenticar o navegador de teste na aplicação privada sem alterar as regras de acesso.
- [ ] Criar uma **cópia de teste** a partir de Projetos → Teste articulado · 3 poses, preservando os projetos guardados.
- [ ] Selecionar Lia e abrir Editar articulações → Animação.
- [ ] Capturar a imagem inicial e arrastar a **mão desenhada**; confirmar visualmente que braço e antebraço seguem o movimento.
- [ ] Dobrar o cotovelo e rodar a cabeça; confirmar a alteração dos píxeis visíveis, além das articulações.
- [ ] Criar poses locais em 0, 2 e 4 s; reproduzir as transições e verificar os limites.
- [ ] Guardar a cópia, fechar o editor e reabrir o projeto guardado; repetir a reprodução.
- [ ] Abrir Ana e confirmar o aviso de preparação incompleta; verificar um recorte associado antes de aceitar a animação da sua imagem.
- [ ] Registar capturas reais do navegador e o resultado, ou o impedimento concreto.

Uma publicação privada do candidato para possibilitar este teste não equivale a aprovação da correção.
