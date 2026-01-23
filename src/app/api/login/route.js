import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  const { username, senha } = await req.json();

  const filePath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const user = users.find(
    (u) => u.username === username && u.senha === senha
  );

  if (!user) {
    return NextResponse.json(
      { error: "Usuário ou senha inválidos" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    nome: user.nome,
    username: user.username,
    role: user.role
  });
}
