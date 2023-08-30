---
title: Como fazer o upgrade de conexão para WebSocket
description: Aumente a eficiência de suas edge applications em tempo real com o protocolo WebSocket para Azion Edge Application.
meta_tags: WebSocket, live, edge application, websockets, protocol
namespace: documentation_products_guides_websocket
permalink: /pt-br/documentacao/produtos/guias/websocket/
---
import Button from '~/components/Button.astro';

O protocolo WebSocket fornece um caminho para criação de aplicações web que suportam comunicação bidirecional, em tempo real, entre cliente e servidor. Você pode habilitar o uso de WebSocket pela sua edge application através do módulo **WebSocket Proxy**.

<Button text="Saiba mais sobre WebSocket" href="/pt-br/documentacao/produtos/edge-application/websocket/"></Button>

Para habilitar o suporte a WebSocket em uma edge application:

1. [Acesse o Real-Time Manager](https://manager.azion.com).
2. No canto superior esquerdo da página, abra o **Products menu**, identificado pelas três linhas horizontais, e selecione **Edge Application**.
3. Selecione a edge application que deseja configurar.
4. Na aba **Main Settings**, na seção **Modules**, ative o **WebSocket Proxy**.

> Alguns módulos de Edge Application são produtos faturados. Consulte a página de [Faturamento](/pt-br/documentacao/produtos/gestao-de-contas/faturamento/) para saber mais.

5. Clique no botão **Save**.

Para que a origem receba a informação de upgrade para WebSocket, você precisa adicionar os cabeçalhos HTTP que ativam a conexão na sua aplicação. Mantenha em mente que sua origem deve dar suporte à WebSocket. Você pode reforçar uma conexão WebSocket usando **Rules Engine** da seguinte maneira:

1. Clique na aba **Rules Engine**.
2. Clique no botão **Add Rule** e selecione **Response Phase**.
3. Dê um nome à sua regra.
4. Determine o critério de ativação do WebSocket. Por exemplo, se você deseja ativar a conexão para uma URI específica, selecione a variável `${uri}`, o operador de comparação **starts with** e insira como argumento a barra `/path`.
5. Clique no botão **+ Behavior**.
6. Selecione o behavior **Add Request Header** e passe como argumento a string `Upgrade: websocket`.
7. Clique no botão **+ Behavior**.
8. No novo campo, selecione o behavior **Add Request Header** e como argumento, adicione a string `Connection: Upgrade`.
9. Clique no botão **Save**.

Agora sua origem irá receber os cabeçalhos necessários para que a aplicação estabeleça uma conexão WebSocket.
