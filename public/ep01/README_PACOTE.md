# Pacote de assets — EBOOK AI STUDIO, Episódio 1

Este ZIP reúne **60 imagens PNG independentes** e um prompt detalhado para integrar esses recursos **na aplicação EBOOK AI STUDIO já existente**, sem eliminar projetos antigos.

## Como usar

1. Guarda o ZIP no computador.
2. Abre o **Build** no projeto atual do **EBOOK AI STUDIO**.
3. Anexa o ZIP ao pedido, se a interface aceitar anexos ZIP. Caso contrário, extrai o ZIP e anexa/importa os PNGs a partir das pastas.
4. Copia o conteúdo de `PROMPT_BUILD_EBOOK_AI_STUDIO_EP01.md` e envia-o ao Build, juntamente com o pacote.
5. Deixa o Build executar as fases e avaliar a montagem; no fim, verifica o projeto de demonstração e os testes indicados. Não apagues ou recries a base de dados.

## Organização

- `assets/Arqueira_A3/`: 25 PNGs, incluindo imagem-mestra aprovada, membros, expressões e acessórios.
- `assets/PEKKA/`: 16 PNGs, incluindo imagem-mestra, armadura segmentada, mãos, membros e espada.
- `assets/Mentora/`: 1 imagem-base da mãe da Arqueira; **não está ainda recortada em partes**.
- `assets/Cenarios/`: 16 PNGs de floresta, treino, arena, árvores e objetos móveis.
- `assets/Efeitos/`: 2 PNGs de efeitos de treino/combate; a nuvem de poeira também está em `assets/Cenarios/`.
- `MANIFESTO_ASSETS_EP01.json`: inventário com dimensões e hashes SHA-256, papel de cada PNG e indicação de espelhamento.
- `PROMPT_BUILD_EBOOK_AI_STUDIO_EP01.md`: instruções técnicas completas, testes e critérios de aceitação.
- `notas/`: histórico de criação e condições de validação do material.

## Avisos de qualidade

- Todas as personagens/articulações estão em **estado de protótipo não validado**. Não foi feito um teste de encaixe real no EBOOK AI STUDIO.
- Os PNGs de nomes com `espelhar` são cópias **não invertidas**: o Build deve aplicar `flipX` ao montar o lado oposto no editor.
- Fundos com `_9x16_` no nome são verticais, mas não necessariamente têm dimensões exatas de 9:16. O projeto deve usar 1080×1920 e reenquadrar os fundos **sem esticar a imagem**.
- A mãe/mentora tem apenas um desenho-base e pode ser animada como imagem inteira até receber peças próprias.
- O Build não deve fingir sucesso na exportação MP4; ela necessita de codificação, validação e teste real.
- O modelo-base de cada personagem serve para comparação e não deve permanecer sobreposto ao rig animado.

## O que está fora do pacote

- Vídeos de gameplay, sons e música — devem ser importados pelo utilizador ou criados separadamente.
- Código-fonte do EBOOK AI STUDIO — o Build deve continuar no repositório/projeto que já existe.
- Rigs, IK e exportação MP4 já aprovados — esses sistemas precisam de implementação/validação no projeto existente.

