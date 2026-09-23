Attribute VB_Name = "Mod_SAP_ME21N_PMRV"
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
