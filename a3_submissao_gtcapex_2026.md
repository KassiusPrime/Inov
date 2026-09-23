# FORMULÁRIO A3 SIMPLIFICADO | SUBMISSÃO DE PROJETOS 2026 - GT CAPEX
**EcoRodovias Concessões e Serviços (ECS) - Governança & Transformação Digital**

---

### 1. DADOS DE IDENTIFICAÇÃO DO PROJETO
* **Título do Projeto:** Automação da Criação de Pedidos Diretos no SAP ME21N (Convênio PMRv nº 6.877/2023)
* **Número de Registro / ID:** 29446-GCC-SAP
* **Área Requisitante:** Gestão de Contratos e Convênios (GCC) / Operações Rodoviárias
* **Diretor Responsável:** Diretor de Operações e Negócios (EcoRodovias SP)
* **Solicitante Técnico:** Equipe de Governança GCC & Pontos Focais (Bruna Silva de Andrade / Wagner da Silva)
* **Data de Submissão:** 22/09/2026

---

### 2. ESCOPO DO PROJETO
#### 2.1 Dentro do Escopo (In-Scope):
* Automação assistida do fluxo de entrada de processos de compras originados por e-mail pelas bases do Policiamento Rodoviário (1º BPRv e demais batalhões vinculados).
* Extração automatizada e validação dos campos obrigatórios da transação SAP ME21N (Org. Compras `0C03`/`0C05`, Grupo de Compradores `344`, Fornecedor Homologado MAXIMA DIST CNPJ `14.529.260/0001-63`, Cond. Pgto `0001`, Incoterms `CIF -`, Cód. Imposto `C0`).
* Central de Contatos e Mala Direta M365 (BCC higienizado, proteção contra vazamento de contatos e conexão direta com Microsoft 365 Copilot).
* Interface Web SPA (`gcc_system.html`) com leitor universal XLSX (SheetJS), eliminando Shadow IT local em estações individuais.

#### 2.2 Fora do Escopo (Out-of-Scope):
* Alteração de alçadas de aprovação ou fluxos formais de liberação no SAP (aprovadores continuam mantendo controle total).
* Compras não relacionadas ao Convênio PMRv ou processos que envolvam concorrência complexa/licitações fora de tabela fixa.
* Desenvolvimento de módulos ABAP customizados complexos ou alterações no core do SAP ERP sem aprovação do COE SAP.

---

### 3. JUSTIFICATIVA E OBRIGATORIEDADE CONTRATUAL
* **Obrigatoriedade:** Contratual / Regulatório ARTESP (Convênio PMRv nº 6.877/2023) e Compliance (ISO 27001 / Diretriz EcoProteção+).
* **Justificativa:** O volume de solicitações enviadas por e-mail pelas bases policiais passou de fluxo pontual para rotina diária de alta complexidade. A digitação manual campo a campo na ME21N gerava gargalo de atendimento, risco de débito incorreto em centro de custo e desperdício de horas de analistas especializados em tarefas repetitivas.

---

### 4. PRINCIPAIS RISCOS E IMPACTO DE NÃO REALIZAR
* **Riscos Operacionais:** Manutenção de lançamento manual suscetível a erros de digitação (débito em verba errada de concessionária ou CNPJ incorreto).
* **Riscos Regulatórios:** Penalidades e autos de notificação da ARTESP por atraso na entrega de insumos essenciais à fiscalização do policiamento rodoviário.
* **Riscos de Segurança da Informação (Shadow IT):** Disseminação de scripts Python e macros VBA sem homologação em estações individuais (risco endereçado pela diretriz EcoProteção+ com submissão ao GT CAPEX).

---

### 5. CAPACIDADE ORGANIZACIONAL & GOVERNANÇA DEVSECOPS
* **Pessoas:** Equipe operacional capacitada nos pontos focais das 4 concessões (Ecovias, Ecopistas, Econoroeste e Raposo Castello).
* **Processos:** Padronização concluída através da base `tbContatos` em 1ª Forma Normal e validação de checklist de compra.
* **Tecnologia & DevSecOps:** Aderência estrita à diretriz de segurança:
  - Repositório centralizado e versionado (GitLab).
  - Análise de vulnerabilidades estáticas de código (VeraCode / SonarQube).
  - Isolamento de execução em ambiente controlado e navegador corporativo.

---

### 6. INDICADORES DE SUCESSO (KPIS) & ORÇAMENTO
* **KPI 1 - Tempo de Lançamento:** Redução de 22 minutos manuais para menos de 45 segundos por pedido.
* **KPI 2 - Taxa de Erro de Digitação:** Zero erros de centro de custo e alocação de impostos (C0).
* **KPI 3 - Cobertura de Pontos Focais:** 100% dos 95 contatos oficiais mapeados e ativos na mala direta auditada.
* **Orçamento Solicitado:**
  - CAPEX: R$ 0,00 (Aproveitamento da infraestrutura existente M365, SAP GUI e navegadores corporativos).
  - OPEX Anual: Absorvido pela operação interna de sustentação.
* **ROI Estimado:** Economia superior a 1.200 horas/homem ao ano e mitigação de riscos de glosas da ARTESP.
