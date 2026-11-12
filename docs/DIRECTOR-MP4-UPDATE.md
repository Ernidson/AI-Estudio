# V15 — Diretor por roteiro e MP4

## Implementado

- Diretor por roteiro no Estúdio existente: plano JSON versão 1 validado, campos gerais, seis cenas do treino da Arqueira, revisão de recursos e modos Automático/Assistido. JSON externo e vocabulário textual controlado são suportados. Não existe interpretação livre por IA configurada.
- Referências explícitas a personagens da conta/cena/biblioteca. Recursos de exemplo exigem escolha; cenário placeholder exige autorização. Personagens não são redesenhadas nem geradas. Recursos incompatíveis bloqueiam geração e indicam o motivo.
- Geração de elementos reais: partes articuladas, presets, transformações, acessórios, corda, duas flechas independentes, trajetórias, impacto, alvo, poeira, áudio existente e câmara. Tudo fica na linha do tempo e guarda o roteiro, plano, associações e identificação dos elementos gerados.
- Correção isolada de uma cena, com conservação dos outros movimentos. Alterações de intervalos ou conflitos com pontos manuais são recusadas para evitar perdas silenciosas.
- Exportação MP4 local progressiva e determinística por frame. H.264 por software, AAC nativo ou fallback WASM do pacote @mediabunny/aac-encoder (MPL-2.0, código original não modificado). 720/1080, 24/30 FPS, intervalo, mistura de áudio, progresso, cancelamento, erros e descarga após validação. Não usa gravação do ecrã nem WebM renomeado.
- Reabertura de projeto JSON como cópia, sem substituir projetos guardados nem confiar em URLs externas importadas.

## Reutilizado e preservado

Modelo de documento, editor, camadas, transformações, pivôs, recortes, rigs, avaliação FK/IK, fixações, keyframes, presets, biblioteca, ligações de acessórios, gerador vetorial de arco, sistema de disparos/impactos, câmara, histórico e API de persistência existentes. Autenticação e configuração D1/R2 mantidas. Nenhuma migração destrutiva nem eliminação de projetos.

## Testes técnicos

- TypeScript e git diff --check aprovados.
- scripts/test-director.mjs: intervalos 0–4/4–10/10–15/15–21/21–28/28–34; reutilização de recurso preparado simulado sem mudar imagem/peças; releases em 10 e 25,2 s; primeiro disparo sem colisão no alvo; segundo com colisão e fixação; IDs reproduzíveis; regeneração apenas da cena 5 conserva pontos das restantes; guardado/reabertura via handlers reais com D1/R2 autenticado simulado; importação JSON; âncoras manuais; seguimento/tremor de câmara.
- Regressões aprovadas: test-battle-studio, test-skin-binding, test-scene-interactions, test-motion-library, test-assisted-studio, test-accessory-preparation, test-animation-editor, test-studio. Incluem ligação visual, IK/barra, acessórios e múltiplas personagens. São testes técnicos, não equivalem a repetir toda a interação no navegador.

## Testes reais no navegador

- Sessão de desenvolvimento sem autenticação da conta. Não foi contornado o login.
- Seleção explícita da Arqueira de referência já existente, mantendo os seus recursos. Cenário geométrico marcado PLACEHOLDER e alvo vetorial. Não foi usada nem substituída a Arqueira privada guardada pelo utilizador, cuja validação permanece pendente.
- Pré-visualização e geração da timeline de 34 s, revisão das seis cenas, adição de áudio existente, alteração isolada do zoom da cena 5, transferência/reabertura de JSON como cópia.
- Exportação completa 1080×1920/30 FPS com AAC; exportação de intervalo 1–3 s em 720×1280/24 FPS sem áudio; cancelamento com mensagem e sem ficheiro concluído.
- Exportação anterior sem áudio reproduzida fora do editor no Kdenlive, com perfil vertical 30 FPS e imagem em movimento observada. Não foi certificado o desempenho no computador físico do utilizador.

## Ficheiros MP4 efetivamente validados

- Completo com áudio: H.264, 1080×1920, 30/1 FPS, 1020 frames, vídeo 34,000 s, AAC 34,005333 s. Descodificação integral por FFmpeg sem erros; aplicação valida metadados e descodifica amostras de vídeo/áudio antes de indicar sucesso.
- Intervalo sem áudio: 720×1280, 24 FPS, 48 frames, 2 s. Descodificação integral sem erros.
- Provas em browser-v15/exportacao-validada.png e relatórios ffprobe na mesma pasta. O som de teste é o sinal sonoro existente, não narração nem música inventada.

## Limitações e pendências

- Repetir aceitação com a Arqueira realmente guardada na conta e gravação/reabertura autenticada em produção. Sem sessão disponível não é possível certificar esse recurso.
- Sem modelo de linguagem configurado, texto livre arbitrário não é interpretado. Usar formulário, vocabulário predefinido ou JSON.
- Servidor FFmpeg não configurado. O Worker atual não executa processos FFmpeg; navegadores sem H.264 ou sem memória suficiente recebem erro. Renderização remota, projetos longos/pesados e benchmark em i7/16 GB continuam pendentes.
- Teste separado de exportação de projeto mínimo e todas as regressões interativas individuais não foram repetidos. Exportação de múltiplas camadas e intervalo foram verificadas.
- Texto Canvas pode ter diferenças de quebra de linha em relação ao SVG do editor. Expressões inexistentes não são criadas: reações usam movimentos corporais compatíveis. Imagens inteiras continuam limitadas a transformações simples.
- Sem mãe/campo de treino da conta confirmado, esses recursos não são fingidos: mãe omitida, cenário placeholder identificado. A sequência de referência não substitui a validação artística dos recursos finais.

## Como testar

Estúdio de Vídeos → Diretor por roteiro → carregar «O treino da Arqueira» → escolher e confirmar Arqueira da conta e cenário → rever/aprovar cenas → pré-visualizar → gerar timeline. Guardar na conta, reabrir e ajustar keyframes. Para corrigir uma cena, abrir o diretor e usar «Aplicar apenas esta cena». Exportação → escolher resolução/FPS/intervalo/áudio → Exportar vídeo MP4 → aguardar «produzido e validado» → Descarregar MP4.
