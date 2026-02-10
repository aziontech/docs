## HTTP Status Codes 5XX

Whenever a domain that's associated with an Azion application receives a request, it also receives a specific status code according to the server's response. The graph then shows the sum of total requests that received a status 5XX.

The 5XX status codes indicate there was an error on the server's side. This means that the request by the end user seemed to be valid, but for some reason the server couldn't perform the request or encountered an error in the process. Your domain's content still exists, it just couldn't be delivered.

> The graph is divided into:
> 
> - **Requests Status Code500**: generic message given when an unexpected error occurs on the server and it's unable to handle the request.
> - **Requests Status Code502**: when the server is acting as a Gateway or Proxy and receives an invalid response from the origin. Generally occurs when the origin server is offline.
> - **Requests Status Code503**: server isn't available. Generally a temporary status.
> - **Requests Status Code5xx**: the server indicated other status of the 5XX type. They rarely occur, and are all gathered on this option.