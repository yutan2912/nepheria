# THIRD_PARTY_NOTICES.md(nepheria-axe)

このファイルは、`nepheria-axe`(Udonarium Axeのフォーク本体、MITライセンス。詳細は`LICENSE`参照)へNEPHERIA側で新規に組み込んだ、Axe本家由来ではない第三者アセットの出典・ライセンスを記録する。

## Shippori Mincho(見出し用フォント)— 2026-09-29追加

一括指示(nepheria-axe)・第5段手順16(design doc `docs/nepheria_design.md` §12.2)。戦闘UI・セッション画面の見出し(ターン演出の名前・ラウンド番号・発動演出のキャラ名等)に使う、本文とは別の見出し用書体。「オフラインで動くよう、自由に使えるライセンスのフォントを同梱する」という指示に基づき同梱した。

- **フォント名**: Shippori Mincho
- **著作権表示**: Copyright 2021 The Shippori Mincho Project Authors (https://github.com/fontdasu/ShipporiMincho)
- **ライセンス**: SIL Open Font License, Version 1.1(全文: https://openfontlicense.org 。再配布・同梱・改変が許可されている)
- **取得元**: Google Fonts(https://fonts.google.com/specimen/Shippori+Mincho )公開配布物のwoff2(2026-09-29取得時点のバージョン)
- **同梱範囲**: `src/assets/fonts/shippori-mincho/shippori-mincho-700-subset.woff2`(1ファイル)。以前同梱していた分割120ファイル(BMP範囲。原本は `tools/fonts-src/shippori-mincho-700/`)から、アプリが使う文字だけを `tools/build-fonts.py` で切り出して結合した派生物(OFL 1.1の下で改変・再配布。フォント名の変更が必要な『予約フォント名』の条項はこの改変版にも同じ名前で配布しない前提=内部配布のみ)。
- **使い方**: `src/styles.css`の`@font-face`定義(BMP範囲チャンクごと)+`--font-heading`トークン(`@theme`)。Tailwindの`font-heading`ユーティリティクラスとして各コンポーネントから参照する

## PixiJS 8.21.0(演出の描画)— 2026-10-01追加

戦闘の演出(粒子・光・魔法陣・軌跡)をWebGLで描く。演出が始まる時に初めて読み込み(動的import)、演出が無い間は何も動かさない。

- **著作権表示**: Copyright (c) 2013-2023 Mathew Groves, Chad Engler
- **ライセンス**: MIT License(全文は`node_modules/pixi.js/LICENSE`。2026-10-01にパッケージの実物を読んで確認した。無料・商用・改変・再配布が可能。著作権表示と許諾文を残すこと)
- **取得元**: npm `pixi.js@8.21.0`

## GSAP 3.15.0(演出の動きの制御)— 2026-10-01追加

演出の時間軸・イージングの制御に使う(コア機能のみ。プラグインは使わない)。

- **著作権表示**: Copyright 2008-2026, GreenSock(現在の権利者はWebflow)
- **ライセンス**: GSAP Standard "No Charge" License(2026-10-01に https://gsap.com/standard-license の本文を実際に読んで確認した。有効日 2025-04-30)。
  要点: 商用・非商用を問わず、**エンドユーザーから利用料を取らない**限り無料で使える。禁止は「Webflowの視覚的アニメーション作成機能と競合する、コード無しでアニメーションを作る道具への組み込み」と、
  ライセンス表記・ブランド表示の除去・改変、競合製品を作る目的のリバースエンジニアリング。
  NEPHERIA VTTは卓用の道具で、利用者から料金を取らず、アニメーションの作成ツールでもないため、許諾の範囲内。MITのような再頒布自由の許諾ではないため、**配布する場合は上記の条件(利用料を取らない)を守ること**。
  GSAPのファイル先頭の著作権・ライセンス表記(`@license`コメント)は削除しない。
- **取得元**: npm `gsap@3.15.0`

## 効果音(実録のCC0素材を加工)— 2026-10-08作り直し

戦闘・呪文・ダイス・節目・操作・足音の効果音。`tools/sfx/`(ffmpeg-static)で、無音トリム・フェード・30〜40Hz以下のカット・ラウドネス整列・ピーク制限・OGG Vorbis化・(一部)逆再生/速度/フィルタ/重ね合わせの加工をして `src/assets/sounds/sfx/<カテゴリ>/*.ogg` と `manifest.json` にした。素材の選定・各ファイルの長さ/ピーク/ラウドネス・加工内容は `docs/sfx_design.md`。AI生成の音は使っていない。

- **ライセンス**: 使った素材は**全て CC0 1.0**(CC-BY は使っていない。表記の義務がある作者は無い)。各パックのライセンス欄・同梱の License/README・ファイル単位の注意書きを、下表の「規約を読んだ日」に実際に読んだ。複数ライセンス表示のページ(Battle Sound Effects・Spell sounds・Footsteps Leather, Cloth, Armor)は CC0 の選択肢を採った。NC・ND・SA・GPL は使っていない。ゲーム・映画・動画から切り出した音は使っていない。
- **作者名の記載(CC0のため任意の謝辞)**: 下表の作者。アプリ内クレジットには `manifest.json` の `sources` を読めば出せる。
- 旧候補(`src/assets/sounds/fx/candidates/`)は撤去した(2026-10-08)。現在の素材は下表のとおり。
- **ユーザー自身の音声ファイル**: 「効果音の選択」の窓から、この端末のブラウザ(IndexedDB)に保存して差し替えられる。リポジトリには含まれず、他の参加者には送られない。

| 略称 | パック | 作者 | ライセンス | 出典URL | 取得日 | 規約を読んだ日 | 備考 |
|---|---|---|---|---|---|---|---|
| 100-cc0-metal-wood | 100 CC0 metal and wood SFX | Barina | CC0 | https://opengameart.org/content/100-cc0-metal-and-wood-sfx | 2026-10-08 | 2026-10-08 |  |
| 100-cc0-sfx | 100 CC0 SFX | aijikl | CC0 | https://opengameart.org/content/100-cc0-sfx | 2026-10-08 | 2026-10-08 |  |
| 100-cc0-sfx-2 | 100 CC0 SFX #2 | geekygnome | CC0 | https://opengameart.org/content/100-cc0-sfx-2 | 2026-10-08 | 2026-10-08 |  |
| 25-bang | 25 CC0 bang / firework SFX | Snabisch | CC0 | https://opengameart.org/content/25-cc0-bang-firework-sfx | 2026-10-08 | 2026-10-08 |  |
| 80-cc0-rpg-sfx | 80 CC0 RPG SFX | rubberduck | CC0 | https://opengameart.org/content/80-cc0-rpg-sfx | 2026-10-08 | 2026-10-08 |  |
| air-whoosh | Air whoosh | (uploader not shown) | CC0 | https://opengameart.org/content/air-whoosh | 2026-10-08 | 2026-10-08 |  |
| battle-sfx | Battle Sound Effects | artisticdude / remaxim (for Summoning Wars) | CC0 | https://opengameart.org/content/battle-sound-effects | 2026-10-08 | 2026-10-08 | ページは CC-BY 3.0 / CC-BY-SA 3.0 / GPL / CC0 の多重。CC0 を選んで使用 |
| card-game | Card Game sounds | tersyolnyolcusu | CC0 | https://opengameart.org/content/card-game-sounds | 2026-10-08 | 2026-10-08 |  |
| casino-audio | Kenney Casino Audio | Kenney Vleugels (Kenney.nl) | CC0 | https://kenney.nl/assets/casino-audio | 2026-10-08 | 2026-10-08 |  |
| catching-fire | Catching fire | frances (derivative of qubodup CC0) | CC0 | https://opengameart.org/content/catching-fire | 2026-10-08 | 2026-10-08 |  |
| dark-magic-3 | 3 dark magic spells | (uploader not shown) | CC0 | https://opengameart.org/content/3-dark-magic-spells | 2026-10-08 | 2026-10-08 |  |
| dice-29 | 2 dice roll (29 throws) | (uploader not shown) | CC0 | https://opengameart.org/content/2-dice-roll-29-throws | 2026-10-08 | 2026-10-08 |  |
| different-steps | Different steps on wood, stone, leaves, gravel and mud | qubodup (Iwan Gabovitch) | CC0 | https://opengameart.org/content/different-steps-on-wood-stone-leaves-gravel-and-mud | 2026-10-08 | 2026-10-08 |  |
| electricity | Electricity Sound Effects | Brian MacIntosh | CC0 | https://opengameart.org/content/electricity-sound-effects-0 | 2026-10-08 | 2026-10-08 |  |
| fantasy-choir | Fantasy Choir-3 orchestral pieces | Cesar da Rocha (uploaded by Snabisch) | CC0 | https://opengameart.org/content/fantasy-choir-3-orchestral-pieces | 2026-10-08 | 2026-10-08 |  |
| fire-crackling | Fire Crackling | Stoner Games | CC0 | https://opengameart.org/content/fire-crackling | 2026-10-08 | 2026-10-08 |  |
| fire-staff | Fire Staff Sound Effects | LEGIT Audio | CC0 | https://opengameart.org/content/fire-staff-sound-effects | 2026-10-08 | 2026-10-08 |  |
| footsteps-armor | Footsteps Leather, Cloth, Armor | bart | CC0 | https://opengameart.org/content/footsteps-leather-cloth-armor | 2026-10-08 | 2026-10-08 | ページは OGA-BY 3.0 と CC0 の二重。CC0 を選んで使用 |
| freeze-spell | Freeze Spell | StarNinjas (for Summoning Wars) | CC0 | https://opengameart.org/content/freeze-spell-0 | 2026-10-08 | 2026-10-08 |  |
| ghostly-loops | 4 Atmospheric ghostly loops | NeoStrider (source: independent.nu ljudbank) | CC0 | https://opengameart.org/content/4-atmospheric-ghostly-loops | 2026-10-08 | 2026-10-08 |  |
| healing-harp | Magic Words + Healing Sound Effect | Julie Damsgaard / Spring Enterprises (uploaded by PFNienow) | CC0 | https://opengameart.org/content/magic-words-healing-sound-effect | 2026-10-08 | 2026-10-08 |  |
| heartbeat | Heartbeat sounds | estevinho | CC0 | https://opengameart.org/content/heartbeat-sounds | 2026-10-08 | 2026-10-08 |  |
| hits-punches-37 | 37 hits/punches | supergamez2014 (source: independent.nu ljudbank) | CC0 | https://opengameart.org/content/37-hitspunches | 2026-10-08 | 2026-10-08 |  |
| ice-shatters | Ice breaking/shattering | Chris_M_The_GameDude | CC0 | https://opengameart.org/content/ice-breakingshattering | 2026-10-08 | 2026-10-08 |  |
| ice-spells | Ice spells | pyf | CC0 | https://opengameart.org/content/ice-spells | 2026-10-08 | 2026-10-08 |  |
| impact-sounds | Kenney Impact Sounds | Kenney Vleugels (Kenney.nl) | CC0 | https://kenney.nl/assets/impact-sounds | 2026-10-08 | 2026-10-08 |  |
| interface-sounds | Kenney Interface Sounds | Kenney Vleugels (Kenney.nl) | CC0 | https://kenney.nl/assets/interface-sounds | 2026-10-08 | 2026-10-08 |  |
| magic-spell-sfx | Magic Spell SFX | JaggedStone | CC0 | https://opengameart.org/content/magic-spell-sfx | 2026-10-08 | 2026-10-08 |  |
| melee-3 | 3 Melee sounds | Dream2Reality (based on qubodup, edited by remaxim) | CC0 | https://opengameart.org/content/3-melee-sounds | 2026-10-08 | 2026-10-08 |  |
| owlish | Sound Effects Pack (Owlish Media) | Owlish Media (MedicineStorm) | CC0 | https://opengameart.org/content/sound-effects-pack | 2026-10-08 | 2026-10-08 |  |
| pleasing-bell | Pleasing Bell Sound Effect | Julie Damsgaard / Spring Enterprises (uploaded by BjarneK_92) | CC0 | https://opengameart.org/content/pleasing-bell-sound-effect | 2026-10-08 | 2026-10-08 |  |
| rain-thunder | Rain + Long Thunder | (uploader not shown; page: no need to credit) | CC0 | https://opengameart.org/content/rain-long-thunder | 2026-10-08 | 2026-10-08 |  |
| rpg-audio | Kenney RPG Audio | Kenney Vleugels (Kenney.nl) | CC0 | https://kenney.nl/assets/rpg-audio | 2026-10-08 | 2026-10-08 |  |
| rpg-sound-pack | RPG Sound Pack | artisticdude | CC0 | https://opengameart.org/content/rpg-sound-pack | 2026-10-08 | 2026-10-08 |  |
| spell-sounds | Spell sounds | qubodup (Iwan Gabovitch) | CC0 | https://opengameart.org/content/spell-sounds | 2026-10-08 | 2026-10-08 | ページは OGA-BY 3.0 と CC0 の二重。CC0 を選んで使用 |
| swishes | Swishes Sound Pack | qubodup (Iwan Gabovitch) | CC0 | https://opengameart.org/content/swishes-sound-pack | 2026-10-08 | 2026-10-08 |  |
| teleport-spell | Teleport Spell | Clint Bellanger (for Summoning Wars) | CC0 | https://opengameart.org/content/teleport-spell | 2026-10-08 | 2026-10-08 |  |
| ticking-clock | Ticking Clock | MedicineStorm / AntumDeluge | CC0 | https://opengameart.org/content/ticking-clock-0 | 2026-10-08 | 2026-10-08 |  |
| ui-audio | Kenney UI Audio | Kenney Vleugels (Kenney.nl) | CC0 | https://kenney.nl/assets/ui-audio | 2026-10-08 | 2026-10-08 |  |
| water-splash-slime | 40 CC0 water / splash / slime SFX | rockseller | CC0 | https://opengameart.org/content/40-cc0-water-splash-slime-sfx | 2026-10-08 | 2026-10-08 |  |
| weird-30 | 30 weird CC0 SFX | Snabisch | CC0 | https://opengameart.org/content/30-weird-cc0-sfx | 2026-10-08 | 2026-10-08 |  |

**使ったファイル(パック別。元のファイル名。拡張子なし)**

- `100-cc0-metal-wood`(6本): metal_close_01 / metal_hit_03 / wood_cracking_01 / wood_cracking_02 / wood_cracking_04 / wood_hammer_01
- `100-cc0-sfx`(39本): bell_01 / bell_01 fo0.3 / bell_02 / bell_03 / door_01 / explosion / glass_02 / glass_04 / glass_05 / gong_01 / gong_02 / hit_02 / machine_01 / machine_02 / machine_03 fo0.15 / metal_02 / metal_04 / metal_06 / metal_12 / paper_01 / paper_02 / paper_03 / paper_04 / plop_01 / plop_02 / shot_01 / shot_02 / slam_01 / slam_02 / slam_03 / slam_04 / slam_05 / slam_06 / spring_03 / spring_04 / switch_01 / switch_02 / tools_02 / wooden_02
- `100-cc0-sfx-2`(25本): sfx100v2_air_01 / sfx100v2_air_01 fi0.9 fo0.3 / sfx100v2_air_02 / sfx100v2_air_03 / sfx100v2_footstep_wood_03 / sfx100v2_glass_01 / sfx100v2_glass_02 / sfx100v2_glass_03 / sfx100v2_glass_06 / sfx100v2_loop_machine_03 / sfx100v2_loop_water_01 / sfx100v2_loop_water_03 / sfx100v2_metal_01 / sfx100v2_metal_04 fo0.2 / sfx100v2_metal_hit_01 / sfx100v2_metal_hit_02 / sfx100v2_stones_01 / sfx100v2_stones_02 / sfx100v2_stones_02 fo0.2 / sfx100v2_stones_03 / sfx100v2_thunder_01 / sfx100v2_wood_04 / sfx100v2_wood_hit_01 / sfx100v2_wood_hit_02 / sfx100v2_wood_hit_03
- `25-bang`(12本): bang_02 / bang_03 / bang_05 / bang_07 / bang_08 / cannon_01 / cannon_02 / cannon_03 / cannon_04 / cannon_05 / shot_01 / shot_02
- `80-cc0-rpg-sfx`(34本): blade_01 / blade_02 / blade_03 / chain_01 / chain_02 / chain_02 fo0.2 / chain_03 / item_gem_01 / item_gem_02 / item_gem_03 / item_gem_04 / item_misc_01 / item_stone_01 / item_stone_02 / item_stone_03 / lock_01 / lock_02 / lock_03 / metal_01 / metal_02 / metal_03 / spell_fire_01 / spell_fire_02 / spell_fire_03 / spell_fire_04 / spell_fire_05 / spell_fire_05 fi0.25 / spell_fire_06 / spell_fire_07 / stones_01 / stones_02 / stones_03 / stones_03 fi0.5 fo0.2 / stones_04
- `air-whoosh`(1本): whoosh2_0
- `battle-sfx`(4本): Bow / swish_2 / swish_3 / swish_4
- `card-game`(3本): playcard / shuffle / tap
- `casino-audio`(17本): card-place-1 / card-place-2 / card-place-3 / card-slide-2 / card-slide-3 / cards-pack-open-2 / chip-lay-1 / chip-lay-2 / chip-lay-3 / chips-collide-1 / chips-handle-3 / dice-shake-1 / dice-shake-2 / dice-shake-3 / dice-throw-1 / die-throw-1 / die-throw-3
- `catching-fire`(1本): flame_0
- `dark-magic-3`(3本): fout-01 / fout-02 / fout-03
- `dice-29`(2本): dice-12 / dice-3
- `different-steps`(5本): gravel / leaves01 / leaves02 / stone01 / wood01
- `electricity`(2本): continuousspark / spark
- `fantasy-choir`(3本): Fantasy Choir 1 / Fantasy Choir 2 / Fantasy Choir 3
- `fire-crackling`(2本): fire-1_0 / fire-1_0 fi0.2 fo0.4
- `fire-staff`(13本): LEGIT_FIR_Fire_Staff 1-Audio fi0.4 fo0.3 / LEGIT_FIR_Fire_Staff 10-Audio / LEGIT_FIR_Fire_Staff 11-Audio fo0.3 / LEGIT_FIR_Fire_Staff 14-Audio fi0.3 / LEGIT_FIR_Fire_Staff 19-Audio fi0.4 fo0.3 / LEGIT_FIR_Fire_Staff 20-Audio / LEGIT_FIR_Fire_Staff 21-Audio / LEGIT_FIR_Fire_Staff 22-Audio / LEGIT_FIR_Fire_Staff 24-Audio / LEGIT_FIR_Fire_Staff 3-Audio fo0.3 / LEGIT_FIR_Fire_Staff 6-Audio / LEGIT_FIR_Fire_Staff 8-Audio / LEGIT_FIR_Fire_Staff 9-Audio fo0.3
- `footsteps-armor`(3本): step_cloth3 / step_lth2 / step_metal
- `freeze-spell`(1本): freeze
- `ghostly-loops`(4本): atmoseerie01 / atmoseerie02 / atmoseerie03 / atmoseerie04
- `healing-harp`(2本): health_restore / magic_words
- `heartbeat`(3本): heartbeat_fast_0 / heartbeat_slow_0 / heartbeat_slow_reverb
- `hits-punches-37`(7本): hit02 / hit10 / hit20 / hit22 / hit24 / hit33 / hit35
- `ice-shatters`(5本): LedasLuzta / LedasLuzta2 / LedasLuzta33 / LedasLuzta4 / LedasLuzta5
- `ice-spells`(2本): coldsnap fo0.2 / ice
- `impact-sounds`(78本): footstep_carpet_001 / footstep_concrete_001 / footstep_concrete_003 / footstep_wood_001 / footstep_wood_002 / impactBell_heavy_000 / impactBell_heavy_001 / impactBell_heavy_002 / impactBell_heavy_003 / impactBell_heavy_004 / impactGeneric_light_001 / impactGeneric_light_002 / impactGeneric_light_003 / impactGlass_heavy_000 / impactGlass_heavy_001 / impactGlass_heavy_002 / impactGlass_heavy_003 / impactGlass_heavy_004 / impactGlass_light_000 / impactGlass_light_001 / impactGlass_light_002 / impactGlass_light_003 / impactGlass_light_004 / impactGlass_medium_001 / impactGlass_medium_002 / impactGlass_medium_003 / impactMetal_heavy_000 / impactMetal_heavy_001 / impactMetal_heavy_002 / impactMetal_heavy_003 / impactMetal_heavy_004 / impactMetal_light_000 / impactMetal_light_001 / impactMetal_light_002 fo0.3 / impactMetal_light_003 / impactMetal_light_004 / impactMetal_medium_000 / impactMetal_medium_002 / impactMining_001 / impactMining_002 / impactMining_003 / impactMining_004 / impactPlank_medium_000 / impactPlank_medium_001 / impactPlank_medium_002 / impactPlate_heavy_000 / impactPlate_heavy_001 / impactPlate_heavy_002 / impactPlate_heavy_003 / impactPlate_heavy_004 / impactPlate_light_002 / impactPlate_medium_001 / impactPlate_medium_002 / impactPunch_heavy_000 / impactPunch_heavy_001 / impactPunch_heavy_002 / impactPunch_medium_000 / impactPunch_medium_003 / impactSoft_heavy_000 / impactSoft_heavy_001 / impactSoft_heavy_002 / impactSoft_heavy_003 / impactSoft_heavy_004 / impactSoft_medium_001 / impactSoft_medium_002 / impactSoft_medium_003 / impactTin_medium_001 / impactWood_heavy_000 / impactWood_heavy_001 / impactWood_heavy_002 / impactWood_heavy_003 / impactWood_heavy_004 / impactWood_light_000 / impactWood_light_001 / impactWood_light_002 / impactWood_light_004 / impactWood_medium_001 / impactWood_medium_002
- `interface-sounds`(8本): click_001 / close_002 / error_006 / open_002 / scroll_003 / select_004 / select_007 / toggle_002
- `magic-spell-sfx`(11本): magical_1_0 / magical_2 / magical_2 fi0.5 fo0.3 / magical_3 / magical_4 / magical_4 fi0.3 fo0.4 / magical_5 / magical_5 fo0.3 / magical_6_0 / magical_6_0 fo0.2 / magical_7_0
- `melee-3`(2本): melee sound / sword sound
- `owlish`(18本): 320138__owlstorm__blanket-movement-2 / 320144__owlstorm__blanket-movement-6 / blackhole / blackhole1 / blackhole2 / breath-female2 / crumples1 / crumples2 / djembe1 / djembe2 / djembe3 / earthquake / freakedbreath / hard-footstep1 / hard-footstep2 / loopable-ticking-clock / shh1 / step3
- `pleasing-bell`(1本): pleasing-bell
- `rain-thunder`(1本): rain-thunder
- `rpg-audio`(25本): bookClose / bookFlip1 / bookFlip2 / bookFlip3 / bookOpen / bookPlace1 / bookPlace2 / bookPlace3 / chop / cloth2 / cloth3 / cloth4 / creak1 / creak2 / creak3 / creak3 fo0.15 / drawKnife1 / drawKnife2 / dropLeather / handleSmallLeather / handleSmallLeather2 / knifeSlice / knifeSlice2 / metalClick / metalLatch
- `rpg-sound-pack`(16本): beads / bubble / bubble2 / bubble3 / chainmail1 / cloth / cloth-heavy / coin3 / metal-ringing / metal-small1 / metal-small2 / sword-unsheathe / sword-unsheathe2 / sword-unsheathe3 / sword-unsheathe4 / sword-unsheathe5
- `spell-sounds`(4本): electricspell / electricspell2 / healing / teleport
- `swishes`(12本): swish-1 / swish-10 / swish-11 / swish-12 / swish-13 / swish-3 / swish-4 / swish-5 / swish-6 / swish-7 / swish-8 / swish-9
- `teleport-spell`(1本): teleport
- `ticking-clock`(1本): clock-1
- `ui-audio`(4本): click3 / rollover3 / rollover5 / switch5
- `water-splash-slime`(19本): bubble_01 / bubble_02 / bubble_03 / loop_bubbles_1 / loop_water_01 / loop_water_02 / loop_water_03 / slime_04 / slime_09 / slime_13 / splash_01 / splash_02 / splash_04 / splash_06 / splash_07 / splash_08 / splash_09 / splash_10 / splash_12
- `weird-30`(3本): weird_04 / weird_13 / weird_21

## 演出のスプライトシート(自作・Blender製)— 2026-10-01追加

`src/assets/fx/{impact,slash,orb,circle}.png`(+`.json`)は、`tools/fx-blender/render.py`(Blender 5.2をバックグラウンドで動かすPythonスクリプト)が、メッシュ(円盤・輪・三日月・光条・星形)と発光マテリアルから
描画した透過PNGのスプライトシート。**自作であり、外部の素材・AI画像生成は使っていない**。Blender自体はGPLだが、出力画像は作成者(本プロジェクト)に帰属する。

## 演出のフリップブック(自作 Blender 製 + 外部 CC0)— 2026-11-12追加

`src/assets/fx/vfx/*.webp`(manifest は `manifest.json`)。どれも魔法の演出レシピ(`data/fx/spell-fx-recipes.json`)が最初に使う時に読む(遅延)。

| 名前 | 中身 | 出自 | ライセンス |
|---|---|---|---|
| `fire`(未使用・削除済み)・`smoke`・`energy`・`lightning`・`splash`・`frost` | 体積の煙・魔力の渦・稲妻・水しぶき・氷の群晶 | `tools/fx-blender/vfx.py`(Blender 5.2.1 を画面なしで動かし、ノイズの体積・メッシュ・Cycles で描画。`bloom.mjs`・`pack.mjs` で仕上げ) | 自作(外部素材・AI画像生成なし) |
| `explosion`・`fireball`・`flame` | 写実の爆発(25コマ)・火球(64コマ)・炎(64コマ) | Unity Labs「VFX Image Sequences / Flipbooks」(Explosion01・FireBall01・Flame02。公開 2016-11-28)。https://blog.unity.com/engine-platform/free-vfx-image-sequences-flipbooks で CC0 として配布。入手日 2026-11-12(公開から約10年)。`tools/fx-blender/convert-ext.mjs` で縮小・アルファ化・WebP 化 | CC0 1.0(表記の義務なし。出典は記録) |
| `circle2` | 魔法陣(16コマ) | 既存の `src/assets/fx/circle2.png`(自作・Blender) | 自作 |
| `wind`・`tornado`・`gust-arc`・`lightning-branch`・`light-pillar`・`miasma`・`wisp`・`water`・`smear-slash`・`impact-frame`・`speed-lines`・`pixel-hit` | 風・竜巻・稲妻の枝・光の柱・瘴気・水・作画風の斬撃/衝撃/集中線・ドット絵のヒット | `tools/fx-blender/procgen.py`・`procgen2.py`・`procgen3.py`(numpy+PIL の手続き生成。外部素材なし) | 自作 |
| `chain`・`rock` | 金属の鎖・岩 | `tools/fx-blender/solid.py`(Blender 5.2 の Cycles。3Dモデルも手続き生成) | 自作 |
| `sigil-rune` | ルーンと幾何の魔法陣 | `procgen2.py`。文字は Noto Sans Runic と Uncial Antiqua(いずれも OFL-1.1。字形を画像に焼いた物のみ同梱。フォントファイルは同梱しない) | 自作(字形は OFL のフォント由来) |
| `efk/runtime`(effekseer.min.js・effekseer.wasm) | Effekseer の WebGL ランタイム(3Dのエフェクト再生) | EffekseerForWebGL 1.80.7(公式リリース 2026-08-07)。https://github.com/effekseer/Effekseer/releases/tag/1807 | MIT(Copyright Effekseer Project。表記を維持) |
| `efk/<pack>/*.efk` と画像 | 専用のエフェクト19本(竜巻・氷・炎・雷・回復・障壁・魔法陣ほか)とその画像 | Effekseer 公式リリース 1.80.7 の `Sample/`(`readme.txt`: 「全てのエフェクトは CC-0。クレジットは任意」)。パック: 01_NextSoft01・00_Version16・01_AndrewFM01・01_Pierre02。`tools/fx-efk/build.mjs` が画面なしの CUI 変換(`Effekseer.exe -cui`)で .efk にし、大きい画像のみ減色 | CC0 1.0(任意の謝辞: Effekseer と各投稿者) |
| `efk/em/*`(`manifest.em.json`) | 実エフェクト15本(火・氷・雷・風・聖・ヒット部品)とその画像・メッシュ・マテリアル | effekseer/EffectMaterials(https://github.com/effekseer/EffectMaterials 。master 8bf8edf・最終更新 2026-05-08。README: 「All data are under CC0.」。設計者: KTK_kumamoto・Effekseer)。`tools/fx-efk/build-em.mjs` が既存の `.efkefc` を `Effekseer.exe -cui` で .efk に変換しただけ(新規作成なし)。大きい画像のみ減色 | CC0 1.0(謝辞は任意) |
| `vfx/manifest.s.json` の連番(smoke・die・hourglass・thorn・bell・hook・arrow・potion・c-glint・c-sand・ground-swirl・crack-radial・ice-crystal・ice-plate) | 波2の自作素材 | 自作(Blender 5.2 の Mantaflow・Cycles と numpy/PIL。外部の画像・モデル・HDRI は使っていない。環境光は手続きで生成) | 自作(本プロジェクトの一部) |

導入した道具: `pixi-filters`・`sharp` は既存(`docs/fx_assets.md`)。Blender 5.2.1 は開発機に導入済みの物(GPL。出力画像は作成者に帰属)。

## 公開版(GitHub Pages)に含まれる物との照合 — 2026-10-08追加

画面(`dist`)だけを公開する(`画面を公開する.bat` / `docs/publish.md`)。公開物に含まれるのは、この文書の各節とほぼ同じ一式: Angular のビルド成果物とライブラリ(Angular・PixiJS・GSAP・PeerJS ほか。各ライセンスは公開物の `3rdpartylicenses.txt`)、同梱の画像・音・フォント(帰属は公開物の `assets/copyright.txt`。どどんとふ由来=BSD-3-Clause、効果音ラボ・On-Jin・ザ・マッチメイカァズ・OtoLogic[CC BY 4.0]、Material Icons[Apache-2.0]、Noto Sans JP/KR[OFL-1.1]、自作・生成画像)、上の CC0 効果音、Shippori Mincho(OFL-1.1)、自作の演出スプライト。公開物の直下に `LICENSE`(MIT)とこのファイルを置く。ソース・docs・data/raw・`*.map`・`axe_*.zip` は公開しない。

- 画面内の表示: アカウント設定の窓に「素材・ライセンス表示」(`assets/copyright.txt` と `3rdpartylicenses.txt` へのリンク)と、CC BY 4.0 の OtoLogic を含む効果音の提供元名を出す。公開物の README.md にも同じ表示を書く。
- 【要確認】Shippori Mincho の節は「内部配布のみ」を前提に書かれていた。公開すると前提が変わる。著作権表示(上記)に Reserved Font Name の記載が無い限り、同名のまま再配布できるが、**公開物に OFL の全文は同梱していない**(リンクのみ)。必要なら `docs/decisions_needed.md` の該当項目のとおり、全文を同梱する。
- `assets/copyright.txt` の Material Icons の注記(「同梱していない」)は、`fonts/material-icons.woff2` を同梱している現状と合っていない(Udonarium Axe 由来の古い注記)。ライセンス名(Apache-2.0)は変わらないので、公開に支障は無いが、直す余地がある。
