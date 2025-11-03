## Environment variables

Environment variables are dynamic values that can affect the building and behavior of your application. For example: connect to a specific database, assign a URL, store and protect sensible data, use an API Key or token, among others. Using environment variables could make your application more dynamic and able to return an adequate response in different scenarios.

Environment variables are composed of two key values, in the format KEY_VARIABLE=VALUE; example: API_URL=www.apiurl.com/abc. To declare an environment variable, you must provide:

1. **Name**: type a relevant and unique new name for your variable.
2. **Value**: type the value for your variable.

Examples:

- To connect your application to a database:
    *DB_HOST=hostname*; *DB_USER=username*, and *DB_PASS=123@abc*
- To connect to an API:
    *API_URL=www.apiurl.com/abc*
- To use a token:
    *TOKEN=abc123defg567890*

You can add as many variables as you need for your application. But you're also able to create a new application without adding any environment variable.

> Azion's platform includes built-in support for environment variables for edge applications developed in the [supported frameworks](https://www.azion.com/en/documentation/runtime/overview/#supported-frameworks).

**Important**: currently, when you build an edge applications on Azion's platform, it's directly deployed and runs in a production environment.
