param(
    [Parameter(Position=0)]
    [string]$Mensagem
)

# Arquivos/pastas que nunca devem ser commitados
$excluir = @('.env', '.env.local', '.env*.local', '*.pem', '*.key')

# Mostra o status atual
Write-Host "`nAlteracoes detectadas:" -ForegroundColor Cyan
git status --short

# Verifica se há algo para commitar
$status = git status --porcelain
if (-not $status) {
    Write-Host "`nNenhuma alteracao para commitar." -ForegroundColor Yellow
    exit 0
}

# Solicita mensagem se não foi passada como argumento
if (-not $Mensagem) {
    Write-Host "`nMensagem do commit: " -ForegroundColor Cyan -NoNewline
    $Mensagem = Read-Host
}

if (-not $Mensagem) {
    Write-Host "Mensagem nao pode ser vazia." -ForegroundColor Red
    exit 1
}

# Adiciona todos os arquivos rastreados e novos (exceto os protegidos)
git add -A

# Remove da staging arquivos sensíveis, caso tenham sido adicionados
foreach ($padrao in $excluir) {
    git reset HEAD -- $padrao 2>$null
}

# Mostra o que vai ser commitado
Write-Host "`nArquivos no commit:" -ForegroundColor Cyan
git diff --cached --name-only

# Confirma
Write-Host "`nCommitar com a mensagem: '$Mensagem' ? (S/n): " -ForegroundColor Yellow -NoNewline
$confirma = Read-Host
if ($confirma -eq 'n' -or $confirma -eq 'N') {
    git reset HEAD -- .
    Write-Host "Commit cancelado." -ForegroundColor Red
    exit 0
}

# Faz o commit
git commit -m $Mensagem

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCommit realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`nErro ao realizar o commit." -ForegroundColor Red
    exit 1
}
