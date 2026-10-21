export { CategoryTabs }
export { fitCategoryTabs_SSR }

import React, { useLayoutEffect } from 'react'
import { usePageContext } from './renderer/usePageContext.js'
import { parseMarkdownMini } from './parseMarkdownMini.js'
import { cls } from './utils/cls.js'
import './CategoryTabs.css'

// `categoryTabs`: the categories (level-1 headings) as tabs in the top bar (desktop), each linking to its first page.
// The current page's category is underlined in its color. The left navigation lists the category's pages.
function CategoryTabs() {
  const { categories } = usePageContext().resolved
  useLayoutEffect(() => {
    const bar = document.querySelector('.nav-head-content')!
    const resizeObserver = new ResizeObserver(fitCategoryTabs)
    resizeObserver.observe(bar)
    return () => resizeObserver.disconnect()
  }, [])
  return (
    <nav className="category-tabs" aria-label="Categories">
      {categories.map(
        ({ title, titleIcon, color, pages, isCurrent }, i) =>
          pages[0] && (
            <a
              key={i}
              href={pages[0].url}
              className={cls(['category-tab', isCurrent && 'is-current'])}
              aria-current={isCurrent ? 'true' : undefined}
              style={{ '--color-category': color }}
            >
              {titleIcon && <img src={titleIcon} alt="" className="category-tab-icon" />}
              {parseMarkdownMini(title)}
            </a>
          ),
      )}
    </nav>
  )
}

// - WARNING: We cannot use TypeScript here because we serialize the function.
// - Inlined right after the top bar: the first paint already has the tabs, or the "Docs" menu where they don't fit (the
//   fitting width depends on the site's labels, so it can't be a media query).
const fitCategoryTabs_SSR = `fitCategoryTabs();${fitCategoryTabs.toString()}`
function fitCategoryTabs() {
  const bar = document.querySelector('.nav-head-content')!
  const { classList } = document.documentElement
  classList.remove('category-tabs-overflow')
  classList.toggle('category-tabs-overflow', bar.scrollWidth > bar.clientWidth)
}
