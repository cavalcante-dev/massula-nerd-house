-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "nome_usuario" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL DEFAULT 'admin' CONSTRAINT usuario_tipo_check CHECK (tipo IN ('superadmin', 'admin')),
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogo" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "config_campos" JSONB NOT NULL,
    "descricao" TEXT,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partida" (
    "id" SERIAL NOT NULL,
    "id_jogo" INTEGER NOT NULL,
    "id_nivel_jogo" INTEGER,
    "jogada_em" TIMESTAMPTZ NOT NULL,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "partida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partida_resultado" (
    "id" SERIAL NOT NULL,
    "id_jogador" INTEGER NOT NULL,
    "id_partida" INTEGER NOT NULL,
    "estatisticas" JSONB NOT NULL,
    "posicao_final" INTEGER,
    "vencedor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "partida_resultado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogador" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "instagram" VARCHAR(255),
    "telefone" VARCHAR(30),
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogador_presenca" (
    "id" SERIAL NOT NULL,
    "id_jogador" INTEGER NOT NULL,
    "data_presenca" DATE NOT NULL,
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jogador_presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jogador_nivel_jogo" (
    "id" SERIAL NOT NULL,
    "id_jogador" INTEGER NOT NULL,
    "id_nivel_jogo" INTEGER NOT NULL,

    CONSTRAINT "jogador_nivel_jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nivel_jogo" (
    "id" SERIAL NOT NULL,
    "id_jogo" INTEGER NOT NULL,
    "nivel" INTEGER NOT NULL,
    "modelo" VARCHAR(255),
    "criado_por" INTEGER,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_por" INTEGER,
    "atualizado_em" TIMESTAMPTZ NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "nivel_jogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nome_usuario_key" ON "usuario"("nome_usuario");

-- CreateIndex
CREATE INDEX "partida_id_jogo_idx" ON "partida"("id_jogo");

-- CreateIndex
CREATE INDEX "partida_id_nivel_jogo_idx" ON "partida"("id_nivel_jogo");

-- CreateIndex
CREATE INDEX "partida_resultado_id_partida_idx" ON "partida_resultado"("id_partida");

-- CreateIndex
CREATE INDEX "partida_resultado_id_jogador_idx" ON "partida_resultado"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "partida_resultado_id_partida_id_jogador_key" ON "partida_resultado"("id_partida", "id_jogador");

-- CreateIndex
CREATE INDEX "jogador_presenca_id_jogador_idx" ON "jogador_presenca"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "jogador_presenca_id_jogador_data_presenca_key" ON "jogador_presenca"("id_jogador", "data_presenca");

-- CreateIndex
CREATE INDEX "jogador_nivel_jogo_id_jogador_idx" ON "jogador_nivel_jogo"("id_jogador");

-- CreateIndex
CREATE INDEX "jogador_nivel_jogo_id_nivel_jogo_idx" ON "jogador_nivel_jogo"("id_nivel_jogo");

-- CreateIndex
CREATE UNIQUE INDEX "jogador_nivel_jogo_id_jogador_id_nivel_jogo_key" ON "jogador_nivel_jogo"("id_jogador", "id_nivel_jogo");

-- CreateIndex
CREATE INDEX "nivel_jogo_id_jogo_idx" ON "nivel_jogo"("id_jogo");

-- CreateIndex
CREATE UNIQUE INDEX "nivel_jogo_id_jogo_nivel_key" ON "nivel_jogo"("id_jogo", "nivel");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogo" ADD CONSTRAINT "jogo_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogo" ADD CONSTRAINT "jogo_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida" ADD CONSTRAINT "partida_id_jogo_fkey" FOREIGN KEY ("id_jogo") REFERENCES "jogo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida" ADD CONSTRAINT "partida_id_nivel_jogo_fkey" FOREIGN KEY ("id_nivel_jogo") REFERENCES "nivel_jogo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida" ADD CONSTRAINT "partida_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida" ADD CONSTRAINT "partida_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida_resultado" ADD CONSTRAINT "partida_resultado_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partida_resultado" ADD CONSTRAINT "partida_resultado_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador" ADD CONSTRAINT "jogador_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador" ADD CONSTRAINT "jogador_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador_presenca" ADD CONSTRAINT "jogador_presenca_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador_presenca" ADD CONSTRAINT "jogador_presenca_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador_presenca" ADD CONSTRAINT "jogador_presenca_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador_nivel_jogo" ADD CONSTRAINT "jogador_nivel_jogo_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "jogador_nivel_jogo" ADD CONSTRAINT "jogador_nivel_jogo_id_nivel_jogo_fkey" FOREIGN KEY ("id_nivel_jogo") REFERENCES "nivel_jogo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nivel_jogo" ADD CONSTRAINT "nivel_jogo_id_jogo_fkey" FOREIGN KEY ("id_jogo") REFERENCES "jogo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nivel_jogo" ADD CONSTRAINT "nivel_jogo_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "nivel_jogo" ADD CONSTRAINT "nivel_jogo_atualizado_por_fkey" FOREIGN KEY ("atualizado_por") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
