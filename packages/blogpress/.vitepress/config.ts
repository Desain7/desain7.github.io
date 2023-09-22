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
      }
    ],
    duration: -1
  },
  // friend: [
  //   {
  //     nickname: 'demo',
  //     des: 'des',
  //     avatar: 'http://oss.desain7.top/bg2.jpg',
  //     url: 'https://github.com/desain7'
  //   }
  // ],
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
  lang: 'zh-CN',
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
        appId: '3VTA3J7890',
        apiKey: '2db23e72e7426d636f6858e0ce35088a',
        indexName: 'desain7',
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
      // {
      //   text: '计算机基础',
      //   items: [
      //     { text: '算法与数据结构', link: '/computerBase/algorithm/' },
      //     { text: '操作系统', link: '/computerBase/os/' },
      //     { text: '计算机网络', link: '/computerBase/Internet/' },
      //     { text: '设计模式', link: '/computerBase/design/' },
      //     { text: '剑指offer', link: '/computerBase/offer/' }
      //     // { text: '力扣', link: '/computerBase/leetcode/' }
      //   ]
      // },
      // {
      //   text: '前端',
      //   items: [
      //     { text: 'html', link: '/bigWeb/html/' },
      //     { text: 'css', link: '/bigWeb/css/' },
      //     { text: 'javascript', link: '/bigWeb/js/' },
      //     { text: 'vue', link: '/bigWeb/vue/' }
      //   ]
      // },
      {
        text: '面试题',
        items: [
          { text: 'html', link: '/interview/html/' },
          { text: 'javascript', link: '/interview/js/' },
          { text: 'vue', link: '/interview/vue/' },
          { text: '算法', link: '/interview/算法/' },
          { text: '计算机网络', link: '/interview/计算机网络/' }
        ]
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
      { icon: 'github', link: 'https://github.com/Desain7/desain7.github.io' }
    ]
  }
})
