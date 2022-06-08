module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'fantasy-light': '#fbf3f4',
                'fantasy-plain': '#f2d1d3',
                'fantasy-dark': '#d8757c',
                'gray-dark': '#767676',
                'gray-light': '#f4f4f4',
                'thunderbird-red': '#be1925',
                'thunderbird-red-light': '#e31826'
            },
            scale: {
                '101': '1.01',
            },
            backgroundImage: {
                'dropdown-arrow': "url('@/assets/images/dropdown-arrow.png')",
                'search': "url('@/assets/images/search.svg')",
                'search-active': "url('@/assets/images/search-active.svg')"
            },
            gridTemplateColumns: {
                'index-xs': 'repeat(auto-fill, minmax(100%, 1fr))',
                'index': 'repeat(auto-fill, minmax(400px, 1fr))',
            }
        },
    },
}