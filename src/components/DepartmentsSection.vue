<script setup lang="ts">
interface Department {
  id: string
  name: string
  description: string[]
  website?: {
    url: string
    label: string
  }
}

const departments: Department[] = [
  {
    id: 'multimedia',
    name: '多媒体部',
    description: [
      '多媒体部主要方向的网站开发、UI设计、视频剪辑、小程序开发和编辑方向均依托多媒体技术，以极强的浸透力进入学校日常生活的方方面面。',
      '五个方向相互联系紧密，网站与小程序需要界面优美的UI设计，界面优美的UI设计需要网站或小程序去实现，它们也可以通过视频剪辑技术以易展现的形式与周围人分享，编辑方向则负责内容创作与文案策划，为技术展示提供优质的文字支撑。',
    ],
  },
  {
    id: 'software',
    name: '软件部',
    description: [
      '软件部是科协专攻软件开发的部门其主要方向包括深度学习、APP开发和游戏开发。',
      '软件部注重培养成员在遵循软件工程开发体系的要求，去设计并开发一款或多款具备创新、实用等特点的软件的实践能力，旨在让成员能够承接校内信息化项目的同时，也能够参加校外高水平的竞赛。',
    ],
  },
  {
    id: 'hardware',
    name: '硬件部',
    description: [
      '硬件部致力于将传统的嵌入式软硬件设计与互联网资源结合，充分体现"互联网+"精神，真正将我们在计算机专业中学习到的知识应用与生活，设计制作真正服务与生活的嵌入式智能硬件。',
      '引导同学们进行科技研发，从而提高同学们的创新意识，加强同学们的动手能力以及理论与实际相结合的能力，培养创新型人才。',
    ],
  },
  {
    id: 'organize',
    name: '组织部',
    description: [
      '组织部是一个协调科协主席团和其他三大技术部门的综合性管理兼学术部门，主管组织、人事工作、素质拓展和团队建设。',
      '负责协调科协的组织建设，管理科协的日常事务，策划和组织科协的各类活动，管理科协成员和内部的各种设施，同时，协调和处理学校、学院领导的指示要求，代表三院科协与学校、学院的各个社团进行沟通交流。',
    ],
  },
  {
    id: 'security',
    name: '安全部',
    description: [
      '安全部聚焦网络安全技术，以 CTF 竞赛为实践入口，将竞赛里的解题思路、攻防技巧，转化为真实场景中漏洞挖掘的能力。',
      '从代码逻辑排查到程序底层分析，覆盖 WEB（代码审计、漏洞攻防 ）与二进制（漏洞利用、逆向分析 ）方向，通过 "以赛促战"，让成员掌握从发现风险到实战防御的全流程技能，筑牢安全防线。',
    ],
    website: {
      url: 'https://hjsec.github.io',
      label: '安全部主页',
    },
  },
]
</script>

<template>
  <section class="departments-section">
    <div class="ghost-char" v-parallax="0.05" aria-hidden="true">部</div>
    <div class="departments-container">
      <header class="departments-header" v-reveal>
        <p class="section-eyebrow">DEPARTMENTS</p>
        <h2 class="departments-title"><span class="title-accent">#</span> 部门介绍</h2>
        <p class="section-note">五个部门，各有所长</p>
      </header>

      <div class="departments-list">
        <article
          v-for="(dept, index) in departments"
          :key="dept.id"
          class="department-row"
          v-reveal
          :style="{ '--reveal-delay': `${index * 70}ms` }"
        >
          <div class="department-block" :class="index % 2 === 0 ? 'is-blue' : 'is-cyan'">
            <span class="department-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="department-name">{{ dept.name }}</h3>
          </div>
          <div class="department-body">
            <p
              v-for="(para, paraIndex) in dept.description"
              :key="paraIndex"
              class="department-paragraph"
            >
              {{ para }}
            </p>
            <a
              v-if="dept.website"
              :href="dept.website.url"
              target="_blank"
              rel="noopener noreferrer"
              class="department-link"
            >
              {{ dept.website.label }}<span class="department-link-arrow">›</span>
            </a>
          </div>
        </article>
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
  padding: 12vh 24px;
  background: var(--color-gray);
  overflow: hidden;
}

/* 淡墨汉字 - 背景纹理 */
.ghost-char {
  position: absolute;
  right: -2vw;
  top: 50%;
  transform: translateY(calc(-50% + var(--parallax-y, 0px)));
  font-family: var(--heading);
  font-weight: 800;
  font-size: 60vh;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.5px #d9d5cb;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  will-change: transform;
}

.departments-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.departments-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.section-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.4em;
  color: var(--color-muted);
  margin: 0;
  text-transform: uppercase;
}

.departments-title {
  font-family: var(--heading);
  font-size: 56px;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.title-accent {
  color: var(--color-blue);
}

.section-note {
  font-family: var(--sans);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-muted);
  margin: 0;
  letter-spacing: 0.04em;
}

.departments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

/* 黄金分割：38.2% : 61.8% */
.department-row {
  display: grid;
  grid-template-columns: 38.2fr 61.8fr;
  min-height: 190px;
  transition: box-shadow 0.3s ease;
}

.department-row:hover {
  box-shadow: 0 12px 32px rgba(10, 15, 22, 0.08);
}

/* 左区 - 实心色块（蓝/青交替） */
.department-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  padding: 32px;
}

.department-block.is-blue {
  background: var(--color-blue);
}

.department-block.is-cyan {
  background: var(--color-cyan);
}

.department-index {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--color-white);
  opacity: 0.85;
}

.department-name {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-white);
  margin: 0;
  letter-spacing: 0.02em;
}

/* 右区 - 白底细线卡片 */
.department-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 32px 36px;
  background: var(--color-white);
  border: 1px solid var(--color-hairline);
  border-left: none;
}

.department-paragraph {
  font-size: 14px;
  line-height: 1.9;
  color: var(--color-text);
  margin: 0;
  text-align: justify;
}

.department-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  margin-top: 4px;
  color: var(--color-blue);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.department-link-arrow {
  font-size: 16px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.department-link:hover {
  color: var(--color-cyan);
}

.department-link:hover .department-link-arrow {
  transform: translateX(3px);
}

@media (max-width: 1024px) {
  .departments-section {
    padding: 10vh 16px;
  }

  .ghost-char {
    font-size: 34vh;
    right: -8vw;
  }

  .departments-container {
    gap: 40px;
  }

  .departments-title {
    font-size: 32px;
  }

  .department-row {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .department-block {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
  }

  .department-name {
    font-size: 20px;
  }

  .department-body {
    border-left: 1px solid var(--color-hairline);
    border-top: none;
    padding: 24px;
  }

  .department-paragraph {
    font-size: 13px;
  }
}
</style>
