-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "marcaId" INTEGER;

-- CreateTable
CREATE TABLE "MarcaProduto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "MarcaProduto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarcaProduto_nome_key" ON "MarcaProduto"("nome");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "MarcaProduto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
