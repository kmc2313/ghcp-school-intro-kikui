# Design - 神山まるごと高専 紹介サイト

## 1. アーキテクチャ概要

静的マルチページサイト。ビルド工程を持たず、ブラウザが HTML / CSS / JS / SVG / JSON を直接読み込む。共通レイアウト（ヘッダ・フッタ）はクライアントサイドJSでDOMに差し込むため、各HTMLページは`<div id="site-header"></div>`等のプレースホルダのみを持つ。

```
[User Browser]
    │ HTTPS
    ▼
[GitHub Pages CDN]
    │ 静的配信
    ▼
┌─────────────────────────────────────────┐
│  index.html / about.html / ...          │
│    ├─ <link> styles.css                 │
│    ├─ <script> layout.js → ヘッダ/フッタ注入│
│    ├─ <script> i18n.js   → 辞書fetch & 差替│
│    └─ <script> main.js   → ナビ/演出     │
│  assets/i18n/ja.json, en.json            │
│  assets/img/*.svg                        │
└─────────────────────────────────────────┘
        ▲
        │ push main / workflow_dispatch
[GitHub Actions: deploy.yml]
    checkout → configure-pages → upload-pages-artifact → deploy-pages
```

## 2. Decision Records

### Decision - DR-001 (2026-04-22)
- **Decision**: 共通ヘッダ/フッタをクライアントJS（`assets/js/layout.js`）でDOM注入する（plan検討事項1 Option A採用）
- **Context**: 素HTML複数ページで同一レイアウトを保守する必要がある
- **Options**:
  - A. JSで動的注入 — ビルド不要・1ファイル更新で全ページ反映 / 初回描画に一瞬のチラつき・JS無効環境で欠落
  - B. 各HTMLに手動コピペ — JS不要 / 修正漏れリスク高
  - C. Astro導入 — SSGによる堅牢な共通化 / ユーザー選択（素HTML）から逸脱
- **Rationale**: ユーザー選択の素HTML構成を尊重しつつ保守性を担保するAが最適。チラつきはCSSで初期ヘッダ枠高さを確保し最小化する。
- **Impact**: JS無効時はヘッダ/フッタが表示されない（noscriptで注記）。Lighthouse CLS に影響しないよう高さリザーブ必須。
- **Review**: コンテンツが1ページあたり5KB超で遅延が顕在化した場合に再評価。

### Decision - DR-002 (2026-04-22)
- **Decision**: EN翻訳は骨子（見出し・ナビ・CTA・共通UI）のみ提供、本文未訳部は "Full English coming soon" 注記（plan検討事項2 Option A採用）
- **Context**: 翻訳品質を担保できない本文まで機械的に訳す運用リスク
- **Options**: A. 骨子のみ / B. 全訳
- **Rationale**: 学習用サイトとして体裁を維持しつつ誤訳リスクを最小化。
- **Impact**: `en.json` のキー数を抑制でき、後続追加もキー単位で段階的に可能。
- **Review**: 公式英語コンテンツが整備された時点。

### Decision - DR-003 (2026-04-22)
- **Decision**: フッタに非公式注記＋公式サイトリンクを必須表示（plan検討事項3 採用）
- **Context**: 学習用のダミー下書きを含むため、閲覧者の誤認リスクを下げる
- **Rationale**: 出典と責任範囲を明示する標準的配慮。
- **Impact**: フッタテンプレに固定文言を配置。i18n辞書に含める。
- **Review**: 公式とのコンテンツ連携が発生した場合。

## 3. ディレクトリ / ファイル構成

```
/
├─ index.html
├─ about.html
├─ access.html
├─ admissions.html
├─ gallery.html
├─ voices.html
├─ faq.html
├─ 404.html                         # 任意（Pagesのデフォ置換）
├─ assets/
│  ├─ css/
│  │  └─ styles.css                 # デザイントークン + 共通コンポーネント + ページ別
│  ├─ js/
│  │  ├─ layout.js                  # ヘッダ/フッタDOM注入（先頭ロード）
│  │  ├─ i18n.js                    # 辞書fetch・DOM差替・localStorage
│  │  └─ main.js                    # ハンバーガー・スクロール演出
│  ├─ i18n/
│  │  ├─ ja.json
│  │  └─ en.json
│  └─ img/
│     ├─ hero-blob.svg
│     ├─ wave.svg
│     ├─ kamiyama-illust.svg
│     ├─ campus-illust.svg
│     └─ student-illust.svg
├─ .github/workflows/deploy.yml
├─ spec/ (requirements.md / design.md / tasks.md)
└─ README.md
```

## 4. データモデル / インターフェース

### 4.1 i18n 辞書スキーマ（JSON）
ドット区切りのフラットキー、または2階層ネスト。実装はネスト→フラット化して解決。

```json
{
  "site": { "name": "神山まるごと高専", "tagline": "テクノロジー×デザイン×起業家精神" },
  "nav":  { "home": "ホーム", "about": "特徴", "access": "アクセス", "admissions": "入試", "gallery": "ギャラリー", "voices": "在校生の声", "faq": "FAQ" },
  "hero": { "title": "…", "cta": "もっと見る" },
  "footer": { "disclaimer": "本サイトは学習用の非公式紹介ページです。…", "officialLink": "公式サイト" },
  "common": { "reviewBadge": "【要確認】", "comingSoon": "Full English coming soon" }
}
```

### 4.2 HTML マーキング規約

```html
<h1 data-i18n="hero.title">神山で、未来をつくる。</h1>
<a href="about.html" data-i18n="nav.about">特徴</a>
<span class="badge-review" data-i18n="common.reviewBadge">【要確認】</span>
```

- 属性翻訳が必要な場合: `data-i18n-attr="placeholder:form.name"` 形式で拡張（今回未使用）

### 4.3 layout.js API

```js
// 実装スケッチ
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('site-header').innerHTML = HEADER_HTML;
  document.getElementById('site-footer').innerHTML = FOOTER_HTML;
  document.dispatchEvent(new CustomEvent('layout:ready'));
});
```

- HEADER_HTML / FOOTER_HTML はテンプレートリテラルで保持
- 現在ページの判定は `location.pathname` 末尾ファイル名で `aria-current="page"` を付与

### 4.4 i18n.js API

```js
// 概念フロー
const lang = resolveLang(); // localStorage → navigator.language → 'ja'
const dict = await fetch(`assets/i18n/${lang}.json`).then(r => r.json());
applyDict(dict); // [data-i18n] を全走査し textContent を置換
document.documentElement.lang = lang;
// 言語切替: toggle(newLang) → localStorage保存 → 再適用
```

- `layout:ready` イベントをlistenしてから適用することでヘッダ/フッタ内の`data-i18n`も対象化

### 4.5 ロード順序（各HTML `<head>` / `<body>`末尾）

1. `<link rel="stylesheet" href="assets/css/styles.css">`
2. `<link rel="preconnect" ...>` + Google Fonts
3. `<body>` 末尾で `layout.js` → `i18n.js` → `main.js` の順（deferで並列取得可）

## 5. シーケンス図

### 5.1 初回ロード

```
User        Browser             layout.js          i18n.js           main.js
 │            │                    │                  │                  │
 │─GET URL──▶│                    │                  │                  │
 │            │─HTML/CSS取得──────▶                   │                  │
 │            │─JS defer load─────▶                   │                  │
 │            │      DOMContentLoaded                 │                  │
 │            │─────────────────▶ layout注入         │                  │
 │            │                    └─layout:ready event▶                 │
 │            │                                      ─fetch ja/en.json──▶│
 │            │                                      ─apply dict─────▶DOM│
 │            │─────────────────────────────────────────────────────────▶│
 │            │                                                  nav/演出│
```

### 5.2 言語切替

```
User──click JA/EN──▶ i18n.js.toggle('en')
                       ├─ localStorage.setItem('site.lang','en')
                       ├─ fetch en.json (キャッシュ)
                       ├─ applyDict → DOM差替
                       └─ document.documentElement.lang='en'
```

## 6. CSS デザイントークン（抜粋）

```css
:root {
  --c-blue: #A8D8EA;
  --c-yellow: #FFE98A;
  --c-peach: #FFCAB1;
  --c-bg: #FAFBFF;
  --c-text: #2E3A59;
  --c-muted: #7A869A;
  --radius-lg: 20px;
  --radius-md: 16px;
  --shadow-card: 0 8px 24px rgba(46,58,89,.08);
  --font-body: "M PLUS Rounded 1c", system-ui, "Hiragino Maru Gothic ProN", sans-serif;
  --bp-sm: 720px;
  --bp-md: 1024px;
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## 7. エラーマトリクス

| # | 事象 | 原因 | 期待挙動 | 対応 |
|---|------|------|----------|------|
| E1 | `en.json` 取得失敗 | ネットワーク/404 | 既定言語 ja にフォールバックしconsole.warn | i18n.js で try/catch |
| E2 | 辞書キー未定義 | 翻訳未完 | 初期DOMテキスト維持 | applyDict で存在チェック |
| E3 | JS無効 | ブラウザ設定 | `<noscript>` 注記と最低限の静的リンク表示 | 各ページに `<noscript>` を配置 |
| E4 | Google Fonts 読込失敗 | CDN障害 | システム丸ゴシックへフォールバック | `font-family` スタック |
| E5 | 相対パス解決失敗 | サブディレクトリ誤解 | — | 全リンクを相対 (`./` / `assets/...`) で統一、テスト |
| E6 | Actions デプロイ失敗 | 権限/設定漏れ | ワークフロー赤、公開は前回分維持 | README の手順どおり Source=Actions 設定 |

## 8. GitHub Actions ワークフロー（deploy.yml 概要）

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - name: Stage public files
        run: |
          mkdir _site
          rsync -a --exclude='.git' --exclude='.github' --exclude='spec' \
                --exclude='_site'  --exclude='README.md' ./ _site/
      - uses: actions/upload-pages-artifact@v3
        with: { path: _site }
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 9. テスト戦略

- **手動ブラウザ検証**: `python3 -m http.server 4321` でローカル起動し、Chrome/Firefoxで7ページ巡回、リンク・SVG・言語トグル確認
- **アクセシビリティ**: Lighthouse / axe DevTools でページ単位チェック
- **HTML構造**: W3C Validator で主要3ページ
- **サブパス検証**: `python3 -m http.server` 後に手動で `http://localhost:8000/ghcp-school-intro-kikui/` 擬似パスでの確認は不要（相対パス採用のため）。代わりにActions実機で確認。
- **i18n ユニット確認**: ブラウザDevToolsで `localStorage.clear()` → 再読込で既定言語決定ロジック確認
- **自動化**: 現段階では導入しない（ビルド/テスト基盤ゼロ方針）。将来 `playwright` 導入余地あり。

## 10. 非機能設計

- **パフォーマンス**: 画像は全てSVG、JSは3ファイル合計 < 10KB を目標、フォントは `display=swap`
- **アクセシビリティ**: ナビに `aria-current`, ハンバーガーに `aria-expanded`/`aria-controls`, カラーコントラストは本文テキスト `#2E3A59` on `#FAFBFF` で AA クリア
- **セキュリティ**: 外部スクリプト無し、Google Fontsのみ。`rel="noopener noreferrer"` を外部リンクに付与
