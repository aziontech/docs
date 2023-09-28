import { headerMenuDict } from '../translation-checkers';

export default headerMenuDict({
	nav: [{
		title: "Documentação",
		href: "/pt-br/documentacao/"
	},
	{
		title: "Guias",
		href: "/pt-br/documentacao/produtos/guias/"
	},
	{
		title: "Dev Tools",
		href: "/pt-br/documentacao/produtos/dev-tools/",
		// dropdown: [
		//     {
		//         title: "CLI",
		//         href: "documentation_CLI"
		//     },
		//     {
		//         title: "API",
		//         href: "https://api.azion.com/",
		//         target: "_blank"
		//     },
		//     {
		//         title: "API GraphQL",
		//         href: "documentation_graphql"
		//     },
		//     {
		//         title: "Edge Runtime",
		//         href: "documentation_products_edge_functions_runtime_overview"
		//     },
		//     {
		//         title: "SDK",
		//         href: "https://github.com/aziontech/azionapi-go-sdk"
		//     },
		//     {
		//         title: "Terraform",
		//         href: "documentation_terraform_provider"
		//     }
		// ]
	}
	]
})
