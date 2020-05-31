# 腹筋をすると画像を返してくれるLineBot
Obnizの学習用に、
Obnizと距離センサで腹筋を判定して、
腹筋する毎にBingの画像検索APIで取得した画像を返してくれるLineBotをつくってみました。

[qiita](https://qiita.com/karu/items/af1d5fc60ab4882be930)
[DEMO動画](https://www.youtube.com/watch?v=6Ro_bF8YBsg)

## 使用技術
- Line messaging API
- Obniz

## 機能
- Botに「〇〇で腹筋」と送るとBingの画像検索APIで「〇〇」を検索
- Obnizと距離センサで腹筋を判定
- 腹筋をトリガーにして取得した画像を返信する