/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

const VALID_TABS: InovTab[] = [
  'consulta',
  'lote',
  'base',
  'dashboard',
  'powerbi',
  'controladoria',
  'artefatos',
];

function loadInitialContacts(): Contact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Migração de versão anterior
    const v1 = localStorage.getItem('inov_tb_contatos_v1');
    if (v1) {
      const parsedV1 = JSON.parse(v1);
      if (Array.isArray(parsedV1) && parsedV1.length > 0) {
        const initialMap = new Map(INITIAL_CONTACTS.map((c) => [c.id, c]));
        return parsedV1.map((item: Contact) => {
          const rich = initialMap.get(item.id);
          if (rich) return { ...item, ...rich };
          const isTerceiro =
            item.email.toLowerCase().startsWith('t_') || item.name.startsWith('T_');
          return {
            ...item,
            tipoVinculo: isTerceiro ? 'Terceiro' : 'Próprio',
            empresaTerceira: isTerceiro ? 'Consórcio Conserva SP' : undefined,
            tempoContrato: isTerceiro ? '12 meses restantes' : undefined,
            atividadesDescricao: isTerceiro
              ? 'Apoio técnico e operacional em campo'
              : undefined,
          };
        });
      }
    }
  } catch {
    // Fallback silencioso
  }
  return INITIAL_CONTACTS;
}

function loadInitialTab(): InovTab {
  try {
    const saved = localStorage.getItem(TAB_STORAGE_KEY);
    if (saved && VALID_TABS.includes(saved as InovTab)) {
      return saved as InovTab;
    }
  } catch {
    // ignore
  }
  return 'consulta';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<InovTab>(loadInitialTab);
  const [contacts, setContacts] = useState<Contact[]>(loadInitialContacts);
  const [toast, setToast] = useState<{ message: string; bgColor?: string } | null>(null);

  // Persistência da base de contatos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch {
      // Quota exceeded — usuário deve limpar dados antigos
    }
  }, [contacts]);

  // Persistência da aba ativa
  useEffect(() => {
    try {
      localStorage.setItem(TAB_STORAGE_KEY, activeTab);
    } catch {
      // ignore
    }
  }, [activeTab]);

  const showToast = useCallback((message: string, bgColor?: string) => {
    setToast({ message, bgColor });
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddContact = useCallback((newContact: Contact) => {
    setContacts((prev) => [newContact, ...prev]);
  }, []);

  const handleUpdateContact = useCallback((updated: Contact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const handleDeleteContact = useCallback((id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleIntegrateBatch = useCallback(
    (newBatch: BatchContactItem[], _formulatedMail?: { subject: string; body: string }) => {
      let nextNum =
        contacts.length > 0
          ? Math.max(...contacts.map((c) => parseInt(c.id.replace(/\D/g, '') || '0', 10))) + 1
          : 1;

      const formatted: Contact[] = newBatch.map((item) => {
        const id = `GCC${nextNum.toString().padStart(4, '0')}`;
        nextNum++;
        const isTerceiro =
          item.tipoVinculo === 'Terceiro' ||
          item.email.toLowerCase().startsWith('t_') ||
          item.name.startsWith('T_');
        return {
          id,
          concession: item.concession,
          area: item.area,
          function: item.function,
          name: item.name,
          email: item.email,
          manager: item.manager,
          observation: item.observation,
          status: item.status,
          tipoVinculo: (item.tipoVinculo as any) || (isTerceiro ? 'Terceiro' : 'Próprio'),
          empresaTerceira:
            item.empresaTerceira || (isTerceiro ? 'Consórcio Contratado' : undefined),
          tempoContrato:
            item.tempoContrato || (isTerceiro ? '12 meses restantes' : undefined),
          atividadesDescricao:
            item.atividadesDescricao ||
            (isTerceiro ? 'Prestação de serviços operacionais' : undefined),
        };
      });

      setContacts((prev) => [...formatted, ...prev]);
      setActiveTab('consulta');
      showToast(`${formatted.length} contato(s) integrados com sucesso na base oficial.`);
    },
    [contacts.length, showToast]
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-[#FF9E1B]/30 selection:text-slate-900">
      <InovHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalContacts={contacts.length}
      />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5"
        >
          <div
            className={`${
              toast.bgColor || 'bg-slate-900'
            } text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-semibold max-w-md border border-white/10`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-white/70 hover:text-white cursor-pointer ml-auto p-0.5 rounded hover:bg-white/10"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full p-2 sm:p-4 md:p-6">
        {activeTab === 'consulta' && (
          <CentralMensagens contacts={contacts} onShowToast={showToast} />
        )}
        {activeTab === 'lote' && (
          <ImportacaoLote onIntegrateBatch={handleIntegrateBatch} onShowToast={showToast} />
        )}
        {activeTab === 'base' && (
          <RepositorioContatos
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
            onShowToast={showToast}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardAuditoria
            contacts={contacts}
            onSelectDataHealthFilter={() => setActiveTab('base')}
            onShowToast={showToast}
          />
        )}
        {activeTab === 'powerbi' && <ModelagemPowerBI onShowToast={showToast} />}
        {activeTab === 'controladoria' && <ControladoriaDigital onShowToast={showToast} />}
        {activeTab === 'artefatos' && <ArtefatosProjeto onShowToast={showToast} />}
      </main>
    </div>
  );
}
