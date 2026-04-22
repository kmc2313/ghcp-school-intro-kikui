# Plan: 神山まるごと高専 紹介サイト構築

素のHTML/CSS/JSで複数ページ構成の紹介LPを作り、GitHub ActionsでGitHub Pagesへ自動デプロイする。パレットはベビーブルー＋イエロー＋ピーチのパステル。日本語/英語トグルをJSで実装し、コンテンツは公式情報ベースの下書き（※要確認マーク付き）。

## サイト構成（複数HTML）
- `index.html` トップ（ヒーロー・キャッチコピー・各セクションへの導線）
- `about.html` 学校の特徴・カリキュラム紹介
- `access.html` 場所・アクセス（神山町紹介含む）
- `admissions.html` 入試・募集要項の案内
- `gallery.html` ギャラリー（SVGイラスト2〜3種）
- `voices.html` 在校生・卒業生の声
- `faq.html` FAQ
- 各ページに共通ヘッダ（ロゴ+ナビ+言語トグル）・フッタ（公式お問い合わせリンク / mailto）

相対パスで全ページ相互リンク（プロジェクトページ配信 `/ghcp-school-intro-kikui/` 前提でも破綻しない設計）。

## デザイン方針
- パレット: ベビーブルー `#A8D8EA` / イエロー `#FFE98A` / ピーチ `#FFCAB1` / 淡グレー背景 `#FAFBFF` / テキスト `#2E3A59`
- フォント: システム日本語 + Googleフォント `M PLUS Rounded 1c`（丸ゴシック）を`<link>`で読み込み
- 角丸大きめ（16-24px）、柔らかいドロップシャドウ、手描き風の装飾ボーダー
- ヒーローは斜めブロブ背景のSVG、セクション区切りに波形SVG
- ホバー時に軽くバウンスするカード、CSSで`prefers-reduced-motion`対応
- モバイルファースト、ブレイクポイント720px/1024px

## ディレクトリ構成
```
/
├─ index.html
├─ about.html / access.html / admissions.html / gallery.html / voices.html / faq.html
├─ assets/
│  ├─ css/styles.css
│  ├─ js/main.js           // ハンバーガー・スクロール演出・共通
│  ├─ js/i18n.js           // 言語切替ロジック
│  ├─ i18n/ja.json, en.json
│  └─ img/                 // SVG（hero-blob.svg, wave.svg, kamiyama-illust.svg, campus-illust.svg, student-illust.svg）
├─ .github/workflows/deploy.yml
└─ README.md（更新）
```

## 多言語切替（i18n）
- HTML側: `<span data-i18n="hero.title">…</span>` 形式で全文キー化
- `assets/js/i18n.js` が `ja.json` / `en.json` をfetch → DOMを差し替え
- `<html lang>` を切替、選択値を `localStorage` に保存
- ナビ右端に `JA / EN` トグル
- 初期値はブラウザ言語、無ければ `ja`

## コンテンツ方針
- 公式サイト（kamiyama.ac.jp 等）の公開情報をベースに下書きし、固有の数値・日程・人名などには `【要確認】` マークをHTMLコメント + 本文バッジで明示
- 記載する主項目:
  - 学校概要（2023年開校、テクノロジー×デザイン×起業家精神）
  - カリキュラム柱、学寮生活、5年一貫
  - 所在地（徳島県神山町）とアクセス導線
  - 入試は公式情報への案内リンク中心（要項の転載はしない）
  - 声セクションはダミーの代表1〜2名を架空設定と明示

## デプロイ（GitHub Actions）
- `.github/workflows/deploy.yml`:
  - `on: push: branches: [main]` + `workflow_dispatch`
  - `permissions: pages: write, id-token: write, contents: read`
  - ジョブ: `actions/checkout` → `actions/configure-pages` → `actions/upload-pages-artifact`（path=`.`、ただしリポジトリ直下に公開物を置くためworkflowや`.github`等は除外パターンで整理） → `actions/deploy-pages`
- Settings > Pages の Source を **GitHub Actions** に切替（手順をREADMEに記載）

## 実装フェーズ

### Phase 1: 土台（並列可）
1. `assets/css/styles.css` でデザインシステム定義（CSS変数・共通コンポーネントクラス）
2. `assets/js/i18n.js` と `ja.json`/`en.json` の雛形
3. SVGアセット3〜5種作成（hero-blob / wave / kamiyama-illust / campus-illust / student-illust）

### Phase 2: ページ実装（Phase 1後、各ページ並列可）
4. 共通ヘッダ/フッタをHTMLに直書き（SSG不使用のためコピペ運用、後述の制約参照）
5. `index.html` → `about` → `access` → `admissions` → `gallery` → `voices` → `faq` の順に肉付け

### Phase 3: デプロイ
6. `.github/workflows/deploy.yml` 追加
7. README を更新（ローカル確認手順 / Pages設定手順 / コンテンツ更新時の注意）

### Phase 4: 検証
8. ローカルで `python3 -m http.server` or VS Code Live Server で全ページ巡回
9. 言語トグル動作、モバイル/PC表示、リンク切れ、SVG表示確認
10. GitHub Actions 実行 → 公開URLで再確認

## 主要編集ファイル
- 新規: 上記ディレクトリ構成すべて
- 更新: `README.md`（テンプレ状態を置き換え、運用手順を記載）
- 更新: `.github/copilot-instructions.md` のBuild/Test欄は静的サイト向けに追記（任意）

## 検証項目
- 全ページで `JA/EN` トグルが動く（`localStorage` 保持）
- ナビのアクティブ状態、ハンバーガー（モバイル）動作
- SVG・CSSが相対パスで読み込まれる（`/ghcp-school-intro-kikui/` 配下でも）
- Lighthouse: Accessibility 90+ / Performance 90+
- HTMLバリデーション（W3C validator）主要ページで致命エラーなし
- GitHub Actions 緑、Pages公開URL `https://kmc2313.github.io/ghcp-school-intro-kikui/` で表示

## 決定事項・スコープ
- **採用**: 素HTML/CSS/JS複数ページ、ベビーブルー＋イエロー＋ピーチ、i18nトグル、SVG自作、Actionsデプロイ
- **スコープ外**: 問い合わせフォームの送信機能（公式リンクへ誘導のみ）、CMS連携、ブログ機能、独自ドメイン、写真素材差し替え（プレースホルダーSVGのまま）
- **ダミー扱い**: 在校生の声、具体的な数値・日程は `【要確認】` バッジで表示

## さらなる検討事項
1. 共通ヘッダ/フッタの重複問題: 素HTML複数ページだとコピペ運用になるが許容するでし？
   - Option A（推奨）: 共通HTMLを`assets/js/layout.js` が DOMに差し込む（JSで解決、ビルド不要）
   - Option B: 各ページに手動コピペ（更新時に全ページ修正）
   - Option C: 方針転換してAstroへ（当初選択と異なる）
2. EN翻訳の粒度: 全文翻訳するか、主要見出しだけにするか
   - Option A（推奨）: 見出し・ナビ・CTAなど骨子のみ英訳、本文は日本語注記「Full English coming soon」
   - Option B: 全文翻訳（ダミー英文も含む）
3. 公式情報の引用範囲: 引用元URLをフッタに明記すべきか
   - 推奨: フッタに「※本サイトは学習用の非公式紹介ページです。正確な情報は公式サイトをご確認ください」の注記＋公式リンクを必ず入れる
