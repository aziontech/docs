## Missed Bandwidth

The Missed Bandwidth graph shows how much bandwidth was delivered when Azion's edge had to look for the content on the origin and deliver it to the end user.

> Missed Bandwidth: the edge looks for the content on the origin and then delivers it to the end user.
>
> END USER -> EDGE -> ORIGIN -> EDGE -> END USER

When the content isn't found on Azion's cache, it's necessary to take another step and look for it on the origin, and then deliver it to the end user.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses bits and bytes per second on all graphs related to bandwidth data. It automatically converts your data into megabits per second (bit/s) or kilobytes per second (kB/s), for example, according to the amount of data available to make your visualization easier.