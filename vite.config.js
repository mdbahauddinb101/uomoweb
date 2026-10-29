import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'
import { VISITOR_KEYS } from '@babel/types'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const localizeJsxText = {
  name: 'localize-jsx-text',
  enforce: 'pre',
  transform(source, id) {
    const filePath = id.split('?')[0]
    if (!filePath.endsWith('.jsx') || !filePath.startsWith(resolve(projectRoot, 'src'))) {
      return null
    }

    const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] })
    const edits = []
    const visit = (value) => {
      if (!value || typeof value !== 'object') return
      if (Array.isArray(value)) {
        value.forEach(visit)
        return
      }

      if (value.type === 'JSXText' && value.value.trim()) {
        const leadingSpace = /^\s/.test(value.value)
        const trailingSpace = /\s$/.test(value.value)
        const replacement = [
          leadingSpace ? '{" "}' : '',
          `<__LocalizedText text={${JSON.stringify(value.value.trim())}} />`,
          trailingSpace ? '{" "}' : '',
        ].join('')
        edits.push({ start: value.start, end: value.end, replacement })
      }

      const visitorKeys = VISITOR_KEYS[value.type]
      if (visitorKeys) {
        visitorKeys.forEach((key) => visit(value[key]))
      }
    }
    visit(ast)

    if (!edits.length) return null

    let transformed = source
    edits
      .sort((first, second) => second.start - first.start)
      .forEach(({ start, end, replacement }) => {
        transformed =
          transformed.slice(0, start) + replacement + transformed.slice(end)
      })

    let importPath = relative(
      dirname(filePath),
      resolve(projectRoot, 'src/components/common/LocalizedText.jsx'),
    ).replace(/\\/g, '/')
    if (!importPath.startsWith('.')) importPath = `./${importPath}`
    transformed = `import __LocalizedText from ${JSON.stringify(importPath)};\n${transformed}`

    return { code: transformed, map: null }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [localizeJsxText, react(), tailwindcss()],
})
