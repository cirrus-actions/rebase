import { expect } from 'chai'

import { resolveChangelog }  from '../resolveChangelog.js'

const trim = s => {
  const match = s.match(/\n(\s+)/)
  if (match == null) return s
  const firstSpaces = match[1]
  return s.replace(new RegExp(`^${firstSpaces}`, 'gm'), '')
}

describe('resolveChangelog', function() {

  it('will resolve Unreleased section', function() {
    const start = trim(`
      # Title

      <<<<<<< HEAD
      ## Unreleased

      - Added something

      =======
      ## Unreleased

      - Changed something

      >>>>>>> cd554d38 (Changed something)
      ## 1.0.0

      - beep
      - boop`
    )
    const end = trim(`
      # Title

      ## Unreleased

      - Added something
      - Changed something

      ## 1.0.0

      - beep
      - boop`
    )
    expect(resolveChangelog(start)).equal(end)
  })

  it('will ignore conflict base diff', function() {
    const start = trim(`
      # Title

      <<<<<<< HEAD
      ## Unreleased

      - Added something

      ||||||| parent of cd554d38 (Changed something)
      ## Unrelease

      =======
      ## Unreleased

      - Changed something

      >>>>>>> cd554d38 (Changed something)
      ## 1.0.0

      - beep
      - boop`
    )
    const end = trim(`
      # Title

      ## Unreleased

      - Added something
      - Changed something

      ## 1.0.0

      - beep
      - boop`
    )
    expect(resolveChangelog(start)).equal(end)
  })

  it('will not resolve in version sections', function() {
    const start = trim(`
      # Title

      <<<<<<< HEAD
      ## Unreleased

      - Added something

      =======
      ## Unreleased

      - Changed something

      >>>>>>> cd554d38 (Changed something)
      ## 1.0.0

      - beep
      - boop

      <<<<<<< HEAD
      ## 0.0.1

      - Eek something

      =======
      ## 0.0.1

      - Uh no something

      >>>>>>> cd554d38 (Changed something)
      `
    )
    const end = trim(`
      # Title

      ## Unreleased

      - Added something
      - Changed something

      ## 1.0.0

      - beep
      - boop
      
      <<<<<<< HEAD
      ## 0.0.1

      - Eek something

      =======
      ## 0.0.1

      - Uh no something

      >>>>>>> cd554d38 (Changed something)
      `
    )
    expect(resolveChangelog(start)).equal(end)
  })

})