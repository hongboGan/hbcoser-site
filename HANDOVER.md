# hbcoser.com 独立站移交说明

## 1. 这是什么

一个 B2B 外贸展示型独立站（儿童 cosplay / 宠物服装 / 派对活动物料，面向批发与 OEM 买家）。

- 技术栈：React 18 + Vite 5 + React Router 6
- 构建方式：构建时预渲染（SSG），59 个路由全部输出为静态 HTML，SEO 友好、全球秒开
- 内容规模：36 个商品、13 篇博客
- 无后端、无数据库，所有内容在源码里，改完重新构建即可

## 2. 本地跑起来

要求 Node.js 18 或以上。

```bash
npm ci          # 安装依赖（首次）
npm run dev     # 本地开发，默认 http://localhost:5173
npm run build   # 生产构建，产物在 dist/
npm run preview # 预览构建结果
```

构建会依次做三件事：打包前端 → 打包 SSR 入口 → 预渲染全部路由。看到 `prerender: wrote 59/59 routes` 即为成功。

## 3. 部署到 Vercel

1. 把代码推到自己的 GitHub 仓库（不要提交 `node_modules`、`dist`、`.env`）
2. Vercel 新建项目 → 导入该仓库
3. Framework 选 Vite，Build Command 与 Output Directory 按 `package.json` 与 Vite 默认（`dist`）
4. `vercel.json` 已配置 `cleanUrls: true`，深层链接才不会被 404 兜底吃掉，**不要删**
5. 在 Vercel 项目的 Domains 里添加域名，按页面给出的记录去 DNS 服务商配置

## 4. 接手后必须改的地方

| 位置 | 内容 | 说明 |
|---|---|---|
| `src/data/products.js` → `CONTACT` | `email` | 对外展示的邮箱 |
| 同上 | `formEmail` | **询盘表单的实际收件地址**，必须换成自己已激活的地址 |
| 同上 | `facebookName` / `facebookUrl` | 自己的 Facebook 页面 |
| 同上 | `whatsappDisplay` / `whatsappUrl` | 自己的 WhatsApp 号码 |
| 同上 | `SITE_CODE` | WhatsApp 来源标记前缀，当前为 `HB3` |
| `index.html` 第 36 行左右 | JSON-LD 里的 `"email"` | 结构化数据，要和新邮箱一致 |

**询盘表单注意**：表单走 FormSubmit（`https://formsubmit.co/ajax/<formEmail>`），它只向**已激活**的地址投递。换地址后，第一次提交会触发一封激活邮件，点开确认才会真正收到询盘。未激活期间表单判定失败会自动切到 Web3Forms 备用通道，但备用通道同样需要自己的 key，请一并检查 `src/pages/Inquiry.jsx`。

## 5. 内容怎么加

- **加商品**：`src/data/products.json` 追加对象，图片放 `public/products/`，`build` 会自动生成路由、预渲染页面和 sitemap
- **加博客**：`src/content/blog.js` 的 `POSTS` 追加，字段格式照现有条目写；封面复用 `public/products/` 里已有的图
- **换设计**：`src/styles.css` + `DESIGN.md`（里面有视觉规则，改版前先读）

## 6. 三条硬规则（沿用原站规范）

1. 图片一律自托管到 `public/products/`，不直连供应商 CDN（防盗链 + 中文水印）
2. 只上通用款或原创设计，文案不出现任何 IP、角色、影视、品牌名称
3. 任何图片都按 `object-fit: contain` 展示，不裁切主体

## 7. 不属于代码包的东西

以下需要单独交接，**不在这个压缩包里**：

- **域名 hbcoser.com**：注册商处转移或改 DNS 指向新 Vercel 项目
- **GitHub 仓库**：可在仓库 Settings 里 Transfer ownership，或直接把本包推到新仓库
- **Vercel 项目**：可在项目设置里 Transfer 到另一个账号/团队，版本历史会一起过去
- **Google Search Console**：现属原账号，需在新账号重新验证并添加站点（或用原账号把新邮箱加为 owner）
- **原站的历史博客草稿队列**：属于内部流程，未随包移交

## 8. 验收清单

- [ ] `npm ci && npm run build` 通过，看到 `prerender: wrote 59/59 routes`
- [ ] 首页、商品页、博客页在本地 `npm run preview` 下正常打开
- [ ] `CONTACT` 里五项联系方式已全部换成自己的
- [ ] 表单提交一次，确认邮件真的收到
- [ ] Vercel 域名生效，`https://域名/product/<任一商品id>` 能打开
- [ ] WhatsApp 点击后预填文案里的 `ref` 标记正确
