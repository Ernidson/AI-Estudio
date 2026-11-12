# Estúdio de Vídeos — protótipo 2D

## Integração no projeto existente

Mesmo Site, autenticação e regras de acesso. As tabelas `studio_records` e a respetiva migração original não foram alteradas. A migração adicional cria `video_projects` e `video_assets`. Ficheiros novos são guardados no R2 (`BUCKET`) e associados ao proprietário. A interface mantém o menu, temas e linguagem do EBOOK AI STUDIO. O antigo separador de vídeo planeado passa a abrir o editor.

## Implementado

- Biblioteca reutilizável de imagens, personagens, poses, cenários, gameplay e áudio, por conta.
- Importação sequencial de ficheiros, leitura de metadados pelo navegador, validação de tamanho/formato/assinatura, gestão de nomes e grupos.
- Pré-visualização 16:9, seleção e arrasto na cena, redimensionamento pela pega ou campos, rotação, inversão horizontal, opacidade e largura.
- Faixas independentes de imagem, vídeo, texto e áudio. Mais faixas, alterações de ordem, visibilidade e som por faixa.
- Elementos movíveis entre faixas compatíveis, corte na agulha, corte do início, ajuste do fim, campos de início/duração/desfasamento no ficheiro, duplicação e eliminação.
- Reprodução/pausa, agulha arrastável, zoom da linha do tempo, reprodução sincronizada de vídeo e áudio.
- Transformações 2D com pontos-chave e interpolação linear. Aproximação pronta a aplicar. Poses por instante, referenciando imagens da biblioteca.
- Desfazer/refazer até 40 estados do documento. Atalhos Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z e Ctrl/Cmd+S. Espaço: reproduzir/pausar fora dos campos.
- Gravação explícita no servidor, revisão otimista para conflitos, reabertura, cópia de projeto e aviso de alterações por guardar.
- Associação opcional a um projeto existente do EBOOK AI STUDIO.
- Exportação da estrutura JSON (não inclui os ficheiros multimédia).
- Importação validada de guião JSON: cria uma faixa de textos e guarda notas de narração/cenas. Sem dependência ou ligação ao Ollama.
- Painéis laterais redimensionáveis em ecrãs largos; altura da linha do tempo ajustável; composição adaptada a ecrãs pequenos.

## Teste de 30 segundos

Abrir **Estúdio de Vídeos → Projetos → Teste de 30 s**. O exemplo não é automaticamente gravado, não substitui nenhum projeto e pede confirmação ao sair de alterações por guardar.

| Intervalo | Conteúdo |
| --- | --- |
| 0–30 s | Cenário ilustrado |
| 0–5 s | Título de abertura |
| 0,5–3,5 s | Efeito sonoro WAV |
| 1–18 s | Ana, com movimento de aproximação entre 1 e 8 s |
| 2–18 s | Rui, noutra camada |
| 9 s | Ana muda para a pose a acenar |
| 18–23 s | Gameplay sintético em MP4 H.264 |
| 23–30 s | Regresso ao cenário |

Todos os recursos são explicitamente marcados como demonstração. O gameplay foi criado para este teste e não é captura de um jogo comercial. O ficheiro MP4 de 5 s incluído na demonstração não representa uma funcionalidade de exportação do editor.

### Teste com ficheiros próprios

1. Criar um projeto vazio. A duração inicial é 30 segundos.
2. Selecionar categoria Cenários e importar uma imagem. Clicar nela para adicionar. Ajustar largura para 100%, X/Y para 50/50 e duração para 30 s.
3. Selecionar Personagens, definir um grupo e importar um PNG transparente. Repetir para outro personagem. Adicionar em faixas de imagem diferentes; criar outra faixa se necessário.
4. Selecionar o primeiro personagem, ajustar a duração, aplicar Movimento de aproximação. Reproduzir para verificar.
5. Importar uma segunda pose com o mesmo grupo. Colocar a agulha dentro do personagem e selecionar a nova imagem em Poses da personagem.
6. Importar um pequeno MP4/WebM de gameplay e adicionar numa faixa Vídeo. Ajustar início, duração e corte no ficheiro. Terminar os personagens antes do gameplay, ou subir a camada do gameplay.
7. Importar narração/efeito de som e adicionar à faixa Áudio. Ajustar volume e intervalo.
8. Guardar. Recarregar a aplicação, voltar a Estúdio de Vídeos → Projetos e abrir o projeto guardado. Confirmar que os ficheiros e os pontos-chave continuam disponíveis.
9. Alterar um ponto-chave, desfazer/refazer, guardar de novo. Na exportação, MP4 está assinalado como indisponível.

## Guião para futura integração Ollama

Não existe pedido ao Ollama, geração automática de imagem, voz ou vídeo. A importação manual usa este contrato:

```json
{
  "version": 1,
  "title": "A minha história",
  "scenes": [
    {
      "start": 0,
      "duration": 5,
      "text": "O próximo capítulo começa aqui.",
      "narration": "Texto de narração a gravar ou importar como áudio.",
      "visualDescription": "Cenário e personagens pretendidos."
    }
  ]
}
```

Os textos entram numa nova faixa. Narração e descrição ficam nas propriedades do projeto. Recursos externos/URLs, código e instruções não são executados. Será necessário um adaptador de servidor para pedir ao Ollama uma resposta estruturada e validar a saída antes de a aplicar.

## Desempenho e limites

- Pré-visualização por composição DOM e media nativa do navegador; relógio por requestAnimationFrame limitado aproximadamente a 30 atualizações/s.
- Só os elementos multimédia ativos são montados. Leitura de vídeo por intervalos HTTP (Range) no servidor; importação sequencial e metadados antes do envio.
- Até 5 minutos, 12 faixas, 120 elementos e 80 pontos-chave/poses por elemento. Histórico de 40 estados.
- Até 24 MiB por ficheiro; imagens até 4096 × 4096; gameplay até Full HD; biblioteca limitada a 500 MiB por conta.
- Formatos: PNG/JPEG/WebP/GIF, MP4/WebM, MP3/WAV/OGG/M4A/AAC conforme codecs do navegador. PNG/WebP com alfa para transparência. GIF animado pode reproduzir de forma não determinística; preferir imagens estáticas.
- Sem proxies de vídeo, transcodificação de uploads, renderização em segundo plano, detecção de silêncio, waveform real, efeitos complexos ou sincronização de precisão de fotograma. A waveform na faixa é apenas uma representação visual decorativa, não análise do áudio.
- O limite de RAM e a fluidez num computador específico de 16 GB sem GPU dedicada ainda não foram medidos. Preferir ficheiros 720p, poucos vídeos sobrepostos e imagens otimizadas.
- A gravação não é automática. O estado por guardar existe em memória; use Guardar antes de fechar. Desfazer/refazer pertence à sessão e não persiste após reabrir.
- As alterações no perfil dos recursos (nome/grupo), importações e eliminações de ficheiros não fazem parte do histórico do documento.

## Viabilidade de exportação MP4

Pesquisa consultada em 4 de novembro de 2026:

1. **Remotion no servidor + FFmpeg:** o renderer requer ambiente Node, navegador e binários nativos. O runtime atual é Cloudflare Workers com 128 MB por isolate; não inclui um processo de renderização Chrome/FFmpeg. Exige um serviço de jobs separado, por exemplo contentor ou serviço de renderização, armazenamento temporário e controlo de progresso/cancelamento.
   - https://www.remotion.dev/docs/ssr
   - https://www.remotion.dev/docs/options/binaries-directory
   - https://developers.cloudflare.com/workers/platform/limits/
2. **Remotion no navegador:** a documentação atual oferece `@remotion/web-renderer`, usando WebCodecs/Mediabunny, com limitações de elementos e de compatibilidade. É uma alternativa viável a prototipar para exportação progressiva e sem servidor de renderização, mas exige adaptar a composição, tratar codecs, áudio, acesso aos recursos autenticados, cancelar trabalhos e testar o MP4 resultante. Não foi instalado nem testado neste protótipo.
   - https://www.remotion.dev/docs/client-side-rendering/
3. **FFmpeg WebAssembly:** a própria documentação assinala desempenho inferior ao nativo e maior uso de memória/CPU em multithreading. Não foi incluído para manter esta primeira versão leve.
   - https://ffmpegwasm.netlify.app/docs/faq/

Existe FFmpeg no ambiente de desenvolvimento: foi usado exclusivamente para gerar/verificar o pequeno ficheiro de gameplay de demonstração. Esse binário não está disponível no runtime do Site e não constitui exportação de projetos.

Decisão: manter **MP4 indisponível**. Próxima etapa: escolher exportação no navegador com Remotion/WebCodecs ou serviço de jobs com Remotion/FFmpeg, provar a composição de 30 segundos com imagem, poses, texto, gameplay e áudio, verificar codecs/duração/sincronização e só então ativar a funcionalidade.

## Testes realizados

- TypeScript e compilação de produção.
- `node scripts/test-studio.mjs`: regressão da API existente.
- `node scripts/test-video.mjs`: 18 grupos de testes do modelo e da API com D1/R2/identidade simulados: documento de demonstração, interpolação, poses, cortes sem perder animação, validação, guião, HTTP Range, gravação/reabertura, revisões, isolamento por proprietário, upload, assinatura de ficheiro, leitura de média, referências e eliminação de recursos em uso.
- Migração executada numa base SQLite de teste com um eBook pré-existente: registo, proprietário, revisão e dados preservados.
- Gameplay de exemplo inspecionado com ffprobe: H.264, 640 × 360, 5 segundos.
- Pré-visualização gerida indisponível (`preview relay unavailable`). A aplicação privada no navegador de teste exige início de sessão. Os testes visuais, arrasto real, upload/guardado/reabertura em produção e benchmark num computador de 16 GB continuam por verificar. Os testes simulados não substituem essas verificações.
