export interface ProjectArtifact {
  id: string;
  name: string;
  category: 'Código / Script' | 'Governança & A3' | 'Dados & Templates' | 'Manual Técnico';
  description: string;
  fileName: string;
  mimeType: string;
  content: string;
}

export const PROJECT_ARTIFACTS: ProjectArtifact[] = [
  {
    id: 'script-validacao-contatos',
    name: 'Script de Validação e Higienização de Contatos & Terceiros',
    category: 'Código / Script',
    description: 'Rotina em TypeScript/Node.js para auditoria cadastral, classificação de terceiros, validação de e-mails RFC e alerta de vencimento de contratos.',
    fileName: 'higienizacao_contatos_terceiros.ts',
    mimeType: 'text/plain',
    content: `/**
 * PROJETO INOV — ECORODOVIAS CONCESSÕES E SERVIÇOS
 * Script de Auditoria Cadastral, Mala Direta e Gestão de Contratos de Terceiros
 */

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  concessao: string;
  area: string;
  tipoVinculo: 'Próprio' | 'Terceiro';
  empresaTerceira?: string;
  tempoContrato?: string;
  atividadesDescricao?: string;
  status: string;
}

export function auditarBaseColaboradores(colaboradores: Colaborador[]) {
  const relatorio = {
    total: colaboradores.length,
    proprios: 0,
    terceiros: 0,
    empresasParceiras: new Set<string>(),
    emailsInvalidos: [] as string[],
    contratosAVencer: [] as { nome: string; empresa: string; vigencia: string }[],
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;

  for (const c of colaboradores) {
    // 1. Validação Sintática de E-mail
    if (!emailRegex.test(c.email)) {
      relatorio.emailsInvalidos.push(c.email);
    }

    // 2. Classificação de Vínculo Funcional
    if (c.tipoVinculo === 'Terceiro' || c.email.toLowerCase().startsWith('t_')) {
      relatorio.terceiros++;
      if (c.empresaTerceira) {
        relatorio.empresasParceiras.add(c.empresaTerceira);
      }
      // Detecção de contratos com menos de 6 meses
      if (c.tempoContrato && (c.tempoContrato.includes('5') || c.tempoContrato.includes('6') || c.tempoContrato.includes('meses restantes'))) {
        relatorio.contratosAVencer.push({
          nome: c.nome,
          empresa: c.empresaTerceira || 'Não informada',
          vigencia: c.tempoContrato,
        });
      }
    } else {
      relatorio.proprios++;
    }
  }

  console.log('--- RELATÓRIO DE GOVERNANÇA DE FORÇA DE TRABALHO ---');
  console.log(\`Total de Contatos: \${relatorio.total}\`);
  console.log(\`Quadro Próprio (CLT): \${relatorio.proprios} (\${((relatorio.proprios / relatorio.total) * 100).toFixed(1)}%)\`);
  console.log(\`Terceiros / Prestadores: \${relatorio.terceiros} (\${((relatorio.terceiros / relatorio.total) * 100).toFixed(1)}%)\`);
  console.log(\`Empresas Terceirizadas Cadastradas: \${relatorio.empresasParceiras.size}\`);
  console.log(\`Contratos em Alerta de Renovação: \${relatorio.contratosAVencer.length}\`);

  return relatorio;
}`
  },
  {
    id: 'a3-governanca-terceiros',
    name: 'Formulário A3 de Governança de Contratos & Terceiros 2026',
    category: 'Governança & A3',
    description: 'Documento executivo de padronização, conformidade ARTESP e gestão de força de trabalho terceirizada e própria.',
    fileName: 'a3_governanca_terceiros_ecorodovias.md',
    mimeType: 'text/markdown',
    content: `# FORMULÁRIO A3 SIMPLIFICADO | GOVERNANÇA DE CONTATOS & CONTRATOS 2026
**EcoRodovias Concessões e Serviços (ECS) — Governança & Transformação Digital**

---

### 1. DADOS DE IDENTIFICAÇÃO DO PROJETO
* **Título do Projeto:** Sistema INOV — Gestão Inteligente de Comunicação, Governança de Terceiros e Mala Direta
* **Número de Registro / ID:** INOV-2026-GOV
* **Área Requisitante:** Gestão Corporativa de Contratos / Operações Rodoviárias
* **Diretoria Responsável:** Diretoria de Operações e Negócios (EcoRodovias SP)
* **Solicitante Técnico:** Equipe de Governança e Pontos Focais (Bruna Silva de Andrade / Wagner da Silva)
* **Data de Submissão:** 24/09/2026

---

### 2. ESCOPO DO PROJETO
#### 2.1 Dentro do Escopo (In-Scope):
* Central de Contatos com controle estrito de diversificação funcional: identificação de colaboradores Próprios (CLT) e Terceiros (Prestadores de Serviços).
* Cadastro corporativo de dados do terceiro: Razão Social da Empresa Contratada, Vigência/Tempo de Contrato e Escopo Detalhado de Atuação.
* Mala Direta M365 (BCC higienizado, proteção contra vazamento de dados de contato e disparo direto via Outlook Desktop e Web).
* Ingestão Universal de Documentos em lote com suporte a arquivos XLSX, CSV, DOCX, PDF e EML.
* Painel de Auditoria de Integridade e Monitoramento de Contratos de Prestadores a vencer.

#### 2.2 Fora do Escopo (Out-of-Scope):
* Alteração de alçadas de aprovação ou fluxos de pagamento financeiro.
* Processos de recrutamento e admissão (atribuição exclusiva do RH corporativo).

---

### 3. JUSTIFICATIVA E OBRIGATORIEDADE CONTRATUAL
* **Obrigatoriedade:** Regulatório ARTESP, Contratos de Concessão Rodoviária e Governança Corporativa (ISO 27001 / Diretriz EcoProteção+).
* **Justificativa:** Garantia de que prestadores de serviços terceirizados estejam com contratos vigentes, escopos claramente delimitados e recebam comunicados oficiais em canais homologados.

---

### 4. PRINCIPAIS RISCOS E IMPACTO DE NÃO REALIZAR
* **Riscos Trabalhistas & Fiscais:** Ausência de rastreabilidade de prestadores terceirizados e término de vigência sem repactuação.
* **Riscos Operacionais:** Disparo acidental de comunicados estratégicos para terceiros descredenciados.
* **Riscos de Segurança da Informação:** Mitigação de perda de sigilo e vazamento de correspondências com órgãos concedentes.

---

### 5. INDICADORES DE SUCESSO (KPIS) & EFICIÊNCIA OPERACIONAL
* **KPI 1 - Rastreabilidade de Terceiros:** 100% dos terceiros com empresa prestadora, prazo de contrato e escopo de atuação registrados.
* **KPI 2 - Alerta Preventivo de Contratos:** Notificação antecipada para contratos de terceirizados com menos de 6 meses de vigência.
* **KPI 3 - Agilidade na Mala Direta:** Redução de 25 minutos para menos de 30 segundos no envio de notificações setoriais em cópia oculta.
* **KPI 4 - Eficiência:** Economia anual estimada em mais de 1.400 horas/homem em rotinas operacionais.`
  },
  {
    id: 'amostra-pmrv',
    name: 'Amostra Ofício de Demanda 1º BPRv & Prestadores',
    category: 'Dados & Templates',
    description: 'Exemplo de documento oficial com indicação de pontos focais operacionais e empresas parceiras para testes de ingestão.',
    fileName: 'amostra_oficio_pmrv_demandas.txt',
    mimeType: 'text/plain',
    content: `De: edilsonaguiar@policiamilitar.sp.gov.br em nome de 1bprvcc@policiamilitar.sp.gov.br
Para: Bruna.S.Andrade@ecovias.com.br, Wagner.Silva@ecovias.com.br
Data: 24/09/2026 08:52
Assunto: OFÍCIO 1BPRv-304/09/26, Demanda de Conservação e Fiscalização Viária

Prezada Bruna Andrade e equipe de Gestão Operacional (Ecovias dos Imigrantes / Ecopistas),

Encaminhamos para conhecimento e providências o relatório de vistorias conjuntas realizadas nas praças e bases operacionais ao longo do Sistema Anchieta-Imigrantes e Rodovia Ayrton Senna.

Equipes Mobilizadas e Prestadores Credenciados em Campo:
1. Wagner da Silva | GEN | Próprio | Ecovias dos Imigrantes | Gestor de Operações
2. Sofia Carvalho | GEN | Terceiro | Consórcio Conserva SP | Contrato: 14 meses restantes | Atividade: Vistoria de sinalização e conservação
3. Samuel Ribeiro | GEN | Terceiro | TechRoad Engenharia | Contrato: 12 meses restantes | Atividade: Ensaio de defletometria e inspeção de pavimento
4. Luana Ferreira Vieira | CSU | Terceiro | Sonda IT Serviços | Contrato: 10 meses restantes | Atividade: Atendimento de Ouvidoria e SAC

Solicitamos retorno formal com o cronograma das ações preventivas programadas.

Atenciosamente,
Comando do 1º BPRv - Polícia Militar Rodoviária do Estado de São Paulo`
  },
  {
    id: 'manual-inov',
    name: 'Manual de Operação & Governança INOV',
    category: 'Manual Técnico',
    description: 'Especificação técnica do Inov: controle de terceiros, mala direta, substituição dinâmica de variáveis e segurança.',
    fileName: 'MANUAL_SISTEMA_INOV.md',
    mimeType: 'text/markdown',
    content: `# MANUAL DE OPERAÇÃO E ARQUITETURA — SISTEMA INOV
**Controle Inteligente de E-mails, Diversificação de Terceiros & Ingestão de Documentos**  
**EcoRodovias SP (Ecovias dos Imigrantes, Ecopistas, Econoroeste, Raposo Castello)**

---

## 1. VISÃO GERAL DO SISTEMA INOV

O **Inov** é uma plataforma corporativa web desenvolvida sob medida para centralizar a gestão de pontos focais, controlar o fluxo de e-mails departamentais por área/concessionária e gerenciar com precisão a força de trabalho composta por colaboradores Próprios e Prestadores Terceirizados.

### Principais Pilares:
1. **Diversificação Funcional (Próprio vs Terceiro):** Identificação clara do vínculo de trabalho. Para terceiros, controle obrigatório da Razão Social da Empresa Contratada, Tempo de Contrato Restante (vigência) e Escopo Detalhado de Atividades.
2. **Controle de E-mails por Área & Concessão:** Triagem instantânea entre 9 áreas corporativas (\`GEN\`, \`GAU\`, \`CSU\`, \`RH\`, \`AJL\`, \`DTC\`, \`COM\`, \`DAM\`, \`DS\`) e as 4 concessionárias paulistas.
3. **Ingestão Universal de Documentos ("Jogar Documentos"):** Dropzone inteligente para arrastar e soltar arquivos (.xlsx, .xls, .csv, .txt, .docx, .pdf, .eml) com detecção automática de terceiros pelo prefixo 'T_' ou identificadores contratuais.
4. **Modelos de Estrutura Padronizados de E-mail:** Motor de formatação com substituição dinâmica de tags (\`{CONCESSAO}\`, \`{AREA}\`, \`{NOMES_DESTAQUE}\`, \`{GESTOR}\`, \`{PRAZO}\`, \`{DATA_ATUAL}\`, \`{REFERENCIA_DOCUMENTO}\`, \`{TIPO_VINCULO}\`).
5. **Disparo Integrado com Microsoft 365:** Cópia de lista em BCC formatada com ponto e vírgula (\`;\`), acionamento direto no Outlook Desktop (\`mailto:\`), Outlook Web corporativo e exportação de rascunhos em \`.eml\`.
6. **Auditoria & Monitoramento de Contratos:** Dashboard com análise de terceirização, contratos a vencer nos próximos meses e saúde cadastral dos dados.`
  },
  {
    id: 'template-terceiros-csv',
    name: 'Template Tabular de Contratos & Fornecedores Terceirizados',
    category: 'Dados & Templates',
    description: 'Layout CSV estruturado para cadastro em lote e controle de contratos de terceirizados.',
    fileName: 'template_gestao_terceiros_contratos.csv',
    mimeType: 'text/csv',
    content: `ID;CONCESSIONARIA;AREA;FUNCAO;NOME;EMAIL;GESTOR;TIPO_VINCULO;EMPRESA_TERCEIRA;TEMPO_CONTRATO;ESCOPO_ATIVIDADES;STATUS
GCC0008;Imigrantes;CSU;Ponto Focal;T_Luana Ferreira Vieira;T_Luana.Vieira@ecovias.com.br;Alice Maria Costa Maia Silveira;Terceiro;Sonda IT Serviços;10 meses restantes;Triagem de chamados e suporte SAC;Ativo
GCC0043;Econoroeste;GEN;Integrante;Sofia Carvalho;T_Sofia.Carvalho@ecovias.com.br;Cristiana Mara Magalhaes de Oliveira;Terceiro;Consórcio Conserva SP;14 meses restantes;Vistoria de pista e conservação;Ativo
GCC0044;Econoroeste;GEN;Integrante;Giovana Rodrigues;T_Giovana.Rodrigues@ecovias.com.br;Cristiana Mara Magalhaes de Oliveira;Terceiro;Consórcio Conserva SP;8 meses restantes;Relatórios fotográficos de conservação;Ativo
GCC0049;Econoroeste;GEN;Integrante;Samuel Ribeiro;t_samuel.ribeiro@ecovias.com.br;Cristiana Mara Magalhaes de Oliveira;Terceiro;TechRoad Engenharia;12 meses restantes;Fiscalização de ensaios de pavimento;Ativo
GCC0066;Econoroeste;AJL;Integrante;Felipe Pereira;T_Felipe.Pereira@econoroeste.com.br;Emily Martins Barbosa;Terceiro;Sociedade de Advogados Associados;15 meses restantes;Contencioso cível e defesas administrativas;Ativo`
  }
];
