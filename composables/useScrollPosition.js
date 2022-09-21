export default function () {
  const scrollPosition = useState("scrollPosition", () => null);

  const storeScrollPosition = (position) => {
    scrollPosition.value = position;
  };

  const restoreScrollPosition = () => {
    const position = scrollPosition.value;
    if (position) {
      const { top, left } = position;
      setTimeout(() => window.scrollTo(left, top), 50);
      scrollPosition.value = null;
    }
  };

  return { storeScrollPosition, restoreScrollPosition };
}
