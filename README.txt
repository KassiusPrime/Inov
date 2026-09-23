===============================================================================
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
