import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  /**
   * Scrolls the page to the previously saved position when navigating back. If no position was saved, scrolls to the top of the page.
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      setTimeout(() => window.scrollTo(savedPosition), 50);
    }
    return { top: 0, left: 0 };
  },
};
