---
title: Useful Metadata for Contextual Policies
---

## **Metadados úteis para políticas contextuais**

Ao executar lógica de segurança no edge, é possível usar informações do próprio runtime para tornar decisões mais contextuais. Alguns metadados particularmente úteis incluem:

| Metadado | Uso |
| :---- | :---- |
| GeoIP | País, região e ASN para bloquear ou limitar por geolocalização e rede de origem. |
| Remote | IP e porta de origem para controles por cliente e rate limiting. |
| TLS | Protocolo e cipher para validar requisitos mínimos de criptografia. |
| Fingerprints | Sinais do cliente para identificar padrões anômalos. |
| Identifiers | request\_id, client\_id e function\_id para rastreamento e auditoria. |

Esses sinais ajudam a transformar políticas estáticas em decisões mais aderentes ao contexto da requisição, reduzindo ruído e melhorando a precisão das respostas.

---

### **Exemplo — acessando metadados para políticas contextuais**

O exemplo abaixo demonstra como acessar os diferentes metadados disponíveis no Edge Firewall para tomada de decisão baseada em contexto.

```javascript
async function firewallHandler(event) {
  const metadata = event.request.metadata;
  
  // Remote — informações do cliente
  const clientIp = metadata["remote_addr"];
  const clientPort = metadata["remote_port"];
  
  // GeoIP — geolocalização baseada no IP
  const country = metadata["geoip_country_code"];
  const asn = metadata["geoip_asn"];
  
  // Server — protocolo da requisição
  const protocol = metadata["server_protocol"];
  
  // TLS — dados da conexão segura
  const tlsProtocol = metadata["ssl_protocol"];
  const tlsCipher = metadata["ssl_cipher"];
  
  // Exemplo: negar acesso de países bloqueados
  const blockedCountries = ["XX", "YY"];
  if (blockedCountries.includes(country)) {
    event.deny();
    return;
  }
  
  // Exemplo: exigir TLS 1.2 ou superior para rotas sensíveis
  const path = new URL(event.request.url).pathname;
  if (path.startsWith("/admin") && tlsProtocol !== "TLSv1.2" && tlsProtocol !== "TLSv1.3") {
    event.deny();
    return;
  }
  
  // Adiciona contexto aos headers para a origem
  event.addRequestHeader("X-Client-Country", country);
  event.addRequestHeader("X-Client-ASN", asn);
  
  event.continue();
}

addEventListener("firewall", (event) => event.waitUntil(firewallHandler(event)));
```

#### Metadados disponíveis

| Categoria | Metadado | Descrição |
|-----------|----------|-----------|
| **Remote** | `remote_addr` | Endereço IP do cliente |
| | `remote_port` | Porta TCP do cliente |
| | `remote_user` | Usuário informado na URL |
| **GeoIP** | `geoip_country_code` | Código do país (ISO 3166-1) |
| | `geoip_country_name` | Nome do país |
| | `geoip_city` | Código da cidade |
| | `geoip_region` | Código da região/estado |
| | `geoip_asn` | Autonomous System Number |
| **Server** | `server_protocol` | Protocolo utilizado (ex: HTTP/1.1) |
| **TLS** | `ssl_cipher` | Cifra TLS utilizada |
| | `ssl_protocol` | Protocolo TLS utilizado |