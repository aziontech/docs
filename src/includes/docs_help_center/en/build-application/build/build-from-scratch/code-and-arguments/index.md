## Code and Arguments

In the **Code** and **Args** section, you view your **Edge Function's** code and edit its arguments.

### Viewing code

The Code tab depicts the Edge Function. The **Event.args.<ARG_CREATED>** command is used to instantiate arguments in **JavaScript Runtime**, which connects the Args tab to the code.

**Note**: You can't edit the Edge Function's code here. To modify its code, go to your Edge Function library.

### Editing arguments

The **Args** tab presents **JavaScript Object Notation (JSON)** parameters of the Edge Function to control its behavior without changing the code.

> **Editing arguments**
>
> To view the code and edit the arguments of an Edge Function:
>
> 1. Click the **Args** tab. The Edge Function's arguments appear in the tab's text area.
> 2. If necessary, edit the Edge Function's arguments.
> 3. On the bottom of the page, click the **Save and continue** button to save your Edge Function.

### Getting to know Runtime Environment

The platform supports JavaScript runtime environments. Functions can have an embedded [WebAssembly (Wasm)](https://www.azion.com/en/documentation/use-cases/webassembly-on-azion-platform){: target="_blank"} binary code to deliver near-native performance for applications.

Wasm isn't designed to be used as a language itself, but as an effective compilation target for languages like C, C++, Rust, and others. Jamstack frameworks, such as [Next.js](https://www.azion.com/en/documentation/use-cases/nextjs-on-azion-platform){: target="_blank"} and [Flareact](https://www.azion.com/en/documentation/use-cases/jamstack-using-flareact){: target="_blank"}, also found easy support and fast performance at Azion and you'll find all necessary references in the [documentation](https://www.azion.com/en/documentation/use-cases){: target="_blank"}.