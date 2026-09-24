import React, { useState, useEffect, useCallback } from 'react';
import { InovHeader } from './components/InovHeader';
import { CentralMensagens } from './components/CentralMensagens';
import { ImportacaoLote } from './components/ImportacaoLote';
import { RepositorioContatos } from './components/RepositorioContatos';
import { DashboardAuditoria } from './components/DashboardAuditoria';
import { ModelagemPowerBI } from './components/ModelagemPowerBI';
import { ControladoriaDigital } from './components/ControladoriaDigital';
import { ArtefatosProjeto } from './components/ArtefatosProjeto';
import { Contact, InovTab, BatchContactItem } from './types/inov';
import { INITIAL_CONTACTS } from './data/initialContacts';
import { X } from 'lucide-react';

const STORAGE_KEY = 'inov_tb_contatos_v2';
const TAB_STORAGE_KEY = 'inov_active_tab_v1';
const VALID_TABS: InovTab[] = ['consulta', 'lote', 'base', 'dashboard', 'powerbi', 'controladoria', 'artefatos'];

function loadInitialContacts(): Contact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const v1 = localStorage.getItem('inov_tb_contatos_v1');
    if (v1) {
      const parsed = JSON.parse(v1);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* fallback */ }
  return INITIAL_CONTACTS;
}

function loadInitialTab(): InovTab {
  try {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    if (saved && VALID_TABS.includes(saved as InovTab)) return saved as InovTab;
  } catch { /* fallback */ }
  return 'consulta';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<InovTab>(loadInitialTab);
  const [contacts, setContacts] = useState<Contact[]>(loadInitialContacts);
  const [toast, setToast] = useState<{ message: string; bgColor?: string } | null>(null);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch { /* ignore */ } }, [contacts]);
  useEffect(() => { try { localStorage.setItem(TAB_STORAGE_KEY, activeTab); } catch { /* ignore */ } }, [activeTab]);

  const showToast = useCallback((message: string, bgColor?: string) => {
    setToast({ message, bgColor });
    window.setTimeout(() => setToast(null), 4500);
  }, []);
  const handleAddContact = useCallback((contact: Contact) => setContacts((prev) => [contact, ...prev]), []);
  const handleUpdateContact = useCallback((contact: Contact) => setContacts((prev) => prev.map((c) => c.id === contact.id ? contact : c)), []);
  const handleDeleteContact = useCallback((id: string) => setContacts((prev) => prev.filter((c) => c.id !== id)), []);
  const handleIntegrateBatch = useCallback((batch: BatchContactItem[]) => {
    setContacts((prev) => {
      let next = prev.length ? Math.max(...prev.map((c) => parseInt(c.id.replace(/\D/g, '') || '0', 10))) + 1 : 1;
      const formatted = batch.map((item) => ({ ...item, id: `GCC${String(next++).padStart(4, '0')}`, tipoVinculo: item.tipoVinculo || (item.email.toLowerCase().startsWith('t_') ? 'Terceiro' : 'Próprio') } as Contact));
      return [...formatted, ...prev];
    });
    setActiveTab('consulta');
    showToast(`${batch.length} contato(s) integrados com sucesso na base oficial.`);
  }, [showToast]);

  return <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
    <InovHeader activeTab={activeTab} setActiveTab={setActiveTab} totalContacts={contacts.length} />
    {toast && <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50"><div className={`${toast.bgColor || 'bg-slate-900'} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold max-w-md`}><span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Fechar notificação"><X className="w-4 h-4" /></button></div></div>}
    <main className="flex-1 w-full p-2 sm:p-4 md:p-6">
      {activeTab === 'consulta' && <CentralMensagens contacts={contacts} onShowToast={showToast} />}
      {activeTab === 'lote' && <ImportacaoLote onIntegrateBatch={handleIntegrateBatch} onShowToast={showToast} />}
      {activeTab === 'base' && <RepositorioContatos contacts={contacts} onAddContact={handleAddContact} onUpdateContact={handleUpdateContact} onDeleteContact={handleDeleteContact} onShowToast={showToast} />}
      {activeTab === 'dashboard' && <DashboardAuditoria contacts={contacts} onSelectDataHealthFilter={() => setActiveTab('base')} onShowToast={showToast} />}
      {activeTab === 'powerbi' && <ModelagemPowerBI onShowToast={showToast} />}
      {activeTab === 'controladoria' && <ControladoriaDigital onShowToast={showToast} />}
      {activeTab === 'artefatos' && <ArtefatosProjeto onShowToast={showToast} />}
    </main>
  </div>;
}
