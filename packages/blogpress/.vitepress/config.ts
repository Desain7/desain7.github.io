import { getThemeConfig, defineConfig } from '@desain/theme/node'
import themePkg from '@desain/theme/package.json'
import type { Theme } from '@desain/theme'

const baseUrl = 'https://desain7.top'
const RSS: Theme.RSSOptions = {
  title: 'Desain',
  baseUrl,
  description: '要从那时起，不再动摇（前端相关技术分享）',
  id: baseUrl,
  link: baseUrl,
  language: 'zh-cn',
  image: 'http://oss.desain7.top/pic94500053.jpg',
  favicon: 'http://oss.desain7.top/pic94500053.jpg',
  copyright: 'Copyright (c) 2022-present, Desain',
  url: `${baseUrl}/feed.rss`
}

const blogTheme = getThemeConfig({
  RSS,
  author: 'Desain',
  comment: {
    repo: 'Desain7/desain7.github.io',
    repoId: 'R_kgDOKKbERQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDOKKbERc4CY00O',
    inputPosition: 'top'
  },
  popover: {
    title: '公告',
    body: [
      { type: 'text', content: '欢迎来到我的网站' },
      {
        type: 'image',
        src: 'http://oss.desain7.top/piclst.gif'
      },
      {
        type: 'text',
        content: '欢迎大家私信交流'
      }
    ],
    duration: -1
  },
  friend: [
    {
      nickname: 'demo',
      des: 'des',
      avatar: 'http://oss.desain7.top/bg2.jpg',
      url: 'https://github.com/desain7'
    }
  ],
  search: false,
  recommend: {
    showSelf: true,
    nextText: '下一页',
    style: 'sidebar'
  },
  authorList: [
    {
      nickname: 'Desain',
      url: 'https://github.com/Desain7',
      des: '要从那时起，不再动摇'
    }
  ]
})

const extraHead: any =
  process.env.NODE_ENV === 'production'
    ? [
        [
          'script',
          {
            charset: 'UTF-8',
            id: 'LA_COLLECT',
            src: '//sdk.51.la/js-sdk-pro.min.js'
          }
        ],
        [
          'script',
          {},
          'LA.init({id: "Jgmg5avjAUvoyePS",ck: "Jgmg5avjAUvoyePS",hashMode: true})'
        ],
        [
          'script',
          {},
          `if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach(sw => sw.unregister())
          })
        }`
        ]
      ]
    : []

export default defineConfig({
  extends: blogTheme,
  ignoreDeadLinks: true,
  lang: 'zh-cn',
  title: 'Desain',
  base: '/',
  description:
    'Desain的个人博客，记录学习笔记，前端相关知识，高频面试题，个人面经等',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/png' }],
    [
      'link',
      {
        rel: 'alternate icon',
        href: '/favicon.ico',
        type: 'image/png',
        sizes: '16x16'
      }
    ],
    ['meta', { name: 'author', content: 'Desain' }],
    ['link', { rel: 'mask-icon', href: '/favicon.ico', color: '#ffffff' }],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/favicon.ico', sizes: '180x180' }
    ],
    ...extraHead
  ],
  vite: {
    server: {
      port: 4000,
      host: '0.0.0.0'
    }
  },
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'algolia',
      options: {
        appId: 'F919JCK8WY',
        apiKey: '3eca209ad24bdfc26db63382dd5e4490',
        indexName: 'sugarat_top',
        placeholder: '请输入要搜索的内容...'
      }
    },
    lastUpdatedText: '上次更新于',
    footer: {
      message:
        '<a target="_blank" href="https://beian.miit.gov.cn/">赣ICP备2022002254号-1</a>',
      copyright: '© 2022-present Desain'
    },
    logo: '/logo.png',
    editLink: {
      pattern:
        'https://github.com/Desain7/personal-blog/tree/master/packages/blogpress/:path',
      text: '去 GitHub 上编辑内容'
    },
    nav: [
      // {
      //   text: '关于我',
      //   link: '/aboutme'
      // },
      {
        text: '备战春秋',
        items: [
          { text: '心得总结', link: '/offer/experience/' },
          { text: '校招考点汇总', link: '/offer/campus/' },
          { text: '面经汇总', link: '/offer/sum-interview/' },
          { text: '复习自查', link: '/offer/review/' }
        ]
      },
      {
        text: '技术笔记',
        items: [
          { text: '技术教程', link: '/technology/learn/' },
          { text: '模板工程', link: '/technology/tpl/' },
          { text: '源码学习', link: '/technology/source/' },
          { text: '技术概念', link: '/technology/theory/' },
          { text: '个人作品', link: '/technology/works/' },
          { text: '学习笔记', link: '/technology/study/' }
        ]
      },
      {
        text: '计算机基础',
        items: [
          { text: '算法与数据结构', link: '/computerBase/algorithm/' },
          { text: '操作系统', link: '/computerBase/os/' },
          { text: '计算机网络', link: '/computerBase/Internet/' },
          { text: '设计模式', link: '/computerBase/design/' },
          { text: '剑指offer', link: '/computerBase/offer/' }
          // { text: '力扣', link: '/computerBase/leetcode/' }
        ]
      },
      {
        text: '前端',
        items: [
          { text: 'html', link: '/bigWeb/html/' },
          { text: 'css', link: '/bigWeb/css/' },
          { text: 'javascript', link: '/bigWeb/js/' },
          { text: 'vue', link: '/bigWeb/vue/' }
        ]
      },
      {
        text: '面试',
        items: [{ text: '面经', link: '/interview/exp/' }]
      },
      {
        text: '手撕代码',
        items: [
          { text: 'css', link: '/coding/css/' },
          { text: 'javascript', link: '/coding/js/' },
          { text: '算法与数据结构', link: '/coding/algorithm/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Desain7/personal-blog' }
    ]
  }
})
