import isEqual from "lodash.isequal";
import { FILTER_TYPE_RANGE, FILTER_TYPE_SELECT } from "~~/consts";
export default function () {
  const loading = useState("loading", () => false);
  const clips = useState("clips", () => []);
  const searchText = useState("searchText", () => "");
  const filters = useState("filters", () => []);
  const loadedSearchParams = useState("loadedSearchParams", () => null);
  const pageSize = useState("pageSize", () => 18);
  const currentPage = useState("currentPage", () => 1);
  const totalPages = useState("totalPages", () => 0);
  const totalRecords = useState("totalRecords", () => 0);

  const searchParams = computed(() => {
    let params = {};
    if (searchText.value) {
      params.searchText = searchText.value;
    }
    const activeFilters = filters.value.filter((filter) => filter.value);
    if (activeFilters.length > 0) {
      const filterParams = {
        ...activeFilters.reduce((acc, cur) => {
          acc = getQueryParams(acc, cur);
          return acc;
        }, {}),
      };
      params = {
        ...params,
        ...filterParams,
      };
    }
    return {
      ...params,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    };
  });

  const getQueryParams = (acc, filter) => {
    if (filter.type === FILTER_TYPE_SELECT) {
      acc[filter.params.value] = filter.value;
    } else if (filter.type === FILTER_TYPE_RANGE) {
      acc[filter.params.start] = filter.value.start;
      acc[filter.params.end] = filter.value.end;
    }
    return acc;
  };

  const setFilter = (id, value) => {
    const filter = filters.value.find((filter) => filter.id === id);
    if (filter) {
      filter.value = value;
    } else {
      console.log(`Error: Filter ${field} not found.`);
    }
  };

  const fetchClips = async () => {
    if (isEqual(searchParams.value, loadedSearchParams.value)) {
      return;
    }
    try {
      loading.value = true;
      const response = await $fetch(`/api/clips`, {
        params: searchParams.value,
      });
      clips.value = response.records;
      pageSize.value = parseInt(response.pageSize);
      currentPage.value = parseInt(response.currentPage);
      totalPages.value = parseInt(response.totalPages);
      totalRecords.value = parseInt(response.totalRecords);
      loadedSearchParams.value = searchParams.value;
    } catch (error) {
      //todo error handling
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const fetchClip = async (id) => {
    const clip = clips.value.find((clip) => clip.id === id);
    if (clip) {
      return;
    }
    try {
      loading.value = true;
      const response = await $fetch(`/api/clips/${id}`);
      clips.value = [response];
    } catch (error) {
      //todo error handling
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const fetchFilters = async (params) => {
    if (filters.value.length > 0) {
      return;
    }
    try {
      loading.value = true;
      const response = await $fetch(`/api/filters`, { params });
      filters.value = response.filters;
    } catch (error) {
      //todo error handling
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const resetSearchAndFilters = () => {
    filters.value.forEach((filter) => {
      filter.value = filter.defaultValue;
    });
    searchText.value = "";
  };
  return {
    clips,
    searchText,
    filters,
    loading,
    setFilter,
    fetchClip,
    fetchClips,
    fetchFilters,
    resetSearchAndFilters,
    currentPage,
    totalPages,
    totalRecords,
  };
}
