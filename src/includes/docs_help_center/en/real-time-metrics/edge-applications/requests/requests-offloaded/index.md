## Requests Offloaded

The Requests Offloaded graph shows the percentage of requests that were delivered directly by the edge, without having to search for the content on the origin before delivering it.

> END USER -> EDGE -> END USER

The higher the percentage of offloading, the better the efficiency of your applications regarding the use of cache policies to preserve infrastructure. Azion's edge delivers the content from its cache, demanding less from your origin.

### Practical example

Your application received *5 requests*. If the graph shows your application had an average of *80% offload*, this means *4 out of 5* requests were delivered directly by Azion's edge.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses percentages to show your data on offload graphs. All data related to offloading reflects the average number of your applications' access, and the graph then presents it as percentages (%).