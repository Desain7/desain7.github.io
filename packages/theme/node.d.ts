import { DefaultTheme, UserConfig } from 'vitepress';
import { ElButton } from 'element-plus';
import { FeedOptions } from 'feed';
export { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';

declare namespace BlogPopover {
    interface Title {
        type: 'title';
        content: string;
        style?: string;
    }
    interface Text {
        type: 'text';
        content: string;
        style?: string;
    }
    interface Image {
        type: 'image';
        src: string;
        style?: string;
    }
    interface Button {
        type: 'button';
        link: string;
        content: string;
        style?: string;
        props?: InstanceType<typeof ElButton>['$props'];
    }
    type Value = Title | Text | Image | Button;
}
type ThemeableImage = string | {
    src: string;
    alt?: string;
} | {
    light: string;
    dark: string;
    alt?: string;
};
declare namespace Theme {
    interface PageMeta {
        title: string;
        date: string;
        tag?: string[];
        description?: string;
        descriptionHTML?: string;
        cover?: string;
        hiddenCover?: boolean;
        readingTime?: boolean;
        sticky?: number;
        author?: string;
        hidden?: boolean;
        layout?: string;
        categories: string[];
        tags: string[];
        /**
         * 文章首页置顶
         */
        top?: number;
        /**
         * 手动控制相关文章列表的顺序
         */
        recommend?: number | false;
        /**
         * TODO: 待开发
         * 时间线
         */
        timeline: string;
        /**
         * TODO: 待开发
         * 专栏&合集
         */
        album: string;
        publish?: boolean;
    }
    interface PageData {
        route: string;
        meta: PageMeta;
    }
    interface activeTag {
        label: string;
        type: string;
    }
    interface GiscusConfig {
        repo: string;
        repoId: string;
        category: string;
        categoryId: string;
        mapping?: string;
        inputPosition?: 'top' | 'bottom';
        lang?: string;
        loading?: 'lazy' | 'auto' | 'eager';
    }
    interface HotArticle {
        title?: string;
        pageSize?: number;
        nextText?: string;
        empty?: string | boolean;
    }
    interface RecommendArticle {
        title?: string;
        pageSize?: number;
        nextText?: string;
        /**
         * 是否展示当前正在浏览的文章在左侧
         * @default true
         */
        showSelf?: boolean;
        filter?: (page: Theme.PageData) => boolean;
        empty?: string | boolean;
        /**
         * 设置推荐文章的展示风格
         * @default 'sidebar'
         */
        style?: 'card' | 'sidebar';
    }
    interface HomeBlog {
        name?: string;
        motto?: string;
        inspiring?: string | string[];
        inspiringTimeout?: number;
        pageSize?: number;
    }
    interface ArticleConfig {
        readingTime?: boolean;
        hiddenCover?: boolean;
    }
    interface Alert {
        type: 'success' | 'warning' | 'info' | 'error';
        /**
         * 细粒度的时间控制
         * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
         * 配置改变时，会重新触发展示
         */
        duration: number;
        title?: string;
        description?: string;
        closable?: boolean;
        center?: boolean;
        closeText?: string;
        showIcon?: boolean;
        html?: string;
    }
    interface Popover {
        title: string;
        /**
         * 细粒度的时间控制
         * 默认展示时间，-1 只展示1次，其它数字为每次都展示，一定时间后自动消失，0为不自动消失
         * 配置改变时，会重新触发展示
         */
        duration: number;
        body?: BlogPopover.Value[];
        footer?: BlogPopover.Value[];
        /**
         * 手动重新打开
         */
        reopen?: boolean;
    }
    interface FriendLink {
        nickname: string;
        des: string;
        url: string;
        avatar: ThemeableImage;
    }
    interface UserWork {
        title: string;
        description: string;
        time: string | {
            start: string;
            end?: string;
            lastupdate?: string;
        };
        status?: {
            text: string;
            type?: 'tip' | 'warning' | 'danger';
        };
        url?: string;
        github?: string | {
            owner: string;
            repo: string;
            branch?: string;
            path?: string;
        };
        cover?: string | string[] | {
            urls: string[];
            layout?: 'swiper' | 'list';
        };
        links?: {
            title: string;
            url: string;
        }[];
        tags?: string[];
        top?: number;
    }
    type SearchConfig = boolean | 'pagefind' | {
        btnPlaceholder?: string;
        placeholder?: string;
        emptyText?: string;
        /**
         * @example
         * 'Total: {{searchResult}} search results.'
         */
        heading?: string;
        mode?: boolean | 'pagefind';
    };
    interface UserWorks {
        title: string;
        description?: string;
        topTitle?: string;
        list: UserWork[];
    }
    interface BlogConfig {
        blog?: false;
        pagesData: PageData[];
        srcDir?: string;
        author?: string;
        hotArticle?: HotArticle;
        home?: HomeBlog;
        /**
         * 本地全文搜索定制
         * 内置pagefind 实现，
         * VitePress 官方提供 minisearch 实现，
         * 社区提供 flexsearch 实现
         */
        search?: SearchConfig;
        /**
         * 配置评论
         * power by https://giscus.app/zh-CN
         */
        comment?: GiscusConfig | false;
        /**
         * 阅读文章左侧的推荐文章（替代默认的sidebar）
         */
        recommend?: RecommendArticle | false;
        article?: ArticleConfig;
        /**
         * el-alert
         */
        alert?: Alert;
        popover?: Popover;
        friend?: FriendLink[];
        authorList?: Omit<FriendLink, 'avatar'>[];
        /**
         * 启用 [vitepress-plugin-tabs](https://www.npmjs.com/package/vitepress-plugin-tabs)
         * @default false
         */
        tabs?: boolean;
        works?: UserWorks;
        /**
         * https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
         * @default true
         */
        mermaid?: any;
        /**
         * 设置解析 frontmatter 里 date 的时区
         * @default 8 => 'UTC+8'
         * */
        timeZone?: number;
        /**
         * 启用RSS配置
         */
        RSS?: RSSOptions;
    }
    type RSSOptions = FeedOptions & {
        baseUrl: string;
        /**
         * 线上访问的RSS地址
         */
        url: string;
        /**
         * 输出的RSS文件名
         * @default 'feed.rss'
         */
        filename?: string;
        /**
         * 是否展示RSS的图标
         * @default true
         */
        showIcon?: boolean;
    };
    interface Config extends DefaultTheme.Config {
        blog?: BlogConfig;
    }
    interface HomeConfig {
        /**
         * @deprecated
         * 此方法已经废弃，这个定义将在未来某一刻被移除，请为 inspiring 配置数租来实现相同的效果
         */
        handleChangeSlogan?: (oldSlogan: string) => string | Promise<string>;
    }
}

/**
 * 获取主题的配置
 * @param cfg 主题配置
 */
declare function getThemeConfig(cfg?: Partial<Theme.BlogConfig>): any;
/**
 * defineConfig Helper
 */
declare function defineConfig(config: UserConfig<Theme.Config>): any;

export { defineConfig, getThemeConfig };
