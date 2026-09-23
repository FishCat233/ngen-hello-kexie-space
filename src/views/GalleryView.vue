<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, ChevronLeft, ChevronRight, ImageIcon, ExternalLink, Link2 } from 'lucide-vue-next'
import {
  galleryItems as staticGalleryItems,
  categories,
  filterItemsByCategory,
  getImageItems,
  type GalleryCategory,
  type GalleryItem,
} from '../data/gallery'
import { loadGallery } from '../api/cms'
import BackButton from '../components/BackButton.vue'

const currentCategory = ref<GalleryCategory>('all')
const displayedGalleryItems = ref<GalleryItem[]>([])
const loading = ref(true)
const loadError = ref(false)
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const filteredItems = computed(() => {
  return filterItemsByCategory(displayedGalleryItems.value, currentCategory.value)
})

const imageItems = computed(() => {
  return getImageItems(filteredItems.value)
})

const currentImage = computed(() => {
  return imageItems.value[currentImageIndex.value]
})

const setCategory = (category: GalleryCategory) => {
  currentCategory.value = category
}

const openLightbox = (index: number) => {
  currentImageIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % imageItems.value.length
}

const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + imageItems.value.length) % imageItems.value.length
}

// 图片类打开灯箱，其余一律新标签页跳转外部站点
const handleItemClick = (item: GalleryItem) => {
  if (item.type === 'image') {
    const imageIndex = imageItems.value.findIndex((img) => img.id === item.id)
    openLightbox(imageIndex >= 0 ? imageIndex : 0)
  } else if (item.url) {
    window.open(item.url, '_blank')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'ArrowLeft':
      prevImage()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  void loadGallery(staticGalleryItems).then((result) => {
    displayedGalleryItems.value = result.data
    loadError.value = result.source === 'fallback'
    loading.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="gallery-page">
    <div class="gallery-container">
      <BackButton />

      <div class="gallery-header">
        <h1 class="gallery-title"><span class="title-accent">#</span> 项目展廊</h1>
        <p class="gallery-subtitle">展示科协成员的项目、博客和精彩瞬间</p>
      </div>

      <p v-if="loadError" class="cms-notice">内容服务暂不可用，当前显示内置数据。</p>

      <div class="category-filter">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-btn"
          :class="{ active: currentCategory === category.id }"
          @click="setCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- 数据就绪前显示卡片骨架屏 -->
      <div v-if="loading" class="gallery-grid" aria-hidden="true">
        <div v-for="i in 6" :key="i" class="gallery-card skeleton-card">
          <div class="skeleton skeleton-image"></div>
          <div class="skeleton-card-body">
            <div class="skeleton skeleton-line" style="width: 60%"></div>
            <div class="skeleton skeleton-line" style="width: 90%"></div>
            <div class="skeleton skeleton-line skeleton-line-sm" style="width: 30%"></div>
          </div>
        </div>
      </div>

      <div v-else class="gallery-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="gallery-card"
          @click="handleItemClick(item)"
        >
          <div class="image-wrapper">
            <img :src="item.src" :alt="item.title" class="gallery-image" loading="lazy" />
            <div class="image-overlay">
              <ImageIcon v-if="item.type === 'image'" :size="24" />
              <ExternalLink v-else :size="24" />
            </div>
            <div v-if="item.type !== 'image'" class="link-badge">
              <Link2 :size="12" />
              <span>外部链接</span>
            </div>
          </div>
          <div class="gallery-card-content">
            <h3 class="gallery-card-title">
              <span class="category-tag" :class="'category-tag-' + item.category">
                {{
                  item.category === 'image'
                    ? '图片'
                    : item.category === 'project'
                      ? '项目'
                      : item.category === 'blog'
                        ? '博客'
                        : '其他'
                }}
              </span>
              {{ item.title }}
              <ExternalLink v-if="item.type !== 'image'" :size="14" class="title-link-icon" />
            </h3>
            <p class="gallery-card-description">{{ item.description }}</p>
            <span class="gallery-card-date">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredItems.length === 0" class="empty-state">
        <ImageIcon :size="48" class="empty-icon" />
        <p>该分类下暂无内容</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
        <button class="lightbox-close" @click.stop="closeLightbox">
          <X :size="24" />
        </button>

        <button
          v-if="imageItems.length > 1"
          class="lightbox-nav lightbox-prev"
          @click.stop="prevImage"
        >
          <ChevronLeft :size="32" />
        </button>

        <button
          v-if="imageItems.length > 1"
          class="lightbox-nav lightbox-next"
          @click.stop="nextImage"
        >
          <ChevronRight :size="32" />
        </button>

        <div class="lightbox-content" @click.stop>
          <img
            v-if="currentImage"
            :src="currentImage.src"
            :alt="currentImage.title"
            class="lightbox-image"
          />
          <div v-if="currentImage" class="lightbox-info">
            <h3 class="lightbox-title">{{ currentImage.title }}</h3>
            <p class="lightbox-description">{{ currentImage.description }}</p>
            <span class="lightbox-date">{{ currentImage.date }}</span>
          </div>
        </div>

        <div v-if="imageItems.length > 1" class="lightbox-counter">
          {{ currentImageIndex + 1 }} / {{ imageItems.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 80px 20px 40px;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  margin-bottom: 32px;
}

.cms-notice {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 16px;
  margin: 0 0 32px;
  color: var(--color-text);
}

.gallery-title {
  font-size: var(--text-h2);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-primary);
}

.gallery-subtitle {
  font-size: var(--text-body);
  color: var(--color-text);
  margin: 0;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.category-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-white);
  font-size: var(--text-ui);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.category-btn:hover {
  background: var(--color-primary-bright);
  border-color: var(--color-primary-bright);
}

.category-btn.active {
  background: var(--color-primary);
  color: var(--color-white);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* hover：卡片变深，文字层级不变；图片缩放与遮罩保留 */
.gallery-card:hover {
  background: #141414;
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-card:hover .gallery-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--color-white);
}

.gallery-card:hover .image-overlay {
  opacity: 1;
}

/* 右上角徽标：深色毛玻璃质感（半透明底 + 背景模糊提亮饱和），白字保证任意图片上的可读性 */
.link-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(10, 14, 20, 0.55);
  border-radius: var(--radius-sm);
  color: var(--color-white);
  font-size: var(--text-xs);
  font-weight: 600;
}

.gallery-card-content {
  padding: 16px;
}

.gallery-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  flex-shrink: 0;
}

.category-tag-image {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.category-tag-project {
  background: transparent;
  color: #fbbf24;
  border: 2px solid #fbbf24;
}

.category-tag-blog {
  background: transparent;
  color: #f472b6;
  border: 2px solid #f472b6;
}

.category-tag-other {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-text);
}

.title-link-icon {
  flex-shrink: 0;
}

.skeleton-card {
  cursor: default;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 0;
}

.skeleton-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
}

.skeleton-line-sm {
  height: 11px;
}

.gallery-card-description {
  font-size: var(--text-ui);
  color: var(--color-text);
  margin: 0 0 12px 0;
  line-height: var(--leading-normal);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gallery-card-date {
  font-size: var(--text-xs);
  color: var(--color-primary-bright);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-text);
}

.empty-icon {
  margin-bottom: 16px;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-white);
  cursor: pointer;
  z-index: 10;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.lightbox-close:hover {
  background: var(--color-primary-bright);
  color: var(--color-white);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-white);
  cursor: pointer;
  z-index: 10;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.lightbox-nav:hover {
  background: var(--color-primary-bright);
  color: var(--color-white);
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightbox-info {
  margin-top: 20px;
  text-align: center;
  max-width: 600px;
}

.lightbox-title {
  font-size: var(--text-h5);
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.lightbox-description {
  font-size: var(--text-ui);
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.lightbox-date {
  font-size: var(--text-xs);
  color: var(--color-primary-bright);
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: transparent;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  color: var(--color-white);
  font-size: var(--text-ui);
}

/* Responsive */
@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .gallery-page {
    padding: 72px 16px 24px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .category-filter {
    gap: 8px;
  }

  .category-btn {
    padding: 6px 12px;
  }

  .lightbox-nav {
    width: 40px;
    height: 40px;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-close {
    top: 10px;
    right: 10px;
  }
}
</style>
