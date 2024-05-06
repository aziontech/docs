// import { footerDict } from '../translation-checkers';

// export default footerDict({
// 	data: [
// 		{
// 			title: "Resources",
// 			links: [
// 				{
// 					text: "Blog",
// 					route: "/en/blog/"
// 				},
// 				{
// 					text: "Documentation",
// 					route: "/en/documentation/"
// 				},
// 				{
// 					text: "Marketplace",
// 					route: "/en/marketplace/"
// 				},
// 				{
// 					text: "Compliance",
// 					route: "/en/compliance/"
// 				},
// 				{
// 					text: "Success Cases",
// 					route: "/en/success-case/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Company",
// 			links: [
// 				{
// 					text: "About us",
// 					route: "/en/about-us/"
// 				},
// 				{
// 					text: "Azion Edge Network",
// 					route: "/en/products/edge-network/"
// 				},
// 				{
// 					text: "Careers",
// 					route: "/en/careers",
// 					flag: "We're hiring!"
// 				},
// 				{
// 					text: "Privacy Policy",
// 					route: "/en/documentation/agreements/privacy-policy/"
// 				},
// 				{
// 					text: "Roadmap",
// 					route: "/en/roadmap/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Pricing",
// 			links: [
// 				{
// 					text: "Products",
// 					route: "/en/pricing/"
// 				},
// 				{
// 					text: "Support",
// 					route: "/en/support/"
// 				}
// 			]
// 		},
// 		{
// 			title: "Contact Us",
// 			links: [
// 				{
// 					text: "Sales",
// 					route: "/en/pricing/"
// 				},
// 				{
// 					text: "Support",
// 					route: "/en/support/"
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
// 					route: "https://medium.com/aziontech",
// 					type: "external"
// 				}
// 			]
// 		}
// 	]
// })

const listData = [
  {
    title: "Resources",
    list: [
      {
        title: "Blog",
        link: "/en/blog/"
      },
      {
        title: "Documentation",
        link: "/en/documentation/"
      },
      {
        title: "Marketplace",
        link: "/en/marketplace/"
      },
      {
        title: "Compliance",
        link: "/en/compliance/"
      },
      {
        title: "Resource Hub",
        link: "/en/resource-hub/"
      }
    ]
  },
  {
    title: "Company",
    list: [
      {
        title: "About us",
        link: "/en/about-us/"
      },
      {
        title: "Our Network",
        link: "/en/products/edge-network/"
      },
      {
        title: "Careers",
        link: "/en/careers/",
      },
      {
        title: "Privacy Policy",
        link: "/en/documentation/agreements/privacy-policy/"
      },
      {
        title: "Roadmap",
        link: "/en/roadmap/"
      }
    ]
  },
  {
    title: "Pricing",
    list: [
      {
        title: "Products",
        link: "/en/pricing/"
      },
      {
        title: "Support",
        link: "/en/support/"
      }
    ]
  },
  {
    title: "Contact Us",
    list: [
      {
        title: "Sales",
        link: "/en/pricing/"
      },
      {
        title: "Support",
        link: "/en/support/"
      },
      {
        title: "Facebook",
        link: "https://www.facebook.com/aziontech",
        target: "_blank",
      },
      {
        title: "X",
        link: "https://x.com/aziontech",
        target: "_blank",
      },
      {
        title: "Linkedin",
        link: "https://www.linkedin.com/company/aziontech",
        target: "_blank",
      },
      {
        title: "Instagram",
        link: "https://www.instagram.com/aziontech",
        target: "_blank"
      },
      {
        title: "YouTube",
        link: "https://www.youtube.com/aziontech",
        target: "_blank"
      },
      {
        title: "GitHub",
        target: "_blank",
        link: "https://github.com/aziontech"
      },
      {
        title: "Discord",
        target: "_blank",
        link: "https://discord.gg/Yp9N7RMVZy",
      },
      {
        title: "Medium",
        link: "https://medium.com/aziontech",
        target: "_blank"
      }
    ]
  }
]

const cta =
{
  text: "For support and sales, please call ", phone: "+1 (833) 33-AZION",
}

const socialButtons = [
  {
    title: "Discord",
    target: "_blank",
    link: "https://discord.gg/Yp9N7RMVZy",
    icon: "pi pi-discord"
  },
  {
    title: "Facebook",
    link: "https://www.facebook.com/aziontech",
    target: "_blank",
    icon: "pi pi-facebook"
  },
  {
    title: "X",
    link: "https://x.com/aziontech",
    target: "_blank",
    icon: "ai ai-twitter"
  },
  {
    title: "Linkedin",
    link: "https://www.linkedin.com/company/aziontech",
    target: "_blank",
    icon: "pi pi-linkedin"
  },
]

const copyright = '© Azion Technologies, Inc or its affiliates. All rights reserved.';

export default {
  listData,
  cta,
  copyright,
  socialButtons
}
