import { headerMenuDict } from '../translation-checkers';

export default headerMenuDict({
	nav: [{
		title: "Documentation",
		href: "/en/documentation/"
	},
	{
		title: "Guides",
		href: "/en/documentation/products/guides/"
	},
	{
		title: "Dev Tools",
		href: "/en/documentation/products/dev-tools/",
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
