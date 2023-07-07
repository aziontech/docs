## Address

This field defines the IP or DNS entries pointing to your application or content origin. Typically, the origin is associated with a cloud service, such as Cloud Load Balancers, Cloud Storage Buckets, or API services where you find the entries.

### Choosing a valid origin address

You must define a valid origin address in a Fully Qualified Domain Name (an absolute address such as origin.clientside.com) or a public IP address (accessible from external networks, excluding private IPs such as 10.x.x.x or 192.168.x.x, 172.16-31.x.x or 127.0.0.x).

**Note**: Make sure that your filters will allow Azion's **Edge Nodes** to connect and fetch the content from your origin.

> **How Azion connects to your origin**
>
> 1. The platform connects to your origin by using HTTP or HTTPS for data communication. HTTPS is HTTP with encryption.
> 2. By standard, the connection occurs through port 80, for HTTP, or 443, for HTTPS.
> 3. If you want to configure a different port to connect to your origin, you can use the **host:port** notation in this field, for example, origin.clientside.com:8080.