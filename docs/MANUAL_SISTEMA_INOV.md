# MANUAL DE OPERAÇÃO E ARQUITETURA — SISTEMA INOV
**Controle Inteligente de E-mails por Área, Ingestão de Documentos & Mala Direta Padronizada**  
---

## 1. VISÃO GERAL DO SISTEMA INOV

O **Inov** é uma plataforma corporativa web desenvolvida sob medida para centralizar a gestão de pontos focais, controlar o fluxo de e-mails departamentais por área/concessionária e gerar comunicações padronizadas com substituição dinâmica de variáveis.

### Principais Pilares:
1. **Controle de E-mails por Área & Concessão:** Triagem instantânea entre 9 áreas corporativas (`GEN`, `GAU`, `CSU`, `RH`, `AJL`, `DTC`, `COM`, `DAM`, `DS`) e as 4 concessionárias paulistas.
2. **Ingestão Universal de Documentos ("Jogar Documentos"):** Dropzone inteligente para arrastar e soltar arquivos (.xlsx, .xls, .csv, .txt, .docx, .pdf, .eml) com extração determinística de contatos, nomes, funções e texto de referência.
3. **Modelos de Estrutura Padronizados de E-mail:** Motor de formatação que substitui automaticamente as partes-chave do texto (`{CONCESSAO}`, `{AREA}`, `{NOMES_DESTAQUE}`, `{GESTOR}`, `{PRAZO}`, `{REFERENCIA_DOCUMENTO}`, `{DATA_ATUAL}`, `{CORPO_TEXTO}`).
4. **Disparo Integrado com Microsoft 365:** Cópia de lista em BCC formatada com ponto e vírgula (`;`), acionamento direto no Outlook Desktop (`mailto:`), Outlook Web corporativo e exportação de rascunhos em `.eml`.
5. **Auditoria & Qualidade de Dados:** Validação RFC de e-mails, prevenção contra duplicidades e monitoramento de gestores ausentes.

> **Nota de Arquitetura:** O Sistema Inov foi completamente desacoplado de qualquer rotina de compras ou ordens SAP, dedicando 100% de sua capacidade à governança de comunicação, padronização de e-mails e gestão ágil de pontos focais.

---

## 2. MATRIZ DE CONCESSÕES E ÁREAS ATENDIDAS

| Concessionária | Abrangência Rodoviária | Áreas Mapeadas |
| :--- | :--- | :--- |
| **Imigrantes (Ecovias)** | Sistema Anchieta-Imigrantes | GEN, GAU, CSU, RH, AJL, DTC, COM, DAM, DS |
| **Leste Paulista (Ecopistas)**| Corredor Ayrton Senna / Carvalho Pinto | GEN, GAU, CSU, RH, AJL, DTC, COM, DAM, DS |
| **Econoroeste** | Malha rodoviária do Noroeste Paulista | GEN, GAU, CSU, RH, AJL, DTC, COM, DAM, DS |
| **Raposo Castello** | SP-270 / Eixo Castello-Raposo | GEN, GAU, CSU, RH, AJL, DTC, COM, DAM, DS |

---

## 3. CATÁLOGO DE MODELOS E VARIÁVEIS DINÂMICAS

### 3.1 Variáveis-Chave Substituíveis
* `{CONCESSAO}`: Nome das concessionárias selecionadas na triagem.
* `{AREA}`: Sigla ou lista de departamentos envolvidos.
* `{NOMES_DESTAQUE}`: Pontos focais listados para interpelação direta.
* `{GESTOR}`: Gestores da área cadastrados na base.
* `{DATA_ATUAL}`: Data corrente de emissão do comunicado.
* `{PRAZO}`: Data ou limite temporal para retorno ou cumprimento.
* `{REFERENCIA_DOCUMENTO}`: Número de ofício, processo administrativo ou relatório.
* `{ASSUNTO}`: Pauta central da demanda.
* `{CORPO_TEXTO}`: Conteúdo informativo detalhado.

### 3.2 Estruturas Pré-Configuradas:
1. **Comunicado Operacional / Rotina:** Para alinhamento de procedimentos e normas de campo.
2. **Cobrança de Prazo & Notificação de Pendência:** Comunicação formal urgente com destaque para datas limites.
3. **Convocação de Reunião & Alinhamento de Pauta:** Convite estruturado com link para o Microsoft Teams.
4. **Solicitação Técnica & Coleta de Dados:** Requisição formal de relatórios, dados e evidências.
5. **Circular Institucional às Concessões:** Envio de diretrizes a gestores de múltiplas concessões.
6. **Modelo Livre:** Permite digitar qualquer corpo de mensagem preservando as tags dinâmicas.

---

## 4. INGESTÃO DE ARQUIVOS (DROPZONE)

Na aba **"Importação em Lote & Documentos"**, o usuário pode arrastar qualquer documento corporativo:
- **Planilhas Excel (`.xlsx`, `.xls`):** O motor interno decodifica as abas via SheetJS, extraindo células sem travar a interface.
- **Relatórios & Ofícios (`.txt`, `.csv`, `.docx`, `.pdf`, `.eml`):** Extração de texto bruto.
- **Opção "Formular de Uma Só Vez":** Identifica os contatos e, simultaneamente, preenche a pauta na Central de Mensagens com o modelo padronizado.

---

## 5. PUBLICANDO NO GITHUB

Para sincronizar o repositório local com o repositório remoto oficial:

```bash
git remote add origin https://github.com/KassiusPrime/Inov.git
git branch -M main
git push -u origin main
```
