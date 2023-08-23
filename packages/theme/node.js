"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node.ts
var node_exports = {};
__export(node_exports, {
  defineConfig: () => defineConfig,
  getThemeConfig: () => getThemeConfig,
  tabsMarkdownPlugin: () => tabsPlugin
});
module.exports = __toCommonJS(node_exports);

// ../../node_modules/.pnpm/vitepress-plugin-tabs@0.2.0_vitepress@1.0.0-rc.4_vue@3.3.4/node_modules/vitepress-plugin-tabs/dist/index.js
var tabsMarker = "=tabs";
var tabsMarkerLen = tabsMarker.length;
var ruleBlockTabs = (state, startLine, endLine, silent) => {
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  if (pos + 3 > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== 58) {
    return false;
  }
  const mem = pos;
  pos = state.skipChars(pos, marker);
  let len = pos - mem;
  if (len < 3) {
    return false;
  }
  if (state.src.slice(pos, pos + tabsMarkerLen) !== tabsMarker) {
    return false;
  }
  pos += tabsMarkerLen;
  if (silent) {
    return true;
  }
  const markup = state.src.slice(mem, pos);
  const params = state.src.slice(pos, max);
  let nextLine = startLine;
  let haveEndMarker = false;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    const mem2 = pos;
    max = state.eMarks[nextLine];
    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }
    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      continue;
    }
    pos = state.skipChars(pos, marker);
    if (pos - mem2 < len) {
      continue;
    }
    pos = state.skipSpaces(pos);
    if (pos < max) {
      continue;
    }
    haveEndMarker = true;
    break;
  }
  len = state.sCount[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  const token = state.push("tabs", "div", 0);
  token.info = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup = markup;
  token.map = [startLine, state.line];
  return true;
};
var tabBreakRE = /^\s*::(.+)$/;
var forbiddenCharsInSlotNames = /[ '"]/;
var parseTabBreakLine = (line) => {
  const m = line.match(tabBreakRE);
  if (!m)
    return null;
  const trimmed = m[1].trim();
  if (forbiddenCharsInSlotNames.test(trimmed)) {
    throw new Error(
      `contains forbidden chars in slot names (space and quotes) (${JSON.stringify(
        line
      )})`
    );
  }
  return trimmed;
};
var lastLineBreakRE = /\n$/;
var parseTabsContent = (content) => {
  const lines = content.replace(lastLineBreakRE, "").split("\n");
  const tabInfos = [];
  const tabLabels = /* @__PURE__ */ new Set();
  let currentTab = null;
  const createTabInfo = (label) => {
    if (tabLabels.has(label)) {
      throw new Error(`a tab labelled ${JSON.stringify(label)} already exists`);
    }
    const newTab = { label, content: [] };
    tabInfos.push(newTab);
    tabLabels.add(label);
    return newTab;
  };
  for (const line of lines) {
    const tabLabel = parseTabBreakLine(line);
    if (currentTab === null) {
      if (tabLabel === null) {
        throw new Error(
          `tabs should start with \`::\${tabLabel}\` (e.g. "::foo"). (received: ${JSON.stringify(
            line
          )})`
        );
      }
      currentTab = createTabInfo(tabLabel);
      continue;
    }
    if (tabLabel === null) {
      currentTab.content.push(line);
    } else {
      currentTab = createTabInfo(tabLabel);
    }
  }
  if (tabInfos.length < 0) {
    throw new Error("tabs should include at least one tab");
  }
  return tabInfos.map((info) => ({
    label: info.label,
    content: info.content.join("\n").replace(lastLineBreakRE, "")
  }));
};
var parseParams = (input) => {
  if (!input.startsWith("=")) {
    return {
      shareStateKey: void 0
    };
  }
  const splitted = input.split("=");
  return {
    shareStateKey: splitted[1]
  };
};
var tabsPlugin = (md) => {
  md.block.ruler.before("fence", "=tabs", ruleBlockTabs, {
    alt: ["paragraph", "reference", "blockquote", "list"]
  });
  md.renderer.rules.tabs = (tokens, index, _options, env) => {
    const token = tokens[index];
    const tabs = parseTabsContent(token.content);
    const renderedTabs = tabs.map((tab) => ({
      label: tab.label,
      content: md.render(tab.content, env)
    }));
    const params = parseParams(token.info);
    const tabLabelsProp = `:tabLabels="${md.utils.escapeHtml(
      JSON.stringify(tabs.map((tab) => tab.label))
    )}"`;
    const shareStateKeyProp = params.shareStateKey ? `sharedStateKey="${md.utils.escapeHtml(params.shareStateKey)}"` : "";
    const slots = renderedTabs.map(
      (tab) => `<template #${tab.label}>${tab.content}</template>`
    );
    return `<PluginTabs ${tabLabelsProp} ${shareStateKeyProp}>${slots.join(
      ""
    )}</PluginTabs>`;
  };
};

// src/utils/node/index.ts
var import_child_process = require("child_process");

// src/utils/client/index.ts
function formatDate(d, fmt = "yyyy-MM-dd hh:mm:ss") {
  if (!(d instanceof Date)) {
    d = new Date(d);
  }
  const o = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "h+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${d.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  }
  return fmt;
}

// src/utils/node/index.ts
function clearMatterContent(content) {
  let first___;
  let second___;
  const lines = content.split("\n").reduce((pre, line) => {
    if (!line.trim() && pre.length === 0) {
      return pre;
    }
    if (line.trim() === "---") {
      if (first___ === void 0) {
        first___ = pre.length;
      } else if (second___ === void 0) {
        second___ = pre.length;
      }
    }
    pre.push(line);
    return pre;
  }, []);
  return lines.slice(second___ || 0).join("\n");
}
function getDefaultTitle(content) {
  const title = clearMatterContent(content).split("\n")?.find((str) => {
    return str.startsWith("# ");
  })?.slice(2).replace(/^\s+|\s+$/g, "") || "";
  return title;
}
function getFileBirthTime(url) {
  let date = new Date();
  try {
    const infoStr = (0, import_child_process.spawnSync)("git", ["log", "-1", '--pretty="%ci"', url]).stdout?.toString().replace(/["']/g, "").trim();
    if (infoStr) {
      date = new Date(infoStr);
    }
  } catch (error) {
    return formatDate(date);
  }
  return formatDate(date);
}
function getTextSummary(text, count = 100) {
  return clearMatterContent(text).match(/^# ([\s\S]+)/m)?.[1]?.replace(/#/g, "")?.replace(/!\[.*?\]\(.*?\)/g, "")?.replace(/\[(.*?)\]\(.*?\)/g, "$1")?.replace(/\*\*(.*?)\*\*/g, "$1")?.split("\n")?.filter((v) => !!v)?.slice(1)?.join("\n")?.replace(/>(.*)/, "")?.slice(0, count);
}
function aliasObjectToArray(obj) {
  return Object.entries(obj).map(([find, replacement]) => ({
    find,
    replacement
  }));
}
var EXTERNAL_URL_RE = /^[a-z]+:/i;
function joinPath(base, path4) {
  return `${base}${path4}`.replace(/\/+/g, "/");
}
function withBase(base, path4) {
  return EXTERNAL_URL_RE.test(path4) || path4.startsWith(".") ? path4 : joinPath(base, path4);
}

// src/utils/node/mdPlugins.ts
function getMarkdownPlugins(cfg) {
  const markdownPlugin = [];
  if (cfg?.tabs) {
    markdownPlugin.push(tabsPlugin);
  }
  if (cfg) {
    cfg.mermaid = cfg?.mermaid ?? true;
    if (cfg?.mermaid !== false) {
      const { MermaidMarkdown } = require("vitepress-plugin-mermaid");
      markdownPlugin.push(MermaidMarkdown);
    }
  }
  return markdownPlugin;
}
function registerMdPlugins(vpCfg, plugins) {
  if (plugins.length) {
    vpCfg.markdown = {
      config(...rest) {
        plugins.forEach((plugin) => {
          plugin?.(...rest);
        });
      }
    };
  }
}
function assignMermaid(config) {
  if (!config?.mermaid)
    return;
  if (!config.vite)
    config.vite = {};
  if (!config.vite.plugins)
    config.vite.plugins = [];
  const { MermaidPlugin } = require("vitepress-plugin-mermaid");
  config.vite.plugins.push(MermaidPlugin(config.mermaid));
  if (!config.vite.resolve)
    config.vite.resolve = {};
  if (!config.vite.resolve.alias)
    config.vite.resolve.alias = {};
  config.vite.resolve.alias = [
    ...aliasObjectToArray({
      ...config.vite.resolve.alias,
      "cytoscape/dist/cytoscape.umd.js": "cytoscape/dist/cytoscape.esm.js",
      mermaid: "mermaid/dist/mermaid.esm.mjs"
    }),
    { find: /^dayjs\/(.*).js/, replacement: "dayjs/esm/$1" }
  ];
}
function wrapperCfgWithMermaid(config) {
  const extendThemeConfig = config.extends?.themeConfig?.blog || {};
  const resultConfig = extendThemeConfig.mermaid === false ? config : {
    ...config,
    mermaid: extendThemeConfig.mermaid === true ? {} : extendThemeConfig.mermaid
  };
  assignMermaid(resultConfig);
  return resultConfig;
}
function supportRunExtendsPlugin(config) {
  if (!config.markdown)
    config.markdown = {};
  if (config.extends?.markdown?.config) {
    const markdownExtendsConfigOriginal = config.extends?.markdown?.config;
    const selfMarkdownConfig = config.markdown?.config;
    config.markdown.config = (...rest) => {
      selfMarkdownConfig?.(...rest);
      markdownExtendsConfigOriginal?.(...rest);
    };
  }
}

// src/utils/node/theme.ts
var import_fast_glob = __toESM(require("fast-glob"));
var import_gray_matter = __toESM(require("gray-matter"));
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function patchDefaultThemeSideBar(cfg) {
  return cfg?.blog !== false && cfg?.recommend !== false ? {
    sidebar: [
      {
        text: "",
        items: []
      }
    ]
  } : void 0;
}
var pageMap = /* @__PURE__ */ new Map();
function getArticles(cfg) {
  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || ".";
  const files = import_fast_glob.default.sync(`${srcDir}/**/*.md`, { ignore: ["node_modules"] });
  const data = files.map((v) => {
    let route = v.replace(".md", "");
    if (route.startsWith("./")) {
      route = route.replace(
        new RegExp(
          `^\\.\\/${import_path.default.join(srcDir, "/").replace(new RegExp(`\\${import_path.default.sep}`, "g"), "/")}`
        ),
        ""
      );
    } else {
      route = route.replace(
        new RegExp(
          `^${import_path.default.join(srcDir, "/").replace(new RegExp(`\\${import_path.default.sep}`, "g"), "/")}`
        ),
        ""
      );
    }
    pageMap.set(`/${route}`, v);
    const fileContent = import_fs.default.readFileSync(v, "utf-8");
    const { data: frontmatter, excerpt } = (0, import_gray_matter.default)(fileContent, {
      excerpt: true
    });
    const meta = {
      ...frontmatter
    };
    if (!meta.title) {
      meta.title = getDefaultTitle(fileContent);
    }
    if (!meta.date) {
      meta.date = getFileBirthTime(v);
    } else {
      const timeZone = cfg?.timeZone ?? 8;
      meta.date = formatDate(
        new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
      );
    }
    meta.categories = typeof meta.categories === "string" ? [meta.categories] : meta.categories;
    meta.tags = typeof meta.tags === "string" ? [meta.tags] : meta.tags;
    meta.tag = [meta.tag || []].flat().concat([
      .../* @__PURE__ */ new Set([...meta.categories || [], ...meta.tags || []])
    ]);
    const wordCount = 100;
    meta.description = meta.description || getTextSummary(fileContent, wordCount);
    meta.cover = meta.cover ?? (fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] || "");
    if (meta.publish === false) {
      meta.hidden = true;
      meta.recommend = false;
    }
    return {
      route: `/${route}`,
      meta
    };
  }).filter((v) => v.meta.layout !== "home");
  return data;
}
function patchVPThemeConfig(cfg, vpThemeConfig = {}) {
  const RSS = cfg?.RSS;
  if (RSS && RSS.showIcon !== false) {
    vpThemeConfig.socialLinks = [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><path d="M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM112 416c-26.51 0-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48s-21.49 48-48 48zm157.533 0h-34.335c-6.011 0-11.051-4.636-11.442-10.634c-5.214-80.05-69.243-143.92-149.123-149.123c-5.997-.39-10.633-5.431-10.633-11.441v-34.335c0-6.535 5.468-11.777 11.994-11.425c110.546 5.974 198.997 94.536 204.964 204.964c.352 6.526-4.89 11.994-11.425 11.994zm103.027 0h-34.334c-6.161 0-11.175-4.882-11.427-11.038c-5.598-136.535-115.204-246.161-251.76-251.76C68.882 152.949 64 147.935 64 141.774V107.44c0-6.454 5.338-11.664 11.787-11.432c167.83 6.025 302.21 141.191 308.205 308.205c.232 6.449-4.978 11.787-11.432 11.787z" fill="currentColor"></path></svg>'
        },
        link: RSS.url
      }
    ];
  }
  vpThemeConfig.sidebar = patchDefaultThemeSideBar(cfg)?.sidebar;
  return vpThemeConfig;
}

// src/utils/node/vitePlugins.ts
var import_path3 = __toESM(require("path"));
var import_child_process2 = require("child_process");

// src/utils/node/genFeed.ts
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var import_feed = require("feed");
async function genFeed(config) {
  const blogCfg = config.userConfig.themeConfig.blog;
  const posts = blogCfg.pagesData;
  const { RSS, authorList = [] } = blogCfg;
  if (!RSS)
    return;
  const { createMarkdownRenderer } = await import("vitepress");
  const mdRender = await createMarkdownRenderer(
    config.srcDir,
    config.markdown,
    config.site.base,
    config.logger
  );
  console.log();
  console.log("=== feed: https://github.com/jpmonette/feed ===");
  const { base } = config.userConfig;
  const { baseUrl, filename } = RSS;
  const feed = new import_feed.Feed(RSS);
  posts.sort(
    (a, b) => +new Date(b.meta.date) - +new Date(a.meta.date)
  );
  for (const { route, meta } of posts) {
    const { title, description, date, hidden } = meta;
    if (hidden)
      continue;
    const author = meta.author ?? blogCfg.author;
    let link = `${baseUrl}${withBase(
      base || "",
      route.replace(/(^|\/)index$/, "$1")
    )}`;
    link = link.endsWith("/") ? link : `${link}${config?.cleanUrls ? "" : ".html"}`;
    const authorLink = authorList.find((v) => v.nickname === author)?.url;
    let html;
    const filepath = pageMap.get(route);
    if (filepath) {
      const fileContent = import_fs2.default.readFileSync(filepath, "utf-8");
      html = mdRender.render(fileContent);
    }
    feed.addItem({
      title,
      id: link,
      link,
      description,
      content: html,
      author: [
        {
          name: author,
          link: authorLink
        }
      ],
      date: new Date(date)
    });
  }
  const RSSFile = import_path2.default.join(config.outDir, filename || "feed.rss");
  (0, import_fs2.writeFileSync)(RSSFile, feed.rss2());
  console.log("\u{1F389} RSS generated", filename || "feed.rss");
  console.log();
}

// src/utils/node/vitePlugins.ts
function getVitePlugins(cfg) {
  const plugins = [];
  const buildEndFn = [];
  plugins.push(inlineBuildEndPlugin(buildEndFn));
  if (cfg?.search === "pagefind" || cfg?.search instanceof Object && cfg.search.mode === "pagefind") {
    plugins.push(inlinePagefindPlugin(buildEndFn));
  }
  buildEndFn.push(genFeed);
  return plugins;
}
function registerVitePlugins(vpCfg, plugins) {
  vpCfg.vite = {
    plugins
  };
}
function inlinePagefindPlugin(buildEndFn) {
  buildEndFn.push(() => {
    const ignore = [
      "div.aside",
      "a.header-anchor"
    ];
    const { log } = console;
    log();
    log("=== pagefind: https://pagefind.app/ ===");
    let command = `npx pagefind --source ${import_path3.default.join(
      process.argv.slice(2)?.[1] || ".",
      ".vitepress/dist"
    )}`;
    if (ignore.length) {
      command += ` --exclude-selectors "${ignore.join(", ")}"`;
    }
    log(command);
    log();
    (0, import_child_process2.execSync)(command, {
      stdio: "inherit"
    });
  });
  return {
    name: "@sugarar/theme-plugin-pagefind",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith("theme-default/Layout.vue")) {
        return code.replace("<VPContent>", "<VPContent data-pagefind-body>");
      }
      return code;
    }
  };
}
function inlineBuildEndPlugin(buildEndFn) {
  let rewrite = false;
  return {
    name: "@sugarar/theme-plugin-build-end",
    enforce: "pre",
    configResolved(config) {
      if (rewrite) {
        return;
      }
      const vitepressConfig = config.vitepress;
      if (!vitepressConfig) {
        return;
      }
      rewrite = true;
      const selfBuildEnd = vitepressConfig.buildEnd;
      vitepressConfig.buildEnd = (siteCfg) => {
        selfBuildEnd?.(siteCfg);
        buildEndFn.filter((fn) => typeof fn === "function").forEach((fn) => fn(siteCfg));
      };
    }
  };
}

// src/node.ts
function getThemeConfig(cfg) {
  const pagesData = getArticles(cfg);
  const extraVPConfig = {};
  const vitePlugins = getVitePlugins(cfg);
  registerVitePlugins(extraVPConfig, vitePlugins);
  const markdownPlugin = getMarkdownPlugins(cfg);
  registerMdPlugins(extraVPConfig, markdownPlugin);
  return {
    themeConfig: {
      blog: {
        pagesData,
        ...cfg
      },
      ...patchVPThemeConfig(cfg)
    },
    ...extraVPConfig
  };
}
function defineConfig(config) {
  const resultConfig = wrapperCfgWithMermaid(config);
  supportRunExtendsPlugin(resultConfig);
  return resultConfig;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineConfig,
  getThemeConfig,
  tabsMarkdownPlugin
});
