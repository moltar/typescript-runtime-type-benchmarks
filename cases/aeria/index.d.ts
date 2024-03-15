import { Collection } from '@aeriajs/types'

declare global {
  type Collections = Record<string, Collection>
}
