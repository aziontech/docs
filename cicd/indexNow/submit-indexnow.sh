#!/bin/bash

YOUR_WEBSITE_DOMAIN="www.azion.com"
KEY_FILE_NAME="cd8c26fa4bd942a8873f8567e105c154.txt"
KEY_FILE_PATH="public/${KEY_FILE_NAME}"

# Endpoint do Bing IndexNow
BING_ENDPOINT="https://www.bing.com/indexnow"
SITEMAP_URL="https://www.azion.com/sitemap.xml"

SITEMAP_CONTENT=$(curl -s -f "$SITEMAP_URL")
EXCLUDE_PATTERN="/lp/"

if [ $? -ne 0 ]; then
  echo "Erro: Falha ao baixar o sitemap de $SITEMAP_URL."
  exit 1
fi

if [ -z "$YOUR_WEBSITE_DOMAIN" ]; then
  echo "Erro: A variável de ambiente YOUR_WEBSITE_DOMAIN não está definida."
  exit 1
fi

if [ ! -f "$KEY_FILE_PATH" ]; then
  echo "Erro: Arquivo da chave IndexNow não encontrado em $KEY_FILE_PATH."
  exit 1
fi

INDEXNOW_KEY=$(cat "$KEY_FILE_PATH")
INDEXNOW_KEY=$(echo "$INDEXNOW_KEY" | tr -d '\n\r')

if [ -z "$INDEXNOW_KEY" ]; then
  echo "Erro: A chave IndexNow no arquivo está vazia."
  exit 1
fi

URLS=()
while IFS= read -r line; do
    if [[ "$line" != *"$EXCLUDE_PATTERN"* ]]; then
        URLS+=("$line")
    fi
done < <(echo "$SITEMAP_CONTENT" | grep -o '<loc>[^<]*</loc>' | sed 's|<loc>||g; s|<\/loc>||g')

if [ ${#URLS[@]} -eq 0 ]; then
  echo "Nenhuma URL válida encontrada para submeter. Saindo."
  exit 0
fi

# Converte o array de URLs em um JSON para o curl
JSON_URL_LIST=$(printf '%s\n' "${URLS[@]}" | jq -R . | jq -cs .)

# Verifica se o jq está instalado
if ! command -v jq &> /dev/null
then
    echo "jq não está instalado. É necessário para processar o JSON das URLs."
    exit 1
fi

# --- Função para Submeter URLs ---
submit_to_indexnow() {
    local endpoint="$1"
    local json_body=$(cat <<EOF
{
    "host": "$YOUR_WEBSITE_DOMAIN",
    "key": "$INDEXNOW_KEY",
    "keyLocation": "https://$YOUR_WEBSITE_DOMAIN/$KEY_FILE_NAME",
    "urlList": $JSON_URL_LIST
}
EOF
)

    # echo "Request body: $json_body"

    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$endpoint" \
        -H "Content-Type: application/json" \
        --data "$json_body")

    if [ "$RESPONSE" -eq 200 ]; then
        echo "Submissão para $endpoint bem-sucedida! Status: $RESPONSE"
    else
        echo "Erro ao submeter para $endpoint. Status: $RESPONSE"
    fi
}

submit_to_indexnow "$BING_ENDPOINT"

echo "Processo IndexNow concluído."