# Montagem assistida, direções e arco · atualização 13

## Preservação e reutilização

Atualização do mesmo EBOOK AI STUDIO, sobre a versão 12. Não foram criadas aplicações, migradas tabelas, alterada a autenticação, removidos projetos/ficheiros ou substituídas personagens guardadas. Reutiliza os editores de articulações, skinning SVG, IK, keyframes, biblioteca de modelos, recortes, propriedades de pivô, camadas, histórico, acessórios e armazenamento existentes.

Os recursos e demos anteriores continuam disponíveis. As preparações visuais predefinidas e a deteção experimental MediaPipe permanecem opções explícitas. Importar uma imagem desconhecida não cria uma personagem redesenhada.

## Implementado

### Montagem assistida

Selecionar uma imagem na cena → **Montar personagem**. O editor existente abre com orientação por etapas. Se não existir esqueleto, acrescenta o humanoide base sem recortar nem transformar a imagem.

- Quatro modelos geométricos: frente, perfil, robusto/P.E.K.K.A. e humanoide pequeno/Arqueira. Não são deteções da anatomia. As juntas são ajustadas com o rato e campos de coordenadas. Aplicar um modelo preserva partes, identificadores existentes, curvas e limites; muda as posições de referência de forma explícita.
- Guardar só esqueleto e guardar personagem preparado continuam a usar a biblioteca da conta.
- Selecionar osso, usar Polígono ou Retângulo, rever a prévia e **Ligar ao osso**. Pontos do polígono podem ser arrastados. O retângulo fica pendente para confirmação no fluxo assistido.
- Os recortes referenciam os píxeis da imagem original através de clipping SVG: não são redimensionados/recomprimidos repetidamente nem sobrescrevem o ficheiro original.
- Pequena margem de sobreposição, 0–20 píxeis originais, usa apenas píxeis vizinhos existentes. Não reconstrói partes escondidas.
- **Corrigir contorno desta peça** reabre o polígono e permite ajustar a margem. Conserva o identificador, curvas dos ossos e transformação dos píxeis que permanecem na seleção. Pivôs e ordem das partes continuam editáveis nos controlos existentes.
- Pode manter o restante corpo como referência recortada, com a região extraída excluída para não ficar um braço estático duplicado. Essa referência não é uma reconstrução do tronco. Um painel discreto explica que apenas as partes ligadas se movem e lista a preparação restante.
- Trocar a imagem de uma peça preserva os ossos e a exclusão no corpo original. Os contornos antigos não são aplicados cegamente à nova imagem. Importação de PNGs independentes e substituição existentes mantidas.
- Correções raster feitas no corpo de referência não apagam os píxeis originais da peça assistida já ligada. As peças ligadas continuam a herdar a remoção de fundo quando configurada.

**Limite material:** se o braço ocultava parte do peito, essa parte não existe na imagem original. É necessário importar um tronco completo ou usar correção manual/clone/pintura. Não foi acrescentada geração de regiões escondidas por IA.

### Direções e profundidade

O seletor **Direção do movimento** da locomoção apresenta Direita, Esquerda, Frente/Aproximar-se e Trás/Afastar-se. Frente/trás escolhem os presets de profundidade já existentes, tornando-os acessíveis no mesmo fluxo.

- Personagem preparado: usa o ciclo articulado existente, escala progressiva e Y.
- Imagem inteira ou só esqueleto sem peças ligadas: simulação explicitamente identificada, com oscilação leve, escala e Y. Não articula os membros da imagem e não exige preparação visual.
- X mantém-se constante; o zoom da câmara não é usado para fingir deslocamento do personagem.
- Fator de escala, Y, ciclos, amplitude, duração, velocidade e suavidade editáveis. Pontos reais nos canais; conflitos com pontos manuais são recusados. Intervalos encadeados preservam a posição/escala anterior.
- Afastar-se conserva a orientação da ilustração; não inventa uma vista de costas.

### Preparar arco e flecha

Novo assistente, acessível nas propriedades do personagem e no editor de articulações:

1. Escolher personagem com esqueleto.
2. Escolher arco e flecha da biblioteca ou importar PNGs pelo sistema existente.
3. Escolher mão do arco e mão da corda. Ajustar pega, pivô, rotação e escala. É possível conservar a transformação visual atual ao reassociar um arco existente.
4. Arrastar pontas da corda, centro de puxada e pega no desenho do arco. A prévia usa coordenadas originais. A configuração manual das pontas continua disponível.
5. Opcionalmente apagar a corda desenhada numa faixa entre as pontas. É um apagamento transparente reversível: pode remover também píxeis do arco se a faixa for larga. Cordas curvas/áreas ocultas precisam de correção manual.
6. Aplicar ligação/corda; ou gravar o ponto de puxada como pose IK na agulha. A prévia da tensão, por si só, não grava alterações.
7. **Testar disparo** constrói um documento temporário com keyframes reais: levantar, colocar flecha, puxar, apontar, largar e repousar. Pode pausar e percorrer o tempo do teste.
8. **Aplicar sequência de disparo** insere os pontos no projeto, incluindo pega, eventos da corda, associação/largada e voo independente. Os intervalos ocupados são recusados; os pontos manuais não são eliminados.

O assistente reutiliza o motor de disparo, com seleção explícita do arco e da flecha, incluindo recursos importados. A direção do IK foi adaptada para personagens espelhados/rodados; não foi refeito o sistema de ossos. A flecha de entrada deve estar preparada horizontalmente para a direita. Outras orientações requerem preparação manual da imagem.

Espadas, escudos, largada/reassociação por keyframe, objetos, barra fixa e respetivas opções antigas continuam disponíveis.

### Demonstrações novas

- **Projetos → Teste · montagem assistida**: Lia original inteira, com esqueleto sem recortes, para praticar ligação visual.
- **Projetos → Ponte · fluxo assistido 9:16**: P.E.K.K.A. original inteira, fundo da ponte, Arqueira articulada de referência substituível, arco/flecha configurados pelo mesmo assistente e movimento de câmara.
- P.E.K.K.A.: X 43% constante; Y 40 → 52%; escala 0,25 → 0,60 em 0–6 s.
- Arqueira: recua assustada, aponta/dispara para a esquerda, em direção à região da P.E.K.K.A. A largada ocorre aos 7,08 s; o corte sugerido para gameplay é aos 9 s. O resto da composição fica editável até 12 s.
- A Arqueira desta demonstração reutiliza as peças de referência da versão anterior. Não substitui os desenhos do utilizador nem os apresenta como reconstrução perfeita. A imagem inteira da P.E.K.K.A. conserva a espada desenhada nela.

## Testes técnicos realizados

- Verificação de tipos TypeScript e compilação de produção.
- `test-assisted-studio.mjs`: quatro modelos e preservação de preparação/curvas; ligação de polígono aos píxeis originais e movimento da matriz visual; correção do contorno sem deslocar os píxeis restantes; sobreposição; aproximação/afastamento de imagem sem rig com X fixo; configuração de arco/flecha; apagamento reversível de corda; reassociação com transformação global preservada; puxada IK manual; largada e voo; conflitos recusados; demos válidas; personagem espelhado dispara para a esquerda; gravação/reabertura de projetos e modelos pelas rotas autenticadas reais com D1/R2 simulados.
- Regressões de Lia/skinning, 83 combinações de catálogo, biblioteca Clash, barra fixa/IK, conexões de armas e largada, keyframes/canais/histórico, modelos de esqueleto e modo estrutural.
- Não houve necessidade de modelos novos, dependências comerciais ou chaves de API.

## Verificações reais no navegador local

- Montagem assistida da Lia: selecionar ombro, marcar quatro pontos no braço, dar nome e ligar ao osso; rodar para 70° e observar os píxeis do recorte moverem-se.
- Reabrir e corrigir o contorno/sobreposição desse recorte, confirmando que o ponto-chave do ombro permaneceu.
- Assistente da Arqueira: teste temporário e aplicação de sequência de disparo em espaço livre; confirmação de geração de pontos; centro da corda arrastado com o rato e puxada manual gravada.
- Segundo teste temporário pausado em 1,20 s e 1,48 s: braços e arco visíveis, corda puxada e depois em repouso, flecha em voo; tronco completo nas poses observadas.
- Direções Frente e Trás visíveis na locomoção de imagem inteira. Na ponte, leitura visual da transformação: X 43% em ambos os instantes, Y 40 → 52%, escala 0,25 → 0,60. Aplicar outra aproximação em 6–9 s conservou X e terminou em escala 0,72/Y55%.
- Cena vertical com P.E.K.K.A. original, Arqueira de referência e arco direcionado à esquerda; câmara e pontos editáveis.
- Guardar respondeu **Sessão necessária**. Não foi contornada a autenticação nem retomada a validação Google.

## Limitações e pendências

- A importação autenticada de novos ficheiros e a gravação/reabertura numa sessão real continuam por confirmar no navegador; as rotas e a persistência passaram nos testes técnicos com armazenamento simulado. Não se declara validado esse percurso interativo.
- O teste de montagem no navegador utilizou a imagem original da Lia já disponível na biblioteca; não se declara uma nova importação de ficheiro como validada no navegador.
- Só os recortes ligados se articulam; o restante corpo de referência não acompanha membros ainda por preparar. Regiões escondidas exigem peças adicionais ou retoque manual.
- Modelos são bases geométricas ajustáveis. Não identificam automaticamente anatomia, não criam perfil/costas e não garantem uma marcha fotorealista.
- Pontas, pega e orientação das imagens de arco/flecha podem precisar de ajustes. Apagamento de corda não reconstrói o que estava por trás dela. Nem todos os esqueletos/ângulos foram revistos visualmente.
- O desempenho não foi medido num i7/16 GB sem GPU dedicada. Mantêm-se os limites existentes de imagens/curvas e a prévia SVG/canvas leve.
- Física, colisões e exportação MP4 continuam pendentes. Não foi adicionada geração de partes escondidas por IA.
