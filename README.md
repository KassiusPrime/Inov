# SISTEMA INOV — EcoRodovias SP

**GCC — Plano Tático & Orquestrador**

> Repositório oficial: https://github.com/KassiusPrime/Inov.git

Sistema de controle inteligente de e-mails por área, governança de terceiros e contratos, auditoria de dados e mala direta integrada para as concessões **EcoRodovias SP** (Imigrantes, Leste Paulista / Ecopistas, Econoroeste, Raposo Castello).

---

## Visão Geral

O **SISTEMA INOV** concentra em uma única interface as principais necessidades de governança operacional e de comunicação da área de Engenharia / GCC:

| Módulo | Função |
|--------|--------|
| **Central de Mensagens** | Filtragem avançada por concessão, área, função, status e vínculo. Geração de mala direta com templates padronizados + refinador de texto. Abertura direta no Outlook / Outlook Web. |
| **Importação em Lote** | Upload de planilhas (XLSX/CSV) com correção automática de encoding (Mojibake). Formulação de comunicado e integração na base oficial. |
| **Repositório tbContatos** | CRUD completo da base de contatos com campos de governança de terceiros (empresa, vigência de contrato, escopo de atividades). |
| **Dashboard & Auditoria** | Saúde dos dados, indicadores de terceirização, anomalias e drills para a base. |
| **Modelagem BI** | Guia prático de conexão Power BI Desktop + fórmulas DAX prontas. |
| **Controladoria Digital** | Regras de compliance, conciliação contratual e auditoria da força operacional. |
| **Pacote & Artefatos** | Dicionário de dados, especificações e downloads estruturados. |

---

## Stack Técnica (v1.1+)

- **Frontend**: React 19 + TypeScript + Vite 6
- **Estilo**: Tailwind CSS 4 + Lucide Icons
- **Persistência local**: localStorage (`inov_tb_contatos_v2`)
- **Autenticação / Drive** (opcional): Firebase Auth + Google OAuth
- **Planilhas**: SheetJS (xlsx)
- **IA**: Refinador de texto formal (pronto para plugar `@google/genai`)

---

## Como rodar

### Pré-requisitos
- Node.js ≥ 20

```bash
npm install
npm run dev
```

Acesse: **http://localhost:3000**

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Type-check + build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação TypeScript |

---

## Estrutura do Repositório

```text
Inov/
├── src/                          # Código-fonte React + TypeScript
│   ├── components/               # Módulos da aplicação
│   ├── data/                     # Contatos iniciais + templates
│   ├── services/                 # Auth Firebase + parser de arquivos
│   └── types/                    # Tipos de domínio
├── data/                         # Base oficial CSV + templates JSON
├── docs/                         # Manual do sistema
├── scripts/                      # Scripts Python auxiliares (legado)
├── legacy/                       # Versão estática HTML (v1)
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Dados oficiais

- `data/tbContatos_EcoRodovias_Oficial.csv` — base com ~95 contatos
- `src/data/initialContacts.ts` — mesma base tipada para o app React

**Concessões**: Imigrantes · Leste Paulista · Econoroeste · Raposo Castello  
**Áreas**: GEN · GAU · CSU · RH · AJL · DTC · COM · DAM · DS

---

## Histórico de versões

- **v1.1.0** (atual) — Migração completa para React + Vite + TypeScript. Persistência de aba, badge de contatos, README e metadados alinhados, estrutura modular.
- **v1.0** — Versão estática (HTML SPA + scripts Python). Arquivos preservados em `/legacy`.

---

## Observações

1. A base inicial contém contatos de exemplo. Em produção, substitua por fonte oficial.
2. As chaves do Firebase são de cliente (públicas por design).
3. O refinador de texto é um formalizador pronto para integração real com Gemini.
4. O parser de arquivos corrige Mojibake comum de arquivos gerados no Windows.

---

Desenvolvido para o contexto de governança contratual e operacional das concessões EcoRodovias SP.
