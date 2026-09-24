import React, { useState } from 'react';
import {
  PieChart,
  Crown,
  Target,
  Settings,
  LineChart,
  Handshake,
  CheckCircle2,
  AlertTriangle,
  Download,
  BookOpen,
  ArrowUp,
} from 'lucide-react';

interface ControladoriaDigitalProps {
  onShowToast: (msg: string, bgColor?: string) => void;
}

export const ControladoriaDigital: React.FC<ControladoriaDigitalProps> = ({ onShowToast }) => {
  const [periodo, setPeriodo] = useState('Este Mês (Set/2026)');
  const [tipoServico, setTipoServico] = useState('Todos os Serviços');
  const [equipa, setEquipa] = useState('Visão Global da Empresa');
  const [showMatrixInfo, setShowMatrixInfo] = useState(true);

  const handleExportReport = () => {
    onShowToast('Relatório Executivo de Controladoria gerado com sucesso!');
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Painel de Decisão Integrado — Controladoria Digital
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise de variáveis quantitativas e tomada de decisão estratégica nos níveis Estratégico, Tático e Operacional.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowMatrixInfo(!showMatrixInfo)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>{showMatrixInfo ? 'Ocultar Estudo de Caso' : 'Ver Estudo de Caso (LaTeX)'}</span>
          </button>
          <button
            onClick={handleExportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Case Study Conceptual Matrix from LaTeX document */}
      {showMatrixInfo && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 mb-8 border border-slate-800 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-xs uppercase bg-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-full border border-blue-500/30">
                Estudo de Caso Acadêmico & Corporativo
              </span>
              <h2 className="text-sm font-bold text-white">
                Análise de Variáveis Quantitativas para Tomada de Decisão
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold">
                  <th className="py-2.5 px-3 w-36">Cenário</th>
                  <th className="py-2.5 px-3 w-64">Variáveis Quantitativas</th>
                  <th className="py-2.5 px-3">Como essa variável auxilia a tomada de decisão?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold text-emerald-400">Operacional</td>
                  <td className="py-3 px-3">Horas trabalhadas por projeto; Taxa de cumprimento de prazos (SLA de atendimento).</td>
                  <td className="py-3 px-3 text-slate-400 leading-relaxed">
                    Guia as lideranças na distribuição diária das tarefas. Permite identificar gargalos na rotina da equipa, realocar analistas sobrecarregados e garantir que as obrigações diárias dos clientes sejam entregues a tempo e sem ocorrência de multas.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-indigo-400">Tático</td>
                  <td className="py-3 px-3">Margem de lucro segmentada por tipo de serviço; Índice de inadimplência (percentagem de recebíveis em atraso).</td>
                  <td className="py-3 px-3 text-slate-400 leading-relaxed">
                    Permite aos coordenadores avaliar o que está a funcionar a médio prazo. Ajuda a reestruturar réguas de cobrança, a otimizar processos intermédios de entrega e a direcionar os esforços comerciais para os serviços que apresentam melhor rentabilidade e menor atrito.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-amber-400">Estratégico</td>
                  <td className="py-3 px-3">Custo de Aquisição de Clientes (CAC); Lifetime Value (LTV); Taxa de evasão da carteira (Churn rate).</td>
                  <td className="py-3 px-3 text-slate-400 leading-relaxed">
                    Fundamenta as decisões de longo prazo da direção sobre o rumo do negócio. Indica, de forma clara, se a empresa deve investir em novas tecnologias, alterar a estrutura global de preços ou focar a sua expansão em novos nichos de mercado.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Período de Análise
          </label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option>Este Mês (Set/2026)</option>
            <option>Mês Anterior</option>
            <option>Ano Atual (YTD)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Tipo de Serviço
          </label>
          <select
            value={tipoServico}
            onChange={(e) => setTipoServico(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option>Todos os Serviços</option>
            <option>Gestão Financeira</option>
            <option>Consultoria Tributária</option>
            <option>Auditoria</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Equipa Responsável
          </label>
          <select
            value={equipa}
            onChange={(e) => setEquipa(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option>Visão Global da Empresa</option>
            <option>Time Operacional A</option>
            <option>Time Comercial</option>
          </select>
        </div>
      </div>

      {/* 1. NÍVEL ESTRATÉGICO */}
      <section className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Nível Estratégico (Diretoria)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-blue-500 relative overflow-hidden group hover:shadow-md transition">
            <p className="text-xs text-slate-500 font-medium">Margem de Lucro Operacional</p>
            <div className="flex items-end justify-between mt-3 relative z-10">
              <p className="text-3xl font-bold text-slate-800">24.5%</p>
              <div className="flex flex-col items-end">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" /> 2.1%
                </span>
                <span className="text-[10px] text-slate-400 mt-1">vs mês anterior</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-indigo-500 relative overflow-hidden group hover:shadow-md transition">
            <p className="text-xs text-slate-500 font-medium">Relação LTV / CAC</p>
            <div className="flex items-end justify-between mt-3 relative z-10">
              <p className="text-3xl font-bold text-slate-800">4.2x</p>
              <div className="flex flex-col items-end">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  Excelente
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Meta: &gt; 3.0x</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-rose-500 relative overflow-hidden group hover:shadow-md transition">
            <p className="text-xs text-slate-500 font-medium">Taxa de Evasão (Churn Rate)</p>
            <div className="flex items-end justify-between mt-3 relative z-10">
              <p className="text-3xl font-bold text-slate-800">1.8%</p>
              <div className="flex flex-col items-end">
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" /> 0.3%
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Acima da meta (1.5%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NÍVEL TÁTICO */}
      <section className="mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          <span>Nível Tático (Comercial / Coordenação)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Funil */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-semibold text-slate-800">Funil de Vendas e Conversão</p>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Set/2026</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-700">1. Leads Gerados</span>
                  <span className="text-slate-900 font-bold">1.200</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-700">2. Propostas Enviadas</span>
                  <span className="text-slate-900 font-bold">
                    450 <span className="text-[11px] text-slate-400 font-normal ml-1">(37.5%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-400 h-3 rounded-full" style={{ width: '37.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-700">3. Contratos Fechados</span>
                  <span className="text-slate-900 font-bold">
                    85 <span className="text-[11px] text-slate-400 font-normal ml-1">(18.8%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-300 h-3 rounded-full" style={{ width: '18.8%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* CAC por Canal */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm font-semibold text-slate-800">Custo de Aquisição (CAC) por Canal</p>
                <span className="text-xs text-slate-400 font-medium">Médias ponderadas</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col justify-center items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Tráfego Pago</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">R$ 850</p>
                </div>
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col justify-center items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Indicações</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">R$ 120</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">Ticket Médio (Novos Contratos):</span>
              <span className="text-base font-bold text-blue-700">R$ 2.450,00</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NÍVEL OPERACIONAL */}
      <section className="pb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Nível Operacional (Produtividade e SLA)</span>
        </h3>
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Equipa / Setor</th>
                  <th className="p-4 font-semibold">SLA de Atendimento</th>
                  <th className="p-4 font-semibold">Tempo Médio Resolução</th>
                  <th className="p-4 font-semibold">Status Produtividade (Horas)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Contábil / Fiscal
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">98.5%</span>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '98.5%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">4.2 horas</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dentro do Orçado
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Auditoria e Consultoria
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">85.0%</span>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">12.5 horas</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> +15% horas excedidas
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-medium flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    Suporte Técnico BPO
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-800 font-bold">95.2%</span>
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: '95.2%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">1.5 horas</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dentro do Orçado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
