export const siteConfig = {
  name: "桂电三院科协",
  description: "桂林电子科技大学计算机与信息安全学院大学生科技协会网站",
  url: "https://kexie.space",
  
  contact: {
    qqGroup: "https://api.kexie.space/recruitment-qq-group",
    qqChannel: "https://pd.qq.com/s/5pxzsijx0",
    github: "https://github.com/sanyuankexie",
    wechat: "",
    bilibili: "",
  },
  
  resources: {
    oj: "https://oj.kexie.space",
    knowledge: "https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb",
  },
  
  social: {
    github: "https://github.com/sanyuankexie/hello.kexie.space",
    comments: "https://github.com/sanyuankexie/hello.kexie.space/issues/6",
  },
  
  meta: {
    keywords: [
      "桂林电子科技大学",
      "桂电",
      "计算机与信息安全学院",
      "大学生",
      "科技协会",
      "科协",
      "三院",
      "计算机",
      "计院",
      "三院科协",
    ],
  },
  
  theme: {
    colors: {
      black: "#04080c",
      blue: "#82d4f2",
      cyan: "#6fd0ce",
      white: "#ebfbff",
      blueDark: "#5cb8d9",
      cyanDark: "#4db8b6",
      blackLight: "#0a1520",
    },
  },
};

export type SiteConfig = typeof siteConfig;
