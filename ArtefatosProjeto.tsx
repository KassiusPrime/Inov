import React, { useState } from 'react';
import {
  FileCode2,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FolderArchive,
  FileText,
  Terminal,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { PROJECT_ARTIFACTS, ProjectArtifact } from '../data/artifactsData';

interface ArtefatosProjetoProps {
  onShowToast: (msg: string, bgColor?: string) => void;
}

export const ArtefatosProjeto: React.FC<ArtefatosProjetoProps> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedArtifactId, setExpandedArtifactId] = useState<string | null>('script-validacao-contatos');

  const categories = ['Todas', 'Código / Script', 'Governança & A3', 'Dados & Templates', 'Manual Técnico'];

  const filteredArtifacts = selectedCategory === 'Todas'
    ? PROJECT_ARTIFACTS
    : PROJECT_ARTIFACTS.filter((a) => a.category === selectedCategory);

  const handleCopyContent = (content: string, name: string) => {
    navigator.clipboard.writeText(content);
    onShowToast(`Conteúdo de "${name}" copiado para a área de transferência!`);
  };

  const handleDownloadFile = (artifact: ProjectArtifact) => {
    const blob = new Blob([artifact.content], { type: artifact.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.fileName;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Arquivo ${artifact.fileName} descarregado com sucesso!`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Código / Script':
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'Governança & A3':
        return <Shield className="w-4 h-4 text-amber-600" />;
      case 'Dados & Templates':
        return <FileSpreadsheet className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="bg-emerald-50 p-3 rounded-2xl text-[#008542] border border-emerald-100">
              <FolderArchive className="w-7 h-7" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#008542]">
                Pacote de Artefatos & Repositório Técnico
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Modelos de governança, scripts de validação de contatos e terceiros, templates de contratos e manuais corporativos.
              </p>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#008542] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Artifacts list */}
        <div className="space-y-4">
          {filteredArtifacts.map((artifact) => {
            const isExpanded = expandedArtifactId === artifact.id;
            return (
              <div
                key={artifact.id}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
              >
                {/* Header item */}
                <div
                  className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer ${
                    isExpanded ? 'bg-slate-50 border-b border-slate-200' : 'hover:bg-slate-50/70'
                  }`}
                  onClick={() => setExpandedArtifactId(isExpanded ? null : artifact.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 mt-0.5 shrink-0">
                      {getCategoryIcon(artifact.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <h3 className="text-sm font-bold text-slate-900">{artifact.name}</h3>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                          {artifact.fileName}
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          {artifact.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{artifact.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyContent(artifact.content, artifact.name);
                      }}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 rounded-lg transition cursor-pointer"
                      title="Copiar conteúdo"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(artifact);
                      }}
                      className="flex items-center space-x-1.5 bg-[#008542] hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar</span>
                    </button>
                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Content Viewer Accordion */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs max-h-96 overflow-y-auto leading-relaxed border-t border-slate-200">
                    <pre className="whitespace-pre-wrap selection:bg-[#008542] selection:text-white">
                      {artifact.content}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
