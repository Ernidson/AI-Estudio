# EBOOK AI STUDIO — Polimento 2D do Episódio 1

Atualização de 8 de novembro de 2026. Trabalha sobre a aplicação existente. Não substitui o Diretor por Roteiro, o exportador MP4, a autenticação ou a base de dados. A demonstração continua identificada como protótipo: melhoria técnica não equivale a aprovação artística de todas as poses.

## Correções implementadas

### Arqueira: ombros, braços e botas

A distância geométrica ao pivô não garantia contacto visual: algumas peças tinham zonas transparentes, o encaixe do ombro desenhado ficava visível quando o braço rodava e o interior escuro da bota parecia um buraco. A ordem de desenho também deixava visível o encaixe vazio do tronco.

Foi acrescentada compensação não destrutiva por peça, com deslocamento local X/Y, rotação, escala, prioridade de desenho e perfis interpolados pelo ângulo da articulação. Pré-visualização SVG e exportação Canvas usam as mesmas transformações. O editor permite ajustar e remover apenas essa compensação.

O perfil da Arqueira A3 sobrepõe discretamente os braços ao tronco, ajusta os antebraços e acrescenta quatro coberturas pequenas de juntas, copiadas de píxeis existentes das próprias peças. As botas passam a usar uma âncora de tornozelo explícita; a abertura é mascarada localmente para mostrar a sobreposição da canela. Os PNGs originais, ossos e animações não são redesenhados nem eliminados. Ajustes manuais ficam identificados e não são substituídos pelo perfil automático.

No importador, **Calibração visual e teste de encaixes → Reposicionamento fino automático** analisa o alfa de amostras de pose e apresenta uma proposta antes de aplicar. As deslocações são limitadas a 0,8% da altura do rig. Falta de conteúdo visual é assinalada; mãos com problemas de pega recebem aviso em vez de serem deslocadas automaticamente. Este analisador é uma heurística de contacto, não uma avaliação artística geral nem reconstrução por IA.

### IK e contacto com o chão

Foi corrigida a escolha de soluções angulares no IK: a versão anterior podia escolher uma versão periódica limitada a um extremo, apesar de existir uma solução analítica válida dentro dos limites. Isso provocava flexões inadequadas durante o apoio dos pés.

A aproximação em profundidade, quando a navegação e o apoio estão ativados, combina posição, escala, passos alternados, pequenas oscilações do corpo e fixações editáveis dos pés. As fixações compensam a alteração de escala entre frames para conservar a sola apoiada. A caminhada pesada tem menor cadência e amplitude, com atraso discreto dos braços. O ataque pesado ganha antecipação, golpe, continuação e recuperação. A Arqueira recua com passos, conservando a pose dos braços.

### Ocupação e profundidade 2.5D

Objetos podem declarar áreas locais de chão, bloqueio, decoração, cobertura e plataforma, com atravessabilidade e plano de profundidade. Personagens optam por navegação, raio ocupado, ponto dos pés, peso e apoio no chão. A opção **Zonas 2.5D** mostra as áreas e os conflitos na pré-visualização.

O planeador procura um desvio em torno de retângulos bloqueadores inflacionados pelo raio da personagem. Entradas ou destinos dentro de bloqueios são recusados com aviso. A aproximação gera os apoios depois de planear o percurso. A revisão de percursos existentes preserva os keyframes manuais; se uma mudança entrasse em conflito com apoios já criados, pede para reaplicar a caminhada em vez de deslocar as fixações silenciosamente.

A ordem de profundidade usa o contacto com o chão para elementos anotados e mantém os acessórios com a personagem. Projetos sem estes metadados conservam a ordem manual anterior. No novo protótipo EP01, a entrada da P.E.K.K.A. foi reposicionada para um corredor livre à esquerda da barricada. O fundo e os objetos reais do pacote receberam áreas explícitas baseadas no conteúdo visível, ignorando as margens transparentes.

## O que foi reutilizado e preservado

Rig hierárquico, recortes, associação visual, IK de dois segmentos, fixações, canais e grupos de keyframes, presets, objetos ligados às mãos, arco/corda/flecha, impactos, câmara, múltiplas personagens, animação manual, undo/redo, JSON, bibliotecas por conta e MP4 determinístico. Os novos campos são opcionais; não houve migração, limpeza ou substituição de dados da conta.

A nova demonstração é uma cópia independente. Projetos guardados anteriormente não são recalibrados automaticamente ao abrir.

## Testes técnicos executados

- TypeScript: sem erros.
- Regressões: calibração, montagem automática, episódio, interações de cena, skin binding/Lia, biblioteca de movimentos, batalha, personagens preparados, preparação de acessórios, Diretor e recortes verticais passaram.
- Novo teste de polimento: compensação por ângulo, IDs e ossos preservados, perfil idempotente, edição manual protegida, âncoras terminais e aplicação das correções aos píxeis reais das peças.
- Desvio de obstáculo sintético: 301 pontos do percurso livres; entrada e destino bloqueados recusados.
- Episódio real do pacote: 240 amostras de ocupação sem conflito.
- Entrada pesada de 12–16 s: 120 amostras de apoio, deslizamento máximo de 0,2894 px da sola, erro IK numericamente próximo de zero. São medidas do caso de teste, não garantia para qualquer movimento.
- Gravação/reabertura pelos handlers reais, com autenticação e D1/R2 simulados: todos os campos novos e antigos preservados.
- O renderer de peças reais alterou 8757 píxeis no teste de compensação; não foi verificado apenas o desenho dos ossos.

## Verificação real no navegador

Foi aberta uma nova cópia EP01 na interface existente e inspecionada a Arqueira a puxar o arco, a entrada da P.E.K.K.A., as zonas de ocupação e os keyframes. O reposicionamento fino foi executado no importador, com proposta e relatório.

No perfil normal da Arqueira: 29 instantes renderizados, silhueta com IoU de 79,8% e zero alertas de contacto na heurística. Esta métrica não afirma que a montagem é idêntica à imagem-mestra.

Num teste deliberado com o antebraço deslocado 32 px, o relatório sinalizou a pega do pulso, mantendo a mão intacta; não aplicou uma correção falsa. A distância residual estimada ficou em 12,7 px. Este caso continua a exigir ajuste manual do antebraço/pega. O botão não resolve todas as desconexões automaticamente.

A exportação JSON foi descarregada, reaberta pelo controlo normal da aplicação como cópia independente e exportada novamente. O conteúdo `data` dos dois ficheiros coincide integralmente: rigs, compensações, máscaras, pivôs, keyframes, fixações, ocupação, acessórios e câmara foram preservados.

Não foi concluída gravação na conta real nesta sessão: o preview não tinha sessão autenticada. O teste de API simulado não substitui esse teste de produção. A autenticação não foi contornada nem alterada.

## MP4 e comparação

O exportador existente produziu o episódio completo: **720 × 1280, H.264, 30 FPS, 24 segundos, 720 frames, sem áudio**. O projeto de origem não tinha faixa sonora. O ficheiro foi descarregado pela interface, inspecionado com ffprobe e integralmente descodificado pelo FFmpeg sem erros. Foram extraídos frames dos dois MP4 para comparação.

O teste não inclui reprodução manual num leitor externo nem avaliação de áudio nesta atualização. Não foi implementado um novo servidor FFmpeg nem alterado o exportador.

`comparacoes/episodio-antes-depois.jpg` compara os mesmos instantes dos vídeos anterior e novo. `comparacoes/arqueira-poses-antes-depois.png` compara três poses no renderer de PNGs reais, sem ossos desenhados. As capturas do navegador mostram a montagem no fluxo real do editor.

## Limitações e trabalho ainda necessário

- A navegação depende de áreas explicitamente configuradas. Não reconhece automaticamente obstáculos pintados numa imagem de fundo.
- A ocupação usa a base da personagem e retângulos 2.5D; não calcula colisões de cada placa, arma ou membro. Obstáculos móveis não têm planeamento contínuo. Plataformas estão classificadas como áreas bloqueadas; não há subida ou física 3D.
- Fixações fora de alcance, curvas apertadas, mudanças posteriores de cenário e poses extremas precisam de revisão. O medidor de pés apresenta estes problemas.
- As sobreposições reduzem os vazios nas poses ensaiadas, mas não criam conteúdo escondido. Persistem diferenças de desenho/perspetiva entre algumas peças, contornos de botas e poses de braço extremas. Não se declara perfeição visual em todos os ângulos.
- O corretor residual tem procura local limitada e não substitui avaliação artística. Uma peça sem textura útil, um pulso desalinhado ou uma associação errada pode exigir preparação manual ou substituição.
- A caminhada foi melhorada nos movimentos com os novos metadados; animações antigas não são reescritas silenciosamente. O resultado permanece animação 2D por recortes, não marcha biomecânica completa.
- Não houve benchmark no computador i7/16 GB do utilizador. O MP4 foi testado a 720p no navegador disponível; não se promete desempenho universal.

## Como testar na aplicação

1. No Estúdio de Vídeos, abrir **Episódio 1 · 60 PNGs e montagem → Abrir demonstração editável**. Guardar com outro nome se pretender conservar a versão anterior.
2. Rever 0 s, 3,8 s, 4,8 s, 14,2 s, 15,6 s, 17,8 s, 18,4 s e 20 s. Usar **Zonas 2.5D** para inspecionar ocupação.
3. Selecionar uma personagem: **Solo, ocupação e profundidade 2.5D → Medir contacto dos pés**. Alterar áreas e rever conflitos antes de reaplicar movimentos.
4. Para um personagem existente, fazer uma cópia e abrir a calibração. Rever a proposta de reposicionamento antes de aplicar e guardar a preparação. Os microajustes também podem ser editados por peça no editor de articulações.
5. Guardar e reabrir na conta. Como alternativa portátil, usar **Exportação → Transferir JSON → Abrir projeto JSON**. O JSON referencia os recursos existentes; não contém os PNGs.
6. Exportar MP4 a 720p/30 FPS e descarregar apenas após aparecer **MP4 produzido e validado**.
