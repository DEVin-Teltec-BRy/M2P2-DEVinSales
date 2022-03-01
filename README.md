# DEVinSales API

- [Tecnologias](#tech)
- [Como Utilizar](#settings)

<a id="tech"></a>

Este repositório foi criado para demonstrar como funciona o conceito de Role Based Access Control para os alunos do curso DEVinHouse.
## Tecnologias

O projeto desenvolvido utiliza as seguintes tecnologias:
- [NodeJS](https://nodejs.org/en/) 
- [Express](https://expressjs.com/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js/)
- [Sequelize](https://sequelize.org/)
- [Postgres](https://www.postgresql.org/)

<a id="settings"></a>

# Como Utilizar

### **Pré-requisitos**

  - Possuir o NodeJS e o Postgres instalado na sua máquina.

```bash
# Clone o Repositório
$ git clone https://github.com/DEVin-Teltec-BRy/M2P2-DEVinSales.git
```

```bash
# Entre na pasta projeto
$ cd M2P2-DEVinSales

```
```bash
# Já dentro da pasta do projeto.
# Instale as bibliotecas utlizadas no projeto.
$ yarn ou npm install
```
```bash
# Criar um arquivo .env a partir do arquivo .env.sample
$ DATABASE_URL=postgresql://user:password@host:port/database
$ SECRET=senha secreta
```
```bash
# Criar o Database utilizando o Sequelize
$ yarn sequelize db:create 
```
```bash
# Para popular as tabelas no postgres
$ yarn sequelize db:migrate
```
```bash
# Executar o programa.
$ yarn dev
```