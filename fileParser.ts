import * as XLSX from 'xlsx';
import { BatchContactItem } from '../types/inov';

export const RECOGNIZED_AREAS = ['GEN', 'GAU', 'CSU', 'RH', 'AJL', 'DTC', 'COM', 'DAM', 'DS'];
export const RECOGNIZED_CONCESSIONS = [
  { keyword: 'imigrantes', name: 'Imigrantes' },
  { keyword: 'ecovias', name: 'Imigrantes' },
  { keyword: 'leste paulista', name: 'Leste Paulista' },
  { keyword: 'ecopistas', name: 'Leste Paulista' },
  { keyword: 'econoroeste', name: 'Econoroeste' },
  { keyword: 'noroeste', name: 'Econoroeste' },
  { keyword: 'raposo castello', name: 'Raposo Castello' },
  { keyword: 'raposo', name: 'Raposo Castello' },
  { keyword: 'castello', name: 'Raposo Castello' }
];

/**
 * Sanitiza texto removendo caracteres estranhos, corrigindo problemas de encoding (Mojibake UTF-8 / Windows-1252 / ISO-8859-1)
 * e limpando marcadores BOM e caracteres de controle indesejados.
 */
export function fixMojibakeAndCleanText(str: string): string {
  if (!str) return '';

  // 1. Remove Byte Order Mark (BOM) e caracteres de controle não-imprimíveis (mantém \r, \n e \t)
  let clean = str
    .replace(/^\uFEFF/, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');

  // 2. Correção sistemática de sequências duplamente codificadas (Mojibake comum de UTF-8 lido em Windows-1252)
  const mojibakeTable: [RegExp, string][] = [
    // Minúsculas acentuadas
    [/Ã¡/g, 'á'], [/Ã\xa0/g, 'à'], [/Ã /g, 'à'], [/Ã¢/g, 'â'], [/Ã£/g, 'ã'], [/Ã¤/g, 'ä'],
    [/Ã©/g, 'é'], [/Ã¨/g, 'è'], [/Ãª/g, 'ê'], [/Ã«/g, 'ë'],
    [/Ã­/g, 'í'], [/Ã¬/g, 'ì'], [/Ã®/g, 'î'], [/Ã¯/g, 'ï'],
    [/Ã³/g, 'ó'], [/Ã²/g, 'ò'], [/Ã´/g, 'ô'], [/Ãµ/g, 'õ'], [/Ã¶/g, 'ö'],
    [/Ãº/g, 'ú'], [/Ã¹/g, 'ù'], [/Ã»/g, 'û'], [/Ã¼/g, 'ü'],
    [/Ã§/g, 'ç'], [/Ã±/g, 'ñ'],
    // Maiúsculas acentuadas
    [/Ã/g, 'Á'], [/Ã€/g, 'À'], [/Ã‚/g, 'Â'], [/Ãƒ/g, 'Ã'], [/Ã„/g, 'Ä'],
    [/Ã‰/g, 'É'], [/Ãˆ/g, 'È'], [/ÃŠ/g, 'Ê'], [/Ã‹/g, 'Ë'],
    [/Ã/g, 'Í'], [/ÃŒ/g, 'Ì'], [/ÃŽ/g, 'Î'], [/Ã/g, 'Ï'],
    [/Ã“/g, 'Ó'], [/Ã’/g, 'Ò'], [/Ã”/g, 'Ô'], [/Ã•/g, 'Õ'], [/Ã–/g, 'Ö'],
    [/Ãš/g, 'Ú'], [/Ã™/g, 'Ù'], [/Ã›/g, 'Û'], [/Ãœ/g, 'Ü'],
    [/Ã‡/g, 'Ç'], [/Ã‘/g, 'Ñ'],
    // Símbolos ordinais e pontuação comum corrompida
    [/Âº/g, 'º'], [/Âª/g, 'ª'], [/Â°/g, '°'], [/Â /g, ' '],
    [/â€“/g, '–'], [/â€”/g, '—'], [/â€˜/g, '‘'], [/â€™/g, '’'],
    [/â€œ/g, '“'], [/â€/g, '”'], [/â€¢/g, '•'],
    // Caractere de substituição Unicode (quando ocorre erro de decodificação no browser)
    [/\uFFFD/g, '']
  ];

  for (const [pattern, replacement] of mojibakeTable) {
    clean = clean.replace(pattern, replacement);
  }

  // 3. Normalização Unicode NFC (canonical decomposition and composition)
  return clean.normalize('NFC').trim();
}

/**
 * Limpa um valor individual extraído (nome, gestor, observação), removendo aspas duplicadas e pontuações espúrias
 */
export function cleanFieldValue(val?: string): string {
  if (!val) return '';
  let res = fixMojibakeAndCleanText(val);
  // Remove aspas externas residuais de CSVs
  res = res.replace(/^["']+|["']+$/g, '');
  // Espaços múltiplos condensados em um
  res = res.replace(/\s+/g, ' ');
  return res.trim();
}

export async function readFileAsText(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // Planilhas Excel (.xlsx, .xls)
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    try {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array', codepage: 65001 });
      let textOutput = `--- PLANILHA: ${cleanFieldValue(file.name)} ---\n`;
      workbook.SheetNames.forEach((sheetName) => {
        textOutput += `\n[ABA: ${cleanFieldValue(sheetName)}]\n`;
        const sheet = workbook.Sheets[sheetName];
        const csvData = XLSX.utils.sheet_to_csv(sheet, { FS: ';' });
        textOutput += fixMojibakeAndCleanText(csvData) + '\n';
      });
      return fixMojibakeAndCleanText(textOutput);
    } catch (err) {
      throw new Error(`Erro ao ler planilha Excel: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Arquivos de texto, CSV, TSV, EML, JSON: decodificação inteligente de encoding
  const buffer = await file.arrayBuffer();
  let decodedText = '';

  // 1º Tenta decodificar como UTF-8 estrito
  try {
    const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
    decodedText = utf8Decoder.decode(buffer);
  } catch {
    // 2º Se falhar (comum em arquivos CSV gerados pelo Excel no Windows brasileiro), usa Windows-1252 / ANSI
    try {
      const win1252Decoder = new TextDecoder('windows-1252');
      decodedText = win1252Decoder.decode(buffer);
    } catch {
      // 3º Fallback para ISO-8859-1 (Latin1)
      const latinDecoder = new TextDecoder('iso-8859-1');
      decodedText = latinDecoder.decode(buffer);
    }
  }

  // Aplica filtro sanitizador contra caracteres estranhos residuais
  return fixMojibakeAndCleanText(decodedText);
}

export function parseContactsFromText(text: string, defaultConcession = 'Imigrantes'): BatchContactItem[] {
  const sanitizedText = fixMojibakeAndCleanText(text);
  const foundContacts: BatchContactItem[] = [];
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const lines = sanitizedText.split(/\r?\n/);
  const seenEmails = new Set<string>();

  // Global concession hint from entire document
  let docConcession = defaultConcession;
  const lowerAll = sanitizedText.toLowerCase();
  for (const rc of RECOGNIZED_CONCESSIONS) {
    if (lowerAll.includes(rc.keyword)) {
      docConcession = rc.name;
      break;
    }
  }

  lines.forEach((line) => {
    const trimmed = cleanFieldValue(line);
    if (!trimmed) return;

    const matches = trimmed.match(emailRegex);
    if (matches) {
      matches.forEach((rawEmail) => {
        const email = rawEmail.trim().toLowerCase();
        if (seenEmails.has(email)) return;
        seenEmails.add(email);

        // Derive candidate name
        let name = '';
        const parts = trimmed.split(/[;,\t|]/);
        if (parts.length > 1) {
          for (const p of parts) {
            const tp = cleanFieldValue(p);
            if (
              tp.length > 2 &&
              !tp.includes('@') &&
              !tp.includes('http') &&
              isNaN(Number(tp)) &&
              !RECOGNIZED_AREAS.includes(tp.toUpperCase())
            ) {
              name = tp;
              break;
            }
          }
        }

        if (!name) {
          const userPart = email.split('@')[0];
          name = userPart
            .replace(/[._-]/g, ' ')
            .split(' ')
            .filter((w) => w.length > 0)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }

        name = cleanFieldValue(name);

        // Identify Area
        let area = 'GEN';
        for (const a of RECOGNIZED_AREAS) {
          if (new RegExp(`\\b${a}\\b`, 'i').test(trimmed)) {
            area = a;
            break;
          }
        }

        // Identify Concession
        let concession = docConcession;
        for (const rc of RECOGNIZED_CONCESSIONS) {
          if (trimmed.toLowerCase().includes(rc.keyword)) {
            concession = rc.name;
            break;
          }
        }

        // Identify Function
        let func = 'Integrante';
        if (/ponto focal/i.test(trimmed)) func = 'Ponto Focal';
        else if (/grupo|caixa|departamento/i.test(trimmed)) func = 'Grupo de E-mail';
        else if (/especialista|coordenador/i.test(trimmed)) func = 'Especialista';

        // Check for Manager candidate
        let manager = '';
        if (parts.length >= 6) {
          const candidateMgr = cleanFieldValue(parts[parts.length - 2]);
          if (candidateMgr && candidateMgr.length > 3 && !candidateMgr.includes('@')) {
            manager = candidateMgr;
          }
        }

        // Third-party detection (diversificação)
        const isThirdParty =
          email.startsWith('t_') ||
          name.startsWith('T_') ||
          /terceir|prestador|contratad|fornecedor|consultoria|cons[oó]rcio/i.test(trimmed);

        let empresaTerceira: string | undefined;
        let tempoContrato: string | undefined;
        let atividadesDescricao: string | undefined;

        if (isThirdParty) {
          // Known company heuristics
          if (/sonda/i.test(trimmed)) empresaTerceira = 'Sonda IT Serviços';
          else if (/conserva/i.test(trimmed)) empresaTerceira = 'Consórcio Conserva SP';
          else if (/techroad/i.test(trimmed)) empresaTerceira = 'TechRoad Engenharia';
          else if (/projetus/i.test(trimmed)) empresaTerceira = 'Projetus Engenharia e Consultoria';
          else if (/pavimenta[cç][aã]o|raposo/i.test(trimmed)) empresaTerceira = 'Consórcio Pavimentação Raposo';
          else if (/telcon/i.test(trimmed)) empresaTerceira = 'Telcon ITS & Telecomunicações';
          else if (/advogad|sociedade/i.test(trimmed)) empresaTerceira = 'Sociedade de Advogados Associados';
          else empresaTerceira = 'Consórcio Contratado';

          // Contract duration heuristic
          const monthsMatch = trimmed.match(/(\d{1,2})\s*meses/i);
          if (monthsMatch) {
            tempoContrato = `${monthsMatch[1]} meses restantes`;
          } else {
            tempoContrato = '12 meses restantes';
          }

          // Activities heuristic
          if (/pista|conserva[cç][aã]o/i.test(trimmed)) atividadesDescricao = 'Vistoria e conservação de pista viária';
          else if (/pavimento|defletometria/i.test(trimmed)) atividadesDescricao = 'Inspeção e ensaios tecnológicos de pavimento';
          else if (/cftv|fibra|[oó]pt|its/i.test(trimmed)) atividadesDescricao = 'Manutenção de telecomunicações e CFTV';
          else if (/ouvidoria|sac|atendimento/i.test(trimmed)) atividadesDescricao = 'Atendimento de Ouvidoria e SAC ao usuário';
          else if (/obra|faixa|amplia[cç][aã]o/i.test(trimmed)) atividadesDescricao = 'Acompanhamento e fiscalização de obras viárias';
          else atividadesDescricao = 'Prestação de serviços operacionais homologados';
        }

        foundContacts.push({
          concession,
          area,
          function: func,
          name,
          email,
          manager: manager ? cleanFieldValue(manager) : '',
          observation: isThirdParty ? `Prestador Terceirizado (${empresaTerceira})` : 'Extraído automaticamente do documento',
          status: 'Ativo',
          tipoVinculo: isThirdParty ? 'Terceiro' : 'Próprio',
          empresaTerceira: cleanFieldValue(empresaTerceira),
          tempoContrato: cleanFieldValue(tempoContrato),
          atividadesDescricao: cleanFieldValue(atividadesDescricao),
        });
      });
    }
  });

  return foundContacts;
}
