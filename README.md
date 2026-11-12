# EBOOK AI STUDIO

Aplicação privada, em português de Portugal. Fase 1.

## Disponível
- Dashboard com exemplos comerciais explicitamente identificados e opção de os ocultar.
- Projetos: criar, editar, pesquisar, filtrar por estado, definir nicho, público-alvo, objetivos, prazo e progresso.
- Ideias e tarefas: criar, editar, associar a um projeto e concluir tarefas; calendário mensal com tarefas por dia.
- Ebooks: metadados, associação a projeto, rascunho inicial e progresso.
- Perfil da marca; modo claro/escuro; navegação adaptável; exportação de dados JSON.
- Persistência D1 no servidor, identidade ChatGPT fornecida pela plataforma, isolamento por utilizador, validação e controlo de conflitos de edição.

## Teste manual
1. Abrir o endereço privado autenticado e ocultar os exemplos.
2. Criar um projeto, definir prazo, objetivo e progresso.
3. Em Planeamento, criar uma tarefa associada e uma ideia. Selecionar no calendário o dia da tarefa; concluir a tarefa.
4. Em Os meus ebooks, criar um ebook associado ao projeto e guardar um rascunho.
5. Recarregar a página e confirmar que os registos continuam disponíveis. Editar e guardar novamente.
6. Em Configurações, editar o nome da marca e exportar os dados JSON.
7. Alternar o tema e testar num ecrã estreito.
8. Para eliminar um projeto com registos associados, remover primeiro as associações nos formulários.

## Verificações
- `npx tsc --noEmit`
- `node scripts/test-studio.mjs`: testes da API com base de dados e identidade simuladas, incluindo autorização, validação, conflitos e referências entre registos.
- `node /home/agent/.codex/plugins/cache/openai-curated-remote/sites/1.1.3/scripts/build-site.mjs`

A pré-visualização gerida estava indisponível durante a criação; a interface e a persistência de ponta a ponta no navegador não foram verificadas.

## Estrutura
`app/page.tsx`: interface e fluxos. `app/globals.css`: apresentação responsiva. `app/api/studio/route.ts`: API autenticada. `db/schema.ts`: registos tipados por entidade (`project`, `ebook`, `chapter`, `task`, `idea`, `image`, `post`, `product`, `profile`), associados ao proprietário. `drizzle/`: migrações. `app/chatgpt-auth.ts`: integração de identidade da plataforma.

## Próximas fases
2. Editor de capítulos, ordenação, pré-visualização e PDF profissional.
3. Texto e imagens por IA com chaves apenas no servidor, limites de utilização e revisão factual explícita.
4. Marketing, calendário editorial de publicações, editor de guião e storyboard.
5. Catálogo e checkout Stripe; webhook autenticado e idempotente; armazenamento de PDFs e entrega apenas após confirmação real. Não recolher cartões na aplicação.
6. OAuth Meta, permissões de páginas, publicação autorizada e preparação de produção.

A autenticação privada da plataforma já protege esta fase. Não existem integrações de IA, Meta, vídeo ou pagamentos configuradas. Os respetivos módulos mostram o estado planeado. Nenhuma venda, publicação ou entrega é simulada como real. Não introduzir segredos nos campos de texto; configurar futuras chaves através das variáveis de ambiente do servidor.

## Estúdio de Vídeos (incremento)

O separador Estúdio de Vídeos contém agora um editor narrativo 2D funcional, com biblioteca por conta, camadas, linha do tempo, transformações, pontos-chave, poses, áudio e gameplay. As tabelas e os dados da fase inicial são preservados. Existe um teste de 30 segundos em **Projetos → Teste de 30 s**.

Consulte `docs/estudio-videos.md` para instruções de teste, limites, contrato de guião JSON e investigação de Remotion/FFmpeg. MP4 permanece indisponível; a exportação JSON funciona. Os testes novos estão em `scripts/test-video.mjs`.

## Articulações 2D (incremento)

O Estúdio de Vídeos inclui preparação manual de personagens, partes recortadas, esqueleto hierárquico, limites, IK de dois segmentos e curvas por articulação. O teste **Projetos → Teste articulado · 3 poses** usa uma personagem PNG preparada manualmente a partir de imagem única. A deteção MediaPipe é experimental e depende do carregamento do modelo; malhas deformáveis, separação automática, reconstrução e MP4 continuam pendentes.

Consulte `docs/articulacoes-2d.md` para preparação e teste, estados de verificação e pesquisa. Execute `node scripts/test-rig.mjs` para os testes técnicos.
