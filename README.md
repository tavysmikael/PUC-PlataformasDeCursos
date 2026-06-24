# 🎓 Plataforma de Cursos Online

Sistema desenvolvido em React + TypeScript para gerenciamento de cursos online, permitindo cadastro de usuários, organização de conteúdos educacionais, acompanhamento de progresso acadêmico e gerenciamento de assinaturas.

## 📚 Sobre o Projeto

Este projeto foi desenvolvido como atividade da disciplina Tecnologia e Construçāo de Software da PUC, com o objetivo de aplicar conceitos de:

* React com TypeScript
* Componentização
* Roteamento SPA
* Consumo de APIs REST
* JSON Server
* Bootstrap 5
* Organização de projetos 

A plataforma simula um ambiente de ensino online contendo cursos, módulos, aulas, matrículas, progresso do aluno, certificados e gestão de assinaturas.

---

## 🚀 Tecnologias Utilizadas

### Frontend

* React
* TypeScript
* React Router DOM
* Bootstrap 5
* Axios

### Backend Simulado

* JSON Server

---

## 📂 Estrutura do Projeto

```text
src/
├── components/
├── models/
├── services/
├── pages/
├── routes/
├── assets/
├── hooks/
├── App.tsx
└── main.tsx
```

---

## ✨ Funcionalidades

### 📖 Módulo Acadêmico

* Cadastro de Categorias
* Cadastro de Cursos
* Cadastro de Trilhas de Conhecimento
* Relacionamento entre Categorias e Cursos
* Cadastro de Módulos
* Cadastro de Aulas
* Ordenação de módulos e aulas

### 👨‍🎓 Módulo de Usuários

* Cadastro de Usuários
* Matrícula em Cursos
* Controle de Progresso das Aulas
* Emissão de Certificados
* Código de Verificação do Certificado

### 💳 Módulo Financeiro

* Cadastro de Planos
* Assinaturas
* Simulação de Checkout
* Registro de Pagamentos
* Controle de Transações

---

## 🗄️ Modelo de Dados

A aplicação foi construída seguindo o modelo relacional proposto na atividade:

* Usuários
* Categorias
* Cursos
* Módulos
* Aulas
* Matrículas
* Progresso de Aulas
* Avaliações
* Trilhas
* Trilhas_Cursos
* Certificados
* Planos
* Assinaturas
* Pagamentos

---

## ⚙️ Instalação

### Clonar o Repositório

```bash
git clone https://github.com/tavysmikael/PUC-PlataformasDeCursos.git
```

```bash
cd PUC-PlataformasDeCursos
```

### Instalar Dependências

```bash
npm install
```

ou

```bash
pnpm install
```

---

## ▶️ Executando o Projeto

### Iniciar o Frontend

```bash
npm run dev
```

ou

```bash
pnpm dev
```

### Iniciar o JSON Server

```bash
npx json-server --watch db.json --port 3001
```

A API ficará disponível em:

```text
http://localhost:3001
```

---

## 🎯 Objetivos da Atividade

O projeto atende aos critérios de avaliação propostos:

* ✅ Interfaces desenvolvidas com Bootstrap
* ✅ Componentização em React
* ✅ Estrutura organizada em Pages, Components, Models e Services
* ✅ Roteamento utilizando React Router
* ✅ Consumo de API com JSON Server
* ✅ Versionamento e entrega através do GitHub

---

## 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais.
