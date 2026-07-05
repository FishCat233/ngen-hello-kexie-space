<script setup lang="ts">
const buttons = [
  {
    id: 'qq-group',
    label: '加入我们',
    icon: 'qq',
    href: 'https://api.kexie.space/recruitment-qq-group',
  },
  {
    id: 'terminal',
    label: '练习编程',
    icon: 'terminal',
    href: 'https://oj.kexie.space',
  },
  {
    id: 'knowledge',
    label: '知识库',
    icon: 'server',
    href: 'https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb',
  },
  {
    id: 'qq-channel',
    label: 'QQ频道',
    icon: 'hash',
    href: 'https://pd.qq.com/s/5pxzsijx0',
  },
]
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <!-- 标题：# 前缀模式 -->
      <h1 class="hero-title"><span class="title-accent">#</span> 桂电三院科协</h1>

      <!-- 下方：标语 -->
      <p class="hero-slogan">科技融入梦想，创新点缀人生</p>

      <!-- 底部：功能按钮 -->
      <div class="hero-buttons">
        <a v-for="button in buttons" :key="button.id" :href="button.href" class="hero-button">
          <!-- QQ群图标 -->
          <svg
            v-if="button.icon === 'qq'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.21 0 6.287.257 6.287-.43 0-.687-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"
            />
          </svg>

          <!-- 终端图标 -->
          <svg
            v-else-if="button.icon === 'terminal'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>

          <!-- 服务器图标 -->
          <svg
            v-else-if="button.icon === 'server'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>

          <!-- #图标 -->
          <svg
            v-else-if="button.icon === 'hash'"
            class="hero-button-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>

          <span>{{ button.label }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-white);
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIj48bGluZSB4MT0iMTIwIiB5MT0iMCIgeDI9IjEyMCIgeTI9IjEyMCIgc3Ryb2tlPSIjRDBEMEQwIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIvPjxsaW5lIHgxPSIwIiB5MT0iMTIwIiB4Mj0iMTIwIiB5Mj0iMTIwIiBzdHJva2U9IiNEMEQwRDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCA0Ii8+PC9zdmc+');
}

.hero-content {
  width: 100%;
  max-width: 800px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

@media (max-width: 1024px) {
  .hero-content {
    padding: 0 24px;
    gap: 20px;
  }
}

/* # 标题模式 */
.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
}

.title-accent {
  color: var(--color-blue);
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 40px;
  }
}

.hero-slogan {
  font-size: 18px;
  color: var(--color-text);
  letter-spacing: 2px;
}

@media (max-width: 1024px) {
  .hero-slogan {
    font-size: 16px;
  }
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 1024px) {
  .hero-buttons {
    gap: 10px;
    margin-top: 12px;
  }
}

.hero-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 140px;
  padding: 12px 16px;
  border: 1px solid var(--color-cyan);
  background: var(--color-white);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: background 0s;
}

/* 色块滑切 hover */
.hero-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-cyan);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.hero-button:hover::before {
  transform: translateX(0);
}

.hero-button:hover {
  color: var(--color-white);
}

.hero-button > * {
  position: relative;
  z-index: 1;
}

.hero-button-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .hero-button {
    width: 130px;
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
