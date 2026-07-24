<script setup lang="ts">
import { departments } from '../data/departments'
import BackButton from '../components/BackButton.vue'
</script>

<template>
  <div class="organize-page">
    <div class="organize-container">
      <BackButton />

      <div class="organize-header">
        <h1 class="organize-title"><span class="title-accent">#</span> 组织架构</h1>
      </div>

      <div class="organize-grid">
        <div v-for="(dept, index) in departments" :key="dept.id" class="department-card">
          <div
            class="department-left"
            :style="{ background: index % 2 === 0 ? 'var(--color-blue)' : 'var(--color-cyan)' }"
          >
            <div class="department-icon">
              <!-- 显示器图标 - 多媒体部 -->
              <svg
                v-if="dept.iconType === 'monitor'"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-svg"
              >
                <rect
                  x="8"
                  y="8"
                  width="48"
                  height="36"
                  rx="3"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line x1="8" y1="16" x2="56" y2="16" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="17" cy="12" r="1.5" fill="currentColor" />
                <circle cx="22" cy="12" r="1.5" fill="currentColor" />
                <rect
                  x="24"
                  y="48"
                  width="16"
                  height="4"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <line x1="32" y1="44" x2="32" y2="48" stroke="currentColor" stroke-width="2" />
              </svg>

              <!-- 服务器图标 - 软件部 -->
              <svg
                v-else-if="dept.iconType === 'server'"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-svg"
              >
                <rect
                  x="12"
                  y="6"
                  width="40"
                  height="20"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <rect
                  x="12"
                  y="30"
                  width="40"
                  height="20"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="18" cy="16" r="2" fill="currentColor" />
                <circle cx="18" cy="40" r="2" fill="currentColor" />
                <line
                  x1="26"
                  y1="16"
                  x2="44"
                  y2="16"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="26"
                  y1="40"
                  x2="44"
                  y2="40"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>

              <!-- 芯片图标 - 硬件部 -->
              <svg
                v-else-if="dept.iconType === 'hardware'"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-svg"
              >
                <rect
                  x="16"
                  y="16"
                  width="32"
                  height="32"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <rect
                  x="22"
                  y="22"
                  width="20"
                  height="20"
                  rx="1"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <line
                  x1="24"
                  y1="16"
                  x2="24"
                  y2="10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="32"
                  y1="16"
                  x2="32"
                  y2="10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="40"
                  y1="16"
                  x2="40"
                  y2="10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="24"
                  y1="48"
                  x2="24"
                  y2="54"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="32"
                  y1="48"
                  x2="32"
                  y2="54"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="40"
                  y1="48"
                  x2="40"
                  y2="54"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="16"
                  y1="24"
                  x2="10"
                  y2="24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="16"
                  y1="32"
                  x2="10"
                  y2="32"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="16"
                  y1="40"
                  x2="10"
                  y2="40"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="48"
                  y1="24"
                  x2="54"
                  y2="24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="48"
                  y1="32"
                  x2="54"
                  y2="32"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <line
                  x1="48"
                  y1="40"
                  x2="54"
                  y2="40"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>

              <!-- 组织管理图标 - 组织部 -->
              <svg
                v-else-if="dept.iconType === 'organize'"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-svg"
              >
                <circle cx="32" cy="20" r="8" stroke="currentColor" stroke-width="2" />
                <line x1="32" y1="28" x2="32" y2="36" stroke="currentColor" stroke-width="2" />
                <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" stroke-width="2" />
                <line x1="20" y1="36" x2="20" y2="44" stroke="currentColor" stroke-width="2" />
                <circle cx="20" cy="48" r="4" stroke="currentColor" stroke-width="2" />
                <line x1="32" y1="36" x2="32" y2="48" stroke="currentColor" stroke-width="2" />
                <circle cx="32" cy="52" r="4" stroke="currentColor" stroke-width="2" />
                <line x1="44" y1="36" x2="44" y2="44" stroke="currentColor" stroke-width="2" />
                <circle cx="44" cy="48" r="4" stroke="currentColor" stroke-width="2" />
              </svg>

              <!-- 盾牌与锁图标 - 安全部 -->
              <svg
                v-else-if="dept.iconType === 'security'"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-svg"
              >
                <path
                  d="M32 6L8 16V28C8 42 18 54 32 58C46 54 56 42 56 28V16L32 6Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
                <rect
                  x="24"
                  y="30"
                  width="16"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M28 30V26C28 23.7909 29.7909 22 32 22C34.2091 22 36 23.7909 36 26V30"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="32" cy="36" r="2" fill="currentColor" />
                <line
                  x1="32"
                  y1="38"
                  x2="32"
                  y2="42"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="department-name">{{ dept.name }}</h3>
          </div>
          <div class="department-right">
            <div class="department-content">
              <p
                v-for="(para, paraIndex) in dept.description"
                :key="paraIndex"
                class="department-paragraph"
              >
                {{ para }}
              </p>
            </div>
            <a
              v-if="dept.website"
              :href="dept.website.url"
              target="_blank"
              rel="noopener noreferrer"
              class="department-link"
            >
              <span>→ {{ dept.website.label }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.organize-page {
  width: 100%;
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.organize-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.organize-header {
  margin-bottom: 40px;
}

.organize-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.organize-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.department-card {
  width: 100%;
  display: flex;
  flex-direction: row;
  min-height: 200px;
}

/* 左区 - 实心色块 */
.department-left {
  width: 220px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  gap: 16px;
}

.department-left .department-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
}

.department-left .department-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
  text-align: center;
}

.icon-svg {
  width: 100%;
  height: 100%;
}

/* 右区 - 镂空边框 */
.department-right {
  flex: 1;
  border: 2px solid var(--color-cyan);
  border-left: none;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.department-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-paragraph {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0;
  text-align: justify;
}

.department-link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  border: 2px solid var(--color-cyan);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: background 0s;
  align-self: flex-end;
}

.department-link::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-cyan);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.department-link:hover::before {
  transform: translateX(0);
}

.department-link:hover {
  color: var(--color-white);
}

.department-link > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 1024px) {
  .organize-page {
    padding: 24px 16px 10vh;
  }

  .organize-title {
    font-size: 32px;
  }

  .organize-grid {
    gap: 16px;
  }

  .department-card {
    flex-direction: column;
    min-height: auto;
  }

  .department-left {
    width: 100%;
    min-width: auto;
    flex-direction: row;
    padding: 20px;
    gap: 16px;
  }

  .department-left .department-icon {
    width: 52px;
    height: 52px;
  }

  .department-left .department-name {
    font-size: 18px;
    text-align: left;
  }

  .department-right {
    border-left: 2px solid var(--color-cyan);
  }

  .department-paragraph {
    font-size: 13px;
  }
}
</style>
