#!/usr/bin/env python3
"""Extrai contatos e textos de documentos simples em lote."""

import re
from pathlib import Path


def extrair_texto_arquivo(path: Path) -> str:
    try:
        return path.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        return path.read_text(encoding='latin-1', errors='ignore')


def extrair_contatos(texto: str):
    emails = re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', texto)
    return sorted(set(emails))


if __name__ == '__main__':
    for arquivo in sorted(Path('.').glob('*')):
        if arquivo.is_file() and arquivo.suffix.lower() in {'.txt', '.csv', '.log'}:
            texto = extrair_texto_arquivo(arquivo)
            contatos = extrair_contatos(texto)
            print(f'Arquivo: {arquivo.name}')
            print('Contatos:', ', '.join(contatos) if contatos else 'Nenhum')
            print('-' * 40)
