# HfH Filmclip DB aka Handyclip

## Technologies used

This is a [Nuxt 3](https://nuxt.com/) application which connects to [Airtable](airtable.com) via its API and uses [tailwind](https://tailwindcss.com/) for styling.

## Setup

- Create an `.npmrc` file in order to access the `hfh-dlc/hfh-styleguide` dependency.
- Install dependencies with `npm i`.
- Create an `.env` file with the following variables:
  - NUXT_AIRTABLE_API_KEY (string): The airtable API key
  - NUXT_AIRTABLE_BASE (string): The airtable base id
  - NUXT_ENABLE_VIDEO (boolean): If true, videos are being displayed. Otherwise only preview thumbnails are shown.

## Usage

- For development, run the development server with `npm run dev`.
- Run `npm run build` in order to create a production build.
