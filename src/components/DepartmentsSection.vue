<script setup lang="ts">
interface Department {
  id: string
  name: string
  description: string[]
  iconType: 'monitor' | 'server' | 'hardware' | 'organize' | 'security'
}

const departments: Department[] = [
  {
    id: 'multimedia',
    name: '多媒体部',
    description: [
      '多媒体部主要方向的网站开发、UI设计、视频剪辑和小程序开发均依托多媒体技术，以极强的浸透力进入学校日常生活的方方面面。',
      '四个方向相互联系紧密，网站与小程序需要界面优美的UI设计，界面优美的UI设计需要网站或小程序去实现，它们也可以通过视频剪辑技术以易展现的形式与周围人分享。',
    ],
    iconType: 'monitor',
  },
  {
    id: 'software',
    name: '软件部',
    description: [
      '软件部是科协专攻软件开发的部门其主要方向包括深度学习、APP开发和游戏开发。',
      '软件部注重培养成员在遵循软件工程开发体系的要求，去设计并开发一款或多款具备创新、实用等特点的软件的实践能力，旨在让成员能够承接校内信息化项目的同时，也能够参加校外高水平的竞赛。',
    ],
    iconType: 'server',
  },
  {
    id: 'hardware',
    name: '硬件部',
    description: [
      '硬件部致力于将传统的嵌入式软硬件设计与互联网资源结合，充分体现"互联网+"精神，真正将我们在计算机专业中学习到的知识应用与生活，设计制作真正服务与生活的嵌入式智能硬件。',
      '引导同学们进行科技研发，从而提高同学们的创新意识，加强同学们的动手能力以及理论与实际相结合的能力，培养创新型人才。',
    ],
    iconType: 'hardware',
  },
  {
    id: 'organize',
    name: '组织部',
    description: [
      '组织部是一个协调科协主席团和其他三大技术部门的综合性管理兼学术部门，主管组织、人事工作、素质拓展和团队建设。',
      '负责协调科协的组织建设，管理科协的日常事务，策划和组织科协的各类活动，管理科协成员和内部的各种设施，同时，协调和处理学校、学院领导的指示要求，代表三院科协与学校、学院的各个社团进行沟通交流。',
    ],
    iconType: 'organize',
  },
  {
    id: 'security',
    name: '安全部',
    description: [
      '安全部聚焦网络安全技术，以 CTF 竞赛为实践入口，将竞赛里的解题思路、攻防技巧，转化为真实场景中漏洞挖掘的能力。',
      '从代码逻辑排查到程序底层分析，覆盖 WEB（代码审计、漏洞攻防 ）与二进制（漏洞利用、逆向分析 ）方向，通过 "以赛促战"，让成员掌握从发现风险到实战防御的全流程技能，筑牢安全防线。',
    ],
    iconType: 'security',
  },
]
</script>

<template>
  <section class="departments-section">
    <div class="departments-container">
      <h2 class="departments-title">部门介绍</h2>

      <div class="departments-grid">
        <div v-for="dept in departments" :key="dept.id" class="department-card">
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
              <!-- 芯片主体 -->
              <rect
                x="16"
                y="16"
                width="32"
                height="32"
                rx="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <!-- 芯片内部方块 -->
              <rect
                x="22"
                y="22"
                width="20"
                height="20"
                rx="1"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <!-- 顶部引脚 -->
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
              <!-- 底部引脚 -->
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
              <!-- 左侧引脚 -->
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
              <!-- 右侧引脚 -->
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
              <!-- 中心圆环 -->
              <circle cx="32" cy="20" r="8" stroke="currentColor" stroke-width="2" />
              <!-- 下方连接线 -->
              <line x1="32" y1="28" x2="32" y2="36" stroke="currentColor" stroke-width="2" />
              <!-- 水平连接线 -->
              <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" stroke-width="2" />
              <!-- 左侧分支 -->
              <line x1="20" y1="36" x2="20" y2="44" stroke="currentColor" stroke-width="2" />
              <circle cx="20" cy="48" r="4" stroke="currentColor" stroke-width="2" />
              <!-- 中间分支 -->
              <line x1="32" y1="36" x2="32" y2="48" stroke="currentColor" stroke-width="2" />
              <circle cx="32" cy="52" r="4" stroke="currentColor" stroke-width="2" />
              <!-- 右侧分支 -->
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
              <!-- 盾牌轮廓 -->
              <path
                d="M32 6L8 16V28C8 42 18 54 32 58C46 54 56 42 56 28V16L32 6Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
              />
              <!-- 锁体 -->
              <rect
                x="24"
                y="30"
                width="16"
                height="14"
                rx="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <!-- 锁梁 -->
              <path
                d="M28 30V26C28 23.7909 29.7909 22 32 22C34.2091 22 36 23.7909 36 26V30"
                stroke="currentColor"
                stroke-width="2"
              />
              <!-- 钥匙孔 -->
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

          <div class="department-content">
            <p v-for="(para, index) in dept.description" :key="index" class="department-paragraph">
              {{ para }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.departments-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: linear-gradient(180deg, #04080c 0%, #0a1520 50%, #04080c 100%);
}

.departments-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.departments-title {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
}

.departments-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.department-card {
  flex: 0 1 340px;
  max-width: 400px;
}

.department-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px;
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid rgba(130, 212, 242, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.department-card:hover {
  background: rgba(130, 212, 242, 0.1);
  border-color: rgba(130, 212, 242, 0.4);
  box-shadow:
    0 8px 32px rgba(130, 212, 242, 0.15),
    0 0 60px rgba(111, 208, 206, 0.1);
  transform: translateY(-4px);
}

.department-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--color-blue);
}

.icon-svg {
  width: 100%;
  height: 100%;
}

.department-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 16px;
  text-align: center;
}

.department-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.department-paragraph {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(235, 251, 255, 0.8);
  margin: 0;
  text-align: justify;
}

@media (max-width: 1024px) {
  .departments-section {
    padding: 40px 16px;
  }

  .departments-title {
    font-size: 32px;
  }

  .departments-grid {
    gap: 16px;
  }

  .department-card {
    flex: 0 1 300px;
    padding: 20px;
  }

  .department-icon {
    width: 52px;
    height: 52px;
  }

  .department-name {
    font-size: 18px;
  }

  .department-paragraph {
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .departments-grid {
    grid-template-columns: 1fr;
  }

  .departments-title {
    font-size: 28px;
  }
}
</style>
