#!/usr/bin/env python3
import sys, io, re

if len(sys.argv) < 2:
    sys.exit(0)
path = sys.argv[1]

with io.open(path, 'r', encoding='utf-8') as fh:
    text = fh.read()

# Split by fenced code blocks (``` ... ```), keep them intact
parts = re.split(r'(```[\s\S]*?```)', text)
for i in range(len(parts)):
    if i % 2 == 1:
        # Inside code fence: leave unchanged
        continue
    seg = parts[i]
    # Split by inline code spans `...` and keep them intact
    chunks = re.split(r'(`[^`]*`)', seg)
    for j in range(len(chunks)):
        if j % 2 == 1:
            # Inline code span: leave unchanged
            continue
        # Perform exact, case-sensitive replacements in visible text
        chunks[j] = re.sub(r'\bEdge Functions\b', 'Functions', chunks[j])
        chunks[j] = re.sub(r'\bEdge Function\b', 'Function', chunks[j])
    parts[i] = ''.join(chunks)

new_text = ''.join(parts)

if new_text != text:
    with io.open(path, 'w', encoding='utf-8', newline='') as fh:
        fh.write(new_text)
    print(f"Updated: {path}")
