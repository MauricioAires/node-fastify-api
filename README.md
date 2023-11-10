# ![Cover](.github/assets/cover-nodejs.png)

## Sobre o projeto

...

## Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [Fastify](https://fastify.dev/)
- [Fastify Cookie](https://www.npmjs.com/package/@fastify/cookie)
- [Knex.js](https://knexjs.org/)
- [Vitest](https://vitest.dev/)
- [Supertest](https://github.com/ladjs/supertest#readme)

*Opções de serviço de deploy*

- [Render](https://render.com/)
- [Fly](https://fly.io/)
- [Railway](https://railway.app/)



## Instalação

```sh
yarn
```

## Comandos

```bash
# Iniciar arquivo de configurações do typescript
$ npx tsc --init

# Comando para identificar erros de lint
$ yarn eslint src --ext .ts

# Comando para identificar erros de lint e corrigir
$ yarn eslint src --ext .ts --fix

# Executar a migration
$ yarn knex migrate:latest

# Desfazer a  ultima migration
$ yarn knex migrate:rollback


```
## Requisitos


<details>
<summary>Clique aqui para visualizar</summary>

```mdx
 RF:  Requisitos Funcionais
 RNF: Requisitos Não Funcionais
 RN:  Regra de negócio (não deve possuir termos muito técnicos)
```

### Transação

- [x] **RF**
  - [x] O usuário deve ser possível cadastrar uma nova transação;
  - [x] O usuário deve poder obter um resumo da sua conta;
  - [x] O usuário deve poder listar todas transações que já ocorreram;
  - [x] O usuário deve poder visualizar uma transação única;
- [x] **RN**
  - [x] A transação pode ser do tipo crédito  que somará ao valor total, ou débito que subtrairá;
  - [x] Deve  ser possível identificar o usuário entre as requisições;
  - [x] O usuário só pode visualizar transações o qual ele criou;

</details>

## Contribuição

Contribuições são bem-vindas! Para contribuir, basta abrir uma issue ou pull request neste repositório.

## Autor

Feito por Mauricio Aires 👋🏽
