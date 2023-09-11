/**
 * Resolves conflicts in a CHANGELOG's Unreleased section.
 * 
 * @param {string} file The CHANGELOG file contents to resolve
 * @returns The CHANGELOG file contents resolved
 */
export function resolveChangelog(file) {
  const lines = file.split('\n')
  const mergedLines = []

  let seenUnreleasedHeader = false
  let seenVersionHeader = false
  let conflictSection = 'none'
  let originalLines = []
  let leftLines = []
  let rightLines = []

  for (const line of lines) {
    if (/^<<<<<<</.test(line) && conflictSection === 'none') {
      conflictSection = 'left'
      // Track original lines in case we don't want to impact any change:
      originalLines.push(line)
      continue
    }
    if (/^\|\|\|\|\|\|\|/.test(line) && conflictSection === 'left') {
      conflictSection = 'base'
      // Track original lines in case we don't want to impact any change:
      originalLines.push(line)
      continue
    }
    if (/^=======/.test(line) && (conflictSection === 'left' || conflictSection === 'base')) {
      conflictSection = 'right'
      // Track original lines in case we don't want to impact any change:
      originalLines.push(line)
      continue
    }
    if (/^>>>>>>>/.test(line) && conflictSection === 'right') {
      conflictSection = 'none'
      
      if (seenUnreleasedHeader && !seenVersionHeader) {
        // Resolve left and right lines:
        mergedLines.push(...resolveLines(leftLines, rightLines))
      }
      else {
        // Put back the original lines; no affect:
        mergedLines.push(...originalLines, line)
      }

      // Reset conflict state:
      leftLines = []
      rightLines = []
      originalLines = []
      continue
    }

    if (/^##+ Unreleased/.test(line) && conflictSection !== 'base') {
      seenUnreleasedHeader = true
    }
    if (/^##+ (?!Unreleased).*$/.test(line) && conflictSection !== 'base') {
      seenVersionHeader = true
    }


    // Not in conflict, just include non-conflicting line
    if (conflictSection === 'none') {
      mergedLines.push(line)
      continue
    }
    else {
      // Track original lines in case we don't want to impact any change:
      originalLines.push(line)
    }

    // Ignore base portion of the conflict (if present)
    if (conflictSection === 'base') {
      continue
    }

    // Include all left lines into left lines array
    if (conflictSection === 'left') {
      leftLines.push(line)
      continue
    }
    // Include all right lines into right lines array
    if (conflictSection === 'right') {
      rightLines.push(line)
      continue
    }
  }

  return mergedLines.join('\n')
}

function resolveLines(leftLines, rightLines) {
  const resolvedLines = []
  for (let i = 0; i < Math.max(leftLines.length, rightLines.length); ++i) {
    const left = leftLines[i]
    const right = rightLines[i]
    if (left === right) {
      resolvedLines.push(left)
    }
    else {
      if (left != null)
        resolvedLines.push(left)
      if (right != null)
        resolvedLines.push(right)
    }
  }
  return resolvedLines
}