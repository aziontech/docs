## Build and output settings

The **Build and Output Settings** are command lines to manage a project’s dependencies. *npm* and *yarn* are the most common used packages for projects developed with Node.js frameworks and Javascript.

In this section, it's necessary to include the Build Command, the Output Directory, and the Install Command that will be used by your application in the building and deployment processes, according to the framework it's based on.

> **How to configure these settings?**
>
> - **Build Command**: compiles your settings to build for production. Build commands are executed through *npm* or *yarn* scripts. Example: *npm run build*.
> - **Output Directory**: the directory where your build is compiled and served. Example: *next*.
> - **Install Command**: the command to install a specific file in a specific folder within a file system. Example: *npm install*.

Build and Output Settings could be automatically filled by Azion's platform, based on the framework and the dependencies included on your `package.json` file. However, you can fill them manually and edit these fields according to your project's needs.

### Supported frameworks

Your project must be developed in one of the frameworks supported by Azion. In case of importing projects based on other frameworks, Real-Time Manager won't complete the building and deployment processes. For more details, see the [Supported Frameworks and Azion Runtime](https://www.azion.com/en/documentation/runtime/overview/) documentation.

For more information on building methods on Azion, read the [Building and setting up an application](https://www.azion.com/en/documentation/products/getting-started/build-edge-applications/) documentation.
