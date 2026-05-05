<script setup lang="ts">
const buttons = [
  {
    id: "qq-group",
    label: "加入我们",
    icon: "qq",
    href: "https://api.kexie.space/recruitment-qq-group",
  },
  {
    id: "terminal",
    label: "练习编程",
    icon: "terminal",
    href: "https://oj.kexie.space",
  },
  {
    id: "knowledge",
    label: "知识库",
    icon: "server",
    href: "https://ccn80b5bgw86.feishu.cn/wiki/CKD8wrIVyi1E9VkdUVGclVFxnlb",
  },
  {
    id: "qq-channel",
    label: "QQ频道",
    icon: "hash",
    href: "https://pd.qq.com/s/5pxzsijx0",
  },
];
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">桂电三院科协</h1>

      <div class="hero-logo-container">
        <picture>
          <source srcset="/logo.webp" type="image/webp" />
          <img src="/logo.png" alt="科协LOGO" class="hero-logo" />
        </picture>
        <div class="tree-trunk"></div>
      </div>

      <p class="hero-slogan">科技融入梦想，创新点缀人生</p>

      <div class="hero-buttons">
        <a v-for="button in buttons" :key="button.id" :href="button.href" class="hero-button">
          <svg v-if="button.icon === 'qq'" class="hero-button-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 4.078.43 6.29.43 2.21 0 6.287.257 6.287-.43 0-.687-1.768-1.182-1.768-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z" />
          </svg>

          <svg v-else-if="button.icon === 'terminal'" class="hero-button-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>

          <svg v-else-if="button.icon === 'server'" class="hero-button-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>

          <svg v-else-if="button.icon === 'hash'" class="hero-button-icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: transparent;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
  max-width: 800px;
  width: 100%;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(135deg,
      var(--color-blue) 0%,
      var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 32px 0;
  padding: 0;
}

.hero-logo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.hero-logo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-blue);
  box-shadow:
    0 0 40px rgba(130, 212, 242, 0.3),
    0 0 80px rgba(111, 208, 206, 0.2);
  animation: logo-glow 3s ease-in-out infinite alternate;
}

@keyframes logo-glow {
  0% {
    box-shadow:
      0 0 40px rgba(130, 212, 242, 0.3),
      0 0 80px rgba(111, 208, 206, 0.2);
  }

  100% {
    box-shadow:
      0 0 60px rgba(130, 212, 242, 0.5),
      0 0 100px rgba(111, 208, 206, 0.3);
  }
}

.tree-trunk {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, var(--color-blue), transparent);
  margin-top: 16px;
}

.hero-slogan {
  font-size: 24px;
  color: var(--color-white);
  opacity: 0.9;
  margin: 0 0 48px 0;
  font-weight: 400;
  letter-spacing: 2px;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.hero-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 12px;
  color: var(--color-white);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hero-button:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(130, 212, 242, 0.2);
}

.hero-button-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 40px;
    margin-bottom: 24px;
  }

  .hero-logo {
    width: 160px;
    height: 160px;
  }

  .hero-slogan {
    font-size: 20px;
    margin-bottom: 36px;
  }

  .hero-buttons {
    gap: 12px;
  }

  .hero-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 16px;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .hero-logo {
    width: 140px;
    height: 140px;
  }

  .tree-trunk {
    height: 40px;
  }

  .hero-slogan {
    font-size: 18px;
    margin-bottom: 32px;
    letter-spacing: 1px;
  }

  .hero-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 320px;
  }

  .hero-button {
    width: 100%;
    justify-content: center;
    padding: 12px 16px;
    font-size: 13px;
  }
}
</style>
