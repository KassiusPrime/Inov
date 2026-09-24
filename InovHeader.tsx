import React, { useState, useRef, useEffect } from 'react';
import {
  MailSearch,
  FileUp,
  Database,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  FileCode2,
  Route,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { InovTab } from '../types/inov';

interface InovHeaderProps {
  activeTab: InovTab;
  setActiveTab: (tab: InovTab) => void;
  totalContacts?: number;
  totalEmails?: number;
}

interface TabConfig {
  id: InovTab;
  label: string;
  description: string;
  icon: React.ElementType;
  highlight?: boolean;
}

export const InovHeader: React.FC<InovHeaderProps> = ({
  activeTab,
  setActiveTab,
  totalContacts = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const tabs: TabConfig[] = [
    {
      id: 'consulta',
      label: 'Central de Mensagens',
      description: 'Filtragem por área e concessão, tabela dinâmica, mala direta e integração M365 Copilot',
      icon: MailSearch,
    },
    {
      id: 'lote',
      label: 'Importação em Lote & Documentos',
      description: 'Carga com decodificação inteligente sem caracteres estranhos e formulação de comunicado',
      icon: FileUp,
    },
    {
      id: 'base',
      label: 'Repositório tbContatos',
      description: 'Gestão completa da base oficial com governança de terceiros, contratos e escopos',
      icon: Database,
    },
    {
      id: 'dashboard',
      label: 'Dashboard & Auditoria',
      description: 'Data health, diagnósticos de anomalias por IA e indicadores de terceirização',
      icon: LayoutDashboard,
    },
    {
      id: 'powerbi',
      label: 'Modelagem BI',
      description: 'Guia de conexão com Power BI Desktop e fórmulas DAX prontas para governança',
      icon: BarChart3,
    },
    {
      id: 'controladoria',
      label: 'Controladoria Digital',
      description: 'Regras de compliance, conciliação contratual e auditoria da força operacional',
      icon: TrendingUp,
      highlight: true,
    },
    {
      id: 'artefatos',
      label: 'Pacote & Artefatos',
      description: 'Dicionário de dados, especificações corporativas e downloads estruturados',
      icon: FileCode2,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const CurrentIcon = currentTab.icon;

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fecha o dropdown ao pressionar tecla Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Fecha ao selecionar qualquer item da lista
  const handleSelectTab = (tabId: InovTab) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="bg-[#0b3c25] text-white shadow-md sticky top-0 z-50 border-b border-[#008542]/30">
      {/* Faixa superior sutil em laranja de segurança viária */}
      <div className="h-1 w-full bg-[#FF9E1B]" />

      <div className="w-full px-3 sm:px-6 py-2.5">
        <div className="flex justify-between items-center gap-3 relative">
          {/* Identidade Visual Softclean */}
          <div className="flex items-center space-x-2.5">
            <div className="bg-white p-1.5 rounded-lg text-[#008542] shadow-xs flex items-center justify-center shrink-0">
              <Route className="w-5 h-5 text-[#008542]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
                  SISTEMA INOV
                </h1>
                <span className="text-[10px] bg-[#FF9E1B] text-slate-950 font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider">
                  EcoRodovias SP
                </span>
                {totalContacts > 0 && (
                  <span className="text-[10px] bg-white/15 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-white/20" title="Total de contatos na base">
                    {totalContacts} contatos
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                Plataforma de E-mails, Extração Documental & Governança
              </p>
            </div>
          </div>

          {/* Botão Gatilho do Dropdown Retrátil */}
          <div className="flex items-center gap-2">
            <button
              ref={buttonRef}
              onClick={() => setIsOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border shadow-xs cursor-pointer select-none ${
                isOpen
                  ? 'bg-[#008542] text-white border-emerald-400 ring-2 ring-white/20'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-white border-emerald-700/60'
              }`}
              title="Clique para abrir a lista de navegação retrátil"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <div className="p-1 rounded-md bg-white/10 flex items-center justify-center">
                <CurrentIcon className="w-4 h-4 text-[#FF9E1B]" />
              </div>
              <div className="text-left hidden xs:block">
                <span className="block text-[9px] uppercase tracking-wider text-emerald-300 font-semibold leading-none">
                  Navegação
                </span>
                <span className="font-bold text-white text-xs truncate max-w-[140px] sm:max-w-[180px] block">
                  {currentTab.label}
                </span>
              </div>
              <div className="flex items-center space-x-1 pl-1 border-l border-white/20">
                {isOpen ? (
                  <X className="w-4 h-4 text-amber-300" />
                ) : (
                  <Menu className="w-4 h-4 text-emerald-200" />
                )}
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                )}
              </div>
            </button>
          </div>

          {/* DROPDOWN RETRÁTIL COM EXPANSÃO EM LISTA */}
          {isOpen && (
            <>
              {/* Backdrop para fechar ao clicar fora */}
              <div
                className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 transition-opacity"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              {/* Menu Dropdown Suspenso com Expansão em Lista */}
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-1.5 w-full sm:w-[440px] max-w-[95vw] z-50 bg-[#062416] border border-emerald-600/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Cabeçalho do Dropdown com Título e Botão 'X' */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#082d1c] border-b border-emerald-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF9E1B] animate-pulse" />
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                        Menu de Navegação
                      </h2>
                      <p className="text-[10px] text-emerald-300/80">
                        Selecione o módulo para navegar
                      </p>
                    </div>
                  </div>

                  {/* Botão de Fechar com 'X' */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition flex items-center gap-1 text-xs font-bold border border-emerald-700/60 cursor-pointer"
                    title="Fechar menu (X)"
                  >
                    <X className="w-4 h-4 text-[#FF9E1B]" />
                    <span className="text-[10px]">Fechar</span>
                  </button>
                </div>

                {/* Lista Vertical de Módulos (Expansão em Lista) */}
                <div className="p-2 space-y-1 max-h-[72vh] overflow-y-auto custom-scrollbar">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSelectTab(tab.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 border cursor-pointer relative group ${
                          isActive
                            ? 'bg-[#008542] text-white border-emerald-300 shadow-sm ring-1 ring-white/20'
                            : tab.highlight
                            ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-100 border-amber-500/40 hover:border-amber-400'
                            : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-100 border-emerald-800/60 hover:border-emerald-600'
                        }`}
                      >
                        {/* Ícone */}
                        <div
                          className={`p-1.5 rounded-lg shrink-0 mt-0.5 flex items-center justify-center ${
                            isActive
                              ? 'bg-white text-[#008542]'
                              : tab.highlight
                              ? 'bg-[#FF9E1B] text-slate-950 font-black'
                              : 'bg-emerald-800/80 text-emerald-200 group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" strokeWidth={2.2} />
                        </div>

                        {/* Textos do Módulo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-bold text-xs leading-tight truncate">
                              {tab.label}
                            </span>
                            {isActive && (
                              <span className="flex items-center text-[10px] bg-emerald-900/90 text-emerald-200 px-1.5 py-0.2 rounded-full border border-emerald-400 shrink-0 font-semibold">
                                <Check className="w-3 h-3 mr-0.5 text-[#FF9E1B]" />
                                Ativo
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-[10.5px] leading-relaxed ${
                              isActive ? 'text-emerald-100' : 'text-emerald-300/80'
                            }`}
                          >
                            {tab.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
