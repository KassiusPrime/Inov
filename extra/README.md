# Inov — Sistema de Controle de E-mails, Extração de Documentos & Mala Direta Padronizada
**EcoRodovias SP (Ecovias dos Imigrantes, Ecopistas, Econoroeste, Raposo Castello)**

> Repositório Oficial: [https://github.com/KassiusPrime/Inov.git](https://github.com/KassiusPrime/Inov.git)

---

## 📌 Visão Geral
O **Inov** é uma plataforma corporativa desenvolvida para gerenciar e controlar fluxos de e-mails departamentais, cadastros de pontos focais e emissão de mensagens padronizadas em concessionárias de rodovias.

O sistema resolve o desafio de dispersão de contatos e falta de padronização nas comunicações internas e externas, permitindo:
- **Triagem de E-mails por Área:** Filtros rápidos entre 9 áreas departamentais (`GEN`, `GAU`, `CSU`, `RH`, `AJL`, `DTC`, `COM`, `DAM`, `DS`) e 4 concessionárias.
- **Leitura Universal de Arquivos ("Jogar Documentos"):** Dropzone integrado que aceita `.xlsx`, `.xls`, `.csv`, `.txt`, `.docx`, `.pdf`, `.eml` e extrai contatos, áreas e assuntos automaticamente.
- **Modelos Padronizados com Substituição Dinâmica:** Templates pré-formatados com substituição automática de partes-chave do texto (`{CONCESSAO}`, `{AREA}`, `{NOMES_DESTAQUE}`, `{GESTOR}`, `{PRAZO}`, `{REFERENCIA_DOCUMENTO}`, `{DATA_ATUAL}`, `{CORPO_TEXTO}`).
- **Integração Nativa com Microsoft 365 & Outlook:** Disparo com 1 clique para Outlook Desktop (`mailto:`), Outlook Web corporativo e exportação em `.eml`.
- **Zero Dependência Externa Obrigatória:** Funciona 100% no navegador (Client-Side) de forma determinística e offline, com suporte opcional a IA generativa (Gemini API) e Copilot M365.

---

## 🚀 Estrutura do Repositório

```text
Inov/
├── index.html                           # Aplicação Web SPA completa (Executa direto no navegador)
├── README.md                            # Apresentação e guia do repositório
├── .gitignore                           # Arquivos e diretórios ignorados pelo Git
├── data/
│   ├── tbContatos_EcoRodovias_Oficial.csv # Base de dados oficial com 95 contatos
│   └── templates_email_padrao.json      # Catálogo de modelos de e-mail e variáveis
├── scripts/
│   ├── extrair_documentos.py            # Script Python para extração de contatos em lote
│   └── gerar_mailing.py                 # Script Python para filtragem e geração de .eml
└── docs/
    └── MANUAL_SISTEMA_INOV.md           # Manual de operação e especificação técnica
```

---

## 💻 Como Utilizar

### Modo 1: Execução Direta no Navegador (Recomendado)
1. Dê um duplo clique no arquivo `index.html`.
2. A aplicação abrirá instantaneamente em qualquer navegador moderno (Edge, Chrome, Firefox).
3. Selecione as concessões e áreas desejadas na **Central de Mensagens** para gerar a lista de e-mails em BCC.
4. Escolha um modelo no **Redator de Mala Direta & Modelos Padronizados**, preencha a pauta e clique em **"Aplicar Estrutura Padronizada"**.
5. Use os botões para abrir diretamente no seu Outlook ou copiar a lista.

### Modo 2: Processamento via Linha de Comando (Python)
Para processar diretórios de arquivos locais e extrair contatos:
```bash
python3 scripts/extrair_documentos.py ./meus_documentos/ contatos_encontrados.csv
```

Para gerar mailing e arquivo `.eml` filtrado por área via terminal:
```bash
python3 scripts/gerar_mailing.py --concessao "Imigrantes" --area "GEN" --assunto "Vistoria Semestral" --eml "comunicado.eml"
```

---

## 🔄 Como Publicar no seu GitHub

Para enviar este repositório para o seu GitHub:

```bash
# 1. Acesse a pasta do projeto
cd Inov

# 2. Conecte ao seu repositório remoto
git remote add origin https://github.com/KassiusPrime/Inov.git

# 3. Defina a branch principal e envie os commits
git branch -M main
git push -u origin main
```

---

## 🛡️ Governança & Conformidade
- **Segurança da Informação:** Não armazena dados em servidores externos sem autorização.
- **Privacidade & LGPD:** Tratamento de dados corporativos restrito ao escopo das concessões.
- **Desacoplamento:** O Inov não possui qualquer vínculo com transações financeiras ou de compras do SAP.
