const { createContentDigest } = require(`gatsby-core-utils`)

const { findImportsExports } = require(`../utils/gen-mdx`)

async function createMdxNode({
  id,
  node,
  content,
  getNode,
  getNodes,
  reporter,
  cache,
  pathPrefix,
  options,
  loadNodeContent,
  actions,
  createNodeId,
  ...helpers
}) {
  const {
    frontmatter,
    scopeImports,
    scopeExports,
    scopeIdentifiers,
  } = await findImportsExports({
    rawInput: content,
    absolutePath: node.absolutePath,
    getNode,
    getNodes,
    reporter,
    cache,
    pathPrefix,
    options,
    loadNodeContent,
    actions,
    createNodeId,
    ...helpers,
  })

  const mdxNode = {
    id,
    children: [],
    parent: node.id,
    internal: {
      content: content,
      type: `Mdx`,
    },
    excerpt: frontmatter.excerpt,
    exports: scopeExports,
    rawBody: content,
    frontmatter: {
      title: ``, // always include a title
      ...frontmatter,
    },
  }

  // Add path to the markdown file path
  if (node.internal.type === `File`) {
    mdxNode.fileAbsolutePath = node.absolutePath
  }

  mdxNode.internal.contentDigest = createContentDigest(mdxNode)

  return { mdxNode, scopeIdentifiers, scopeImports }
}

module.exports = createMdxNode
