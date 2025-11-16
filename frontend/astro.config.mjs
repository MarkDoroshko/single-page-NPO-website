// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  env: {
    schema: {
      YANDEX_MAPS_API_KEY: {
        context: 'client',
        access: 'secret',
      },
    },
  },
})
