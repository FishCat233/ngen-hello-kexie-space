export interface Project {
  author: string
  authorAvatar: string
  name: string
  description: string
  language: string
  languageColor: string
  url: string
}

const languageColors: Record<string, string> = {
  Dart: '#00B4AB',
  Flutter: '#00B4AB',
  Kotlin: '#7F52FF',
  Java: '#007396',
  Python: '#3776AB',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Vue: '#4FC08D',
  React: '#61DAFB',
  Go: '#00ADD8',
  Rust: '#DEA584',
  'C++': '#00599C',
  'C#': '#512BD4',
  C: '#A8B9CC',
  Swift: '#F05138',
  HTML: '#E34F26',
  CSS: '#1572B6',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Shell: '#89E051',
}

export const projects: Project[] = [
  {
    author: 'wilinz',
    authorAvatar: 'https://github.com/wilinz.png',
    name: 'GUET 校园圈',
    description: '可以查看课表等教务信息，支持安卓和IOS',
    language: 'Dart',
    languageColor: languageColors.Dart,
    url: 'https://github.com/wilinz/guet_campus_circle',
  },
  {
    author: 'LukeXeon',
    authorAvatar: 'https://github.com/LukeXeon.png',
    name: 'Flexml',
    description: '🚀基于Litho的Android高性能动态业务容器',
    language: 'Kotlin',
    languageColor: languageColors.Kotlin,
    url: 'https://github.com/sanyuankexie/Flexml',
  },
  {
    author: 'visualDust',
    authorAvatar: 'https://github.com/visualDust.png',
    name: 'neetbox',
    description: 'A naive dashboard for local/remote/distributed deep learning project monitoring.',
    language: 'Python',
    languageColor: languageColors.Python,
    url: 'https://github.com/visualDust/neetbox',
  },
  {
    author: 'visualDust',
    authorAvatar: 'https://github.com/visualDust.png',
    name: 'ml.akasaki.space',
    description: '帮助入门基于深度学习的计算机视觉，访问 https://ml.akasaki.space 查看。',
    language: 'Python',
    languageColor: languageColors.Python,
    url: 'https://ml.akasaki.space/',
  },
  {
    author: 'yadajin',
    authorAvatar: 'https://github.com/yadajin.png',
    name: 'OneNet-IoT',
    description: '基于OneNet平台okHttp协议的远程环境监控App开发.',
    language: 'Python',
    languageColor: languageColors.Java,
    url: 'https://github.com/sanyuankexie/OneNet-IoT',
  },
  {
    author: 'msqtt',
    authorAvatar: 'https://github.com/msqtt.png',
    name: 'OneNet-IoT',
    description: '能把图片转换成字符画的简单cli 🎉.',
    language: 'Python',
    languageColor: languageColors.Go,
    url: 'https://github.com/orzation/bobibo',
  },
]

export function getLanguageColor(language: string): string {
  return languageColors[language] || '#82d4f2'
}
