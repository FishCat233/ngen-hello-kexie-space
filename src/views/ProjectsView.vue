<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projects, demoProjects, competitionProjects } from '../data/projects'
import { loadProjects } from '../api/cms'
import type { Project, CompetitionProject } from '../data/projects'
import BackButton from '../components/BackButton.vue'
import ProjectCard from '../components/ProjectCard.vue'
import CompetitionProjectCard from '../components/CompetitionProjectCard.vue'

const openProject = (url: string) => {
  window.open(url, '_blank')
}

const featuredProjects = ref<Project[]>(projects)
const displayedCompetitionProjects = ref<CompetitionProject[]>(competitionProjects)
const displayedDemoProjects = ref<Project[]>(demoProjects)
const loadError = ref(false)

onMounted(async () => {
  const result = await loadProjects({
    featured: projects,
    competition: competitionProjects,
    demo: demoProjects,
  })
  featuredProjects.value = result.data.featured
  displayedCompetitionProjects.value = result.data.competition
  displayedDemoProjects.value = result.data.demo
  loadError.value = result.source === 'fallback'
})
</script>

<template>
  <div class="projects-page">
    <div class="projects-container">
      <BackButton />

      <div class="projects-header">
        <h1 class="projects-title"><span class="title-accent">#</span> 科协项目活动</h1>
        <p class="projects-subtitle">科协成员的部分项目活动</p>
      </div>

      <p v-if="loadError" class="cms-notice">内容服务暂不可用，当前显示内置数据。</p>

      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">科协优秀项目</h2>
          <p class="section-subtitle">科协成员开发的优秀项目</p>
        </div>

        <div class="projects-grid">
          <ProjectCard
            v-for="(project, index) in featuredProjects"
            :key="index"
            :project="project"
            @click="openProject"
          />
        </div>
        <p v-if="featuredProjects.length === 0" class="section-empty">暂无优秀项目</p>
      </div>

      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">竞赛展示项目</h2>
          <p class="section-subtitle">部分参与竞赛的可展示项目</p>
        </div>

        <div class="projects-grid">
          <CompetitionProjectCard
            v-for="(project, index) in displayedCompetitionProjects"
            :key="'comp-' + index"
            :project="project"
            @click="openProject"
          />
        </div>
        <p v-if="displayedCompetitionProjects.length === 0" class="section-empty">
          暂无竞赛展示项目
        </p>
      </div>

      <div class="projects-section">
        <div class="section-header">
          <h2 class="section-title">学习演示项目</h2>
          <p class="section-subtitle">近年科协成员在学习中开发的部分演示项目</p>
        </div>

        <div class="projects-grid">
          <ProjectCard
            v-for="(project, index) in displayedDemoProjects"
            :key="'demo-' + index"
            :project="project"
            @click="openProject"
          />
        </div>
        <p v-if="displayedDemoProjects.length === 0" class="section-empty">暂无学习演示项目</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.projects-container {
  max-width: 1200px;
  margin: 0 auto;
}

.projects-header {
  margin-bottom: 40px;
}

.cms-notice,
.section-empty {
  border: 2px solid var(--color-cyan);
  padding: 16px;
  color: var(--color-text);
}

.cms-notice {
  margin: 0 0 32px;
}

.section-empty {
  margin: 0;
}

.projects-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.projects-subtitle {
  font-size: 16px;
  color: var(--color-text);
  margin: 0;
}

.projects-section {
  margin-bottom: 60px;
}

.projects-section:last-child {
  margin-bottom: 0;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.section-subtitle {
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .projects-page {
    padding: 72px 16px 24px;
  }

  .projects-title {
    font-size: 28px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
