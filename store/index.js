export const state = () => ({
    clips: [],
    filters: [],
    loading: false
})

export const mutations = {
    setClips(state, clips) {
        state.clips = clips
    },
    setFilters(state, filters) {
        state.filters = filters
    },
    setFilter(state, { field, value }) {
        const filter = state.filters.find(filter => filter.field === field);
        if (filter) {
            filter.value = value;
        } else {
            console.log(`Error: Filter ${field} not found.`)
        }
    },
    setLoading(state, value) {
        state.loading = value
    }
}

export const actions = {
    async fetchClips({ commit }, params) {
        commit('setLoading', true)
        try  {
            const response = await this.$axios.get(
                `/api/clips/`, { params }
            );
            commit('setClips', response.data.records)
        } catch (error) {
            //todo error handling
            console.log(error)
        } finally {
            commit('setLoading', false)
        }

    },
    async fetchClip({ state, commit }, id) {
        const clip = state.clips.find(clip => clip.id === id);
        if (clip) {
            return
        }
        commit('setLoading', true)
        try {
            const response = await this.$axios.get(
                `/api/clips/${id}`
            );
            commit('setClips', [response.data])
        } catch (error) {
            //todo error handling
            console.log(error)
        } finally {
            commit('setLoading', false)
        }
    },
    async fetchFilters({ commit }, params) {
        commit('setLoading', true)
        try  {
            const response = await this.$axios.get(
                `/api/clips/fields`, { params }
            );
            const filters = Object.entries(response.data).map(([key, values]) => {
                return {
                    field: key,
                    label: key,
                    options: values.map(fieldValue => { return { label: fieldValue, value: fieldValue } }),
                    value: ""
                }
            })

            commit('setFilters', filters)
        } catch (error) {
            //todo error handling
            console.log(error)
        } finally {
            commit('setLoading', false)
        }

    },
}

export const getters = {
    clipById: (state) => (id) => {
        return state.clips.find(clip => clip.id === id)
    }
}