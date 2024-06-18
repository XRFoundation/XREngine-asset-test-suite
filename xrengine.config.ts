import type { ProjectConfigInterface } from '@etherealengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: './projectEventHooks.ts',
  thumbnail: '/static/etherealengine_thumbnail.jpg',
  routes: {
    '/examples': {
      component: () => import('./examplesRoute')
    },
    '/benchmarks': {
      component: () => import('./benchmarksRoute')
    },
    '/benchmarksAll': {
      component: () => import('./benchmarksAllRoute')
    }
  },
  services: undefined,
  databaseSeed: undefined,
  worldInjection: () => import('./worldInjection')
}

export default config
