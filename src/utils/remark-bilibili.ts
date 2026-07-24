/**
 * 预处理 markdown 字符串：将 ::bilibili{BVxxx} 替换为 B 站视频卡片 HTML
 *
 * 替换发生在 remark 解析之前，remark 会将这段 HTML 识别为 raw HTML 并原样保留。
 */
export function preprocessBilibili(markdown: string): string {
  return markdown.replace(
    /::bilibili\{([A-Za-z0-9]+)\}/g,
    (_, bvid: string) => buildBilibiliCard(bvid),
  )
}

function buildBilibiliCard(bvid: string): string {
  return [
    '<div class="bilibili-card">',
    '<div class="bilibili-card-inner">',
    `<iframe src="//player.bilibili.com/player.html?bvid=${bvid}&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" loading="lazy" class="bilibili-iframe"></iframe>`,
    '</div>',
    `<a href="https://www.bilibili.com/video/${bvid}" target="_blank" rel="noopener" class="bilibili-link">在 Bilibili 中打开 →</a>`,
    '</div>',
  ].join('\n')
}
