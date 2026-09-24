import { EmailTemplate, TemplateVariables } from '../types/inov';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "comunicado",
    name: "Comunicado Operacional / Rotina",
    subject: "[INOV / {CONCESSAO}] Comunicado Operacional — Área {AREA}",
    body: `Prezados(as) integrantes da equipe ({AREA} — {CONCESSAO}),

Comunicamos formalmente as seguintes diretrizes operacionais e administrativas:

{CORPO_TEXTO}

Solicitamos que todos os pontos focais e integrantes tomem ciência e repliquem as orientações às respectivas equipes de campo e suporte.

Data de Emissão: {DATA_ATUAL}
Responsáveis pelas Áreas: {GESTOR}

Atenciosamente,
Coordenação de Governança & Comunicações Operacionais
EcoRodovias SP`
  },
  {
    id: "cobranca",
    name: "Cobrança de Prazo & Notificação de Pendência",
    subject: "[URGENTE / PRAZO: {PRAZO}] Notificação de Pendência — {CONCESSAO} ({AREA})",
    body: `Prezados(as) {NOMES_DESTAQUE},

Reportamos a existência de pendência operacional/documental referente ao processo institucional, com vencimento impreterível para {PRAZO}:

• Concessão(ões): {CONCESSAO}
• Área(s) Envolvida(s): {AREA}
• Referência Documental / Processo: {REFERENCIA_DOCUMENTO}
• Pauta / Detalhamento: {CORPO_TEXTO}

Pedimos a gentileza de acusar o recebimento deste comunicado e encaminhar o retorno conclusivo até o prazo estipulado ({PRAZO}) para manter a conformidade com as diretrizes da ARTESP e governança interna.

Atenciosamente,
Gestão de Comunicações & Prazos Contratuais
EcoRodovias SP`
  },
  {
    id: "convocacao",
    name: "Convocação de Reunião & Alinhamento de Pauta",
    subject: "[CONVOCAÇÃO] Reunião de Alinhamento Técnico — {AREA} ({CONCESSAO})",
    body: `Prezados(as) {NOMES_DESTAQUE},

Convocamos os pontos focais e integrantes das áreas ({AREA}) da {CONCESSAO} para reunião técnica de alinhamento:

• Pauta Principal: {ASSUNTO}
• Detalhamento / Objetivos: {CORPO_TEXTO}
• Data / Prazo Limite de Confirmação: {PRAZO}
• Documento de Apoio: {REFERENCIA_DOCUMENTO}
• Local: Microsoft Teams (convite de calendário encaminhado a todos os destinatários em cópia oculta)

Contamos com a pontualidade e a participação de todos os setores envolvidos.

Atenciosamente,
Coordenação Técnica & Gestão de Pautas
EcoRodovias SP`
  },
  {
    id: "solicitacao",
    name: "Solicitação Técnica & Coleta de Dados",
    subject: "[SOLICITAÇÃO] Coleta de Informações / Procedimentos — {CONCESSAO} ({AREA})",
    body: `Prezada equipe da {AREA} ({CONCESSAO}),

Em alinhamento aos procedimentos de governança institucional, solicitamos o fornecimento das seguintes informações / insumos:

{CORPO_TEXTO}

• Referência Documental: {REFERENCIA_DOCUMENTO}
• Prazo Solicitado para Retorno: {PRAZO}
• Gestor Responsável: {GESTOR}

Ficamos à disposição para quaisquer dúvidas operacionais.

Atenciosamente,
Equipe de Gestão e Suporte aos Pontos Focais
EcoRodovias SP`
  },
  {
    id: "circular",
    name: "Circular Institucional às Concessões",
    subject: "[CIRCULAR INSTITUCIONAL] Diretriz Corporativa — Concessões EcoRodovias SP",
    body: `Prezados Gestores, Especialistas e Pontos Focais ({CONCESSAO}),

Encaminhamos a presente Circular Institucional referente à pauta: "{ASSUNTO}".

{CORPO_TEXTO}

• Data de Registro: {DATA_ATUAL}
• Abrangência: Setores {AREA} de {CONCESSAO}
• Documento Associado: {REFERENCIA_DOCUMENTO}

Contamos com a habitual cooperação e estrita observância das normas regulatórias.

Atenciosamente,
Diretoria de Governança, Contratos & Operações
EcoRodovias SP`
  },
  {
    id: "customizado",
    name: "Modelo Livre com Tags Dinâmicas",
    subject: "[INOV] {ASSUNTO} — {CONCESSAO}",
    body: `Prezada equipe {AREA} ({CONCESSAO}),

{CORPO_TEXTO}

Referência: {REFERENCIA_DOCUMENTO}
Prazo: {PRAZO}
Data: {DATA_ATUAL}

Atenciosamente,
Sistema Inov — EcoRodovias SP`
  }
];

export function applyTemplateVariables(
  template: EmailTemplate,
  vars: TemplateVariables
): { subject: string; body: string } {
  const concessao = vars.concessao || 'Todas as Concessões';
  const area = vars.area || 'Todas as Áreas';
  const nomesDestaque = vars.nomesDestaque || 'Prezados Colaboradores';
  const gestor = vars.gestor || 'Gestores Responsáveis';
  const dataAtual = vars.dataAtual || new Date().toLocaleDateString('pt-BR');
  const prazo = vars.prazo || '5 dias úteis';
  const referenciaDocumento = vars.referenciaDocumento || 'Processo Administrativo Interno';
  const assunto = vars.assunto || 'Assunto Corporativo Operacional';
  const corpoTexto = vars.corpoTexto || 'Solicitamos a atenção e o acompanhamento das atividades planejadas para este ciclo operacional.';

  const subject = template.subject
    .replace(/{CONCESSAO}/g, concessao)
    .replace(/{AREA}/g, area)
    .replace(/{ASSUNTO}/g, assunto)
    .replace(/{PRAZO}/g, prazo)
    .replace(/{REFERENCIA_DOCUMENTO}/g, referenciaDocumento)
    .replace(/{DATA_ATUAL}/g, dataAtual);

  const body = template.body
    .replace(/{CONCESSAO}/g, concessao)
    .replace(/{AREA}/g, area)
    .replace(/{NOMES_DESTAQUE}/g, nomesDestaque)
    .replace(/{GESTOR}/g, gestor)
    .replace(/{DATA_ATUAL}/g, dataAtual)
    .replace(/{ASSUNTO}/g, assunto)
    .replace(/{PRAZO}/g, prazo)
    .replace(/{REFERENCIA_DOCUMENTO}/g, referenciaDocumento)
    .replace(/{CORPO_TEXTO}/g, corpoTexto);

  return { subject, body };
}
