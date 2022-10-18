<template>
  <nav aria-label="Seitennavigation">
    <ul class="flex gap-4 justify-center">
      <li v-if="firstPage != currentPage">
        <button @click="onPageSelected(firstPage)">
          <span class="hfh-sr-only"> Zur ersten Seite </span>
          <div class="flex">
            <IconCarret direction="left" aria-hidden="true" />
            <IconCarret direction="left" aria-hidden="true" />
          </div>
        </button>
      </li>
      <li v-if="previousPage">
        <button @click="onPageSelected(previousPage)">
          <span class="hfh-sr-only"
            >Zur vorherigen Seite, Seite {{ previousPage }}</span
          >
          <IconCarret direction="left" aria-hidden="true" />
        </button>
      </li>
      <li v-if="currentPage - beforePageCount != firstPage" role="presentation">
        &hellip;
      </li>
      <li v-for="n in beforePageCount" :key="n">
        <button
          :aria-label="`Zu Seite ${currentPage - beforePageCount - 1 + n}`"
          @click="onPageSelected(currentPage - beforePageCount - 1 + n)"
        >
          {{ currentPage - beforePageCount - 1 + n }}
        </button>
      </li>
      <li class="currentPage">
        <div aria-current="page">{{ currentPage }}</div>
      </li>
      <li v-for="n in afterPageCount" :key="n">
        <button
          :aria-label="`Zu Seite ${currentPage + n}`"
          @click="onPageSelected(currentPage + n)"
        >
          {{ currentPage + n }}
        </button>
      </li>
      <li v-if="currentPage + afterPageCount != lastPage" role="presentation">
        &hellip;
      </li>
      <li v-if="nextPage">
        <button @click="onPageSelected(nextPage)">
          <span class="hfh-sr-only"
            >Zur nächsten Seite, Seite {{ nextPage }}</span
          >
          <IconCarret direction="right" aria-hidden="true" />
        </button>
      </li>
      <li v-if="lastPage != currentPage">
        <button @click="onPageSelected(lastPage)">
          <span class="hfh-sr-only">Zur letzten Seite</span>
          <div class="flex">
            <IconCarret direction="right" aria-hidden="true" />
            <IconCarret direction="right" aria-hidden="true" />
          </div>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["pageSelected"]);

const firstPage = ref(1);

const beforeRest = computed(() => Math.max(0, 4 - (props.currentPage - 1)));
const afterRest = computed(() =>
  Math.max(0, 4 - (props.lastPage - props.currentPage))
);
let beforePageCount = computed(() =>
  Math.min(props.currentPage - 1, 4 + afterRest.value)
);
let afterPageCount = computed(() =>
  Math.min(props.lastPage - props.currentPage, 4 + beforeRest.value)
);

const previousPage = computed(() =>
  props.currentPage == firstPage.value ? null : props.currentPage - 1
);
const nextPage = computed(() =>
  props.currentPage == props.lastPage ? null : props.currentPage + 1
);

const onPageSelected = (number) => {
  emit("pageSelected", number);
};
</script>

<style lang="scss" scoped>
ul {
  flex-wrap: wrap;
}
li {
  font-size: 1rem;
  font-weight: 700;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 0.375rem;

  &[role="presentation"] {
    font-weight: 400;
  }

  &.currentPage {
    color: var(--c-thunderbird-red);
    background-color: var(--c-fantasy-plain);
    border-radius: 100%;
  }

  button {
    &:hover,
    &:focus-visible {
      color: var(--c-thunderbird-red);
    }
  }
}
</style>