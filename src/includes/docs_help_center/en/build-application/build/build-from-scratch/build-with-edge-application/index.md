## Build with Applications

Azion **Applications** allows you to build your applications to run on Azion Web Platform.

### Naming your Applications

To name your Applications you have to fill the text box with a unique new name. This name doesn't affect how end-users access your application and you can change it at any time.

The platform returns an error message if the name already exists in your library. If it happens, try again with a different name.

A relevant Applications name makes your management easier. In case your application relates to:

- **Specific domain** (www.yourapp.com), use an Applications name related to the domain name (”www.yourapp.com” or "yourapp www").
- **Specific origin system**, use an Applications name related to the origin ("Cloud Bucket for Statics") as you may associate it with more domain names.
- **Specific application usage**, use an Applications name related to the function (”Checkout application”) as you may associate it with more domain names.

**Note**: Your Applications name exists for administrative purposes. End-user and device access occur on an [associated domain name](https://www.azion.com/en/documentation/products/edge-application/domains).

> **Just starting?**
>
> To get familiar with the platform and create your first edge application, you can:
>
> - Enter a test name.
> - Proceed to "Run a function".
> - Select "Azion - Hello World" in the **Choose Functions** field.
> - Click **Save** to continue.
>
> Or, feel free to explore the options and look around.

### About Applications

Your Applications runs serverless in response to events on Edge Nodes of the global [Edge Network](https://www.azion.com/en/products/edge-network). DNS resolution is used to dynamic route requests to the best end-to-end connection.

[ User and devices <-> EDGE <-> your application or origin ]

At the Edge Node, an Applications associated with the domain name processes each request by executing a [Rules Engine](https://www.azion.com/en/documentation/products/edge-application/rules-engine).

- Each rule can use powerful criteria on nested "If-then" statements to trigger behaviors from [enabled modules](https://www.azion.com/en/documentation/products/edge-application#edge-application-modules), such as run a function or set origin.
- Each rule is executed until all the rules are processed or a rule with a finalizing behavior is found in the path.

Learn more on the [documentation page](https://www.azion.com/en/documentation/products/getting-started).