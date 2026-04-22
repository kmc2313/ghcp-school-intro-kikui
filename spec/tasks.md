# Tasks - 神山まるごと高専 紹介サイト

凡例: `[ ]` 未着手 / `[~]` 進行中 / `[x]` 完了

## Phase 1: 土台構築（並列可）

### T-01 CSSデザインシステム整備
- [x] `assets/css/styles.css` を新規作成
- 内容: CSS変数（パレット/角丸/シャドウ/フォント/ブレイクポイント）、リセット、共通コンポーネント（`.btn`, `.card`, `.badge-review`, `.nav`, `.hero`, `.section`, `.wave`）、`prefers-reduced-motion`対応
- 依存: なし
- 完了条件: 変数と共通クラスが定義され、全ページで参照可能

### T-02 i18n 基盤実装
- [x] `assets/js/i18n.js` を新規作成（言語解決・辞書fetch・DOM差替・トグル関数）
- [x] `assets/i18n/ja.json` を新規作成（全キー定義）
- [x] `assets/i18n/en.json` を新規作成（骨子のみ、本文は `common.comingSoon` 参照）
- 依存: T-04（layout:ready イベントを待つ）が同時進行可
- 完了条件: `localStorage.site.lang` で永続化、JA/EN切替でDOM更新

### T-03 SVGアセット作成
- [x] `assets/img/hero-blob.svg`（斜めブロブ背景、3色グラデ）
- [x] `assets/img/wave.svg`（セクション区切り波形）
- [x] `assets/img/kamiyama-illust.svg`（神山町の山・棚田モチーフ）
- [x] `assets/img/campus-illust.svg`（校舎・学寮モチーフ）
- [x] `assets/img/student-illust.svg`（学生シルエット）
- 依存: なし
- 完了条件: 5ファイルが配置され、`<img>` または `<object>` で読込可能

### T-04 共通レイアウト注入スクリプト
- [x] `assets/js/layout.js` を新規作成
- 内容: HEADER_HTML / FOOTER_HTML テンプレート、`DOMContentLoaded` で注入、`layout:ready` イベント発火、`aria-current` 設定、非公式注記＋公式リンクをフッタに固定
- 依存: T-01（ヘッダ/フッタのクラス名を決定）
- 完了条件: `<div id="site-header">` / `<div id="site-footer">` があるHTMLにヘッダ/フッタが描画される

### T-05 共通 main.js（ナビ/演出）
- [x] `assets/js/main.js` を新規作成
- 内容: ハンバーガー開閉（`aria-expanded` 更新）、スクロール時のヘッダ影付け
- 依存: T-04
- 完了条件: モバイル幅でメニュー開閉が動作

## Phase 2: ページ実装（Phase 1後、各ページ並列可）

各ページ共通: `<head>` に共通CSS/Fonts、`<body>` 先頭に `<div id="site-header"></div>`、末尾に `<div id="site-footer"></div>` と3つのscript（layout→i18n→main）。全本文要素に `data-i18n` を付与。

### T-06 index.html（トップ）
- [x] ヒーロー（キャッチコピー＋CTA＋hero-blob背景）
- [x] 3カード（特徴抜粋→about.htmlへ）
- [x] 「声」ピックアップ→voices.htmlへ
- [x] CTA帯（入試情報→admissions.html）

### T-07 about.html（特徴・カリキュラム）
- [x] 学校概要（2023年開校、5年一貫） `【要確認】` バッジ活用
- [x] カリキュラム3本柱（テクノロジー／デザイン／起業家精神）
- [x] 学寮生活セクション

### T-08 access.html（場所・神山町紹介）
- [x] 所在地（徳島県神山町） `【要確認】`
- [x] 神山町の魅力（棚田・アート・ITベンチャー誘致）
- [x] 交通手段（徳島駅からのバス案内） `【要確認】`
- [x] 公式アクセスページへのリンク

### T-09 admissions.html（入試案内）
- [x] 募集時期の概略（転載せず公式へ誘導） `【要確認】`
- [x] 公式入試ページへの大型CTAボタン
- [x] 問い合わせ先（mailto: 公式 / 公式問い合わせURL）

### T-10 gallery.html（ギャラリー）
- [x] SVGイラスト3種をグリッド配置
- [x] キャプションに `【要確認】`＋架空イメージの注記

### T-11 voices.html（在校生の声）
- [x] 架空の学生 2名のプロフィール＋コメント（全体に「※架空の人物です」注記）
- [x] student-illust.svg をアバター代わりに使用

### T-12 faq.html
- [x] Q&A 5問程度（ダミー）、`<details>`/`<summary>` で開閉

## Phase 3: デプロイ基盤

### T-13 GitHub Actions ワークフロー
- [x] `.github/workflows/deploy.yml` を新規作成（design.md 8章の雛形に準拠）
- [x] `_site` に rsync で公開物のみステージ、`.github`/`spec`/`README.md` を除外
- 完了条件: Actionsが緑、公開URLで反映

### T-14 Pages 設定手順 README 反映
- [x] `README.md` を更新: プロジェクト概要、ローカル確認手順（`python3 -m http.server 4321`）、Settings>Pages の Source を "GitHub Actions" にする手順、コンテンツ更新時の `【要確認】` 運用ルール
- 依存: T-13

## Phase 4: 検証

### T-15 ローカル全ページ巡回検証
- [ ] `python3 -m http.server 4321` でサーブ
- [ ] 7ページ遷移・SVG/CSS/Font表示・ハンバーガー・JA/ENトグル・`localStorage` 保持を確認
- [ ] リンク切れ・コンソールエラーがないことを確認

### T-16 アクセシビリティ / Lighthouse
- [ ] Lighthouse: Performance 90+ / Accessibility 90+（主要3ページ: index/about/admissions）
- [ ] axe DevTools で深刻度 critical / serious がゼロ

### T-17 本番デプロイ確認
- [ ] `main` に push → Actions 緑
- [ ] 公開URL `https://kmc2313.github.io/ghcp-school-intro-kikui/` で index 表示
- [ ] 各ページの相対パス解決・SVG/CSS読込を確認
- [ ] JA/EN トグル本番動作確認

## Phase 5: Handoff

### T-18 仕上げ
- [ ] PR本文に Streamlined Action Log + Compressed Decision Record を記載
- [ ] `spec/` 3点と README のリンクをPR本文に記載
- [ ] `.agent_work/` に中間成果（検証ログ等）があれば退避

## 依存関係サマリ

```
T-01 ──┐
T-02 ──┤
T-03 ──┤── (並列)
T-04 ──┤──▶ T-05 ──▶ T-06..T-12 (並列)──▶ T-13 ──▶ T-14 ──▶ T-15 ──▶ T-16 ──▶ T-17 ──▶ T-18
```

## リスクと緩和
- **R1**: JS注入ヘッダのチラつき → CSSで`#site-header { min-height: 72px; }` 予約
- **R2**: GitHub Pages のサブパス（`/ghcp-school-intro-kikui/`）で絶対パス誤記 → すべて相対パス `./` / `assets/...` で統一し、T-17で実機確認
- **R3**: コンテンツ誤認リスク → フッタ固定注記＋`【要確認】` バッジで明示（REQ-CONT-01/03）
