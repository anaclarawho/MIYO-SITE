# MIYO

Sistema web para banho e tosa com foco em:

- abas enxutas: Início, Agenda, Pets e Nuvem
- cadastro do pet com nome do tutor, contato e data de cadastro
- agenda por pet com seleção dos serviços realizados
- Clubinho MIYO com pet sinalizado por estrela
- histórico completo de atendimentos dentro da ficha do pet
- modo local para testar de imediato
- sincronização em nuvem com Supabase
- instalação como app no iPhone, Android e Windows via PWA
- identidade visual baseada nos arquivos do repositório de logos do MIYO

## Como este projeto está organizado

- `index.html`: estrutura principal do app
- `styles.css`: visual responsivo e instalável como PWA
- `app.mjs`: lógica da aplicação, agenda, fichas dos pets e integração com Supabase
- `config.js`: configurações iniciais do app
- `sw.js`: service worker para cache offline do shell do app
- `manifest.webmanifest`: metadados do PWA
- `supabase/schema.sql`: schema do banco para sincronização na nuvem
- `assets/brand/`: logos e pattern oficiais usados na interface

## Teste rápido

1. Sirva a pasta com qualquer servidor estático.
2. Abra o app no navegador.
3. O sistema começa em modo local com dados de demonstração.
4. Cadastre seus próprios pets e comece a organizar os atendimentos e o Clubinho MIYO.

## Ativando a nuvem com Supabase

1. Crie um projeto no Supabase.
2. Abra o editor SQL do projeto.
3. Execute o conteúdo de `supabase/schema.sql`.
4. Pegue a `Project URL` e a `anon public key`.
5. No painel "Nuvem" do app, cole a URL e a chave.
6. Crie sua conta com e-mail e senha dentro do próprio app.
7. A partir daí os dados passam a sincronizar entre os dispositivos onde você fizer login.

## Publicação

Este projeto é estático e pode ser publicado em plataformas de hospedagem para sites estáticos. Depois de publicado:

- no iPhone ou Android, abra o link e use "Adicionar à tela inicial"
- no Windows, use a opção "Instalar app" do navegador

## Observações do MVP

- o modo local salva os dados apenas no navegador atual
- a sincronização em nuvem depende de login no Supabase
- o Clubinho MIYO fica marcado direto na ficha do pet
- a ficha do pet mostra o progresso mensal do Clubinho MIYO
- os atendimentos ficam armazenados no histórico individual de cada pet
- o layout já está preparado para mobile e desktop
- o app tem exportação e importação de backup local em JSON
