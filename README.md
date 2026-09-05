# 5000兆円欲しいメーカー

金額や自由な文字を入力して、派手な立体文字のPNGをブラウザ内で作る静的Webアプリです。外部ライブラリや画像ファイルは使いません。

## ローカルで開く

このフォルダで次を実行し、表示されたURLをブラウザで開きます。

```sh
python3 -m http.server 4173
```

ロジックの確認は次で実行できます。

```sh
npm test
```

## GitHub Pagesで公開する

1. このフォルダの内容を、新規GitHubリポジトリのルートに置きます。
2. `main` ブランチへpushします。
3. GitHubのリポジトリ設定の **Pages** を開き、公開元に **GitHub Actions** を選択します。
4. Actionsの **Deploy GitHub Pages** が完了すると、デプロイ画面に公開URLが表示されます。

`.github/workflows/deploy-pages.yml` は、pushごとにテストを実行してからこの静的サイトを公開します。
