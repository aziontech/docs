## Select the setup option

In the **Choose an option to start** section, you select an option to start your **Edge Application**. To get ready faster, your Edge Application will be built and automatically associated with an Azion Domain according to your selection.

To build the Edge Application and automatically associate it with an Azion Domain, select:

- **Run a function**

It's the default option which lists all the functions available in your function library. The *Hello World* function is your first choice if this is your first time creating one.

- **Fetch content from origin**

It creates an Edge Application and configures an [Origin](https://www.azion.com/en/documentation/products/edge-application/origins). Azion fetches your content directly from there and [honor cache control headers](https://www.azion.com/en/blog/what-is-http-caching-and-how-does-it-work) returned.

**Note**: In this case, your Edge Application uses the **Edge Cache** and **Application Acceleration** modules with explicit policies to cache static files and images on edge network, delivering them directly to your users from the nearest **Edge Node** without having to access the origin, increasing performance and scalability.

- **Build an advanced Edge Application**

It enables you to customize Functions and origins servers later.

> **Still in doubt?**
>
> Your decision at this point defines the template and basic information for your application, but it can be changed at any time.
>
> After this step, it'll be much easier to explore changes to the application and evolve its use.

An Edge Application is a set of resources and functionalities, such as:

- **Functions**: code and its arguments.
- **Edge Cache**: usually fetches content from an origin.
- **Network**: for creating business rules at the edge, which are advanced rules with criteria and behavior.
