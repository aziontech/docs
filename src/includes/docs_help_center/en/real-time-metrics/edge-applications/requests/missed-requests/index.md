## Missed Requests

The Missed Requests graph shows the total sum of your application's requests when Azion's edge had to look for the content on the origin and deliver it to the end user.

Whenever the content of your application is accessed, one request is processed. The graph then shows all requests that were missed during the period you've selected in the time range.

> Missed Requests: the edge looks for the content on the origin and then delivers it to the end user.
>
> END USER -> EDGE -> ORIGIN -> EDGE -> END USER

When the content isn't found on Azion's cache, it's necessary to take another step and look for it on the origin, and then deliver it to the end user. The entire process counts as 1 request.