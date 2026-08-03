<img width="1920" height="1080" alt="Ignite Gym" src="https://github.com/user-attachments/assets/7788bb9f-3b70-4c6b-8e28-a13de5706f33" />

<p align="center">
  <img alt="GitHub top language"  src="https://img.shields.io/github/languages/top/geovaneborba/ignite-gym-mobile?color=4f46e5&style=for-the-badge"> <img alt="GitHub language count"  src="https://img.shields.io/github/languages/count/geovaneborba/ignite-gym-mobile?color=4f46e5&style=for-the-badge">
  <img alt="Licença" src="https://img.shields.io/github/license/geovaneborba/ignite-gym-mobile?color=4f46e5&style=for-the-badge">
</p>

<p align="center">
  <a href="#dart-sobre">Sobre</a> &#xa0; | &#xa0;
  <a href="#rocket-tecnologias">Tecnologias</a> &#xa0; | &#xa0;
  <a href="#warning-pré-requisitos"> Pré requisitos</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-começando">Começando</a> &#xa0; | &#xa0;
  <a href="#memo-licença">Licença</a> &#xa0; | &#xa0;
  <a href="https://github.com/geovaneborba" target="_blank">Autor</a>
</p>

<br>

## :dart: Sobre

Este é o aplicativo móvel do projeto **Ignite Gym**, desenvolvido durante o programa de especialização Ignite da [Rocketseat](https://www.rocketseat.com.br/). A aplicação permite que usuários de uma academia se cadastrem, façam login, visualizem exercícios e registrem seus treinos.

<p align="right">(<a href="#top">Voltar para o topo</a>)</p>

## :rocket: Tecnologias

As seguintes tecnologias foram usadas na construção do aplicativo:

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [NativeBase](https://nativebase.io/)
- [React Navigation](https://reactnavigation.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Yup](https://github.com/jquense/yup)
- [Axios](https://axios-http.com/)

<p align="right">(<a href="#top">Voltar para o topo</a>)</p>

## :warning: Pré-requisitos

Antes de começar, você precisa ter o [Git](https://git-scm.com) e o [Node.js](https://nodejs.org/en/) instalados em sua máquina. Também é recomendado ter o [Expo Go](https://expo.dev/client) instalado em seu dispositivo móvel ou um emulador configurado.

<p align="right">(<a href="#top">Voltar para o topo</a>)</p>

## :checkered_flag: Começando

```bash
# Clone este repositório (caso ainda não tenha clonado o projeto principal)
$ git clone https://github.com/geovaneborba/ignite-gym.git

# Clone a API do projeto (caso ainda não tenha clonado)
$ git clone https://github.com/geovaneborba/ignite-gym-api.git

# Entre na pasta da API
$ cd ignite-gym-api

# Instale as dependências
$ npm install

# Execute as migrations
$ npm run migrate

# Popule o banco de dados com dados iniciais
$ npm run seed

# Inicie o servidor de desenvolvimento da API
$ npm start dev

# Entre na pasta do aplicativo móvel
$ cd ignite-gym/mobile

# Instale as dependências
$ npm install

# Inicie o servidor de desenvolvimento do Expo
$ npm start
```

Após executar `npm start`, o Metro Bundler será iniciado. Você poderá então:

- Ler o QR Code com o aplicativo Expo Go em seu celular.
- Pressionar `a` para abrir em um emulador Android (se configurado).
- Pressionar `i` para abrir em um simulador iOS (se estiver em um macOS e configurado).

**Importante:** Este aplicativo móvel é totalmente integrado com a sua API correspondente. Para que todas as funcionalidades do app operem corretamente, a API precisa estar em execução na sua máquina local. Você pode encontrar o repositório da API e as instruções de configuração aqui: [ignite-gym-api](https://github.com/geovaneborba/ignite-gym-api).

<p align="right">(<a href="#top">Voltar para o topo</a>)</p>

## :memo: Licença

Este projeto está sob licença MIT.

<p align="right">(<a href="#top">Voltar para o topo</a>)</p>

<p align="center">Feito com ❤️ por <a href="https://github.com/geovaneborba" target="_blank">Geovane Borba</a></p>
