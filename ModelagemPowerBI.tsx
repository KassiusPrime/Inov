import React from 'react';
import {
  FileBarChart2,
  ArrowDownToLine,
  FileSpreadsheet,
  Network,
  Code,
  Copy,
  Layers,
  Database,
  CheckCircle2
} from 'lucide-react';

interface ModelagemPowerBIProps {
  onShowToast: (msg: string, bgColor?: string) => void;
}

export const ModelagemPowerBI: React.FC<ModelagemPowerBIProps> = ({ onShowToast }) => {
  const daxFormulas = [
    {
      title: 'Contagem de Contatos Ativos',
      code: `Contatos Ativos = CALCULATE(COUNTA('tbContatos'[ID]), 'tbContatos'[Status] = "Ativo")`,
    },
    {
      title: 'Força Terceirizada (Prestadores)',
      code: `Total Terceiros = CALCULATE(COUNTROWS('tbContatos'), 'tbContatos'[Tipo_Vinculo] = "Terceiro")`,
    },
    {
      title: 'Índice de Terceirização (%)',
      code: `Indice Terceirizacao = DIVIDE([Total Terceiros], COUNTROWS('tbContatos'), 0) * 100`,
    },
    {
      title: 'Cobertura de E-mails Válidos',
      code: `Emails Cadastrados = CALCULATE(COUNTA('tbContatos'[E-mail]), NOT(ISBLANK('tbContatos'[E-mail])))`,
    },
    {
      title: 'Contratos com Alerta de Vigência (< 6 meses)',
      code: `Contratos em Alerta = CALCULATE(COUNTROWS('tbContatos'), 'tbContatos'[Tipo_Vinculo] = "Terceiro", SEARCH("meses restantes", 'tbContatos'[Tempo_Contrato], 1, 0) > 0)`,
    },
    {
      title: 'Contatos por Concessão (Sem Filtros Internos)',
      code: `Total Concessao = CALCULATE(COUNTROWS('tbContatos'), ALLEXCEPT('tbContatos', 'tbContatos'[Concessão]))`,
    },
  ];

  const handleCopyDAX = (code: string, title: string) => {
    navigator.clipboard.writeText(code);
    onShowToast(`Fórmula DAX (${title}) copiada!`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3.5 pb-5 border-b border-slate-100">
          <div className="bg-emerald-50 p-3 rounded-2xl text-[#008542] border border-emerald-100">
            <FileBarChart2 className="w-7 h-7" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#008542]">
              Conectando a base tbContatos ao Power BI
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transforme a base higienizada em dashboards executivos no Power BI Desktop e M365 com padrão corporativo.
            </p>
          </div>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xl font-black text-[#008542] block flex items-center">
              <ArrowDownToLine className="w-5 h-5 mr-2 text-[#FF9E1B]" />
              <span>Etapa 01</span>
            </span>
            <h4 className="font-bold text-sm text-slate-800">Exportar Base Higienizada</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Vá na aba <strong>&ldquo;Repositório tbContatos&rdquo;</strong> e clique em <strong>&ldquo;Baixar CSV&rdquo;</strong> para obter o arquivo formatado em UTF-8 com delimitador ponto e vírgula.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xl font-black text-[#008542] block flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2 text-[#FF9E1B]" />
              <span>Etapa 02</span>
            </span>
            <h4 className="font-bold text-sm text-slate-800">Importar Dados no Power BI</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No Power BI Desktop, selecione <strong>Obter Dados &gt; Texto/CSV</strong>, selecione o arquivo baixado e confira se a codificação está em <strong>UTF-8</strong>.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xl font-black text-[#008542] block flex items-center">
              <Network className="w-5 h-5 mr-2 text-[#FF9E1B]" />
              <span>Etapa 03</span>
            </span>
            <h4 className="font-bold text-sm text-slate-800">Modelar no Power Query</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Confirme os tipos textuais das colunas <strong>Concessão</strong>, <strong>Área</strong>, <strong>Vínculo</strong>, <strong>Empresa Terceira</strong>, <strong>Tempo de Contrato</strong> e <strong>Status</strong>, estabelecendo a tabela como dimensão <code>dim_Contatos</code>.
            </p>
          </div>
        </div>

        {/* DAX Formulas */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center">
            <Code className="w-5 h-5 mr-2 text-[#008542]" />
            Principais Fórmulas DAX Recomendadas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {daxFormulas.map((f) => (
              <div
                key={f.title}
                className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-400 text-xs font-bold font-mono">// {f.title}</span>
                    <button
                      onClick={() => handleCopyDAX(f.code, f.title)}
                      className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
                      title="Copiar fórmula DAX"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <code className="text-xs font-mono text-emerald-400 break-all leading-relaxed">
                    {f.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Star Schema Architecture Note */}
        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-[#008542] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-[#008542] block mb-1">
              Pronto para Star Schema & Publicação no Power BI Service
            </strong>
            A chave primária <code>ID</code> (ex: <code>GCC0001</code>) permite relacionar diretamente a tabela com contratos de concessão, processos SEI de correspondências e bases corporativas homologadas de fornecedores e prestadores de serviços.
          </div>
        </div>
      </div>
    </div>
  );
};
