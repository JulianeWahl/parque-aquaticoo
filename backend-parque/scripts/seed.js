const BASE_URL = "http://localhost:3333";
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Criando categorias...");

  const bebidas = await prisma.categoriaProduto.upsert({
    where: { nome: "Bebidas" },
    update: {},
    create: {
      nome: "Bebidas",
    },
  });

  const lanches = await prisma.categoriaProduto.upsert({
    where: { nome: "Lanches" },
    update: {},
    create: {
      nome: "Lanches",
    },
  });

  const porcoes = await prisma.categoriaProduto.upsert({
    where: { nome: "Porções" },
    update: {},
    create: {
      nome: "Porções",
    },
  });

  const combos = await prisma.categoriaProduto.upsert({
    where: { nome: "Combos" },
    update: {},
    create: {
      nome: "Combos",
    },
  });

  const sobremesas = await prisma.categoriaProduto.upsert({
    where: { nome: "Sobremesas" },
    update: {},
    create: {
      nome: "Sobremesas",
    },
  });

  console.log("🏷️ Criando marcas...");

  const coca = await prisma.marcaProduto.upsert({
    where: { nome: "Coca-Cola" },
    update: {},
    create: {
      nome: "Coca-Cola",
    },
  });

  const brahma = await prisma.marcaProduto.upsert({
    where: { nome: "Brahma" },
    update: {},
    create: {
      nome: "Brahma",
    },
  });

  console.log("🍔 Criando produtos...");

  await prisma.produto.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Coca-Cola Lata",
      preco: 6,
      estoque: 50,
      estoqueMinimo: 10,
      precisaPreparo: false,
      ativo: true,
      categoriaId: bebidas.id,
      marcaId: coca.id,
    },
  });

  await prisma.produto.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "Água Mineral",
      preco: 4,
      estoque: 80,
      estoqueMinimo: 15,
      precisaPreparo: false,
      ativo: true,
      categoriaId: bebidas.id,
    },
  });

  await prisma.produto.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: "X-Burger",
      preco: 18,
      estoque: 25,
      estoqueMinimo: 5,
      precisaPreparo: true,
      ativo: true,
      categoriaId: lanches.id,
    },
  });

  await prisma.produto.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: "Batata Frita",
      preco: 22,
      estoque: 20,
      estoqueMinimo: 5,
      precisaPreparo: true,
      ativo: true,
      categoriaId: porcoes.id,
    },
  });

  await prisma.produto.upsert({
    where: { id: 5 },
    update: {},
    create: {
      nome: "Combo Kids",
      preco: 30,
      estoque: 15,
      estoqueMinimo: 3,
      precisaPreparo: true,
      ativo: true,
      categoriaId: combos.id,
    },
  });

  await prisma.produto.upsert({
    where: { id: 6 },
    update: {},
    create: {
      nome: "Sorvete",
      preco: 12,
      estoque: 20,
      estoqueMinimo: 5,
      precisaPreparo: false,
      ativo: true,
      categoriaId: sobremesas.id,
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:");
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });