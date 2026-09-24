import React, { useState, useMemo } from 'react';
import {
  Database,
  Plus,
  Download,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  ChevronDown,
  UserPlus,
  AlertTriangle,
  Building2,
  Clock,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { Contact, TipoVinculo } from '../types/inov';
import { RECOGNIZED_AREAS, RECOGNIZED_CONCESSIONS } from '../services/fileParser';

interface RepositorioContatosProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onShowToast: (msg: string, bgColor?: string) => void;
}

const CONCESSIONS_OPTIONS = ['Imigrantes', 'Leste Paulista', 'Econoroeste', 'Raposo Castello'];
const AREAS_OPTIONS = ['GEN', 'GAU', 'CSU', 'RH', 'AJL', 'DTC', 'COM', 'DAM', 'DS'];
const FUNCTIONS_OPTIONS = ['Ponto Focal', 'Integrante', 'Grupo de E-mail', 'Especialista'];
const STATUS_OPTIONS = ['Ativo', 'Férias', 'Licença', 'Substituição', 'Desligado'];

const SUGGESTED_COMPANIES = [
  'Consórcio Conserva SP',
  'Sonda IT Serviços',
  'TechRoad Engenharia',
  'Projetus Engenharia e Consultoria',
  'Consórcio Pavimentação Raposo',
  'Telcon ITS & Telecomunicações',
  'Sociedade de Advogados Associados',
  'Engenharia & Soluções Viárias'
];

export const RepositorioContatos: React.FC<RepositorioContatosProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vinculoFilter, setVinculoFilter] = useState<'Todos' | 'Próprio' | 'Terceiro'>('Todos');
  const [concessionFilter, setConcessionFilter] = useState<string>('Todas');
  const [areaFilter, setAreaFilter] = useState<string>('Todas');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState<{
    concession: string;
    area: string;
    function: string;
    name: string;
    email: string;
    manager: string;
    observation: string;
    status: string;
    tipoVinculo: TipoVinculo;
    empresaTerceira: string;
    tempoContrato: string;
    atividadesDescricao: string;
  }>({
    concession: 'Imigrantes',
    area: 'GEN',
    function: 'Ponto Focal',
    name: '',
    email: '',
    manager: '',
    observation: '',
    status: 'Ativo',
    tipoVinculo: 'Próprio',
    empresaTerceira: '',
    tempoContrato: '',
    atividadesDescricao: '',
  });

  // AI quick signature parser in modal
  const [rawSignatureText, setRawSignatureText] = useState('');
  const [isParsingSignature, setIsParsingSignature] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);

  // Counts & Stats
  const stats = useMemo(() => {
    const total = contacts.length;
    const proprios = contacts.filter((c) => (c.tipoVinculo || 'Próprio') === 'Próprio').length;
    const terceiros = contacts.filter((c) => c.tipoVinculo === 'Terceiro').length;
    const empresasSet = new Set(
      contacts
        .filter((c) => c.tipoVinculo === 'Terceiro' && c.empresaTerceira)
        .map((c) => c.empresaTerceira!.trim())
    );
    return {
      total,
      proprios,
      terceiros,
      empresasCount: empresasSet.size,
      empresasList: Array.from(empresasSet),
    };
  }, [contacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Vínculo filter
      const currentVinculo: TipoVinculo = c.tipoVinculo || (c.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio');
      if (vinculoFilter !== 'Todos' && currentVinculo !== vinculoFilter) {
        return false;
      }

      // Concession filter
      if (concessionFilter !== 'Todas' && c.concession !== concessionFilter) {
        return false;
      }

      // Area filter
      if (areaFilter !== 'Todas' && c.area !== areaFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.id.toLowerCase().includes(q) ||
          c.concession.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q) ||
          c.function.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.manager && c.manager.toLowerCase().includes(q)) ||
          (c.empresaTerceira && c.empresaTerceira.toLowerCase().includes(q)) ||
          (c.tempoContrato && c.tempoContrato.toLowerCase().includes(q)) ||
          (c.atividadesDescricao && c.atividadesDescricao.toLowerCase().includes(q)) ||
          (c.observation && c.observation.toLowerCase().includes(q)) ||
          c.status.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [contacts, vinculoFilter, concessionFilter, areaFilter, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      concession: 'Imigrantes',
      area: 'GEN',
      function: 'Ponto Focal',
      name: '',
      email: '',
      manager: '',
      observation: '',
      status: 'Ativo',
      tipoVinculo: 'Próprio',
      empresaTerceira: '',
      tempoContrato: '',
      atividadesDescricao: '',
    });
    setRawSignatureText('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: Contact) => {
    setEditingId(contact.id);
    const vinculo = contact.tipoVinculo || (contact.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio');
    setFormData({
      concession: contact.concession,
      area: contact.area,
      function: contact.function,
      name: contact.name,
      email: contact.email,
      manager: contact.manager || '',
      observation: contact.observation || '',
      status: contact.status,
      tipoVinculo: vinculo,
      empresaTerceira: contact.empresaTerceira || '',
      tempoContrato: contact.tempoContrato || '',
      atividadesDescricao: contact.atividadesDescricao || '',
    });
    setRawSignatureText('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Quick signature parser
  const handleParseSignature = () => {
    if (!rawSignatureText.trim()) {
      onShowToast('Insira uma assinatura ou texto para extrair!', 'bg-rose-600');
      return;
    }

    setIsParsingSignature(true);
    const emailMatch = rawSignatureText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const email = emailMatch ? emailMatch[1] : '';

    let candidateName = '';
    if (email) {
      candidateName = email
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }

    let candidateArea = 'GEN';
    for (const a of AREAS_OPTIONS) {
      if (new RegExp(`\\b${a}\\b`, 'i').test(rawSignatureText)) {
        candidateArea = a;
        break;
      }
    }

    let candidateConcession = 'Imigrantes';
    for (const rc of RECOGNIZED_CONCESSIONS) {
      if (rawSignatureText.toLowerCase().includes(rc.keyword)) {
        candidateConcession = rc.name;
        break;
      }
    }

    // Detect third party
    const isThird =
      email.toLowerCase().startsWith('t_') ||
      /terceir|prestador|contratad|fornecedor|consultoria/i.test(rawSignatureText);

    let empresa = '';
    if (isThird) {
      for (const comp of SUGGESTED_COMPANIES) {
        if (rawSignatureText.toLowerCase().includes(comp.toLowerCase().slice(0, 8))) {
          empresa = comp;
          break;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      name: candidateName || prev.name,
      email: email || prev.email,
      area: candidateArea,
      concession: candidateConcession,
      tipoVinculo: isThird ? 'Terceiro' : prev.tipoVinculo,
      empresaTerceira: empresa || prev.empresaTerceira,
    }));

    setIsParsingSignature(false);
    onShowToast('Dados da assinatura mapeados no formulário!');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast('Informe o nome do contato!', 'bg-rose-600');
      return;
    }

    if (formData.tipoVinculo === 'Terceiro' && !formData.empresaTerceira.trim()) {
      onShowToast('Para prestadores terceirizados, informe o nome da empresa!', 'bg-amber-600');
    }

    const payload: Contact = {
      id: editingId || '',
      concession: formData.concession,
      area: formData.area,
      function: formData.function,
      name: formData.name,
      email: formData.email,
      manager: formData.manager,
      observation: formData.observation,
      status: formData.status,
      tipoVinculo: formData.tipoVinculo,
      empresaTerceira: formData.tipoVinculo === 'Terceiro' ? formData.empresaTerceira : undefined,
      tempoContrato: formData.tipoVinculo === 'Terceiro' ? formData.tempoContrato : undefined,
      atividadesDescricao: formData.tipoVinculo === 'Terceiro' ? formData.atividadesDescricao : undefined,
    };

    if (editingId) {
      payload.id = editingId;
      onUpdateContact(payload);
      onShowToast(`Contato ${editingId} atualizado com sucesso!`);
    } else {
      const nextNum =
        contacts.length > 0
          ? Math.max(...contacts.map((c) => parseInt(c.id.replace(/\D/g, '') || '0', 10))) + 1
          : 1;
      const newId = `GCC${nextNum.toString().padStart(4, '0')}`;
      payload.id = newId;
      onAddContact(payload);
      onShowToast(`Novo contato ${newId} (${formData.tipoVinculo}) cadastrado com sucesso!`);
    }

    handleCloseModal();
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDeleteContact(deleteTarget.id);
      onShowToast(`Contato ${deleteTarget.id} removido da base.`, 'bg-rose-600');
      setDeleteTarget(null);
    }
  };

  // Export to CSV UTF-8 BOM with Third Party Fields
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Concessão',
      'Área',
      'Função',
      'Nome',
      'E-mail',
      'Gestor',
      'Tipo_Vinculo',
      'Empresa_Terceira',
      'Tempo_Contrato',
      'Escopo_Atividades',
      'Observação',
      'Status'
    ];

    const rows = contacts.map((c) => [
      c.id,
      c.concession,
      c.area,
      c.function,
      c.name,
      c.email,
      c.manager || '',
      c.tipoVinculo || 'Próprio',
      c.empresaTerceira || '',
      c.tempoContrato || '',
      c.atividadesDescricao || '',
      c.observation || '',
      c.status,
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((r) => r.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(';')),
    ].join('\n');

    // Prepend UTF-8 BOM for Excel Windows
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tbContatos_EcoRodovias_Governança_Terceiros.csv';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Arquivo tbContatos com Governança de Terceiros baixado com sucesso!');
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Statistical Cards / Diversification Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total na Base</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <span className="text-[11px] text-slate-500 font-medium">Contatos homologados</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#008542] flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quadro Próprio</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">{stats.proprios}</div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {((stats.proprios / (stats.total || 1)) * 100).toFixed(0)}% colaboradores CLT
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/30">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Terceiros & Prestadores</span>
            <div className="text-2xl font-black text-amber-900 mt-1">{stats.terceiros}</div>
            <span className="text-[11px] text-amber-600 font-medium">
              {((stats.terceiros / (stats.total || 1)) * 100).toFixed(0)}% força terceirizada
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Empresas Parceiras</span>
            <div className="text-2xl font-black text-indigo-900 mt-1">{stats.empresasCount}</div>
            <span className="text-[11px] text-indigo-600 font-medium">Contratadas ativas</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#008542] flex items-center">
              <Database className="w-5 h-5 mr-2 text-[#008542]" strokeWidth={2} />
              tbContatos — Governança Corporativa & Terceiros
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Base oficial com distinção rigorosa entre Quadro Próprio e Terceiros, empresas prestadoras, tempo de contrato e escopo das atividades.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Contato</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar CSV Completo</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise por nome, e-mail, empresa terceira, contrato ou atividade..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Vínculo Filter Toggle Buttons */}
          <div className="md:col-span-3 flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
            {(['Todos', 'Próprio', 'Terceiro'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setVinculoFilter(mode)}
                className={`flex-1 py-1.5 px-2 rounded-md transition text-center cursor-pointer ${
                  vinculoFilter === mode
                    ? mode === 'Terceiro'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-[#008542] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mode === 'Todos' ? `Todos (${contacts.length})` : mode === 'Próprio' ? `Próprios (${stats.proprios})` : `Terceiros (${stats.terceiros})`}
              </button>
            ))}
          </div>

          {/* Concession filter */}
          <div className="md:col-span-2">
            <select
              value={concessionFilter}
              onChange={(e) => setConcessionFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
            >
              <option value="Todas">Todas Concessões</option>
              {CONCESSIONS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Area filter */}
          <div className="md:col-span-2">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
            >
              <option value="Todas">Todas Áreas</option>
              {AREAS_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Concessão / Área</th>
                <th className="py-3 px-3">Vínculo</th>
                <th className="py-3 px-3">Nome / E-mail</th>
                <th className="py-3 px-3">Empresa Terceira / Contrato</th>
                <th className="py-3 px-3">O Que Faz / Escopo</th>
                <th className="py-3 px-3">Gestor</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 italic bg-slate-50/50">
                    Nenhum colaborador encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((item) => {
                  const isTerceiro =
                    item.tipoVinculo === 'Terceiro' ||
                    item.email.toLowerCase().startsWith('t_') ||
                    item.name.startsWith('T_');

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 font-bold">{item.id}</td>

                      {/* Concession & Area */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 text-[11px]">{item.concession}</div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="bg-emerald-50 text-[#008542] text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-100">
                            {item.area}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.function}</span>
                        </div>
                      </td>

                      {/* Vínculo (Próprio vs Terceiro) */}
                      <td className="py-3 px-3">
                        {isTerceiro ? (
                          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            <Briefcase className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Terceiro</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Próprio</span>
                          </span>
                        )}
                      </td>

                      {/* Name & Email */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 text-[12px]">{item.name}</div>
                        <div className="font-mono text-[11px] text-emerald-700 mt-0.5 truncate max-w-[200px]">
                          {item.email || <span className="text-slate-300 italic">Sem e-mail</span>}
                        </div>
                      </td>

                      {/* Empresa & Tempo Contrato */}
                      <td className="py-3 px-3 max-w-xs">
                        {isTerceiro ? (
                          <div>
                            <div className="font-bold text-slate-800 text-[11px] flex items-center space-x-1">
                              <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate">{item.empresaTerceira || 'Prestador Homologado'}</span>
                            </div>
                            {item.tempoContrato ? (
                              <div className="text-[10px] font-semibold text-amber-700 mt-0.5 flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{item.tempoContrato}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Vigência não informada</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Quadro Próprio (CLT)</span>
                        )}
                      </td>

                      {/* O que faz / Escopo */}
                      <td className="py-3 px-3 max-w-xs">
                        {isTerceiro ? (
                          <div
                            className="text-[11px] text-slate-600 line-clamp-2"
                            title={item.atividadesDescricao || item.observation || ''}
                          >
                            {item.atividadesDescricao || item.observation || '-'}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">
                            {item.observation || 'Funções corporativas da área'}
                          </div>
                        )}
                      </td>

                      {/* Manager */}
                      <td className="py-3 px-3 text-slate-600 text-[11px]">{item.manager || '-'}</td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            item.status === 'Ativo'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                            title="Editar colaborador"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Excluir da base"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="bg-[#008542] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                <span>
                  {editingId ? `Editar Colaborador (${editingId})` : 'Novo Registro na tbContatos'}
                </span>
              </h3>
              <button onClick={handleCloseModal} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick AI Signature Parser */}
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <details className="group">
                <summary className="list-none flex justify-between items-center font-bold text-xs text-[#008542] cursor-pointer select-none">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Preenchimento Automático por Assinatura / Texto (Opcional)</span>
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Cole uma assinatura ou identificação para preencher automaticamente:
                  </p>
                  <textarea
                    rows={2}
                    value={rawSignatureText}
                    onChange={(e) => setRawSignatureText(e.target.value)}
                    placeholder="Ex: T_Sofia Carvalho - Consórcio Conserva SP (T_Sofia.Carvalho@ecovias.com.br) - Vistoria de pista na Econoroeste, contrato 14 meses."
                    className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#008542] text-slate-700 resize-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleParseSignature}
                    disabled={isParsingSignature}
                    className="w-full bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mapear Campos e Classificar Terceiro</span>
                  </button>
                </div>
              </details>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveContact} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* VÍNCULO SELECTOR: PRÓPRIO VS TERCEIRO */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Diversificação Funcional (Vínculo) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                      formData.tipoVinculo === 'Próprio'
                        ? 'bg-emerald-50/80 border-[#008542] text-[#008542] font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoVinculo"
                      value="Próprio"
                      checked={formData.tipoVinculo === 'Próprio'}
                      onChange={() => setFormData({ ...formData, tipoVinculo: 'Próprio' })}
                      className="sr-only"
                    />
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                    <div>
                      <div className="text-xs">Quadro Próprio (CLT)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Colaborador EcoRodovias</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition ${
                      formData.tipoVinculo === 'Terceiro'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoVinculo"
                      value="Terceiro"
                      checked={formData.tipoVinculo === 'Terceiro'}
                      onChange={() => setFormData({ ...formData, tipoVinculo: 'Terceiro' })}
                      className="sr-only"
                    />
                    <Briefcase className="w-4 h-4 mr-2 text-amber-600" />
                    <div>
                      <div className="text-xs">Terceiro / Prestador</div>
                      <div className="text-[10px] text-slate-400 font-normal">Empresa parceira / Contratada</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* IF TERCEIRO: EXTRA MANDATORY FIELDS */}
              {formData.tipoVinculo === 'Terceiro' && (
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold pb-2 border-b border-amber-200">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Dados Contratuais da Empresa Terceirizada</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
                        Nome da Empresa Terceira *
                      </label>
                      <input
                        type="text"
                        list="empresasList"
                        value={formData.empresaTerceira}
                        onChange={(e) => setFormData({ ...formData, empresaTerceira: e.target.value })}
                        placeholder="Ex: Consórcio Conserva SP"
                        className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                        required={formData.tipoVinculo === 'Terceiro'}
                      />
                      <datalist id="empresasList">
                        {SUGGESTED_COMPANIES.map((comp) => (
                          <option key={comp} value={comp} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
                        Tempo de Contrato / Vigência *
                      </label>
                      <input
                        type="text"
                        value={formData.tempoContrato}
                        onChange={(e) => setFormData({ ...formData, tempoContrato: e.target.value })}
                        placeholder="Ex: 14 meses restantes (Vence 11/2027)"
                        className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-900 uppercase mb-1">
                      O Que Ele Faz / Escopo das Atividades *
                    </label>
                    <textarea
                      rows={2}
                      value={formData.atividadesDescricao}
                      onChange={(e) => setFormData({ ...formData, atividadesDescricao: e.target.value })}
                      placeholder="Descreva as atribuições: ex: Fiscalização de conservação de pista, laudos fotográficos e acompanhamento de obras viárias."
                      className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-amber-500 text-slate-800 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Concessão *
                  </label>
                  <select
                    value={formData.concession}
                    onChange={(e) => setFormData({ ...formData, concession: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542] bg-white font-medium"
                  >
                    {CONCESSIONS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Área / Setor *
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542] bg-white font-medium"
                  >
                    {AREAS_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Função *
                  </label>
                  <select
                    value={formData.function}
                    onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542] bg-white font-medium"
                  >
                    {FUNCTIONS_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Status Operacional *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542] bg-white font-medium"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do colaborador ou prestador"
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@ecovias.com.br"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                    Gestor Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    placeholder="Nome do gestor da área"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                  Observações Gerais
                </label>
                <input
                  type="text"
                  value={formData.observation}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                  placeholder="Anotações de auditoria ou ramal"
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#008542]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Excluir Registro da tbContatos</h3>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Tem certeza de que deseja remover permanentemente o registro de{' '}
              <strong className="text-slate-900">{deleteTarget.name}</strong> ({deleteTarget.id})? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
