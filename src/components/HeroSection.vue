<script setup lang="ts">
// 按钮配置
const buttons = [
  {
    id: 'qq-group',
    label: '加入我们',
    icon: 'qq',
    href: '#',
  },
  {
    id: 'terminal',
    label: '练习编程',
    icon: 'terminal',
    href: '#',
  },
  {
    id: 'knowledge',
    label: '知识库',
    icon: 'server',
    href: '#',
  },
  {
    id: 'qq-channel',
    label: 'QQ频道',
    icon: 'hash',
    href: '#',
  },
]
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <!-- 上方：标题 -->
      <h1 class="hero-title">桂电三院科协</h1>

      <!-- 中间：LOGO -->
      <div class="hero-logo-container">
        <img src="/logo.png" alt="科协LOGO" class="hero-logo" />
        <!-- 向下延伸的树干线条 -->
        <div class="tree-trunk"></div>
      </div>

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
