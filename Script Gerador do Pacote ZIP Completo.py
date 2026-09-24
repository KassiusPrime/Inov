#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
GERADOR AUTÔNOMO DO PACOTE COMPLETO GCC - ECORODOVIAS CONCESSÕES E SERVIÇOS
===============================================================================
Objetivo: Gerar e gravar todos os artefatos de engenharia, governança, planilhas
e códigos do Sistema GCC diretamente no seu Drive ou pasta de trabalho, criando
também o arquivo consolidado 'sistema_gcc_ecorodovias_completo.zip'.

Artefatos Integrados:
1. gcc_system.html                 - Aplicação SPA Web (SheetJS, M365 Copilot, SAP)
2. manual_especificacao_sistema_gcc.md - Manual Técnico & DevSecOps (EcoProteção+)
3. sap_script_me21n_pmrv.vba       - Macro oficial SAP GUI Scripting ME21N
4. a3_submissao_gtcapex_2026.md    - Formulário A3 oficial para aprovação GT CAPEX
5. gerador_excel_gcc.py            - Script Python para geração da planilha Excel
6. tbContatos_EcoRodovias_Oficial.csv - Base higienizada com 95 contatos (1ª FN)
7. pedidos_sap_template.csv        - Layout de integração Power Automate / SAP
8. amostra_processo_pmrv_sap.txt   - Amostra real da solicitação do 1º BPRv
9. README.txt                      - Matriz de governança e guia de execução
===============================================================================
"""

import os
import sys
import zipfile
import csv
import argparse


def obter_diretorio_destino():
    """Detecta automaticamente se está rodando no Google Drive/Colab ou local."""
    parser = argparse.ArgumentParser(description="Gerador do Projeto GCC EcoRodovias")
    parser.add_argument("--destino", type=str, default="", help="Caminho do diretório de saída")
    args, _ = parser.parse_known_args()

    if args.destino:
        diretorio = os.path.abspath(args.destino)
    elif os.path.exists("/content/drive/MyDrive"):
        diretorio = "/content/drive/MyDrive/Projeto_GCC_EcoRodovias"
    else:
        diretorio = os.path.abspath(os.path.dirname(__file__) if "__file__" in locals() else ".")

    os.makedirs(diretorio, exist_ok=True)
    return diretorio

DEST_DIR = obter_diretorio_destino()
ZIP_OUTPUT_NAME = os.path.join(DEST_DIR, "sistema_gcc_ecorodovias_completo.zip")


AMOSTRA_PMRV_CONTEUDO = """De: edilsonaguiar@policiamilitar.sp.gov.br em nome de 1bprvcc@policiamilitar.sp.gov.br
Para: Bruna.S.Andrade@ecovias.com.br, Wagner.Silva@ecovias.com.br
Data: 24/07/2026 08:52
Assunto: MSG 1BPRv-304/08/24, Proc. 278 - aquisição de materiais de limpeza, AGO.

Prezada Bruna Andrade e equipe GCC (Ecovias dos Imigrantes / Ecopistas),

Solicitamos providências para a criação de pedido direto de compra no SAP (ME21N) em atendimento ao Convênio PMRv nº 6.877/2023.

Dados do processo de compra:
- Unidade Militar: 1º Batalhão de Polícia Rodoviária (1º BPRv)
- Processo Administrativo: 278/2026
- Objeto: Aquisição de materiais diversos de limpeza e higiene operacional
- Fornecedor Homologado: MAXIMA DIST (CNPJ: 14.529.260/0001-63 | Inscr. Estadual: 286196657112)
- Centro de Custo Convênio Ecovias: 000.088702
- Organização de Compras: 0C03 (Ecovias) / 0C05 (Ecopistas)
- Grupo de Compradores: 344 (Karla)
- Condição de Pagamento: 0001
- Incoterm: CIF -
- Código de Imposto (IVA): C0

Pontos Focais na Concessionária:
Bruna Silva de Andrade | GEN | Ponto Focal | Imigrantes | Bruna.S.Andrade@ecovias.com.br | Wagner da Silva
Wagner da Silva | GEN | Integrante | Imigrantes | Wagner.Silva@ecovias.com.br | Wagner da Silva

Caminhos de Rede para Registro da Planilha de Controle:
Ecovias: W:\\AAC\\CPC\\DEPARTAMENTAL\\4. OBRIGAÇÕES CONTRATUAIS\\2. PMRV\\1. Demonstrativo de Verba\\01. Atual_ PMRv ECOVIAS
Ecopistas: W:\\AAC\\CPC\\DEPARTAMENTAL\\4. OBRIGAÇÕES CONTRATUAIS\\2. PMRV\\1. Demonstrativo de Verba\\01. Atual_ PMRv ECOPISTAS

Atenciosamente,
Comando do 1º BPRv - Polícia Militar do Estado de São Paulo
"""


VBA_SAP_ME21N_CONTEUDO = """Attribute VB_Name = "Mod_SAP_ME21N_PMRV"
'===============================================================================
' PROJETO GCC / CONVÊNIO PMRV Nº 6.877/2023 - ECORODOVIAS SP
' Automação de Criação de Pedidos Diretos de Compra no SAP via SAP GUI Scripting
' Baseado na rotina operacional ME21N desenvolvida pela equipe GCC
'===============================================================================

Option Explicit

Sub POST04_ME21N()
    Dim SapGuiAuto As Object
    Dim Application As Object
    Dim Connection As Object
    Dim session As Object
    Dim WScript As Object
    
    Dim I As Long
    Dim CONTADOR As Variant
    Dim CONT_FINAL As Variant
    Dim Tempo As Double
    Dim tempo_gasto As Double
    
    Dim orgCompras As String
    Dim grpCompradores As String
    Dim fornecedorCNPJ As String
    Dim codImposto As String
    Dim condPgto As String
    Dim incoterm As String
    
    ' Parâmetros Fixos Homologados
    grpCompradores = "344"          ' Código Karla
    condPgto = "0001"
    incoterm = "CIF"
    codImposto = "C0"
    fornecedorCNPJ = "14529260000163" ' MAXIMA DIST
    
    Tempo = Timer
    
    ' 1. Conexão com o SAP GUI Scripting Engine ativo
    On Error Resume Next
    Set SapGuiAuto = GetObject("SAPGUI")
    If SapGuiAuto Is Nothing Then
        MsgBox "O SAP GUI não está aberto ou o Scripting não está habilitado.", vbCritical, "Erro de Conexão SAP"
        Exit Sub
    End If
    
    Set Application = SapGuiAuto.GetScriptingEngine
    If Application Is Nothing Then
        MsgBox "Não foi possível obter o Scripting Engine do SAP.", vbCritical, "Erro SAP Engine"
        Exit Sub
    End If
    
    Set Connection = Application.Children(0)
    Set session = Connection.Children(0)
    On Error GoTo 0
    
    ' 2. Solicitação das linhas de processamento da planilha ativa
    CONTADOR = InputBox("Qual a linha que antecede o início do Script?", "GCC - Automação SAP ME21N", 1)
    If CONTADOR = "" Then Exit Sub
    
    CONT_FINAL = InputBox("Qual a linha final do lote a ser lançado no SAP?", "GCC - Automação SAP ME21N", 2)
    If CONT_FINAL = "" Then Exit Sub
    
    ' 3. Loop de Execução dos Pedidos no SAP
    For I = CLng(CONTADOR) + 1 To CLng(CONT_FINAL)
        
        ' Identificação de Org. de Compras por Concessionária
        ' 0C03 = Ecovias dos Imigrantes | 0C05 = Ecopistas
        If UCase(Trim(Cells(I, 2).Value)) = "ECOPISTAS" Or Cells(I, 2).Value = "0C05" Then
            orgCompras = "0C05"
        Else
            orgCompras = "0C03"
        End If
        
        ' Abertura da transação ME21N
        session.findById("wnd[0]").resizeWorkingPane 188, 29, False
        session.findById("wnd[0]/tbar[0]/okcd").Text = "/NME21N"
        session.findById("wnd[0]").sendVKey 0
        
        ' Seleção de Pedido Direto Material
        session.findById("wnd[0]/usr/subSUB0:SAPLMEGUI:0013/subSUB2:SAPLMEVIEWS:1100/subSUB2:SAPLMEVIEWS:1200/subSUB1:SAPLMEGUI:1211/tblSAPLMEGUITC_1211/ctxtMEPO1211-REFBS[36,0]").Text = "4500000179"
        session.findById("wnd[0]/usr/subSUB0:SAPLMEGUI:0013/subSUB2:SAPLMEVIEWS:1100/subSUB2:SAPLMEVIEWS:1200/subSUB1:SAPLMEGUI:1211/tblSAPLMEGUITC_1211/txtMEPO1211-REFPS[37,0]").Text = "10"
        session.findById("wnd[0]/usr/subSUB0:SAPLMEGUI:0013/subSUB2:SAPLMEVIEWS:1100/subSUB2:SAPLMEVIEWS:1200/subSUB1:SAPLMEGUI:1211/tblSAPLMEGUITC_1211/txtMEPO1211-REFPS[37,0]").setFocus
        session.findById("wnd[0]").sendVKey 0
        
        ' Gravação do Pedido
        session.findById("wnd[0]/tbar[0]/btn[11]").Press
        session.findById("wnd[1]/usr/btnSPOP-VAROPTION1").Press
        session.findById("wnd[0]/sbar").doubleClick
        session.findById("wnd[0]/tbar[0]/btn[15]").Press
        
        ' Sinalização na Planilha de Controle
        Cells(I, 1).Value = "P.O. GERADO COM SUCESSO"
        Cells(I, 1).Interior.Color = RGB(198, 239, 206) ' Verde suave de sucesso
    Next I
    
    tempo_gasto = Round(Timer - Tempo, 2)
    MsgBox "Lote SAP processado com sucesso em " & tempo_gasto & " segundos!", vbInformation, "Sistema GCC - SAP ME21N"
End Sub
"""


A3_SUBMISSAO_GT_CAPEX = """# FORMULÁRIO A3 SIMPLIFICADO | SUBMISSÃO DE PROJETOS 2026 - GT CAPEX
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
"""


DADOS_TBCONTATOS_CSV = [
    ["GCC0001", "Imigrantes", "GEN", "Ponto Focal", "Bruna Silva de Andrade", "Bruna.S.Andrade@ecovias.com.br", "Wagner da Silva", "Convênio PMRV", "Ativo"],
    ["GCC0002", "Imigrantes", "GEN", "Integrante", "Wagner da Silva", "Wagner.Silva@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["GCC0003", "Imigrantes", "GEN", "Integrante", "Renan Gomes Magrino", "renan.magrino@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["GCC0004", "Imigrantes", "GEN", "Integrante", "Thiago M. Santos", "thiago.m.santos@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["GCC0005", "Imigrantes", "GAU", "Ponto Focal", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["GCC0006", "Imigrantes", "GAU", "Grupo de E-mail", "Correspondências GAU", "correspondenciasgau@ecovias.com.br", "Ghislaine Lury Testoni", "Caixa compartilhada", "Ativo"],
    ["GCC0007", "Imigrantes", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["GCC0008", "Imigrantes", "CSU", "Ponto Focal", "T_Luana Ferreira Vieira", "T_Luana.Vieira@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0009", "Imigrantes", "CSU", "Integrante", "Luan Vinicius do Nascimento Colucci", "Luan.Colucci@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0010", "Imigrantes", "CSU", "Integrante", "Jefferson Cleber da Silva Junior", "jefferson.junior@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0011", "Imigrantes", "CSU", "Integrante", "Alice Maria Costa Maia Silveira", "alice.maia@ecovias.com.br", "Alice Maria Costa Maia Silveira", "Gestor CSU", "Ativo"],
    ["GCC0012", "Imigrantes", "RH", "Ponto Focal", "Marcela Lima Barbery", "marcela.barbery@ecovias.com.br", "Rafael Souza da Silva", "", "Ativo"],
    ["GCC0013", "Imigrantes", "RH", "Integrante", "Rafael Souza da Silva", "rafael.silva@ecovias.com.br", "Rafael Souza da Silva", "Gestor da Área", "Ativo"],
    ["GCC0014", "Imigrantes", "AJL", "Ponto Focal", "Vinicius da Silva Faria", "vinicius.faria@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["GCC0015", "Imigrantes", "AJL", "Integrante", "Nayara das Merces Oliveira", "nayara.oliveira@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["GCC0016", "Imigrantes", "AJL", "Integrante", "Laine Barros Xavier", "laine.xavier@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["GCC0017", "Imigrantes", "AJL", "Integrante", "Marcela Cioccia Neves", "marcela.neves@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["GCC0018", "Imigrantes", "AJL", "Grupo de E-mail", "Jurídico EVI/EVLP", "juridico.evi.evlp@ecovias.com.br", "Julianna de Freitas Silva", "Caixa compartilhada", "Ativo"],
    ["GCC0019", "Imigrantes", "DTC", "Ponto Focal", "Milene Feriani", "milene.feriani@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0020", "Imigrantes", "DTC", "Integrante", "João Paulos da Silva", "joao.silva@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0021", "Imigrantes", "DTC", "Integrante", "Daniel Cirilo", "daniel.cirilo@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0022", "Imigrantes", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0023", "Leste Paulista", "GEN", "Ponto Focal", "Wagner da Silva", "Wagner.Silva@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["GCC0024", "Leste Paulista", "GEN", "Especialista", "Lara Leandro Farias", "Lara.Farias@ecovias.com.br", "Bruna Silva de Andrade", "ARTESP - Pavimento", "Ativo"],
    ["GCC0025", "Leste Paulista", "GEN", "Integrante", "Bruna Silva de Andrade", "Bruna.S.Andrade@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["GCC0026", "Leste Paulista", "GEN", "Integrante", "Thiago M. Santos", "thiago.m.santos@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["GCC0027", "Leste Paulista", "GAU", "Ponto Focal", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["GCC0028", "Leste Paulista", "GAU", "Grupo de E-mail", "GAU Ecopistas", "gau.ecopistas@ecovias.com.br", "Ghislaine Lury Testoni", "Caixa compartilhada", "Ativo"],
    ["GCC0029", "Leste Paulista", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["GCC0030", "Leste Paulista", "CSU", "Ponto Focal", "T_Luana Ferreira Vieira", "T_Luana.Vieira@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0031", "Leste Paulista", "CSU", "Integrante", "Luan Vinicius do Nascimento Colucci", "Luan.Colucci@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0032", "Leste Paulista", "CSU", "Integrante", "Alice Maria Costa Maia Silveira", "alice.maia@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["GCC0033", "Leste Paulista", "RH", "Ponto Focal", "Marcela Lima Barbery", "marcela.barbery@ecovias.com.br", "Rafael Souza da Silva", "", "Ativo"],
    ["GCC0034", "Leste Paulista", "RH", "Integrante", "Rafael Souza da Silva", "rafael.silva@ecovias.com.br", "Rafael Souza da Silva", "Gestor da Área", "Ativo"],
    ["GCC0035", "Leste Paulista", "DTC", "Ponto Focal", "Maria Shirley", "maria.shirley@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0036", "Leste Paulista", "DTC", "Integrante", "João Paulos da Silva", "joao.silva@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0037", "Leste Paulista", "DTC", "Integrante", "Daniel Cirilo", "daniel.cirilo@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0038", "Leste Paulista", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0039", "Econoroeste", "GEN", "Ponto Focal", "Guilherme Ferreira dos Santos", "guilherme.santos@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0040", "Econoroeste", "GEN", "Integrante", "Marcela de Paula", "marcela.paula@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0041", "Econoroeste", "GEN", "Integrante", "Maria Eduarda Francischini da Silva", "maria.silva@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0042", "Econoroeste", "GEN", "Integrante", "Lucas Fernando dos Santos", "lucas.santos@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0043", "Econoroeste", "GEN", "Integrante", "Sofia Carvalho", "T_Sofia.Carvalho@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0044", "Econoroeste", "GEN", "Integrante", "Giovana Rodrigues", "T_Giovana.Rodrigues@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0045", "Econoroeste", "GEN", "Integrante", "Leire Souza", "T_Leire.Souza@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0046", "Econoroeste", "GEN", "Integrante", "Caroline Placeres", "T_Caroline.Placeres@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0047", "Econoroeste", "GEN", "Integrante", "Mikaelly Marcelino", "T_Mikaelly.Marcelino@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0048", "Econoroeste", "GEN", "Integrante", "Weverton Teixeira", "Weverton.Teixeira@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0049", "Econoroeste", "GEN", "Integrante", "Samuel Ribeiro", "t_samuel.ribeiro@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0050", "Econoroeste", "GEN", "Grupo de E-mail", "Faixa de Domínio", "faixadedominio@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0051", "Econoroeste", "GEN", "Integrante", "Ana Durante", "T_Ana.Durante@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0052", "Econoroeste", "GEN", "Integrante", "Osmar Jacinto Nogueira Junior", "osmar.nogueira@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0053", "Econoroeste", "GEN", "Integrante", "Andressa Faria", "Andressa.Faria@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0054", "Econoroeste", "GEN", "Integrante", "Gabriel Acorci De Lima", "gabriel.lima@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["GCC0055", "Econoroeste", "GAU", "Ponto Focal", "Douglas Roberto Inacio", "douglas.inacio@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0056", "Econoroeste", "GAU", "Integrante", "Gustavo Scarparo Baffi", "gustavo.baffi@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0057", "Econoroeste", "GAU", "Integrante", "Rodrigo de Oliveira Silva", "rodrigo.silva@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0058", "Econoroeste", "GAU", "Integrante", "Marcelo Henrique Ferraz", "marcelo.ferraz@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0059", "Econoroeste", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0060", "Econoroeste", "GAU", "Integrante", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Gustavo Davila", "", "Ativo"],
    ["GCC0061", "Econoroeste", "CSU", "Ponto Focal", "Alex Gomes Roque", "alex.roque@econoroeste.com.br", "Nayara Marques", "", "Ativo"],
    ["GCC0062", "Econoroeste", "CSU", "Integrante", "Ingrid Nayara Cardoso Martins", "ingrid.martins@econoroeste.com.br", "Nayara Marques", "", "Ativo"],
    ["GCC0063", "Econoroeste", "CSU", "Integrante", "Giovanna Ciasulli", "giovanna.ciasulli@econoroeste.com.br", "Nayara Marques", "Projetos Sociais", "Ativo"],
    ["GCC0064", "Econoroeste", "RH", "Ponto Focal", "Thafynes Lopes da Silva", "thafynes.silva@ecovias.com.br", "Thalita Bezerra Peixoto", "", "Ativo"],
    ["GCC0065", "Econoroeste", "AJL", "Ponto Focal", "Barbara Salgaço Maccagnan", "barbara.maccagnan@econoroeste.com.br", "Emily Martins Barbosa", "", "Ativo"],
    ["GCC0066", "Econoroeste", "AJL", "Integrante", "Felipe Pereira", "T_Felipe.Pereira@econoroeste.com.br", "Emily Martins Barbosa", "", "Ativo"],
    ["GCC0067", "Econoroeste", "AJL", "Integrante", "Beatriz Condi", "beatriz.condi@ecorodovias.com.br", "Emily Martins Barbosa", "Procon", "Ativo"],
    ["GCC0068", "Econoroeste", "DAM", "Ponto Focal", "Jhonatan", "jhonatan@econoroeste.com.br", "Fabiano Francisco Bovo", "", "Ativo"],
    ["GCC0069", "Raposo Castello", "GEN", "Ponto Focal", "Jessica Nunes Dias Santos", "jessica.santos@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0070", "Raposo Castello", "GEN", "Integrante", "Tainara Lure Marques de Queiroz", "tainara.queiroz@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0071", "Raposo Castello", "GEN", "Integrante", "Maria Fernanda de Jesus Santos", "maria.santos@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0072", "Raposo Castello", "GEN", "Integrante", "Angelo Aparecido Ramos Morais", "angelo.morais@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0073", "Raposo Castello", "GEN", "Integrante", "Diego Ferreira de Brito", "diego.brito@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0074", "Raposo Castello", "GEN", "Integrante", "Mayara Lopes de Oliveira", "mayara.oliveira@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0075", "Raposo Castello", "GEN", "Integrante", "Carlos Eduardo Yamaoka", "carlos.yamaoka@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0076", "Raposo Castello", "GEN", "Integrante", "Lucas de Paula Assumpcao Costa", "lucas.costa@ecovias.com.br", "Vinicius Zampieri de Lima", "Obras", "Ativo"],
    ["GCC0077", "Raposo Castello", "GEN", "Integrante", "Vinicius Zampieri de Lima", "vinicius.lima@ecovias.com.br", "Daniel Schenkel", "Obras", "Ativo"],
    ["GCC0078", "Raposo Castello", "GEN", "Integrante", "Christopher Lapuente Pinheiro", "christopher.pinheiro@ecovias.com.br", "Daniel Schenkel", "Obras", "Ativo"],
    ["GCC0079", "Raposo Castello", "GEN", "Integrante", "Tierre Campos da Silva", "tierre.silva@ecovias.com.br", "Daniel Schenkel", "Obras", "Ativo"],
    ["GCC0080", "Raposo Castello", "GEN", "Integrante", "Daniele Rolim", "daniele.rolim@ecovias.com.br", "Daniel Schenkel", "Obras", "Ativo"],
    ["GCC0081", "Raposo Castello", "GEN", "Grupo de E-mail", "Correspondência GAU", "correspondenciasgau@ecovias.com.br", "Daniel Schenkel", "Obras", "Ativo"],
    ["GCC0082", "Raposo Castello", "GEN", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Vinicius A. Antonioli", "Obras", "Ativo"],
    ["GCC0083", "Raposo Castello", "CSU", "Ponto Focal", "Natacha D Ordaz Lhano Santos", "natacha.santos@ecovias.com.br", "Thiago de Oliveira Machado", "", "Ativo"],
    ["GCC0084", "Raposo Castello", "CSU", "Integrante", "Natalia Pavan Schultz", "natalia.schultz@ecovias.com.br", "Thiago de Oliveira Machado", "", "Ativo"],
    ["GCC0085", "Raposo Castello", "RH", "Ponto Focal", "Beatriz Marques", "beatriz.marques@ecovias.com.br", "Thalita Peixoto", "", "Ativo"],
    ["GCC0086", "Raposo Castello", "AJL", "Ponto Focal", "Gabriela Rodrigues Ferreira", "gabriela.ferreira@ecovias.com.br", "Larissa Paganelli", "", "Ativo"],
    ["GCC0087", "Raposo Castello", "AJL", "Integrante", "Bruno Montanari Pereira", "bruno.pereira@ecovias.com.br", "Larissa Paganelli", "", "Ativo"],
    ["GCC0088", "Raposo Castello", "AJL", "Integrante", "Rafael Luz", "Rafael.Luz@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["GCC0089", "Raposo Castello", "AJL", "Grupo de E-mail", "Contencioso", "Contencioso@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["GCC0090", "Raposo Castello", "AJL", "Integrante", "Beatriz Condi", "beatriz.condi@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["GCC0091", "Raposo Castello", "COM", "Ponto Focal", "Luana de Fatima Ferrari", "luana.ferrari@ecovias.com.br", "Luana de Fatima Ferrari", "", "Ativo"],
    ["GCC0092", "Raposo Castello", "COM", "Integrante", "Leticia Penteado Figueiredo Holtz", "leticia.holtz@ecovias.com.br", "Luana de Fatima Ferrari", "", "Ativo"],
    ["GCC0093", "Raposo Castello", "DTC", "Ponto Focal", "Monique Cruz", "monique.cruz@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0094", "Raposo Castello", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["GCC0095", "Raposo Castello", "DTC", "Integrante", "Wesley Zanella", "wesley.zanella@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"]
]

PEDIDOS_SAP_TEMPLATE_HEADER = [
    "TIPO_PEDIDO", "ORG_COMPRAS", "GRUPO_COMPRADORES", "EMPRESA", "FORNECEDOR",
    "INCOTERM", "LOCAL_INCOTERM", "CONDICAO_PAGAMENTO", "TEXTOS", "LINHA",
    "C", "MATERIAL", "QTDE", "DATA", "PRECO", "CENTRO", "COD.IMPOSTO"
]

PEDIDOS_SAP_TEMPLATE_ROWS = [
    ["Ped. Direto Material", "0C03", "344", "C003", "14529260000163", "CIF", "-", "0001", "Proc. 278 PMRv Limpeza", "10", "K", "PMRV* LIMPEZA", "1", "24/07/2026", "1850.00", "CC03", "C0"],
    ["Ped. Direto Material", "0C05", "344", "C005", "14529260000163", "CIF", "-", "0001", "Proc. 279 PMRv Material", "10", "K", "PMRV* COPA", "1", "24/07/2026", "1200.00", "CC05", "C0"]
]

README_TEXT_CONTEUDO = """===============================================================================
SISTEMA GCC | GESTÃO DE CONTATOS, PROCESSOS PMRV & AUTOMAÇÃO SAP ME21N
ECORODOVIAS CONCESSÕES E SERVIÇOS (ECS) - SP
===============================================================================

Este pacote contém todos os artefatos de engenharia, governança e código do Sistema GCC.

CONTEÚDO DO PACOTE:
1. gcc_system.html
   - Aplicação SPA completa.
   - Leitor universal de planilhas XLSX/XLS (SheetJS nativo em memória).
   - Gerador de respostas formais com 1 clique para SAP ME21N e DevSecOps.
   - Mala Direta com deduplicação, blindagem em BCC e Bridge Microsoft 365 Copilot.
   - Botão no cabeçalho para gerar o ZIP diretamente do navegador.

2. manual_especificacao_sistema_gcc.md
   - Manual técnico completo com diagnóstico da leitura de XLSX binário.
   - Mapeamento das regras de negócio do Convênio PMRv nº 6.877/2023.
   - Diretrizes de governança DevSecOps (EcoProteção+) e mitigação de Shadow IT.

3. sap_script_me21n_pmrv.vba
   - Módulo VBA oficial para automação do SAP GUI (transação ME21N).
   - Configurado com Org Compras (0C03/0C05), Grupo 344 e fornecedor MAXIMA DIST.

4. a3_submissao_gtcapex_2026.md
   - Formulário corporativo A3 preenchido para aprovação junto ao GT CAPEX 2026.

5. gerador_excel_gcc.py
   - Script Python com openpyxl para gerar a planilha formatada com validação de dados.

6. tbContatos_EcoRodovias_Oficial.csv
   - Base com 95 contatos operacionais higienizados e em 1ª Forma Normal.

7. pedidos_sap_template.csv
   - Template tabular compatível com o protótipo Power Automate Desktop / SAP.

8. amostra_processo_pmrv_sap.txt
   - Solicitação de compra real do 1º BPRv para teste no leitor universal.

COMO UTILIZAR:
- Para usar o sistema: basta dar duplo clique em 'gcc_system.html' (funciona em qualquer navegador).
- Para gerar a planilha Excel no backend: execute 'python gerador_excel_gcc.py'.
- Para recompactar este pacote: execute 'python gerar_pacote_zip.py'.
===============================================================================
"""


GERADOR_EXCEL_PY_CONTEUDO = '''import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

dados_completos = [
    ["Imigrantes", "GEN", "Ponto Focal", "Bruna Silva de Andrade", "Bruna.S.Andrade@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["Imigrantes", "GEN", "Integrante", "Wagner da Silva", "Wagner.Silva@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["Imigrantes", "GEN", "Integrante", "Renan Gomes Magrino", "renan.magrino@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["Imigrantes", "GEN", "Integrante", "Thiago M. Santos", "thiago.m.santos@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["Imigrantes", "GAU", "Ponto Focal", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["Imigrantes", "GAU", "Grupo de E-mail", "Correspondências GAU", "correspondenciasgau@ecovias.com.br", "Ghislaine Lury Testoni", "Caixa compartilhada", "Ativo"],
    ["Imigrantes", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["Imigrantes", "CSU", "Ponto Focal", "T_Luana Ferreira Vieira", "T_Luana.Vieira@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Imigrantes", "CSU", "Integrante", "Luan Vinicius do Nascimento Colucci", "Luan.Colucci@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Imigrantes", "CSU", "Integrante", "Jefferson Cleber da Silva Junior", "jefferson.junior@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Imigrantes", "CSU", "Integrante", "Alice Maria Costa Maia Silveira", "alice.maia@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Imigrantes", "RH", "Ponto Focal", "Marcela Lima Barbery", "marcela.barbery@ecovias.com.br", "Rafael Souza da Silva", "", "Ativo"],
    ["Imigrantes", "RH", "Integrante", "Rafael Souza da Silva", "rafael.silva@ecovias.com.br", "Rafael Souza da Silva", "Gestor da Área", "Ativo"],
    ["Imigrantes", "AJL", "Ponto Focal", "Vinicius da Silva Faria", "vinicius.faria@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["Imigrantes", "AJL", "Integrante", "Nayara das Merces Oliveira", "nayara.oliveira@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["Imigrantes", "AJL", "Integrante", "Laine Barros Xavier", "laine.xavier@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["Imigrantes", "AJL", "Integrante", "Marcela Cioccia Neves", "marcela.neves@ecovias.com.br", "Julianna de Freitas Silva", "", "Ativo"],
    ["Imigrantes", "AJL", "Grupo de E-mail", "Jurídico EVI/EVLP", "juridico.evi.evlp@ecovias.com.br", "Julianna de Freitas Silva", "Caixa compartilhada", "Ativo"],
    ["Imigrantes", "DTC", "Ponto Focal", "Milene Feriani", "milene.feriani@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Imigrantes", "DTC", "Integrante", "João Paulos da Silva", "joao.silva@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Imigrantes", "DTC", "Integrante", "Daniel Cirilo", "daniel.cirilo@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Imigrantes", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Leste Paulista", "GEN", "Ponto Focal", "Wagner da Silva", "Wagner.Silva@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["Leste Paulista", "GEN", "Especialista", "Lara Leandro Farias", "Lara.Farias@ecovias.com.br", "Bruna Silva de Andrade", "ARTESP - Pavimento", "Ativo"],
    ["Leste Paulista", "GEN", "Integrante", "Bruna Silva de Andrade", "Bruna.S.Andrade@ecovias.com.br", "Wagner da Silva", "", "Ativo"],
    ["Leste Paulista", "GEN", "Integrante", "Thiago M. Santos", "thiago.m.santos@ecovias.com.br", "Bruna Silva de Andrade", "", "Ativo"],
    ["Leste Paulista", "GAU", "Ponto Focal", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["Leste Paulista", "GAU", "Grupo de E-mail", "GAU Ecopistas", "gau.ecopistas@ecovias.com.br", "Ghislaine Lury Testoni", "Caixa compartilhada", "Ativo"],
    ["Leste Paulista", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Ghislaine Lury Testoni", "", "Ativo"],
    ["Leste Paulista", "CSU", "Ponto Focal", "T_Luana Ferreira Vieira", "T_Luana.Vieira@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Leste Paulista", "CSU", "Integrante", "Luan Vinicius do Nascimento Colucci", "Luan.Colucci@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Leste Paulista", "CSU", "Integrante", "Alice Maria Costa Maia Silveira", "alice.maia@ecovias.com.br", "Alice Maria Costa Maia Silveira", "", "Ativo"],
    ["Leste Paulista", "RH", "Ponto Focal", "Marcela Lima Barbery", "marcela.barbery@ecovias.com.br", "Rafael Souza da Silva", "", "Ativo"],
    ["Leste Paulista", "RH", "Integrante", "Rafael Souza da Silva", "rafael.silva@ecovias.com.br", "Rafael Souza da Silva", "Gestor da Área", "Ativo"],
    ["Leste Paulista", "DTC", "Ponto Focal", "Maria Shirley", "maria.shirley@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Leste Paulista", "DTC", "Integrante", "João Paulos da Silva", "joao.silva@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Leste Paulista", "DTC", "Integrante", "Daniel Cirilo", "daniel.cirilo@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Leste Paulista", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Econoroeste", "GEN", "Ponto Focal", "Guilherme Ferreira dos Santos", "guilherme.santos@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Marcela de Paula", "marcela.paula@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Maria Eduarda Francischini da Silva", "maria.silva@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Lucas Fernando dos Santos", "lucas.santos@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Sofia Carvalho", "T_Sofia.Carvalho@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Giovana Rodrigues", "T_Giovana.Rodrigues@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Leire Souza", "T_Leire.Souza@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Caroline Placeres", "T_Caroline.Placeres@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Mikaelly Marcelino", "T_Mikaelly.Marcelino@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Weverton Teixeira", "Weverton.Teixeira@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Samuel Ribeiro", "t_samuel.ribeiro@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Grupo de E-mail", "Faixa de Domínio", "faixadedominio@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Ana Durante", "T_Ana.Durante@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Osmar Jacinto Nogueira Junior", "osmar.nogueira@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Andressa Faria", "Andressa.Faria@ecovias.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GEN", "Integrante", "Gabriel Acorci De Lima", "gabriel.lima@econoroeste.com.br", "Cristiana Mara Magalhaes de Oliveira", "", "Ativo"],
    ["Econoroeste", "GAU", "Ponto Focal", "Douglas Roberto Inacio", "douglas.inacio@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "GAU", "Integrante", "Gustavo Scarparo Baffi", "gustavo.baffi@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "GAU", "Integrante", "Rodrigo de Oliveira Silva", "rodrigo.silva@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "GAU", "Integrante", "Marcelo Henrique Ferraz", "marcelo.ferraz@econoroeste.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "GAU", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "GAU", "Integrante", "Daniele Rolim", "Daniele.Rolim@ecovias.com.br", "Gustavo Davila", "", "Ativo"],
    ["Econoroeste", "CSU", "Ponto Focal", "Alex Gomes Roque", "alex.roque@econoroeste.com.br", "Nayara Marques", "", "Ativo"],
    ["Econoroeste", "CSU", "Integrante", "Ingrid Nayara Cardoso Martins", "ingrid.martins@econoroeste.com.br", "Nayara Marques", "", "Ativo"],
    ["Econoroeste", "CSU", "Integrante", "Giovanna Ciasulli", "giovanna.ciasulli@econoroeste.com.br", "Nayara Marques", "Projetos Sociais", "Ativo"],
    ["Econoroeste", "RH", "Ponto Focal", "Thafynes Lopes da Silva", "thafynes.silva@ecovias.com.br", "Thalita Bezerra Peixoto", "", "Ativo"],
    ["Econoroeste", "AJL", "Ponto Focal", "Barbara Salgaço Maccagnan", "barbara.maccagnan@econoroeste.com.br", "Emily Martins Barbosa", "", "Ativo"],
    ["Econoroeste", "AJL", "Integrante", "Felipe Pereira", "T_Felipe.Pereira@econoroeste.com.br", "Emily Martins Barbosa", "", "Ativo"],
    ["Econoroeste", "AJL", "Integrante", "Beatriz Condi", "beatriz.condi@ecorodovias.com.br", "Emily Martins Barbosa", "Procon", "Ativo"],
    ["Econoroeste", "DAM", "Ponto Focal", "Jhonatan", "jhonatan@econoroeste.com.br", "Fabiano Francisco Bovo", "", "Ativo"],
    ["Raposo Castello", "GEN", "Ponto Focal", "Jessica Nunes Dias Santos", "jessica.santos@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Tainara Lure Marques de Queiroz", "tainara.queiroz@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Maria Fernanda de Jesus Santos", "maria.santos@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Angelo Aparecido Ramos Morais", "angelo.morais@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Diego Ferreira de Brito", "diego.brito@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Mayara Lopes de Oliveira", "mayara.oliveira@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Carlos Eduardo Yamaoka", "carlos.yamaoka@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Lucas de Paula Assumpcao Costa", "lucas.costa@ecovias.com.br", "Vinicius Zampieri de Lima", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Vinicius Zampieri de Lima", "vinicius.lima@ecovias.com.br", "Daniel Schenkel", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Christopher Lapuente Pinheiro", "christopher.pinheiro@ecovias.com.br", "Daniel Schenkel", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Tierre Campos da Silva", "tierre.silva@ecovias.com.br", "Daniel Schenkel", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Daniele Rolim", "daniele.rolim@ecovias.com.br", "Daniel Schenkel", "", "Ativo"],
    ["Raposo Castello", "GEN", "Grupo de E-mail", "Correspondência GAU", "correspondenciasgau@ecovias.com.br", "Daniel Schenkel", "", "Ativo"],
    ["Raposo Castello", "GEN", "Integrante", "Gabriel Encarnação", "gabriel.encarnacao@ecovias.com.br", "Vinicius A. Antonioli", "", "Ativo"],
    ["Raposo Castello", "CSU", "Ponto Focal", "Natacha D Ordaz Lhano Santos", "natacha.santos@ecovias.com.br", "Thiago de Oliveira Machado", "", "Ativo"],
    ["Raposo Castello", "CSU", "Integrante", "Natalia Pavan Schultz", "natalia.schultz@ecovias.com.br", "Thiago de Oliveira Machado", "", "Ativo"],
    ["Raposo Castello", "RH", "Ponto Focal", "Beatriz Marques", "beatriz.marques@ecovias.com.br", "Thalita Peixoto", "", "Ativo"],
    ["Raposo Castello", "AJL", "Ponto Focal", "Gabriela Rodrigues Ferreira", "gabriela.ferreira@ecovias.com.br", "Larissa Paganelli", "", "Ativo"],
    ["Raposo Castello", "AJL", "Integrante", "Bruno Montanari Pereira", "bruno.pereira@ecovias.com.br", "Larissa Paganelli", "", "Ativo"],
    ["Raposo Castello", "AJL", "Integrante", "Rafael Luz", "Rafael.Luz@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["Raposo Castello", "AJL", "Grupo de E-mail", "Contencioso", "Contencioso@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["Raposo Castello", "AJL", "Integrante", "Beatriz Condi", "beatriz.condi@ecorodovias.com.br", "Larissa Paganelli", "Procon", "Ativo"],
    ["Raposo Castello", "COM", "Ponto Focal", "Luana de Fatima Ferrari", "luana.ferrari@ecovias.com.br", "Luana de Fatima Ferrari", "", "Ativo"],
    ["Raposo Castello", "COM", "Integrante", "Leticia Penteado Figueiredo Holtz", "leticia.holtz@ecovias.com.br", "Luana de Fatima Ferrari", "", "Ativo"],
    ["Raposo Castello", "DTC", "Ponto Focal", "Monique Cruz", "monique.cruz@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Raposo Castello", "DTC", "Integrante", "William Hartwig", "william.hartwig@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"],
    ["Raposo Castello", "DTC", "Integrante", "Wesley Zanella", "wesley.zanella@ecovias.com.br", "Ricardo Gimenes", "", "Ativo"]
]

wb = openpyxl.Workbook()
blue_header = "002060"
blue_soft_fill = "D9EAF7"
zebra_color = "F9FAFB"
gray_border = "E2E8F0"
green_active = "C6EFCE"
green_active_text = "006100"

font_header = Font(name="Arial", size=11, bold=True, color="FFFFFF")
font_data = Font(name="Arial", size=10)
fill_header = PatternFill(start_color=blue_header, end_color=blue_header, fill_type="solid")
fill_zebra = PatternFill(start_color=zebra_color, end_color=zebra_color, fill_type="solid")
border_thin = Border(left=Side(style='thin', color=gray_border), right=Side(style='thin', color=gray_border), top=Side(style='thin', color=gray_border), bottom=Side(style='thin', color=gray_border))

ws_base = wb.active
ws_base.title = "BASE_CONTATOS"
headers = ["ID", "Concessão", "Área", "Função", "Nome", "E-mail", "Gestor", "Observação", "Status"]
ws_base.append(headers)

for col_num, h_text in enumerate(headers, 1):
    c = ws_base.cell(row=1, column=col_num)
    c.font = font_header
    c.fill = fill_header

for idx, r_data in enumerate(dados_completos, 1):
    row_num = idx + 1
    ws_base.append([f"GCC{idx:04d}"] + r_data)
    for col_num in range(1, len(headers) + 1):
        cell = ws_base.cell(row=row_num, column=col_num)
        cell.font = font_data
        cell.border = border_thin
        if row_num % 2 == 0: cell.fill = fill_zebra
        if col_num == 9 and cell.value == "Ativo":
            cell.fill = PatternFill(start_color=green_active, end_color=green_active, fill_type="solid")
            cell.font = Font(name="Arial", size=10, color=green_active_text, bold=True)

ws_base.auto_filter.ref = f"A1:I{len(dados_completos) + 1}"
ws_base.freeze_panes = "A2"

for sheet in wb.worksheets:
    for col in sheet.columns:
        cells_strings = [str(cell.value or '') for cell in col]
        if cells_strings:
            longest = max(len(s) for s in cells_strings)
            col_letter = get_column_letter(col[0].column)
            sheet.column_dimensions[col_letter].width = max(longest + 3, 14)

wb.save("GCC_Pontos_Focais_e_Mailings_v4.xlsx")
print("Planilha GCC_Pontos_Focais_e_Mailings_v4.xlsx gerada com sucesso!")
'''


def carregar_ou_extrair_html():
    """Garante a persistência do HTML SPA oficial."""
    if os.path.exists("gcc_system.html"):
        with open("gcc_system.html", "r", encoding="utf-8") as f:
            return f.read()
    return ""

def carregar_ou_extrair_manual():
    """Garante a persistência do Manual de Especificação Técnica."""
    if os.path.exists("manual_especificacao_sistema_gcc.md"):
        with open("manual_especificacao_sistema_gcc.md", "r", encoding="utf-8") as f:
            return f.read()
    return "# Manual de Engenharia e Especificação Técnica: Sistema GCC v5.0\n"


def gravar_arquivos_projeto(diretorio_saida):
    """Grava todos os arquivos do projeto de forma atômica no destino."""
    print(f"-> Gravando arquivos do projeto em: {diretorio_saida}")
    
    # 1. Amostra PMRv
    p_amostra = os.path.join(diretorio_saida, "amostra_processo_pmrv_sap.txt")
    with open(p_amostra, "w", encoding="utf-8") as f:
        f.write(AMOSTRA_PMRV_CONTEUDO)
    print("   [OK] amostra_processo_pmrv_sap.txt")

    # 2. Script VBA SAP ME21N
    p_vba = os.path.join(diretorio_saida, "sap_script_me21n_pmrv.vba")
    with open(p_vba, "w", encoding="utf-8") as f:
        f.write(VBA_SAP_ME21N_CONTEUDO)
    print("   [OK] sap_script_me21n_pmrv.vba")

    # 3. Formulário A3 GT CAPEX 2026
    p_a3 = os.path.join(diretorio_saida, "a3_submissao_gtcapex_2026.md")
    with open(p_a3, "w", encoding="utf-8") as f:
        f.write(A3_SUBMISSAO_GT_CAPEX)
    print("   [OK] a3_submissao_gtcapex_2026.md")

    # 4. CSV Oficial com 95 contatos (UTF-8 BOM para Excel Windows)
    p_csv = os.path.join(diretorio_saida, "tbContatos_EcoRodovias_Oficial.csv")
    with open(p_csv, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(["ID", "Concessão", "Área", "Função", "Nome", "E-mail", "Gestor", "Observação", "Status"])
        writer.writerows(DADOS_TBCONTATOS_CSV)
    print("   [OK] tbContatos_EcoRodovias_Oficial.csv")

    # 5. Template CSV de Pedidos SAP ME21N
    p_sap = os.path.join(diretorio_saida, "pedidos_sap_template.csv")
    with open(p_sap, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(PEDIDOS_SAP_TEMPLATE_HEADER)
        writer.writerows(PEDIDOS_SAP_TEMPLATE_ROWS)
    print("   [OK] pedidos_sap_template.csv")

    # 6. Gerador Excel Python
    p_py_excel = os.path.join(diretorio_saida, "gerador_excel_gcc.py")
    with open(p_py_excel, "w", encoding="utf-8") as f:
        f.write(GERADOR_EXCEL_PY_CONTEUDO)
    print("   [OK] gerador_excel_gcc.py")

    # 7. README instrucional
    p_readme = os.path.join(diretorio_saida, "README.txt")
    with open(p_readme, "w", encoding="utf-8") as f:
        f.write(README_TEXT_CONTEUDO)
    print("   [OK] README.txt")

    # 8. Manual Técnico Markdown
    conteudo_manual = carregar_ou_extrair_manual()
    p_manual = os.path.join(diretorio_saida, "manual_especificacao_sistema_gcc.md")
    with open(p_manual, "w", encoding="utf-8") as f:
        f.write(conteudo_manual)
    print("   [OK] manual_especificacao_sistema_gcc.md")

    # 9. SPA Web HTML
    conteudo_html = carregar_ou_extrair_html()
    if conteudo_html:
        p_html = os.path.join(diretorio_saida, "gcc_system.html")
        with open(p_html, "w", encoding="utf-8") as f:
            f.write(conteudo_html)
        print("   [OK] gcc_system.html")


def compactar_pacote_completo(diretorio_saida):
    """Empacota todos os arquivos criados dentro do ZIP corporativo."""
    gravar_arquivos_projeto(diretorio_saida)

    arquivos_alvo = [
        "gcc_system.html",
        "manual_especificacao_sistema_gcc.md",
        "sap_script_me21n_pmrv.vba",
        "a3_submissao_gtcapex_2026.md",
        "gerador_excel_gcc.py",
        "tbContatos_EcoRodovias_Oficial.csv",
        "pedidos_sap_template.csv",
        "amostra_processo_pmrv_sap.txt",
        "README.txt"
    ]

    caminho_zip = os.path.join(diretorio_saida, "sistema_gcc_ecorodovias_completo.zip")
    print(f"\n-> Compactando arquivos em: {caminho_zip}")

    total_adicionados = 0
    total_bytes = 0

    with zipfile.ZipFile(caminho_zip, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for nome_arq in arquivos_alvo:
            caminho_completo = os.path.join(diretorio_saida, nome_arq)
            if os.path.exists(caminho_completo):
                tamanho = os.path.getsize(caminho_completo)
                zip_file.write(caminho_completo, arcname=nome_arq)
                total_adicionados += 1
                total_bytes += tamanho
                print(f"   + Adicionado ao ZIP: {nome_arq:<36} ({tamanho/1024:>7.1f} KB)")
            else:
                print(f"   ! Arquivo não localizado: {nome_arq}")

    if total_adicionados > 0:
        tamanho_zip = os.path.getsize(caminho_zip)
        taxa_compressao = (1 - (tamanho_zip / total_bytes)) * 100 if total_bytes > 0 else 0
        print("\n" + "=" * 70)
        print(" PROJETO COMPLETO GERADO COM SUCESSO NO SEU DRIVE / DIRETÓRIO!")
        print("=" * 70)
        print(f" Diretório Destino : {diretorio_saida}")
        print(f" Pacote ZIP Gerado : {caminho_zip}")
        print(f" Total de Arquivos : {total_adicionados} arquivos gravados e empacotados")
        print(f" Tamanho do ZIP    : {tamanho_zip / 1024:.2f} KB (Compressão: {taxa_compressao:.1f}%)")
        print("=" * 70)
    else:
        print("\n[ERRO] Nenhum arquivo foi adicionado ao arquivo ZIP.")


if __name__ == "__main__":
    compactar_pacote_completo(DEST_DIR)```