# Nginx + Node.js + MySQL

Aplicação completa usando **Nginx + Node.js + MySQL** com Docker Compose.

## Arquitetura

```
Usuário → Nginx:8080 → Node.js:3000 → MySQL:3306
          (proxy)      (app)           (db)
```

## O que a aplicação faz?

1. A cada acesso, gera e insere uma pessoa aleatória no banco de dados:
   - **Nome completo** (primeiro nome + sobrenome)
   - **Data de nascimento** (entre 1950 e 2005)

2. Retorna um HTML com:
   - `<h1>Full Cycle Rocks!</h1>`
   - Lista de todas as pessoas cadastradas
   - Total de registros

## Persistência de Dados

Os dados do MySQL são salvos em `./mysql/data/` no host, garantindo que:
  - Dados persistem entre reinicializações
  - Não são perdidos ao remover containers
  - Podem ser backupeados facilmente

**Database:** `nginx_node_mysql`  
**Containers:** `nginx-node-mysql-db`, `nginx-node-mysql-app`, `nginx-node-mysql-nginx`

## Healthchecks

A aplicação possui healthchecks configurados:

- **MySQL**: Verifica com `mysqladmin ping`
- **Node.js**: Verifica endpoint `/health`
- **Nginx**: Inicia apenas quando Node.js está saudável

Isso garante que cada serviço só inicia quando suas dependências estão prontas.

## Detalhes Técnicos

### Banco de Dados
- **Tabela**: `people`
- **Campos**: 
  - `id` (AUTO_INCREMENT)
  - `name` (VARCHAR 255)
  - `birth_date` (DATE)
  - `created_at` (TIMESTAMP)

### Geração de Dados
- **15 primeiros nomes** diferentes
- **15 sobrenomes** diferentes
- **Combinação aleatória** = 225 possibilidades
- **Datas de nascimento**: 1950 a 2005 (aleatórias)

