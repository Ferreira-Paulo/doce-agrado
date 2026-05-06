Faça um commit com todas as alterações pendentes no repositório.

Se o usuário passou uma mensagem como argumento ($ARGUMENTS), use ela como mensagem do commit.

Se não passou nenhuma mensagem, analise o `git diff` e os arquivos novos para gerar uma mensagem de commit concisa em português, no formato imperativo (ex: "adiciona", "corrige", "refatora"), que descreva o que foi alterado.

Passos a seguir:
1. Rode `git status --short` para ver as alterações
2. Se não houver alterações, informe o usuário e pare
3. Rode `git add -A` para adicionar todos os arquivos
4. Rode `git reset HEAD -- .env .env.local` para proteger arquivos sensíveis (ignore erros)
5. Se não tiver mensagem do argumento, rode `git diff --cached --name-only` e `git diff --cached --stat` para entender as mudanças e gere a mensagem
6. Rode `git commit -m "<mensagem>"`
7. Confirme o sucesso para o usuário
