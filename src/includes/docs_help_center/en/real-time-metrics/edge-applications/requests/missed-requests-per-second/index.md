## Missed Requests per Second

The Missed Requests per Second graph shows the average of your application's requests per second when Azion's edge had to look for the content on the origin and deliver it to the end user.

Whenever the content of your application is accessed, one request is processed. The graph then shows the average of all requests that were missed per second during the period you've selected in the time range.

> Missed Requests: the edge looks for the content on the origin and then delivers it to the end user.
>
> END USER -> EDGE -> ORIGIN -> EDGE -> END USER

When the content isn't found on Azion's cache, it's necessary to take another step and look for it on the origin, and then deliver it to the end user.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses averages of requests/second to show your data. Example: 0.026/s