import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      setTimeout(() => window.scrollTo(savedPosition), 50);
    }
    return { top: 0, left: 0 };
  },
};
