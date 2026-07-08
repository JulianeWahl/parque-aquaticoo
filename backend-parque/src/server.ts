import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

async function bootstrapIngressos() {
  const count = await prisma.ingresso.count();

  if (count === 0) {
    await prisma.ingresso.createMany({
      data: [
        { categoria: "Adulto",              preco: 30, ativo: true },
        { categoria: "Criança (6 a 12 anos)", preco: 20, ativo: true },
        { categoria: "Menor de 5 anos",     preco: 0,  ativo: true },
      ],
    });
    console.log("✅  Ingressos padrão criados automaticamente.");
  }
}

app.listen(3333, async () => {
  console.log("Servidor online na porta 3333");
  await bootstrapIngressos();
});
