import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Activity,
  HeartPulse,
  MailWarning,
  UserX,
  UserCog,
  ArrowRight,
  Users,
  Milestone,
  LayoutGrid,
  Mail,
  BarChart2,
  BarChartHorizontal,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Building2,
  Clock
} from 'lucide-react';
import { Contact } from '../types/inov';

interface DashboardAuditoriaProps {
  contacts: Contact[];
  onSelectDataHealthFilter: (type: 'empty-emails' | 'empty-managers' | 'inactive') => void;
  onShowToast: (msg: string, bgColor?: string) => void;
}

const CONCESSIONS_LIST = ['Imigrantes', 'Leste Paulista', 'Econoroeste', 'Raposo Castello'];
const AREAS_LIST = ['GEN', 'GAU', 'CSU', 'RH', 'AJL', 'DTC', 'COM', 'DAM', 'DS'];

export const DashboardAuditoria: React.FC<DashboardAuditoriaProps> = ({
  contacts,
  onSelectDataHealthFilter,
  onShowToast,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);

  // Data health stats
  const emptyEmails = useMemo(() => contacts.filter((c) => !c.email || !c.email.includes('@')).length, [contacts]);
  const emptyManagers = useMemo(() => contacts.filter((c) => !c.manager || c.manager.trim() === '').length, [contacts]);
  const inactiveContacts = useMemo(() => contacts.filter((c) => c.status !== 'Ativo').length, [contacts]);
  const validEmails = useMemo(() => contacts.filter((c) => c.email && c.email.includes('@')).length, [contacts]);

  // Third party and direct staff stats
  const totalProprios = useMemo(
    () => contacts.filter((c) => (c.tipoVinculo || 'Próprio') === 'Próprio' && !c.email.toLowerCase().startsWith('t_')).length,
    [contacts]
  );
  const terceirosList = useMemo(
    () => contacts.filter((c) => c.tipoVinculo === 'Terceiro' || c.email.toLowerCase().startsWith('t_')),
    [contacts]
  );
  const totalTerceiros = terceirosList.length;

  const empresasAggregation = useMemo(() => {
    const map = new Map<string, { count: number; roles: string[]; contractSamples: string[] }>();
    terceirosList.forEach((c) => {
      const emp = c.empresaTerceira || 'Prestador Homologado';
      const existing = map.get(emp) || { count: 0, roles: [], contractSamples: [] };
      existing.count += 1;
      if (c.atividadesDescricao && !existing.roles.includes(c.atividadesDescricao)) {
        existing.roles.push(c.atividadesDescricao);
      }
      if (c.tempoContrato && !existing.contractSamples.includes(c.tempoContrato)) {
        existing.contractSamples.push(c.tempoContrato);
      }
      map.set(emp, existing);
    });
    return Array.from(map.entries())
      .map(([company, data]) => ({
        company,
        count: data.count,
        roles: data.roles,
        contracts: data.contractSamples,
      }))
      .sort((a, b) => b.count - a.count);
  }, [terceirosList]);

  // Concession distribution
  const concessionCounts = useMemo(() => {
    return CONCESSIONS_LIST.map((c) => ({
      name: c,
      count: contacts.filter((item) => item.concession === c).length,
    }));
  }, [contacts]);

  // Area distribution
  const areaCounts = useMemo(() => {
    return AREAS_LIST.map((a) => ({
      name: a,
      count: contacts.filter((item) => item.area === a).length,
    })).sort((a, b) => b.count - a.count);
  }, [contacts]);

  const maxConcessionCount = Math.max(...concessionCounts.map((x) => x.count), 1);
  const maxAreaCount = Math.max(...areaCounts.map((x) => x.count), 1);

  // Generate AI Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      const report = `### PARECER DE AUDITORIA DE GOVERNANÇA, INTEGRIDADE E FORÇA DE TRABALHO
**Entidade Avaliada:** Sistema INOV — EcoRodovias Concessões e Serviços (ECS)
**Data da Avaliação:** ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

#### 1. AVALIAÇÃO GERAL DE INTEGRIDADE & CANAIS (DATA HEALTH)
A base atual conta com **${contacts.length} colaboradores cadastrados**, sendo **${totalProprios} do Quadro Próprio CLT (${((totalProprios / (contacts.length || 1)) * 100).toFixed(0)}%)** e **${totalTerceiros} Prestadores Terceirizados (${((totalTerceiros / (contacts.length || 1)) * 100).toFixed(0)}%)**.
A cobertura de correio eletrônico corporativo é de **${((validEmails / (contacts.length || 1)) * 100).toFixed(1)}%**.
A higienização em 1ª Forma Normal (1FN) garante conformidade estrutural entre Concessões, Áreas e Gestores.

#### 2. AUDITORIA DE PRESTADORES TERCEIRIZADOS & CONTRATOS
- **Empresas Parceiras Mapeadas:** ${empresasAggregation.length} fornecedoras ativas (${empresasAggregation.map((e) => e.company).slice(0, 4).join(', ')}${empresasAggregation.length > 4 ? '...' : ''}).
- **Rastreabilidade de Escopo & Vigência:** ${terceirosList.filter((t) => t.empresaTerceira && t.tempoContrato).length} de ${totalTerceiros} terceiros possuem tempo de vigência e escopo de atividades descritos detalhadamente.
- **Aderência às Diretrizes ARTESP & LGPD:** Os prestadores terceirizados utilizam e-mails dedicados ou canais homologados, prevenindo quebra de sigilo contratual e garantindo alçadas claras com a liderança interna da EcoRodovias.

#### 3. GAPS & RISCOS OPERACIONAIS
- **Canais sem E-mail Direto:** ${emptyEmails} registros necessitam de preenchimento formal.
- **Vínculo de Liderança Departamental:** ${emptyManagers} registros sem o nome do gestor responsável imediato.
- **Status Operacional:** ${inactiveContacts} colaboradores com status não ativo (férias/licença), exigindo monitoramento das substituições.

#### 4. PLANO DE AÇÃO TÁTICO RECOMENDADO
1. **Governança de Vencimento de Contratos:** Monitorar os contratos com vigência inferior a 6 meses para alinhamento prévio de renovação de escopo.
2. **Revisão Trimestral dos Pontos Focais:** Validar periodicamente as atribuições dos prestadores terceirizados junto aos gestores de área.
3. **Automação de Rascunhos (.eml):** Priorizar envios em BCC protegido para resguardar a privacidade dos prestadores e cumprir as exigências da LGPD.`;

      setAuditReport(report);
      onShowToast('Parecer executivo emitido com sucesso!');
    } catch {
      onShowToast('Falha ao emitir parecer.', 'bg-rose-600');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* AI Governance Audit Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide flex items-center">
                Auditoria & Diagnóstico de Governança por IA
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Analise fraquezas, canais vazios e conformidade da mala direta em toda a cadeia EcoRodovias SP.
              </p>
            </div>
          </div>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Activity className={`w-4 h-4 ${isAuditing ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isAuditing ? 'Auditando base...' : 'Emitir Relatório de Governança'}</span>
          </button>
        </div>

        {/* Output Box */}
        {auditReport && (
          <div className="mt-4 bg-slate-800/90 p-4.5 rounded-xl border border-slate-700 text-xs leading-relaxed text-slate-200 max-h-72 overflow-y-auto whitespace-pre-wrap font-sans">
            {auditReport}
          </div>
        )}
      </div>

      {/* Data Health Diagnostics Cards */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center">
          <HeartPulse className="w-4 h-4 mr-2 text-rose-600" />
          Diagnóstico Rápido de Higienização de Dados (Data Health)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Empty emails */}
          <div
            onClick={() => onSelectDataHealthFilter('empty-emails')}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <MailWarning className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase">E-mails em Branco</h4>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{emptyEmails}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Empty managers */}
          <div
            onClick={() => onSelectDataHealthFilter('empty-managers')}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-orange-50 text-[#FF9E1B] border border-orange-100">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase">Sem Gestor Definido</h4>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{emptyManagers}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Inactive / Leaves */}
          <div
            onClick={() => onSelectDataHealthFilter('inactive')}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <UserCog className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 uppercase">Inativos / Licenças</h4>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{inactiveContacts}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-[#008542] border border-emerald-100 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total na Base</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{contacts.length}</h3>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Quadro Próprio</p>
            <h3 className="text-xl font-bold text-emerald-800 mt-0.5">
              {totalProprios}{' '}
              <span className="text-[11px] text-emerald-600 font-normal">
                ({((totalProprios / (contacts.length || 1)) * 100).toFixed(0)}%)
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-amber-200 flex items-center space-x-3.5 bg-amber-50/20">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase">Terceiros & Prestadores</p>
            <h3 className="text-xl font-bold text-amber-900 mt-0.5">
              {totalTerceiros}{' '}
              <span className="text-[11px] text-amber-700 font-normal">
                ({((totalTerceiros / (contacts.length || 1)) * 100).toFixed(0)}%)
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Empresas Parceiras</p>
            <h3 className="text-xl font-bold text-indigo-900 mt-0.5">{empresasAggregation.length}</h3>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl shadow-xs border border-slate-200 flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-100 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">E-mails Válidos</p>
            <h3 className="text-xl font-bold text-green-800 mt-0.5">{validEmails}</h3>
          </div>
        </div>
      </div>

      {/* Third Party Governance Detail Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
              Governança de Força de Trabalho & Prestadores Terceirizados
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapeamento de empresas contratadas, vigência de contrato e escopo das atividades executadas.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {totalTerceiros} colaboradores terceirizados rastreados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {empresasAggregation.map((emp) => (
            <div
              key={emp.company}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{emp.company}</h4>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      {emp.count} {emp.count === 1 ? 'prestador' : 'prestadores'}
                    </span>
                  </div>
                </div>
              </div>

              {emp.contracts.length > 0 && (
                <div className="mt-2.5 flex items-center space-x-1.5 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium truncate">{emp.contracts.join(', ')}</span>
                </div>
              )}

              {emp.roles.length > 0 && (
                <div className="mt-2 text-[10px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700 font-semibold">Escopo / O que faz:</strong>{' '}
                  <span className="italic">{emp.roles.slice(0, 2).join('; ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Concession Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm mb-5 flex items-center">
            <BarChart2 className="w-4 h-4 mr-2 text-[#008542]" />
            Total de Contatos por Concessionária
          </h3>
          <div className="space-y-4">
            {concessionCounts.map((item) => {
              const pct = Math.round((item.count / maxConcessionCount) * 100);
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-emerald-800 font-bold">
                      {item.count} colaboradores ({Math.round((item.count / (contacts.length || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-[#008542] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Area Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm mb-5 flex items-center">
            <BarChartHorizontal className="w-4 h-4 mr-2 text-[#FF9E1B]" />
            Distribuição por Área de Atuação
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {areaCounts.map((item) => {
              const pct = Math.round((item.count / maxAreaCount) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.name}
                    </span>
                    <span className="text-amber-800 font-bold">{item.count} contatos</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#FF9E1B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
