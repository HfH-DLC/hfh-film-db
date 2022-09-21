export default function () {
  const loading = useState("loading", () => false);
  const clips = useState("clips", () => []);
  const searchText = useState("searchText", () => "");
  const filters = useState("filters", () => []);

  const searchParams = computed(() => {
    let params = {};
    if (searchText.value) {
      params.searchText = searchText.value;
    }
    const activeFilters = filters.value.filter((filter) => filter.value);
    if (activeFilters.length > 0) {
      const filterParams = {
        ...activeFilters.reduce((acc, cur) => {
          acc[`${cur.field}`] = cur.value;
          return acc;
        }, {}),
      };
      params = {
        ...params,
        ...filterParams,
      };
    }
    return params;
  });

  const setFilter = ({ field, value }) => {
    const filter = filters.value.find((filter) => filter.field === field);
    if (filter) {
      filter.value = value;
    } else {
      console.log(`Error: Filter ${field} not found.`);
    }
  };

  const fetchClips = async () => {
    try {
      loading.value = true;
      const response = await $fetch(`/api/clips`, {
        params: searchParams.value,
      });
      clips.value = response.records;
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
    try {
      loading.value = true;
      const response = await $fetch(`/api/fields`, { params });
      const fetchedFilters = Object.entries(response.fields).map(
        ([key, values]) => {
          return {
            field: key,
            label: key,
            options: values.map((fieldValue) => {
              return { label: fieldValue, value: fieldValue };
            }),
            value: "",
            defaultValue: "",
          };
        }
      );

      filters.value = fetchedFilters;
    } catch (error) {
      //todo error handling
      console.log(error);
    } finally {
      loading.value = false;
    }
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
  };
}
