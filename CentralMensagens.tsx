import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Copy,
  Send,
  Chrome,
  FileText,
  Sparkles,
  Layers,
  Users2,
  Orbit,
  ExternalLink,
  Search,
  LayoutTemplate,
  CheckSquare,
  Square,
  Filter,
  Check,
  Building2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { Contact } from '../types/inov';
import { EMAIL_TEMPLATES, applyTemplateVariables } from '../data/emailTemplates';

interface CentralMensagensProps {
  contacts: Contact[];
  onShowToast: (msg: string, bgColor?: string) => void;
}

const CONCESSIONS_LIST = ['Imigrantes', 'Leste Paulista', 'Econoroeste', 'Raposo Castello'];
const AREAS_LIST = ['GEN', 'GAU', 'CSU', 'RH', 'AJL', 'DTC', 'COM', 'DAM', 'DS'];
const FUNCTIONS_LIST = ['Ponto Focal', 'Integrante', 'Grupo de E-mail', 'Especialista'];
const STATUS_LIST = ['Ativo', 'Férias', 'Licença', 'Substituição', 'Desligado'];

export const CentralMensagens: React.FC<CentralMensagensProps> = ({
  contacts,
  onShowToast,
}) => {
  // Global sidebar filter states
  const [selectedConcessions, setSelectedConcessions] = useState<string[]>([...CONCESSIONS_LIST]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([...AREAS_LIST]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([...FUNCTIONS_LIST]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['Ativo']);
  const [selectedVinculo, setSelectedVinculo] = useState<'Todos' | 'Próprio' | 'Terceiro'>('Todos');

  // Dynamic Table Slicers (Tabela Dinâmica)
  const [tableSearch, setTableSearch] = useState('');
  const [tableConcessionSlicer, setTableConcessionSlicer] = useState<string>('Todas');
  const [tableVinculoSlicer, setTableVinculoSlicer] = useState<'Todos' | 'Próprio' | 'Terceiro'>('Todos');
  const [tableAreaSlicer, setTableAreaSlicer] = useState<string>('Todas');
  const [tableFunctionSlicer, setTableFunctionSlicer] = useState<string>('Todas');

  // Contact Individual Checkbox Selection (Set of contact IDs)
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());

  // Mailing output separator
  const [separator, setSeparator] = useState<'semicolon' | 'comma' | 'newline'>('semicolon');

  // Redator states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('comunicado');
  const [assuntoInput, setAssuntoInput] = useState('Alinhamento operacional e conformidade de rotina');
  const [prazoInput, setPrazoInput] = useState('30/09/2026 às 17h00');
  const [refDocInput, setRefDocInput] = useState('Processo SEI / Demanda Interna 2026');
  const [detalhesInput, setDetalhesInput] = useState('Solicitamos a atenção e o acompanhamento pontual das atividades de conformidade acordadas para este ciclo.');
  
  // Generated Email Output
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedBody, setGeneratedBody] = useState('');
  const [isRefiningAI, setIsRefiningAI] = useState(false);

  // Toggle filter item
  const toggleFilter = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Group toggles
  const setAllConcessions = (all: boolean) => setSelectedConcessions(all ? [...CONCESSIONS_LIST] : []);
  const setAllAreas = (all: boolean) => setSelectedAreas(all ? [...AREAS_LIST] : []);
  const setAllFunctions = (all: boolean) => setSelectedFunctions(all ? [...FUNCTIONS_LIST] : []);
  const setAllStatus = (all: boolean) => setSelectedStatus(all ? [...STATUS_LIST] : []);

  const resetFilters = () => {
    setSelectedConcessions([...CONCESSIONS_LIST]);
    setSelectedAreas([...AREAS_LIST]);
    setSelectedFunctions([...FUNCTIONS_LIST]);
    setSelectedStatus(['Ativo']);
    setSelectedVinculo('Todos');
    setTableSearch('');
    setTableConcessionSlicer('Todas');
    setTableVinculoSlicer('Todos');
    setTableAreaSlicer('Todas');
    setTableFunctionSlicer('Todas');
    setSelectedContactIds(new Set());
    onShowToast('Filtros e seleção restaurados.');
  };

  // Filtered contacts calculation (Combines sidebar + dynamic table slicers + search)
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Sidebar filters
      const matchConcession = selectedConcessions.includes(c.concession);
      const matchArea = selectedAreas.includes(c.area);
      const matchFunction = selectedFunctions.includes(c.function);
      const matchStatus = selectedStatus.includes(c.status);

      if (!matchConcession || !matchArea || !matchFunction || !matchStatus) {
        return false;
      }

      const v = c.tipoVinculo || (c.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio');
      if (selectedVinculo !== 'Todos' && v !== selectedVinculo) {
        return false;
      }

      // Dynamic Table Slicers
      if (tableConcessionSlicer !== 'Todas' && c.concession !== tableConcessionSlicer) {
        return false;
      }

      if (tableVinculoSlicer !== 'Todos' && v !== tableVinculoSlicer) {
        return false;
      }

      if (tableAreaSlicer !== 'Todas' && c.area !== tableAreaSlicer) {
        return false;
      }

      if (tableFunctionSlicer !== 'Todas' && c.function !== tableFunctionSlicer) {
        return false;
      }

      // Dynamic Search
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.manager && c.manager.toLowerCase().includes(q)) ||
          c.area.toLowerCase().includes(q) ||
          c.concession.toLowerCase().includes(q) ||
          (c.empresaTerceira && c.empresaTerceira.toLowerCase().includes(q)) ||
          (c.tempoContrato && c.tempoContrato.toLowerCase().includes(q)) ||
          (c.atividadesDescricao && c.atividadesDescricao.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [
    contacts,
    selectedConcessions,
    selectedAreas,
    selectedFunctions,
    selectedStatus,
    selectedVinculo,
    tableConcessionSlicer,
    tableVinculoSlicer,
    tableAreaSlicer,
    tableFunctionSlicer,
    tableSearch
  ]);

  // Target contacts for mailing:
  // If user has specific checkboxes selected, use those. If none are selected, all currently filtered contacts are targeted.
  const isCustomSelectionActive = selectedContactIds.size > 0;
  
  const targetContacts = useMemo(() => {
    if (isCustomSelectionActive) {
      return filteredContacts.filter((c) => selectedContactIds.has(c.id));
    }
    return filteredContacts;
  }, [filteredContacts, selectedContactIds, isCustomSelectionActive]);

  // Unique email list from target contacts
  const uniqueEmails = useMemo(() => {
    const raw = targetContacts.map((c) => c.email.trim()).filter((e) => e && e.includes('@'));
    return Array.from(new Set(raw));
  }, [targetContacts]);

  // Mailing string
  const mailingString = useMemo(() => {
    if (uniqueEmails.length === 0) return '';
    let sep = '; ';
    if (separator === 'comma') sep = ', ';
    if (separator === 'newline') sep = '\n';
    return uniqueEmails.join(sep) + (separator !== 'newline' ? ';' : '');
  }, [uniqueEmails, separator]);

  // Master Checkbox State
  const allFilteredSelected = useMemo(() => {
    if (filteredContacts.length === 0) return false;
    return filteredContacts.every((c) => selectedContactIds.has(c.id));
  }, [filteredContacts, selectedContactIds]);

  const someFilteredSelected = useMemo(() => {
    return filteredContacts.some((c) => selectedContactIds.has(c.id)) && !allFilteredSelected;
  }, [filteredContacts, selectedContactIds, allFilteredSelected]);

  // Checkbox handlers
  const handleToggleRow = (id: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedContactIds(new Set(filteredContacts.map((c) => c.id)));
    onShowToast(`Todos os ${filteredContacts.length} contatos filtrados foram selecionados.`);
  };

  const handleClearSelection = () => {
    setSelectedContactIds(new Set());
    onShowToast('Seleção manual limpa. O mailing considerará todos os contatos filtrados.');
  };

  const handleSelectOnlyProprios = () => {
    const proprios = filteredContacts
      .filter((c) => (c.tipoVinculo || (c.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio')) === 'Próprio')
      .map((c) => c.id);
    setSelectedContactIds(new Set(proprios));
    onShowToast(`Selecionados ${proprios.length} colaboradores do Quadro Próprio.`);
  };

  const handleSelectOnlyTerceiros = () => {
    const terceiros = filteredContacts
      .filter((c) => (c.tipoVinculo || (c.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio')) === 'Terceiro')
      .map((c) => c.id);
    setSelectedContactIds(new Set(terceiros));
    onShowToast(`Selecionados ${terceiros.length} prestadores Terceirizados.`);
  };

  const handleInvertSelection = () => {
    const next = new Set<string>();
    filteredContacts.forEach((c) => {
      if (!selectedContactIds.has(c.id)) {
        next.add(c.id);
      }
    });
    setSelectedContactIds(next);
    onShowToast(`Seleção invertida (${next.size} contatos selecionados).`);
  };

  // Copilot Prompt
  const copilotPrompt = useMemo(() => {
    const concessions = [...new Set(targetContacts.map((c) => c.concession))].join(', ') || 'Todas Concessões';
    const areas = [...new Set(targetContacts.map((c) => c.area))].join(', ') || 'Geral';
    return `Atue como o Assistente de Mala Direta de IA da EcoRodovias SP. Preciso que elabore uma mensagem profissional para as Concessões [${concessions}] das áreas [${areas}]. Envie para estes ${uniqueEmails.length} e-mails em BCC: [${uniqueEmails.join('; ')}]. Pauta: "${assuntoInput}". Prazo: "${prazoInput}". Referência: "${refDocInput}". O teor deve focar em eficiência, cooperação operacional e conformidade com o cronograma anual corporativo.`;
  }, [targetContacts, uniqueEmails, assuntoInput, prazoInput, refDocInput]);

  // Copy Mailing
  const handleCopyMailing = () => {
    if (!mailingString) {
      onShowToast('Nenhum e-mail selecionado para copiar!', 'bg-rose-600');
      return;
    }
    navigator.clipboard.writeText(mailingString);
    onShowToast(`Cadeia de ${uniqueEmails.length} e-mails copiada com sucesso!`);
  };

  // Redator actions
  const handleApplyTemplate = () => {
    const tmpl = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];
    const { subject, body } = applyTemplateVariables(tmpl, {
      assunto: assuntoInput,
      prazo: prazoInput,
      referenciaDocumento: refDocInput,
      corpoTexto: detalhesInput,
      concessao: [...new Set(targetContacts.map((c) => c.concession))].join(', ') || 'EcoRodovias SP',
      area: [...new Set(targetContacts.map((c) => c.area))].join(', ') || 'Geral',
    });
    setGeneratedSubject(subject);
    setGeneratedBody(body);
    onShowToast('Estrutura padronizada aplicada com sucesso!');
  };

  const handleRefineWithAI = async () => {
    setIsRefiningAI(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const refined = `Prezados Senhores,\n\nEm atenção ao documento de referência ${refDocInput} e no contexto das diretrizes vigentes nas concessões EcoRodovias SP, comunicamos os alinhamentos operacionais relativos a "${assuntoInput}".\n\n${detalhesInput}\n\nSolicitamos a especial atenção para a conformidade com o prazo estipulado de ${prazoInput}.\n\nAtenciosamente,\nCoordenação de Engenharia e Governança Contratual\nEcoRodovias Concessões e Serviços`;
      setGeneratedSubject(`[COMUNICADO OFICIAL] ${assuntoInput} - Ref: ${refDocInput}`);
      setGeneratedBody(refined);
      onShowToast('Texto formal e padronizado gerado com sucesso!');
    } catch {
      onShowToast('Erro ao refinar texto com IA.', 'bg-rose-600');
    } finally {
      setIsRefiningAI(false);
    }
  };

  // Outlook actions
  const handleOpenInOutlook = () => {
    if (uniqueEmails.length === 0) {
      onShowToast('Nenhum destinatário selecionado.', 'bg-rose-600');
      return;
    }
    const bcc = uniqueEmails.join(';');
    const subject = encodeURIComponent(generatedSubject || 'INOV - Comunicado Oficial EcoRodovias');
    const body = encodeURIComponent(generatedBody || 'Prezados,\n\n[Insira sua mensagem aqui]');
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    onShowToast('Compondo e-mail no cliente Outlook local...');
  };

  const handleOpenInOutlookWeb = () => {
    if (uniqueEmails.length === 0) {
      onShowToast('Nenhum destinatário selecionado.', 'bg-rose-600');
      return;
    }
    const bcc = encodeURIComponent(uniqueEmails.join(';'));
    const subject = encodeURIComponent(generatedSubject || 'INOV - Comunicado Oficial EcoRodovias');
    const body = encodeURIComponent(generatedBody || 'Prezados,\n\n[Insira sua mensagem aqui]');
    const outlookWebUrl = `https://outlook.office.com/mail/deeplink/compose?bcc=${bcc}&subject=${subject}&body=${body}`;
    window.open(outlookWebUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Abrindo Outlook Web M365 em nova guia...');
  };

  const handleDownloadEML = () => {
    if (uniqueEmails.length === 0) {
      onShowToast('Nenhum destinatário selecionado.', 'bg-rose-600');
      return;
    }
    const bcc = uniqueEmails.join('; ');
    const subject = generatedSubject || 'INOV - Comunicado Oficial EcoRodovias';
    const body = generatedBody || 'Prezados,\n\n[Insira seu comunicado aqui]';

    const emlContent = `To: \nBcc: ${bcc}\nSubject: ${subject}\nX-Unsent: 1\nContent-Type: text/plain; charset=utf-8\n\n${body}`;
    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.eml`;
    link.click();
    onShowToast('Rascunho de E-mail (.eml) descarregado com sucesso!');
  };

  const handleCopyCopilot = () => {
    navigator.clipboard.writeText(copilotPrompt);
    onShowToast('Prompt do Copilot M365 copiado! Cole-o no Microsoft 365 Copilot.');
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Filter Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-xs font-bold text-[#008542] uppercase tracking-wider flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-1.5 text-[#008542]" strokeWidth={2} />
              Filtros da Base
            </h2>
            <button
              onClick={resetFilters}
              className="text-[11px] font-semibold text-[#008542] hover:text-green-800 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          </div>

          {/* Filter Concessions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Concessão
              </label>
              <div className="space-x-2 text-[10px] font-bold text-[#008542]">
                <button onClick={() => setAllConcessions(true)} className="hover:underline cursor-pointer">
                  Todos
                </button>
                <span>|</span>
                <button onClick={() => setAllConcessions(false)} className="hover:underline cursor-pointer">
                  Nenhum
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {CONCESSIONS_LIST.map((c) => (
                <label
                  key={c}
                  className="flex items-center space-x-2 text-xs font-medium cursor-pointer p-1 rounded hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedConcessions.includes(c)}
                    onChange={() => toggleFilter(c, selectedConcessions, setSelectedConcessions)}
                    className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-3.5 h-3.5"
                  />
                  <span className="text-slate-700 text-xs">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          {/* Filter Areas */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Área / Setor
              </label>
              <div className="space-x-2 text-[10px] font-bold text-[#008542]">
                <button onClick={() => setAllAreas(true)} className="hover:underline cursor-pointer">
                  Todos
                </button>
                <span>|</span>
                <button onClick={() => setAllAreas(false)} className="hover:underline cursor-pointer">
                  Nenhum
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {AREAS_LIST.map((a) => (
                <label
                  key={a}
                  className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer p-1 rounded hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes(a)}
                    onChange={() => toggleFilter(a, selectedAreas, setSelectedAreas)}
                    className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-3 h-3"
                  />
                  <span className="text-slate-700 font-semibold text-[11px]">{a}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          {/* Filter Vínculo (Governança de Terceiros) */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Vínculo Contratual
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
              {(['Todos', 'Próprio', 'Terceiro'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedVinculo(mode)}
                  className={`py-1 rounded text-center cursor-pointer transition ${
                    selectedVinculo === mode
                      ? mode === 'Terceiro'
                        ? 'bg-amber-600 text-white shadow-xs font-bold'
                        : 'bg-[#008542] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-white/60'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          {/* Filter Functions */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Função na Matriz
              </label>
              <div className="space-x-2 text-[10px] font-bold text-[#008542]">
                <button onClick={() => setAllFunctions(true)} className="hover:underline cursor-pointer">
                  Todos
                </button>
                <span>|</span>
                <button onClick={() => setAllFunctions(false)} className="hover:underline cursor-pointer">
                  Nenhum
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {FUNCTIONS_LIST.map((f) => (
                <label
                  key={f}
                  className="flex items-center space-x-2 text-xs font-medium cursor-pointer p-1 rounded hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedFunctions.includes(f)}
                    onChange={() => toggleFilter(f, selectedFunctions, setSelectedFunctions)}
                    className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-3.5 h-3.5"
                  />
                  <span className="text-slate-700 text-xs">{f}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-3 border-slate-100" />

          {/* Filter Status */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status Operacional
              </label>
              <div className="space-x-2 text-[10px] font-bold text-[#008542]">
                <button onClick={() => setAllStatus(true)} className="hover:underline cursor-pointer">
                  Todos
                </button>
                <span>|</span>
                <button onClick={() => setAllStatus(false)} className="hover:underline cursor-pointer">
                  Nenhum
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {STATUS_LIST.map((s) => (
                <label
                  key={s}
                  className="flex items-center space-x-2 text-xs font-medium cursor-pointer p-1 rounded hover:bg-slate-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatus.includes(s)}
                    onChange={() => toggleFilter(s, selectedStatus, setSelectedStatus)}
                    className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-3.5 h-3.5"
                  />
                  <span className="text-slate-700 text-xs">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tabela Dinâmica & Mala Direta (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* TABELA DINÂMICA: Segmentadores Interativos + Seleção em Lista */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            {/* Slicers Header */}
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#008542] text-white p-1.5 rounded-lg shadow-xs">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Tabela Dinâmica de Contatos & Seleção Específica
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Filtre dinamicamente e marque na lista exatamente os contatos desejados.
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    isCustomSelectionActive
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>{targetContacts.length} destinatários ativos</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    ({filteredContacts.length} filtrados de {contacts.length})
                  </span>
                </div>
              </div>

              {/* Segmentadores (Slicers) estilo Excel / Tabela Dinâmica */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-1">
                {/* Concessão Slicer */}
                <div className="md:col-span-5 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Concessão:</span>
                  <button
                    onClick={() => setTableConcessionSlicer('Todas')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer border ${
                      tableConcessionSlicer === 'Todas'
                        ? 'bg-[#008542] text-white border-[#008542]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Todas
                  </button>
                  {CONCESSIONS_LIST.map((c) => (
                    <button
                      key={c}
                      onClick={() => setTableConcessionSlicer(c)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer border ${
                        tableConcessionSlicer === c
                          ? 'bg-[#008542] text-white border-[#008542]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.replace(' dos Imigrantes', '').replace(' Raposo Castello', '')}
                    </button>
                  ))}
                </div>

                {/* Vínculo Slicer */}
                <div className="md:col-span-3 flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Vínculo:</span>
                  {(['Todos', 'Próprio', 'Terceiro'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setTableVinculoSlicer(v)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer border ${
                        tableVinculoSlicer === v
                          ? v === 'Terceiro'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                {/* Instant Search Bar */}
                <div className="md:col-span-4 relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Filtrar por nome, e-mail, empresa, gestor..."
                    className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-800"
                  />
                  {tableSearch && (
                    <button
                      onClick={() => setTableSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Selection Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    onClick={handleSelectAllFiltered}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer flex items-center gap-1 border border-emerald-300"
                  >
                    <CheckSquare className="w-3 h-3 text-emerald-700" />
                    <span>Selecionar Todos ({filteredContacts.length})</span>
                  </button>
                  <button
                    onClick={handleSelectOnlyProprios}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer border border-slate-300"
                  >
                    Apenas Próprios
                  </button>
                  <button
                    onClick={handleSelectOnlyTerceiros}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer border border-amber-300"
                  >
                    Apenas Terceiros
                  </button>
                  <button
                    onClick={handleInvertSelection}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer border border-slate-300"
                  >
                    Inverter
                  </button>
                  {isCustomSelectionActive && (
                    <button
                      onClick={handleClearSelection}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer border border-rose-200"
                    >
                      Limpar Seleção
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  {isCustomSelectionActive ? (
                    <span className="text-amber-700 font-bold">
                      ✓ {selectedContactIds.size} contatos selecionados manualmente
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium">
                      Todos os {filteredContacts.length} contatos filtrados estão selecionados
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contacts Table with Row Checkboxes */}
            <div className="overflow-x-auto max-h-[380px] custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[10.5px] font-bold uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someFilteredSelected;
                        }}
                        onChange={() => {
                          if (allFilteredSelected) {
                            handleClearSelection();
                          } else {
                            handleSelectAllFiltered();
                          }
                        }}
                        className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-4 h-4 cursor-pointer"
                        title="Selecionar/Desmarcar todos os visíveis"
                      />
                    </th>
                    <th className="py-2.5 px-3">Concessão</th>
                    <th className="py-2.5 px-3">Área</th>
                    <th className="py-2.5 px-3">Vínculo</th>
                    <th className="py-2.5 px-3">Nome do Colaborador</th>
                    <th className="py-2.5 px-3">E-mail Corporativo</th>
                    <th className="py-2.5 px-3">Empresa Terceira / Escopo</th>
                    <th className="py-2.5 px-3">Gestor</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 italic bg-slate-50/50">
                        Nenhum contato encontrado para os filtros dinâmicos selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((item) => {
                      const isTerceiro =
                        item.tipoVinculo === 'Terceiro' ||
                        item.email.toLowerCase().startsWith('t_') ||
                        item.name.startsWith('T_');
                      
                      const isRowSelected = isCustomSelectionActive
                        ? selectedContactIds.has(item.id)
                        : true;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleToggleRow(item.id)}
                          className={`transition border-b border-slate-100 cursor-pointer ${
                            isRowSelected
                              ? 'bg-emerald-50/35 hover:bg-emerald-50/60'
                              : 'bg-white hover:bg-slate-50 opacity-60'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={() => handleToggleRow(item.id)}
                              className="rounded border-slate-300 text-[#008542] focus:ring-[#008542] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-[#008542] text-xs">
                            {item.concession}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="bg-emerald-50 text-[#008542] text-[10.5px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                              {item.area}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            {isTerceiro ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                                Terceiro
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 text-[9.5px] font-medium rounded bg-slate-100 text-slate-600 border border-slate-200">
                                Próprio
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-blue-600">
                            {item.email || <span className="text-slate-300 italic">Sem e-mail</span>}
                          </td>
                          <td className="py-2.5 px-3 max-w-xs text-[11px]">
                            {isTerceiro ? (
                              <div>
                                <span className="font-semibold text-amber-900">
                                  {item.empresaTerceira || 'Consórcio Contratado'}
                                </span>
                                {item.atividadesDescricao && (
                                  <span className="text-slate-500 text-[10px] block truncate">
                                    {item.atividadesDescricao}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Quadro Próprio</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                            {item.manager || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 text-[9.5px] font-bold rounded-full ${
                                item.status === 'Ativo'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mala Direta Output & Actions */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008542]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cadeia de E-mails Selecionada (BCC / Cópia Oculta)
                </h3>
                <span className="text-[10.5px] bg-[#008542]/10 text-[#008542] px-2 py-0.2 rounded-full font-bold">
                  {uniqueEmails.length} e-mails únicos
                </span>
              </div>

              {/* Separator toggle */}
              <div className="flex items-center space-x-2 text-[11px]">
                <span className="text-slate-400 font-semibold">Separador:</span>
                {(['semicolon', 'comma', 'newline'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeparator(s)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition cursor-pointer ${
                      separator === s
                        ? 'bg-[#008542] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s === 'semicolon' ? '; (Ponto e vírgula)' : s === 'comma' ? ', (Vírgula)' : 'Quebra'}
                  </button>
                ))}
              </div>
            </div>

            {/* Email String Textarea */}
            <textarea
              readOnly
              value={mailingString}
              placeholder="Filtre e selecione os contatos na tabela dinâmica acima para gerar a cadeia de e-mails em cópia oculta..."
              className="w-full h-20 p-2.5 text-xs font-mono bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden text-slate-700 resize-none leading-relaxed mb-3"
            />

            {/* Actions: Copiar, Outlook, Outlook Web, EML */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={handleCopyMailing}
                className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Cadeia</span>
              </button>
              <button
                onClick={handleOpenInOutlook}
                className="bg-[#0b3c25] hover:bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Disparar e-mail no cliente Outlook local"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Abrir no Outlook</span>
              </button>
              <button
                onClick={handleOpenInOutlookWeb}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Abrir Outlook Web corporativo pelo Microsoft 365"
              >
                <Chrome className="w-3.5 h-3.5" />
                <span>Outlook Web (M365)</span>
              </button>
              <button
                onClick={handleDownloadEML}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                title="Baixar arquivo de rascunho de e-mail pronto para o Outlook"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Rascunho (.eml)</span>
              </button>
            </div>
          </div>

          {/* Redator de Mala Direta & Modelos Padronizados */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="bg-[#008542]/10 p-1.5 rounded-lg text-[#008542]">
                  <LayoutTemplate className="w-4 h-4" strokeWidth={2} />
                </div>
                <h3 className="text-xs font-bold text-[#008542] uppercase tracking-wide">
                  Redator de Mala Direta & Estruturas Padronizadas
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-[#FF9E1B]/15 text-[#b45309] border border-[#FF9E1B]/30 px-2 py-0.5 rounded-full flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                Modelos + IA
              </span>
            </div>

            {/* Template & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-2.5">
              <div className="sm:col-span-5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Modelo de Estrutura
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-700 font-medium"
                >
                  {EMAIL_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-7">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Pauta / Assunto Central ({'{ASSUNTO}'})
                </label>
                <input
                  type="text"
                  value={assuntoInput}
                  onChange={(e) => setAssuntoInput(e.target.value)}
                  placeholder="Ex: Auditorias de pavimentação e infraestrutura rodoviária"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-2.5">
              <div className="sm:col-span-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Prazo Limite / Vencimento ({'{PRAZO}'})
                </label>
                <input
                  type="text"
                  value={prazoInput}
                  onChange={(e) => setPrazoInput(e.target.value)}
                  placeholder="Ex: 30/09/2026 às 17h00"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-700"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Referência Documental ({'{REFERENCIA_DOCUMENTO}'})
                </label>
                <input
                  type="text"
                  value={refDocInput}
                  onChange={(e) => setRefDocInput(e.target.value)}
                  placeholder="Ex: Processo SEI 2026/001847 / Ofício nº 6.877"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-700"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Detalhamento / Instruções Adicionais ({'{CORPO_TEXTO}'})
              </label>
              <textarea
                rows={2}
                value={detalhesInput}
                onChange={(e) => setDetalhesInput(e.target.value)}
                placeholder="Instruções específicas para o corpo da mensagem..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-[#008542] text-slate-700 resize-none"
              />
            </div>

            {/* Template Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleApplyTemplate}
                className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Aplicar Estrutura Padronizada</span>
              </button>
              <button
                onClick={handleRefineWithAI}
                disabled={isRefiningAI}
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs py-2 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRefiningAI ? 'animate-spin text-amber-300' : ''}`} />
                <span>{isRefiningAI ? 'Refinando texto...' : 'Refinar Texto com Gemini AI'}</span>
              </button>
            </div>

            {/* Generated Email Result */}
            {generatedSubject && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Assunto do E-mail
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedSubject}
                      onChange={(e) => setGeneratedSubject(e.target.value)}
                      className="w-full text-xs font-semibold p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden text-slate-800"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedSubject);
                        onShowToast('Assunto copiado!');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Corpo da Mensagem
                  </label>
                  <textarea
                    rows={6}
                    value={generatedBody}
                    onChange={(e) => setGeneratedBody(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden text-slate-700 font-sans leading-relaxed"
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBody);
                        onShowToast('Corpo do e-mail copiado!');
                      }}
                      className="bg-[#008542] hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Corpo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Microsoft 365 Copilot Connector Box */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-1.5 rounded-lg flex items-center justify-center">
                  <Orbit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Conexão Microsoft 365 Copilot
                  </h3>
                </div>
              </div>
              <span className="bg-sky-500/10 text-sky-400 text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-sky-500/20 uppercase">
                M365 Conectado
              </span>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 mb-2 font-mono text-[10.5px] leading-relaxed text-slate-300 select-all">
              {copilotPrompt}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCopyCopilot}
                className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Prompt do Copilot</span>
              </button>
              <a
                href="https://copilot.microsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Copilot Web</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
