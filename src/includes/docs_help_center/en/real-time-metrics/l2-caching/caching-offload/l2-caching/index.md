## L2 Caching

The L2 Caching graph represents how all information regarding your L2 Caching data is being accessed on Azion's edge.

L2 Caching is a feature for Edge Application that adds an extra layer of cache between the edge and the client origin. The graph is divided into:

> - **Data Transferred Total**: all data that was transferred in the process; value of Data Transferred In + Data Transferred Out.
>
> EDGE -> L2 CACHE -> ORIGIN + ORIGIN -> L2 CACHE -> EDGE
>
> - **Data Transferred In**: data transferred from the edges and through L2 Caching until the client origin.
>
> EDGE -> L2 CACHE -> ORIGIN
>
> - **Data Transferred Out**: data transferred from the client origin and through L2 Caching to the edges.
>
> ORIGIN -> L2 CACHE -> EDGE

To use L2 Caching and analyze data on it, you must activate it in your account. See the [L2 Caching documentation](https://www.azion.com/en/documentation/products/edge-application/edge-caching/#l2-caching){: target="_blank"} for more information.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses bytes to show your data. It automatically converts your data into megabytes (MB), gigabytes (GB), or terabytes (TB), for example, according to the amount of data available to make your visualization easier.