<script setup lang="ts">
import { KEXIE_FOUNDING_DATE } from '@/data/kexie'

const years = new Date().getFullYear() - new Date(KEXIE_FOUNDING_DATE).getFullYear()

const stats = [
  { value: String(years), unit: '年', label: 'SINCE 1993' },
  { value: '5', unit: '个', label: '部门' },
  { value: '13', unit: '个', label: '学习方向' },
]
</script>

<template>
  <section class="stats-strip" aria-label="科协数据">
    <div class="stats-inner">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <div class="stat-value">
          <span class="stat-number">{{ stat.value }}</span>
          <span class="stat-unit">{{ stat.unit }}</span>
        </div>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-strip {
  width: 100%;
  background: var(--color-gray);
  border-top: 1px solid var(--color-hairline);
  border-bottom: 1px solid var(--color-hairline);
  padding: 56px 24px;
}

.stats-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
}

.stat + .stat {
  border-left: 1px solid var(--color-hairline);
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-number {
  font-family: var(--heading);
  font-size: clamp(64px, 8vw, 104px);
  font-weight: 800;
  line-height: 1;
  color: var(--color-blue);
  letter-spacing: -0.02em;
}

.stat-unit {
  font-family: var(--heading);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-muted);
}

.stat-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.35em;
  padding-left: 0.35em;
  color: var(--color-muted);
  margin: 0;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .stats-strip {
    padding: 40px 16px;
  }

  .stat {
    padding: 0 8px;
  }

  .stat-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    padding-left: 0.2em;
  }
}
</style>
