#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SISTEMA INOV - Gerador de Mailing & Mensagem Padronizada
Filtra a base tbContatos_EcoRodovias_Oficial.csv por Área/Concessão e gera o arquivo .EML ou lista formatada para Outlook.
"""

import sys
import csv
import argparse
from pathlib import Path
from datetime import datetime

def load_contacts(csv_path):
    contacts = []
    with open(csv_path, 'r', encoding='utf-8-sig', errors='ignore') as f:
        # Detecta delimitador
        first_line = f.readline()
        delimiter = ';' if ';' in first_line else ','
        f.seek(0)
        reader = csv.DictReader(f, delimiter=delimiter)
        for row in reader:
            contacts.append({
                "id": row.get("ID") or row.get("\ufeffID") or "",
                "concessao": row.get("Concessão") or row.get("Concessao") or "",
                "area": row.get("Área") or row.get("Area") or "",
                "funcao": row.get("Função") or row.get("Funcao") or "",
                "nome": row.get("Nome") or "",
                "email": row.get("E-mail") or row.get("Email") or "",
                "gestor": row.get("Gestor") or "",
                "status": row.get("Status") or "Ativo"
            })
    return contacts

def build_eml(subject, body, bcc_emails, output_eml_path):
    eml_content = f"""From: Gestao Inov <comunicacao.inov@ecovias.com.br>
To: 
Bcc: {'; '.join(bcc_emails)}
Subject: {subject}
Date: {datetime.now().strftime('%a, %d %b %Y %H:%M:%S -0300')}
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit

{body}
"""
    with open(output_eml_path, 'w', encoding='utf-8') as f:
        f.write(eml_content)
    print(f"Arquivo EML gerado com sucesso: {output_eml_path}")

def main():
    parser = argparse.ArgumentParser(description="Inov Mailing Generator")
    parser.add_argument("--concessao", help="Filtrar por Concessão (ex: Imigrantes, 'Leste Paulista', Econoroeste, 'Raposo Castello')")
    parser.add_argument("--area", help="Filtrar por Área (ex: GEN, GAU, CSU, RH, AJL, DTC)")
    parser.add_argument("--funcao", help="Filtrar por Função (ex: 'Ponto Focal')")
    parser.add_argument("--template", choices=["comunicado", "cobranca", "convocacao", "solicitacao"], default="comunicado", help="Modelo de estrutura de e-mail")
    parser.add_argument("--assunto", default="Comunicado Operacional", help="Assunto / Pauta")
    parser.add_argument("--prazo", default="5 dias úteis", help="Prazo Limite")
    parser.add_argument("--ref", default="Processo SEI / Demanda Interna", help="Referência Documental")
    parser.add_argument("--eml", help="Caminho do arquivo .eml para salvar")

    args = parser.parse_args()

    base_csv = Path(__file__).parent.parent / "data" / "tbContatos_EcoRodovias_Oficial.csv"
    if not base_csv.exists():
        print(f"Base de dados não encontrada em {base_csv}", file=sys.stderr)
        return

    contacts = load_contacts(base_csv)

    # Filtragem
    filtered = contacts
    if args.concessao:
        filtered = [c for c in filtered if args.concessao.lower() in c["concessao"].lower()]
    if args.area:
        filtered = [c for c in filtered if args.area.lower() in c["area"].lower()]
    if args.funcao:
        filtered = [c for c in filtered if args.funcao.lower() in c["funcao"].lower()]

    active_contacts = [c for c in filtered if c["status"].lower() == "ativo" and c["email"]]
    unique_emails = list(dict.fromkeys([c["email"] for c in active_contacts]))

    print(f"\n--- INOV: MAILING GERADO ---")
    print(f"Total de destinatários únicos: {len(unique_emails)}")
    print(f"Cadeia para Outlook (BCC):\n{'; '.join(unique_emails)}\n")

    concessao_str = args.concessao or "Todas as Concessões"
    area_str = args.area or "Todas as Áreas"
    subject = f"[INOV / {concessao_str}] {args.assunto} — Área {area_str}"
    body = f"""Prezada equipe ({area_str} — {concessao_str}),

Comunicamos as seguintes diretrizes operacionais referente à pauta '{args.assunto}':

• Referência Documental: {args.ref}
• Prazo Limite: {args.prazo}
• Data de Emissão: {datetime.now().strftime('%d/%m/%Y')}

Solicitamos que todos os pontos focais e integrantes acompanhem os desdobramentos.

Atenciosamente,
Coordenação de Governança & Comunicações Operacionais
EcoRodovias SP"""

    if args.eml:
        build_eml(subject, body, unique_emails, args.eml)

if __name__ == "__main__":
    main()
