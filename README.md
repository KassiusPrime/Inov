# SISTEMA INOV — EcoRodovias SP

**GCC — Plano Tático & Orquestrador**

> Repositório oficial: https://github.com/KassiusPrime/Inov.git

Sistema de controle inteligente de e-mails por área, governança de terceiros e contratos, auditoria de dados e mala direta integrada para as concessões **EcoRodovias SP**.

## Visão geral

O repositório agora está organizado em estrutura React + Vite com módulos separados por responsabilidade.

## Estrutura principal

```text
Inov/
├── .gitignore
├── README.md
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── metadata.json
├── firebase-applet-config.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   ├── data/
│   ├── services/
│   └── types/
├── data/
│   ├── tbContatos_EcoRodovias_Oficial.csv
│   └── templates_email_padrao.json
├── docs/
│   └── MANUAL_SISTEMA_INOV.md
├── scripts/
│   ├── extrair_documentos.py
│   └── gerar_mailing.py
├── legacy/
│   ├── index-static-v1.html
│   └── gcc_system.html
└── src/
```

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Firebase Auth (opcional)
- SheetJS
