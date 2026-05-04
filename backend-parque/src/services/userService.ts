import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
  roleId: number;
}

export class UserService {
  async create({ nome, email, senha, roleId }: CreateUserDTO) {
    const userExists = await prisma.usuario.findUnique({
      where: { email }
    });

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        roleId
      },
      select: {
        id: true,
        nome: true,
        email: true,
        roleId: true
      }
    });

    return user;
  }
}