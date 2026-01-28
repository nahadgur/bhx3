import type { RawPostFile } from './rentLeases'

import { rentLeases } from './rentLeases'
import { buildingIssues } from './buildingIssues'
import { safetySecurity } from './safetySecurity'

export type { RawPostFile }
export { rentLeases, buildingIssues, safetySecurity }

export const allRawPosts: RawPostFile[] = [
  ...rentLeases,
  ...buildingIssues,
  ...safetySecurity,
]
