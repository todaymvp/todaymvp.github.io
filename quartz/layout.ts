import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import TopBar from "./quartz/components/TopBar"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [TopBar],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "GitHub": "https://github.com/todaymvp",
      "RSS": "/index.xml",
      "关于": "/navigation",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [],
  right: [],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [],
  right: [],
}
