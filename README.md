# 🎡 Roleta Premiada Hunter

Aplicação web de campanha comercial interna para controle de giros na roleta de prêmios, desenvolvida com React, TypeScript, Tailwind CSS e Framer Motion.

## 🚀 Como usar localmente

### Opção 1: Script automático (Windows)

Dê duplo clique no arquivo `iniciar.bat` na raiz do projeto.

O script irá:
1. Instalar as dependências automaticamente (somente na primeira execução)
2. Iniciar o servidor local em `http://localhost:5173`

### Opção 2: Terminal manual

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 🌐 Deploy (Vercel)

O projeto está totalmente configurado para deploy contínuo no Vercel. Basta conectar este repositório no Vercel e o deploy será realizado automaticamente.

## 📋 Funcionalidades

- Cadastro de consultores e controle de matrículas
- Roleta SVG animada com 20 segmentos
- Controle de verba total (R$ 800) com aviso de saldo crítico e banner quando esgotada
- Efeitos sonoros reais usando a Web Audio API nativa
- Animação festiva de confetes ao ganhar prêmios
- Exportação de resumo de stories (1080x1920px) em PNG para WhatsApp
- Persistência automática das campanhas no localStorage
- Importação e exportação da campanha em arquivos JSON

## 🎯 Tecnologias Utilizadas

- React 18 + TypeScript + Vite
- Tailwind CSS (Estética Cassino Glassmorphism)
- Framer Motion (Animações de entrada e rotação)
- canvas-confetti (Efeitos de confete)
- html-to-image (Geração do PNG Stories)
