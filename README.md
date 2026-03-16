# Mysite

## Configuração do GitHub Contributions Graph

1. Crie um token de acesso pessoal no GitHub:
   - Acesse **Settings > Developer settings > Personal access tokens**.
   - Gere um token **Fine-grained** (recomendado) ou **Classic**.
   - Escopo mínimo: leitura de dados do usuário (`read:user`).
   - Para contribuições privadas aparecerem no calendário, habilite no próprio GitHub a opção de mostrar contribuições privadas no perfil.

2. Copie o arquivo de exemplo e configure o token:

```bash
cp .env.example .env
```

3. Edite o `.env` e preencha:

```env
GITHUB_TOKEN=seu_token_aqui
```

> Use apenas `GITHUB_TOKEN` (sem prefixo `PUBLIC_`), pois esse valor é lido apenas no endpoint server-side.
