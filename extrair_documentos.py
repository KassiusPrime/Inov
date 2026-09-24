#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SISTEMA INOV - Extrator de Contatos de Documentos Locais
Lê arquivos (TXT, CSV, XLSX, DOCX, PDF) e extrai e-mails, nomes, áreas e funções.
"""

import os
import re
import csv
import sys
import json
from pathlib import Path

RECOGNIZED_AREAS = ['GEN', 'GAU', 'CSU', 'RH', 'AJL', 'DTC', 'COM', 'DAM', 'DS']
CONCESSIONS_MAP = {
    'imigrantes': 'Imigrantes',
    'ecovias': 'Imigrantes',
    'leste paulista': 'Leste Paulista',
    'ecopistas': 'Leste Paulista',
    'econoroeste': 'Econoroeste',
    'noroeste': 'Econoroeste',
    'raposo': 'Raposo Castello',
    'castello': 'Raposo Castello'
}

EMAIL_REGEX = re.compile(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})')

def extract_text_from_file(file_path):
    ext = file_path.suffix.lower()
    text = ""
    try:
        if ext in ['.txt', '.csv', '.tsv', '.eml', '.json']:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
        elif ext in ['.xlsx', '.xls']:
            try:
                import openpyxl
                wb = openpyxl.load_workbook(file_path, data_only=True)
                for sheet in wb.sheetnames:
                    ws = wb[sheet]
                    for row in ws.iter_rows(values_only=True):
                        row_vals = [str(c) for c in row if c is not None]
                        text += " ; ".join(row_vals) + "\n"
            except Exception as e:
                with open(file_path, 'r', encoding='latin1', errors='ignore') as f:
                    text = f.read()
        elif ext == '.docx':
            try:
                import docx
                doc = docx.Document(file_path)
                text = "\n".join([p.text for p in doc.paragraphs])
            except Exception:
                with open(file_path, 'r', encoding='latin1', errors='ignore') as f:
                    text = f.read()
        elif ext == '.pdf':
            try:
                import pypdf
                reader = pypdf.PdfReader(str(file_path))
                for page in reader.pages:
                    text += page.extract_text() or ""
            except Exception:
                with open(file_path, 'r', encoding='latin1', errors='ignore') as f:
                    text = f.read()
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as err:
        print(f"Aviso ao ler {file_path}: {err}", file=sys.stderr)
    return text

def parse_contacts_from_text(text, default_concession="Imigrantes"):
    found_contacts = []
    seen_emails = set()
    lines = text.splitlines()

    # Identificar concessão no texto global
    lower_all = text.lower()
    for kw, conc_name in CONCESSIONS_MAP.items():
        if kw in lower_all:
            default_concession = conc_name
            break

    for line in lines:
        matches = EMAIL_REGEX.findall(line)
        for email in matches:
            clean_email = email.strip()
            if clean_email.lower() in seen_emails:
                continue
            seen_emails.add(clean_email.lower())

            # Nome aproximado
            name = clean_email.split('@')[0].replace('.', ' ').replace('_', ' ').title()

            # Área aproximada
            area = "GEN"
            for a in RECOGNIZED_AREAS:
                if re.search(r'\b' + re.escape(a) + r'\b', line, re.I):
                    area = a
                    break

            # Concessão
            concession = default_concession
            for kw, conc_name in CONCESSIONS_MAP.items():
                if kw in line.lower() or kw in clean_email.lower():
                    concession = conc_name
                    break

            found_contacts.append({
                "concessao": concession,
                "area": area,
                "funcao": "Ponto Focal",
                "nome": name,
                "email": clean_email,
                "status": "Ativo"
            })

    return found_contacts

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 extrair_documentos.py <caminho_arquivo_ou_pasta> [saida.csv]")
        return

    target_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("contatos_extraidos.csv")

    all_contacts = []
    if target_path.is_file():
        txt = extract_text_from_file(target_path)
        all_contacts.extend(parse_contacts_from_text(txt))
    elif target_path.is_dir():
        for file in target_path.rglob("*"):
            if file.is_file() and not file.name.startswith("."):
                txt = extract_text_from_file(file)
                all_contacts.extend(parse_contacts_from_text(txt))

    print(f"Total de contatos únicos extraídos: {len(all_contacts)}")

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["concessao", "area", "funcao", "nome", "email", "status"], delimiter=';')
        writer.writeheader()
        writer.writerows(all_contacts)

    print(f"Arquivo gerado com sucesso: {output_path}")

if __name__ == "__main__":
    main()
