
| Tabela               | Descrição                                             |
| -------------------- | ----------------------------------------------------- |
| `usuario`            | Usuários do sistema (admin/gerenciamento)             |
| `jogo`               | Jogos disponíveis, com configuração flexível em JSONB |
| `partida`            | Partida de um jogo em um nível                        |
| `partida_resultado`  | Resultado/estatísticas por jogador em uma partida     |
| `jogador`            | Jogadores cadastrados                                 |
| `jogador_presença`   | Registro de presença dos jogadores                    |
| `jogador_nivel_jogo` | Nível de cada jogador em cada jogo                    |
| `nivel_jogo`         | Níveis/modelos definidos por jogo                     |

## Tabelas

### usuario

| coluna         | tipo      | observação      |
| -------------- | --------- | --------------- |
| id             | int       | primary key     |
| nome           | varchar   |                 |
| nome_usuario   | varchar   | unique          |
| senha_hash     | varchar   |                 |
| tipo           | varchar   |                 |
| criado_por     | int       | fk → usuario.id |
| criado_em      | timestamptz |                 |
| atualizado_por | int       | fk → usuario.id |
| atualizado_em  | timestamptz |                 |
| ativo          | boolean   |                 |
tipo VARCHAR(20) NOT NULL DEFAULT 'admin'
  CHECK (tipo IN ('superadmin', 'admin'))
  
### jogo

| coluna         | tipo      | observação                               |
| -------------- | --------- | ---------------------------------------- |
| id             | int       | primary key                              |
| nome           | varchar   |                                          |
| config_campos  | JSONB     | configuração flexível de campos por jogo |
| descricao      | text      |                                          |
| criado_por     | int       | fk → usuario.id                          |
| criado_em      | timestamptz |                                          |
| atualizado_por | int       | fk → usuario.id                          |
| atualizado_em  | timestamptz |                                          |
| ativo          | boolean   |                                          |

### partida

| coluna         | tipo      | observação         |
| -------------- | --------- | ------------------ |
| id             | int       | primary key        |
| id_jogo        | int       | fk → jogo.id       |
| id_nivel_jogo  | int       | fk → nivel_jogo.id |
| jogada_em      | timestamptz |                    |
| criado_por     | int       | fk → usuario.id    |
| criado_em      | timestamptz |                    |
| atualizado_por | int       | fk → usuario.id    |
| atualizado_em  | timestamptz |                    |
| ativo          | boolean   |                    |

### partida_resultado

| coluna        | tipo    | observação                      |       |
| ------------- | ------- | ------------------------------- | ----- |
| id            | int     | primary key                     |       |
| id_jogador    | int     | fk → jogador.id                 |       |
| id_partida    | int     | fk → partida.id                 |       |
| estatisticas  | JSONB   | estatísticas flexíveis por jogo |       |
| posicao_final | int     |                                 |       |
| vencedor      | boolean |                                 | false |
UNIQUE (id_partida, id_jogador)

### jogador

| coluna         | tipo      | observação      |
| -------------- | --------- | --------------- |
| id             | int       | primary key     |
| nome           | varchar   |                 |
| instagram      | varchar   |                 |
| telefone       | varchar   |                 |
| criado_por     | int       | fk → usuario.id |
| criado_em      | timestamptz |                 |
| atualizado_por | int       | fk → usuario.id |
| atualizado_em  | timestamptz |                 |
| ativo          | boolean   |                 |

### jogador_presenca

| coluna         | tipo        | observação      |
| -------------- | ----------- | --------------- |
| id             | int         | primary key     |
| id_jogador     | int         | fk → jogador.id |
| data_presenca  | date        |                 |
| criado_por     | int         | fk → usuario.id |
| criado_em      | timestamptz |                 |
| atualizado_por | int         | fk → usuario.id |
| atualizado_em  | timestamptz |                 |
| ativo          | boolean     |                 |
UNIQUE (id_jogador, data_presenca)

### jogador_nivel_jogo

| coluna        | tipo | observação         |
| ------------- | ---- | ------------------ |
| id            | int  | primary key        |
| id_jogador    | int  | fk → jogador.id    |
| id_nivel_jogo | int  | fk → nivel_jogo.id |
UNIQUE (id_jogador, id_nivel_jogo)

### nivel_jogo

| coluna         | tipo      | observação      |      |
| -------------- | --------- | --------------- | ---- |
| id             | int       | primary key     |      |
| id_jogo        | int       | fk → jogo.id    |      |
| nivel          | int       |                 |      |
| modelo         | varchar   |                 |      |
| criado_por     | int       | fk → usuario.id | null |
| criado_em      | timestamptz |                 |      |
| atualizado_por | int       | fk → usuario.id | null |
| atualizado_em  | timestamptz |                 |      |
| ativo          | boolean   |                 |      |
UNIQUE (id_jogo, nivel)

## Relacionamentos

| Origem             | Destino            | Cardinalidade | Rótulo     |
| ------------------ | ------------------ | ------------- | ---------- |
| usuario            | partida            | 1 : N         | registra   |
| partida            | jogo               | N : 1         | é de       |
| usuario            | jogador            | 1 : N         | adiciona   |
| jogador            | jogador_presenca   | 1 : N         | possui     |
| jogador            | jogador_nivel_jogo | 1 : N         | possui     |
| partida_resultado  | partida            | N : 1         | detalha    |
| jogador            | partida_resultado  | 1 : N         | possui     |
| nivel_jogo         | partida            | 1 : N         | possui     |
| jogador_nivel_jogo | nivel_jogo         | N : 1         | referencia |

