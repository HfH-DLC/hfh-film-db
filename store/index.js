export const state = () => ({
    clips: [],
    allClipsFetched: false
})

export const mutations = {
    addClip(state, clip) {
        state.clips.push(clip);
    },
    setClips(state, clips) {
        state.clips = clips
        state.allClipsFetched = true
    }
}

export const actions = {
    async fetchClips({ state, commit }, params) {
        if (state.allClipsFetched) {
            return
        }
        const response = await this.$axios.get(
            `/api/clips/`, { params }
        );
        commit('setClips', response.data.records)

    },
    async fetchClip({ state, commit }, id) {
        const clip = state.clips[id];
        if (clip) {
            return
        }
        //todo error handling
        const response = await this.$axios.get(
            `/api/clips/${id}`
        );
        commit('addClip', response.data)
    }
}

export const getters = {
    clipById: (state) => (id) => {
        return state.clips.find(clip => clip.id === id)
    }
}