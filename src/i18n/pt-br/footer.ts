// import { footerDict } from '../translation-checkers';

// export default footerDict({
// 	data: [
// 		{
// 			title: "Recursos",
// 			links: [
// 				{
// 					text: "Blog",
// 					route: "/pt-br/blog/"
// 				},
// 				{
// 					text: "Documentação",
// 					route: "/pt-br/documentacao/"
// 				},
// 				{
// 					text: "Marketplace",
// 					route: "/pt-br/marketplace/"
// 				},
// 				{
// 					text: "Compliance",
// 					route: "/pt-br/compliance/"
// 				},
// 				{
// 					text: "Casos de Sucesso",
// 					route: "/pt-br/casos-de-sucesso/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Empresa",
// 			links: [
// 				{
// 					text: "Sobre nós",
// 					route: "/pt-br/sobre-nos/"
// 				},
// 				{
// 					text: "Azion Edge Network",
// 					route: "/pt-br/produtos/edge-network/"
// 				},
// 				{
// 					text: "Carreiras",
// 					route: "/pt-br/carreiras",
// 					flag: "Estamos contratando!"
// 				},
// 				{
// 					text: "Política de privacidade",
// 					route: "/pt-br/documentacao/contratos/politica-de-privacidade/"
// 				},
// 				{
// 					text: "Roadmap",
// 					route: "/en/roadmap/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Preços",
// 			links: [
// 				{
// 					text: "Produtos",
// 					route: "/pt-br/precos/"
// 				},
// 				{
// 					text: "Suporte",
// 					route: "/pt-br/suporte/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Contato",
// 			links: [
// 				{
// 					text: "Vendas",
// 					route: "/pt-br/contate-vendas/"
// 				},
// 				{
// 					text: "Suporte",
// 					route: "/pt-br/suporte/"
// 				},
// 				{
// 					text: "Facebook",
// 					route: "https://www.facebook.com/aziontech",
// 					type: "external"
// 				},
// 				{
// 					text: "X",
// 					route: "https://x.com/aziontech",
// 					type: "external"
// 				},
// 				{
// 					text: "Linkedin",
// 					route: "https://www.linkedin.com/company/aziontech",
// 					type: "external"
// 				},
// 				{
// 					text: "Instagram",
// 					route: "https://www.instagram.com/aziontech",
// 					type: "external"
// 				},
// 				{
// 					text: "YouTube",
// 					route: "https://www.youtube.com/aziontech",
// 					type: "external"
// 				},
// 				{
// 					text: "GitHub",
// 					type: "external",
// 					route: "https://github.com/aziontech"
// 				},
// 				{
// 					text: "Discord",
// 					type: "external",
// 					route: "https://discord.gg/Yp9N7RMVZy"
// 				},
// 				{
// 					text: "Medium",
// 					route: "https://medium.com/aziontechbr",
// 					type: "external"
// 				}
// 			]
// 		}
// 	]
// })


const listData = [
  {
    "title": "Recursos",
    "list": [
      {
        "title": "Blog",
        "link": "/pt-br/blog/"
      },
      {
        "title": "Documentação",
        "link": "/pt-br/documentacao/"
      },
      {
        "title": "Marketplace",
        "link": "/pt-br/marketplace/"
      },
      {
        "title": "Compliance",
        "link": "/pt-br/compliance/"
      },
      {
        title: "Resource Hub",
        link: "/pt-br/resource-hub/"
      }
    ]
  },
  {
    "title": "Empresa",
    "list": [
      {
        "title": "Sobre Nós",
        "link": "/pt-br/sobre-nos/"
      },
      {
        "title": "Our Network",
        "link": "/pt-br/produtos/edge-network/"
      },
      {
        "title": "Carreiras",
        "link": "/pt-br/carreiras/",
        "flag": "Estamos contratando!"
      },
      {
        "title": "Política de privacidade",
        "link": "/pt-br/documentacao/contratos/politica-de-privacidade/"
      }
    ]
  },
  {
    "title": "Preços",
    "list": [
      {
        "title": "Produtos",
        "link": "/pt-br/precos/"
      },
      {
        "title": "Suporte",
        "link": "/pt-br/suporte/"
      }
    ]
  },
  {
    "title": "Contato",
    "list": [
      {
        "title": "Vendas",
        "link": "/pt-br/contate-vendas/"
      },
      {
        "title": "Suporte",
        "link": "/pt-br/suporte/"
      },
      {
        "title": "Facebook",
        "link": "https://www.facebook.com/aziontech",
        "type": "external"
      },
      {
        "title": "X",
        "link": "https://x.com/aziontech",
        "type": "external"
      },
      {
        "title": "Linkedin",
        "link": "https://www.linkedin.com/company/aziontech",
        "type": "external"
      },
      {
        "title": "Instagram",
        "link": "https://www.instagram.com/aziontech",
        "type": "external"
      },
      {
        "title": "YouTube",
        "link": "https://www.youtube.com/aziontech",
        "type": "external"
      },
      {
        "title": "GitHub",
        "type": "external",
        "link": "https://github.com/aziontech"
      },
      {
        title: "Discord",
        type: "external",
        link: "https://discord.gg/Yp9N7RMVZy"
      },
      {
        title: "Medium",
        link: "https://medium.com/aziontechbr",
        type: "external"
      }
    ]
  }
]

const cta = {
  text: "Para vendas e suporte, entre em contato no ",
  phone: "0800 883 6313"
}

const copyright = '© Azion Technologies ou suas afiliadas. Todos os direitos reservados.';

export default {
  listData,
  cta,
  copyright
}
