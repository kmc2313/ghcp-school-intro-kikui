# Requirements - 神山まるごと高専 紹介サイト

## 概要
中学生・受験生本人を主な読者とした、神山まるごと高専の非公式紹介LP。素のHTML/CSS/JSで構築し、GitHub PagesへGitHub Actionsで自動デプロイする。パステルカラー（ベビーブルー／イエロー／ピーチ）のポップなデザインとし、日本語/英語トグルを備える。

## 想定ユーザー
- **主**: 中学生・受験生本人
- **副**: 保護者・教育関係者

## スコープ
- **In**: 7ページ構成のLP、i18n（JP/EN）トグル、自作SVGビジュアル、GitHub Actionsデプロイ、公式リンク誘導
- **Out**: 問い合わせフォーム送信機能、CMS、ブログ、独自ドメイン、写真素材の差し替え、入試要項の転載

## 機能要件（EARS）

### サイト全体
- **REQ-SITE-01 (Ubiquitous)**: THE SYSTEM SHALL 7ページ（`index` / `about` / `access` / `admissions` / `gallery` / `voices` / `faq`）を提供する。
- **REQ-SITE-02 (Ubiquitous)**: THE SYSTEM SHALL すべてのページで共通ヘッダ（ロゴ・ナビ・JA/ENトグル）と共通フッタ（公式サイトへのリンク・非公式注記・mailto）を表示する。
- **REQ-SITE-03 (Event)**: WHEN ユーザーがナビの任意リンクをクリックした THE SYSTEM SHALL 対応ページへ遷移し、現在ページはナビ上でactive状態を視覚的に示す。
- **REQ-SITE-04 (Ubiquitous)**: THE SYSTEM SHALL プロジェクトページ配信URL `https://kmc2313.github.io/ghcp-school-intro-kikui/` 配下で、全ての内部リンク・アセット（CSS/JS/SVG）が相対パスで正しく解決される。
- **REQ-SITE-05 (State)**: WHILE ビューポート幅が720px未満の間、THE SYSTEM SHALL ハンバーガーメニュー形式でナビを折りたたむ。
- **REQ-SITE-06 (Event)**: WHEN ハンバーガーボタンが押下された THE SYSTEM SHALL ナビを開閉しトグルする。
- **REQ-SITE-07 (Optional)**: WHERE ユーザーが `prefers-reduced-motion: reduce` を設定している THE SYSTEM SHALL アニメーションを静的表現に置き換える。

### 多言語切替（i18n）
- **REQ-I18N-01 (Ubiquitous)**: THE SYSTEM SHALL ヘッダ右端に `JA / EN` トグルを表示する。
- **REQ-I18N-02 (Event)**: WHEN ユーザーがJA/ENトグルを切り替えた THE SYSTEM SHALL `data-i18n` 属性を持つ全要素のテキストを対応言語辞書で差し替え、`<html lang>` 属性を更新する。
- **REQ-I18N-03 (Ubiquitous)**: THE SYSTEM SHALL 選択言語を `localStorage` キー `site.lang` に保存する。
- **REQ-I18N-04 (Event)**: WHEN ページが初回ロードされた THE SYSTEM SHALL `localStorage.site.lang` → `navigator.language` → デフォルト `ja` の優先順で言語を決定する。
- **REQ-I18N-05 (Unwanted)**: IF 辞書にキーが存在しない THEN THE SYSTEM SHALL 既定言語（ja）の値にフォールバックし、それも無ければDOMの初期テキストを維持する。
- **REQ-I18N-06 (Optional)**: WHERE 英語翻訳が骨子（見出し・ナビ・CTA）のみ提供されている THE SYSTEM SHALL 本文未訳部分に "Full English coming soon" 注記を表示する。

### コンテンツ
- **REQ-CONT-01 (Ubiquitous)**: THE SYSTEM SHALL 確定していない数値・日程・人名に `【要確認】` バッジを本文上で可視表示する。
- **REQ-CONT-02 (Ubiquitous)**: THE SYSTEM SHALL 声セクションの登場人物を架空設定である旨を注記する。
- **REQ-CONT-03 (Ubiquitous)**: THE SYSTEM SHALL フッタに「本サイトは学習用の非公式紹介ページです。正確な情報は公式サイトをご確認ください」の注記と公式サイトリンクを表示する。
- **REQ-CONT-04 (Ubiquitous)**: THE SYSTEM SHALL 入試ページでは要項を転載せず、公式情報への誘導リンクのみを提供する。

### デザイン
- **REQ-DSGN-01 (Ubiquitous)**: THE SYSTEM SHALL カラーパレットをベビーブルー `#A8D8EA` / イエロー `#FFE98A` / ピーチ `#FFCAB1` / 背景 `#FAFBFF` / テキスト `#2E3A59` に統一する。
- **REQ-DSGN-02 (Ubiquitous)**: THE SYSTEM SHALL 本文フォントに `M PLUS Rounded 1c`（読込失敗時はシステム日本語丸ゴシック）を適用する。
- **REQ-DSGN-03 (Ubiquitous)**: THE SYSTEM SHALL カード・ボタンの角丸を16–24px、柔らかいドロップシャドウを共通デザイントークンとして適用する。
- **REQ-DSGN-04 (Ubiquitous)**: THE SYSTEM SHALL ヒーローに斜めブロブ背景、セクション区切りに波形SVGを配置する。

### デプロイ
- **REQ-CICD-01 (Event)**: WHEN `main` ブランチへ push が発生した THE SYSTEM SHALL GitHub Actions ワークフローが自動実行され、Pages へデプロイする。
- **REQ-CICD-02 (Ubiquitous)**: THE SYSTEM SHALL `workflow_dispatch` による手動実行を可能にする。
- **REQ-CICD-03 (Ubiquitous)**: THE SYSTEM SHALL ワークフローに最小権限 `contents: read, pages: write, id-token: write` のみを付与する。
- **REQ-CICD-04 (Unwanted)**: IF デプロイ対象に `.github/` や `spec/` 等の非公開物が含まれる THEN THE SYSTEM SHALL アーティファクト化時に除外する。

## 非機能要件
- **NFR-01 (性能)**: Lighthouse Performance スコア 90 以上。
- **NFR-02 (アクセシビリティ)**: Lighthouse Accessibility スコア 90 以上、見出し階層・alt属性・コントラスト比 WCAG AA 準拠。
- **NFR-03 (互換性)**: 最新版 Chrome / Safari / Firefox / Edge 各1世代前まで正常表示。
- **NFR-04 (依存)**: ランタイム npm 依存ゼロ（CDNは Google Fonts のみ許容）。
- **NFR-05 (保守性)**: 共通ヘッダ/フッタ更新時は1ファイル修正で全ページに反映されること（DR-001参照）。

## 前提・制約
- リポジトリ: `kmc2313/ghcp-school-intro-kikui`、公開URL `https://kmc2313.github.io/ghcp-school-intro-kikui/`
- ビルド工程なし（素HTML/CSS/JS）
- コンテンツは公式情報ベースの下書き、固有数値は `【要確認】` 明示

## 受入基準（サマリ）
1. 7ページすべてが公開URLで表示でき、相互遷移とSVG/CSS読込が成功
2. JA/ENトグルが全ページで動作し、`localStorage` に保存される
3. モバイル（<720px）でハンバーガーナビが機能する
4. GitHub Actions ワークフローが緑で、公開URLに反映される
5. フッタに非公式注記と公式リンクが表示される

## Confidence Score
- **85%**（高信頼）: 技術選定・要件・スコープが明確。不確実性は実コンテンツの出典精度のみで、`【要確認】` バッジで吸収する方針により実装は阻害されない。
