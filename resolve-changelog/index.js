import { readFileSync, writeFileSync } from 'fs'

import { resolveChangelog } from './resolveChangelog.js'

const changelogFilename = process.argv[2]
const changelog = readFileSync(changelogFilename, 'utf-8')

const resolved = resolveChangelog(changelog)

if (resolved.includes("<<<<<<<")) {
  console.log(`Failed to resolve all conflicts in ${changelogFilename}`)
  process.exit(1)
}

writeFileSync(changelogFilename, resolved)