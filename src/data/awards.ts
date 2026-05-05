export interface Award {
  name: string;
  award: Record<string, number>;
  people: string[];
}

export const awards: Award[] = [
  {
    name: "中国大学生服务外包创新创业大赛",
    award: {
      国二: 1,
      国三: 2,
      省三: 6,
    },
    people: [
      "唐沈逸",
      "罗煜华",
      "王宇诚",
      "孙鸣韬",
      "孙培正",
      "谭佳卉",
      "张琥",
      "尹晓洋",
      "程政柳",
    ],
  },
  {
    name: "蓝桥杯全国软件和信息技术专业人才大赛",
    award: {
      国一: 1,
      国二: 3,
      国三: 2,
    },
    people: ["郑承睿", "王振豪", "程政柳", "孙培正", "刘凯", "赵家乐"],
  },
  {
    name: "全国大学生数学建模竞赛",
    award: {
      国一: 1,
      国二: 1,
      国三: 3,
    },
    people: ["谭佳卉", "唐沈逸", "邓文强", "王振豪"],
  },
  {
    name: "网络技术挑战赛",
    award: {
      国三: 2,
      省三: 2,
    },
    people: ["唐沈逸", "张洛", "谭佳卉", "李英苹"],
  },
  {
    name: "全国大学生电子设计竞赛",
    award: {
      国二: 2,
      省三: 1,
    },
    people: ["赵辉", "孙培正", "陆昊"],
  },
  {
    name: "全国高校计算机能力挑战赛",
    award: {
      国三: 3,
    },
    people: ["张琥", "罗煜华", "任嘉轩"],
  },
  {
    name: "美国大学生数学建模竞赛",
    award: {
      国一: 1,
    },
    people: ["谭佳卉"],
  },
  {
    name: "中国国际大学生创新大赛",
    award: {
      国一: 1,
      国三: 1,
    },
    people: ["尹晓洋", "唐沈逸"],
  },
  {
    name: "五一数学建模竞赛",
    award: {
      国二: 1,
    },
    people: ["谭佳卉"],
  },
  {
    name: "全国密码技术竞赛",
    award: {
      国二: 1,
    },
    people: ["甘华龙"],
  },
  {
    name: "iCAN大学生创新创业大赛",
    award: {
      省一: 1,
      省二: 1,
      省三: 1,
    },
    people: ["唐沈逸", "程政柳", "邓文强"],
  },
  {
    name: "中国软件杯大学生软件设计大赛",
    award: {
      国三: 1,
    },
    people: ["张琥"],
  },
  {
    name: "ISCC",
    award: {
      国三: 1,
    },
    people: ["郭嘉宝"],
  },
  {
    name: "MathorCup数学应用挑战赛",
    award: {
      国三: 1,
    },
    people: ["谭佳卉"],
  },
];

export const awardLevelColors: Record<string, string> = {
  国一: "#FFD700",
  国二: "#C0C0C0",
  国三: "#CD7F32",
  省一: "#82D4F2",
  省二: "#6FD0CE",
  省三: "#4FB8B6",
};

export function getAwardLevelColor(level: string): string {
  return awardLevelColors[level] || "#82D4F2";
}
