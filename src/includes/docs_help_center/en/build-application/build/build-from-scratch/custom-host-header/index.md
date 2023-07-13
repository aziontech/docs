## Custom Host Header

This field is used to define which application should be accessed, enabling the origin server to distinguish among resources while servicing requests for multiple hostnames on a single IP address.

> **Host Header and your origin**
>
> Your origin uses the Host Header to identify the virtualhost and locate your content or Application.
>
> The default behavior is to send the value of the Address field as Host Header to the origin.

**Note**: If your origin services only respond for a specific domain name, you must fill in the necessary custom value to be sent to your origin. For example: origin.yourdomain.com.