# MANUAL DE ENGENHARIA, ARQUITETURA E ESPECIFICAÇÃO TÉCNICA
## SISTEMA GCC v5.0 — GESTÃO DE CONTATOS, CONVÊNIOS & AUTOMAÇÃO SAP ME21N
**EcoRodovias Concessões e Serviços (ECS) — Concessionárias SP (Ecovias, Ecopistas, Econoroeste, Raposo Castello)**

---

### 1. VISÃO EXECUTIVA E OBJETIVOS ESTRATÉGICOS
O **Sistema GCC (Gestão de Contatos e Convênios)** é a plataforma corporativa unificada desenvolvida para orquestrar o fluxo de informações, governança operacional e integrações sistêmicas das concessionárias paulistas do grupo EcoRodovias.
O sistema consolida a governança e o atendimento contratual sob o princípio arquitetural:
> *"SAP e SEI são as fontes exclusivas da verdade. O GCC atua como cérebro orquestrador e integrador. A Inteligência Artificial Generativa e automações atuam estritamente como camada de interpretação documental e redação administrativa, sendo terminantemente vedada a criação autônoma de fatos contratuais, cadastrais ou financeiros."*

---

### 2. DIAGNÓSTICO DE ENGENHARIA: PROCESSAMENTO E LEITURA DE PLANILHAS XLSX
#### 2.1 Causa Raiz do Erro de Leitura Anterior
- **Problema:** Tentativas anteriores de ler arquivos `.xlsx` e `.xls` utilizando `FileReader.readAsText(file, 'UTF-8')` falhavam. Como o formato Office Open XML (`.xlsx`) é um contêiner compactado em ZIP contendo XMLs estruturados, a decodificação como texto puro corrompia os bytes binários (assinatura `PK`).
- **Solução Definitiva:** Integração da biblioteca de processamento **SheetJS (`xlsx.full.min.js`)** associada à leitura de `ArrayBuffer` (`FileReader.readAsArrayBuffer`). 
- **Funcionalidades do Novo Leitor:**
  1. Suporte nativo a `.xlsx`, `.xls`, `.csv`, `.tsv` e `.json`.
  2. Identificação dinâmica de abas de trabalho com seletor automático.
  3. Conversão segura de matrizes para JSON higienizado em memória sem dependência de servidor ou backend externo.

---

### 3. CONVÊNIO PMRV Nº 6.877/2023 & REGRAS DE NEGÓCIO SAP ME21N
O Convênio PMRv estabelece as obrigações de fornecimento de materiais, insumos e serviços para as bases do Policiamento Militar Rodoviário do Estado de São Paulo (1º BPRv e pelotões vinculados).

#### Parâmetros Operacionais e Contábeis Homologados:
| Parâmetro SAP | Ecovias dos Imigrantes | Ecopistas (Leste Paulista) | Observações |
| :--- | :--- | :--- | :--- |
| **Organização de Compras** | `0C03` | `0C05` | Mapeado por concessionária |
| **Empresa (Sociedade)** | `C003` | `C005` | Código societário SAP |
| **Centro (Plant)** | `CC03` | `CC05` | Centro logístico de recebimento |
| **Centro de Custo Convênio** | `000.088702` | `070.301802` | Verba orçamentária do convênio |
| **Grupo de Compradores** | `344` | `344` | Comprador responsável (Karla) |
| **Fornecedor Homologado** | `14529260000163` | `14529260000163` | MAXIMA DIST (CNPJ sem pontuação) |
| **Condição de Pagamento** | `0001` | `0001` | Pagamento imediato / faturamento padrão |
| **Incoterm** | `CIF` | `CIF` | Frete incluso até a base policial |
| **Código de Imposto (IVA)** | `C0` | `C0` | Isento / Convênio PMRv |
| **Categoria de Classificação**| `K` | `K` | Débito direto em Centro de Custo |

---

### 4. GOVERNANÇA DEVSECOPS & DIRETRIZ ECOPROTEÇÃO+ (MITIGAÇÃO DE SHADOW IT)
A disseminação de scripts isolados e planilhas desconectadas representa risco à conformidade e segurança da informação. A diretriz **EcoProteção+** estabelece:
1. **Homologação via GT CAPEX:** Todo pipeline de automação deve ser submetido formalmente via formulário A3 Simplificado.
2. **Eliminação de Credenciais em Código:** Proibição estrita de senhas e tokens hardcoded. Integração via SAP GUI Scripting autenticado na sessão local ou Microsoft Entra ID / OAuth 2.0.
3. **Proteção contra Vulnerabilidades Web (XSS):** Sanitização obrigatória de strings interpoladas via `escapeHtml()`.
4. **Higienização de Mala Direta:** Bloqueio de envio em massa sem `BCC` (Blind Carbon Copy) para prevenir vazamento de contatos e cumprimento à LGPD.

---

### 5. ESPECIFICAÇÃO DOS COMPONENTES DO PACOTE
1. `gcc_system.html`: Interface SPA responsiva com SheetJS, Chart.js e conectores Microsoft 365.
2. `manual_especificacao_sistema_gcc.md`: Manual técnico de referência e engenharia.
3. `sap_script_me21n_pmrv.vba`: Rotina oficial SAP GUI Scripting para lote de pedidos diretos.
4. `a3_submissao_gtcapex_2026.md`: Formulário institucional A3 para aprovação do GT CAPEX 2026.
5. `gerador_excel_gcc.py`: Script Python com openpyxl para gerar a planilha padronizada `tbContatos`.
6. `tbContatos_EcoRodovias_Oficial.csv`: Base de dados higienizada com 95 contatos em 1ª FN.
7. `pedidos_sap_template.csv`: Layout estruturado para integração com Power Automate Desktop.
8. `amostra_processo_pmrv_sap.txt`: Processo real de compra para testes de homologação.
9. `README.txt`: Guia rápido de instalação e matriz de governança.
