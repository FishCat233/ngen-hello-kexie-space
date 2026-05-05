import { ref, onMounted, onUnmounted } from "vue";

const isMobile = ref(false);
const isInitialized = ref(false);

function checkDevice() {
  if (typeof window === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook|bb10|meego/i.test(
      userAgent,
    );

  const isSmallScreen = window.innerWidth <= 1024;

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isMobileViewport =
    window.innerWidth <= 1024 && window.innerHeight <= 1024;

  return isMobileUA || (isSmallScreen && isTouchDevice) || isMobileViewport;
}

function updateDeviceStatus() {
  isMobile.value = checkDevice();
}

export function useDevice() {
  if (!isInitialized.value && typeof window !== "undefined") {
    isMobile.value = checkDevice();
    isInitialized.value = true;
  }

  onMounted(() => {
    updateDeviceStatus();
    window.addEventListener("resize", updateDeviceStatus);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateDeviceStatus);
  });

  return {
    isMobile,
    updateDeviceStatus,
  };
}
