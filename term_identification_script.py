#!/usr/bin/env python3
"""
Script to identify files containing terms that need to be updated in Azion documentation.
Terms to find:
- "domains" → "workloads"
- "error responses" → "custom pages"
- "origins" → "edge connector"
"""

import subprocess
import json
import os
import re
from collections import defaultdict

def search_term_in_files(term, search_path="/app/src/content"):
    """Search for a term in all .mdx files and return file paths"""
    try:
        cmd = [
            "grep", "-r", "-i", "-l", "--include=*.mdx", term, search_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            files = result.stdout.strip().split('\n')
            return [f for f in files if f.strip()]
        else:
            return []
    except Exception as e:
        print(f"Error searching for term '{term}': {e}")
        return []

def main():
    print("🔍 Iniciando identificação de termos a serem atualizados...")
    print("=" * 60)
    
    # Terms to search for
    terms = {
        "domains": "workloads",
        "error responses": "custom pages", 
        "origins": "edge connector"
    }
    
    results = []
    summary = defaultdict(int)
    
    for old_term, new_term in terms.items():
        print(f"\n📋 Procurando por '{old_term}'...")
        files = search_term_in_files(old_term)
        
        for file_path in files:
            results.append({
                "term": old_term,
                "new_term": new_term,
                "file": file_path
            })
            summary[old_term] += 1
        
        print(f"   ✅ Encontrados {len(files)} arquivos contendo '{old_term}'")
    
    # Generate different output formats
    print("\n" + "=" * 60)
    print("📊 RESUMO DOS RESULTADOS")
    print("=" * 60)
    
    for term, count in summary.items():
        print(f"• {term}: {count} arquivos")
    
    print(f"\n📁 Total de arquivos únicos encontrados: {len(set(r['file'] for r in results))}")
    
    # Save JSON output
    with open('/app/term_identification_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Save CSV output
    with open('/app/term_identification_results.csv', 'w', encoding='utf-8') as f:
        f.write("term,new_term,file\n")
        for result in results:
            f.write(f'"{result["term"]}","{result["new_term"]}","{result["file"]}"\n')
    
    # Save Markdown output
    with open('/app/term_identification_results.md', 'w', encoding='utf-8') as f:
        f.write("# 🔍 Identificação de Termos para Atualização\n\n")
        f.write("## 📋 Termos a serem atualizados:\n\n")
        f.write("| Termo Atual | Novo Termo |\n")
        f.write("|-------------|------------|\n")
        for old_term, new_term in terms.items():
            f.write(f"| `{old_term}` | `{new_term}` |\n")
        
        f.write("\n## 📊 Resumo dos Resultados:\n\n")
        for term, count in summary.items():
            f.write(f"- **{term}**: {count} arquivos\n")
        
        f.write(f"\n**Total de arquivos únicos**: {len(set(r['file'] for r in results))}\n\n")
        
        f.write("## 📁 Arquivos Identificados:\n\n")
        f.write("| Termo | Arquivo |\n")
        f.write("|-------|--------|\n")
        
        for result in results:
            f.write(f"| `{result['term']}` | `{result['file']}` |\n")
    
    print("\n💾 Arquivos de saída criados:")
    print("   • /app/term_identification_results.json")
    print("   • /app/term_identification_results.csv") 
    print("   • /app/term_identification_results.md")
    
    print("\n✅ Identificação concluída!")

if __name__ == "__main__":
    main()