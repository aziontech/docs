const listData = [
  {
    title: "Company",
    list: [
      {
        title: "About us",
        link: "/en/about-us/"
      },
      {
        title: "Our Network",
        link: "/en/products/our-network/"
      },
      {
        title: "Roadmap",
        link: "/en/roadmap/"
      },
      {
        title: "Careers",
        link: "/en/careers/",
      },
      {
        title: "Compliance",
        link: "/en/compliance/"
      },
      {
        title: "Privacy Policy",
        link: "/en/documentation/agreements/privacy-policy/"
      },
    ]
  },
  {
    title: "Resources",
    list: [
      {
        title: "Blog",
        link: "/en/blog/"
      },
      {
        title: "Resource Hub",
        link: "/en/resource-hub/"
      },
      {
        title: "Learning",
        link: "/en/learning/"
      },
      {
        title: "Marketplace",
        link: "/en/marketplace/"
      },
    ]
  },
  {
    title: "Getting Started",
    list: [
      {
        title: "Start for free",
        link: "https://console.azion.com/signup"
      },
      {
        title: "Documentation",
        link: "/en/documentation/"
      },
      {
        title: "Pricing",
        link: "/en/pricing/"
      },
      {
        title: "Contact Sales",
        link: "/en/contact-sales/"
      },
      {
        title: "Professional Services",
        link: "/en/professional-services/"
      },
    ]
  },
]

const cta =
{
  text: "For support and sales, please call ", phone: "+1 (833) 33-AZION",
}

const socialButtons = [
  {
    title: "GitHub",
    target: "_blank",
    link: "https://github.com/aziontech",
    icon: "pi pi-github"
  },
  {
    title: "Linkedin",
    link: "https://www.linkedin.com/company/aziontech",
    target: "_blank",
    icon: "pi pi-linkedin"
  },
  {
    title: "YouTube",
    link: "https://www.youtube.com/aziontech",
    target: "_blank",
    icon: "pi pi-youtube"
  },
  {
    title: "X",
    link: "https://x.com/aziontech",
    target: "_blank",
    icon: "ai ai-twitter"
  },
  {
    title: "Instagram",
    link: "https://www.instagram.com/aziontech",
    target: "_blank",
    icon: "pi pi-instagram"
  },
  {
    title: "Discord",
    target: "_blank",
    link: "https://discord.gg/Yp9N7RMVZy",
    icon: "pi pi-discord"
  },
  // {
  //   title: "Medium",
  //   link: "https://medium.com/aziontech",
  //   target: "_blank",
  //   icon: "pi pi-medium"
  // },
]

const copyright = '© Azion Technologies, Inc or its affiliates. All rights reserved.';

export default {
  listData,
  cta,
  copyright,
  socialButtons
}
