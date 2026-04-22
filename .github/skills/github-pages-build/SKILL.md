---
name: github-pages-build
description: 'GitHub Pagesサイトを構築・公開するときに使うSkill。Use when: GitHub Pages, Pages settings, GitHub Actions deploy, custom domain, Astro/Jekyll/静的サイトの公開手順を整理したい場合。'
argument-hint: '構築対象（例: AstroサイトをActionsでPages公開、独自ドメインあり）'
---

# GitHub Pages構築

GitHub Pagesの公式ドキュメントに沿って、公開方式の選定、設定、検証、トラブルシュートまでを一貫して実施するためのSkillでし。

## このSkillを使う場面
- 新規でGitHub Pagesサイトを公開したい
- 既存サイトをBranch公開からGitHub Actions公開へ移行したい
- Astroなど静的サイトジェネレーターをPagesへデプロイしたい
- カスタムドメイン（CNAME + DNS）を設定したい
- 404やベースパス不整合など、公開後の不具合を切り分けたい

## 入力として最初に確認すること
1. 対象リポジトリ名と公開可否（public/private）
2. サイト種別
- 単純な静的ファイル配信（ビルド不要）
- 静的サイトジェネレーター（Astro/Jekyllなど、ビルド必要）
3. 公開URLの要件
- `https://<user>.github.io/<repo>/` か
- カスタムドメインか
4. CI/CD方針
- GitHub Actionsで自動デプロイするか
- 既存ブランチ配信を使うか

## 手順
1. 方式を決める
- ビルド不要なら「Deploy from a branch」を優先候補にする
- ビルドが必要なら「GitHub Actions」を選択する
- 迷う場合はActionsを優先し、再現性と自動化を確保する

2. リポジトリ設定を確認する
- Settings > Pages でSource設定を確認する
- Branch公開の場合はブランチと公開フォルダ（`/` または `/docs`）を確定する
- Actions公開の場合はActions実行権限とPagesデプロイ権限を確認する

3. フレームワーク固有設定を行う
- Astroの場合は公式ガイドに従ってAdapter/ビルド設定を反映する
- リポジトリ配下公開では`base`設定を適切に合わせる
- 必要に応じて404ページやアセットパスを調整する

4. デプロイを実行する
- Branch公開: 対象ブランチへ反映してPagesビルド完了を待つ
- Actions公開: ワークフローを実行し、PagesデプロイJob成功を確認する

5. 公開確認を行う
- 公開URLへアクセスして初回表示を確認する
- 主要ページ遷移、CSS/JS読込、画像表示、404挙動を確認する
- モバイル表示とPC表示の最低限の表示崩れを確認する

6. カスタムドメイン（必要時）
- `CNAME`設定とDNSレコード（A/ALIAS/CNAME）を整合させる
- HTTPS有効化と証明書反映待ちを確認する
- 反映前後でキャッシュ影響を考慮して再確認する

## 分岐と判断基準
- Branch公開で十分な条件
- 生成物をそのまま配信でき、ビルド工程が不要
- Actions公開を選ぶ条件
- ビルドが必要
- 複数環境で再現可能な手順が必要
- 品質ゲート（lint/test/build）をデプロイ前に入れたい
- カスタムドメイン設定を保留する条件
- まず標準URLで公開確認を完了してからDNS作業へ進める

## 完了条件
- Pagesのデプロイステータスが成功している
- 期待URLでサイトが表示される
- 主要導線でリンク切れとアセット欠落がない
- （ドメイン利用時）HTTPSが有効で証明書エラーがない

## よくある失敗と対処
- 404になる
- `base`設定、公開パス、`index.html`配置、公開先ブランチを再確認する
- CSS/JSが読めない
- 絶対パス/相対パス不整合、ビルド出力先、キャッシュを確認する
- Actionsは成功したが反映されない
- PagesのSource設定、Environment反映、対象workflowのdeployステップを確認する

## 公式リファレンス
- GitHub Pages docs: https://docs.github.com/ja/pages
- About GitHub Pages: https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages
- Creating a GitHub Pages site: https://docs.github.com/ja/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Static site generator with Pages: https://docs.github.com/ja/pages/setting-up-a-github-pages-site-with-a-static-site-generator
- Astro deploy guide (GitHub Pages): https://docs.astro.build/ja/guides/deploy/github/

## 使い方の例
- 「AstroプロジェクトをGitHub ActionsでPages公開したい。base設定とworkflowを確認して」
- 「既存のbranch公開をActions公開に移行したい。差分手順を作って」
- 「カスタムドメイン付きでPages公開したい。DNS反映確認までチェックリスト化して」
