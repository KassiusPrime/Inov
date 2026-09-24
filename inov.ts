export type TipoVinculo = 'Próprio' | 'Terceiro';

export interface Contact {
  id: string;
  concession: 'Imigrantes' | 'Leste Paulista' | 'Econoroeste' | 'Raposo Castello' | string;
  area: 'GEN' | 'GAU' | 'CSU' | 'RH' | 'AJL' | 'DTC' | 'COM' | 'DAM' | 'DS' | string;
  function: 'Ponto Focal' | 'Integrante' | 'Grupo de E-mail' | 'Especialista' | string;
  name: string;
  email: string;
  manager: string;
  observation: string;
  status: 'Ativo' | 'Férias' | 'Licença' | 'Substituição' | 'Desligado' | string;

  // Diversificação e Gestão de Terceiros
  tipoVinculo?: TipoVinculo; // 'Próprio' (CLT) ou 'Terceiro' (Prestador/Contratada)
  empresaTerceira?: string; // Nome da empresa terceira / contratada
  tempoContrato?: string; // Quanto tempo tem de contrato / Vigência (ex: "8 meses restantes", "Até Dez/2026")
  atividadesDescricao?: string; // O que ele faz / Atividades desenvolvidas / Escopo de trabalho
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface TemplateVariables {
  concessao?: string;
  area?: string;
  nomesDestaque?: string;
  gestor?: string;
  dataAtual?: string;
  prazo?: string;
  referenciaDocumento?: string;
  assunto?: string;
  corpoTexto?: string;
  tipoVinculo?: string;
  empresaTerceira?: string;
}

export interface BatchContactItem {
  concession: string;
  area: string;
  function: string;
  name: string;
  email: string;
  manager: string;
  observation: string;
  status: string;
  tipoVinculo?: TipoVinculo;
  empresaTerceira?: string;
  tempoContrato?: string;
  atividadesDescricao?: string;
}

export type InovTab =
  | 'consulta'
  | 'lote'
  | 'base'
  | 'dashboard'
  | 'powerbi'
  | 'controladoria'
  | 'artefatos';
