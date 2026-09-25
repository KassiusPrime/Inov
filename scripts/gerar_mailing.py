#!/usr/bin/env python3
"""Gera um rascunho de mala direta a partir de contatos e assunto."""

from pathlib import Path


if __name__ == '__main__':
    emails = [
        'bruna.s.andrade@ecovias.com.br',
        'daniele.rolim@ecovias.com.br'
    ]
    assunto = 'Comunicado Operacional EcoRodovias SP'
    corpo = 'Prezados,\n\nsegue o comunicado oficial...\n'

    output = f"To: \nBcc: {', '.join(emails)}\nSubject: {assunto}\n\n{corpo}"
    Path('saida_mailing.txt').write_text(output, encoding='utf-8')
    print('Arquivo gerado: saida_mailing.txt')
