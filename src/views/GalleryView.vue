<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ExternalLink,
  Link2,
  Monitor,
} from 'lucide-vue-next'
import {
  galleryItems,
  categories,
  filterItemsByCategory,
  getImageItems,
  type GalleryCategory,
  type GalleryItem,
} from '../data/gallery'
import BackButton from '../components/BackButton.vue'

const currentCategory = ref<GalleryCategory>('all')
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)
const iframeModalOpen = ref(false)
const currentIframeItem = ref<GalleryItem | null>(null)

const filteredItems = computed(() => {
  return filterItemsByCategory(galleryItems, currentCategory.value)
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

const openIframeModal = (item: GalleryItem) => {
  currentIframeItem.value = item
  iframeModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeIframeModal = () => {
  iframeModalOpen.value = false
  currentIframeItem.value = null
  document.body.style.overflow = ''
}

const handleItemClick = (item: GalleryItem) => {
  if (item.type === 'image') {
    const imageIndex = imageItems.value.findIndex((img) => img.id === item.id)
    openLightbox(imageIndex >= 0 ? imageIndex : 0)
  } else if (item.type === 'iframe') {
    openIframeModal(item)
  } else if (item.type === 'link' && item.url) {
    window.open(item.url, '_blank')
  }
}

const openExternalLink = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (lightboxOpen.value) {
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
  } else if (iframeModalOpen.value) {
    if (e.key === 'Escape') {
      closeIframeModal()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
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

      <div class="gallery-grid">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="gallery-card"
          :class="{ 'is-link': item.type === 'link', 'is-iframe': item.type === 'iframe' }"
          @click="handleItemClick(item)"
        >
          <div class="image-wrapper">
            <img :src="item.src" :alt="item.title" class="gallery-image" loading="lazy" />
            <div class="image-overlay">
              <ImageIcon v-if="item.type === 'image'" :size="24" />
              <Monitor v-else-if="item.type === 'iframe'" :size="24" />
              <ExternalLink v-else :size="24" />
            </div>
            <div v-if="item.type === 'link'" class="link-badge">
              <Link2 :size="12" />
              <span>外部链接</span>
            </div>
            <div v-else-if="item.type === 'iframe'" class="iframe-badge">
              <Monitor :size="12" />
              <span>可预览</span>
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
              <ExternalLink v-if="item.type === 'link'" :size="14" class="title-link-icon" />
              <Monitor v-else-if="item.type === 'iframe'" :size="14" class="title-iframe-icon" />
            </h3>
            <p class="gallery-card-description">{{ item.description }}</p>
            <span class="gallery-card-date">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="empty-state">
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

    <!-- Iframe Modal -->
    <Teleport to="body">
      <div
        v-if="iframeModalOpen && currentIframeItem"
        class="iframe-modal"
        @click="closeIframeModal"
      >
        <button class="iframe-modal-close" @click.stop="closeIframeModal">
          <X :size="24" />
        </button>

        <div class="iframe-modal-content" @click.stop>
          <div class="iframe-modal-header">
            <h3 class="iframe-modal-title">{{ currentIframeItem.title }}</h3>
            <button class="iframe-visit-btn" @click="openExternalLink(currentIframeItem.url)">
              <ExternalLink :size="16" />
              <span>访问网站</span>
            </button>
          </div>

          <div class="iframe-preview-container">
            <iframe
              v-if="currentIframeItem.url"
              :src="currentIframeItem.url"
              class="iframe-frame"
              frameborder="0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            ></iframe>
          </div>

          <div class="iframe-modal-info">
            <p class="iframe-modal-description">{{ currentIframeItem.description }}</p>
            <span class="iframe-modal-date">{{ currentIframeItem.date }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 100vh;
  background: var(--color-gray);
  padding: 80px 20px 40px;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  margin-bottom: 32px;
}

.gallery-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px 0;
}

.title-accent {
  color: var(--color-blue);
}

.gallery-subtitle {
  font-size: 16px;
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
  border: 1px solid var(--color-cyan);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.category-btn:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
  color: var(--color-white);
}

.category-btn.active {
  background: var(--color-blue);
  color: var(--color-white);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-card {
  background: var(--color-gray);
  border: 1px solid var(--color-cyan);
  overflow: hidden;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.gallery-card:hover {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.gallery-card:hover .gallery-card-title,
.gallery-card:hover .gallery-card-description,
.gallery-card:hover .gallery-card-date {
  color: var(--color-white);
}

.gallery-card:hover .category-tag-image {
  background: var(--color-cyan);
  border-color: var(--color-white);
  color: var(--color-white);
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
  background: var(--color-black);
  opacity: 0;
  transition: opacity 0.3s ease;
  color: var(--color-white);
}

.gallery-card:hover .image-overlay {
  opacity: 1;
}

.link-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--color-cyan);
  color: var(--color-white);
  font-size: 11px;
  font-weight: 600;
}

.iframe-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--color-blue);
  color: var(--color-white);
  font-size: 11px;
  font-weight: 600;
}

.gallery-card-content {
  padding: 16px;
}

.gallery-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.category-tag-image {
  background: transparent;
  color: var(--color-cyan);
  border: 1px solid var(--color-cyan);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.category-tag-project {
  background: transparent;
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.category-tag-blog {
  background: transparent;
  color: #f472b6;
  border: 1px solid #f472b6;
}

.category-tag-other {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-text);
}

.title-link-icon,
.title-iframe-icon {
  flex-shrink: 0;
}

.gallery-card-description {
  font-size: 14px;
  color: var(--color-text);
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gallery-card-date {
  font-size: 12px;
  color: var(--color-blue);
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
  background: var(--color-black);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close,
.iframe-modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-cyan);
  color: var(--color-white);
  cursor: pointer;
  z-index: 10;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.lightbox-close:hover,
.iframe-modal-close:hover {
  background: var(--color-blue);
  color: var(--color-black);
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
  border: 1px solid var(--color-cyan);
  color: var(--color-white);
  cursor: pointer;
  z-index: 10;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.lightbox-nav:hover {
  background: var(--color-blue);
  color: var(--color-black);
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
}

.lightbox-info {
  margin-top: 20px;
  text-align: center;
  max-width: 600px;
}

.lightbox-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.lightbox-description {
  font-size: 14px;
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.lightbox-date {
  font-size: 12px;
  color: var(--color-blue);
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--color-cyan);
  color: var(--color-white);
  font-size: 14px;
}

/* Iframe Modal */
.iframe-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-black);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.iframe-modal-content {
  width: 95%;
  max-width: 1400px;
  height: 95vh;
  max-height: 95vh;
  background: var(--color-black);
  border: 1px solid var(--color-cyan);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.iframe-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-cyan);
  gap: 16px;
}

.iframe-modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
  flex-shrink: 0;
}

.iframe-visit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-blue);
  color: var(--color-white);
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.iframe-visit-btn:hover {
  background: var(--color-cyan);
}

.iframe-preview-container {
  flex: 1;
  min-height: 0;
  background: #000;
  position: relative;
}

.iframe-frame {
  width: 100%;
  height: 100%;
  min-height: 600px;
  border: none;
}

.iframe-modal-info {
  padding: 16px 24px;
  border-top: 1px solid var(--color-cyan);
}

.iframe-modal-description {
  font-size: 14px;
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.iframe-modal-date {
  font-size: 12px;
  color: var(--color-blue);
}

/* Responsive */
@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .iframe-modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .iframe-frame {
    min-height: 500px;
  }
}

@media (max-width: 640px) {
  .gallery-page {
    padding: 72px 16px 24px;
  }

  .gallery-title {
    font-size: 28px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .category-filter {
    gap: 8px;
  }

  .category-btn {
    padding: 6px 12px;
    font-size: 13px;
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

  .lightbox-close,
  .iframe-modal-close {
    top: 10px;
    right: 10px;
  }

  .iframe-modal-header {
    padding: 16px;
  }

  .iframe-modal-title {
    font-size: 16px;
  }

  .iframe-visit-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .iframe-frame {
    min-height: 400px;
  }

  .iframe-modal-info {
    padding: 12px 16px;
  }
}
</style>
