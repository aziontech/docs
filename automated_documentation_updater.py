#!/usr/bin/env python3
"""
Script para automatizar as substituições de termos na documentação Azion.
Este script realiza substituições inteligentes baseadas no contexto.

Substituições:
- "domains" → "workloads"
- "error responses" → "custom pages"
- "origins" → "edge connector"
"""

import os
import re
import csv
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Set

class DocumentationUpdater:
    def __init__(self):
        # Mapeamento de termos - caso base (minúsculo)
        self.term_mappings = {
            "domains": "workloads",
            "error responses": "custom pages",
            "origins": "edge connector"
        }
        
        # Backup directory
        self.backup_dir = Path("/app/backup_documentation")
        self.backup_dir.mkdir(exist_ok=True)
        
        # Logs
        self.changes_log = []
        self.processed_files = set()
        
    def create_backup(self, file_path: str) -> str:
        """Cria backup do arquivo original"""
        file_path = Path(file_path)
        
        # Estrutura de backup mantendo a hierarquia
        relative_path = file_path.relative_to("/app/src/content")
        backup_path = self.backup_dir / relative_path
        
        # Cria os diretórios necessários
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Copia o arquivo
        shutil.copy2(file_path, backup_path)
        
        return str(backup_path)
    
    def restore_from_backup(self, original_path: str) -> bool:
        """Restaura arquivo do backup"""
        try:
            file_path = Path(original_path)
            relative_path = file_path.relative_to("/app/src/content")
            backup_path = self.backup_dir / relative_path
            
            if backup_path.exists():
                shutil.copy2(backup_path, file_path)
                return True
            return False
        except Exception as e:
            print(f"Erro ao restaurar backup de {original_path}: {e}")
            return False
    
    def get_proper_case(self, term: str, context: str) -> str:
        """Determina o caso apropriado baseado no contexto"""
        if context.startswith("title:"):
            # Título - Title Case
            return term.title()
        elif "meta_tags:" in context:
            # Meta tags - lowercase
            return term.lower()
        elif context.startswith("namespace:"):
            # Namespace - snake_case
            return term.lower().replace(" ", "_")
        elif context.startswith("permalink:"):
            # Permalink - kebab-case
            return term.lower().replace(" ", "-")
        elif re.match(r'^[A-Z]', context):
            # Início de sentença - capitalizado
            return term.capitalize()
        elif context.startswith("**") and context.endswith("**"):
            # Texto em negrito - title case
            return term.title()
        else:
            # Contexto normal - lowercase
            return term.lower()
    
    def replace_urls_and_paths(self, content: str) -> str:
        """Substitui URLs e caminhos específicos"""
        # URLs para domains
        content = re.sub(
            r'/documentacao/produtos/build/edge-application/domains/',
            '/documentacao/produtos/build/edge-application/workloads/',
            content
        )
        content = re.sub(
            r'/documentation/products/build/edge-application/domains/',
            '/documentation/products/build/edge-application/workloads/',
            content
        )
        
        # URLs para error-responses
        content = re.sub(
            r'/documentacao/produtos/build/edge-application/error-responses/',
            '/documentacao/produtos/build/edge-application/custom-pages/',
            content
        )
        content = re.sub(
            r'/documentation/products/build/edge-application/error-responses/',
            '/documentation/products/build/edge-application/custom-pages/',
            content
        )
        
        # URLs para origins
        content = re.sub(
            r'/documentacao/produtos/build/edge-application/origins/',
            '/documentacao/produtos/build/edge-application/edge-connector/',
            content
        )
        content = re.sub(
            r'/documentation/products/build/edge-application/origins/',
            '/documentation/products/build/edge-application/edge-connector/',
            content
        )
        
        return content
    
    def smart_replace_term(self, content: str, old_term: str, new_term: str) -> Tuple[str, List[str]]:
        """Realiza substituição inteligente baseada no contexto"""
        changes = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            original_line = line
            
            # Padrões específicos para cada contexto
            patterns = [
                # Título frontmatter
                (r'title:\s*' + re.escape(old_term.title()), f'title: {new_term.title()}'),
                
                # Meta tags
                (r'meta_tags:\s*[\'"]([^\'"]*)' + re.escape(old_term.lower()) + r'([^\'"][^\'"]*)[\'"]', 
                 lambda m: f'meta_tags: \'{m.group(1)}{new_term.lower()}{m.group(2)}\''),
                
                # Namespace
                (r'namespace:\s*(\w+)' + re.escape(old_term.lower().replace(" ", "_")) + r'(\w*)', 
                 lambda m: f'namespace: {m.group(1)}{new_term.lower().replace(" ", "_")}{m.group(2)}'),
                
                # Permalink
                (r'permalink:\s*([^\s]+)' + re.escape(old_term.lower().replace(" ", "-")) + r'([^\s]*)', 
                 lambda m: f'permalink: {m.group(1)}{new_term.lower().replace(" ", "-")}{m.group(2)}'),
                
                # Texto em negrito
                (r'\*\*' + re.escape(old_term.title()) + r'\*\*', f'**{new_term.title()}**'),
                
                # Links markdown
                (r'\[([^\]]*' + re.escape(old_term.lower()) + r'[^\]]*)\]\(([^)]+)\)', 
                 lambda m: f'[{m.group(1).replace(old_term.lower(), new_term.lower())}]({m.group(2)})'),
                
                # Referências em texto normal (case-insensitive)
                (r'\b' + re.escape(old_term.lower()) + r'\b', new_term.lower()),
                (r'\b' + re.escape(old_term.title()) + r'\b', new_term.title()),
                (r'\b' + re.escape(old_term.upper()) + r'\b', new_term.upper()),
                (r'\b' + re.escape(old_term.capitalize()) + r'\b', new_term.capitalize()),
            ]
            
            for pattern, replacement in patterns:
                if callable(replacement):
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        line = re.sub(pattern, replacement, line, flags=re.IGNORECASE)
                else:
                    if re.search(pattern, line, re.IGNORECASE):
                        line = re.sub(pattern, replacement, line, flags=re.IGNORECASE)
            
            if line != original_line:
                changes.append(f"Linha {i}: '{original_line.strip()}' → '{line.strip()}'")
                lines[i-1] = line
        
        return '\n'.join(lines), changes
    
    def process_file(self, file_path: str, target_terms: List[str]) -> bool:
        """Processa um arquivo específico"""
        try:
            # Criar backup
            backup_path = self.create_backup(file_path)
            
            # Ler conteúdo
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            file_changes = []
            
            # Aplicar substituições para cada termo encontrado
            for term in target_terms:
                if term in self.term_mappings:
                    new_term = self.term_mappings[term]
                    content, changes = self.smart_replace_term(content, term, new_term)
                    file_changes.extend(changes)
            
            # Substituir URLs e caminhos
            content = self.replace_urls_and_paths(content)
            
            # Salvar apenas se houve mudanças
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # Log das mudanças
                self.changes_log.append({
                    "file": file_path,
                    "backup": backup_path,
                    "changes": file_changes,
                    "timestamp": datetime.now().isoformat()
                })
                
                self.processed_files.add(file_path)
                print(f"✅ Processado: {file_path}")
                print(f"   📁 Backup: {backup_path}")
                print(f"   🔄 Mudanças: {len(file_changes)}")
                
                return True
            else:
                print(f"ℹ️  Sem mudanças: {file_path}")
                return False
                
        except Exception as e:
            print(f"❌ Erro ao processar {file_path}: {e}")
            # Tentar restaurar backup em caso de erro
            if hasattr(self, 'backup_path'):
                self.restore_from_backup(file_path)
            return False
    
    def load_files_from_csv(self, csv_file: str) -> Dict[str, List[str]]:
        """Carrega arquivos do CSV e agrupa por arquivo"""
        files_to_process = {}
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                file_path = row['file']
                term = row['term']
                
                if file_path not in files_to_process:
                    files_to_process[file_path] = []
                
                if term not in files_to_process[file_path]:
                    files_to_process[file_path].append(term)
        
        return files_to_process
    
    def process_all_files(self, csv_file: str = "/app/term_identification_results.csv"):
        """Processa todos os arquivos listados no CSV"""
        print("🚀 Iniciando processamento de substituições automáticas...")
        print("=" * 70)
        
        # Carregar arquivos do CSV
        files_to_process = self.load_files_from_csv(csv_file)
        
        print(f"📊 Total de arquivos a processar: {len(files_to_process)}")
        print(f"📋 Termos a substituir: {', '.join(self.term_mappings.keys())}")
        print("\n" + "=" * 70)
        
        # Processar cada arquivo
        processed_count = 0
        for file_path, terms in files_to_process.items():
            if self.process_file(file_path, terms):
                processed_count += 1
        
        # Salvar log de mudanças
        self.save_changes_log()
        
        print("\n" + "=" * 70)
        print("📊 RESUMO DO PROCESSAMENTO")
        print("=" * 70)
        print(f"✅ Arquivos processados com sucesso: {processed_count}")
        print(f"📁 Total de arquivos analisados: {len(files_to_process)}")
        print(f"💾 Backup criado em: {self.backup_dir}")
        print(f"📋 Log detalhado: /app/substitution_changes_log.json")
        
        return processed_count
    
    def save_changes_log(self):
        """Salva log detalhado das mudanças"""
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_files_processed": len(self.processed_files),
                "total_changes": sum(len(change["changes"]) for change in self.changes_log),
                "term_mappings": self.term_mappings,
                "backup_directory": str(self.backup_dir)
            },
            "file_changes": self.changes_log
        }
        
        with open('/app/substitution_changes_log.json', 'w', encoding='utf-8') as f:
            json.dump(log_data, f, indent=2, ensure_ascii=False)
    
    def create_rollback_script(self):
        """Cria script para reverter mudanças"""
        rollback_script = f"""#!/bin/bash
# Script para reverter mudanças na documentação
# Gerado em: {datetime.now().isoformat()}

echo "🔄 Iniciando rollback das mudanças..."

"""
        
        for file_path in self.processed_files:
            relative_path = Path(file_path).relative_to("/app/src/content")
            backup_path = self.backup_dir / relative_path
            rollback_script += f'cp "{backup_path}" "{file_path}"\n'
        
        rollback_script += '''
echo "✅ Rollback concluído!"
echo "📁 Arquivos restaurados do backup: {}"
'''.format(len(self.processed_files))
        
        with open('/app/rollback_documentation.sh', 'w') as f:
            f.write(rollback_script)
        
        os.chmod('/app/rollback_documentation.sh', 0o755)
        print(f"📜 Script de rollback criado: /app/rollback_documentation.sh")

def main():
    updater = DocumentationUpdater()
    
    try:
        # Processar todos os arquivos
        processed_count = updater.process_all_files()
        
        # Criar script de rollback
        if processed_count > 0:
            updater.create_rollback_script()
            
            print("\n🎉 Processamento concluído com sucesso!")
            print("📋 Para reverter as mudanças, execute: bash /app/rollback_documentation.sh")
        else:
            print("\n⚠️  Nenhum arquivo foi modificado.")
            
    except Exception as e:
        print(f"❌ Erro durante o processamento: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())