export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { storeScrollPosition } = useScrollPosition();
    storeScrollPosition({ top: window.scrollY, left: window.scrollX });
  }
});
