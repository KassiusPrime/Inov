import React, { useState, useRef } from 'react';
import {
  FileUp,
  UploadCloud,
  Sparkles,
  Zap,
  CheckSquare,
  FileSpreadsheet,
  AlertCircle,
  FileCheck,
  Trash2,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { BatchContactItem, Contact } from '../types/inov';
import { readFileAsText, parseContactsFromText, fixMojibakeAndCleanText } from '../services/fileParser';

interface ImportacaoLoteProps {
  onIntegrateBatch: (newContacts: BatchContactItem[], formulatedMail?: { subject: string; body: string }) => void;
  onShowToast: (msg: string, bgColor?: string) => void;
}

export const ImportacaoLote: React.FC<ImportacaoLoteProps> = ({
  onIntegrateBatch,
  onShowToast,
}) => {
  const [rawText, setRawText] = useState('');
  const [formulateTogether, setFormulateTogether] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedBatch, setImportedBatch] = useState<BatchContactItem[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File drop/selection handler
  const handleProcessFile = async (file: File) => {
    try {
      setUploadedFileName(file.name);
      onShowToast(`Lendo arquivo ${file.name}...`);
      const content = await readFileAsText(file);
      setRawText(content);
      onShowToast(`Arquivo ${file.name} lido com sucesso! Clique em 'Processar e Formular'.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      onShowToast(`Erro ao ler arquivo: ${msg}`, 'bg-rose-600');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  // Process and Extract
  const handleProcessBatch = async () => {
    if (!rawText.trim()) {
      onShowToast('Insira ou carregue um arquivo primeiro!', 'bg-rose-600');
      return;
    }

    setIsProcessing(true);
    try {
      // Higieniza automaticamente o texto eliminando caracteres estranhos e mojibake de enconding
      const cleanInput = fixMojibakeAndCleanText(rawText);
      setRawText(cleanInput);

      // Delay rápido de feedback
      await new Promise((r) => setTimeout(r, 350));
      const extracted = parseContactsFromText(cleanInput);

      if (extracted.length === 0) {
        onShowToast('Nenhum e-mail corporativo válido foi detectado no texto fornecido.', 'bg-rose-600');
        setIsProcessing(false);
        return;
      }

      setImportedBatch(extracted);

      if (formulateTogether) {
        onShowToast(`Identificados ${extracted.length} contatos sem caracteres estranhos e formulado comunicado oficial!`);
      } else {
        onShowToast(`Identificados ${extracted.length} contatos higienizados no documento!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      onShowToast(`Erro no processamento: ${msg}`, 'bg-rose-600');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSanitize = () => {
    if (!rawText.trim()) {
      onShowToast('Cole algum texto primeiro para higienizar!', 'bg-amber-600');
      return;
    }
    const cleaned = fixMojibakeAndCleanText(rawText);
    setRawText(cleaned);
    onShowToast('Texto higienizado com sucesso: caracteres estranhos, BOM e mojibake removidos!');
  };

  const handleDiscardBatch = () => {
    setImportedBatch([]);
    setRawText('');
    setUploadedFileName(null);
    onShowToast('Lote descartado com sucesso!', 'bg-rose-600');
  };

  const handleApproveBatch = () => {
    if (importedBatch.length === 0) return;

    let formulatedMail: { subject: string; body: string } | undefined;
    if (formulateTogether) {
      const concessions = [...new Set(importedBatch.map((c) => c.concession))].join(', ');
      const areas = [...new Set(importedBatch.map((c) => c.area))].join(', ');
      formulatedMail = {
        subject: `[INOV / ${concessions}] Comunicado Oficial Referente ao Documento ${uploadedFileName || 'Processado'}`,
        body: `Prezados pontos focais e integrantes (${areas} — ${concessions}),\n\nEncaminhamos a presente comunicação referente ao documento corporativo analisado e incorporado à base.\n\nTotal de destinatários integrados: ${importedBatch.length}\nData de Registro: ${new Date().toLocaleDateString('pt-BR')}\n\nAtenciosamente,\nSistema INOV — EcoRodovias SP`,
      };
    }

    onIntegrateBatch(importedBatch, formulatedMail);
    onShowToast(`Sucesso! ${importedBatch.length} registros integrados à base tbContatos.`);
    setImportedBatch([]);
    setRawText('');
    setUploadedFileName(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload and Configuration Container */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-lg font-bold text-[#008542] mb-1.5 flex items-center">
          <FileUp className="w-5 h-5 mr-2" strokeWidth={2} />
          Carga e Parser Automático em Lote (Documentos)
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Arraste arquivos com tabelas de contatos ou relatórios operacionais brutos (.xlsx, .xls, .csv, .txt, .docx, .pdf, .eml).
          O motor universal lerá o documento para cadastrar os contatos e formular a mala direta correspondente de uma vez só!
        </p>

        {/* Drag & Drop Box */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer relative mb-5 ${
            isDragOver
              ? 'border-[#008542] bg-emerald-50/40'
              : 'border-slate-300 hover:border-[#008542] hover:bg-emerald-50/20'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.txt,.xlsx,.xls,.tsv,.json,.docx,.pdf,.eml"
            onChange={handleFileInputChange}
          />
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-slate-100 p-3.5 rounded-full text-slate-500">
              <UploadCloud className="w-9 h-9 text-[#008542]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Arraste e solte o seu arquivo ou relatório aqui, ou{' '}
                <span className="text-[#008542] hover:underline font-bold">
                  procure no computador
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Formatos suportados: .XLSX, .XLS, .CSV, .TXT, .DOCX, .PDF, .EML ou relatórios corporativos
              </p>
              {uploadedFileName && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Arquivo Carregado: {uploadedFileName}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Raw Text Fallback */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ou cole os dados em massa em formato texto / CSV:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Filtro Anti-Caracteres Estranhos Ativo
              </span>
              <button
                type="button"
                onClick={handleManualSanitize}
                className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md border border-slate-300 font-semibold cursor-pointer transition flex items-center gap-1"
                title="Limpar caracteres estranhos e decodificar acentuação"
              >
                <Sparkles className="w-3 h-3 text-[#FF9E1B]" />
                Higienizar Texto
              </button>
            </div>
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Exemplo de dados:&#10;Bruna Andrade | GEN | Ponto Focal | Imigrantes | Bruna.S.Andrade@ecovias.com.br | Wagner da Silva&#10;Wagner da Silva | GEN | Integrante | Imigrantes | Wagner.Silva@ecovias.com.br | Wagner da Silva"
            className="w-full h-32 p-3 text-xs font-mono border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#008542] text-slate-700 resize-none leading-relaxed"
          />
        </div>

        {/* Toggle: Formular Mala Direta de Uma Vez Só */}
        <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-[#008542]" />
            <div>
              <span className="text-xs font-bold text-[#008542] block">
                Formular Mala Direta de Uma Vez Só
              </span>
              <span className="text-[11px] text-slate-500">
                Ao ativar, o motor analisará o documento para identificar a pauta principal e preparar o e-mail automaticamente.
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formulateTogether}
              onChange={(e) => setFormulateTogether(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008542]" />
          </label>
        </div>

        {/* Process button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleProcessBatch}
            disabled={isProcessing}
            className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isProcessing ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isProcessing ? 'Processando Documento...' : 'Processar e Formular com Motor Inov'}</span>
          </button>
        </div>
      </div>

      {/* Review and Approval Table */}
      {importedBatch.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden animate-in fade-in">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-emerald-600" />
                Contatos Identificados para Integração ({importedBatch.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verifique os dados interpretados antes de salvar definitivamente na base tbContatos.
              </p>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={handleDiscardBatch}
                className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Descartar Tudo
              </button>
              <button
                onClick={handleApproveBatch}
                className="bg-[#008542] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Aprovar e Integrar Registros ({importedBatch.length})</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-2.5 px-4">Concessão</th>
                  <th className="py-2.5 px-4">Área</th>
                  <th className="py-2.5 px-4">Vínculo</th>
                  <th className="py-2.5 px-4">Nome</th>
                  <th className="py-2.5 px-4">E-mail</th>
                  <th className="py-2.5 px-4">Empresa / Terceiro</th>
                  <th className="py-2.5 px-4">Contrato / Atividade</th>
                  <th className="py-2.5 px-4">Gestor</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {importedBatch.map((item, idx) => {
                  const isTerceiro =
                    item.tipoVinculo === 'Terceiro' ||
                    item.email.toLowerCase().startsWith('t_') ||
                    item.name.startsWith('T_');

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition border-b border-slate-100">
                      <td className="py-2.5 px-4 font-semibold text-[#008542]">{item.concession}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-emerald-50 text-[#008542] text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                          {item.area}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {isTerceiro ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            Terceiro
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Próprio
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-2.5 px-4 text-blue-600 font-mono text-[11px]">{item.email}</td>
                      <td className="py-2.5 px-4">
                        {isTerceiro ? (
                          <span className="font-semibold text-amber-900 text-[11px]">
                            {item.empresaTerceira || 'Consórcio Contratado'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Quadro Próprio</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 max-w-xs">
                        {isTerceiro ? (
                          <div className="text-[11px] text-slate-600">
                            <span className="font-medium text-amber-800">{item.tempoContrato || '12 meses restantes'}</span>
                            <span className="text-slate-400"> • </span>
                            <span className="text-slate-500">{item.atividadesDescricao || 'Serviços operacionais'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">{item.observation || '-'}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{item.manager || '-'}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
