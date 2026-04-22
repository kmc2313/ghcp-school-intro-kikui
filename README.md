# 神山まるごと高専 紹介サイト

中学生・受験生向けの、神山まるごと高専の非公式紹介サイトでし。  
素のHTML/CSS/JSで構成し、GitHub Actions経由でGitHub Pagesにデプロイする設計でし。

## 公開URL

- https://kmc2313.github.io/ghcp-school-intro-kikui/

## ページ構成

- `index.html`
- `about.html`
- `access.html`
- `admissions.html`
- `gallery.html`
- `voices.html`
- `faq.html`

## ローカル確認手順

1. このリポジトリのルートで以下を実行

```bash
python3 -m http.server 4321
```

2. ブラウザで以下を開く

- http://localhost:4321/

3. 以下を確認

- 7ページ遷移
- モバイル幅でハンバーガーメニュー動作
- JA/ENトグルと `localStorage.site.lang` 保存
- SVG/CSS/JS読込

## GitHub Pages 設定

1. GitHub の `Settings > Pages` を開く
2. `Build and deployment` の `Source` を `GitHub Actions` に設定
3. `main` ブランチへのpush、またはActionsの `workflow_dispatch` で `.github/workflows/deploy.yml` を実行

## 運用ルール

- 固有の数値・日程・人名など、確定前情報には `【要確認】` バッジを表示する
- 在校生の声は架空人物である旨を明示する
- 入試要項本文は転載せず、公式ページ導線を優先する

## 主な技術要素

- 共通ヘッダ/フッタ: `assets/js/layout.js` によるDOM注入
- 多言語切替: `assets/js/i18n.js` と `assets/i18n/*.json`
- 共通UI: `assets/js/main.js`
- スタイル: `assets/css/styles.css`
