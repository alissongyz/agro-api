# 🌱 Agro API

API para gerenciamento de produtores rurais, propriedades, safras e culturas plantadas.

---

## 📚 Tabela de Conteúdos

1. [Tecnologias](#-tecnologias)
2. [Pré-requisitos](#-pré-requisitos)
3. [Instalação e Execução](#-instalação-e-execução)
4. [Endpoints](#-endpoints)
5. [Fluxo de Cadastro e Modelo de Dados](#-fluxo-de-cadastro-e-modelo-de-dados)
6. [Diagrama de Relacionamento](#-diagrama-de-relacionamento)
7. [Testes](#-testes)
8. [Logs e Observabilidade](#-logs-e-observabilidade)
9. [Estrutura de Pastas](#-estrutura-de-pastas)
10. [Considerações e Boas Práticas](#-considerações-e-boas-práticas)

---

## 🚀 Tecnologias

```txt
- Node.js 20 (Slim)
- NestJS
- TypeORM
- PostgreSQL (via Docker)
- Swagger (documentação interativa da API)
```

---

## ⚙️ Pré-requisitos

```txt
- Docker
- Docker Compose
```

---

## ▶️ Instalação e Execução

```bash
# 1. Clone o repositório
git clone <url-do-repo>
cd <nome-do-repo>

# 2. Suba os containers
docker-compose up --build
```

```txt
# 3. Acesse a API:
http://localhost:3000

# 4. Acesse a documentação Swagger:
http://localhost:3000/api
```

---

## 📌 Endpoints

```txt
/v1/producers         → CRUD de produtores rurais
/v1/properties        → CRUD de propriedades rurais
/v1/harvests          → CRUD de safras
/v1/planted-cultures  → CRUD de culturas plantadas
```

---

## 🔄 Fluxo de Cadastro e Modelo de Dados

```txt
1. Producer (Produtor Rural)
   - Pessoa física (CPF) ou jurídica (CNPJ)
   - Campos: cpfCnpj, name
   - Um produtor pode ter várias propriedades

2. Property (Propriedade Rural)
   - Pertence a um único produtor
   - Campos: name, city, state, totalArea, farmingArea, vegetationArea, producerId
   - Regra: farmingArea + vegetationArea ≤ totalArea
   - Pode ter múltiplas safras

3. Harvest (Safra)
   - Representa o ano de plantio de uma propriedade
   - Campos: year, propertyId
   - Pode conter várias culturas

4. PlantedCulture (Cultura Plantada)
   - Exemplo: soja, milho, café
   - Campos: name, harvestId, propertyId
   - Relacionada à safra e, indiretamente, à propriedade e produtor
```

---

## 🔗 Diagrama de Relacionamento

```txt
Producer (1) ───── (N) Property (1) ───── (N) Harvest (1) ───── (N) PlantedCulture
```

```txt
- Um produtor pode ter várias propriedades
- Cada propriedade pode ter várias safras
- Cada safra pode ter várias culturas plantadas
```

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração (end-to-end)
npm run test:e2e
```

---

## 📊 Logs e Observabilidade

```txt
- Logs básicos disponíveis para monitoramento e diagnóstico.
```

---

## 📁 Estrutura de Pastas

```txt
src/
├── producers/         → Módulo de produtores rurais
├── properties/        → Módulo de propriedades rurais
├── harvests/          → Módulo de safras
├── planted_cultures/  → Módulo de culturas plantadas
├── common/            → Utilitários, interceptadores, pipes, DTOs etc.

Arquivos principais:
- docker-compose.yml  → Orquestração dos containers
- Dockerfile          → Imagem da API
- README.md           → Documentação do projeto
```

---

## ⚠️ Considerações e Boas Práticas

```txt
- synchronize: true está ativado apenas em ambiente de desenvolvimento
- Validações são feitas com DTOs e pipes
- API segue padrão REST
- Banco de dados PostgreSQL via container Docker
```

---
