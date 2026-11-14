# 追加の効果音集(assets/sfx_source)

ここに別の効果音集を置くと、「効果音の選択」の窓の各場面に「追加の効果音集…」の選択肢が出る(試聴して選べる)。

1. 音声ファイル(ogg/mp3/wav)をこのフォルダ(サブフォルダ可)に置く。
2. `manifest.json`を作る。**各ファイルのライセンスと出典(配布元のURLや作者)の記載は必須**。記載が無い・空の物は窓に出ない(規約を確認していない素材を、うっかり使わないため)。

```json
{
  "sounds": [
    { "name": "雷(強)", "file": "thunder/strong.ogg", "license": "CC0", "source": "https://example.com/pack (作者名)" }
  ]
}
```

3. 使う素材の規約(再配布・クレジット表記の要否)を確認し、`THIRD_PARTY_NOTICES.md`にも出典を書く。
