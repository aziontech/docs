## Tiered Cache

The Tiered Cache graph represents how all information regarding your Tiered Cache data is being accessed on Azion's edge.

Tiered Cache is a feature for Applications that adds an extra layer of cache between the edge and the client origin. The graph is divided into:

> - **Data Transferred Total**: all data that was transferred in the process; value of Data Transferred In + Data Transferred Out.
>
> EDGE -> TIERED CACHE -> ORIGIN + ORIGIN -> TIERED CACHE -> EDGE
>
> - **Data Transferred In**: data transferred from the edges and through Tiered Cache until the client origin.
>
> EDGE -> TIERED CACHE -> ORIGIN
>
> - **Data Transferred Out**: data transferred from the client origin and through Tiered Cache to the edges.
>
> ORIGIN -> TIERED CACHE -> EDGE

To use Tiered Cache and analyze data on it, you must activate it in your account. See the [Tiered Cache documentation](https://www.azion.com/en/documentation/products/edge-application/l2-caching/) for more information.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses bytes to show your data. It automatically converts your data into megabytes (MB), gigabytes (GB), or terabytes (TB), for example, according to the amount of data available to make your visualization easier.