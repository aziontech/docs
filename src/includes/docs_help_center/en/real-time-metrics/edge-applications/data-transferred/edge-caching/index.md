## Cache

The Cache graph represents how all information regarding your Cache data is being accessed on Azion's edge.

It provides a first layer of caching to the client content on Azion edges. The graph is divided into:

> - **Data Transferred Total**: all data that was transferred in the process; value of Data Transferred In + Data Transferred Out.
> 
> END USER -> EDGE -> ORIGIN + ORIGIN -> EDGE -> END USER
> 
> - **Data Transferred In**: data transferred from the user to the edges, and from the edges to the client origin.
>
> END USER -> EDGE -> ORIGIN
>
> - **Data Transferred Out**: data transferred from the client origin to the edges, and from the edges to the user.
>
> ORIGIN -> EDGE -> END USER

To use Cache and analyze data on it, you must activate it in your account. See the [Cache documentation](https://www.azion.com/en/documentation/products/edge-application/edge-caching/) for more information.

> **In what unit does data appear on graphs?**
>
> Real-Time Metrics uses bytes to show your data. It automatically converts your data into megabytes (MB), gigabytes (GB), or terabytes (TB), for example, according to the amount of data available to make your visualization easier.