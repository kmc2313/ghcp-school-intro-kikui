# Project Guidelines

## Communication
- このリポジトリでの対話、コミットメッセージ、PR本文、コードレビューコメント、レビュー返信、Issueコメントは原則として日本語で記述する。
- 例外として、外部仕様・エラーメッセージ・ライブラリ名・コマンドは原文を維持する。
- 既存の口調ルールは [.github/instructions/tone-deshi.instructions.md](.github/instructions/tone-deshi.instructions.md) に従う。

## Build and Test
- 開発コンテナ作成後の初期セットアップは `npm ci`（定義: [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json)）。
- Astro 開発サーバー利用時の標準ポートは `4321`。
- `package.json` が追加されたら、実行可能な開発・テスト・lint コマンドをこのファイルに追記する。

## Conventions
- まだテンプレート初期状態のため、README の重複説明は避け、必要な運用ルールのみここに記載する。
- 既存ファイルが少ない段階では、変更理由をPR本文に短く明記し、レビュアーが意図を追えるようにする。

## Pitfalls
- 現在は `package.json` が存在しないため、`npm run ...` 系コマンドは未定義の可能性がある。実行前にファイル有無を確認する。
