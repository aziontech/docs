## Adding filters

Real-Time Metrics shows you a standard view of data related to all your applications, but, by using filters, you can adjust the graphs to match your requests. This way, you can view more specific data that fit your analysis.

When you add a filter, you can set the **Field**, such as "Host", "Status", or "Scheme", and the **Operator**, such as "Like", "Range", or "Not equal".

You can find more details about each field on the [Fields Metrics documentation](https://www.azion.com/en/documentation/products/graphql-api/features/metrics-fields/) and about operators on the [Queries documentation](https://www.azion.com/en/documentation/products/graphql-api-queries/#operators).

You can also set the **value field** that'll be used. Depending on the variable you chose, it can accept values of the String, Int, or Float types.

### Practical example

You want to filter your data by specific zones, but, in the request, you only want zones that are an exact match to the one you inform.

In this situation, you should use **Zone Id** and **Equal**. In the value field, you should add the specific id you want to filter by, such as "1340". Then, your response will only contain that specified zone.

> **How can I edit or delete a filter?**
>
> After you add filters, each one shows on the **FILTERS** section.
>
> If you want to edit an existing filter, click on the text of the specific filter. Once the **Edit Filter** popover opens, you can change the filter's settings as you wish.
>
> If you want to delete an existing filter, click the **x** icon next to the specific filter. Repeat the action for each filter you want to delete.