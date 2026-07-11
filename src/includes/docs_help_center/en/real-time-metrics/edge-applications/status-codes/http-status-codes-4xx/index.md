## HTTP Status Codes 4XX

Whenever a domain that's associated with an Azion application receives a request, it also receives a specific status code according to the server's response. The graph then shows the sum of total requests that received a status 4XX.

The 4XX status codes indicate there was an error on the client's side. This means the request couldn't be completed by the server because it identified an error, likely due to the page being unavailable or the request containing bad syntax. Therefore, the server couldn't deliver your domain's content.

> The graph is divided into:
> 
> - **Requests Status Code400**: the server can't process the request. Generally occurs due to an error with the request format.
> - **Requests Status Code403**: the request is valid, but wasn't authorized by the server. This means that the user or the IP address that's making the request isn't authorized to do so.
> - **Requests Status Code404**: the file that was requested doesn't exist on the origin server.
> - **Requests Status Code4xx**: the server indicated other status of the 4XX type. They rarely occur, and are all gathered on this option.