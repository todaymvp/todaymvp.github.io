import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import ProfileCard from "./quartz/components/ProfileCard"
import Busuanzi from "./quartz/components/Busuanzi"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Busuanzi],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        repo: 'todaymvp/myblog',
        repoId: 'R_kgDOSdI-ew',
        category: 'Announcements',
        categoryId: 'DIC_kwDOSdI-e84C9OKA',
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        emitMetadata: false,
        inputPosition: "top",
        // 强制主题永远为浅色，无论系统是否暗色模式
        theme: "light",
        lightTheme: "light",
        darkTheme: "light",
        lang: "zh-CN",
      }
    })
  ],
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
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [
    ProfileCard,
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [
    ProfileCard,
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}
