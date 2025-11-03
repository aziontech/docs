## HTTP Status Codes 3XX

Whenever a domain that's associated with an Azion application receives a request, it also receives a specific status code according to the server's response. The graph then shows the sum of total requests that received a status 3XX.

The 3XX status codes indicate redirection on the server's side. This means the request wasn't fully completed because the content was in another location, and it had to perform one more action to deliver your domain's content.

> The graph is divided into:
> 
> - **Requests Status Code301**: current and all future requests will be redirected to another URL.
> - **Requests Status Code302**: this request was temporarily redirected to another URL.
> - **Requests Status Code304**: the content header indicates that it hasn't been modified and doesn't need to be resent. It can deliver the existing file to the user’s browser.
> - **Requests Status Code3xx**: the server indicated other status of the 3XX type. They rarely occur, and are all gathered on this option.