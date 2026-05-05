<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
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
import TracerBullet from '../components/TracerBullet.vue'

const router = useRouter()
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

const goBack = () => {
  router.push('/')
}

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
    <TracerBullet :active="true" class="gallery-tracer" />

    <div class="gallery-container">
      <button class="back-button" @click="goBack">
        <ArrowLeft :size="20" />
        <span>返回首页</span>
      </button>

      <div class="gallery-header">
        <h1 class="gallery-title">项目展廊</h1>
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
      <Transition name="lightbox">
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
      </Transition>
    </Teleport>

    <!-- Iframe Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
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
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-page {
  position: relative;
  min-height: 100vh;
  background: #04080c;
  padding: 80px 20px 40px;
  overflow-x: hidden;
}

.gallery-tracer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.6;
}

.gallery-container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 8px;
  color: var(--color-blue);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  transform: translateX(-4px);
}

.gallery-header {
  margin-bottom: 32px;
}

.gallery-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-cyan) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  padding: 4px 0;
}

.gallery-subtitle {
  font-size: 16px;
  color: var(--color-white);
  opacity: 0.7;
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
  background: rgba(130, 212, 242, 0.05);
  border: 1px solid rgba(130, 212, 242, 0.2);
  border-radius: 20px;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: rgba(130, 212, 242, 0.1);
  border-color: rgba(130, 212, 242, 0.4);
}

.category-btn.active {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
  color: var(--color-blue);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-card {
  position: relative;
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.gallery-card:hover {
  background: rgba(130, 212, 242, 0.06);
  border-color: rgba(130, 212, 242, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(130, 212, 242, 0.1);
}

.gallery-card.is-link:hover {
  border-color: var(--color-cyan);
  box-shadow: 0 8px 32px rgba(111, 208, 206, 0.15);
}

.gallery-card.is-embed:hover {
  border-color: #a78bfa;
  box-shadow: 0 8px 32px rgba(167, 139, 250, 0.15);
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
  background: rgba(4, 8, 12, 0.5);
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
  background: rgba(111, 208, 206, 0.9);
  border-radius: 4px;
  color: #04080c;
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
  background: rgba(167, 139, 250, 0.9);
  border-radius: 4px;
  color: #04080c;
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
  color: var(--color-white);
  margin: 0 0 8px 0;
}

.gallery-card.is-link .gallery-card-title {
  color: var(--color-cyan);
}

.gallery-card.is-iframe .gallery-card-title {
  color: #a78bfa;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.category-tag-image {
  background: rgba(130, 212, 242, 0.2);
  color: var(--color-blue);
  border: 1px solid rgba(130, 212, 242, 0.3);
}

.category-tag-project {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.category-tag-blog {
  background: rgba(244, 114, 182, 0.2);
  color: #f472b6;
  border: 1px solid rgba(244, 114, 182, 0.3);
}

.category-tag-other {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title-link-icon,
.title-iframe-icon {
  opacity: 0.7;
  flex-shrink: 0;
}

.gallery-card-description {
  font-size: 14px;
  color: var(--color-white);
  opacity: 0.7;
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
  opacity: 0.8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-white);
  opacity: 0.5;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(4, 8, 12, 0.95);
  backdrop-filter: blur(20px);
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
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 50%;
  color: var(--color-white);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-close:hover,
.iframe-modal-close:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
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
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 50%;
  color: var(--color-white);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.lightbox-nav:hover {
  background: rgba(130, 212, 242, 0.2);
  border-color: var(--color-blue);
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
  border-radius: 8px;
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
  opacity: 0.8;
  margin: 0 0 8px 0;
}

.lightbox-date {
  font-size: 12px;
  color: var(--color-blue);
  opacity: 0.8;
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(130, 212, 242, 0.1);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 20px;
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
  background: rgba(4, 8, 12, 0.95);
  backdrop-filter: blur(20px);
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
  background: rgba(130, 212, 242, 0.03);
  border: 1px solid rgba(130, 212, 242, 0.1);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.iframe-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(130, 212, 242, 0.1);
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
  background: linear-gradient(135deg, rgba(130, 212, 242, 0.2) 0%, rgba(111, 208, 206, 0.2) 100%);
  border: 1px solid rgba(130, 212, 242, 0.3);
  border-radius: 8px;
  color: var(--color-white);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.iframe-visit-btn:hover {
  background: linear-gradient(135deg, rgba(130, 212, 242, 0.3) 0%, rgba(111, 208, 206, 0.3) 100%);
  border-color: var(--color-blue);
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
  border-top: 1px solid rgba(130, 212, 242, 0.1);
}

.iframe-modal-description {
  font-size: 14px;
  color: var(--color-white);
  opacity: 0.8;
  margin: 0 0 8px 0;
}

.iframe-modal-date {
  font-size: 12px;
  color: var(--color-blue);
  opacity: 0.8;
}

/* Transitions */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
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
