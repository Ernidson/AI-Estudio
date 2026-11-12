# Calibração da montagem e armas — atualização incremental

## Referência e preservação

Foi inspecionado o MP4 fornecido «Episódio 1 — Treino e Primeiro Confronto — PROTÓTIPO»: 24 s, 720×1280, 30 FPS, sem áudio. Mantém-se o mesmo editor, Diretor e exportador. Não foram eliminados recursos nem migradas/recriadas tabelas. As alterações das propostas não substituem automaticamente rigs/projetos guardados.

## Causas encontradas

- A pose anterior usava o centro/proporções genéricas e alinhamentos de imagem aproximados. A imagem-mestra da P.E.K.K.A. inclui a espada à esquerda: o centro do corpo está próximo de 60% da largura, não 50%.
- Alguns pontos de ligação estavam nas margens transparentes ou fora do tronco; encaixar o comprimento genérico do osso estreitava as peças.
- O corpo da P.E.K.K.A. ficava estreito, os membros separados e a orientação de algumas peças não correspondia à referência frontal.
- O arco era dimensionado pela largura integral do PNG, que tem muita margem vazia.
- O projétil pressupunha ponta à direita e traseira à esquerda. O PNG real da flecha aponta para a esquerda e tem eixo inclinado.

## Correções

- Perfis EP01 medidos contra as imagens-mestras: posição corporal, ombros, braços, cotovelos, pulsos, ancas, joelhos e tornozelos específicos de cada personagem.
- Escala uniforme a partir do conteúdo alfa real, sem regravar PNGs; pontos de encaixe dentro das peças, maior sobreposição e revisão da ordem de desenho.
- P.E.K.K.A. com volume de tronco/armadura e membros recuperado; botas utilizam a zona do pé do original para evitar duplicar a greva.
- Arqueira com braços/coxa/canela mais próximos das proporções da referência e ligações contínuas nas poses verificadas.
- Arco conhecido calibrado pelo conteúdo visível, altura da personagem, pega e eixo semântico entre corda e corpo; corda usa extremidades reais do PNG. Não depende de flip arbitrário.
- Flecha com `arrow_tip`, `arrow_nock`, `arrow_center` e `arrow_direction` persistentes nas ancoragens. A rotação desconta a orientação original do PNG; largada, voo, curva e fixação no impacto utilizam a ponta real.
- Segunda flecha conserva os metadados semânticos da primeira. Pontos podem ser corrigidos no painel de acessórios; alterações posteriores requerem recalcular o voo.
- Pega e tamanho da espada EP01 ajustados ao original. A ligação continua a usar o sistema existente da mão e das transformações globais.

## Comparação e auditoria visual

«Calibração visual e teste de encaixes», no importador e editor de articulações:

1. Renderiza píxeis reais de 29 instantes de oito poses temporárias, sem sobrepor a imagem-mestra estática.
2. Compara a silhueta neutra com a referência por IoU.
3. Verifica presença de píxeis perto das juntas nos dois segmentos envolvidos.
4. Identifica as peças/poses onde o contacto é insuficiente.
5. Mostra referência e proposta lado a lado; só aplica mediante ação explícita.
6. Guarda o relatório no rig. Ajustes manuais e curvas permanecem nos documentos; reabrir não recalibra.

O Diretor recebe uma verificação visual antes da prévia. Os alertas ficam no plano e é necessário reconhecer que se está a continuar com um protótipo. Não foi substituído o compilador de cenas.

### Limites da medição

IoU não é nota de qualidade artística. A referência pode conter espada, capa, perspetiva ou detalhes ausentes nas peças. Testes de contacto usam vizinhanças de píxeis e não provam que todas as articulações estão perfeitas em qualquer ângulo. Mira/ataque da auditoria são poses estruturais; corda, acessórios e trajetórias são verificados separadamente na cena e nos testes de projéteis. Não há reconstrução de píxeis escondidos por IA.

## Testes técnicos

- Tipagem TypeScript.
- `test-calibration.mjs`: perfis e proporções; PNG real da flecha para direita, esquerda e diagonais; curvas; traseira na mão até à largada; ponta tangente à trajetória; colisão/fixação e roundtrip pelos handlers autenticados com D1/R2 simulados.
- Regressões: skin binding/Lia, IK e barra fixa, acessórios, biblioteca de movimentos, personagens preparados, batalha, Diretor, importação EP01 e contratos/variantes.
- Gravação/reabertura técnica mantém curvas, rigs, ligações, ancoragens e eBooks anteriores.

## Testes no navegador

Registar resultados finais e ficheiro exportado na secção seguinte, sem confundir a API simulada com uma sessão real de produção.

### Resultados observados nesta sessão

- Importador real: reconhecer/confirmar/montar ambos os conjuntos EP01.
- P.E.K.K.A.: 29 instantes renderizados, IoU 71,7%, nenhum alerta de contacto no teste por vizinhança alfa. A silhueta permanece diferente da referência; não foi aprovada artisticamente.
- Arqueira: 29 instantes renderizados, IoU 80,0%, nenhum alerta de contacto no teste por vizinhança alfa.
- Cena real: arco levantado, puxada, flecha/impacto e ataque da P.E.K.K.A. inspecionados na timeline.
- Arqueira exportada e reaberta pelo importador ZIP com 16 peças, 16 juntas e seis variantes; relatório de calibração e pivôs incluídos no contrato.
- MP4 completo novamente produzido pelo exportador existente, descarregado e validado: H.264, 720×1280, 30 FPS, 720 frames, 24,000 s, sem áudio (o episódio não fornece som). FFmpeg descodificou todos os frames sem erro. Não é um WebM renomeado.
- A abertura do leitor externo por URL blob foi recusada pela política do navegador remoto. Não se declara reprodução manual fora do editor; a verificação externa realizada foi a descodificação integral do ficheiro.
- Projeto JSON exportado e reaberto no navegador como cópia independente: 24 s, 21 elementos, rigs e timeline preservados.
- Gravação autenticada em produção continua por validar: a interface devolve «Sessão necessária». Não houve tentativa de contornar autenticação nem de iniciar validação Google.

## Utilização e preservação das correções manuais

Para novas montagens EP01: abrir Episódio 1 ou reconhecer o pacote no importador. Para um rig antigo: Editar articulações → Calibração visual e teste de encaixes → Propor calibração pela imagem-mestra → rever → Aplicar → guardar o personagem/projeto. A aplicação não altera automaticamente rigs antigos ao abrir.

As propostas conservam curvas/IDs por associação e peças adicionais. Recortes poligonais manuais não são substituídos pela proposta automática. A alteração fica no histórico normal e pode ser desfeita. Uma referência ou peça não reconhecida continua a exigir associação/calibração manual; não existe recuperação universal de anatomia por IA.

## Intervenção artística restante

- Corrigir diferenças de perspetiva e desenho entre PNGs e imagem-mestra: placas/joelheiras da P.E.K.K.A., capa e aljava da Arqueira.
- Rever o encaixe de todas as variantes de mãos/expressões e movimentos extremos; o teste básico não cobre todas as combinações.
- Partes ocultas inexistentes exigem novo PNG ou reparação manual; não foram geradas por IA.
- Aprovação completa de caminhada natural, conteúdo de arma/mão e estilo exige revisão do vídeo. A melhoria é incremental, não uma certificação de montagem perfeita para qualquer personagem.
