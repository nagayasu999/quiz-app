# CLAUDE.md

このファイルは、Claude Code がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

- **プロジェクト名**: quiz-app
- **概要**: 一般常識クイズアプリ。全5問・4択形式で、回答ごとに正誤フィードバックと解説を表示し、最後に合計スコアと振り返りを表示する。
- **技術スタック**: HTML / CSS / JavaScript（バニラ、フレームワーク・ビルドツールなし）
- **実行環境**: モダンブラウザ（Chrome / Safari / Firefox の最新版）

## GitHubリポジトリ

https://github.com/nagayasu999/quiz-app

- リモート `origin` は **SSH** で設定済み（`git@github.com:nagayasu999/quiz-app.git`）。HTTPS では認証情報が未保存のため使わない。
- 更新は `git add` → `git commit` → `git push` で反映する。

## ファイル構成

```
quiz-app/
├── index.html   # 3画面（スタート／クイズ／結果）のマークアップ
├── style.css    # スタイル
├── script.js    # 問題データ + 進行・採点ロジック
└── CLAUDE.md
```

- **この3ファイル構成を維持する。** ディレクトリを切ってファイルを分割しない。
- ES Modules（`import` / `export`）は使わない。`index.html` をダブルクリックするだけで動く状態を保つ（ローカルサーバー不要）。
- `script.js` は `<script src="script.js" defer>` で読み込む。

## 動作確認

`index.html` をブラウザで直接開く。ローカルサーバーは不要。

```bash
open index.html
```

構文チェックだけしたい場合:

```bash
node --check script.js
```

## 開発ルール

### 依存関係
- **npm パッケージやフレームワーク（React / Vue / jQuery など）は導入しない。**
- CDN からの外部ライブラリ読み込みも行わない。標準の DOM API のみで実装する。

### JavaScript
- ES6+ の構文を使う（`const` / `let`、アロー関数、テンプレートリテラル など）。`var` は使わない。
- `script.js` は次の順で構成する。この並びを崩さない。
  1. 問題データ（`questions`）
  2. 状態（`state`）
  3. DOM 参照（`screens` / `els`）
  4. 画面切り替え（`showScreen`）
  5. クイズの進行（`startQuiz` / `renderQuestion` / `handleAnswer` / `goNext`）
  6. 結果表示（`buildMessage` / `renderResult`）
  7. イベント登録
- 状態は `state` オブジェクトに集約する。個別のグローバル変数を増やさない。
- DOM 操作は「状態を更新 → 描画関数を呼ぶ」の流れに揃える。イベントハンドラから直接 DOM を細かく書き換えない。
- `innerHTML` は使わない。要素は `document.createElement` で組み立て、テキストは `textContent` で入れる。

### CSS
- クラス名は BEM（`block__element--modifier`）で統一する。
- 色・余白・フォントサイズ・角丸は `:root` の CSS 変数に定義し、各所ではその変数を参照する。**変数にない値を直接書かない。**
- 画面の表示切り替えは `.screen` / `.screen--active` のクラス付け外しで行う。
- インラインスタイル（`style` 属性）は使わない。例外は JS からの動的な値のみ（進捗バーの `width`）。
- モバイルファースト。ブレークポイントは `600px` の1つだけ。

### HTML
- セマンティックな要素（`header` / `main` / `section` / `button` など）を使う。
- クリックできる要素は `div` ではなく `button` 要素にする。
- JS から参照する要素には `id` を付ける。スタイル指定は `class` で行い、`id` セレクタで CSS を書かない。
- フィードバック領域には `role="status"` / `aria-live="polite"` を付けたままにする。

## 問題データの形式

`script.js` 冒頭の `questions` 配列で定義する。

```js
const questions = [
  {
    id: 1,
    category: "地理",
    question: "日本で最も面積が大きい湖はどれ？",
    choices: ["霞ヶ浦", "琵琶湖", "猪苗代湖", "サロマ湖"],
    answerIndex: 1,
    explanation: "琵琶湖は滋賀県にあり、面積は約670平方キロメートル。"
  },
];
```

- `answerIndex` は `choices` の 0 始まりのインデックス。
- `choices` は必ず 4 要素。
- `explanation` は必須。不正解時に正解とセットで表示される。
- 問題を追加・変更する際も既存の形式を崩さない。
- 出題数は `questions.length` から自動計算される。画面表示に「5」をハードコードしない。
- 現在の出題カテゴリ: 地理 / 理科 / 歴史 / ことわざ / 単位。

## 画面の流れ

1. **スタート画面**（`#start-screen`） — 説明文と「スタート」ボタン
2. **クイズ画面**（`#quiz-screen`） — 進捗（第N問 / 全5問）、進捗バー、カテゴリ、問題文、4択ボタン
3. **回答フィードバック** — 同じクイズ画面内で、正解を緑・選んだ誤答を赤に色分けし、判定と解説を表示。「次の問題へ」（最終問は「結果を見る」）で進む
4. **結果画面**（`#result-screen`） — 「5問中 N 問正解」、成績に応じたメッセージ、全問の◯×と自分の回答・正解を並べた振り返り、「もう一度挑戦する」ボタン

## Claude への指示

- **返答は必ず日本語で行うこと。**
- コード内のコメント、コミットメッセージも日本語で書く（変数名・関数名自体は英語）。
- 実装前に、変更するファイルと方針を簡潔に説明する。
- 依頼された範囲を超えたリファクタリングや機能追加は勝手に行わない。
- 既存のコードスタイル（命名規則、インデント2スペース、セクションごとの `// ===== 見出し =====` コメント）に合わせる。
