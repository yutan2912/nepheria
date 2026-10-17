/* ============================================================
   STORE — 状態の保持・永続化
   設計書 §1.1 の状態ツリーに準拠。演出層(scene/spriteStage等)や
   呪文エンジン(stack/registry.spells等)は1b/1cで使う枠だけ確保し、
   1aでは触らない(構造は壊さない)。
   ============================================================ */
const STORAGE_KEY = 'nepheria_vtt_state_v1';

function defaultConfig() {
  return {
    // 【要確認】クリティカル/ファンブルの閾値は現行卓のハウスルール未確定。
    // ここでは仮既定値としてクリ1〜5・ファンブル96〜100(CoC6版一般的な目安)を置く。
    // data/raw/ にハウスルール根拠が来たら確定させ、この既定値を差し替える。
    judge: { critMin: 1, critMax: 5, fumbleMin: 96, fumbleMax: 100 },
    // NPC/敵のHP表示ポリシー(§1.5)。安全側の既定として実数を隠す"bar"を選ぶ。KPが変更できる。
    npcHpVisibility: 'bar',
    // §9.10 仮既定config一覧。値は全て【仮既定】(design_doc_v0.md §9.10参照)であり、
    // KPの現行卓運用値が判明次第、卓ごとに差し替える前提。§9.10実装メモに従い、
    // 各値を使うロジックは対応する段(§9.3等)の実装時にのみ追加し、未使用の値は
    // ここに「将来ここを見る」宣言としてのみ置く(§9.10 config画面から編集できるようにする予定)。
    combat: {
      unconsciousThreshold: 2, // HP<=2 → 気絶判定(CON×5)の発生ライン(§9.12.1で自動判定に使用)
      dyingThreshold: 0, // HP<=0 → 瀕死。以後毎ラウンドCON×5失敗で死亡判定(§9.12.1で自動判定に使用)
      dodgePerRound: 0, // 1ラウンドの回避試行回数。0=無制限(§9.3で採用、上限チェックは無し=無制限のため実装不要)
      // nepheria-axe(2026-10-01、KP確認済みの卓ルール。data/raw/coc6_combat_skills.md): 既定をfalseにした。
      // 旧式の「有効ならこぶし/キックは常に2倍」ではなく、素手攻撃が命中した時に技能「マーシャルアーツ」でも
      // 百分率判定を行い、成功した時だけ2倍にする(pendingAttack.martialArts。下のhandleAttackIntent参照)。
      martialArts: false,
      critEffect: 'maxDamage', // クリティカルの効果。現状は"maxDamage"(ダメージ最大化)のみ実装(§9.3で使用)
      doubleMove: 2, // §9.12.3(2026-09-27追補)で配線: 行動放棄時の移動距離倍率(MOV×2)。この範囲まで移動すると自動でhasActed=trueになる
      defaultMov: 8, // mov未設定キャラの移動力(§9.2で使用)
      fanAngle: 90, // 扇テンプレの角度(§9.5で使用)
      responseTimerSec: 0, // 応答ウィンドウの制限時間。0=無制限(§9.4既存挙動と一致。現状UIタイマーは未実装)
      autoApply: false, // §9.12.1(2026-09-27): ダメージ・状態付与・CON×5判定等の完全自動適用。戦闘モードON時に既定でtrueへ切替
      mpRegenInCombat: false, // 戦闘中のMP自然回復(§9.7で使用予定、未配線)
      npcAutoDefend: true, // §9.12.1: NPCの防御選択(回避/受け流し/受ける)を最適技能で自動選択する
      autoDeath: false, // §9.12.1: 瀕死判定失敗時の死亡確定を自動で行うか(既定off。不可逆操作のためKP確認が既定)
      diagonalCost: 1, // §9.12.3(2026-09-27追補): 格子移動における斜め1マスのコスト(既定1=直交と同コスト)。
      // 斜め移動コストの統一ルールはdata/rawに定義が無いため、卓のhouse ruleとしてKPが設定する前提の値【要確認】
    },
  };
}

function defaultState() {
  return {
    meta: { toolVersion: '0.1.0-1a', dataVersion: '0', campaign: '星を解く者', savedAt: null },
    scene: {
      id: null,
      name: '',
      bgAssetId: null,
      fgAssetId: null,
      bgmAssetId: null,
      bgmPlaying: false,
      seAssetId: null,
      seNonce: 0,
      cutinAssetId: null,
      cutinNonce: 0,
      effects: [],
      // §9.5(2026-09-26): grid.enabled=trueの間だけ盤面にグリッド線を重ねて表示する(戦闘モード)。
      // cols=盤面幅を割る列数(KPが設定)。行数は表示専用に盤面のアスペクト比から導出する(論理判定は行わない)。
      // walls: ネイティブ壁エディタのデータ(docs/axe_teardown.md §4で決めた簡略構造)。座標系はトークンと同じ%(0-100)。
      grid: { enabled: false, cols: 20 },
      walls: [],
    }, // fgAssetId: §1-4/bgm*・se*: §1-5/cutin*: §2-2(いずれも2026-09-05)。1c未実装
    actors: {},
    spriteStage: {}, // §2-3(2026-09-05)。display:{actorId,diff,nonce}を持つ。1c(演出層本体)は引き続き未実装
    stack: [], // 1b未実装
    pendingAttack: null, // §9.3(2026-09-26)。解決待ちの物理攻撃(1件のみ。同時多重は本版スコープ外)
    round: { number: 0, phase: 'idle', order: [], activeIndex: -1 },
    log: [],
    handouts: {}, // 第三段未実装
    reveals: {}, // 未実装
    registry: { spells: {}, statuses: {}, macros: {}, creatures: {} }, // 1b/1c未実装
    config: defaultConfig(),
    assets: {}, // §8-D。最小実装(state内保存)
    scenePresets: {}, // §8-D。背景のセット保存
    customChatTabs: [], // チャット実装(2026-09-05)。ユーザーが追加したチャンネル[{id,label}]
    screenPanels: {}, // §2-5(2026-09-06)。盤面に置く画像パネル。{id,assetId,x,y,w,h,zIndex,locked,sizeLocked,terrain,hiddenFromPl,memo}
  };
}

function normalizeState(obj) {
  const d = defaultState();
  const s = Object.assign({}, d, obj || {});
  s.meta = Object.assign({}, d.meta, obj && obj.meta);
  s.scene = Object.assign({}, d.scene, obj && obj.scene);
  s.scene.grid = Object.assign({}, d.scene.grid, obj && obj.scene && obj.scene.grid);
  s.scene.walls = (obj && obj.scene && obj.scene.walls) || [];
  s.round = Object.assign({}, d.round, obj && obj.round);
  s.config = Object.assign({}, d.config, obj && obj.config);
  s.config.judge = Object.assign({}, d.config.judge, obj && obj.config && obj.config.judge);
  s.config.combat = Object.assign({}, d.config.combat, obj && obj.config && obj.config.combat);
  s.actors = (obj && obj.actors) || {};
  s.spriteStage = (obj && obj.spriteStage) || {};
  s.stack = (obj && obj.stack) || [];
  s.pendingAttack = (obj && obj.pendingAttack) || null;
  s.log = (obj && obj.log) || [];
  s.handouts = (obj && obj.handouts) || {};
  s.reveals = (obj && obj.reveals) || {};
  s.registry = Object.assign({ spells: {}, statuses: {}, macros: {}, creatures: {} }, obj && obj.registry);
  s.assets = (obj && obj.assets) || {};
  s.scenePresets = (obj && obj.scenePresets) || {};
  s.screenPanels = (obj && obj.screenPanels) || {};
  return s;
}

let state = null;
let nextTokenColorIdx = 0;
const TOKEN_COLORS = ['#c0392b', '#2d7dd2', '#2fa86a', '#a35fd8', '#d89a3d', '#3daaa0', '#d15a9e', '#7d8fd8'];

function uid(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

function persist() {
  state.meta.savedAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage save failed', e);
  }
  // NET(手順9)バグ修正(2026-09-05): persist()はKP/ホスト側のほぼ全ての状態変更後に呼ばれる
  // 既存の慣習だったが、従来はPL発の intent 応答時にしか netBroadcastToAll しておらず、
  // KP起点の変更(チャット送信・ラウンド進行・キャラ編集・シーン適用等)が誰もintentを送らない限り
  // 接続済みPLへ一切届かないというNET同期の抜けがあった。persist()に集約することで、
  // 「状態変更→persist()」という既存の呼び出し規約に乗るだけで自動的に同期されるようにする。
  if (typeof netHost !== 'undefined' && netHost.connections.size > 0) netBroadcastToAll(state);
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (e) {
    console.warn('localStorage load failed', e);
  }
  return null;
}

/* 初期3駒(カイン・アーク・レイド)。ステータスは開発用の仮置きであり、
   実際の卓当日値ではない。hidden.note にもその旨を明記して見た目からもわかるようにする。 */
function seedActors(s) {
  const seeds = [
    { name: 'カイン', x: 30, y: 40 },
    { name: 'アーク', x: 50, y: 60 },
    { name: 'レイド', x: 70, y: 40 },
  ];
  seeds.forEach((sd) => {
    const id = uid('actor');
    s.actors[id] = {
      id,
      name: sd.name,
      kind: 'PC',
      pos: { x: sd.x, y: sd.y },
      tokenAssetId: null,
      visible: true,
      stats: {
        hp: 12,
        maxHp: 12,
        mp: 10,
        maxMp: 10,
        san: 60,
        maxSan: 99,
        str: 12,
        con: 12,
        pow: 12,
        dex: 12,
        app: 12,
        siz: 12,
        int: 12,
        edu: 12,
        db: '0',
        armor: 0,
      },
      hidden: { note: '【仮置き】開発用ダミーステータス。卓当日の値に差し替えること。' },
      statuses: [],
      resist: { current: 0, cap: Math.floor(12 / 3), lockedRounds: 0 },
      skills: { 回避: 30, 目星: 40, 図書館: 25 },
      spells: [],
      items: [],
      sprites: {},
      macros: {},
      ownerConn: null,
      color: TOKEN_COLORS[nextTokenColorIdx++ % TOKEN_COLORS.length],
      // 以下はエンジン(1b)の実行時簿記フィールド。docs/design_doc_v0.md §2.5参照。
      hasActed: false,
      castLog: {},
      triggers: [],
      zIndex: 0,
      tokenScale: 1,
      initiative: null,
      customParams: {},
      statusFlags: {},
      publicMemo: '',
      iconAssetId: null,
      chatPalette: '',
    };
  });
}

function initState() {
  const loaded = loadFromStorage();
  if (loaded && Object.keys(loaded.actors).length) {
    state = loaded;
  } else {
    state = defaultState();
    seedActors(state);
    logSystem('初期キャラクター(カイン/アーク/レイド)を仮ステータスで配置しました。');
    persist();
  }
}

/* ============================================================
   ENGINE — 判定・汎用ロール(純粋関数寄り。DOM操作はしない)
   1b(呪文エンジン)は別モジュールとして今後この節に足していく。
   ============================================================ */
function rollDice(n, sides) {
  const rolls = [];
  for (let i = 0; i < n; i++) rolls.push(1 + Math.floor(Math.random() * sides));
  return rolls;
}

function parseDiceExpr(expr) {
  const m = /^(\d*)d(\d+)([+-]\d+)?$/i.exec(expr.trim());
  if (!m) return null;
  const n = m[1] ? parseInt(m[1], 10) : 1;
  const sides = parseInt(m[2], 10);
  const mod = m[3] ? parseInt(m[3], 10) : 0;
  if (n <= 0 || n > 100 || sides <= 0) return null;
  return { n, sides, mod };
}

function rollGeneric(exprStr) {
  const parsed = parseDiceExpr(exprStr);
  if (!parsed) return null;
  const rolls = rollDice(parsed.n, parsed.sides);
  const sum = rolls.reduce((a, b) => a + b, 0) + parsed.mod;
  return { formula: exprStr, rolls, mod: parsed.mod, total: sum };
}

function rollPercentile() {
  return 1 + Math.floor(Math.random() * 100);
}

function classifyJudge(roll, target, judgeCfg) {
  const isSuccess = roll <= target;
  if (isSuccess && roll >= judgeCfg.critMin && roll <= judgeCfg.critMax) return '決定的成功';
  if (!isSuccess && roll >= judgeCfg.fumbleMin && roll <= judgeCfg.fumbleMax) return 'ファンブル';
  return isSuccess ? '成功' : '失敗';
}

/* ============================================================
   BCDICE(§8-B) — CoC6版のBCDice互換ダイスコマンド解釈。
   docs.bcdice.org・BCDice本体ソースを実際に取得して確認した仕様に基づく
   (design_doc_v0.md §8.1参照)。表示だけCCfolia風の簡略形式にしている。
   ============================================================ */
function bcdiceFormatResult(roll, critMax, fumbleMin, success) {
  if (roll <= critMax) return 'クリティカル';
  if (roll >= fumbleMin) return 'ファンブル';
  return success ? '成功' : '失敗';
}
function bcdiceCoc(target, critMax, fumbleMin, label) {
  const roll = rollPercentile();
  const success = roll <= target;
  const resultText = bcdiceFormatResult(roll, critMax, fumbleMin, success);
  return { formula: `${label}<=${target}`, detail: `${roll}`, resultText };
}
function bcdicePlain100(target) {
  const roll = rollPercentile();
  const resultText = roll <= target ? '成功' : '失敗';
  return { formula: `1D100<=${target}`, detail: `${roll}`, resultText };
}
function bcdiceCombine(x, y, isB) {
  const critMax = isB ? 5 : 1,
    fumbleMin = isB ? 96 : 100;
  const roll = rollPercentile();
  const succX = roll <= x,
    succY = roll <= y;
  let resultText;
  if (roll <= critMax) resultText = 'クリティカル';
  else if (roll >= fumbleMin) resultText = 'ファンブル';
  else if (succX && succY) resultText = '成功';
  else if (succX || succY) resultText = '部分成功';
  else resultText = '失敗';
  return { formula: `${isB ? 'CBRB' : 'CBR'}(${x},${y})`, detail: `${roll}`, resultText };
}
function bcdiceResist(x, y, isB) {
  // target = 50 + (x-y)*5 (0-100クランプ)。§8.1に記録した暫定式(要検証)。
  const target = Math.max(0, Math.min(100, 50 + (x - y) * 5));
  const critMax = isB ? 5 : 1,
    fumbleMin = isB ? 96 : 100;
  const roll = rollPercentile();
  const resultText = bcdiceFormatResult(roll, critMax, fumbleMin, roll <= target);
  return { formula: `${isB ? 'RESB' : 'RES'}(${x}-${y})`, detail: `${roll}(目標${target})`, resultText };
}
function bcdiceChoice(items) {
  const pick = items[Math.floor(Math.random() * items.length)];
  return { formula: `choice[${items.join(',')}]`, detail: pick, resultText: '' };
}
function bcdiceAddDice(m) {
  const n = m[1] ? parseInt(m[1], 10) : 1;
  const sides = parseInt(m[2], 10);
  const mod = m[3] ? parseInt(m[3], 10) : 0;
  const mult = m[4] ? parseInt(m[4].slice(1), 10) : null; // §1-2: "*5"形式の乗算(ロードマップ2026-09-05で追加)
  const op = m[5],
    cmpTarget = m[6] !== undefined ? parseInt(m[6], 10) : undefined;
  if (n <= 0 || n > 1000 || sides <= 0) return null;
  const rolls = rollDice(n, sides);
  let sum = rolls.reduce((a, b) => a + b, 0) + mod;
  if (mult !== null) sum = sum * mult;
  let resultText = '';
  if (op !== undefined && cmpTarget !== undefined) {
    let ok;
    switch (op) {
      case '>=':
        ok = sum >= cmpTarget;
        break;
      case '>':
        ok = sum > cmpTarget;
        break;
      case '<=':
        ok = sum <= cmpTarget;
        break;
      case '<':
        ok = sum < cmpTarget;
        break;
      case '==':
        ok = sum === cmpTarget;
        break;
      case '!=':
        ok = sum !== cmpTarget;
        break;
    }
    resultText = ok === undefined ? '' : ok ? '成功' : '失敗';
  }
  const modStr = mod ? (mod > 0 ? `+${mod}` : `${mod}`) : '';
  const multStr = mult !== null ? `*${mult}` : '';
  const cmpStr = op !== undefined && cmpTarget !== undefined ? `${op}${cmpTarget}` : '';
  const formula = `${n}D${sides}${modStr}${multStr}${cmpStr}`;
  return { formula, detail: `${sum}[${rolls.join(',')}]`, resultText };
}
function tryBcdiceCommand(body) {
  let m;
  if ((m = /^CCB<=(\d+)$/i.exec(body))) return bcdiceCoc(parseInt(m[1], 10), 5, 96, 'CCB');
  if ((m = /^CC<=(\d+)$/i.exec(body))) return bcdiceCoc(parseInt(m[1], 10), 1, 100, 'CC');
  if ((m = /^1?D100<=(\d+)$/i.exec(body))) return bcdicePlain100(parseInt(m[1], 10));
  if ((m = /^CBRB\((\d+),(\d+)\)$/i.exec(body))) return bcdiceCombine(parseInt(m[1], 10), parseInt(m[2], 10), true);
  if ((m = /^CBR\((\d+),(\d+)\)$/i.exec(body))) return bcdiceCombine(parseInt(m[1], 10), parseInt(m[2], 10), false);
  if ((m = /^RESB\((\d+)-(\d+)\)$/i.exec(body))) return bcdiceResist(parseInt(m[1], 10), parseInt(m[2], 10), true);
  if ((m = /^RES\((\d+)-(\d+)\)$/i.exec(body))) return bcdiceResist(parseInt(m[1], 10), parseInt(m[2], 10), false);
  if ((m = /^choice[\[\(]([^\]\)]+)[\]\)]$/i.exec(body)))
    return bcdiceChoice(
      m[1]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  if ((m = /^choice\s+(.+)$/i.exec(body))) return bcdiceChoice(m[1].split(/\s+/).filter(Boolean));
  if ((m = /^(\d*)[Dd](\d+)([+-]\d+)?(\*\d+)?(?:(>=|<=|==|!=|>|<)(\d+))?$/.exec(body))) return bcdiceAddDice(m);
  return null;
}
function bcdiceRoll(cmdPart) {
  let secret = false;
  let result = tryBcdiceCommand(cmdPart);
  if (!result && /^[sS]/.test(cmdPart)) {
    const r2 = tryBcdiceCommand(cmdPart.slice(1));
    if (r2) {
      secret = true;
      result = r2;
    }
  }
  if (!result) return null;
  result.secret = secret;
  return result;
}

/* ============================================================
   ENGINE(呪文) — 1b。resolve(state, intent) -> Promise<{newState, events[]}>
   の純粋状態機械。script実行(await)対応のため resolve 系関数は async だが、
   DOM操作・通信コードはここに一切書かない(§2.1/§5)。
   草案語彙・未確定挙動の具体化方針は docs/design_doc_v0.md §2.5 を参照。
   ============================================================ */
function iso() {
  return new Date().toISOString();
}

function structuredCloneState(s) {
  if (typeof structuredClone === 'function') return structuredClone(s);
  return JSON.parse(JSON.stringify(s));
}

function ensureBookkeeping(actor) {
  if (actor.hasActed === undefined) actor.hasActed = false;
  if (!actor.castLog) actor.castLog = {};
  if (!actor.triggers) actor.triggers = [];
  if (!actor.resist)
    actor.resist = { current: 0, cap: Math.floor(((actor.stats && actor.stats.pow) || 0) / 3), lockedRounds: 0 };
  if (actor.resist.lockedRounds === undefined) actor.resist.lockedRounds = 0;
  if (!actor.statuses) actor.statuses = [];
  // §9.2(2026-09-26): roundStartPosはラウンド開始位置のスナップショット(MOV超過のソフト警告用)。
  // 未設定(旧セーブ等)の場合は現在地を起点とし、誤警告を防ぐ。
  if (!actor.roundStartPos && actor.pos) actor.roundStartPos = { x: actor.pos.x, y: actor.pos.y };
  // §9.12.3(2026-09-27追補): 今ラウンド中に自動経路移動で消費したMOV(分割移動の合算用)。ラウンド送りでリセットされる。
  if (actor.movUsedThisRound === undefined) actor.movUsedThisRound = 0;
}

// "反響(3)" のようなキーワード文字列から 名前+括弧内数値 を取り出す
function parseKeywordToken(tok) {
  const m = /^([^\(]+)(?:\((\d+)\))?$/.exec(tok.trim());
  if (!m) return { name: tok.trim(), n: null };
  return { name: m[1].trim(), n: m[2] !== undefined ? parseInt(m[2], 10) : null };
}
function parseKeywords(list) {
  const out = { echo: null, congeal: null, pierce: null, quickcast: false, contestable: false, others: [] };
  (list || []).forEach((tok) => {
    const { name, n } = parseKeywordToken(tok);
    if (name === '反響') out.echo = n === null ? 0 : n;
    else if (name === '凝集') out.congeal = n === null ? 0 : n;
    else if (name === '貫通') out.pierce = n === null ? 0 : n;
    else if (name === '瞬唱') out.quickcast = true;
    else if (name === '対抗可能') out.contestable = true;
    else out.others.push(name);
  });
  return out;
}

/* ---- §9.9(2026-09-26): 宣言合法性の事前判定(UI用の読み取り専用プレビュー)。
   handleCastIntent() の判定条件をミラーするが、状態を変更せず短い理由文字列だけを返す
   (スペルブックのグレーアウト表示に使う)。実際の合否判定・状態変更は引き続きhandleCastIntent側が持つ
   (このプレビューが「可」を返しても、宣言時に状況が変わっていれば失敗する — 楽観的ロックと同じ扱い)。 ---- */
function checkCastLegality(state, casterId, spellId, options) {
  const isRespond = !!(options && options.isRespond);
  const caster = state.actors[casterId];
  if (!caster) return { ok: false, reason: 'キャラクターが見つかりません' };
  const spell = state.registry.spells[spellId];
  if (!spell) return { ok: false, reason: '呪文データ未読込' };
  const kw = parseKeywords(spell.keywords);

  const windowEntry = state.stack[0];
  const windowOpen = !!(windowEntry && windowEntry.window && windowEntry.window.state === 'open');

  if (windowOpen) {
    if (!isRespond) return { ok: false, reason: '応答ウィンドウが開いています' };
    if (!windowEntry.window.respondableBy.includes(casterId)) return { ok: false, reason: '応答権なし' };
    if (windowEntry.window.decided.includes(casterId)) return { ok: false, reason: '応答済み' };
  } else if (isRespond) {
    return { ok: false, reason: '開いている応答ウィンドウがありません' };
  }

  if (kw.congeal !== null && state.round.number < kw.congeal) {
    return { ok: false, reason: `凝集: あとR${kw.congeal - state.round.number}` };
  }

  const castLog = caster.castLog || {};
  const lastCast = castLog[spellId];
  const alreadyCastThisRound = !!(lastCast && lastCast.round === state.round.number);
  let echoMpExtra = 0;
  if (alreadyCastThisRound) {
    if (kw.echo === null) return { ok: false, reason: '同一R使用済み' };
    echoMpExtra = kw.echo;
  }

  if (!windowOpen && !kw.quickcast && !alreadyCastThisRound && caster.hasActed) {
    return { ok: false, reason: '行動権を消費済み' };
  }

  if ((caster.resist.lockedRounds || 0) > 0) {
    return { ok: false, reason: `詠唱不能: 残${caster.resist.lockedRounds}R` };
  }

  const resistCost = 1 + (spell.resist || 0);
  const cap = Math.floor((caster.stats.pow || 0) / 3);
  const current = caster.resist.current || 0;
  if (current + resistCost > cap) {
    return { ok: false, reason: '術式抵抗が上限を超過' };
  }

  // MPコストがダイス表記("1d4"等)の場合は正確な値を宣言前に知りえないため、
  // 最小値(全ダイス出目1)で判定する【UI簡略化。実際の消費量は宣言時に決定】。
  const mpEstimate = estimateMinCost(spell.mp) + echoMpExtra;
  if ((caster.stats.mp || 0) < mpEstimate) {
    return { ok: false, reason: 'MP不足' };
  }

  return { ok: true, resistCost, resistCap: cap, resistCurrent: current, mpEstimate, echoMpExtra };
}
function estimateMinCost(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const parsed = parseDiceExpr(v);
    if (parsed) return parsed.n * 1 + parsed.mod; // 最小値(全ダイス1)
    const n = parseInt(v, 10);
    if (!isNaN(n)) return n;
  }
  return 0;
}
// §9.3(2026-09-26): クリティカル時のダメージ最大化(config.combat.critEffect==="maxDamage")用。
// estimateMinCost の最大値版(全ダイス出目=面の最大)。
function estimateMaxCost(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const parsed = parseDiceExpr(v);
    if (parsed) return parsed.n * parsed.sides + parsed.mod;
    const n = parseInt(v, 10);
    if (!isNaN(n)) return n;
  }
  return 0;
}

function rollValueOrDice(v) {
  if (typeof v === 'number') return { total: v, rolls: [], mod: v };
  if (typeof v === 'string') {
    const parsed = parseDiceExpr(v);
    if (parsed) {
      const rolls = rollDice(parsed.n, parsed.sides);
      const total = rolls.reduce((a, b) => a + b, 0) + parsed.mod;
      return { total, rolls, mod: parsed.mod };
    }
    const n = parseInt(v, 10);
    if (!isNaN(n)) return { total: n, rolls: [], mod: n };
  }
  return { total: 0, rolls: [], mod: 0 };
}

/* ============================================================
   §9.2/9.5(2026-09-26) 盤面・壁・射線・範囲テンプレの純粋関数群
   盤面座標はトークンと同じ%(0-100)系のまま扱う。グリッドは
   state.scene.grid.cols列を盤面幅いっぱいに敷き詰める前提で、
   セル1辺=100/cols(%)をx/y共通の単位とみなす簡略化を採る
   (盤面が正方形でない場合、視覚上のマス目とは若干のズレが出得るが、
   論理判定側もこの前提で統一されているため内部矛盾はない。
   厳密な縦横比対応はDOM計測が要るため本版のスコープ外【仮既定】)。
   ============================================================ */
function actorMov(state, actor) {
  const v = actor && actor.stats && actor.stats.mov;
  return v === undefined || v === null ? (state.config.combat && state.config.combat.defaultMov) || 8 : v;
}
function gridCellPct(state) {
  const cols = (state.scene && state.scene.grid && state.scene.grid.cols) || 20;
  return 100 / Math.max(1, cols);
}
function distanceCells(state, posA, posB) {
  const cellPct = gridCellPct(state);
  return Math.hypot(posA.x - posB.x, posA.y - posB.y) / cellPct;
}
function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}
// 線分p1-p2と線分p3-p4が交差するか(端点接触も交差扱い)
function segmentsIntersect(p1, p2, p3, p4) {
  function cross(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }
  const d1 = cross(p3, p4, p1),
    d2 = cross(p3, p4, p2),
    d3 = cross(p1, p2, p3),
    d4 = cross(p1, p2, p4);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  function onSeg(p, q, r) {
    return (
      Math.min(p.x, r.x) <= q.x && q.x <= Math.max(p.x, r.x) && Math.min(p.y, r.y) <= q.y && q.y <= Math.max(p.y, r.y)
    );
  }
  if (d1 === 0 && onSeg(p3, p1, p4)) return true;
  if (d2 === 0 && onSeg(p3, p2, p4)) return true;
  if (d3 === 0 && onSeg(p1, p3, p2)) return true;
  if (d4 === 0 && onSeg(p1, p4, p2)) return true;
  return false;
}
function segmentIntersectsRect(x1, y1, x2, y2, rect) {
  const p1 = { x: x1, y: y1 },
    p2 = { x: x2, y: y2 };
  if (pointInRect(x1, y1, rect) || pointInRect(x2, y2, rect)) return true;
  const corners = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
  for (let i = 0; i < 4; i++) {
    if (segmentsIntersect(p1, p2, corners[i], corners[(i + 1) % 4])) return true;
  }
  return false;
}
// 術者マス中心→対象マス中心の線分が、blocksSight壁と交差するか(§9.5の射線最小則)
function losBlocked(state, posA, posB) {
  const walls = (state.scene && state.scene.walls) || [];
  return walls.some((w) => w.blocksSight && segmentIntersectsRect(posA.x, posA.y, posB.x, posB.y, w));
}
// 移動元→移動先の線分が、blocksMove壁と交差するか(§9.2の移動衝突。現状はソフト警告用途のみで使用)
function moveBlockedByWalls(state, posA, posB) {
  const walls = (state.scene && state.scene.walls) || [];
  return walls.some((w) => w.blocksMove && segmentIntersectsRect(posA.x, posA.y, posB.x, posB.y, w));
}

/* ============================================================
   §9.12.3(2026-09-27追補): 移動UI刷新のための格子経路探索。
   distanceCells()等の既存の簡略化(セル1辺=100/cols(%)をx/y共通の単位とみなし、
   盤面の縦横比は考慮しない【仮既定】。§9.2/9.5のコメント参照)をそのまま踏襲し、
   論理格子を cols × cols のマス(行数=列数)として扱う。新しい前提を追加しない。
   ============================================================ */
function gridColsCount(state) {
  return (state.scene && state.scene.grid && state.scene.grid.cols) || 20;
}
function posToCell(state, pos) {
  const cellPct = gridCellPct(state);
  return { c: Math.floor(pos.x / cellPct), r: Math.floor(pos.y / cellPct) };
}
function cellToPosCenter(state, cell) {
  const cellPct = gridCellPct(state);
  return { x: (cell.c + 0.5) * cellPct, y: (cell.r + 0.5) * cellPct };
}
function cellKey(c, r) {
  return c + ',' + r;
}
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
// 壁(blocksMove)・他アクターの占有マスを「進入不可」として列挙する(§9.12.3: 壁/他の駒を避けて自動経路探索するため)。
// excludeActorId自身のマスは(自分の現在地なので)進入不可に含めない。
function computeBlockedCells(state, excludeActorId) {
  const cols = gridColsCount(state),
    rows = cols;
  const cellPct = gridCellPct(state);
  const blocked = new Set();
  ((state.scene && state.scene.walls) || []).forEach((w) => {
    if (!w.blocksMove) return;
    const c0 = Math.max(0, Math.floor(w.x / cellPct));
    const c1 = Math.min(cols - 1, Math.ceil((w.x + w.w) / cellPct) - 1);
    const r0 = Math.max(0, Math.floor(w.y / cellPct));
    const r1 = Math.min(rows - 1, Math.ceil((w.y + w.h) / cellPct) - 1);
    for (let c = c0; c <= c1; c++) {
      for (let r = r0; r <= r1; r++) {
        const cellRect = { x: c * cellPct, y: r * cellPct, w: cellPct, h: cellPct };
        if (rectsOverlap(cellRect, w)) blocked.add(cellKey(c, r));
      }
    }
  });
  Object.values(state.actors).forEach((a) => {
    if (a.visible === false) return;
    if (a.id === excludeActorId) return;
    const cell = posToCell(state, a.pos);
    blocked.add(cellKey(cell.c, cell.r));
  });
  return blocked;
}
// Dijkstra全探索(1回のフラッド埋めで、maxCost以内の全到達可能マスとその最短経路を得る。
// §9.12.3: 到達可能範囲ハイライト・ホバー中のパス取得を同じ探索結果から導くための共通基盤)。
// diagonalCost(config)により斜め移動のコストを変えられる(斜め移動のコストに関する統一ルールはdata/rawに定義が無いため、
// KPが卓のhouse ruleに応じて設定する前提の値としてconfig化した。既定1=直交と同コスト)。
function computeMovementField(state, actorId, maxCost) {
  const actor = state.actors[actorId];
  if (!actor) return null;
  const cols = gridColsCount(state),
    rows = cols;
  const diagCost = (state.config.combat && state.config.combat.diagonalCost) || 1;
  const blocked = computeBlockedCells(state, actorId);
  const start = posToCell(state, actor.pos);
  const startKey = cellKey(start.c, start.r);
  const dist = new Map([[startKey, 0]]);
  const parent = new Map([[startKey, null]]);
  const frontier = new Map([[startKey, { c: start.c, r: start.r, g: 0 }]]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  while (frontier.size) {
    let curKey = null,
      cur = null;
    for (const [k, v] of frontier) {
      if (!cur || v.g < cur.g) {
        cur = v;
        curKey = k;
      }
    }
    frontier.delete(curKey);
    for (const [dc, dr] of dirs) {
      const nc = cur.c + dc,
        nr = cur.r + dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      const nk = cellKey(nc, nr);
      if (blocked.has(nk)) continue;
      const isDiag = dc !== 0 && dr !== 0;
      // 壁の角を斜めにすり抜けないようにする(両側の直交マスが共に塞がっている場合のみ禁止)
      if (isDiag && blocked.has(cellKey(cur.c + dc, cur.r)) && blocked.has(cellKey(cur.c, cur.r + dr))) continue;
      const ng = cur.g + (isDiag ? diagCost : 1);
      if (maxCost !== undefined && ng > maxCost) continue;
      if (!dist.has(nk) || ng < dist.get(nk)) {
        dist.set(nk, ng);
        parent.set(nk, curKey);
        frontier.set(nk, { c: nc, r: nr, g: ng });
      }
    }
  }
  return { dist, parent, start, blocked, cols, rows };
}
// computeMovementField()の結果から、任意マスまでの最短経路を復元する(到達不能ならnull)。
function reconstructPathFromField(field, toCell) {
  if (!field) return null;
  const tk = cellKey(toCell.c, toCell.r);
  if (!field.dist.has(tk)) return null;
  const path = [];
  let k = tk;
  while (k !== null) {
    const [c, r] = k.split(',').map(Number);
    path.unshift({ c, r });
    k = field.parent.get(k);
  }
  return { path, cost: field.dist.get(tk) };
}
// 強制移動(push/pull)の到達先・衝突予測を副作用なしに計算する(§9.12.3: 詠唱対象決定中のプレビュー表示用。
// doMoveOne()の移動先算出ロジックと厳密に一致させる。実際の1d6ダメージ適用はdoMoveOne()が担う=ここでは行わない)。
function previewForcedMove(state, targetId, mode, arg) {
  const t = state.actors[targetId];
  if (!t) return null;
  const cx = 50,
    cy = 50;
  const dx = t.pos.x - cx,
    dy = t.pos.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist,
    uy = dy / dist;
  const distance = typeof arg === 'number' ? arg : (arg && arg.distance) || 10;
  const sign = mode === 'pull' ? -1 : 1;
  let dest = { x: t.pos.x + ux * distance * sign, y: t.pos.y + uy * distance * sign };
  let collided = false;
  if (dest.x < 0 || dest.x > 100 || dest.y < 0 || dest.y > 100) {
    collided = true;
    dest = { x: Math.max(0, Math.min(100, dest.x)), y: Math.max(0, Math.min(100, dest.y)) };
  }
  const OVERLAP = 5;
  Object.values(state.actors).forEach((other) => {
    if (other.id === targetId) return;
    if (Math.hypot(other.pos.x - dest.x, other.pos.y - dest.y) < OVERLAP) collided = true;
  });
  return { from: { x: t.pos.x, y: t.pos.y }, to: dest, collided };
}
// 範囲テンプレ内の対象アクターIdを列挙する(§9.4の円/直線/扇)。origin=術者位置、aim=カーソル/クリック位置、
// sizeCells=テンプレの長さ・半径(マス数)。表示中のアクターのみ対象候補とする。
function enumerateTemplateTargets(state, shape, originPos, aimPos, sizeCells) {
  const cellPct = gridCellPct(state);
  const results = [];
  const dxRaw = aimPos.x - originPos.x,
    dyRaw = aimPos.y - originPos.y;
  const aimLen = Math.hypot(dxRaw, dyRaw) || 1;
  const ux = dxRaw / aimLen,
    uy = dyRaw / aimLen;
  Object.values(state.actors).forEach((a) => {
    if (a.visible === false) return;
    const d = distanceCells(state, originPos, a.pos);
    if (shape === 'circle') {
      if (d <= sizeCells) results.push(a.id);
      return;
    }
    const px = (a.pos.x - originPos.x) / cellPct,
      py = (a.pos.y - originPos.y) / cellPct;
    if (shape === 'line') {
      const proj = px * ux + py * uy;
      const perp = Math.abs(px * uy - py * ux);
      if (proj >= 0 && proj <= sizeCells && perp <= 0.5) results.push(a.id);
    } else if (shape === 'fan') {
      if (d === 0) {
        results.push(a.id);
        return;
      } // 術者と同じマスは常に含める
      const dirAngle = Math.atan2(dyRaw, dxRaw);
      const targetAngle = Math.atan2(a.pos.y - originPos.y, a.pos.x - originPos.x);
      let diff = Math.abs(targetAngle - dirAngle);
      if (diff > Math.PI) diff = 2 * Math.PI - diff;
      const halfAngleRad = (((state.config.combat && state.config.combat.fanAngle) || 90) * Math.PI) / 180 / 2;
      if (d <= sizeCells && diff <= halfAngleRad) results.push(a.id);
    }
  });
  return results;
}

function resolveTargetList(newState, casterId, targets, spec) {
  if (spec === 'caster') return [casterId];
  if (spec === 'target' || spec === 'each_target' || spec === undefined) return (targets || []).slice();
  if (typeof spec === 'string' && newState.actors[spec]) return [spec];
  return [];
}

/* ---- 効果の実適用(vocab解釈系とscript ctx系の両方から共有して呼ばれる) ---- */
/* ---- §9.12.1 戦闘の全自動化(2026-09-27夜間一括作業)。design_doc_v0.md §9.12.1参照 ----
   config.combat.autoApply が true の間(戦闘モードON時に既定でtrueへ切り替える)、
   HPがunconsciousThreshold/dyingThresholdへ達した際のCON×5判定と状態付与を自動で行う。
   死亡確定(瀕死状態での毎ラウンド判定に失敗した場合)だけは不可逆なため、
   config.combat.autoDeath(既定off)がoffの間は自動確定せず、既存の/KP裁定(kind:"deathConfirm")へ委ねる。 */
function hasStatus(actor, id) {
  return (actor.statuses || []).some((s) => s.id === id);
}
function checkAutoUnconsciousDying(newState, events, actorId) {
  const cfg = newState.config.combat;
  if (!cfg.autoApply) return;
  const a = newState.actors[actorId];
  if (!a) return;
  const hp = a.stats.hp;
  if (hp <= cfg.unconsciousThreshold && !hasStatus(a, '気絶') && !hasStatus(a, '瀕死')) {
    const con = a.stats.con || 0,
      target = con * 5,
      roll = rollPercentile();
    const success = roll <= target;
    newState.log.push({
      t: iso(),
      kind: 'roll',
      from: '自動判定',
      text: `${a.name} は気絶しかけている: CON×5判定[${target}] → 1d100=${roll} … ${success ? '成功' : '失敗'}`,
    });
    if (!success) {
      a.statuses.push({ id: '気絶', stacks: 1, remainingRounds: null });
      newState.log.push({
        t: iso(),
        kind: 'system',
        from: 'system',
        text: `${a.name} は[気絶]状態になった(自動適用。KPは/状態で取り消し可)`,
      });
      events.push({ ev: 'status.apply', target: actorId, id: '気絶', stacks: 1 }); // §9.12.7(2026-09-27追補): applyStatusOneと同形のイベントを発火し、UIフィードバック層の購読対象を一本化する
    }
  }
  if (hp <= cfg.dyingThreshold && !hasStatus(a, '瀕死')) {
    a.statuses.push({ id: '瀕死', stacks: 1, remainingRounds: null });
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `${a.name} は[瀕死]状態になった(自動適用。以後毎ラウンドCON×5を自動判定)`,
    });
    events.push({ ev: 'status.apply', target: actorId, id: '瀕死', stacks: 1 }); // §9.12.7(2026-09-27追補)
  }
}
function applyDamageOne(newState, events, targetId, dice, opt) {
  const t = newState.actors[targetId];
  if (!t) return null;
  const r = rollValueOrDice(dice);
  const pierce = (opt && opt.pierce) || 0;
  const armor = Math.max(0, (t.stats.armor || 0) - pierce);
  const dmg = Math.max(0, r.total - armor);
  t.stats.hp = Math.max(0, t.stats.hp - dmg);
  newState.log.push({
    t: iso(),
    kind: 'roll',
    from: '呪文',
    text: `${t.name} にダメージ判定 → ${r.total}(装甲${armor}適用後 ${dmg}) HP ${t.stats.hp}/${t.stats.maxHp}`,
  });
  events.push({ ev: 'damage.apply', target: targetId, amount: dmg });
  fireTriggersFor(newState, events, targetId, 'damaged');
  checkAutoUnconsciousDying(newState, events, targetId);
  return dmg;
}
function applyDamageToTargets(newState, events, idList, dice, opt) {
  return idList.map((id) => applyDamageOne(newState, events, id, dice, opt));
}
function applyHealOne(newState, events, targetId, dice) {
  const t = newState.actors[targetId];
  if (!t) return null;
  const r = rollValueOrDice(dice);
  t.stats.hp = Math.min(t.stats.maxHp, t.stats.hp + r.total);
  newState.log.push({
    t: iso(),
    kind: 'roll',
    from: '呪文',
    text: `${t.name} を ${r.total} 回復 → HP ${t.stats.hp}/${t.stats.maxHp}`,
  });
  events.push({ ev: 'heal.apply', target: targetId, amount: r.total });
  return r.total;
}
function applyMpOne(newState, events, targetId, deltaOrDice) {
  const t = newState.actors[targetId];
  if (!t) return null;
  const r = rollValueOrDice(deltaOrDice);
  t.stats.mp = Math.max(0, Math.min(t.stats.maxMp, t.stats.mp + r.total));
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: '呪文',
    text: `${t.name} のMPが ${r.total >= 0 ? '+' : ''}${r.total} → ${t.stats.mp}/${t.stats.maxMp}`,
  });
  events.push({ ev: 'mp.apply', target: targetId, amount: r.total });
  return t.stats.mp;
}
function applyStatusOne(newState, events, targetId, id, stacks, duration) {
  const t = newState.actors[targetId];
  if (!t) return null;
  ensureBookkeeping(t);
  let entry = t.statuses.find((s) => s.id === id);
  if (!entry) {
    entry = { id, stacks: 0, remainingRounds: duration !== undefined ? duration : null };
    t.statuses.push(entry);
  }
  const delta = stacks === undefined ? 1 : stacks;
  entry.stacks += delta;
  if (duration !== undefined) entry.remainingRounds = duration;
  if (entry.stacks <= 0) {
    t.statuses = t.statuses.filter((s) => s !== entry);
  }
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: '呪文',
    text: `${t.name} に状態 [${id}] ${delta >= 0 ? '+' : ''}${delta}`,
  });
  events.push({ ev: 'status.apply', target: targetId, id, stacks: delta });
}
function cleanseStatusOne(newState, events, targetId, idOrTag) {
  const t = newState.actors[targetId];
  if (!t) return null;
  const before = t.statuses.length;
  t.statuses = t.statuses.filter((s) => s.id !== idOrTag);
  if (t.statuses.length !== before) {
    newState.log.push({ t: iso(), kind: 'system', from: '呪文', text: `${t.name} の状態 [${idOrTag}] を除去` });
    events.push({ ev: 'status.cleanse', target: targetId, id: idOrTag });
  }
}
function counterStackTop(newState, events) {
  if (newState.stack.length === 0) return false;
  const cancelled = newState.stack.pop();
  cancelled.status = 'countered';
  newState.log.push({ t: iso(), kind: 'system', from: '呪文', text: `スタック内の詠唱[${cancelled.spellId}]を相殺` });
  // §9.12.7(2026-09-27追補): 打ち消しフローター(UIフィードバック)がどの駒の上に出すか判断できるよう、
  // casterId/targetsをイベントにも積む(entryIdだけではUI側で駒を特定できないため)。
  events.push({
    ev: 'stack.counter',
    entryId: cancelled.id,
    casterId: cancelled.casterId,
    targets: (cancelled.targets || []).slice(),
  });
  return true;
}
function doMoveOne(newState, events, targetId, mode, arg) {
  const t = newState.actors[targetId];
  if (!t) return null;
  let dest;
  if (mode === 'teleport' && arg && typeof arg.x === 'number') {
    dest = { x: arg.x, y: arg.y };
  } else {
    // push/pull: 盤面中心からの遠近方向を暫定的な移動方向とする(§2.5)
    const cx = 50,
      cy = 50;
    const dx = t.pos.x - cx,
      dy = t.pos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist,
      uy = dy / dist;
    const distance = typeof arg === 'number' ? arg : (arg && arg.distance) || 10;
    const sign = mode === 'pull' ? -1 : 1;
    dest = { x: t.pos.x + ux * distance * sign, y: t.pos.y + uy * distance * sign };
  }
  // 衝突判定(§2.5): 盤面境界(0-100%)、または他アクターとの重なりを「壁」とみなす暫定実装
  let collided = false;
  if (dest.x < 0 || dest.x > 100 || dest.y < 0 || dest.y > 100) {
    collided = true;
    dest.x = Math.max(0, Math.min(100, dest.x));
    dest.y = Math.max(0, Math.min(100, dest.y));
  }
  const OVERLAP = 5;
  Object.values(newState.actors).forEach((other) => {
    if (other.id === targetId) return;
    const d = Math.hypot(other.pos.x - dest.x, other.pos.y - dest.y);
    if (d < OVERLAP) collided = true;
  });
  t.pos = dest;
  events.push({ ev: 'move.apply', target: targetId, to: dest, collided });
  if (collided) {
    applyDamageOne(newState, events, targetId, '1d6', {});
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: '呪文',
      text: `${t.name} は強制移動で衝突し停止(1d6ダメージ)`,
    });
  } else {
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: '呪文',
      text: `${t.name} が移動: (${dest.x.toFixed(1)}, ${dest.y.toFixed(1)})`,
    });
  }
}
function doSummon(newState, events, creatureId, pos) {
  const template = newState.registry.creatures && newState.registry.creatures[creatureId];
  if (!template) {
    newState.log.push({ t: iso(), kind: 'error', from: '呪文', text: `エラー: 召喚クリーチャー未登録: ${creatureId}` });
    return null;
  }
  const id = uid('actor');
  const actor = JSON.parse(JSON.stringify(template));
  actor.id = id;
  actor.pos = pos || { x: 50, y: 50 };
  ensureBookkeeping(actor);
  newState.actors[id] = actor;
  newState.log.push({ t: iso(), kind: 'system', from: '呪文', text: `${actor.name || creatureId} を召喚` });
  events.push({ ev: 'summon.apply', id, creatureId });
  return id;
}

function isEnemyOf(a, b) {
  const ea = a.kind === 'enemy';
  const eb = b.kind === 'enemy';
  return ea !== eb;
}

/* ---- 効果語彙(§2.2)インタプリタ。同期実行(§2.5: choiceも含め非同期は不要) ---- */
function evalCondition(vc, cond) {
  if (!cond) return false;
  const ids = resolveTargetList(vc.newState, vc.casterId, vc.targets, cond.of === 'caster' ? 'caster' : 'target');
  const actor = ids[0] && vc.newState.actors[ids[0]];
  if (!actor) return false;
  const val = actor.stats[cond.stat];
  switch (cond.op) {
    case 'lt':
      return val < cond.value;
    case 'lte':
      return val <= cond.value;
    case 'gt':
      return val > cond.value;
    case 'gte':
      return val >= cond.value;
    case 'eq':
      return val === cond.value;
    default:
      return false;
  }
}
function runEffectSteps(vc, steps) {
  (steps || []).forEach((step) => runEffectStep(vc, step));
}
function runEffectStep(vc, step) {
  const { newState, events } = vc;
  switch (step.type) {
    case 'damage': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      // 貫通はeffectステップ側の指定を優先し、無指定なら呪文の貫通(N)キーワードを既定値として使う(§2.5)
      const kwPierce = (vc.keywords && vc.keywords.pierce) || 0;
      const pierce = step.貫通 !== undefined ? step.貫通 : kwPierce;
      applyDamageToTargets(newState, events, ids, step.dice, { pierce, element: step.element });
      break;
    }
    case 'heal': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      ids.forEach((id) => applyHealOne(newState, events, id, step.dice));
      break;
    }
    case 'mp': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      ids.forEach((id) => applyMpOne(newState, events, id, step.delta !== undefined ? step.delta : step.dice));
      break;
    }
    case 'status': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      ids.forEach((id) =>
        applyStatusOne(newState, events, id, step.id, step.stacks !== undefined ? step.stacks : 1, step.duration)
      );
      break;
    }
    case 'cleanse': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      ids.forEach((id) => cleanseStatusOne(newState, events, id, step.id || step.tag));
      break;
    }
    case 'counter': {
      counterStackTop(newState, events);
      break;
    }
    case 'move': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target);
      ids.forEach((id) =>
        doMoveOne(newState, events, id, step.mode, step.distance !== undefined ? step.distance : step.to)
      );
      break;
    }
    case 'summon': {
      doSummon(newState, events, step.creatureId, step.pos);
      break;
    }
    case 'roll': {
      const r = rollValueOrDice(step.expr);
      if (step.store) vc.vars[step.store] = r.total;
      newState.log.push({ t: iso(), kind: 'roll', from: '呪文', text: `ロール[${step.expr}] → ${r.total}` });
      break;
    }
    case 'log': {
      newState.log.push({ t: iso(), kind: 'gm', from: '呪文', text: step.text });
      break;
    }
    case 'sequence':
      runEffectSteps(vc, step.steps);
      break;
    case 'parallel':
      runEffectSteps(vc, step.steps);
      break; // §2.5: 同期実行のためsequenceと同一実装
    case 'condition': {
      if (evalCondition(vc, step.if)) runEffectSteps(vc, step.then);
      else if (step.else) runEffectSteps(vc, step.else);
      break;
    }
    case 'trigger': {
      const ids = resolveTargetList(newState, vc.casterId, vc.targets, step.target || 'target');
      ids.forEach((id) => {
        const t = newState.actors[id];
        if (!t) return;
        ensureBookkeeping(t);
        t.triggers.push({
          id: uid('trig'),
          sourceSpellId: vc.spellId,
          on: step.on,
          remainingRounds: step.duration !== undefined ? step.duration : null,
          do: step.do || [],
        });
      });
      newState.log.push({ t: iso(), kind: 'system', from: '呪文', text: `トリガー登録(on:${step.on})` });
      break;
    }
    case 'selector': {
      // §2.5: selector単独は no-op。choose:"random"のみ resolveTargetListSelector 経由で別途対応(未使用の草案要素)。
      break;
    }
    case 'choice': {
      const picked = step.options && step.options[0]; // §2.5: 常に先頭を選ぶ暫定実装
      if (step.store) vc.vars[step.store] = picked;
      break;
    }
    default:
      newState.log.push({ t: iso(), kind: 'error', from: 'system', text: `未対応の効果type: ${step.type}` });
  }
}

function fireTriggersFor(newState, events, actorId, on) {
  const actor = newState.actors[actorId];
  if (!actor || !actor.triggers || !actor.triggers.length) return;
  const remaining = [];
  actor.triggers.forEach((trig) => {
    if (trig.on === on) {
      const vc = { newState, events, casterId: actorId, targets: [actorId], vars: {}, spellId: trig.sourceSpellId };
      runEffectSteps(vc, trig.do || []);
      newState.log.push({
        t: iso(),
        kind: 'system',
        from: 'trigger',
        text: `${actor.name} のトリガー[${trig.sourceSpellId}]が発火(${on})`,
      });
      // damaged/castResolvedは一回きり発火(§2.5)。再登録はしない。
    } else {
      remaining.push(trig);
    }
  });
  actor.triggers = remaining;
}

/* ---- script(第三層)実行。ctx API は §2.4 準拠。ここだけが非同期を要する ---- */
function deepFreezeClone(obj) {
  const clone = structuredCloneState(obj);
  const seen = new Set();
  (function freeze(o) {
    if (o && typeof o === 'object' && !seen.has(o)) {
      seen.add(o);
      Object.values(o).forEach(freeze);
      Object.freeze(o);
    }
  })(clone);
  return clone;
}
function makeScriptCtx(newState, events, casterId, targets, spell) {
  const ctx = {};
  Object.defineProperty(ctx, 'state', {
    get() {
      return deepFreezeClone(newState);
    },
  });
  ctx.roll = (expr) => rollValueOrDice(expr).total;
  ctx.damage = (target, dice, opt) =>
    applyDamageToTargets(newState, events, resolveTargetList(newState, casterId, targets, target), dice, opt || {});
  ctx.heal = (target, dice) =>
    resolveTargetList(newState, casterId, targets, target).map((id) => applyHealOne(newState, events, id, dice));
  ctx.mp = (target, delta) =>
    resolveTargetList(newState, casterId, targets, target).map((id) => applyMpOne(newState, events, id, delta));
  ctx.addStatus = (t, id, stacks, dur) =>
    resolveTargetList(newState, casterId, targets, t).forEach((x) =>
      applyStatusOne(newState, events, x, id, stacks, dur)
    );
  ctx.removeStatus = (t, id) =>
    resolveTargetList(newState, casterId, targets, t).forEach((x) => cleanseStatusOne(newState, events, x, id));
  ctx.counter = () => counterStackTop(newState, events);
  ctx.move = (t, mode, arg) =>
    resolveTargetList(newState, casterId, targets, t).forEach((x) => doMoveOne(newState, events, x, mode, arg));
  ctx.summon = (creatureId, pos) => doSummon(newState, events, creatureId, pos);
  ctx.actors = (filter) => Object.values(newState.actors).filter(filter || (() => true));
  ctx.pickSpells = (n) => Object.keys(newState.registry.spells || {}).slice(0, n || 1); // §2.5: 簡易実装
  ctx.choose = async (actor, options) => options && options[0]; // §2.5: 常に先頭を選ぶ暫定実装
  ctx.history = (filter) => newState.log.filter(filter || (() => true));
  ctx.log = (text) => newState.log.push({ t: iso(), kind: 'gm', from: '呪文', text });
  return ctx;
}
function runScript(ctx, code) {
  const fn = new Function('ctx', `"use strict"; return (async function(){ ${code} })();`);
  return fn(ctx);
}

/* ---- 詠唱の解決本体 ---- */
async function resolveCastEffects(newState, events, casterId, targets, spell, entryId) {
  const vc = {
    newState,
    events,
    casterId,
    targets,
    vars: {},
    spellId: spell.id,
    keywords: parseKeywords(spell.keywords),
  };
  const hasEffect = Array.isArray(spell.effect) && spell.effect.length > 0;
  const hasScript = typeof spell.script === 'string' && spell.script.trim().length > 0;
  if (hasEffect) {
    runEffectSteps(vc, spell.effect);
  } else if (hasScript) {
    const ctx = makeScriptCtx(newState, events, casterId, targets, spell);
    try {
      await runScript(ctx, spell.script);
    } catch (e) {
      newState.log.push({
        t: iso(),
        kind: 'error',
        from: 'system',
        text: `script実行エラー(${spell.id}): ${e.message}`,
      });
    }
  } else {
    // KP裁定モード(§2.1・§2.5): 語彙外・script未整備の呪文は保留にする
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `呪文[${spell.name || spell.id}]は語彙外・script未整備のため、KP裁定待ちです(/KP裁定 ${entryId} <結果テキスト>)。`,
    });
    return false;
  }
  // fx欄(§2.3)は演出層(1c)未実装のため、eventsに積むだけで再生はしない
  (spell.fx || []).forEach((fxev) => events.push(Object.assign({ deferred: true }, fxev)));
  return true;
}

function isWindowFullyDecided(entry) {
  return entry.window.respondableBy.every((id) => entry.window.decided.includes(id));
}
/* ---- §9.12.2(2026-09-27) スタックUI刷新: 自動パス。design_doc_v0.md §9.12.2参照 ----
   応答可能な呪文(=所持呪文がある)を持たないキャラは最初から自動パス扱い(actor.autoPassMode既定"noOptions")。
   "always"に設定すると、応答手段があっても常に自動パスする(PL画面からも切替可能にする想定。UI導線は
   スタックビューア新設時に追加する)。 */
function actorHasResponseOptions(newState, actorId) {
  const a = newState.actors[actorId];
  return !!(a && a.spells && a.spells.length > 0);
}
function shouldAutoPassWindow(newState, actorId) {
  const a = newState.actors[actorId];
  if (!a) return true;
  if (a.autoPassMode === 'always') return true;
  return !actorHasResponseOptions(newState, actorId); // 既定"noOptions"相当
}
function applyAutoPassToWindow(newState, events, entry) {
  if (!entry.window || entry.window.state !== 'open') return;
  entry.window.respondableBy.forEach((id) => {
    if (entry.window.decided.includes(id)) return;
    if (shouldAutoPassWindow(newState, id)) {
      entry.window.decided.push(id);
      const a = newState.actors[id];
      const reason = a && a.autoPassMode === 'always' ? '常に自動パス設定' : '応答手段なし';
      newState.log.push({ t: iso(), kind: 'system', from: 'system', text: `${a ? a.name : id} は自動パス(${reason})` });
    }
  });
}
async function checkAndCloseWindow(newState, events) {
  const windowEntry = newState.stack[0];
  if (!windowEntry || windowEntry.window.state !== 'open') return;
  if (isWindowFullyDecided(windowEntry)) {
    windowEntry.window.state = 'closed';
    await resolveEntireStack(newState, events);
  }
}
async function resolveEntireStack(newState, events) {
  while (newState.stack.length) {
    const entry = newState.stack[newState.stack.length - 1];
    if (entry.status === 'countered') {
      newState.stack.pop();
      continue;
    }
    if (entry.status === 'awaiting_kp') {
      break;
    } // KP裁定待ちで自動解決を止める
    const spell = newState.registry.spells[entry.spellId];
    const caster = newState.actors[entry.casterId];
    if (!spell || !caster) {
      newState.stack.pop();
      continue;
    }
    newState.stack.pop(); // 解決中は配列から外す(counterがこの下の要素を打ち消せるように)
    entry.status = 'resolving';
    const resolved = await resolveCastEffects(newState, events, entry.casterId, entry.targets, spell, entry.id);
    if (resolved) {
      entry.status = 'resolved';
      fireTriggersFor(newState, events, entry.casterId, 'castResolved');
    } else {
      entry.status = 'awaiting_kp';
      newState.stack.push(entry);
      break;
    }
  }
}

/* ============================================================
   §9.3 物理戦闘の解決(2026-09-26)
   攻撃(attack)→対象の防御選択(defend: dodge/parry/accept)の2段階intentで実装する。
   スタック(呪文)とは別の newState.pendingAttack(単発・1件のみ)で解決待ちを保持する。
   同時に複数の攻撃を解決待ちにはできない(本版スコープ外。§9.11実装メモに記載)。
   ============================================================ */
function resolvePendingAttackDamage(newState, events, pa) {
  const attacker = newState.actors[pa.attackerId];
  const target = newState.actors[pa.targetId];
  // nepheria-axe(2026-10-01): 組み付きはダメージを与えず(DBも加えず)、対象を「組み付き」状態にする。
  if (pa.skill === '組み付き') {
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: '戦闘',
      text: `${attacker.name} は ${target.name} に組み付いた(ダメージなし)`,
    });
    applyStatusOne(newState, events, pa.targetId, '組み付き', 1);
    events.push({ ev: 'attack.grapple', attackerId: pa.attackerId, targetId: pa.targetId });
    return;
  }
  const useMax = pa.isCrit && newState.config.combat.critEffect === 'maxDamage';
  const dmgRoll = useMax ? { total: estimateMaxCost(pa.damageDice) } : rollValueOrDice(pa.damageDice);
  let dbAdd = 0;
  if (pa.melee && attacker.stats.db && attacker.stats.db !== '0') {
    dbAdd = useMax ? estimateMaxCost(attacker.stats.db) : rollValueOrDice(attacker.stats.db).total;
  }
  let rawDmg = dmgRoll.total + dbAdd;
  const isMartialArts = !!(
    pa.martialArts ||
    (newState.config.combat.martialArts && (pa.skill === 'こぶし' || pa.skill === 'キック'))
  );
  if (isMartialArts) rawDmg *= 2; // 【仮既定】config: martialArts(design_doc_v0.md §9.3・§9.10)
  const armor = Math.max(0, (target.stats.armor || 0) - (pa.pierce || 0));
  const dmg = Math.max(0, rawDmg - armor);
  target.stats.hp = Math.max(0, target.stats.hp - dmg);
  const tags = [pa.isCrit ? 'クリティカル:最大値' : null, isMartialArts ? 'マーシャルアーツ2倍' : null].filter(Boolean);
  const tagStr = tags.length ? ` [${tags.join('・')}]` : '';
  // §9.14.1(2026-09-27追補): ダイス式・出目内訳(ダメージダイス単体/DB)が欠けていたログを拡張し、
  // 式・出目・成功度・ダメージ値・適用後HPが省略なく数値で追えるようにした(手順0.c)。
  const dbStr = dbAdd ? ` + DB[${attacker.stats.db}]=${dbAdd}` : '';
  newState.log.push({
    t: iso(),
    kind: 'roll',
    from: '戦闘',
    text: `${attacker.name} の攻撃が ${target.name} に命中: ダメージ式[${pa.damageDice}]=${dmgRoll.total}${dbStr} → 合計${rawDmg}(装甲${armor}適用後 ${dmg})${tagStr} → HP ${target.stats.hp}/${target.stats.maxHp}`,
  });
  events.push({
    ev: 'attack.damage.apply',
    attackerId: pa.attackerId,
    targetId: pa.targetId,
    amount: dmg,
    isCrit: !!pa.isCrit,
  }); // §9.12.7(2026-09-27追補): クリティカル強調フローター用
  checkAutoUnconsciousDying(newState, events, pa.targetId); // §9.12.1(2026-09-27)
}

function handleAttackIntent(newState, events, intent) {
  const { attackerId, targetId, skill, damageDice, pierce, melee } = intent;
  const attacker = newState.actors[attackerId];
  const target = newState.actors[targetId];
  if (!attacker) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `攻撃失敗: 攻撃者が見つかりません(${attackerId})`,
    });
    return;
  }
  if (!target) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: `攻撃失敗: 対象が見つかりません(${targetId})` });
    return;
  }
  if (newState.pendingAttack) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: '攻撃失敗: 既に解決待ちの攻撃があります。先に /回避 /受け流し /被弾 で解決してください',
    });
    return;
  }
  if (!skill || !(skill in (attacker.skills || {}))) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `攻撃失敗: ${attacker.name} は技能「${skill || ''}」を持っていません`,
    });
    return;
  }
  const skillVal = attacker.skills[skill];
  const roll = rollPercentile();
  const result = classifyJudge(roll, skillVal, newState.config.judge);
  newState.log.push({
    t: iso(),
    kind: 'roll',
    from: attacker.name,
    text: `攻撃[${skill} ${skillVal}] → 対象:${target.name} 1d100=${roll} … ${result}`,
  });
  events.push({ ev: 'attack.roll', attackerId, targetId, roll, result });
  if (result === 'ファンブル') {
    // §9.3: 「ファンブル=KP裁定チップを提示」。既存の /KP裁定 (handleKpResolveIntent) は
    // entry.id をstackから探すだけの汎用実装のため、kind:"attackFumble" のエントリも無改修で扱える。
    const entryId = uid('fumble');
    newState.stack.push({ id: entryId, kind: 'attackFumble', attackerId, targetId, status: 'awaiting_kp' });
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `攻撃ファンブル: KP裁定が必要です(/KP裁定 ${entryId} <結果テキスト>)`,
    });
    return;
  }
  if (result === '失敗') {
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${attacker.name} の攻撃は ${target.name} に命中しませんでした`,
    });
    return;
  }
  // nepheria-axe(2026-10-01): 素手攻撃(こぶし/キック/頭突き)が命中したら、技能「マーシャルアーツ」でも判定し、
  // 成功すればダメージ2倍(KP確認済みの卓ルール)。技能を持たないキャラでは何も起きない。
  let martialArts = false;
  const maVal = (attacker.skills || {})['マーシャルアーツ'];
  if ((skill === 'こぶし' || skill === 'キック' || skill === '頭突き') && typeof maVal === 'number' && maVal > 0) {
    const maRoll = rollPercentile();
    const maResult = classifyJudge(maRoll, maVal, newState.config.judge);
    martialArts = maResult === '成功' || maResult === '決定的成功';
    newState.log.push({
      t: iso(),
      kind: 'roll',
      from: attacker.name,
      text: `マーシャルアーツ[${maVal}] → 1d100=${maRoll} … ${maResult}${martialArts ? '(ダメージ2倍)' : ''}`,
    });
  }
  newState.pendingAttack = {
    id: uid('atk'),
    attackerId,
    targetId,
    skill,
    damageDice,
    pierce: pierce || 0,
    melee: melee !== false,
    isCrit: result === '決定的成功',
    martialArts,
  };
  // §9.12.1(2026-09-27): NPCはconfig.combat.npcAutoDefendが有効なら防御を自動選択して即座に解決する
  // (回避技能値 vs 所持技能の最大値を比較し、大きい方を選ぶという単純なヒューリスティック)。
  if (target.kind === 'NPC' && newState.config.combat.npcAutoDefend) {
    const dodgeVal = (target.skills && target.skills['回避']) || 0;
    let bestSkill = '回避',
      bestVal = dodgeVal;
    Object.entries(target.skills || {}).forEach(([k, v]) => {
      if (k !== '回避' && v > bestVal) {
        bestSkill = k;
        bestVal = v;
      }
    });
    const mode = bestSkill === '回避' ? 'dodge' : 'parry';
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${target.name}(NPC)は自動防御: ${mode === 'dodge' ? '回避' : '受け流し[' + bestSkill + ']'}を選択(自動適用)`,
    });
    handleDefendIntent(newState, events, { targetId, mode, skill: bestSkill });
    return;
  }
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: 'system',
    text: `${target.name} は /回避 ${target.name} か /受け流し ${target.name} <技能名> か /被弾 ${target.name} で応じてください(同一攻撃への防御試行は1回のみ)`,
  });
}

function handleDefendIntent(newState, events, intent) {
  const { targetId, mode, skill } = intent; // mode: "dodge" | "parry" | "accept"
  const pa = newState.pendingAttack;
  if (!pa) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '防御失敗: 解決待ちの攻撃がありません' });
    return;
  }
  const target = newState.actors[targetId];
  if (!target) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `防御失敗: キャラクターが見つかりません(${targetId})`,
    });
    return;
  }
  if (pa.targetId !== targetId) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `防御失敗: ${target.name} は現在解決待ちの攻撃の対象ではありません`,
    });
    return;
  }
  if (mode === 'accept') {
    newState.pendingAttack = null;
    resolvePendingAttackDamage(newState, events, pa);
    return;
  }
  const skillName = mode === 'dodge' ? '回避' : skill;
  if (!skillName || !(skillName in (target.skills || {}))) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `防御失敗: ${target.name} は技能「${skillName || '(未指定)'}」を持っていません`,
    });
    return;
  }
  const skillVal = target.skills[skillName];
  const roll = rollPercentile();
  const result = classifyJudge(roll, skillVal, newState.config.judge);
  const success = result === '成功' || result === '決定的成功';
  const modeLabel = mode === 'dodge' ? '回避' : '受け流し';
  newState.log.push({
    t: iso(),
    kind: 'roll',
    from: target.name,
    text: `${modeLabel}[${skillName} ${skillVal}] → 1d100=${roll} … ${result}`,
  });
  newState.pendingAttack = null;
  if (success) {
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${target.name} は攻撃を${modeLabel}しました。ダメージなし`,
    });
    events.push({ ev: 'attack.defended', targetId, mode });
    return;
  }
  resolvePendingAttackDamage(newState, events, pa);
}

// §9.12.3(2026-09-27追補): 移動UI(自動経路探索)からの移動確定。
// UI側がcomputeMovementField()で既に到達可能性を確認済みの前提だが、エンジン側でも同じ関数で再検証する
// (エンジンは(state,intent)→{newState,events[]}の純粋関数であるべきという鉄則5を守るため、UI側の計算結果を信用しない)。
function handleMoveConfirmIntent(newState, events, intent) {
  const { actorId, toCell } = intent;
  const actor = newState.actors[actorId];
  if (!actor) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `移動失敗: キャラクターが見つかりません(${actorId})`,
    });
    return;
  }
  if (!toCell || typeof toCell.c !== 'number' || typeof toCell.r !== 'number') {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '移動失敗: 移動先マスが不正です' });
    return;
  }
  const mov = actorMov(newState, actor);
  const doubleMove = (newState.config.combat && newState.config.combat.doubleMove) || 2;
  const remainingBudget = Math.max(0, mov * doubleMove - (actor.movUsedThisRound || 0));
  const field = computeMovementField(newState, actorId, remainingBudget);
  const result = reconstructPathFromField(field, toCell);
  if (!result) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `移動失敗: ${actor.name} は指定のマスまで到達できません(壁/他の駒に阻まれている、または残り移動力を超えています)`,
    });
    return;
  }
  const usedBefore = actor.movUsedThisRound || 0;
  actor.movUsedThisRound = usedBefore + result.cost;
  actor.pos = cellToPosCenter(newState, toCell);
  actor.roundStartPos = { x: actor.pos.x, y: actor.pos.y }; // §9.2の距離警告(手動ドラッグとの併用時)が誤発火しないよう起点も更新
  const forcedAction = actor.movUsedThisRound > mov + 1e-9;
  if (forcedAction && !actor.hasActed) {
    actor.hasActed = true;
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${actor.name} は通常MOV(${mov})を超えて移動したため、今ラウンドの行動を放棄しました(doubleMove)`,
    });
  }
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: 'system',
    text: `${actor.name} が移動(コスト${result.cost}、今ラウンド累計${actor.movUsedThisRound}/${mov}${forcedAction ? `〜${(mov * doubleMove).toFixed(1)}` : ''})`,
  });
  events.push({ ev: 'move.confirm', actorId, path: result.path, cost: result.cost, forcedAction });
}

async function handleCastIntent(newState, events, intent) {
  const { casterId, spellId, targets } = intent;
  const caster = newState.actors[casterId];
  if (!caster) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: キャラクターが見つかりません(${casterId})`,
    });
    return;
  }
  ensureBookkeeping(caster);
  const spell = newState.registry.spells[spellId];
  if (!spell) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: `詠唱失敗: 呪文が見つかりません(${spellId})` });
    return;
  }
  const kw = parseKeywords(spell.keywords);

  const windowEntry = newState.stack[0];
  const windowOpen = !!(windowEntry && windowEntry.window && windowEntry.window.state === 'open');

  if (windowOpen) {
    if (intent.type !== 'respond') {
      newState.log.push({
        t: iso(),
        kind: 'error',
        from: 'system',
        text: '詠唱失敗: スタックの応答ウィンドウが開いています。/応答 か /パス を使ってください。',
      });
      return;
    }
    if (!windowEntry.window.respondableBy.includes(casterId)) {
      newState.log.push({
        t: iso(),
        kind: 'error',
        from: 'system',
        text: `応答失敗: ${caster.name} は応答権を持っていません`,
      });
      return;
    }
    if (windowEntry.window.decided.includes(casterId)) {
      newState.log.push({
        t: iso(),
        kind: 'error',
        from: 'system',
        text: `応答失敗: ${caster.name} は既にこのウィンドウで決定済みです`,
      });
      return;
    }
  } else if (intent.type === 'respond') {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: '応答失敗: 開いているスタックウィンドウがありません',
    });
    return;
  }

  // 凝集(N)ゲート: 戦闘開始(ラウンド0)からNラウンド経過するまで宣言不可(§2.5)
  if (kw.congeal !== null && newState.round.number < kw.congeal) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: [${spell.name}]は凝集(${kw.congeal})のためラウンド${kw.congeal}まで宣言できません(現在ラウンド${newState.round.number})`,
    });
    return;
  }

  // 同一呪文の同ラウンド再詠唱は不可。反響(N)のみ例外(追加MP)。
  const lastCast = caster.castLog[spellId];
  const alreadyCastThisRound = !!(lastCast && lastCast.round === newState.round.number);
  let echoMpExtra = 0;
  if (alreadyCastThisRound) {
    if (kw.echo === null) {
      newState.log.push({
        t: iso(),
        kind: 'error',
        from: 'system',
        text: `詠唱失敗: [${spell.name}]は同一ラウンド内で再詠唱できません(反響キーワードなし)`,
      });
      return;
    }
    echoMpExtra = kw.echo;
  }

  // 行動権(瞬唱以外は消費。反響による再詠唱は行動権を消費しない §2.5)
  if (!kw.quickcast && !alreadyCastThisRound && caster.hasActed) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: ${caster.name} は既にこのラウンドの行動権を消費しています(瞬唱ではありません)`,
    });
    return;
  }

  // 詠唱不能ロック
  if (caster.resist.lockedRounds > 0) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: ${caster.name} は詠唱不能状態です(残り${caster.resist.lockedRounds}ラウンド)`,
    });
    return;
  }

  // 術式抵抗
  const resistCost = 1 + (spell.resist || 0);
  caster.resist.cap = Math.floor((caster.stats.pow || 0) / 3);
  if (caster.resist.current + resistCost > caster.resist.cap) {
    caster.resist.current = caster.resist.cap;
    const lock = rollDice(1, 3)[0];
    caster.resist.lockedRounds = lock;
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: ${caster.name} の術式抵抗が上限(${caster.resist.cap})を超過。${lock}ラウンドの詠唱不能。`,
    });
    events.push({ ev: 'resist.locked', target: casterId, rounds: lock }); // §9.12.7(2026-09-27追補): 詠唱不能発生時の強めのロックアイコン点滅用
    return;
  }

  // MPコスト
  const baseMp = rollValueOrDice(spell.mp !== undefined ? spell.mp : 0).total;
  const totalMp = baseMp + echoMpExtra;
  if (caster.stats.mp < totalMp) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `詠唱失敗: ${caster.name} のMPが不足しています(必要${totalMp}, 所持${caster.stats.mp})`,
    });
    return;
  }

  // ここまで通過 → コスト確定
  caster.stats.mp -= totalMp;
  caster.resist.current += resistCost;
  events.push({ ev: 'resist.apply', target: casterId, amount: resistCost }); // §9.12.7(2026-09-27追補): 術式抵抗ゲージの一目盛りパルス用
  caster.castLog[spellId] = { round: newState.round.number };
  if (!kw.quickcast && !alreadyCastThisRound) caster.hasActed = true;

  const entryId = uid('stack');
  const entry = {
    id: entryId,
    spellId,
    casterId,
    targets: targets.slice(),
    declaredRound: newState.round.number,
    window: { respondableBy: targets.slice(), state: 'open', decided: [] },
    status: 'open',
  };

  if (windowOpen) {
    entry.window = { respondableBy: [], state: 'closed', decided: [] };
    newState.stack.push(entry);
    windowEntry.window.decided.push(casterId);
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${caster.name} が [${spell.name}] を応答としてスタックへ積みました`,
    });
    await checkAndCloseWindow(newState, events);
    return;
  }

  if (kw.contestable) {
    newState.stack.push(entry);
    const names = targets.map((id) => (newState.actors[id] ? newState.actors[id].name : id)).join(',');
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${caster.name} が [${spell.name}] を宣言。対抗可能のためスタックが開きました(応答権: ${names})`,
    });
    applyAutoPassToWindow(newState, events, entry); // §9.12.2(2026-09-27): 応答手段なし/常に自動パス設定のキャラを自動でパス扱いにする
    await checkAndCloseWindow(newState, events);
    return;
  }

  // 対抗不可 → 即時解決
  {
    const names = targets.map((id) => (newState.actors[id] ? newState.actors[id].name : id)).join(',') || '(対象なし)';
    newState.log.push({
      t: iso(),
      kind: 'system',
      from: 'system',
      text: `${caster.name} が [${spell.name}] を宣言(対象: ${names})`,
    });
  }
  entry.status = 'resolving';
  const resolved = await resolveCastEffects(newState, events, casterId, targets, spell, entryId);
  if (resolved) {
    entry.status = 'resolved';
    fireTriggersFor(newState, events, casterId, 'castResolved');
  } else {
    entry.status = 'awaiting_kp';
    newState.stack.push(entry);
  }
}

async function handlePassIntent(newState, events, intent) {
  const { actorId } = intent;
  const windowEntry = newState.stack[0];
  if (!windowEntry || windowEntry.window.state !== 'open') {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: 'パス失敗: 開いているスタックウィンドウがありません',
    });
    return;
  }
  if (!windowEntry.window.respondableBy.includes(actorId)) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: 'パス失敗: 応答権がありません' });
    return;
  }
  if (windowEntry.window.decided.includes(actorId)) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: 'パス失敗: 既に決定済みです' });
    return;
  }
  windowEntry.window.decided.push(actorId);
  const actor = newState.actors[actorId];
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: 'system',
    text: `${actor ? actor.name : actorId} がパスしました`,
  });
  await checkAndCloseWindow(newState, events);
}

function handleKpResolveIntent(newState, events, intent) {
  const entry = newState.stack.find((s) => s.id === intent.entryId);
  if (!entry) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `KP裁定失敗: エントリが見つかりません(${intent.entryId})`,
    });
    return;
  }
  entry.status = 'resolved';
  newState.stack = newState.stack.filter((s) => s !== entry);
  newState.log.push({ t: iso(), kind: 'gm', from: 'KP', text: `[KP裁定] ${intent.resultText}` });
  events.push({ ev: 'kp.resolve', entryId: entry.id });
}

function handleRoundNextIntent(newState, events) {
  newState.round.number += 1;
  const n = newState.round.number;
  Object.values(newState.actors).forEach((a) => {
    ensureBookkeeping(a);
    a.hasActed = false;
    a.roundStartPos = { x: a.pos.x, y: a.pos.y }; // §9.2: 今ラウンドの移動距離判定の起点を更新
    a.movUsedThisRound = 0; // §9.12.3(2026-09-27追補): 移動UIのMOV消費量をラウンド開始時にリセット
    if (a.resist.lockedRounds > 0) {
      a.resist.lockedRounds -= 1;
      if (a.resist.lockedRounds === 0) {
        newState.log.push({ t: iso(), kind: 'system', from: 'system', text: `${a.name} の詠唱不能が解除されました` });
      }
    }
    // §9.12.1(2026-09-27): 状態の自動tick。registry.statuses[id]にonRoundStart/onRoundEndが定義されていれば
    // (既存effect語彙を流用)自動発火する。未定義の状態は従来通り表示のみ(何もしない)。
    (a.statuses || []).forEach((s) => {
      const def = newState.registry.statuses && newState.registry.statuses[s.id];
      if (def && Array.isArray(def.onRoundStart) && def.onRoundStart.length) {
        const vc = { newState, events, casterId: a.id, targets: [a.id], vars: {}, spellId: `status:${s.id}` };
        runEffectSteps(vc, def.onRoundStart);
        newState.log.push({
          t: iso(),
          kind: 'system',
          from: 'trigger',
          text: `${a.name} の状態[${s.id}]が発火(onRoundStart)`,
        });
      }
    });
    a.statuses = a.statuses.filter((s) => {
      if (s.remainingRounds === null || s.remainingRounds === undefined) return true;
      s.remainingRounds -= 1;
      if (s.remainingRounds <= 0) {
        newState.log.push({
          t: iso(),
          kind: 'system',
          from: 'system',
          text: `${a.name} の状態 [${s.id}] が失効しました`,
        });
        return false;
      }
      return true;
    });
    // §9.12.1: 瀕死状態は毎ラウンドCON×5を自動判定。失敗時は死亡確定を自動では行わず、
    // autoDeath(既定off)がoffの間は/KP裁定(kind:"deathConfirm")のスタックエントリへ委ねる(不可逆操作のため)。
    if (
      newState.config.combat.autoApply &&
      hasStatus(a, '瀕死') &&
      a.stats.hp <= newState.config.combat.dyingThreshold
    ) {
      const con = a.stats.con || 0,
        target = con * 5,
        roll = rollPercentile();
      const success = roll <= target;
      newState.log.push({
        t: iso(),
        kind: 'roll',
        from: '自動判定',
        text: `${a.name} は瀕死状態: 毎ラウンドのCON×5判定[${target}] → 1d100=${roll} … ${success ? '成功' : '失敗'}`,
      });
      if (!success) {
        if (newState.config.combat.autoDeath) {
          a.statuses.push({ id: '死亡', stacks: 1, remainingRounds: null });
          newState.log.push({
            t: iso(),
            kind: 'error',
            from: 'system',
            text: `${a.name} は死亡した(autoDeath設定により自動確定)`,
          });
          events.push({ ev: 'status.apply', target: a.id, id: '死亡', stacks: 1 }); // §9.12.7(2026-09-27追補)
        } else {
          const entryId = uid('death');
          newState.stack.push({ id: entryId, kind: 'deathConfirm', actorId: a.id, status: 'awaiting_kp' });
          newState.log.push({
            t: iso(),
            kind: 'error',
            from: 'system',
            text: `${a.name} の瀕死判定に失敗。死亡確定はKP判断が必要です(/KP裁定 ${entryId} <結果テキスト>)`,
          });
        }
      }
    }
    const remainingTriggers = [];
    (a.triggers || []).forEach((trig) => {
      if (trig.on === 'roundStart') {
        const vc = { newState, events, casterId: a.id, targets: [a.id], vars: {}, spellId: trig.sourceSpellId };
        runEffectSteps(vc, trig.do || []);
        newState.log.push({
          t: iso(),
          kind: 'system',
          from: 'trigger',
          text: `${a.name} のトリガー[${trig.sourceSpellId}]が発火(roundStart)`,
        });
        if (trig.remainingRounds !== null && trig.remainingRounds !== undefined) {
          trig.remainingRounds -= 1;
          if (trig.remainingRounds > 0) remainingTriggers.push(trig);
        } else {
          remainingTriggers.push(trig);
        }
      } else {
        remainingTriggers.push(trig);
      }
    });
    a.triggers = remainingTriggers;
  });
  newState.log.push({ t: iso(), kind: 'system', from: 'system', text: `ラウンドを ${n} に更新` });
}

// ---- §11(M1「迷わず1戦闘」2026-09-28追加): 手番管理 ----
// state.round.order/activeIndexを実際に使う新規純粋関数群。v1は凍結中(バグ修正のみ)のため、
// この一群はnepheria-axe側のnepheria-engine.jsにのみ追加し、v1(nepheria-vtt/index.html)へは
// 書き戻さない(CLAUDE.md「エンジンはv1の<script>本文そのまま(書き直し禁止)」は既存ロジックの
// 改変を禁じる趣旨であり、v1に存在しない新規ロジックの追加までは想定していなかったため、
// この例外をnepheria-axe/CLAUDE.mdに一文追記して明確化済み)。
// 既存のラウンド単位の仕組み(handleRoundNextIntent。状態tick・hasActedリセット等)はそのまま
// 再利用し、その上に「誰の手番か」を管理する層を足す(ロジックの重複実装を避ける)。
// 既知の制約: 戦闘中(round.phase==="combat")に旧来の"roundNext"intentを直接呼ぶと、
// round.activeIndexと噛み合わなくなる(M1のUIからは呼ばない想定。KPが手動で両方式を併用しない前提)。

/** 気絶・死亡は行動不能として自動スキップする(design doc §11.3「行動不能([気絶]等)」)。
 *  瀕死は「行動不能」と明記されていないため対象に含めない(未確定のルール拡張をしないため)。 */
function isIncapacitatedForTurn(actor) {
  return hasStatus(actor, '気絶') || hasStatus(actor, '死亡');
}

/**
 * order(参加者ID配列)の中から、fromIndexの次で「行動可能」な参加者のインデックスを探す。
 * 一周しても見つからなければ-1。skipSurprised指定時は、ラウンド1に限りskipFirstRoundの
 * 参加者(design doc §11.1の奇襲フラグ)も飛ばす。
 */
function findNextActiveIndex(newState, fromIndex, opt) {
  const order = newState.round.order;
  if (!order || order.length === 0) return -1;
  const total = order.length;
  for (let step = 1; step <= total; step++) {
    const idx = (fromIndex + step) % total;
    const actorId = order[idx];
    const a = newState.actors[actorId];
    if (!a) continue; // 参加者が削除済み等
    if (opt && opt.skipSurprised && a.combat && a.combat.skipFirstRound && newState.round.number === 1) continue;
    // §11(M1手順9-9追加)。増援として途中参加した参加者は、参加したそのラウンドは行動せず
    // 次のラウンドから参加する(design doc §11.11「増援(DEX順の位置へ挿入)」。安全側の判断:
    // 既存のskipFirstRoundは「絶対ラウンド1」固定のため、途中参加ラウンドに転用できない)。
    if (a.combat && a.combat.pendingReinforcement) continue;
    if (isIncapacitatedForTurn(a)) continue;
    return idx;
  }
  return -1;
}

/** §11(M1手順9-9追加)。ラウンド開始のたび、増援の「今ラウンドは行動しない」猶予を1回だけ消費する。
 *  handleRoundNextIntent(既存ロジック)自体は書き直さず、その呼び出し元(このファイル内の
 *  9-0/9-9で追加した関数)からラウンド開始のたびに呼ぶことで済ませる。 */
function clearPendingReinforcement(newState) {
  Object.values(newState.actors).forEach((a) => {
    if (a.combat && a.combat.pendingReinforcement) a.combat.pendingReinforcement = false;
  });
}

function beginTurnFor(newState, events, index) {
  newState.round.activeIndex = index;
  const actorId = newState.round.order[index];
  const a = newState.actors[actorId];
  if (!a) return;
  newState.log.push({ t: iso(), kind: 'system', from: 'system', text: `${a.name} の手番になりました` });
  events.push({ ev: 'turn.start', actorId, round: newState.round.number });
}

function handleCombatStartIntent(newState, events, intent) {
  if (newState.round.phase === 'combat') {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '戦闘開始: 既に戦闘中です' });
    return;
  }
  const participantIds = (intent.participantIds || []).filter((id) => newState.actors[id]);
  if (participantIds.length === 0) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '戦闘開始: 参加者が選択されていません' });
    return;
  }
  const surpriseSet = new Set(intent.surpriseIds || []);
  participantIds.forEach((id) => {
    const a = newState.actors[id];
    ensureBookkeeping(a);
    a.combat = { skipFirstRound: surpriseSet.has(id) };
  });
  // DEX降順(CoC6のイニシアチブ規則)。同値は渡された順(安定ソート)を維持し、KPが後で並べ替えられるようにする(design doc §11.2)
  const order = participantIds
    .slice()
    .sort((x, y) => (newState.actors[y].stats.dex || 0) - (newState.actors[x].stats.dex || 0));
  newState.round.order = order;
  newState.round.phase = 'combat';
  newState.round.activeIndex = -1;
  newState.round.number = 0; // 直後のhandleRoundNextIntentで1へ進める(既存ロジックの再利用)
  newState.log.push({
    t: iso(),
    kind: 'system',
    from: 'system',
    text: `戦闘開始。参加者: ${order.map((id) => newState.actors[id].name).join('、')}`,
  });
  events.push({ ev: 'combat.start', participantIds: order.slice() });
  handleRoundNextIntent(newState, events); // ラウンド1開始の既存ブックキーピングを再利用(状態tick・hasActedリセット等)
  events.push({ ev: 'round.start', round: newState.round.number });
  const firstIdx = findNextActiveIndex(newState, -1, { skipSurprised: true });
  if (firstIdx === -1) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '戦闘開始: 行動可能な参加者がいません' });
    return;
  }
  beginTurnFor(newState, events, firstIdx);
}

function handleTurnEndIntent(newState, events, intent) {
  if (newState.round.phase !== 'combat' || newState.round.activeIndex < 0) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: 'ターン終了: 現在戦闘中ではありません' });
    return;
  }
  const currentActorId = newState.round.order[newState.round.activeIndex];
  if (!intent.forced && intent.actorId && intent.actorId !== currentActorId) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: 'ターン終了: 現在の手番のキャラクターと一致しません',
    });
    return;
  }
  events.push({ ev: 'turn.end', actorId: currentActorId, round: newState.round.number });

  let nextIdx = findNextActiveIndex(newState, newState.round.activeIndex, { skipSurprised: true });
  // 見つからない、または手前(以下)のインデックスへ戻った場合はラウンドを一周したということなので次のラウンドへ
  if (nextIdx === -1 || nextIdx <= newState.round.activeIndex) {
    handleRoundNextIntent(newState, events); // 既存のラウンド進行ロジックを再利用
    clearPendingReinforcement(newState); // §11(M1手順9-9追加)。新ラウンドから増援も行動可能にする
    events.push({ ev: 'round.start', round: newState.round.number });
    nextIdx = findNextActiveIndex(newState, -1, { skipSurprised: true });
  }
  if (nextIdx === -1) {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '次のラウンド: 行動可能な参加者がいません' });
    newState.round.activeIndex = -1;
    return;
  }
  beginTurnFor(newState, events, nextIdx);
}

function handleCombatEndIntent(newState, events, intent) {
  newState.round.phase = 'idle';
  newState.round.order = [];
  newState.round.activeIndex = -1;
  newState.log.push({ t: iso(), kind: 'system', from: 'system', text: '戦闘終了' });
  events.push({ ev: 'combat.end' });
}

/**
 * §11(M1手順9-9追加)。design doc §11.11「手番順の編集: 参加者の途中追加(増援、DEX順の位置へ
 * 挿入)」。呼び出し元(サービス層)が事前に`newState.actors[intent.actorId]`を用意しておく
 * (`startCombat`と同じ役割分担: アクター組み立てはエンジンの外、DEX順の計算と手番管理だけが
 * エンジンの仕事)。挿入した参加者は`pendingReinforcement`を立て、参加したラウンドの残りは
 * 行動できない(次のラウンドから通常参加。`findNextActiveIndex`/`clearPendingReinforcement`参照)。
 */
function handleReinforceIntent(newState, events, intent) {
  const actorId = intent.actorId;
  const actor = newState.actors[actorId];
  if (!actor) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `増援失敗: アクターが見つかりません(${actorId})`,
    });
    return;
  }
  if (newState.round.phase !== 'combat') {
    newState.log.push({ t: iso(), kind: 'error', from: 'system', text: '増援失敗: 現在戦闘中ではありません' });
    return;
  }
  if (newState.round.order.includes(actorId)) {
    newState.log.push({
      t: iso(),
      kind: 'error',
      from: 'system',
      text: `増援失敗: ${actor.name} は既に戦闘に参加しています`,
    });
    return;
  }
  ensureBookkeeping(actor);
  actor.combat = actor.combat || {};
  actor.combat.pendingReinforcement = true;

  const order = newState.round.order;
  let insertAt = order.length;
  for (let i = 0; i < order.length; i++) {
    const other = newState.actors[order[i]];
    if (other && (other.stats.dex || 0) < (actor.stats.dex || 0)) {
      insertAt = i;
      break;
    }
  }
  order.splice(insertAt, 0, actorId);
  // 挿入位置が現在の手番以前(同着含む)なら、activeIndexを1つ後ろへずらして「今の手番の人」の
  // 参照先がズレないようにする(配列への挿入で後続の実体位置が1つ後ろへ動くため)。
  if (newState.round.activeIndex >= insertAt) newState.round.activeIndex += 1;

  newState.log.push({
    t: iso(),
    kind: 'system',
    from: 'system',
    text: `${actor.name} が増援として参戦しました(次ラウンドから行動可能)`,
  });
  events.push({ ev: 'reinforce', actorId, insertAt });
}

async function resolve(state, intent) {
  const newState = structuredCloneState(state);
  const events = [];
  Object.values(newState.actors).forEach(ensureBookkeeping);
  switch (intent.type) {
    case 'cast':
    case 'respond':
      await handleCastIntent(newState, events, intent);
      break;
    case 'attack':
      handleAttackIntent(newState, events, intent);
      break;
    case 'defend':
      handleDefendIntent(newState, events, intent);
      break;
    case 'pass':
      await handlePassIntent(newState, events, intent);
      break;
    case 'forceResolveStack':
      if (newState.stack[0] && newState.stack[0].window) newState.stack[0].window.state = 'closed';
      await resolveEntireStack(newState, events);
      break;
    case 'kpResolve':
      handleKpResolveIntent(newState, events, intent);
      break;
    case 'setAutoPass': {
      // §9.12.2(2026-09-27): PL画面からの自動パス設定切替
      const a = newState.actors[intent.actorId];
      if (a) {
        a.autoPassMode = intent.always ? 'always' : 'noOptions';
        newState.log.push({
          t: iso(),
          kind: 'system',
          from: 'system',
          text: `${a.name} の自動パス設定: ${intent.always ? '常に自動パス' : '応答手段なし時のみ自動パス'}`,
        });
      }
      break;
    }
    case 'roundNext':
      handleRoundNextIntent(newState, events);
      break;
    case 'combatStart': // §11(M1「迷わず1戦闘」2026-09-28追加)
      handleCombatStartIntent(newState, events, intent);
      break;
    case 'turnEnd': // §11(M1「迷わず1戦闘」2026-09-28追加)
      handleTurnEndIntent(newState, events, intent);
      break;
    case 'combatEnd': // §11(M1「迷わず1戦闘」2026-09-28追加)
      handleCombatEndIntent(newState, events, intent);
      break;
    case 'reinforce': // §11(M1手順9-9追加)
      handleReinforceIntent(newState, events, intent);
      break;
    case 'moveConfirm': // §9.12.3(2026-09-27追補): 移動UI(自動経路探索)からの移動確定
      handleMoveConfirmIntent(newState, events, intent);
      break;
    case 'chat': {
      // §8-A: 発言者切替(色つき)+チャットタブ(メイン/雑談/密談)対応。
      // §8-B: BCDiceコマンドの結果はkind:"roll"+secretRollでvisibility制限をかけて渡ってくる。
      // whisper指定時はvisibilityへ発言者自身も含める(自分の発言が自分に見えなくなる事故を防ぐ)。
      const speaker = newState.actors[intent.actorId];
      const from = speaker ? speaker.name : 'KP';
      // §2-3(2026-09-05): "@ラベル"差分切替。text空("@ラベル"単独送信)なら無言で切替のみ、ログには残さない。
      if (speaker && intent.spriteDiff !== undefined) {
        speaker.currentDiff = intent.spriteDiff || null;
      }
      if (!intent.text || !intent.text.trim()) break;
      const entry = {
        t: iso(),
        kind: intent.kind || 'chat',
        from,
        text: intent.text,
        channel: intent.channel || 'main',
      };
      if (speaker && speaker.color) entry.color = speaker.color;
      if (intent.whisperTargetId) {
        entry.visibility = [intent.whisperTargetId].concat(intent.actorId ? [intent.actorId] : []);
      } else if (intent.secretRoll) {
        entry.visibility = intent.actorId ? [intent.actorId] : [];
      }
      newState.log.push(entry);
      // §2-2(2026-09-05): カットインのトリガー連動。ロールなら結果ラベル(成功/失敗/クリティカル/ファンブル/部分成功)、
      // 通常発言なら本文そのものと、画像素材の名前が完全一致したら自動再生する(視界フィルタで隠れる発言では発火させない)。
      if (!entry.visibility) {
        const triggerName =
          entry.kind === 'roll' ? (detectRollChip(entry.text || '') || {}).resultLabel : (entry.text || '').trim();
        if (triggerName) {
          const cutinAsset = Object.values(newState.assets || {}).find(
            (a) => a.type === 'image' && a.name === triggerName
          );
          if (cutinAsset) {
            newState.scene.cutinAssetId = cutinAsset.id;
            newState.scene.cutinNonce = (newState.scene.cutinNonce || 0) + 1;
          }
        }
        // §2-3(2026-09-05): 発言時に立ち絵を画面端へ表示(発言者の現在の差分。無ければ既定=差分無し)
        if (speaker) {
          newState.spriteStage = newState.spriteStage || {};
          const prevNonce = (newState.spriteStage.display && newState.spriteStage.display.nonce) || 0;
          newState.spriteStage.display = {
            actorId: speaker.id,
            diff: speaker.currentDiff || null,
            nonce: prevNonce + 1,
          };
        }
      }
      break;
    }
    case 'statAdjust': {
      // §1-3(ロードマップ2026-09-05): チャット欄の ":HP-10" ":術式抵抗+2" 形式のショートハンド。
      // 対応先はHP/MP/SAN/術式抵抗の固定ステータスと、数値の自由追加パラメータ(customParams)のみ
      // (任意個の「現在値+最大値」ステータス一覧という本来のCCfolia仕様までは今回実装していない。
      //  design_doc_v0.md §8.6に判断根拠を記録)。
      const a = newState.actors[intent.actorId];
      if (!a) {
        newState.log.push({
          t: iso(),
          kind: 'error',
          from: 'system',
          text: `:${intent.label}${intent.deltaStr}: キャラクターが見つかりません`,
        });
        break;
      }
      const label = intent.label,
        deltaStr = intent.deltaStr,
        lower = label.toLowerCase();
      let before, after, maxVal, targetDesc;
      if (lower === 'hp') {
        before = a.stats.hp;
        maxVal = a.stats.maxHp;
        after = applyDelta(before, maxVal, deltaStr);
        if (after !== null) a.stats.hp = after;
        targetDesc = 'HP';
      } else if (lower === 'mp') {
        before = a.stats.mp;
        maxVal = a.stats.maxMp;
        after = applyDelta(before, maxVal, deltaStr);
        if (after !== null) a.stats.mp = after;
        targetDesc = 'MP';
      } else if (lower === 'san') {
        before = a.stats.san;
        maxVal = a.stats.maxSan;
        after = applyDelta(before, maxVal, deltaStr);
        if (after !== null) a.stats.san = after;
        targetDesc = 'SAN';
      } else if (label === '術式抵抗') {
        before = a.resist.current;
        maxVal = a.resist.cap;
        after = applyDelta(before, maxVal, deltaStr);
        if (after !== null) a.resist.current = after;
        targetDesc = '術式抵抗';
      } else if (
        a.customParams &&
        Object.prototype.hasOwnProperty.call(a.customParams, label) &&
        !isNaN(parseFloat(a.customParams[label]))
      ) {
        before = parseFloat(a.customParams[label]);
        after = applyDelta(before, undefined, deltaStr);
        if (after !== null) a.customParams[label] = String(after);
        targetDesc = label;
      } else {
        newState.log.push({
          t: iso(),
          kind: 'error',
          from: 'system',
          text: `:${label}${deltaStr}: 対象のステータス/パラメータが見つかりません(HP/MP/SAN/術式抵抗、または数値の自由パラメータのみ対応)`,
        });
        break;
      }
      if (after === null) {
        newState.log.push({
          t: iso(),
          kind: 'error',
          from: 'system',
          text: `:${label}${deltaStr}: 数値指定が不正です`,
        });
        break;
      }
      newState.log.push({
        t: iso(),
        kind: 'chat',
        from: a.name,
        channel: 'main',
        color: a.color,
        text: `${targetDesc}: ${before} → ${after}${maxVal !== undefined ? '/' + maxVal : ''} (${deltaStr})`,
      });
      // §9.12.7(2026-09-27追補): HP/MP/SANのショートハンド変更も体感フィードバックの対象にする(術式抵抗・自由パラメータは対象外)
      if (lower === 'hp' || lower === 'mp' || lower === 'san') {
        events.push({ ev: lower + '.direct', target: a.id, amount: after - before });
      }
      break;
    }
    case 'stow': {
      // §1-3(ロードマップ2026-09-05): 駒の「しまう」(盤面↔待機領域)。既存の未使用フィールドActor.visibleを流用。
      const a = newState.actors[intent.actorId];
      if (!a) {
        newState.log.push({ t: iso(), kind: 'error', from: 'system', text: 'stow: キャラクターが見つかりません' });
        break;
      }
      a.visible = !!intent.visible;
      newState.log.push({
        t: iso(),
        kind: 'system',
        from: 'system',
        text: `${a.name} を${a.visible ? '盤面に出しました' : 'しまいました'}`,
      });
      break;
    }
    default:
      newState.log.push({ t: iso(), kind: 'error', from: 'system', text: `未知のintent: ${intent.type}` });
  }
  return { newState, events };
}

/* ============================================================
   VISIBILITY — 視界フィルタ(§1.3 権限表 / §1.5 実装メモ)
   projectStateForViewer(state, viewer) -> 射影後のプレーンオブジェクト。
   DOM操作・通信コードは書かない純粋関数。KP/PL(キャラ指定)の視点別に
   見せてよい部分だけを残す。書き込み(操作)可否はここでは扱わない。
   ============================================================ */
function projectStateForViewer(state, viewer) {
  const clone = structuredCloneState(state);
  if (!viewer || viewer.role === 'kp') return clone; // KPは無加工

  const myActorId = viewer.actorId;
  const npcPolicy = (clone.config && clone.config.npcHpVisibility) || 'bar';

  Object.values(clone.actors).forEach((a) => {
    // §1-3(ロードマップ2026-09-05): 駒ごとの「ステータスを非公開にする」フラグ。
    // Actor.hiddenは直後に一律削除されるため、削除前に読み取っておく。
    const forceHidden = !!(a.hidden && a.hidden.statsHidden);
    delete a.hidden; // Actor.hidden(秘匿ステ・メモ)は誰のキャラでも一律非表示
    // §9.9(2026-09-26): castLog/triggersは元々「秘匿ではないが不要なノイズ」として一律削除していたが、
    // 自分のキャラの分だけは checkCastLegality() によるスペルブックのグレーアウト判定(同一R使用済み等)に必要なので残す。
    // 他人のキャラの分は従来通り削除する(ノイズとして不要なため)。
    if (a.id !== myActorId) {
      delete a.castLog;
      delete a.triggers;
    }
    if (forceHidden) {
      a.statsHidden = true;
      a.stats = Object.assign({}, a.stats, { hp: null, mp: null, san: null });
    } else if (a.kind !== 'PC') {
      if (npcPolicy === 'hidden') {
        a.stats = Object.assign({}, a.stats, { hp: null, mp: null });
      } else if (npcPolicy === 'bar') {
        a.hpRatio = a.stats.maxHp > 0 ? a.stats.hp / a.stats.maxHp : 0;
        a.stats = Object.assign({}, a.stats, { hp: null });
      }
      // npcPolicy === "number" のときは実数のまま(加工しない)
    }
  });

  const handouts = {};
  Object.entries(clone.handouts || {}).forEach(([id, h]) => {
    if (h && Array.isArray(h.revealedTo) && h.revealedTo.includes(myActorId)) handouts[id] = h;
  });
  clone.handouts = handouts;

  // §2-5(2026-09-06): スクリーンパネルの「非表示(KPのみ見える)」フラグ
  const screenPanels = {};
  Object.entries(clone.screenPanels || {}).forEach(([id, p]) => {
    if (p && !p.hiddenFromPl) screenPanels[id] = p;
  });
  clone.screenPanels = screenPanels;

  const reveals = {};
  Object.entries(clone.reveals || {}).forEach(([id, v]) => {
    if (v) reveals[id] = v;
  });
  clone.reveals = reveals;

  clone.log = (clone.log || []).filter((entry) => {
    const vis = entry.visibility || 'all';
    if (vis === 'all') return true;
    if (vis === 'kp') return false;
    if (Array.isArray(vis)) return vis.includes(myActorId);
    return false;
  });

  // 詠唱スタック: secretフラグ付きエントリ(将来の秘匿呪文用の先取り実装)は
  // 詠唱者・対象以外には見せない。現行データにsecretは無いため実質素通り。
  clone.stack = (clone.stack || []).filter((e) => {
    if (!e.secret) return true;
    return e.casterId === myActorId || (e.targets || []).includes(myActorId);
  });

  return clone;
}

/* ============================================================
   NET(第二段) — WebRTC DataChannelによるホスト権威・星型同期。
   §4.1の方針: PeerJSは未導入(夜間自走のためユーザー相談を経ていない)。
   ゼロ依存の手動コード交換モードのみを実装する。
   プロトコル(下記の netBuildJoinMessages 等)はRTCPeerConnectionに
   依存しない純粋寄り関数として書き、自動テストはこれらを直接呼ぶ。
   実トランスポート配線はその外側の薄い層に留める。
   ============================================================ */
const RTC_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

/* ---- プロトコル(純粋寄り。DataChannel等を直接触らない) ---- */
function netBuildJoinMessages(hostState, conn) {
  // conn: { actorId, name, toolVersion, dataVersion }
  const versionMismatch = !!conn.toolVersion && conn.toolVersion !== hostState.meta.toolVersion;
  return [
    {
      type: 'hello_ack',
      toolVersion: hostState.meta.toolVersion,
      dataVersion: hostState.meta.dataVersion,
      versionMismatch,
      actorId: conn.actorId,
    },
    {
      type: 'registry',
      spells: hostState.registry.spells,
      statuses: hostState.registry.statuses,
      macros: hostState.registry.macros,
      creatures: hostState.registry.creatures,
    },
    { type: 'stateSync', state: projectStateForViewer(hostState, { role: 'pl', actorId: conn.actorId }) },
  ];
}
async function netHostApplyIntent(hostState, conn, msg) {
  const intent = Object.assign({}, msg.intent);
  // なりすまし防止(§4.1): PL申告のcasterId/actorIdは信用せず、接続に固定したactorIdへ強制上書きする
  if ('casterId' in intent) intent.casterId = conn.actorId;
  if ('actorId' in intent) intent.actorId = conn.actorId;
  return await resolve(hostState, intent);
}
function netBroadcastStateSync(newState, conns) {
  // conns: [{connId, actorId}, ...] -> [{connId, msg}, ...]
  return conns.map((c) => ({
    connId: c.connId,
    msg: { type: 'stateSync', state: projectStateForViewer(newState, { role: 'pl', actorId: c.actorId }) },
  }));
}
function netClientApplyMessage(view, msg) {
  // view: { registry, state, versionMismatch, warnings }
  const next = Object.assign({ warnings: [] }, view);
  switch (msg.type) {
    case 'hello_ack':
      next.versionMismatch = !!msg.versionMismatch;
      next.actorId = msg.actorId;
      if (msg.versionMismatch)
        next.warnings = (view.warnings || []).concat([`本体バージョン不一致(host: ${msg.toolVersion})`]);
      break;
    case 'registry':
      next.registry = {
        spells: msg.spells || {},
        statuses: msg.statuses || {},
        macros: msg.macros || {},
        creatures: msg.creatures || {},
      };
      break;
    case 'stateSync':
      next.state = msg.state;
      break;
    case 'event':
      next.lastEvents = msg.events;
      break;
    case 'whisper':
      if (next.state) {
        next.state = Object.assign({}, next.state, {
          log: (next.state.log || []).concat([{ t: iso(), kind: 'gm', from: msg.from || 'KP', text: msg.text }]),
        });
      }
      break;
  }
  return next;
}

/* ---- トランスポート配線(実RTCPeerConnection。手動コード交換モード) ---- */
let netHost = { connections: new Map() }; // connId -> {connId, pc, dc, actorId, name, toolVersion, dataVersion}
let netClient = {
  pc: null,
  dc: null,
  view: { registry: { spells: {}, statuses: {}, macros: {}, creatures: {} }, state: null, warnings: [] },
};
let netClientMode = false; // trueなら「実ネットワーク越しのPLクライアント」。falseなら手順8のローカルデバッグPL視点。

function netEncodeCode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}
function netDecodeCode(code) {
  return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
}

async function netWaitIceGatheringComplete(pc, timeoutMs) {
  if (pc.iceGatheringState === 'complete') return;
  await new Promise((resolve) => {
    const t = setTimeout(resolve, timeoutMs || 4000); // 集まった分だけで進める(手動交換の実用性優先。安全側のタイムアウト打ち切り)
    pc.addEventListener('icegatheringstatechange', function onchg() {
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(t);
        pc.removeEventListener('icegatheringstatechange', onchg);
        resolve();
      }
    });
  });
}

function netBroadcastToAll(newState) {
  const conns = Array.from(netHost.connections.values()).map((c) => ({ connId: c.connId, actorId: c.actorId }));
  netBroadcastStateSync(newState, conns).forEach(({ connId, msg }) => {
    const c = netHost.connections.get(connId);
    if (c && c.dc && c.dc.readyState === 'open') c.dc.send(JSON.stringify(msg));
  });
}
/* ---- §9.13.4(2026-09-27追補): リモートPLへの体感フィードバック ----
   stateSyncと同じ可視性判定(projectStateForViewerが使っているものと同じルール)を、events[]にも適用してから
   接続中の全PLへ{type:"event", events:[...]}として追加送信する。stateSync自体はKP/PLで完全に別内容を
   個別配信しているが、hp/mp/sanの秘匿ルール自体は「誰が見るか」ではなく「そのアクターがどう設定されているか」
   だけで決まる一律ルールなので(projectStateForViewer参照)、events側もPL全員へ同じ1回のフィルタ結果を配信すればよい。 */
function isStatVisibleToPl(state, actorId, stat) {
  const a = state.actors[actorId];
  if (!a) return false;
  if (a.hidden && a.hidden.statsHidden) return false; // 駒ごとの「ステータスを非公開にする」
  if (stat === 'san') return true; // SANはnpcHpVisibilityの対象外(既存のprojectStateForViewerと同じ前提)
  if (a.kind !== 'PC') {
    const npcPolicy = (state.config && state.config.npcHpVisibility) || 'bar';
    if (stat === 'hp' && (npcPolicy === 'hidden' || npcPolicy === 'bar')) return false;
    if (stat === 'mp' && npcPolicy === 'hidden') return false;
  }
  return true;
}
function filterEventsForRemoteFeedback(events, state) {
  return (events || []).filter((ev) => {
    if (ev.ev === 'damage.apply' || ev.ev === 'heal.apply' || ev.ev === 'hp.direct')
      return isStatVisibleToPl(state, ev.target, 'hp');
    if (ev.ev === 'attack.damage.apply') return isStatVisibleToPl(state, ev.targetId, 'hp');
    if (ev.ev === 'mp.apply' || ev.ev === 'mp.direct') return isStatVisibleToPl(state, ev.target, 'mp');
    if (ev.ev === 'san.direct') return isStatVisibleToPl(state, ev.target, 'san');
    return true; // status/resist/lock/counter等は現行のstateSync自体がこれ以上秘匿していないため素通し
  });
}
function netBroadcastEvents(events, srcState) {
  if (!events || !events.length) return;
  if (typeof netHost === 'undefined' || netHost.connections.size === 0) return;
  const filtered = filterEventsForRemoteFeedback(events, srcState);
  if (!filtered.length) return;
  const msg = JSON.stringify({ type: 'event', events: filtered });
  netHost.connections.forEach((c) => {
    if (c.dc && c.dc.readyState === 'open') c.dc.send(msg);
  });
}

function refreshNetHostConnsIfVisible() {
  if (typeof document !== 'undefined' && document.getElementById('net-host-conns')) renderNetHostConns();
}
function wireHostDataChannel(conn) {
  conn.dc.addEventListener('open', () => {
    logSystem(`[NET] PL接続オープン: ${conn.name || '?'}(${conn.actorId})`);
    refreshNetHostConnsIfVisible();
    render();
  });
  conn.dc.addEventListener('close', () => {
    logSystem(`[NET] PL接続クローズ: ${conn.name || '?'}`);
    netHost.connections.delete(conn.connId);
    refreshNetHostConnsIfVisible();
    render();
  });
  conn.dc.addEventListener('message', async (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (msg.type === 'hello') {
      conn.name = msg.name;
      conn.toolVersion = msg.toolVersion;
      conn.dataVersion = msg.dataVersion;
      netBuildJoinMessages(state, conn).forEach((m) => conn.dc.send(JSON.stringify(m)));
      logSystem(
        `[NET] ${conn.name} が入室しました(担当キャラ: ${(state.actors[conn.actorId] || {}).name || conn.actorId})`
      );
      refreshNetHostConnsIfVisible();
      persist();
      render();
    } else if (msg.type === 'intent') {
      const result = await netHostApplyIntent(state, conn, msg);
      state = result.newState;
      persist(); // persist()が接続済み全PLへのbroadcastも兼ねる(上記コメント参照)
      render();
      processFeedbackEvents(result.events, state); // §9.13.4(2026-09-27追補): KP画面自身にも体感フィードバックを出す
      netBroadcastEvents(result.events, state); // §9.13.4: 接続中の全PLへも配信する(実行者本人を含む)
    }
  });
}

async function netHostCreateInvite(actorId, displayName) {
  const connId = uid('conn');
  const pc = new RTCPeerConnection(RTC_CONFIG);
  const dc = pc.createDataChannel('nepheria');
  const conn = { connId, pc, dc, actorId, name: displayName || null, toolVersion: null, dataVersion: null };
  wireHostDataChannel(conn);
  netHost.connections.set(connId, conn);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  await netWaitIceGatheringComplete(pc, 5000);
  return { connId, code: netEncodeCode({ sdp: pc.localDescription }) };
}
async function netHostCompleteInvite(connId, answerCode) {
  const conn = netHost.connections.get(connId);
  if (!conn) throw new Error('接続が見つかりません: ' + connId);
  const { sdp } = netDecodeCode(answerCode);
  await conn.pc.setRemoteDescription(sdp);
}

function wireClientDataChannel(name) {
  netClient.dc.addEventListener('open', () => {
    netClient.dc.send(
      JSON.stringify({ type: 'hello', toolVersion: state.meta.toolVersion, dataVersion: state.meta.dataVersion, name })
    );
  });
  netClient.dc.addEventListener('message', (ev) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    netClient.view = netClientApplyMessage(netClient.view, msg);
    if (msg.type === 'hello_ack') {
      viewMode = { role: 'pl', actorId: netClient.view.actorId };
      if (netClient.view.versionMismatch) {
        logSystem('[NET] 警告: 本体バージョンがホストと一致していません。動作が不安定になる可能性があります。');
      }
    }
    if (msg.type === 'registry') {
      state.registry = netClient.view.registry;
    }
    render();
    // §9.13.4(2026-09-27追補): ホストからのevent配信を体感フィードバックとして発火する。
    // stateSyncは常にevent配信より先に送られる(persist()→netBroadcastEvents()の順で呼んでいるため)ので、
    // ここで参照するnetClient.view.stateは既に最新化されている。ロード/再接続時はstateSyncのみでevent配信は
    // 含まれないため、過去イベントが再生される心配はない。
    if (msg.type === 'event' && netClient.view.state) processFeedbackEvents(msg.events, netClient.view.state);
  });
  netClient.dc.addEventListener('close', () => {
    logSystem('[NET] ホストとの接続が切れました');
    render();
  });
}
async function netClientAcceptInvite(inviteCode) {
  const { sdp } = netDecodeCode(inviteCode);
  const pc = new RTCPeerConnection(RTC_CONFIG);
  netClient.pc = pc;
  const dcPromise = new Promise((resolve) => {
    pc.addEventListener('datachannel', (ev) => {
      netClient.dc = ev.channel;
      resolve();
    });
  });
  await pc.setRemoteDescription(sdp);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  await netWaitIceGatheringComplete(pc, 5000);
  await dcPromise;
  return netEncodeCode({ sdp: pc.localDescription });
}
function netClientFinishJoin(myActorHintName) {
  netClientMode = true;
  wireClientDataChannel(myActorHintName);
}

/* ============================================================
   TERMINAL — コマンドパーサ(神権限系のみ。演出系コマンドは1cで追加)
   ============================================================ */
function findActor(name) {
  name = (name || '').trim();
  if (!name) return null;
  const all = Object.values(state.actors);
  let hit = all.find((a) => a.name === name);
  if (hit) return hit;
  const partial = all.filter((a) => a.name.includes(name) || name.includes(a.name));
  if (partial.length === 1) return partial[0];
  return null;
}

function applyDelta(current, max, deltaStr) {
  deltaStr = deltaStr.trim();
  let val;
  if (/^=/.test(deltaStr)) val = parseInt(deltaStr.slice(1), 10);
  else if (/^[+-]/.test(deltaStr)) val = current + parseInt(deltaStr, 10);
  else val = parseInt(deltaStr, 10);
  if (isNaN(val)) return null;
  if (typeof max === 'number') {
    val = Math.max(0, Math.min(max, val));
  } else {
    val = Math.max(0, val);
  }
  return val;
}

function cmdHP(args) {
  const [name, delta] = args;
  const a = findActor(name);
  if (!a) return logError('/HP: キャラクターが見つかりません: ' + name);
  const before = a.stats.hp;
  const v = applyDelta(a.stats.hp, a.stats.maxHp, delta || '');
  if (v === null) return logError('/HP: 数値指定が不正です: ' + delta);
  a.stats.hp = v;
  logSystem(`${a.name} の HP を ${v}/${a.stats.maxHp} に変更`);
  persist();
  render();
  processFeedbackEvents([{ ev: 'hp.direct', target: a.id, amount: v - before }], state); // §9.12.7(2026-09-27追補): resolve()を経由しない直接コマンドの体感フィードバック
  netBroadcastEvents([{ ev: 'hp.direct', target: a.id, amount: v - before }], state); // §9.13.4(2026-09-27追補)
}
function cmdMP(args) {
  const [name, delta] = args;
  const a = findActor(name);
  if (!a) return logError('/MP: キャラクターが見つかりません: ' + name);
  const before = a.stats.mp;
  const v = applyDelta(a.stats.mp, a.stats.maxMp, delta || '');
  if (v === null) return logError('/MP: 数値指定が不正です: ' + delta);
  a.stats.mp = v;
  logSystem(`${a.name} の MP を ${v}/${a.stats.maxMp} に変更`);
  persist();
  render();
  processFeedbackEvents([{ ev: 'mp.direct', target: a.id, amount: v - before }], state); // §9.12.7(2026-09-27追補)
  netBroadcastEvents([{ ev: 'mp.direct', target: a.id, amount: v - before }], state); // §9.13.4(2026-09-27追補)
}
function cmdSAN(args) {
  const [name, delta] = args;
  const a = findActor(name);
  if (!a) return logError('/SAN: キャラクターが見つかりません: ' + name);
  const before = a.stats.san;
  const v = applyDelta(a.stats.san, a.stats.maxSan, delta || '');
  if (v === null) return logError('/SAN: 数値指定が不正です: ' + delta);
  a.stats.san = v;
  logSystem(`${a.name} の SAN を ${v}/${a.stats.maxSan} に変更`);
  persist();
  render();
  processFeedbackEvents([{ ev: 'san.direct', target: a.id, amount: v - before }], state); // §9.12.7(2026-09-27追補)
  netBroadcastEvents([{ ev: 'san.direct', target: a.id, amount: v - before }], state); // §9.13.4(2026-09-27追補)
}
function cmdStatus(args) {
  const [name, label, deltaStr] = args;
  const a = findActor(name);
  if (!a) return logError('/状態: キャラクターが見つかりません: ' + name);
  if (!label) return logError('/状態: 状態名を指定してください');
  const delta = parseInt(deltaStr, 10);
  if (isNaN(delta)) return logError('/状態: 増減値が不正です: ' + deltaStr);
  let entry = a.statuses.find((s) => s.id === label);
  if (!entry) {
    entry = { id: label, stacks: 0, remainingRounds: null }; // 持続減衰は1bで実装
    a.statuses.push(entry);
  }
  entry.stacks += delta;
  if (entry.stacks <= 0) {
    a.statuses = a.statuses.filter((s) => s !== entry);
    logSystem(`${a.name} の状態 [${label}] を解除`);
  } else {
    logSystem(`${a.name} の状態 [${label}] を ${entry.stacks} 積みに変更`);
  }
  persist();
  render();
}
function cmdResist(args) {
  const [name, deltaStr] = args;
  const a = findActor(name);
  if (!a) return logError('/抵抗: キャラクターが見つかりません: ' + name);
  a.resist.cap = Math.floor((a.stats.pow || 0) / 3);
  if (deltaStr === 'reset') {
    a.resist.current = 0;
  } else {
    const v = applyDelta(a.resist.current, a.resist.cap, deltaStr || '');
    if (v === null) return logError('/抵抗: 指定が不正です: ' + deltaStr);
    a.resist.current = v;
  }
  logSystem(`${a.name} の術式抵抗を ${a.resist.current}/${a.resist.cap} に変更`);
  persist();
  render();
}
async function cmdRound(args) {
  const [sub, n] = args;
  if (sub === 'next') {
    // エンジンのroundNext intentを経由(状態減衰・詠唱不能残り・roundStartトリガーを処理)
    const result = await resolve(state, { type: 'roundNext' });
    state = result.newState;
    processFeedbackEvents(result.events, state); // §9.12.7(2026-09-27追補): 毎ラウンドの状態自動tick・瀕死自動判定等の体感フィードバック
    netBroadcastEvents(result.events, state); // §9.13.4(2026-09-27追補)
  } else if (sub === 'set') {
    const v = parseInt(n, 10);
    if (isNaN(v)) return logError('/ラウンド set: 数値を指定してください');
    state.round.number = v;
    logSystem(`ラウンドを ${v} に手動設定しました(ラウンドフックは実行されません)`);
  } else {
    return logError('/ラウンド: next か set N を指定してください');
  }
  persist();
  render();
}
function cmdLogText(args, raw) {
  const text = raw.replace(/^\/ログ\s*/, '');
  if (!text) return logError('/ログ: 本文がありません');
  pushLog({ kind: 'gm', from: 'KP', text });
  persist();
  render();
}
function cmdJudge(args) {
  const [name, ...rest] = args;
  const a = findActor(name);
  if (!a) return logError('/判定: キャラクターが見つかりません: ' + name);
  const spec = rest.join(' ').trim();
  if (!spec) return logError('/判定: 技能名または数値を指定してください');
  let target, label;
  if (/^\d+$/.test(spec)) {
    target = parseInt(spec, 10);
    label = '(直接値)';
  } else {
    if (!(spec in a.skills)) return logError(`/判定: ${a.name} は技能「${spec}」を持っていません`);
    target = a.skills[spec];
    label = spec;
  }
  const roll = rollPercentile();
  const result = classifyJudge(roll, target, state.config.judge);
  pushLog({ kind: 'roll', from: a.name, text: `判定[${label} ${target}] → 1d100=${roll} … ${result}` });
  persist();
  render();
}
function cmdRoll(args) {
  const expr = args.join('');
  const r = rollGeneric(expr);
  if (!r) return logError('/ロール: 式が不正です(例: 2d6+3): ' + args.join(' '));
  const detail = r.rolls.join(',') + (r.mod ? (r.mod > 0 ? `+${r.mod}` : r.mod) : '');
  pushLog({ kind: 'roll', from: 'KP', text: `ロール[${r.formula}] → (${detail}) = ${r.total}` });
  persist();
  render();
}

/* ---- 秘匿系コマンド(手順10)。§1.5の視界フィルタに配信を委ねる薄い実装 ---- */
function cmdSecretJudge(args) {
  const [name, ...rest] = args;
  const a = findActor(name);
  if (!a) return logError('/秘匿判定: キャラクターが見つかりません: ' + name);
  const spec = rest.join(' ').trim();
  if (!spec) return logError('/秘匿判定: 技能名または数値を指定してください');
  let target, label;
  if (/^\d+$/.test(spec)) {
    target = parseInt(spec, 10);
    label = '(直接値)';
  } else {
    if (!(spec in a.skills)) return logError(`/秘匿判定: ${a.name} は技能「${spec}」を持っていません`);
    target = a.skills[spec];
    label = spec;
  }
  const roll = rollPercentile();
  const result = classifyJudge(roll, target, state.config.judge);
  // visibility:[a.id] のみで十分(KPは projectStateForViewer がKP視点を無加工で返すため、
  // フィルタなしで元から見える。本人向けの制限だけをここに書けばよい)。
  pushLog({
    kind: 'roll',
    from: a.name,
    text: `秘匿判定[${label} ${target}] → 1d100=${roll} … ${result}`,
    visibility: [a.id],
    channel: 'whisper',
  });
  persist();
  render();
}
function cmdSecretRoll(args) {
  const [name, ...rest] = args;
  const a = findActor(name);
  if (!a) return logError('/秘匿ロール: キャラクターが見つかりません: ' + name);
  const expr = rest.join('');
  const r = rollGeneric(expr);
  if (!r) return logError('/秘匿ロール: 式が不正です(例: 2d6+3): ' + rest.join(' '));
  const detail = r.rolls.join(',') + (r.mod ? (r.mod > 0 ? `+${r.mod}` : r.mod) : '');
  pushLog({
    kind: 'roll',
    from: a.name,
    text: `秘匿ロール[${r.formula}] → (${detail}) = ${r.total}`,
    visibility: [a.id],
    channel: 'whisper',
  });
  persist();
  render();
}
function cmdWhisper(args) {
  const [name, ...rest] = args;
  const a = findActor(name);
  if (!a) return logError('/ウィスパー: キャラクターが見つかりません: ' + name);
  const text = rest.join(' ');
  if (!text) return logError('/ウィスパー: 本文がありません');
  pushLog({ kind: 'gm', from: 'KP', text, visibility: [a.id], channel: 'whisper' });
  persist();
  render();
}
function cmdRevealToggle(args) {
  const [infoId, sub] = args;
  if (!infoId) return logError('/開示: infoIdを指定してください');
  const value = sub !== 'off';
  state.reveals[infoId] = value;
  // 切替そのものはKP運用メモとして記録。PLには「結果のみ見える」(§1.3)ため通知は出さない(視界フィルタに委ねる)。
  pushLog({
    kind: 'system',
    from: 'system',
    text: `開示フラグ [${infoId}] を ${value ? 'ON' : 'OFF'} にしました`,
    visibility: 'kp',
  });
  persist();
  render();
}
function cmdHandoutCreate(args, raw) {
  const [id] = args;
  if (!id) return logError('/ハンドアウト作成: idを指定してください');
  const rest = raw.replace(/^\/ハンドアウト作成\s*\S+\s*/, '');
  const sep = rest.indexOf('|');
  const title = (sep >= 0 ? rest.slice(0, sep) : rest).trim();
  const body = (sep >= 0 ? rest.slice(sep + 1) : '').trim();
  if (!title) return logError('/ハンドアウト作成: <id> <タイトル>|<本文> の形式で指定してください');
  state.handouts[id] = { title, body, revealedTo: (state.handouts[id] && state.handouts[id].revealedTo) || [] };
  // 登録内容(タイトル等)はKP運用メモとして記録。未開示分をPLに漏らさないためKPのみ表示とする。
  pushLog({ kind: 'system', from: 'system', text: `ハンドアウト[${id}]「${title}」を登録しました`, visibility: 'kp' });
  persist();
  render();
}
function cmdHandoutReveal(args) {
  const [id, targetName] = args;
  if (!id || !targetName) return logError('/ハンドアウト: <id> <相手> を指定してください');
  const h = state.handouts[id];
  if (!h)
    return logError(`/ハンドアウト: id「${id}」のハンドアウトが未登録です(先に /ハンドアウト作成 で登録してください)`);
  const target = findActor(targetName);
  if (!target) return logError('/ハンドアウト: 相手が見つかりません: ' + targetName);
  h.revealedTo = h.revealedTo || [];
  if (!h.revealedTo.includes(target.id)) h.revealedTo.push(target.id);
  // 誰が何を受け取ったかはKP運用メモ。本人には視界フィルタ経由でPLサイドバーの「受信ハンドアウト」に反映される。
  pushLog({
    kind: 'system',
    from: 'system',
    text: `ハンドアウト[${h.title}]を ${target.name} へ開示しました`,
    visibility: 'kp',
  });
  persist();
  render();
}
function cmdScene(args) {
  // §2-1(2026-09-05): /シーン <名前> でシーンプリセットを適用(素材管理モーダルの「適用」ボタンと同じ処理)。
  // ロードマップ原文の要求により /scene も同じ処理へのエイリアスとして受け付ける。
  const name = args.join(' ').trim();
  if (!name) return logError('/シーン: シーン名を指定してください(先に素材管理→シーンプリセットで保存しておく)');
  applyScenePreset(name);
}

/* ---- 呪文エンジン(1b)向けターミナルコマンド ---- */
async function resolveTargetsByName(names, prefix) {
  const ids = [];
  for (const n of names) {
    const a = findActor(n);
    if (!a) throw new Error(`${prefix}: 対象が見つかりません: ${n}`);
    ids.push(a.id);
  }
  return ids;
}
async function cmdCast(args) {
  const [name, spellId, ...rest] = args;
  const caster = findActor(name);
  if (!caster) return logError('/詠唱: キャラクターが見つかりません: ' + name);
  if (!spellId) return logError('/詠唱: 呪文idを指定してください');
  const targetNames = rest.length ? rest : [name];
  let targets;
  try {
    targets = await resolveTargetsByName(targetNames, '/詠唱');
  } catch (e) {
    return logError(e.message);
  }
  const result = await resolve(state, { type: 'cast', casterId: caster.id, spellId, targets });
  state = result.newState;
  persist();
  render();
}
async function cmdRespond(args) {
  const [name, spellId, ...rest] = args;
  const caster = findActor(name);
  if (!caster) return logError('/応答: キャラクターが見つかりません: ' + name);
  if (!spellId) return logError('/応答: 呪文idを指定してください');
  const targetNames = rest.length ? rest : [name];
  let targets;
  try {
    targets = await resolveTargetsByName(targetNames, '/応答');
  } catch (e) {
    return logError(e.message);
  }
  const result = await resolve(state, { type: 'respond', casterId: caster.id, spellId, targets });
  state = result.newState;
  persist();
  render();
}
async function cmdPass(args) {
  const [name] = args;
  const actor = findActor(name);
  if (!actor) return logError('/パス: キャラクターが見つかりません: ' + name);
  const result = await resolve(state, { type: 'pass', actorId: actor.id });
  state = result.newState;
  persist();
  render();
}
/* ---- §9.3 物理戦闘向けターミナルコマンド(2026-09-26) ---- */
function parseAttackOptTokens(tokens) {
  let pierce = 0,
    melee = true;
  tokens.forEach((tok) => {
    const m = /^貫通(\d+)$/.exec(tok);
    if (m) pierce = parseInt(m[1], 10);
    if (tok === '遠隔') melee = false;
  });
  return { pierce, melee };
}
async function cmdAttack(args) {
  const [atkName, tgtName, skill, damageDice, ...rest] = args;
  const attacker = findActor(atkName);
  if (!attacker) return logError('/攻撃: 攻撃者が見つかりません: ' + atkName);
  const target = findActor(tgtName);
  if (!target) return logError('/攻撃: 対象が見つかりません: ' + tgtName);
  if (!skill) return logError('/攻撃: 技能名を指定してください(例: /攻撃 カイン アーク こぶし 1d3 遠隔 貫通2)');
  if (!damageDice) return logError('/攻撃: ダメージダイスを指定してください(例: 1d6+1)');
  const { pierce, melee } = parseAttackOptTokens(rest);
  const result = await resolve(state, {
    type: 'attack',
    attackerId: attacker.id,
    targetId: target.id,
    skill,
    damageDice,
    pierce,
    melee,
  });
  state = result.newState;
  persist();
  render();
}
async function cmdDodge(args) {
  const [name] = args;
  const actor = findActor(name);
  if (!actor) return logError('/回避: キャラクターが見つかりません: ' + name);
  const result = await resolve(state, { type: 'defend', targetId: actor.id, mode: 'dodge' });
  state = result.newState;
  persist();
  render();
}
async function cmdParry(args) {
  const [name, skill] = args;
  const actor = findActor(name);
  if (!actor) return logError('/受け流し: キャラクターが見つかりません: ' + name);
  if (!skill) return logError('/受け流し: 受け流しに使う技能名を指定してください');
  const result = await resolve(state, { type: 'defend', targetId: actor.id, mode: 'parry', skill });
  state = result.newState;
  persist();
  render();
}
async function cmdAcceptDamage(args) {
  const [name] = args;
  const actor = findActor(name);
  if (!actor) return logError('/被弾: キャラクターが見つかりません: ' + name);
  const result = await resolve(state, { type: 'defend', targetId: actor.id, mode: 'accept' });
  state = result.newState;
  persist();
  render();
}
async function cmdStackCmd(args) {
  if (args[0] === 'force') {
    const result = await resolve(state, { type: 'forceResolveStack' });
    state = result.newState;
    persist();
    render();
    return;
  }
  if (!state.stack.length) {
    logSystem('スタックは空です');
    return;
  }
  const lines = state.stack.map((e, i) => {
    const c = state.actors[e.casterId];
    const spell = state.registry.spells[e.spellId];
    const tnames = e.targets.map((id) => (state.actors[id] ? state.actors[id].name : id)).join(',');
    return `[${i}] ${c ? c.name : e.casterId} → ${spell ? spell.name : e.spellId} (対象:${tnames}) status=${e.status}`;
  });
  pushLog({ kind: 'system', from: 'system', text: 'スタック:\n' + lines.join('\n') });
  render();
}
async function cmdKpResolveCmd(args) {
  const [entryId, ...rest] = args;
  const resultText = rest.join(' ');
  if (!entryId) return logError('/KP裁定: エントリIDを指定してください(/スタック で確認)');
  if (!resultText) return logError('/KP裁定: 結果テキストを指定してください');
  const result = await resolve(state, { type: 'kpResolve', entryId, resultText });
  state = result.newState;
  persist();
  render();
}

async function handleCommand(raw) {
  raw = raw.trim();
  if (!raw) return;
  if (viewMode.role === 'pl') {
    await handlePlCommand(raw);
    return;
  }
  if (raw[0] !== '/') {
    pushLog({ kind: 'chat', from: 'KP', text: raw });
    persist();
    render();
    return;
  }
  const parts = raw.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);
  switch (cmd) {
    case '/HP':
      cmdHP(args);
      break;
    case '/MP':
      cmdMP(args);
      break;
    case '/SAN':
      cmdSAN(args);
      break;
    case '/状態':
      cmdStatus(args);
      break;
    case '/抵抗':
      cmdResist(args);
      break;
    case '/ラウンド':
      await cmdRound(args);
      break;
    case '/ログ':
      cmdLogText(args, raw);
      break;
    case '/判定':
      cmdJudge(args);
      break;
    case '/ロール':
      cmdRoll(args);
      break;
    case '/セーブ':
      downloadSave();
      break;
    case '/ロード':
      document.getElementById('fileLoad').click();
      break;
    case '/詠唱':
      await cmdCast(args);
      break;
    case '/応答':
      await cmdRespond(args);
      break;
    case '/パス':
      await cmdPass(args);
      break;
    case '/攻撃':
      await cmdAttack(args);
      break;
    case '/回避':
      await cmdDodge(args);
      break;
    case '/受け流し':
      await cmdParry(args);
      break;
    case '/被弾':
      await cmdAcceptDamage(args);
      break;
    case '/スタック':
      await cmdStackCmd(args);
      break;
    case '/KP裁定':
      await cmdKpResolveCmd(args);
      break;
    case '/秘匿判定':
      cmdSecretJudge(args);
      break;
    case '/秘匿ロール':
      cmdSecretRoll(args);
      break;
    case '/ウィスパー':
      cmdWhisper(args);
      break;
    case '/開示':
      cmdRevealToggle(args);
      break;
    case '/ハンドアウト作成':
      cmdHandoutCreate(args, raw);
      break;
    case '/ハンドアウト':
      cmdHandoutReveal(args);
      break;
    case '/シーン':
    case '/scene':
      cmdScene(args);
      break; // §2-1(2026-09-05)
    default:
      logError('不明なコマンド: ' + cmd);
  }
}

/* ---- PL視点のターミナル(手順8/9)。神権限系コマンドは一切受け付けない(§1.3) ----
   ローカルデバッグPL視点(netClientMode=false)とネットワーク越しのPLクライアント
   (netClientMode=true)を、intentの構築とdispatchPlIntent()への委譲で統一する。
   ネットワーク時はintentをホストへ送るだけで、結果はホストからのstateSync
   再配信で反映される(ここではローカルにresolve()を呼ばない=ホスト権威)。 */
async function dispatchPlIntent(intent) {
  if (netClientMode) {
    if (!netClient.dc || netClient.dc.readyState !== 'open') {
      logError('ホストへ接続されていません');
      return;
    }
    netClient.dc.send(JSON.stringify({ type: 'intent', intent }));
    return;
  }
  const result = await resolve(state, intent);
  state = result.newState;
  persist();
  render();
  processFeedbackEvents(result.events, state); // §9.12.7(2026-09-27追補): PL側の単一intent funnelなので、これで全PL経由の操作をカバーする
  netBroadcastEvents(result.events, state); // §9.13.4(2026-09-27追補): 他の接続済みPLへも配信する
}
function resolveTargetIdsFromState(stateObj, names, prefix) {
  return names.map((n) => {
    const all = Object.values(stateObj.actors);
    let hit = all.find((a) => a.name === n);
    if (!hit) {
      const partial = all.filter((a) => a.name.includes(n) || n.includes(a.name));
      if (partial.length === 1) hit = partial[0];
    }
    if (!hit) throw new Error(`${prefix}: 対象が見つかりません: ${n}`);
    return hit.id;
  });
}
async function handlePlCommand(raw) {
  const activeState = netClientMode ? netClient.view.state : state;
  if (!activeState) {
    logError('ホストからの同期を待っています');
    return;
  }
  const me = activeState.actors[viewMode.actorId];
  if (!me) {
    logError('PL視点のキャラクターが見つかりません');
    return;
  }

  if (raw[0] !== '/') {
    await dispatchPlIntent({ type: 'chat', actorId: me.id, text: raw });
    return;
  }
  const parts = raw.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  if (cmd === '/詠唱' || cmd === '/応答') {
    const spellId = args[0];
    if (!spellId) return logError(cmd + ': 呪文idを指定してください');
    const targetNames = args.slice(1);
    let targets;
    try {
      targets = targetNames.length ? resolveTargetIdsFromState(activeState, targetNames, cmd) : [me.id];
    } catch (e) {
      return logError(e.message);
    }
    await dispatchPlIntent({ type: cmd === '/応答' ? 'respond' : 'cast', casterId: me.id, spellId, targets });
    return;
  }
  if (cmd === '/パス') {
    await dispatchPlIntent({ type: 'pass', actorId: me.id });
    return;
  }
  if (cmd === '/攻撃') {
    // §9.3(2026-09-26): PL視点では常に自分が攻撃者(KP側の/攻撃と違い攻撃者名の指定は不要)。
    const [tgtName, skill, damageDice, ...rest] = args;
    if (!tgtName || !skill || !damageDice)
      return logError('/攻撃: <対象> <技能名> <ダメージダイス> を指定してください(例: /攻撃 アーク こぶし 1d3)');
    let targetIds;
    try {
      targetIds = resolveTargetIdsFromState(activeState, [tgtName], cmd);
    } catch (e) {
      return logError(e.message);
    }
    const { pierce, melee } = parseAttackOptTokens(rest);
    await dispatchPlIntent({
      type: 'attack',
      attackerId: me.id,
      targetId: targetIds[0],
      skill,
      damageDice,
      pierce,
      melee,
    });
    return;
  }
  if (cmd === '/回避') {
    await dispatchPlIntent({ type: 'defend', targetId: me.id, mode: 'dodge' });
    return;
  }
  if (cmd === '/受け流し') {
    const skill = args[0];
    if (!skill) return logError('/受け流し: 受け流しに使う技能名を指定してください');
    await dispatchPlIntent({ type: 'defend', targetId: me.id, mode: 'parry', skill });
    return;
  }
  if (cmd === '/被弾') {
    await dispatchPlIntent({ type: 'defend', targetId: me.id, mode: 'accept' });
    return;
  }
  if (cmd === '/スタック') {
    if (args[0] === 'force') {
      logError('PL視点ではスタックを強制解決できません(KP専用)');
      return;
    }
    const stackSrc = netClientMode ? activeState.stack || [] : projectStateForViewer(state, viewMode).stack;
    if (!stackSrc.length) {
      logSystem('スタックは空です');
      return;
    }
    const registrySrc = netClientMode ? netClient.view.registry : state.registry;
    const lines = stackSrc.map((e, i) => {
      const spell = registrySrc.spells[e.spellId];
      return `[${i}] ${spell ? spell.name : e.spellId} status=${e.status}`;
    });
    pushLog({ kind: 'system', from: 'system', text: 'スタック:\n' + lines.join('\n') });
    render();
    return;
  }
  logError('KP専用コマンドです(PL視点では使えません): ' + cmd);
}

/* ============================================================
   ログ関連ユーティリティ
   ============================================================ */
function pushLog(entry) {
  // netClientMode(手順9)ではホストから受信した射影済みviewが唯一の表示対象。
  // ローカル通知(接続エラー等)はそちらへ直接足す(ネットワークへは送らない、表示専用)。
  const target = netClientMode ? netClient.view.state : state;
  if (!target) return;
  target.log.push(Object.assign({ t: new Date().toISOString(), channel: 'main' }, entry));
  if (target.log.length > 2000) target.log.shift();
}
function logSystem(text) {
  pushLog({ kind: 'system', from: 'system', text });
  render();
  if (!netClientMode) persist();
}
function logError(text) {
  pushLog({ kind: 'error', from: 'system', text: 'エラー: ' + text });
  render();
  return;
}

/* ============================================================
   保存/読込(JSONダウンロード・アップロード)
   ============================================================ */
function downloadSave() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nepheria_vtt_save_${ts}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  logSystem('状態をJSONへ書き出しました: ' + a.download);
}
function downloadTextFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
/* ---- §8-D: チャットログの書き出し ---- */
function exportLogAsText() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const lines = state.log.map((e) => {
    const time = (e.t || '').slice(11, 19);
    return `[${time}] ${e.from || ''}: ${e.text || ''}`;
  });
  downloadTextFile(lines.join('\n'), `nepheria_log_${ts}.txt`, 'text/plain');
  logSystem('ログをテキストへ書き出しました');
}
function exportLogAsHtml() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const rows = state.log
    .map((e) => {
      const time = (e.t || '').slice(11, 19);
      return `<div class="entry kind-${escapeHtml(e.kind || '')}"><span class="t">${escapeHtml(time)}</span> <b>${escapeHtml(e.from || '')}</b>: ${escapeHtml(e.text || '')}</div>`;
    })
    .join('\n');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>NEPHERIA VTT ログ</title>
<style>
  body{ background:#0d0f14; color:#e8e6e1; font-family:"Segoe UI",sans-serif; padding:16px; }
  h1{ color:#d8a657; font-size:16px; }
  .entry{ margin-bottom:4px; font-family:Consolas,monospace; font-size:13px; }
  .t{ color:#8b93a3; margin-right:6px; }
  b{ color:#d8a657; }
</style>
</head><body><h1>NEPHERIA VTT ログ(${escapeHtml(state.meta.campaign || '')})</h1>
${rows}
</body></html>`;
  downloadTextFile(html, `nepheria_log_${ts}.html`, 'text/html');
  logSystem('ログをHTMLへ書き出しました');
}
function handleLoadFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const obj = JSON.parse(reader.result);
      state = normalizeState(obj);
      persist();
      render();
      logSystem('セーブデータを読み込みました: ' + file.name);
    } catch (e) {
      logError('ロード失敗: JSONとして解釈できません(' + e.message + ')');
    }
  };
  reader.readAsText(file, 'utf-8');
}
/* ---- 呪文JSONバリデータ(手順11。設計書§2.3のスキーマ準拠チェック) ----
   §2.3は「草案」であり必須/任意の境界は本実装で以下のように具体化する:
   id・name のみ必須。他はあれば型だけ検査する(値の意味的妥当性までは見ない)。 */
function validateSpellObject(sp) {
  const errors = [];
  if (!sp || typeof sp !== 'object') {
    return ['呪文オブジェクトではありません'];
  }
  if (typeof sp.id !== 'string' || !sp.id.trim()) errors.push('id が無い、または文字列ではありません');
  if (typeof sp.name !== 'string' || !sp.name.trim()) errors.push('name が無い、または文字列ではありません');
  if (sp.grade !== undefined && typeof sp.grade !== 'number') errors.push('grade は数値である必要があります');
  if (sp.keywords !== undefined && !(Array.isArray(sp.keywords) && sp.keywords.every((k) => typeof k === 'string')))
    errors.push('keywords は文字列の配列である必要があります');
  if (sp.mp !== undefined && !(typeof sp.mp === 'number' || typeof sp.mp === 'string'))
    errors.push('mp は数値または文字列(ダイス式)である必要があります');
  if (sp.resist !== undefined && typeof sp.resist !== 'number') errors.push('resist は数値である必要があります');
  if (sp.effect !== undefined && !Array.isArray(sp.effect)) errors.push('effect は配列である必要があります');
  if (sp.script !== undefined && typeof sp.script !== 'string') errors.push('script は文字列である必要があります');
  if (sp.fx !== undefined && !Array.isArray(sp.fx)) errors.push('fx は配列である必要があります');
  if (!sp.effect && !sp.script) {
    // 致命的エラーではない(KP裁定モードへ落ちるだけ)。警告として区別できるようprefixを付ける。
    errors.push('__warn__: effect も script も無い呪文です(KP裁定モードで動作します)');
  }
  return errors;
}
function validateSpellFile(obj) {
  const list = Array.isArray(obj) ? obj : (obj && obj.spells) || [];
  const valid = [],
    invalid = [];
  list.forEach((sp, i) => {
    const errors = validateSpellObject(sp);
    const fatal = errors.filter((e) => !e.startsWith('__warn__'));
    const warnings = errors.filter((e) => e.startsWith('__warn__')).map((e) => e.replace('__warn__: ', ''));
    if (fatal.length) {
      invalid.push({ index: i, id: sp && sp.id, errors: fatal });
    } else {
      valid.push({ spell: sp, warnings });
    }
  });
  return { valid, invalid };
}

function importSpellsFromJsonText(text, sourceLabel) {
  let obj;
  try {
    obj = JSON.parse(text);
  } catch (e) {
    logError(`呪文読込失敗(${sourceLabel}): JSONとして解釈できません(${e.message})`);
    return;
  }
  const { valid, invalid } = validateSpellFile(obj);
  valid.forEach(({ spell }) => {
    state.registry.spells[spell.id] = spell;
  });
  if (valid.length) {
    logSystem(`呪文データを読み込みました: ${sourceLabel}(${valid.length}件)`);
    valid.forEach(({ spell, warnings }) => {
      warnings.forEach((w) =>
        pushLog({ kind: 'system', from: 'system', text: `  ⚠ [${spell.id}] ${w}`, visibility: 'kp' })
      );
    });
  }
  if (invalid.length) {
    invalid.forEach((v) => {
      pushLog({
        kind: 'error',
        from: 'system',
        text: `エラー: 呪文[${v.index}]${v.id ? `(id:${v.id})` : ''}を検証エラーのため読み込みませんでした: ${v.errors.join(' / ')}`,
        visibility: 'kp',
      });
    });
  }
  if (!valid.length && !invalid.length) {
    logError(`呪文読込失敗(${sourceLabel}): 呪文データが見つかりません(配列 か {spells:[...]} 形式で指定してください)`);
  }
  persist();
  render();
}
function loadSpellsFile(file) {
  const reader = new FileReader();
  reader.onload = () => importSpellsFromJsonText(reader.result, file.name);
  reader.readAsText(file, 'utf-8');
}

/* ---- §9.8(2026-09-26): クリーチャー(creatures.json)の読込・検証。呪文読込(上)と同じ方式を踏襲 ---- */
function validateCreatureObject(c) {
  const errors = [];
  if (!c || typeof c !== 'object') return ['クリーチャーオブジェクトではありません'];
  if (typeof c.id !== 'string' || !c.id.trim()) errors.push('id が無い、または文字列ではありません');
  if (typeof c.name !== 'string' || !c.name.trim()) errors.push('name が無い、または文字列ではありません');
  if (c.grade !== undefined && typeof c.grade !== 'number') errors.push('grade は数値である必要があります');
  if (c.stats !== undefined && (typeof c.stats !== 'object' || c.stats === null))
    errors.push('stats はオブジェクトである必要があります');
  if (c.attacks !== undefined && !Array.isArray(c.attacks)) errors.push('attacks は配列である必要があります');
  if (c.spells !== undefined && !(Array.isArray(c.spells) && c.spells.every((s) => typeof s === 'string')))
    errors.push('spells は文字列(呪文id)の配列である必要があります');
  if (c.tags !== undefined && !(Array.isArray(c.tags) && c.tags.every((t) => typeof t === 'string')))
    errors.push('tags は文字列の配列である必要があります');
  if (!c.stats) {
    errors.push('__warn__: stats が無いクリーチャーです(盤面配置時はHP等が0扱いになります)');
  }
  return errors;
}
function validateCreatureFile(obj) {
  const list = Array.isArray(obj) ? obj : (obj && obj.creatures) || [];
  const valid = [],
    invalid = [];
  list.forEach((c, i) => {
    const errors = validateCreatureObject(c);
    const fatal = errors.filter((e) => !e.startsWith('__warn__'));
    const warnings = errors.filter((e) => e.startsWith('__warn__')).map((e) => e.replace('__warn__: ', ''));
    if (fatal.length) {
      invalid.push({ index: i, id: c && c.id, errors: fatal });
    } else {
      valid.push({ creature: c, warnings });
    }
  });
  return { valid, invalid };
}
function importCreaturesFromJsonText(text, sourceLabel) {
  let obj;
  try {
    obj = JSON.parse(text);
  } catch (e) {
    logError(`クリーチャー読込失敗(${sourceLabel}): JSONとして解釈できません(${e.message})`);
    return;
  }
  const { valid, invalid } = validateCreatureFile(obj);
  valid.forEach(({ creature }) => {
    state.registry.creatures[creature.id] = creature;
  });
  if (valid.length) {
    logSystem(`クリーチャーデータを読み込みました: ${sourceLabel}(${valid.length}件)`);
    valid.forEach(({ creature, warnings }) => {
      warnings.forEach((w) =>
        pushLog({ kind: 'system', from: 'system', text: `  ⚠ [${creature.id}] ${w}`, visibility: 'kp' })
      );
    });
  }
  if (invalid.length) {
    invalid.forEach((v) => {
      pushLog({
        kind: 'error',
        from: 'system',
        text: `エラー: クリーチャー[${v.index}]${v.id ? `(id:${v.id})` : ''}を検証エラーのため読み込みませんでした: ${v.errors.join(' / ')}`,
        visibility: 'kp',
      });
    });
  }
  if (!valid.length && !invalid.length) {
    logError(
      `クリーチャー読込失敗(${sourceLabel}): クリーチャーデータが見つかりません(配列 か {creatures:[...]} 形式で指定してください)`
    );
  }
  persist();
  render();
}
function loadCreaturesFile(file) {
  const reader = new FileReader();
  reader.onload = () => importCreaturesFromJsonText(reader.result, file.name);
  reader.readAsText(file, 'utf-8');
}
/** creatures.jsonのテンプレートから盤面配置用のNPCアクターを生成する(§9.8)。
 *  attacks配列はシート上の技能値と自動連携しない(仕様上「skill」が値なのか名前参照なのか未確定のため、
 *  実在数値を捏造しないという鉄則に従い actor.creatureAttacks へ参照用にそのまま保持するだけに留める)。 */
function spawnCreatureActor(creatureId, x, y) {
  const c = state.registry.creatures[creatureId];
  if (!c) return null;
  const id = uid('actor');
  const st = c.stats || {};
  const actor = {
    id,
    name: c.name,
    kind: 'NPC',
    creatureId: c.id,
    creatureKind: c.kind || '',
    creatureAttacks: c.attacks || [],
    pos: { x, y },
    tokenAssetId: null,
    visible: true,
    stats: {
      hp: st.hp ?? 0,
      maxHp: st.hp ?? 0,
      mp: st.mp ?? 0,
      maxMp: st.mp ?? 0,
      san: st.san ?? 0,
      maxSan: st.san ?? 0,
      str: st.str ?? 0,
      con: st.con ?? 0,
      pow: st.pow ?? 0,
      dex: st.dex ?? 0,
      app: 0,
      siz: st.siz ?? 0,
      int: st.int ?? 0,
      edu: 0,
      db: st.db !== undefined ? String(st.db) : '0',
      armor: st.armor || 0,
    },
    hidden: {
      note: `registry[${c.id}]から配置(§9.8)。attacksタブの技能値は未連携のためシート上で個別に設定すること。`,
    },
    statuses: [],
    resist: { current: 0, cap: Math.floor((st.pow || 0) / 3), lockedRounds: 0 },
    skills: {},
    spells: (c.spells || []).slice(),
    items: [],
    sprites: {},
    macros: {},
    ownerConn: null,
    color: TOKEN_COLORS[nextTokenColorIdx++ % TOKEN_COLORS.length],
    hasActed: false,
    castLog: {},
    triggers: [],
    zIndex: 0,
    tokenScale: 1,
    initiative: null,
    customParams: {},
    statusFlags: {},
    publicMemo: '',
    iconAssetId: null,
    chatPalette: '',
    roundStartPos: { x, y },
  };
  if (st.mov !== undefined) actor.stats.mov = st.mov;
  state.actors[id] = actor;
  logSystem(`クリーチャー配置: ${c.name}(registry[${c.id}])`);
  return actor;
}
function renderCreaturePanel() {
  const panel = document.getElementById('creature-panel');
  if (!panel) return;
  panel.hidden = !creaturePanelOn;
  document.getElementById('btnToggleCreatures').classList.toggle('active', creaturePanelOn);
  if (!creaturePanelOn) return;
  const list = Object.values(state.registry.creatures || {});
  const body = document.getElementById('crBody');
  if (!list.length) {
    body.innerHTML =
      '<div class="empty-hint">登録されたクリーチャーがありません(その他メニュー→クリーチャー読込)</div>';
    return;
  }
  body.innerHTML = list
    .map((c) => {
      const st = c.stats || {};
      const active = creaturePlacementDraft === c.id;
      return `<div class="creature-card ${active ? 'active' : ''}" data-id="${escapeHtml(c.id)}">
      <div class="cc-name">${escapeHtml(c.name)} <span style="opacity:.6;">Lv${c.grade ?? '?'}</span></div>
      <div class="cc-meta">${escapeHtml(c.kind || '-')} ・ HP${st.hp ?? '?'} MP${st.mp ?? '?'} DEX${st.dex ?? '?'}</div>
    </div>`;
    })
    .join('');
}
function wireCreaturePlacementClick(tokensElId, boardElId) {
  const tokensEl = document.getElementById(tokensElId);
  const boardEl = document.getElementById(boardElId);
  if (!tokensEl || !boardEl) return;
  tokensEl.addEventListener('click', (ev) => {
    if (ev.target !== tokensEl) return; // 駒本体のクリックは各駒のclickハンドラに任せる
    if (!creaturePlacementDraft) return;
    const { x, y } = clientToBoardPercent(ev.clientX, ev.clientY, boardEl);
    spawnCreatureActor(creaturePlacementDraft, x, y);
    persist();
    render();
  });
}

/* ============================================================
   ASSETS(§8-D) — 画像/音声素材の最小実装。stateにdataUrlごと保存する
   (localStorage経由。将来的にはIndexedDBへ移すのが望ましいが、今回は
   「CCfolia標準相当の最小実装」の指示に沿って単純さを優先した)。
   ============================================================ */
function uploadAssetFile(file) {
  const isImage = file.type.startsWith('image/');
  const isAudio = file.type.startsWith('audio/');
  if (!isImage && !isAudio) {
    logError('素材読込失敗: 画像または音声ファイルを選んでください');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const id = uid('asset');
    state.assets[id] = { id, name: file.name, type: isImage ? 'image' : 'audio', dataUrl: reader.result };
    persist();
    renderAssetList();
    render();
    logSystem(`素材を登録しました: ${file.name}`);
  };
  reader.readAsDataURL(file);
}
/* ---- §9.10(2026-09-26): 戦闘config画面。design_doc_v0.md §9.10の仮既定11項目をKPが編集できるようにする ---- */
const COMBAT_CONFIG_FIELDS = [
  {
    key: 'unconsciousThreshold',
    label: '気絶しきい値(HP以下)',
    type: 'number',
    wired: true,
    desc: 'HPがこの値以下でCON×5判定を自動実行し、失敗で[気絶]を自動付与する(§9.12.1。autoApply=onの間のみ)。',
  },
  {
    key: 'dyingThreshold',
    label: '瀕死しきい値(HP以下)',
    type: 'number',
    wired: true,
    desc: 'HPがこの値以下で[瀕死]を自動付与し、以後毎ラウンドCON×5を自動判定する(§9.12.1。autoApply=onの間のみ)。',
  },
  {
    key: 'dodgePerRound',
    label: '1ラウンドの回避試行回数上限',
    type: 'number',
    wired: true,
    desc: '0=無制限。§9.3の仮既定は「無制限」のため、0以外を指定しても現状の実装は回数上限を判定しない。',
  },
  {
    key: 'martialArts',
    label: 'マーシャルアーツ(こぶし/キック2倍)',
    type: 'boolean',
    wired: true,
    desc: '§9.3の物理ダメージ計算(resolvePendingAttackDamage)で使用。',
  },
  {
    key: 'critEffect',
    label: 'クリティカルの効果',
    type: 'select',
    options: ['maxDamage'],
    wired: true,
    desc: '現状「maxDamage(ダメージ最大化)」のみ実装。§9.3で使用。',
  },
  {
    key: 'doubleMove',
    label: '行動放棄時のMOV倍率',
    type: 'number',
    wired: true,
    desc: '§9.12.3(2026-09-27追補): 移動UIで通常MOVを超えてこの倍率までの移動を確定すると、行動放棄とみなしhasActed=trueが自動セットされる。',
  },
  {
    key: 'defaultMov',
    label: '既定MOV(未設定キャラ用)',
    type: 'number',
    wired: true,
    desc: 'stats.mov未設定のキャラのフォールバック値(actorMov())。§9.2の移動距離警告で使用。',
  },
  {
    key: 'fanAngle',
    label: '扇テンプレの角度(度)',
    type: 'number',
    wired: true,
    desc: '範囲テンプレ列挙(enumerateTemplateTargets)の扇形判定で使用。§9.4/9.5。',
  },
  {
    key: 'responseTimerSec',
    label: '応答ウィンドウの制限時間(秒)',
    type: 'number',
    wired: false,
    desc: '0=無制限。§9.4の応答ウィンドウには現状タイマーUIが無く、常に無制限として動作する(値を変えても効果なし)。',
  },
  {
    key: 'autoApply',
    label: 'ダメージ等の完全自動適用',
    type: 'boolean',
    wired: true,
    desc: '§9.12.1(2026-09-27): 気絶/瀕死のCON×5自動判定・状態自動tickを有効化する。戦闘モードON時に自動でtrueへ切り替わる(戦闘外は既定off)。',
  },
  {
    key: 'mpRegenInCombat',
    label: '戦闘中のMP自然回復',
    type: 'boolean',
    wired: false,
    desc: '戦闘中に毎ラウンドMPが自然回復するかどうかの想定(§9.7)。現状は数値を保持するのみで未配線。',
  },
  {
    key: 'npcAutoDefend',
    label: 'NPCの防御を自動選択',
    type: 'boolean',
    wired: true,
    desc: '§9.12.1: NPCが攻撃を受けた際、回避/受け流し技能から最適なものを自動選択して防御ロールする(KPの手入力を省略)。',
  },
  {
    key: 'autoDeath',
    label: '死亡確定の自動化',
    type: 'boolean',
    wired: true,
    desc: '§9.12.1: 瀕死状態での毎ラウンドCON×5判定に失敗した際、死亡を自動確定するか。既定off(不可逆操作のためKP確認チップ〈/KP裁定〉を経由する)。',
  },
  {
    key: 'diagonalCost',
    label: '斜め移動のコスト(マス)',
    type: 'number',
    wired: true,
    desc: '§9.12.3(2026-09-27追補): 自動経路探索(computeMovementField)で斜め1マス移動に課すコスト。既定1=直交と同コスト。斜め移動コストの統一ルールはdata/rawに未確定のため卓のhouse ruleとして設定する【要確認】。',
  },
];
function renderCombatConfigModal() {
  const body = document.getElementById('combat-config-body');
  if (!body) return;
  const cfg = state.config.combat;
  body.innerHTML = COMBAT_CONFIG_FIELDS.map((f) => {
    const val = cfg[f.key];
    let inputHtml;
    if (f.type === 'boolean') {
      inputHtml = `<input type="checkbox" id="cfg-${f.key}" ${val ? 'checked' : ''}>`;
    } else if (f.type === 'select') {
      inputHtml = `<select id="cfg-${f.key}">${f.options.map((o) => `<option value="${escapeHtml(o)}" ${o === val ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}</select>`;
    } else {
      inputHtml = `<input type="number" id="cfg-${f.key}" value="${escapeHtml(String(val))}">`;
    }
    return `<div class="cfg-row">
      <label for="cfg-${f.key}">${escapeHtml(f.label)}<span class="cfg-desc">${escapeHtml(f.desc)}</span></label>
      ${inputHtml}
      <span class="cfg-badge ${f.wired ? 'wired' : 'unwired'}">${f.wired ? '配線済' : '未配線'}</span>
    </div>`;
  }).join('');
}
function saveCombatConfigFromModal() {
  const cfg = state.config.combat;
  COMBAT_CONFIG_FIELDS.forEach((f) => {
    const el = document.getElementById('cfg-' + f.key);
    if (!el) return;
    if (f.type === 'boolean') cfg[f.key] = el.checked;
    else if (f.type === 'select') cfg[f.key] = el.value;
    else cfg[f.key] = parseFloat(el.value) || 0;
  });
  logSystem('戦闘config(§9.10)を更新しました');
  persist();
  render();
  document.getElementById('combat-config-modal-backdrop').classList.remove('open');
}

// §9.13.3(2026-09-27追補): 用途タグ(整理用の追加情報。挙動を制約するものではない。既存のワンクリック設定ボタンは維持する)
const ASSET_TAG_OPTIONS = [
  { value: '', label: '(タグなし)' },
  { value: 'bg', label: '背景' },
  { value: 'fg', label: '前景' },
  { value: 'portrait', label: '立ち絵' },
  { value: 'icon', label: 'アイコン' },
  { value: 'other', label: 'その他' },
];
function renderAssetList() {
  const el = document.getElementById('asset-list');
  if (!el) return;
  const assets = Object.values(state.assets || {});
  if (!assets.length) {
    el.innerHTML = '<div class="empty-hint">まだ素材がありません</div>';
    return;
  }
  el.innerHTML = assets
    .map((a) => {
      const thumbInner = a.type === 'image' ? `<img src="${a.dataUrl}" alt="">` : `<span>🔊</span>`;
      const thumb =
        a.type === 'image'
          ? `<span class="asset-thumb-drag" draggable="true" data-id="${a.id}" title="盤面/駒へドラッグ&ドロップで割当">${thumbInner}</span>`
          : thumbInner;
      const actions =
        a.type === 'image'
          ? `<button data-act="bg" data-id="${a.id}">背景</button><button data-act="fg" data-id="${a.id}">前景</button><button data-act="cutin" data-id="${a.id}">カットイン</button><button data-act="panel" data-id="${a.id}">パネル</button>`
          : `<button data-act="bgm" data-id="${a.id}">BGM</button><button data-act="se" data-id="${a.id}">SE</button>`;
      const tagOptions = ASSET_TAG_OPTIONS.map(
        (t) =>
          `<option value="${t.value}" ${(a.tag || '') === t.value ? 'selected' : ''}>${escapeHtml(t.label)}</option>`
      ).join('');
      return `<div class="asset-item">
      <div class="athumb-wrap">${thumb}</div>
      <input class="aname" data-id="${a.id}" value="${escapeHtml(a.name)}" title="クリックして名前を変更">
      <select class="atag" data-id="${a.id}">${tagOptions}</select>
      <div class="aactions">${actions}<button data-act="del" data-id="${a.id}">削除</button></div>
    </div>`;
    })
    .join('');
  el.querySelectorAll('button[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      if (act === 'bg') {
        state.scene.bgAssetId = id;
        persist();
        render();
        logSystem('背景を設定しました');
      } else if (act === 'fg') {
        state.scene.fgAssetId = id;
        persist();
        render();
        logSystem('前景を設定しました');
      } // §1-4(2026-09-05)
      else if (act === 'cutin') {
        showCutin(id);
      } else if (act === 'bgm') {
        playBgm(id);
      } else if (act === 'se') {
        playSe(id);
      } else if (act === 'panel') {
        addScreenPanel(id, 35, 35);
        document.getElementById('asset-modal-backdrop').classList.remove('open');
      } // §2-5(2026-09-06)
      else if (act === 'del') {
        delete state.assets[id];
        persist();
        renderAssetList();
        logSystem('素材を削除しました');
      }
    });
  });
  el.querySelectorAll('.aname').forEach((inp) => {
    inp.addEventListener('change', () => {
      const a = state.assets[inp.dataset.id];
      if (!a) return;
      const v = inp.value.trim();
      a.name = v || a.name;
      inp.value = a.name;
      persist();
    });
  });
  el.querySelectorAll('.atag').forEach((sel) => {
    sel.addEventListener('change', () => {
      const a = state.assets[sel.dataset.id];
      if (!a) return;
      a.tag = sel.value || undefined;
      persist();
    });
  });
  el.querySelectorAll('.asset-thumb-drag').forEach((el2) => {
    el2.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.setData('text/nepheria-asset-id', el2.dataset.id);
      ev.dataTransfer.effectAllowed = 'copy';
    });
  });
}
function showCutin(assetId) {
  // §2-2(2026-09-05): カットインもSE同様「揮発するイベント」としてnonce方式で全員に配信する
  // (以前はこのブラウザだけでオーバーレイを出す純ローカル処理だった)。
  if (!state.assets[assetId]) return;
  state.scene.cutinAssetId = assetId;
  state.scene.cutinNonce = (state.scene.cutinNonce || 0) + 1;
  persist();
  render();
}
let lastSeenCutinNonce = null;
function syncCutinPlayback(sceneObj, assetsDict) {
  if (!sceneObj) return;
  const overlay = document.getElementById('cutin-overlay');
  if (!overlay) return;
  if (lastSeenCutinNonce === null) {
    lastSeenCutinNonce = sceneObj.cutinNonce || 0;
    return;
  }
  if ((sceneObj.cutinNonce || 0) === lastSeenCutinNonce) return;
  lastSeenCutinNonce = sceneObj.cutinNonce || 0;
  const asset = sceneObj.cutinAssetId ? (assetsDict || {})[sceneObj.cutinAssetId] : null;
  if (!asset) return;
  document.getElementById('cutin-img').src = asset.dataUrl;
  overlay.hidden = false;
  clearTimeout(overlay._hideTimer);
  overlay._hideTimer = setTimeout(() => {
    overlay.hidden = true;
  }, 4000);
}
let lastSeenSpriteNonce = null;
function syncSpriteDisplay(spriteStage, actorsDict, assetsDict) {
  const box = document.getElementById('sprite-display');
  if (!box || !spriteStage) return;
  const disp = spriteStage.display;
  const nonce = disp ? disp.nonce : 0;
  if (lastSeenSpriteNonce === null) {
    lastSeenSpriteNonce = nonce;
    return;
  } // 起動直後は再生しない(SE/カットインと同じ方針)
  if (nonce === lastSeenSpriteNonce) return;
  lastSeenSpriteNonce = nonce;
  const actor = disp && (actorsDict || {})[disp.actorId];
  if (!actor) return;
  // 差分指定があればそれを、無ければ既定アイコンを使う。どちらも無ければ立ち絵は出さない(空箱を避ける)。
  const spriteAssetId = (disp.diff && actor.sprites && actor.sprites[disp.diff]) || actor.iconAssetId;
  const asset = spriteAssetId ? (assetsDict || {})[spriteAssetId] : null;
  if (!asset || asset.type !== 'image') return;
  document.getElementById('sprite-display-img').src = asset.dataUrl;
  document.getElementById('sprite-display-name').textContent = actor.name;
  box.hidden = false;
  clearTimeout(box._hideTimer);
  box._hideTimer = setTimeout(() => {
    box.hidden = true;
  }, 8000);
}
/* ---- §1-5(2026-09-05): BGM/SE。「誰が再生するか」はstate.scene(KP操作→persist()経由で全員に同期)、
   「どのくらいの音量で聞くか」は各ブラウザのローカル設定(localStorage。同期しない)という役割分担にした。
   design_doc_v0.md §1.2「状態とイベントの分離」に倣い、SEは"揮発するイベント"としてnonce方式にした
   (state.scene.seNonceが増えたのを検知したクライアントだけがその場で1回再生する。再接続者には再生させない)。 ---- */
function playBgm(assetId) {
  if (!state.assets[assetId]) return;
  state.scene.bgmAssetId = assetId;
  state.scene.bgmPlaying = true;
  persist();
  render();
}
function stopBgm() {
  state.scene.bgmPlaying = false;
  persist();
  render();
}
function playSe(assetId) {
  if (!state.assets[assetId]) return;
  state.scene.seAssetId = assetId;
  state.scene.seNonce = (state.scene.seNonce || 0) + 1;
  persist();
  render();
}
let lastSeenSeNonce = null; // null=まだ初期化していない(起動直後の同期で過去のSEを鳴らさないためのガード)
let localBgmVolume = (() => {
  const v = parseFloat(localStorage.getItem('nepheria_bgm_vol'));
  return isNaN(v) ? 0.7 : Math.max(0, Math.min(1, v));
})();
let localBgmMuted = localStorage.getItem('nepheria_bgm_muted') === '1';
function syncBgmPlayback(sceneObj, assetsDict) {
  const bgmPlayer = document.getElementById('bgm-player');
  const sePlayer = document.getElementById('se-player');
  const bar = document.getElementById('bgm-bar');
  if (!bgmPlayer || !sePlayer || !bar || !sceneObj) return;
  const vol = localBgmMuted ? 0 : localBgmVolume;
  bgmPlayer.volume = vol;
  sePlayer.volume = vol;

  const bgmAsset = sceneObj.bgmAssetId ? (assetsDict || {})[sceneObj.bgmAssetId] : null;
  bar.hidden = !bgmAsset;
  if (bgmAsset) {
    document.getElementById('bgmTrackName').textContent = bgmAsset.name || '(無題)';
    if (sceneObj.bgmPlaying) {
      if (bgmPlayer.dataset.assetId !== sceneObj.bgmAssetId) {
        bgmPlayer.src = bgmAsset.dataUrl;
        bgmPlayer.dataset.assetId = sceneObj.bgmAssetId;
        bgmPlayer.play().catch(() => {}); // 自動再生制限で失敗しても致命的ではないため無音で無視(ブラウザの警告待ちにしない)
      } else if (bgmPlayer.paused) {
        bgmPlayer.play().catch(() => {});
      }
    } else if (!bgmPlayer.paused) {
      bgmPlayer.pause();
    }
  }
  document.getElementById('btnBgmStopKp').style.display = viewMode.role === 'kp' && !netClientMode ? '' : 'none';

  if (lastSeenSeNonce === null) {
    lastSeenSeNonce = sceneObj.seNonce || 0;
    return;
  } // 初回同期は「今の状態」を基準にするだけで再生しない
  if ((sceneObj.seNonce || 0) !== lastSeenSeNonce) {
    lastSeenSeNonce = sceneObj.seNonce || 0;
    const seAsset = sceneObj.seAssetId ? (assetsDict || {})[sceneObj.seAssetId] : null;
    if (seAsset) {
      sePlayer.src = seAsset.dataUrl;
      sePlayer.play().catch(() => {});
    }
  }
}
// §9.13.3(2026-09-27追補): 保存ボタンのイベントハンドラから切り出した(DOM無しでもテスト可能にするため)
function saveCurrentSceneAsPreset(name) {
  state.scenePresets[name] = {
    bgAssetId: state.scene.bgAssetId || null,
    fgAssetId: state.scene.fgAssetId || null,
    bgmAssetId: state.scene.bgmAssetId || null,
    screenPanels: JSON.parse(JSON.stringify(state.screenPanels || {})),
  };
  persist();
  logSystem(`シーン[${name}]を保存しました`);
}
function applyScenePreset(name) {
  // §2-1(2026-09-05): シーン適用=前景・背景・BGMを一括反映+切替テキストをメインチャットへ自動送信
  // §9.13.3(2026-09-27追補): 盤上パネル一式もスナップショットとして保存・復元の対象に含める(既存プリセットを統合)
  const preset = state.scenePresets[name];
  if (!preset) {
    logError(`シーン[${name}]が見つかりません`);
    return;
  }
  state.scene.bgAssetId = preset.bgAssetId || null;
  state.scene.fgAssetId = preset.fgAssetId || null;
  if (preset.bgmAssetId) {
    state.scene.bgmAssetId = preset.bgmAssetId;
    state.scene.bgmPlaying = true;
  } else {
    state.scene.bgmPlaying = false;
  }
  if (preset.screenPanels) {
    state.screenPanels = JSON.parse(JSON.stringify(preset.screenPanels));
  }
  persist();
  render();
  logSystem(`シーン[${name}]に切り替えました`); // これ自体がAC「シーン切替テキスト」(メインチャンネルへの自動送信)
}
function renderScenePresetList() {
  const el = document.getElementById('scene-preset-list');
  if (!el) return;
  const names = Object.keys(state.scenePresets || {});
  if (!names.length) {
    el.innerHTML = '<div class="empty-hint">保存済みシーンはありません</div>';
    return;
  }
  el.innerHTML = names
    .map((name) => {
      const preset = state.scenePresets[name];
      const bgAsset = preset.bgAssetId ? state.assets[preset.bgAssetId] : null;
      const thumb =
        bgAsset && bgAsset.type === 'image'
          ? `<img src="${bgAsset.dataUrl}" alt="" class="scene-thumb">`
          : `<span class="scene-thumb scene-thumb-empty"></span>`;
      return `<div class="scene-preset-item">${thumb}<span class="pname">${escapeHtml(name)}</span><button data-act="apply" data-name="${escapeHtml(name)}">適用</button><button data-act="del" data-name="${escapeHtml(name)}">削除</button></div>`;
    })
    .join('');
  el.querySelectorAll('button[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      if (btn.dataset.act === 'apply') {
        applyScenePreset(name);
      } else {
        delete state.scenePresets[name];
        persist();
        renderScenePresetList();
        logSystem(`シーン[${name}]を削除しました`);
      }
    });
  });
}

/* ---- §8-D: CCfolia形式キャラクターJSON取込
   一次情報 https://docs.ccfolia.com/developer-api/clipboard-api で確認したCharacter型に基づく。
   マッピング方針の詳細は design_doc_v0.md §8.1 参照。 ---- */
const CCF_MAIN_STAT_LABELS = {
  STR: 'str',
  CON: 'con',
  POW: 'pow',
  DEX: 'dex',
  APP: 'app',
  SIZ: 'siz',
  INT: 'int',
  EDU: 'edu',
};
function importCcfoliaCharacter(obj) {
  if (!obj || obj.kind !== 'character' || !obj.data) return null;
  const d = obj.data;
  const id = uid('actor');
  const actor = {
    id,
    name: d.name || '(無名)',
    kind: 'PC',
    pos: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
    tokenAssetId: d.iconUrl || null,
    visible: d.invisible ? false : true,
    stats: {
      hp: 0,
      maxHp: 0,
      mp: 0,
      maxMp: 0,
      san: 0,
      maxSan: 99,
      str: 0,
      con: 0,
      pow: 0,
      dex: 0,
      app: 0,
      siz: 0,
      int: 0,
      edu: 0,
      db: '0',
      armor: 0,
    },
    hidden: {},
    statuses: [],
    resist: { current: 0, cap: 0, lockedRounds: 0 },
    skills: {},
    spells: [],
    items: [],
    sprites: {},
    macros: {},
    ownerConn: null,
    color: d.color || TOKEN_COLORS[nextTokenColorIdx++ % TOKEN_COLORS.length],
    hasActed: false,
    castLog: {},
    triggers: [],
    zIndex: 0,
    tokenScale: 1,
    initiative: d.initiative !== undefined ? d.initiative : null,
    customParams: {},
    statusFlags: {},
    publicMemo: d.memo || '',
    chatPalette: d.commands || '',
  };
  (d.status || []).forEach((s) => {
    const label = String(s.label || '').toUpperCase();
    if (label === 'HP') {
      actor.stats.hp = s.value || 0;
      actor.stats.maxHp = s.max || s.value || 0;
    } else if (label === 'MP') {
      actor.stats.mp = s.value || 0;
      actor.stats.maxMp = s.max || s.value || 0;
    } else if (label === 'SAN') {
      actor.stats.san = s.value || 0;
      actor.stats.maxSan = s.max || s.value || 0;
    } else {
      actor.customParams[s.label] = `${s.value}/${s.max}`;
    }
  });
  (d.params || []).forEach((p) => {
    const upper = String(p.label || '').toUpperCase();
    if (CCF_MAIN_STAT_LABELS[upper]) {
      actor.stats[CCF_MAIN_STAT_LABELS[upper]] = parseInt(p.value, 10) || 0;
    } else {
      const n = parseInt(p.value, 10);
      if (!isNaN(n) && String(n) === String(p.value).trim()) actor.skills[p.label] = n;
      else actor.customParams[p.label] = p.value;
    }
  });
  (d.faces || []).forEach((f) => {
    if (f.label) actor.sprites[f.label] = f.iconUrl || null;
  });
  actor.resist.cap = Math.floor((actor.stats.pow || 0) / 3);
  return actor;
}
function runCcfoliaImport() {
  const text = document.getElementById('ccf-import-text').value;
  let obj;
  try {
    obj = JSON.parse(text);
  } catch (e) {
    logError('CCfolia取込失敗: JSONとして解釈できません(' + e.message + ')');
    return;
  }
  const actor = importCcfoliaCharacter(obj);
  if (!actor) {
    logError('CCfolia取込失敗: kind:"character" のデータではありません');
    return;
  }
  state.actors[actor.id] = actor;
  persist();
  render();
  document.getElementById('ccf-import-text').value = '';
  document.getElementById('ccf-import-modal-backdrop').classList.remove('open');
  logSystem(
    `CCfoliaキャラクターを取り込みました: ${actor.name}(x,y/angle/width/height/active/secret/hideStatus/owner/立ち絵の実画像は【要確認】としてスキップ)`
  );
}

/* ============================================================
   UI — 盤面・キャラパネル・ログ描画
   ============================================================ */
let selectedActorId = null;
let editingActorId = null; // null=新規
// デバッグ用視点切替(手順8)。{role:"kp"} または {role:"pl", actorId}。
// PL視点は必ず projectStateForViewer を通した射影(viewState)だけを描画する。
let viewMode = { role: 'kp' };
// チャットタブ・発言者選択(§8-A)。KP視点でも自クライアントのローカル状態(ネットワーク送信しない)。
let activeChatTab = 'main'; // "main" | "chat" | "whisper"
let kpSpeakerId = null; // null=KP(ナレーション)として発言。それ以外はactorId

function render() {
  // tests.html 等、実ツールのDOMが無い環境(#board等が無い)から呼ばれた場合は何もしない。
  // ENGINE/VISIBILITY等のテストは resolve()/projectStateForViewer() を直接呼ぶため、
  // handlePlCommand 等の内部でrender()が呼ばれても安全に無視できる必要がある。
  if (!document.getElementById('roundNum')) return;
  document.getElementById('roundNum').textContent = state.round.number;
  const kpView = document.getElementById('kp-view');
  const plView = document.getElementById('pl-view');
  const kpOnly1 = document.getElementById('kp-only-controls');
  const kpOnly2 = document.getElementById('kp-only-controls2');
  const kpOnly3 = document.getElementById('kp-only-controls3');
  const viewSelectLabel = document.getElementById('viewSelect').parentElement;

  if (netClientMode) {
    // 実ネットワーク越しのPLクライアント(手順9)。KP視点への切替UIごと隠し、
    // ホストからの stateSync(=既に射影済み)をそのまま描画する(二重フィルタしない)。
    viewSelectLabel.style.display = 'none';
    document.getElementById('btnNetOpen').style.display = 'none';
    closeNetModal();
    kpView.hidden = true;
    plView.hidden = false;
    kpView.style.display = 'none';
    plView.style.display = 'flex';
    kpOnly1.style.display = 'none';
    kpOnly2.style.display = 'none';
    kpOnly3.style.display = 'none';
    const viewState = netClient.view.state || { actors: {}, log: [], handouts: {}, stack: [] };
    applyStageBackground(viewState.scene);
    syncBgmPlayback(viewState.scene, viewState.assets);
    syncCutinPlayback(viewState.scene, viewState.assets);
    syncSpriteDisplay(viewState.spriteStage, viewState.actors, viewState.assets);
    renderBoardPl(viewState);
    renderPlHud(viewState);
    renderPlSidebar(viewState);
    renderChatTabs();
    renderSpeakerSelect();
    renderChatPalette();
    renderDicePalette();
    renderLog(viewState.log, viewState.actors);
    renderSpellbookPanel();
    renderDefendPrompt(); // §9.12.1(2026-09-27)
    return;
  }

  viewSelectLabel.style.display = '';
  renderViewSelect();
  renderChatTabs();
  renderSpeakerSelect();
  renderChatPalette();
  renderDicePalette();
  if (viewMode.role === 'kp') {
    kpView.hidden = false;
    plView.hidden = true;
    kpView.style.display = 'flex';
    plView.style.display = 'none';
    kpOnly1.style.display = 'contents';
    kpOnly2.style.display = 'contents';
    kpOnly3.style.display = 'contents';
    applyStageBackground(state.scene);
    syncBgmPlayback(state.scene, state.assets);
    syncCutinPlayback(state.scene, state.assets);
    syncSpriteDisplay(state.spriteStage, state.actors, state.assets);
    renderBoard();
    renderHud();
    renderLog(state.log, state.actors);
    renderCreaturePanel(); // §9.8(2026-09-26): KP専用パネル
  } else {
    kpView.hidden = true;
    plView.hidden = false;
    kpView.style.display = 'none';
    plView.style.display = 'flex';
    kpOnly1.style.display = 'none';
    kpOnly2.style.display = 'none';
    kpOnly3.style.display = 'none';
    const viewState = projectStateForViewer(state, viewMode);
    applyStageBackground(viewState.scene);
    syncBgmPlayback(viewState.scene, viewState.assets);
    syncCutinPlayback(viewState.scene, viewState.assets);
    syncSpriteDisplay(viewState.spriteStage, viewState.actors, viewState.assets);
    renderBoardPl(viewState);
    renderPlHud(viewState);
    renderPlSidebar(viewState);
    renderLog(viewState.log, viewState.actors);
  }
  renderSpellbookPanel();
  renderDefendPrompt(); // §9.12.1(2026-09-27)
  renderAttackFormPrompt(); // §9.13.5(2026-09-27追補)
}

function renderViewSelect() {
  const sel = document.getElementById('viewSelect');
  const pcs = Object.values(state.actors).filter((a) => a.kind === 'PC');
  const wantValue = viewMode.role === 'kp' ? 'kp' : 'pl:' + viewMode.actorId;
  const optionsHtml = ['<option value="kp">KP</option>']
    .concat(pcs.map((a) => `<option value="pl:${a.id}">PL: ${escapeHtml(a.name)}</option>`))
    .join('');
  if (sel.dataset.builtFor !== optionsHtml) {
    sel.innerHTML = optionsHtml;
    sel.dataset.builtFor = optionsHtml;
  }
  if (sel.value !== wantValue) sel.value = wantValue;
}

/* ---- §2-4(2026-09-05): メッセージウィンドウ(自分のみのローカル表示設定。ノベルゲーム風の文字送り) ---- */
let messageWindowOn = localStorage.getItem('nepheria_mw_on') === '1';
let lastSeenMwLogLen = null;
function typewriterReveal(el, text) {
  clearInterval(el._mwTimer);
  let i = 0;
  el.textContent = '';
  el._mwTimer = setInterval(() => {
    i += 2; // 1文字ずつだと長文で待たされすぎるため2文字/tickにした
    el.textContent = text.slice(0, i);
    if (i >= text.length) clearInterval(el._mwTimer);
  }, 30);
}
function updateMessageWindow(log, actorsDict) {
  const box = document.getElementById('message-window');
  if (!box) return;
  box.hidden = !messageWindowOn;
  document.getElementById('btnToggleMw').classList.toggle('active', messageWindowOn);
  if (!log) return;
  if (lastSeenMwLogLen === null) {
    lastSeenMwLogLen = log.length;
    return;
  } // 起動直後は過去ログを流さない
  if (log.length <= lastSeenMwLogLen) return;
  const newOnes = log
    .slice(lastSeenMwLogLen)
    .filter(
      (e) => (e.channel || 'main') === 'main' && (e.kind === 'chat' || e.kind === 'roll') && (e.text || '').trim()
    );
  lastSeenMwLogLen = log.length;
  if (!newOnes.length || !messageWindowOn) return;
  const last = newOnes[newOnes.length - 1];
  document.getElementById('mw-name').textContent = last.from || '';
  typewriterReveal(document.getElementById('mw-text'), last.text || '');
}

/* ---- チャットタブ・発言者切替(§8-A。2026-09-05にCCfolia採寸準拠でチャンネル追加(+)と未読ドットを追加) ---- */
let chatUnread = {}; // {tabId: boolean}。セッションローカル(永続化しない)
let lastSeenLogLen = 0;
function updateChatUnread(log) {
  if (!log) return;
  if (log.length > lastSeenLogLen) {
    for (let i = lastSeenLogLen; i < log.length; i++) {
      const ch = log[i].channel || 'main';
      if (ch !== activeChatTab) chatUnread[ch] = true;
    }
  }
  lastSeenLogLen = log.length;
}
function addCustomChatTab(name) {
  const target = netClientMode ? null : state; // netClientモードはホストへ委ねられないため今回は非対応(PLのローカルチャンネル追加はホスト側で作成してもらう運用)
  if (!target) {
    logError('チャンネル追加はKP(ホスト)側で行ってください');
    return;
  }
  target.customChatTabs = target.customChatTabs || [];
  const id = 'ch_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  target.customChatTabs.push({ id, label: name.slice(0, 20) });
  activeChatTab = id;
  chatUnread[id] = false;
  persist();
  render();
}
function removeCustomChatTab(id) {
  if (netClientMode) {
    logError('チャンネル削除はKP(ホスト)側で行ってください');
    return;
  }
  if (!state.customChatTabs) return;
  const tab = state.customChatTabs.find((c) => c.id === id);
  if (!tab) return;
  showInlineConfirm(`チャンネル「${tab.label}」を削除しますか?(このチャンネルのログも見えなくなります)`, () => {
    state.customChatTabs = state.customChatTabs.filter((c) => c.id !== id);
    delete chatUnread[id];
    if (activeChatTab === id) activeChatTab = 'main';
    persist();
    render();
  });
}
function renderChatTabs() {
  const vs = currentChatViewState();
  const custom = (vs && vs.customChatTabs) || [];
  const wrap = document.getElementById('customChatTabs');
  if (wrap) {
    const html = custom
      .map(
        (c) =>
          `<button type="button" class="chat-tab" data-tab="${escapeHtml(c.id)}">${escapeHtml(c.label)}<span class="chat-tab-rm" title="チャンネルを削除">×</span></button>`
      )
      .join('');
    if (wrap.dataset.builtFor !== html) {
      wrap.innerHTML = html;
      wrap.dataset.builtFor = html;
    }
  }
  document.querySelectorAll('.chat-tab').forEach((btn) => {
    const isActive = btn.dataset.tab === activeChatTab;
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('has-unread', !!(chatUnread[btn.dataset.tab] && !isActive));
  });
  document.getElementById('whisper-target-select').hidden = activeChatTab !== 'whisper';
}
function currentChatViewState() {
  // KP視点はstateそのもの、PLはprojectStateForViewer(手順8)/netClient.view(手順9)の射影済みactorsを使う。
  if (netClientMode) return netClient.view.state || { actors: {} };
  if (viewMode.role === 'pl') return projectStateForViewer(state, viewMode);
  return state;
}
function renderSpeakerSelect() {
  const sel = document.getElementById('speaker-select');
  const whisperSel = document.getElementById('whisper-target-select');
  const vs = currentChatViewState();
  const actors = Object.values(vs.actors || {});
  if (viewMode.role === 'kp' && !netClientMode) {
    const optHtml = ['<option value="">KP(ナレーション)</option>']
      .concat(actors.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`))
      .join('');
    if (sel.dataset.builtFor !== optHtml) {
      sel.innerHTML = optHtml;
      sel.dataset.builtFor = optHtml;
    }
    sel.disabled = false;
    sel.value = kpSpeakerId || '';
    const whisperOpt = actors.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
    if (whisperSel.dataset.builtFor !== whisperOpt) {
      whisperSel.innerHTML = whisperOpt;
      whisperSel.dataset.builtFor = whisperOpt;
    }
  } else {
    // PL(ローカル/ネットワーク問わず): 自分のキャラ固定
    const me = actors.find((a) => a.id === viewMode.actorId);
    sel.innerHTML = `<option value="${viewMode.actorId || ''}">${escapeHtml(me ? me.name : '(不明)')}</option>`;
    sel.value = viewMode.actorId || '';
    sel.disabled = true;
    const whisperOpt = actors
      .filter((a) => a.id !== viewMode.actorId)
      .map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`)
      .join('');
    if (whisperSel.dataset.builtFor !== whisperOpt) {
      whisperSel.innerHTML = whisperOpt;
      whisperSel.dataset.builtFor = whisperOpt;
    }
  }
  const label = document.getElementById('speakerNameLabel');
  if (label) {
    const opt = sel.options[sel.selectedIndex];
    label.textContent = opt ? opt.textContent : 'KP(ナレーション)';
  }
  renderSpeakerFaceButton();
}
/* ---- 発言キャラ切替(顔アイコン)。CCfolia実機では顔アイコンをクリックすると
   アバター+名前+アクティブ/非アクティブ状態の一覧が開き、キャラを切り替えられる ---- */
function speakerAvatarStyle(actor) {
  if (!actor) return { bgImage: '', bgColor: 'var(--chat-avatar-bg)', inner: 'KP' };
  const icon = actor.iconAssetId ? state.assets[actor.iconAssetId] : null;
  if (icon && icon.type === 'image') {
    return { bgImage: `url(${icon.dataUrl})`, bgColor: actor.color || '#4a4f5c', inner: '' };
  }
  return { bgImage: '', bgColor: actor.color || '#4a4f5c', inner: escapeHtml((actor.name || '?').slice(0, 2)) };
}
function renderSpeakerFaceButton() {
  const btn = document.getElementById('btnSpeakerFace');
  if (!btn) return;
  const speaker = currentSpeakerActor();
  const info = speakerAvatarStyle(speaker);
  btn.style.backgroundImage = info.bgImage;
  btn.style.backgroundColor = info.bgColor;
  btn.textContent = info.inner;
}
function renderSpeakerPickerPopover() {
  const pop = document.getElementById('speakerPickerPopover');
  const vs = currentChatViewState();
  const actors = Object.values(vs.actors || {});
  const isKp = viewMode.role === 'kp' && !netClientMode;
  const currentId = isKp ? document.getElementById('speaker-select').value || '' : viewMode.actorId || '';
  let rows;
  if (isKp) {
    rows = [{ id: '', actor: null }].concat(actors.map((a) => ({ id: a.id, actor: a })));
  } else {
    const me = actors.find((a) => a.id === viewMode.actorId);
    rows = me ? [{ id: me.id, actor: me }] : [];
  }
  pop.innerHTML = rows
    .map((r) => {
      const info = speakerAvatarStyle(r.actor);
      const style = `background-image:${info.bgImage || 'none'}; background-color:${info.bgColor};`;
      const active = r.id === currentId;
      const name = r.actor ? r.actor.name : 'KP(ナレーション)';
      return (
        `<button type="button" class="speaker-pick-row${active ? ' is-active' : ''}" data-id="${escapeHtml(r.id)}">` +
        `<span class="spr-avatar" style="${style}">${info.inner}</span>` +
        `<span class="spr-info"><span class="spr-name">${escapeHtml(name)}</span><span class="spr-status">${active ? 'アクティブ状態' : '非アクティブ状態'}</span></span>` +
        `</button>`
      );
    })
    .join('');
}
/* ---- チャットパレット(§8-C) ---- */
function expandChatPaletteVars(actor, template) {
  if (!actor) return template;
  return template.replace(/\{([^{}]+)\}/g, (whole, name) => {
    const lower = name.toLowerCase();
    if (actor.stats && actor.stats[lower] !== undefined) return String(actor.stats[lower]);
    if (actor.skills && actor.skills[name] !== undefined) return String(actor.skills[name]);
    return whole; // 展開できない場合はそのまま残す
  });
}
function currentSpeakerActor() {
  const vs = currentChatViewState();
  if (viewMode.role === 'kp' && !netClientMode) {
    const sel = document.getElementById('speaker-select');
    return sel && sel.value ? vs.actors[sel.value] : null;
  }
  return vs.actors ? vs.actors[viewMode.actorId] : null;
}
function renderChatPalette() {
  const panel = document.getElementById('chat-palette-panel');
  const speaker = currentSpeakerActor();
  const lines =
    speaker && speaker.chatPalette
      ? speaker.chatPalette
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
      : [];
  panel.innerHTML = lines
    .map((line) => {
      const expanded = expandChatPaletteVars(speaker, line);
      return `<div class="palette-item" data-template="${escapeHtml(line)}" title="${escapeHtml(expanded)}">${escapeHtml(line)}</div>`;
    })
    .join('');
  panel.querySelectorAll('.palette-item').forEach((el) => {
    el.addEventListener('click', () => {
      document.getElementById('chatInput').value = expandChatPaletteVars(speaker, el.dataset.template);
      document.getElementById('chatInput').focus();
    });
    el.addEventListener('dblclick', () => {
      const text = expandChatPaletteVars(speaker, el.dataset.template);
      document.getElementById('chatInput').value = '';
      sendChatMessage(text).catch((e) => {
        logError('内部エラー: ' + e.message);
        console.error(e);
      });
    });
  });
}

/* ---- ダイスクイックパレット(§8-D-5)。CCfolia風に多面体アイコンで表示する ---- */
const DICE_SHAPE_SVG = {
  triangle: '<polygon points="12,3 21,20 3,20"/>',
  square: '<rect x="4" y="4" width="16" height="16"/>',
  diamond: '<polygon points="12,2 22,12 12,22 2,12"/>',
  hexagon: '<polygon points="12,2 21,7 21,17 12,22 3,17 3,7"/>',
  pentagon: '<polygon points="12,2 22,9.5 18,21 6,21 2,9.5"/>',
};
const DICE_QUICK_SEND = [
  { dice: '1D3', tip: '1D3', shape: 'triangle' },
  { dice: '1D6', tip: '1D6', shape: 'square' },
  { dice: '1D10', tip: '1D10', shape: 'diamond' },
  { dice: '2D6', tip: '2D6', shape: 'hexagon' },
  { dice: '1D100', tip: '1D100(パーセンタイル)', shape: 'pentagon' },
];
const DICE_QUICK_INSERT = ['CCB<=', 'CC<='];
function renderDicePalette() {
  const panel = document.getElementById('dice-palette-panel');
  if (!panel) return;
  const sendHtml = DICE_QUICK_SEND.map(
    (d) =>
      `<button class="icon-btn dice-icon-btn dice-quick" data-dice="${escapeHtml(d.dice)}" data-mode="send" data-tip="${escapeHtml(d.tip)}">` +
      `<svg viewBox="0 0 24 24">${DICE_SHAPE_SVG[d.shape]}</svg></button>`
  ).join('');
  const insertHtml = DICE_QUICK_INSERT.map(
    (t) => `<div class="palette-item dice-quick" data-dice="${escapeHtml(t)}" data-mode="insert">${escapeHtml(t)}</div>`
  ).join('');
  panel.innerHTML = sendHtml + insertHtml + '<button type="button" id="btnSendChat">送信</button>';
  document.getElementById('btnSendChat').addEventListener('click', submitChatInput);
  panel.querySelectorAll('.dice-quick').forEach((el) => {
    el.addEventListener('click', () => {
      const dice = el.dataset.dice;
      if (el.dataset.mode === 'send') {
        sendChatMessage(dice).catch((e) => {
          logError('内部エラー: ' + e.message);
          console.error(e);
        });
      } else {
        const input = document.getElementById('chatInput');
        input.value = dice;
        input.focus();
      }
    });
  });
}

async function sendChatMessage(rawText) {
  if (!rawText.trim()) return;
  const sel = document.getElementById('speaker-select');
  const speakerId = viewMode.role === 'kp' && !netClientMode ? sel.value || null : viewMode.actorId;

  // §2-3(2026-09-05): 末尾の "@ラベル" で立ち絵差分を切り替える。「よし行くぞ@笑顔」→本文は「よし行くぞ」だけ、
  // "@ラベル" 単独送信(本文が空になる)なら無言で差分切替のみ行う(resolve()の"chat"case側でtext空を検出して処理)。
  let spriteDiff;
  let text = rawText;
  const atM = /^([\s\S]*?)\s*@(\S+)$/.exec(rawText.trim());
  if (atM) {
    text = atM[1];
    spriteDiff = atM[2];
  }

  if (!text.trim()) {
    const intent = { type: 'chat', actorId: speakerId, text: '', channel: activeChatTab, spriteDiff };
    if (viewMode.role === 'kp' && !netClientMode) {
      kpSpeakerId = speakerId;
      const result = await resolve(state, intent);
      state = result.newState;
      persist();
      render();
    } else {
      await dispatchPlIntent(intent);
    }
    return;
  }

  // §8-B: チャット欄にBCDice互換のダイスコマンドを直接打てる。
  const trimmed = text.trim();
  const spaceIdx = trimmed.search(/\s/);
  const cmdPart = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const comment = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1).trim();
  const bc = bcdiceRoll(cmdPart);

  // §1-3(ロードマップ2026-09-05): ":HP-10" ":術式抵抗+2" 形式のステータス増減ショートハンド
  const statM = /^:([^\s+\-=]+)\s*([+\-]\d+|=\d+)$/.exec(trimmed);

  let intent;
  if (statM) {
    intent = { type: 'statAdjust', actorId: speakerId, label: statM[1], deltaStr: statM[2] };
  } else if (bc) {
    const label = comment ? ` 【${comment}】` : '';
    const displayText = `${bc.formula}${label} → ${bc.detail}${bc.resultText ? ' ' + bc.resultText : ''}`;
    intent = {
      type: 'chat',
      actorId: speakerId,
      text: displayText,
      kind: 'roll',
      channel: bc.secret ? 'whisper' : activeChatTab,
      spriteDiff,
    };
    if (bc.secret) intent.secretRoll = true;
  } else {
    intent = { type: 'chat', actorId: speakerId, text, channel: activeChatTab, spriteDiff };
    if (activeChatTab === 'whisper') {
      const target = document.getElementById('whisper-target-select').value;
      if (!target) {
        logError('密談の宛先を選んでください');
        return;
      }
      intent.whisperTargetId = target;
    }
  }

  if (viewMode.role === 'kp' && !netClientMode) {
    kpSpeakerId = speakerId;
    const result = await resolve(state, intent);
    state = result.newState;
    persist();
    render();
  } else {
    await dispatchPlIntent(intent);
  }
}
function submitChatInput() {
  const chatInput = document.getElementById('chatInput');
  const val = chatInput.value;
  chatInput.value = '';
  chatInput.style.height = '';
  // §8-A: チャット欄にダイスコマンドを直接打てる。"/"始まりは通常のコマンド経路(handleCommand)へ、
  // それ以外は発言者・チャットタブを反映したsendChatMessageへ。
  const task = val.trim().startsWith('/') ? handleCommand(val) : sendChatMessage(val);
  task.catch((e) => {
    logError('内部エラー: ' + e.message);
    console.error(e);
  });
}

function bringActorToFront(a) {
  const maxZ = Math.max(0, ...Object.values(state.actors).map((x) => x.zIndex || 0));
  a.zIndex = maxZ + 1;
}
/* ---- §2-5(2026-09-06): スクリーンパネル(盤面に置く画像パネル。KP専用の配置操作。地図等) ---- */
let editingPanelId = null;
function addScreenPanel(assetId, x, y) {
  if (!state.assets[assetId]) return;
  const id = uid('panel');
  const maxZ = Math.max(0, ...Object.values(state.screenPanels).map((p) => p.zIndex || 0));
  state.screenPanels[id] = {
    id,
    assetId,
    x: x !== undefined ? x : 35,
    y: y !== undefined ? y : 35,
    w: 30,
    h: 30,
    zIndex: maxZ + 1,
    rotation: 0,
    locked: false,
    sizeLocked: false,
    terrain: false,
    hiddenFromPl: false,
    memo: '',
  };
  persist();
  render();
  logSystem('盤面にパネルを追加しました');
}
function bringPanelToFront(p) {
  const maxZ = Math.max(0, ...Object.values(state.screenPanels).map((x) => x.zIndex || 0));
  p.zIndex = maxZ + 1;
}
// §9.13.3(2026-09-27追補): 重なり順の逆側の操作(既存の「クリックで最前面へ」と対になる)
function sendPanelToBack(p) {
  const minZ = Math.min(0, ...Object.values(state.screenPanels).map((x) => x.zIndex || 0));
  p.zIndex = minZ - 1;
}
function renderScreenPanels(containerId, panelsDict, assetsDict, readonly) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  Object.values(panelsDict || {}).forEach((p) => {
    const asset = (assetsDict || {})[p.assetId];
    const el = document.createElement('div');
    el.className = 'screen-panel' + (readonly ? ' readonly' : p.locked ? ' locked' : '');
    el.style.left = p.x + '%';
    el.style.top = p.y + '%';
    el.style.width = p.w + '%';
    el.style.height = p.h + '%';
    el.style.zIndex = p.zIndex || 0;
    el.style.transform = `rotate(${p.rotation || 0}deg)`; // §9.13.3(2026-09-27追補): 盤上パネルの回転
    if (asset && asset.type === 'image') el.style.backgroundImage = `url(${asset.dataUrl})`;
    el.dataset.id = p.id;
    if (p.memo) el.innerHTML += `<span class="sp-memo-badge">📝</span>`;
    if (!readonly) {
      el.innerHTML += `<span class="sp-gear" data-act="settings">⚙</span>`;
      if (!p.sizeLocked) {
        el.innerHTML += `<span class="sp-resize" data-act="resize"></span>`;
        el.innerHTML += `<span class="sp-rotate" data-act="rotate" title="ドラッグで回転">⟳</span>`;
      }
    }
    container.appendChild(el);
    if (!readonly) attachPanelInteractions(el, p);
  });
}
function attachPanelInteractions(el, p) {
  el.addEventListener('click', (ev) => {
    if (el._dragged || el._resized) {
      el._dragged = false;
      el._resized = false;
      return;
    }
    if (ev.target.dataset.act === 'settings') {
      openPanelSettings(p, ev.clientX, ev.clientY);
      return;
    }
    const panel = state.screenPanels[p.id];
    if (panel) {
      bringPanelToFront(panel);
      persist();
      render();
    }
  });
  if (!p.locked) {
    el.addEventListener('pointerdown', (ev) => {
      if (ev.target.dataset.act) return; // ギア/リサイズハンドルは別処理
      if (ev.button !== 0) return; // 2026-09-26: 右/中クリックはカメラ操作側へ委ねる(掴み分けルール)
      ev.preventDefault();
      el.setPointerCapture(ev.pointerId);
      el.classList.add('dragging');
      const move = (mv) => {
        const pt = clientToBoardPercent(mv.clientX, mv.clientY, el);
        let x = pt.x,
          y = pt.y;
        x = Math.max(0, Math.min(100 - p.w, x));
        y = Math.max(0, Math.min(100 - p.h, y));
        el.style.left = x + '%';
        el.style.top = y + '%';
        p.x = x;
        p.y = y;
        el._dragged = true;
      };
      const up = () => {
        el.classList.remove('dragging');
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        if (el._dragged) persist();
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
    });
  }
  const handle = el.querySelector('[data-act="resize"]');
  if (handle) {
    handle.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      handle.setPointerCapture(ev.pointerId);
      const move = (mv) => {
        const pt = clientToBoardPercent(mv.clientX, mv.clientY, el);
        let w = pt.x - p.x;
        let h = pt.y - p.y;
        w = Math.max(4, Math.min(100 - p.x, w));
        h = Math.max(4, Math.min(100 - p.y, h));
        el.style.width = w + '%';
        el.style.height = h + '%';
        p.w = w;
        p.h = h;
        el._resized = true;
      };
      const up = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        if (el._resized) persist();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }
  // §9.13.3(2026-09-27追補): 回転ハンドル。パネル中心から見たポインタ角度をそのままrotationに反映する
  const rotHandle = el.querySelector('[data-act="rotate"]');
  if (rotHandle) {
    rotHandle.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      rotHandle.setPointerCapture(ev.pointerId);
      const move = (mv) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2,
          cy = rect.top + rect.height / 2;
        const angleRad = Math.atan2(mv.clientY - cy, mv.clientX - cx);
        // ハンドルは既定でパネル上端(真上=-90°)にあるため、そこを0°基準に補正する
        let deg = (angleRad * 180) / Math.PI + 90;
        deg = Math.round(deg);
        el.style.transform = `rotate(${deg}deg)`;
        p.rotation = deg;
        el._rotated = true;
      };
      const up = () => {
        rotHandle.removeEventListener('pointermove', move);
        rotHandle.removeEventListener('pointerup', up);
        if (el._rotated) {
          persist();
          el._rotated = false;
        }
      };
      rotHandle.addEventListener('pointermove', move);
      rotHandle.addEventListener('pointerup', up);
    });
  }
}
function openPanelSettings(p, clientX, clientY) {
  editingPanelId = p.id;
  const pop = document.getElementById('panel-settings-popover');
  document.getElementById('psLocked').checked = !!p.locked;
  document.getElementById('psSizeLocked').checked = !!p.sizeLocked;
  document.getElementById('psTerrain').checked = !!p.terrain;
  document.getElementById('psHidden').checked = !!p.hiddenFromPl;
  document.getElementById('psMemo').value = p.memo || '';
  pop.style.left = Math.min(clientX, window.innerWidth - 240) + 'px';
  pop.style.top = Math.min(clientY, window.innerHeight - 260) + 'px';
  pop.classList.add('open');
}
function closePanelSettings() {
  document.getElementById('panel-settings-popover').classList.remove('open');
  editingPanelId = null;
}
function applyStageBackground(sceneObj) {
  // §8改修: 背景画像は舞台(#stage、全画面)に敷く。以前は盤面(#board)個別だった。
  const stage = document.getElementById('stage');
  if (!stage) return;
  const asset = sceneObj && sceneObj.bgAssetId ? state.assets[sceneObj.bgAssetId] : null;
  stage.style.backgroundImage = asset && asset.type === 'image' ? `url(${asset.dataUrl})` : '';

  // §1-4(2026-09-05): 前景レイヤー(背景の上・駒の下)。KP/PL両方の盤面要素に同じものを反映する
  // (現在どちらが表示中かをここで気にせず、両方更新しておけば良い。非表示側は描画されないだけ)。
  const fgAsset = sceneObj && sceneObj.fgAssetId ? state.assets[sceneObj.fgAssetId] : null;
  const fgUrl = fgAsset && fgAsset.type === 'image' ? `url(${fgAsset.dataUrl})` : '';
  const fgEl = document.getElementById('board-fg');
  if (fgEl) fgEl.style.backgroundImage = fgUrl;
  const plFgEl = document.getElementById('pl-board-fg');
  if (plFgEl) plFgEl.style.backgroundImage = fgUrl;
}
function tokenPortraitStyle(a) {
  const icon = a.iconAssetId ? state.assets[a.iconAssetId] : null;
  if (icon && icon.type === 'image')
    return `background-image:url(${icon.dataUrl}); background-color:${a.color || '#555'};`;
  return `background:${a.color || '#555'};`;
}
function tokenPortraitInner(a) {
  const icon = a.iconAssetId ? state.assets[a.iconAssetId] : null;
  return icon && icon.type === 'image' ? '' : escapeHtml((a.name || '').slice(0, 2));
}

/* ---- §9.5(2026-09-26): 戦闘モードのグリッド表示・壁エディタ ---- */
function renderGridOverlay(elId, grid) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (!grid || !grid.enabled) {
    el.style.backgroundImage = '';
    return;
  }
  const pct = 100 / Math.max(1, grid.cols || 20);
  el.style.backgroundImage =
    'linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px),' +
    'linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)';
  el.style.backgroundSize = `${pct}% ${pct}%`;
}
function wallClassFor(w) {
  // 視線を遮らず移動のみ遮る壁は破線/オレンジで区別する。それ以外(視線も遮る壁)は実線/赤で表示する。
  return w.blocksMove && !w.blocksSight ? 'no-move-only' : '';
}
function renderWalls(containerId, walls, editable) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.className = editable && wallEditMode ? 'wall-edit-active' : '';
  el.innerHTML = '';
  (walls || []).forEach((w) => {
    const d = document.createElement('div');
    d.className = 'wall-rect ' + wallClassFor(w);
    d.style.left = w.x + '%';
    d.style.top = w.y + '%';
    d.style.width = w.w + '%';
    d.style.height = w.h + '%';
    d.dataset.id = w.id;
    if (w.label) d.innerHTML = `<span class="wall-label">${escapeHtml(w.label)}</span>`;
    if (editable) {
      d.style.pointerEvents = 'auto';
      d.style.cursor = 'pointer';
      d.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (wallEditMode) openWallEditPrompt(w.id);
      });
    }
    el.appendChild(d);
  });
}
function openWallEditPrompt(wallId) {
  const w = (state.scene.walls || []).find((x) => x.id === wallId);
  if (!w) return;
  const action = (
    prompt(
      `壁「${w.label || '(無題)'}」を編集します。番号を入力してください(空欄でキャンセル):\n` +
        `1: 移動を遮る = ${w.blocksMove ? 'ON' : 'OFF'} を切替\n` +
        `2: 視線を遮る = ${w.blocksSight ? 'ON' : 'OFF'} を切替\n` +
        `3: ロック = ${w.locked ? 'ON' : 'OFF'} を切替\n` +
        `4: ラベルを変更\n` +
        `5: この壁を削除`,
      ''
    ) || ''
  ).trim();
  if (!action) return;
  if (action === '1') {
    w.blocksMove = !w.blocksMove;
  } else if (action === '2') {
    w.blocksSight = !w.blocksSight;
  } else if (action === '3') {
    w.locked = !w.locked;
  } else if (action === '4') {
    const label = prompt('新しいラベル', w.label || '');
    if (label !== null) w.label = label;
  } else if (action === '5') {
    state.scene.walls = state.scene.walls.filter((x) => x.id !== wallId);
  } else return;
  persist();
  render();
}
function wireWallDrawing(wallsElId, boardElId) {
  const wallsEl = document.getElementById(wallsElId);
  const boardEl = document.getElementById(boardElId);
  if (!wallsEl || !boardEl) return;
  wallsEl.addEventListener('pointerdown', (ev) => {
    if (!wallEditMode || ev.target !== wallsEl) return; // 既存の壁上のクリックは各壁のclickハンドラに任せる
    if (ev.button !== 0) return; // 2026-09-26: 右/中クリックはカメラ操作側へ委ねる(掴み分けルール)
    ev.preventDefault();
    const start = clientToBoardPercent(ev.clientX, ev.clientY, boardEl);
    const sx = start.x,
      sy = start.y;
    const preview = document.createElement('div');
    preview.className = 'wall-draw-preview';
    wallsEl.appendChild(preview);
    const move = (mv) => {
      const p2 = clientToBoardPercent(mv.clientX, mv.clientY, boardEl);
      const x2 = p2.x,
        y2 = p2.y;
      const x = Math.min(sx, x2),
        y = Math.min(sy, y2),
        w = Math.abs(x2 - sx),
        h = Math.abs(y2 - sy);
      preview.style.left = x + '%';
      preview.style.top = y + '%';
      preview.style.width = w + '%';
      preview.style.height = h + '%';
    };
    const up = (uv) => {
      wallsEl.removeEventListener('pointermove', move);
      wallsEl.removeEventListener('pointerup', up);
      preview.remove();
      const pUp = clientToBoardPercent(uv.clientX, uv.clientY, boardEl);
      const x2 = pUp.x,
        y2 = pUp.y;
      const x = Math.max(0, Math.min(sx, x2)),
        y = Math.max(0, Math.min(sy, y2));
      const w = Math.abs(x2 - sx),
        h = Math.abs(y2 - sy);
      if (w < 1 || h < 1) return; // 極小ドラッグ(誤クリック)は無視
      state.scene.walls.push({
        id: uid('wall'),
        x,
        y,
        w,
        h,
        blocksMove: true,
        blocksSight: true,
        locked: false,
        label: '',
      });
      persist();
      render();
    };
    wallsEl.addEventListener('pointermove', move);
    wallsEl.addEventListener('pointerup', up);
  });
}
// §9.4/9.5(2026-09-26): 範囲呪文(spell.aoe={shape,radius}がある呪文)のターゲティング中、盤面の空きスペースを
// クリックするとその地点を範囲テンプレの照準としてenumerateTemplateTargets()で対象を自動列挙する。
// 通常呪文(aoe未設定)や駒本体のクリックはこのハンドラでは何もしない(既存のtoggleCastTargetに委ねる)。
function wireAoeBoardClick(tokensElId, boardElId) {
  const tokensEl = document.getElementById(tokensElId);
  const boardEl = document.getElementById(boardElId);
  if (!tokensEl || !boardEl) return;
  tokensEl.addEventListener('click', (ev) => {
    if (ev.target !== tokensEl) return; // 駒本体のクリックは各駒のclickハンドラに任せる
    if (!castDraft) return;
    const spell = spellRegistrySrc().spells[castDraft.spellId];
    if (!spell || !spell.aoe || !spell.aoe.shape) return;
    const vs = spellbookViewState();
    const caster = vs.actors[castDraft.actorId];
    if (!caster) return;
    const aimPos = clientToBoardPercent(ev.clientX, ev.clientY, boardEl);
    let ids = enumerateTemplateTargets(vs, spell.aoe.shape, caster.pos, aimPos, spell.aoe.radius || 3);
    if (vs.scene && vs.scene.grid && vs.scene.grid.enabled) {
      ids = ids.filter((id) => !losBlocked(vs, caster.pos, vs.actors[id].pos));
    }
    castDraft.targets = ids;
    render();
  });
}
function warnIfMoveExceedsBudget(actor) {
  // §9.2(2026-09-26): 移動はソフト警告のみ(KPの裁量。ドラッグ自体は妨げない)。戦闘モード(グリッド表示)中のみ判定する。
  if (!state || !state.scene || !state.scene.grid || !state.scene.grid.enabled) return;
  if (!actor.roundStartPos) return;
  const dist = distanceCells(state, actor.roundStartPos, actor.pos);
  const mov = actorMov(state, actor);
  if (dist > mov + 0.001) {
    pushLog({
      kind: 'system',
      from: 'system',
      text: `警告: ${actor.name} は今ラウンド約${dist.toFixed(1)}マス移動しました(MOV${mov})。距離超過の可否はKPが裁定してください`,
    });
  }
  if (moveBlockedByWalls(state, actor.roundStartPos, actor.pos)) {
    pushLog({
      kind: 'system',
      from: 'system',
      text: `警告: ${actor.name} の移動経路が壁(移動を遮る)を横切っています。KPが裁定してください`,
    });
  }
}

function renderBoard() {
  renderScreenPanels('board-panels', state.screenPanels, state.assets, false); // §2-5(2026-09-06)
  renderGridOverlay('board-grid', state.scene.grid); // §9.5(2026-09-26)
  renderWalls('board-walls', state.scene.walls, true); // KP側は編集可能
  document.getElementById('btnCombatMode').classList.toggle('active', !!state.scene.grid.enabled);
  document.getElementById('btnWallEdit').classList.toggle('active', wallEditMode);
  const board = document.getElementById('board-tokens'); // §1-4(2026-09-05): 前景レイヤー(#board-fg)を巻き込んで消さないよう、駒はこのサブ要素だけ差し替える
  board.innerHTML = '';
  Object.values(state.actors).forEach((a) => {
    if (a.visible === false) return; // §1-3(2026-09-05): 「しまう」で待機領域へ退避した駒は盤面に描画しない
    const el = document.createElement('div');
    // §9.9(2026-09-26): ターゲティングモード中(castDraft有)は対象マーク・カーソルを変える
    const isCastTarget = !!(castDraft && castDraft.targets.includes(a.id));
    const isSecret = !!(a.hidden && a.hidden.statsHidden); // 2026-09-26: Axe準拠ペデスタルの秘匿色分け
    el.className =
      'token' +
      (a.id === selectedActorId ? ' selected' : '') +
      (isCastTarget ? ' cast-target' : '') +
      (castDraft || attackDraft ? ' cast-targetable' : '') +
      (isSecret ? ' secret-token' : '');
    el.style.left = a.pos.x + '%';
    el.style.top = a.pos.y + '%';
    el.style.zIndex = a.zIndex || 0;
    // 2026-09-26(挙動完全移植): 卓のrotateZ分だけ逆回転させ、駒の名前・HPバーが常に正立(ビルボード)するようにする
    // (Axe実機の名前ラベルが常時カメラを向く挙動を実測して踏襲。ポートレート自体は卓と一緒に傾く)
    el.style.transform = `scale(${a.tokenScale || 1}) rotateZ(${-boardCamera.rotateZDeg}deg)`;
    el.dataset.id = a.id;
    el.dataset.scale = a.tokenScale || 1;
    const hpPct = a.stats.maxHp > 0 ? Math.max(0, Math.min(100, (100 * a.stats.hp) / a.stats.maxHp)) : 0;
    el.innerHTML = `
      <div class="portrait" style="${tokenPortraitStyle(a)}">${tokenPortraitInner(a)}</div>
      <div class="minibar"><i style="width:${hpPct}%"></i></div>
      <div class="name">${escapeHtml(a.name)}</div>
    `;
    attachDrag(el, a);
    el.addEventListener('click', (ev) => {
      if (el._dragged) {
        el._dragged = false;
        return;
      }
      if (attackDraft) {
        fireAttackDraft(a.id);
        return;
      } // §9.12.1: 攻撃対象クリック
      if (toggleCastTarget(a.id)) return; // §9.9: ターゲティングモード中はここで処理済み(通常選択はしない)
      // §9.12.3(2026-09-27追補): 戦闘モード中、自分が動かせる駒を(選択済みの状態で)再クリックすると
      // 移動UI(自動経路探索)に入る。ドラッグでの自由移動(厳密な移動)は attachDrag 側にそのまま残す。
      if (state.scene.grid.enabled && !movementDraft && a.id === selectedActorId && isMyControllableActor(a.id)) {
        startMovementDraft(a.id);
        return;
      }
      selectedActorId = a.id;
      bringActorToFront(a); // §8-D: クリックで重なり順を最前面へ
      persist();
      render();
    });
    el.addEventListener('dblclick', (ev) => {
      ev.preventDefault();
      openActorModal(a.id); // §8-D: ダブルクリックでシートを開く
    });
    // §9.13.3(2026-09-27追補): 素材一覧からのドラッグ&ドロップで駒へアイコン/立ち絵を割当(新規機能。KP盤面のみ)
    el.addEventListener('dragover', (ev) => {
      if (ev.dataTransfer.types.includes('text/nepheria-asset-id')) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    });
    el.addEventListener('drop', (ev) => {
      const assetId = ev.dataTransfer.getData('text/nepheria-asset-id');
      if (!assetId) return;
      ev.preventDefault();
      ev.stopPropagation(); // 盤面側のdropハンドラ(パネル追加等)へ二重発火しないようにする
      showContextMenu(ev.clientX, ev.clientY, [
        {
          label: 'アイコンに設定',
          action: () => {
            a.iconAssetId = assetId;
            persist();
            render();
            logSystem(`${a.name} のアイコンを設定しました`);
          },
        },
        {
          label: '立ち絵として追加…',
          action: () => {
            showInlineTextPrompt(ev.clientX, ev.clientY, '差分名(例: 笑顔)', '', (label) => {
              a.sprites = a.sprites || {};
              a.sprites[label] = assetId;
              persist();
              render();
              logSystem(`${a.name} に立ち絵差分[${label}]を追加しました`);
            });
          },
        },
      ]);
    });
    board.appendChild(el);
  });
  renderMovementOverlayInto('board-move-overlay'); // §9.12.3(2026-09-27追補)
}

/* ============================================================
   §盤面3D化・カメラ操作(2026-09-27 直接操作カメラ版。design_doc_v0.md §9.12.0参照)
   「掴んだ点がカーソルに追従し続ける」1:1アンカー追従を核心とする。
   - パン: #board-pan/#pl-board-pan が担当(素の2D平行移動)。
   - 3D傾斜(rotateX)+回転(rotateZ)+ズーム(scale)+perspective: #board/#pl-board が担当。
   CSS: transform: perspective(F) rotateX(θ) rotateZ(φ) scale(zoom)
     (関数リストは右から適用されるため、scale→rotateZ→rotateX→perspectiveの順で点に効く。
      下記JSの順変換/逆変換もこの順序と厳密に整合させている)。
   アンカー追従の考え方: 盤面ローカル座標(px,py)は「パンを除いた」3D変換(3D関数)で
   screen-local座標(中心原点)へ写る。実際の画面位置はさらにpan(panX,panY)だけずれる。
   よって「盤面上のある点を、指定した画面位置に固定する」には
     panX = targetScreenX - screenLocal3D(px,py).x  (panY同様)
   を解けばよい。パン・ズーム・オービットは全てこの1つの式(boardKeepAnchorAtScreenPoint)
   を土台にする。
   ============================================================ */
const boardCamera = {
  rotateXDeg: 50,
  rotateZDeg: 10, // 初期姿勢(Axe実測値を引き続き既定値として採用。design_doc_v0.md §9.12.0)
  perspectivePx: 1700,
  zoom: 1, // scale方式のズーム(旧translateZ dolly方式から変更)
  panX: 0,
  panY: 0,
};
const BOARD_CAMERA_DEFAULT = { rotateXDeg: 50, rotateZDeg: 10, zoom: 1, panX: 0, panY: 0 };
let cameraInertiaEnabled = false; // config: cameraInertia(design_doc_v0.md §9.12.0)。§9.13でカメラ設定ウィジェットから切替可能にした
// §9.14.1(2026-09-27追補・手順0.d): 既定offへ変更(ウィジェットから有効化可)
let combatLockTopDown = true; // config: combatLockTopDown。同上
// §9.13(UI・基盤改善一括第3弾・手順2): 右クリックオービットの既定回転方向を是正(反転)した。
// invertOrbitX/Yは「もう一度反転して元(是正前)の挙動に戻す」ためのトグルとして残す(既定はfalse=是正後の新しい既定)。
let invertOrbitX = false;
let invertOrbitY = false;
function boardCameraTransformCss() {
  return `perspective(${boardCamera.perspectivePx}px) rotateX(${boardCamera.rotateXDeg}deg) rotateZ(${boardCamera.rotateZDeg}deg) scale(${boardCamera.zoom})`;
}
function applyBoardCameraCss() {
  const css3d = boardCameraTransformCss();
  const panCss = `translate(${boardCamera.panX}px, ${boardCamera.panY}px)`;
  const b1 = document.getElementById('board'),
    b2 = document.getElementById('pl-board');
  if (b1) b1.style.transform = css3d;
  if (b2) b2.style.transform = css3d;
  const p1 = document.getElementById('board-pan'),
    p2 = document.getElementById('pl-board-pan');
  if (p1) p1.style.transform = panCss;
  if (p2) p2.style.transform = panCss;
  // 駒の名前・HPバーのビルボード化を回転操作中もライブ追従させる(render()を毎pointermoveで呼ぶと重いため、
  // ここでtransformだけ直接書き換える軽量パス)
  document.querySelectorAll('.token').forEach((t) => {
    const s = t.dataset.scale || 1;
    t.style.transform = `scale(${s}) rotateZ(${-boardCamera.rotateZDeg}deg)`;
  });
  // §9.12.2(2026-09-27): カメラ操作中(パン/オービット/ズームの毎フレーム)もターゲットライン(SVG)を
  // 盤面駒の新しい画面位置に追従させる。データ自体(どのスタックエントリがどの駒を指すか)は
  // renderSpellbookPanel()側で構築済みのものを使い、ここでは画面座標の再計算だけ行う軽量パス。
  if (spellbookOn && stackLineData.length) renderStackTargetLines();
}
// 盤面ローカル座標(中心原点)→ screen-local座標(中心原点。パンは含まない)への順変換。
// CSS: perspective(F) rotateX(θ) rotateZ(φ) scale(zoom) と同じ式(scale→rotateZ→rotateX→perspectiveの順で点に効く)。
function boardLocalToScreenLocal3D(px, py, cam) {
  const zoom = cam.zoom || 1;
  const px1 = px * zoom,
    py1 = py * zoom;
  const thetaX = (cam.rotateXDeg * Math.PI) / 180,
    thetaZ = (cam.rotateZDeg * Math.PI) / 180;
  const xr = px1 * Math.cos(thetaZ) - py1 * Math.sin(thetaZ);
  const yr = px1 * Math.sin(thetaZ) + py1 * Math.cos(thetaZ);
  const yy = yr * Math.cos(thetaX);
  const zz = yr * Math.sin(thetaX);
  const k = 1 - zz / cam.perspectivePx;
  return { x: xr / k, y: yy / k };
}
// screen-local座標(中心原点。パンは呼び出し側で既に吸収済み)→盤面ローカル座標(中心原点)への逆変換。
// boardLocalToScreenLocal3D()の厳密な逆関数(導出: k=1/(1+screenY*tanθ/F)。zoomの前段階では
// 常にz=0からスタートするため、旧版(2026-09-26。translateZ dolly方式)より式が単純になった。
function screenLocalToBoardLocal(screenX, screenY, cam) {
  const thetaX = (cam.rotateXDeg * Math.PI) / 180,
    thetaZ = (cam.rotateZDeg * Math.PI) / 180;
  const F = cam.perspectivePx,
    zoom = cam.zoom || 1;
  const cosX = Math.cos(thetaX),
    sinX = Math.sin(thetaX),
    cosZ = Math.cos(thetaZ),
    sinZ = Math.sin(thetaZ);
  const k = 1 / (1 + (screenY * Math.tan(thetaX)) / F);
  const xr = screenX * k,
    yy = screenY * k;
  const yr = cosX !== 0 ? yy / cosX : yy; // rotateXは0-80°にクランプするためcosX=0(90°)には到達しない
  const px1 = xr * cosZ + yr * sinZ; // rotateZの逆
  const py1 = -xr * sinZ + yr * cosZ;
  return { x: px1 / zoom, y: py1 / zoom };
}
// #board/#pl-boardの祖先を辿って見つける(トークン・壁・パネル等、深さの異なる子要素から共通に使えるように)
function findBoardEl(fromEl) {
  let n = fromEl;
  while (n) {
    if (n.id === 'board' || n.id === 'pl-board') return n;
    n = n.parentElement;
  }
  return null;
}
// クリック/ドラッグの clientX/clientY → 盤面%座標(0-100)。パン+3D変換の逆補正込み。
// boardEl には #board か #pl-board(またはその子孫)を渡す。
function clientToBoardPercent(clientX, clientY, fromEl) {
  const boardEl = findBoardEl(fromEl) || fromEl;
  const panEl = boardEl.parentElement; // #board-pan/#pl-board-pan。パンの平行移動が既に反映された実座標
  const panRect = panEl.getBoundingClientRect();
  const W = boardEl.offsetWidth,
    H = boardEl.offsetHeight;
  const sx = clientX - panRect.left,
    sy = clientY - panRect.top;
  const local = screenLocalToBoardLocal(sx - W / 2, sy - H / 2, boardCamera);
  const x = local.x + W / 2,
    y = local.y + H / 2;
  return {
    x: Math.max(0, Math.min(100, W > 0 ? (x / W) * 100 : 0)),
    y: Math.max(0, Math.min(100, H > 0 ? (y / H) * 100 : 0)),
  };
}
// 盤面ローカル座標(px,py)を、指定した画面位置(clientX,clientY)にちょうど重なるようpanX/panYを解く。
// パン・ズーム・オービットの「アンカー追従」は全てこの1関数を土台にする(design_doc_v0.md §9.12.0)。
function boardKeepAnchorAtScreenPoint(px, py, clientX, clientY, boardEl) {
  const panEl = boardEl.parentElement;
  const wrapEl = panEl.parentElement; // #board-wrap/#pl-board-wrap。パン変換のかかっていない基準矩形
  const wrapRect = wrapEl.getBoundingClientRect();
  const W = boardEl.offsetWidth,
    H = boardEl.offsetHeight;
  const s = boardLocalToScreenLocal3D(px, py, boardCamera);
  boardCamera.panX = clientX - wrapRect.left - W / 2 - s.x;
  boardCamera.panY = clientY - wrapRect.top - H / 2 - s.y;
}
function clampBoardCamera() {
  boardCamera.rotateXDeg = Math.max(0, Math.min(80, boardCamera.rotateXDeg)); // Axe実測の可動域(design_doc_v0.md §9.12.0)
  boardCamera.zoom = Math.max(0.35, Math.min(4, boardCamera.zoom)); // 逆変換の数値安定域を確保する安全マージン(独自)
}

/* ---- カメラ操作: パン・ズーム・オービット(直接操作。マウス+キーボード)。design_doc_v0.md §9.12.0 ---- */
let spaceHeldForPan = false; // Space+ドラッグ=パン(掴み分けルールの一部)
document.addEventListener('keydown', (ev) => {
  if (ev.code === 'Space' && !ev.repeat) spaceHeldForPan = true;
});
document.addEventListener('keyup', (ev) => {
  if (ev.code === 'Space') spaceHeldForPan = false;
});
let boardCameraInertiaRaf = null;
function stopBoardCameraInertia() {
  if (boardCameraInertiaRaf) {
    cancelAnimationFrame(boardCameraInertiaRaf);
    boardCameraInertiaRaf = null;
  }
}
function startBoardCameraInertia(velRotZ, velRotX) {
  stopBoardCameraInertia();
  if (!cameraInertiaEnabled) return;
  if (Math.abs(velRotZ) < 0.01 && Math.abs(velRotX) < 0.01) return;
  // §9.14.1(2026-09-27追補・手順0.d): 0.92(半減期約140ms・総回転量が離した瞬間の速度の約12.5倍)は
  // 「軽い慣性」と呼ぶには効きすぎていたため大幅に弱めた(0.68=半減期1フレーム強・総回転量は約3倍程度)。
  const decay = 0.68;
  const step = () => {
    velRotZ *= decay;
    velRotX *= decay;
    boardCamera.rotateZDeg += velRotZ;
    boardCamera.rotateXDeg += velRotX;
    clampBoardCamera();
    applyBoardCameraCss();
    if (Math.abs(velRotZ) > 0.02 || Math.abs(velRotX) > 0.02) {
      boardCameraInertiaRaf = requestAnimationFrame(step);
    } else {
      boardCameraInertiaRaf = null;
    }
  };
  boardCameraInertiaRaf = requestAnimationFrame(step);
}
function resetBoardCamera() {
  Object.assign(boardCamera, BOARD_CAMERA_DEFAULT);
  applyBoardCameraCss();
}
// Fキー: 表示中の全アクターが収まるようズーム・パンを調整(回転はそのまま)。
function fitBoardCameraToActors(boardId, panId, wrapId) {
  const boardEl = document.getElementById(boardId),
    wrapEl = document.getElementById(wrapId);
  if (!boardEl || !wrapEl) return;
  const actors = Object.values(state.actors).filter((a) => a.visible !== false);
  if (!actors.length) return;
  const W = boardEl.offsetWidth,
    H = boardEl.offsetHeight;
  if (!W || !H) return;
  // zoom=1・rotateXZは現状維持で、各アクターの盤面ローカル座標→screen-local座標(パン抜き)のAABBを求める
  const cam0 = Object.assign({}, boardCamera, { zoom: 1 });
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  actors.forEach((a) => {
    const px = (a.pos.x / 100) * W - W / 2,
      py = (a.pos.y / 100) * H - H / 2;
    const s = boardLocalToScreenLocal3D(px, py, cam0);
    minX = Math.min(minX, s.x);
    maxX = Math.max(maxX, s.x);
    minY = Math.min(minY, s.y);
    maxY = Math.max(maxY, s.y);
  });
  const wrapRect = wrapEl.getBoundingClientRect();
  const spanX = Math.max(40, maxX - minX),
    spanY = Math.max(40, maxY - minY);
  const pad = 0.75; // 余白(viewportの75%に収める)
  const zoomX = (wrapRect.width * pad) / spanX,
    zoomY = (wrapRect.height * pad) / spanY;
  boardCamera.zoom = Math.max(0.35, Math.min(4, Math.min(zoomX, zoomY)));
  const centerX = (minX + maxX) / 2,
    centerY = (minY + maxY) / 2;
  // 中心の盤面ローカル座標を再計算(ズーム変更後のscreenLocal3Dで合わせ直す)ことでcenterを画面中央に置く
  const anchorLocal = screenLocalToBoardLocal(centerX, centerY, cam0); // zoom=1時点でのローカル座標(zoom非依存)
  boardKeepAnchorAtScreenPoint(
    anchorLocal.x,
    anchorLocal.y,
    wrapRect.left + wrapRect.width / 2,
    wrapRect.top + wrapRect.height / 2,
    boardEl
  );
  applyBoardCameraCss();
}
function wireBoardCamera(wrapId, panId) {
  const wrapEl = document.getElementById(wrapId);
  const boardEl = document.getElementById(wrapId === 'board-wrap' ? 'board' : 'pl-board');
  if (!wrapEl || !boardEl) return;
  // ズーム(ホイール/ピンチ): カーソル位置の盤面点を不動点とするscale方式
  wrapEl.addEventListener(
    'wheel',
    (ev) => {
      ev.preventDefault();
      const before = clientToBoardPercentLocalPx(ev.clientX, ev.clientY, boardEl);
      const factor = ev.deltaY < 0 ? 1.1 : 1 / 1.1;
      boardCamera.zoom = Math.max(0.35, Math.min(4, boardCamera.zoom * factor));
      boardKeepAnchorAtScreenPoint(before.x, before.y, ev.clientX, ev.clientY, boardEl);
      applyBoardCameraCss();
    },
    { passive: false }
  );
  wrapEl.addEventListener('contextmenu', (ev) => ev.preventDefault());
  wrapEl.style.cursor = 'grab';
  // パン・オービット(掴み分けルール: 左クリックは空きスペースの時だけ、中クリック・右クリック・Space+左クリックは対象問わず)
  wrapEl.addEventListener('pointerdown', (ev) => {
    const isEmptyPress =
      ev.target === wrapEl || ev.button === 1 || ev.button === 2 || (ev.button === 0 && spaceHeldForPan);
    if (!isEmptyPress) return; // 左クリックが直接駒等の上ならそちら側のpointerdown(attachDrag等)に任せる
    if (ev.button !== 0 && ev.button !== 1 && ev.button !== 2) return;
    ev.preventDefault();
    stopBoardCameraInertia();
    const isOrbit = ev.button === 2;
    const pressTarget = ev.target;
    const startX = ev.clientX,
      startY = ev.clientY;
    let dragged = false,
      lastDx = 0,
      lastDy = 0,
      lastMoveT = performance.now();
    let velRotZ = 0,
      velRotX = 0;
    wrapEl.setPointerCapture(ev.pointerId);
    if (!isOrbit) wrapEl.style.cursor = 'grabbing';
    // アンカー点(掴んだ瞬間の盤面ローカル座標)を記録。以後、この点がカーソル直下(パン)/元の画面位置(オービット)に留まるよう解く
    const anchor = clientToBoardPercentLocalPx(startX, startY, boardEl);
    const baseRotX = boardCamera.rotateXDeg,
      baseRotZ = boardCamera.rotateZDeg;
    // §9.13.2(2026-09-27追補): 既定の回転方向を是正(反転)した。invertOrbitX/Yがtrueなら是正前の挙動に戻る。
    // 【裏取り注記】水平(X)は「ドラッグした方向へ世界が回る」の解析検証(tests.html)により反転を確定。
    // 垂直(Y)は指示文の具体例「上へ振ると見下ろし側(rotateXDeg=0に近づく)へ傾く」を解析すると、
    // 実は現状(反転前)のコードが既にこの通りの符号になっていた(applyCombatModeCameraLockの
    // rotateXDeg=0="真上視点"という既存の対応関係から逆算)。「両軸とも反転」という総括的な指示と、
    // この具体例が矛盾するため、より具体的で検証可能な記述を優先し、Yは既定を反転しないことにした
    // (PROGRESS.md参照。invertOrbitYで反転側にも切替可能にしてあるので、体感が違えばそちらへ)。
    const signX = invertOrbitX ? 1 : -1;
    const signY = invertOrbitY ? -1 : 1;
    const move = (mv) => {
      const dx = mv.clientX - startX,
        dy = mv.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragged = true;
      const now = performance.now();
      if (isOrbit) {
        // 支点(anchor)がドラッグ開始時の画面位置(startX,startY)にほぼ留まるよう、回転角の変更ごとにpanを解き直す
        boardCamera.rotateZDeg = baseRotZ + dx * 0.3 * signX; // 水平ドラッグ→Z軸回転(独自係数。design_doc_v0.md §9.12.0/9.13.2)
        boardCamera.rotateXDeg = Math.max(0, Math.min(80, baseRotX + dy * 0.3 * signY)); // 垂直ドラッグ→傾き(0-80°クランプ)
        boardKeepAnchorAtScreenPoint(anchor.x, anchor.y, startX, startY, boardEl);
        const dt = Math.max(1, now - lastMoveT);
        velRotZ = ((mv.clientX - (startX + lastDx)) * 0.3 * signX) / (dt / 16.7);
        velRotX = ((mv.clientY - (startY + lastDy)) * 0.3 * signY) / (dt / 16.7);
        lastDx = dx;
        lastDy = dy;
        lastMoveT = now;
      } else {
        // パン: アンカー点が常にカーソル直下に来るようpanを解く(ピクセル差分×係数方式は廃止)
        boardKeepAnchorAtScreenPoint(anchor.x, anchor.y, mv.clientX, mv.clientY, boardEl);
      }
      clampBoardCamera();
      applyBoardCameraCss();
    };
    const up = (uv) => {
      wrapEl.removeEventListener('pointermove', move);
      wrapEl.removeEventListener('pointerup', up);
      wrapEl.style.cursor = 'grab';
      if (isOrbit && dragged) startBoardCameraInertia(velRotZ, velRotX); // design_doc_v0.md §9.12.0「軽い慣性」
      if (isOrbit && !dragged) {
        // 右クリックでドラッグしなかった場合のみメニューを出す。対象が駒だったか空きスペースだったかで出し分ける
        const tokenEl = pressTarget.closest && pressTarget.closest('.token');
        if (tokenEl && tokenEl.dataset.id) openTokenContextMenu(uv.clientX, uv.clientY, tokenEl.dataset.id);
        else openTableContextMenu(uv.clientX, uv.clientY, wrapId);
      }
    };
    wrapEl.addEventListener('pointermove', move);
    wrapEl.addEventListener('pointerup', up);
  });
}
// clientToBoardPercent()の%版ではなく、盤面ローカルpx(中心原点)を返す下請け版(アンカー計算用)
function clientToBoardPercentLocalPx(clientX, clientY, boardEl) {
  const panEl = boardEl.parentElement;
  const panRect = panEl.getBoundingClientRect();
  const W = boardEl.offsetWidth,
    H = boardEl.offsetHeight;
  const sx = clientX - panRect.left,
    sy = clientY - panRect.top;
  return screenLocalToBoardLocal(sx - W / 2, sy - H / 2, boardCamera);
}
// 矢印キー(パン)・Shift+矢印(回転)・Ctrl+上下矢印(ズーム)・R(リセット)・F(全コマフィット)。入力欄フォーカス中は無効。
function wireBoardCameraKeyboard() {
  document.addEventListener('keydown', (ev) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (ev.key === 'r' || ev.key === 'R') {
      resetBoardCamera();
      return;
    }
    if (ev.key === 'f' || ev.key === 'F') {
      const isKp = !netClientMode && viewMode.role === 'kp';
      if (isKp) fitBoardCameraToActors('board', 'board-pan', 'board-wrap');
      else fitBoardCameraToActors('pl-board', 'pl-board-pan', 'pl-board-wrap');
      return;
    }
    const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!arrows.includes(ev.key)) return;
    ev.preventDefault();
    if (ev.ctrlKey || ev.metaKey) {
      if (ev.key === 'ArrowUp') boardCamera.zoom *= 1.1;
      else if (ev.key === 'ArrowDown') boardCamera.zoom *= 1 / 1.1;
    } else if (ev.shiftKey) {
      if (ev.key === 'ArrowLeft') boardCamera.rotateZDeg -= 2;
      else if (ev.key === 'ArrowRight') boardCamera.rotateZDeg += 2;
      else if (ev.key === 'ArrowUp') boardCamera.rotateXDeg -= 2;
      else if (ev.key === 'ArrowDown') boardCamera.rotateXDeg += 2;
    } else {
      if (ev.key === 'ArrowLeft') boardCamera.panX += 10;
      else if (ev.key === 'ArrowRight') boardCamera.panX -= 10;
      else if (ev.key === 'ArrowUp') boardCamera.panY += 10;
      else if (ev.key === 'ArrowDown') boardCamera.panY -= 10;
    }
    clampBoardCamera();
    applyBoardCameraCss();
  });
}
/* ---- §9.12.5(2026-09-27追補・仕上げ): "?"キーの操作ヘルプオーバーレイ ----
   【裏取り注記】この一覧に相当する常設ヘルプはdocs/axe_behavior_checklist.mdにも見当たらず、
   本コードベースには元々存在しなかった(第2夜の指示書は既存のものを想定していたが未着手のままだった)。
   このため「更新」ではなく新規作成として実装する。中身は本夜間作業(§9.12.0/1/2/3/7)で実際に実装した
   操作のみを列挙し、未実装の挙動は書かない。 */
function ensureHelpOverlay() {
  let el = document.getElementById('axe-help-overlay');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'axe-help-overlay';
  el.hidden = true;
  el.innerHTML = `
    <div class="axe-help-panel">
      <div class="axe-help-head"><b>操作ヘルプ</b><button type="button" data-act="help-close">✕</button></div>
      <div class="axe-help-body">
        <div class="ah-sec"><b>カメラ(直接操作。design_doc_v0.md §9.12.0/9.13.2)</b>
          <div>左ドラッグ(空きスペース)/中ドラッグ/Space+ドラッグ: パン(掴んだ点がカーソルに追従)</div>
          <div>右ドラッグ: オービット(横=回転、縦=傾き0〜80°)。動かさず離すと右クリックメニュー</div>
          <div>ホイール/ピンチ: カーソル位置を中心にズーム</div>
          <div>R: カメラをリセット / F: 全駒が収まるようフィット</div>
          <div>戦闘モードONで自動的に真上視点へ(手動オービットは以後も可)</div>
          <div>盤面右下の歯車アイコン: 慣性・真上視点固定・オービット反転(水平/垂直)をUIから切替</div>
        </div>
        <div class="ah-sec"><b>戦闘の自動化(§9.12.1)</b>
          <div>駒を右クリック→「この駒で攻撃を宣言…」→フォームで技能・ダメージダイス等を入力→対象クリックで命中判定〜ダメージまで自動進行</div>
          <div>攻撃を受けると回避/受け流し/受けるの選択が自動で出る(画面下部の点滅バナー)</div>
          <div>気絶/瀕死/死亡確定はconfig(npcAutoDefend/autoDeath)に応じて自動または/KP裁定チップで確認</div>
        </div>
        <div class="ah-sec"><b>呪文スタック(§9.12.2)</b>
          <div>スタックのカードをクリック: 呪文の詳細カードを表示</div>
          <div>スタックのカードにホバー: 盤面上の対象への線をハイライト</div>
          <div>応答手段の無いキャラ、または「常に自動パス」設定のキャラは自動でパスされる</div>
        </div>
        <div class="ah-sec"><b>移動(自動経路探索が主。§9.12.3)</b>
          <div>戦闘モード中、選択済みの自分の駒を再クリック(PLは1クリック)で移動モードへ</div>
          <div>盤面クリックで移動確定(青=通常MOV内、オレンジ=doubleMove域、赤=到達不能)。Escでキャンセル</div>
          <div>ヘッダーのアイコン(⤢)で到達可能範囲ハイライトの表示切替</div>
          <div>ドラッグでの自由移動(厳密な移動)は従来通りいつでも使える編集補助として残っている</div>
        </div>
        <div class="ah-sec"><b>画像・シーン管理(CCfolia式。§9.13.3)</b>
          <div>素材管理ウィンドウ: 複数ファイルのドラッグ&ドロップ一括登録、名前変更・用途タグ</div>
          <div>素材サムネイルを盤面へドラッグ&ドロップ→背景/前景/盤上パネルを選択</div>
          <div>素材サムネイルを駒へドラッグ&ドロップ→アイコン/立ち絵(差分名を入力)を選択</div>
          <div>盤上パネルは回転ハンドル・「最背面へ」に対応。シーンプリセットは背景+前景+盤上パネル一式を保存</div>
        </div>
        <div class="ah-sec"><b>体感フィードバック(§9.12.7/9.13.4)</b>
          <div>ヘッダーの⚡アイコンをクリック: 通常/控えめ/offを切替(自分の画面のみ)</div>
          <div>ネットワーク接続したPLの画面にも同じフィードバックが配信される(非公開ステータスは自動で除外)</div>
        </div>
        <div class="ah-sec"><b>見た目(§9.13.5)</b>
          <div>ヘッダーの三日月アイコン: 夜の卓(ダーク)/ライトテーマを切替(自分の画面のみ)</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);
  el.addEventListener('click', (ev) => {
    if (ev.target === el || ev.target.dataset.act === 'help-close') el.hidden = true;
  });
  return el;
}
function toggleHelpOverlay() {
  const el = ensureHelpOverlay();
  el.hidden = !el.hidden;
}
function wireHelpOverlayKey() {
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== '?') return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    ev.preventDefault();
    toggleHelpOverlay();
  });
}
/* ---- §9.13.2(2026-09-27追補): カメラ設定ウィジェット(歯車ポップオーバー) ---- */
/* ---- §9.14.1(2026-09-27追補・手順0.e): グローバルツールチップ層 ---- */
function ensureGlobalTooltip() {
  let el = document.getElementById('global-tooltip');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'global-tooltip';
  document.body.appendChild(el);
  return el;
}
function positionGlobalTooltip(targetEl, el) {
  const r = targetEl.getBoundingClientRect();
  const tw = el.offsetWidth,
    th = el.offsetHeight;
  let x = r.left + r.width / 2 - tw / 2;
  let y = r.bottom + 8;
  x = Math.max(4, Math.min(window.innerWidth - tw - 4, x));
  if (y + th > window.innerHeight - 4) y = Math.max(4, r.top - th - 8); // 下に収まらなければ上に出す
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}
function showGlobalTooltip(targetEl) {
  const text = targetEl.dataset.tip;
  if (!text) return;
  const el = ensureGlobalTooltip();
  el.textContent = text;
  el.classList.add('show');
  positionGlobalTooltip(targetEl, el);
}
function hideGlobalTooltip() {
  const el = document.getElementById('global-tooltip');
  if (el) el.classList.remove('show');
}
function wireGlobalTooltip() {
  // イベント委譲(document単位)にすることで、既存の29箇所のdata-tip属性・実行時に動的更新する4箇所(§9.14.1調査参照)
  // のどちらも個別配線なしでそのまま拾える。
  document.addEventListener('pointerover', (ev) => {
    const t = ev.target.closest && ev.target.closest('[data-tip]');
    if (t) showGlobalTooltip(t);
  });
  document.addEventListener('pointerout', (ev) => {
    const t = ev.target.closest && ev.target.closest('[data-tip]');
    if (t && !(ev.relatedTarget && t.contains(ev.relatedTarget))) hideGlobalTooltip();
  });
  // 表示中に祖先がスクロールすると位置がずれるため、簡易的に非表示にする(捕捉フェーズで全スクロールを拾う)
  document.addEventListener('scroll', () => hideGlobalTooltip(), true);
}
function ensureCameraSettingsPopover() {
  let el = document.getElementById('cam-settings-popover');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'cam-settings-popover';
  el.hidden = true;
  el.innerHTML = `
    <label><input type="checkbox" id="camCfgInertia"> 慣性(オービット後の余韻)</label>
    <label><input type="checkbox" id="camCfgTopDownLock"> 戦闘モードで真上視点に固定</label>
    <label><input type="checkbox" id="camCfgInvertX"> 水平オービットを反転(是正前の挙動)</label>
    <label><input type="checkbox" id="camCfgInvertY"> 垂直オービットを反転</label>
  `;
  document.body.appendChild(el);
  el.querySelector('#camCfgInertia').addEventListener('change', (ev) => {
    cameraInertiaEnabled = ev.target.checked;
  });
  el.querySelector('#camCfgTopDownLock').addEventListener('change', (ev) => {
    combatLockTopDown = ev.target.checked;
  });
  el.querySelector('#camCfgInvertX').addEventListener('change', (ev) => {
    invertOrbitX = ev.target.checked;
  });
  el.querySelector('#camCfgInvertY').addEventListener('change', (ev) => {
    invertOrbitY = ev.target.checked;
  });
  document.addEventListener('pointerdown', (ev) => {
    if (el.hidden) return;
    if (el.contains(ev.target) || ev.target.closest('.cam-settings-btn')) return;
    el.hidden = true;
  });
  return el;
}
function toggleCameraSettingsPopover(anchorEl) {
  const el = ensureCameraSettingsPopover();
  if (!el.hidden) {
    el.hidden = true;
    return;
  }
  el.querySelector('#camCfgInertia').checked = cameraInertiaEnabled;
  el.querySelector('#camCfgTopDownLock').checked = combatLockTopDown;
  el.querySelector('#camCfgInvertX').checked = invertOrbitX;
  el.querySelector('#camCfgInvertY').checked = invertOrbitY;
  const r = anchorEl.getBoundingClientRect();
  el.style.left = Math.max(4, r.right - 220) + 'px';
  el.style.top = r.top - 8 - 132 + 'px'; // ボタンの上に開く(4項目分の概算高さ)
  el.hidden = false;
}
// 戦闘モードON時、combatLockTopDownが有効なら真上視点へ自動遷移(以後の手動オービットは可。design_doc_v0.md §9.12.0)
function applyCombatModeCameraLock(enabled) {
  if (!enabled || !combatLockTopDown) return;
  boardCamera.rotateXDeg = 0;
  boardCamera.rotateZDeg = 0;
  applyBoardCameraCss();
}

/* ---- 右クリックメニュー本体。docs/axe_behavior_checklist.md (c)参照 ---- */
function closeContextMenu() {
  const el = document.getElementById('axe-ctx-menu-root');
  if (el) el.remove();
  document.removeEventListener('pointerdown', closeContextMenuOnOutside, true);
  document.removeEventListener('keydown', closeContextMenuOnEscape, true);
}
function closeContextMenuOnOutside(ev) {
  const el = document.getElementById('axe-ctx-menu-root');
  if (el && !el.contains(ev.target)) closeContextMenu();
}
function closeContextMenuOnEscape(ev) {
  if (ev.key === 'Escape') closeContextMenu();
}
// items: [{label, action, danger?}, "sep", ...]。空配列なら何も表示しない(=何も出さないという明示的な非表示)
function showContextMenu(clientX, clientY, items) {
  closeContextMenu();
  if (!items || !items.length) return;
  const el = document.createElement('div');
  el.id = 'axe-ctx-menu-root';
  el.className = 'axe-ctx-menu';
  items.forEach((item) => {
    if (item === 'sep') {
      const sep = document.createElement('div');
      sep.className = 'axe-ctx-sep';
      el.appendChild(sep);
      return;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'axe-ctx-item' + (item.danger ? ' danger' : '');
    btn.textContent = item.label;
    btn.addEventListener('click', () => {
      closeContextMenu();
      item.action();
    });
    el.appendChild(btn);
  });
  document.body.appendChild(el);
  const rect = el.getBoundingClientRect();
  const x = Math.max(4, Math.min(window.innerWidth - rect.width - 4, clientX));
  const y = Math.max(4, Math.min(window.innerHeight - rect.height - 4, clientY));
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  setTimeout(() => {
    document.addEventListener('pointerdown', closeContextMenuOnOutside, true);
    document.addEventListener('keydown', closeContextMenuOnEscape, true);
  }, 0);
}
/* ---- §9.13.3(2026-09-27追補): 小さな1行テキスト入力ポップオーバー(prompt()を使わない軽量な代替) ---- */
function ensureInlineTextPromptEl() {
  let el = document.getElementById('inline-text-prompt');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'inline-text-prompt';
  el.hidden = true;
  el.innerHTML = `<input type="text" id="itpInput"><button type="button" id="itpOk" class="primary">OK</button><button type="button" id="itpCancel">✕</button>`;
  document.body.appendChild(el);
  return el;
}
function showInlineTextPrompt(clientX, clientY, placeholder, defaultValue, onSubmit) {
  const el = ensureInlineTextPromptEl();
  const input = el.querySelector('#itpInput');
  const okBtn = el.querySelector('#itpOk'),
    cancelBtn = el.querySelector('#itpCancel');
  input.placeholder = placeholder || '';
  input.value = defaultValue || '';
  el.style.left = Math.max(4, Math.min(window.innerWidth - 230, clientX)) + 'px';
  el.style.top = Math.max(4, Math.min(window.innerHeight - 46, clientY)) + 'px';
  el.hidden = false;
  input.focus();
  const cleanup = () => {
    el.hidden = true;
    okBtn.removeEventListener('click', onOk);
    cancelBtn.removeEventListener('click', onCancel);
    input.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onOutside, true);
  };
  const onOk = () => {
    const v = input.value.trim();
    cleanup();
    if (v) onSubmit(v);
  };
  const onCancel = () => cleanup();
  const onKey = (ev) => {
    if (ev.key === 'Enter') onOk();
    else if (ev.key === 'Escape') onCancel();
  };
  const onOutside = (ev) => {
    if (!el.contains(ev.target)) cleanup();
  };
  okBtn.addEventListener('click', onOk);
  cancelBtn.addEventListener('click', onCancel);
  input.addEventListener('keydown', onKey);
  setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
}
/* ---- §9.14(Node導入後の再開分。confirm()残党の一掃): window.confirm()の代わりの軽量な確認ポップオーバー ----
   docs/axe_parity.md「confirm-dialog」行(todo)の解消。位置決め用のclientX/clientYを必要としない
   (呼び出し元の大半がクリック座標を持たないため)、画面上部中央への固定表示とする。 */
function ensureInlineConfirmEl() {
  let el = document.getElementById('inline-confirm');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'inline-confirm';
  el.hidden = true;
  el.innerHTML = `<div class="icf-msg" id="icfMsg"></div><div class="icf-btns"><button type="button" id="icfCancel">キャンセル</button><button type="button" id="icfOk" class="danger">削除する</button></div>`;
  document.body.appendChild(el);
  return el;
}
function showInlineConfirm(message, onConfirm, opts) {
  opts = opts || {};
  const el = ensureInlineConfirmEl();
  el.querySelector('#icfMsg').textContent = message;
  const okBtn = el.querySelector('#icfOk'),
    cancelBtn = el.querySelector('#icfCancel');
  okBtn.textContent = opts.okLabel || '削除する';
  el.hidden = false;
  const cleanup = () => {
    el.hidden = true;
    okBtn.removeEventListener('click', onOk);
    cancelBtn.removeEventListener('click', onCancel);
    document.removeEventListener('keydown', onKey);
  };
  const onOk = () => {
    cleanup();
    onConfirm();
  };
  const onCancel = () => {
    cleanup();
    if (opts.onCancel) opts.onCancel();
  };
  const onKey = (ev) => {
    if (ev.key === 'Escape') onCancel();
    else if (ev.key === 'Enter') onOk();
  };
  okBtn.addEventListener('click', onOk);
  cancelBtn.addEventListener('click', onCancel);
  document.addEventListener('keydown', onKey);
}
// 卓面(空きスペース)の右クリックメニュー。docs/axe_behavior_checklist.md (c-1)の判断により、
// Axeの「オブジェクト作成」系メニューの大半(カード/コイン/光源等)は本ツールに該当オブジェクトが無いため非対応。
// 「キャラクターを作成」のみ既存機能と対応付けられるため、KP視点限定でここに載せる。
function openTableContextMenu(clientX, clientY, wrapId) {
  if (netClientMode || viewMode.role !== 'kp') {
    showContextMenu(clientX, clientY, []);
    return;
  }
  showContextMenu(clientX, clientY, [{ label: 'キャラクターを追加', action: () => openActorModal(null) }]);
}
function duplicateActor(id) {
  const src = state.actors[id];
  if (!src) return;
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = uid('actor');
  copy.name = src.name + 'のコピー';
  copy.pos = { x: Math.max(0, Math.min(100, src.pos.x + 4)), y: Math.max(0, Math.min(100, src.pos.y + 4)) };
  copy.ownerConn = null;
  state.actors[copy.id] = copy;
  logSystem(`キャラクターを複製: ${copy.name}`);
  persist();
  render();
}
function deleteActorById(id) {
  const a = state.actors[id];
  if (!a) return;
  showInlineConfirm(`${a.name} を削除しますか?`, () => {
    delete state.actors[id];
    if (selectedActorId === id) selectedActorId = null;
    logSystem('キャラクター削除: ' + a.name);
    persist();
    render();
  });
}
// 駒(キャラクター)の右クリックメニュー。docs/axe_behavior_checklist.md (c-2)の判断により、
// Axeの18項目の大半(バフ編集・視界光源設定・厳密な移動・インベントリ管理等)は本ツールに
// 対応するサブシステムが無いため非対応。「詳細を表示(編集)」「コピーを作る」「削除する」のみ実装(KP専用)。
function openTokenContextMenu(clientX, clientY, actorId) {
  if (netClientMode || viewMode.role !== 'kp') {
    showContextMenu(clientX, clientY, []);
    return;
  }
  const a = state.actors[actorId];
  if (!a) return;
  const moveItems = state.scene.grid.enabled
    ? [{ label: 'この駒を移動…(自動経路)', action: () => startMovementDraft(actorId) }] // §9.12.3(2026-09-27追補)
    : [];
  showContextMenu(clientX, clientY, [
    { label: 'この駒で攻撃を宣言…', action: () => startAttackDraft(actorId) }, // §9.12.1(2026-09-27)
    ...moveItems,
    { label: '編集(詳細を表示)', action: () => openActorModal(actorId) },
    { label: 'コピーを作る', action: () => duplicateActor(actorId) },
    'sep',
    { label: '削除する', danger: true, action: () => deleteActorById(actorId) },
  ]);
}

/* ---- §9.12.1(2026-09-27) 物理攻撃の宣言(対象クリック)フロー。design_doc_v0.md §9.12.1 ----
   スペルブックのcastDraftと同じ「宣言→ターゲティングモード→対象クリックで確定」の流れを、
   物理攻撃にも適用する。
   §9.13.5(2026-09-27追補): 技能名・ダメージダイス等の入力は連続prompt()方式だったのを、
   castDraft/attackDraftと同型の下書き状態(attackFormDraft)+インラインフォームへ置換した
   (design_doc_v0.md §9.13.5「prompt()残党の一掃」)。 */
let attackDraft = null; // {attackerId, skill, damageDice, pierce, melee}
let attackFormDraft = null; // {attackerId} — フォーム入力中の下書き(attackDraft確定前の段階)
function startAttackDraft(attackerId) {
  const a = state.actors[attackerId];
  if (!a) return;
  const skillNames = Object.keys(a.skills || {});
  if (!skillNames.length) {
    logError(`攻撃失敗: ${a.name} は技能を持っていません(キャラ編集で技能を追加してください)`);
    return;
  }
  attackFormDraft = { attackerId };
  render();
}
function cancelAttackFormDraft() {
  attackFormDraft = null;
  render();
}
function confirmAttackFormDraft() {
  if (!attackFormDraft) return;
  const a = state.actors[attackFormDraft.attackerId];
  if (!a) {
    attackFormDraft = null;
    render();
    return;
  }
  const skillSel = document.getElementById('afSkillSelect');
  const skillOther = document.getElementById('afSkillOther');
  const skill = skillSel.value === '__other__' ? skillOther.value.trim() : skillSel.value;
  if (!skill || !(skill in a.skills)) {
    logError(`攻撃失敗: 技能「${skill || '(未指定)'}」は${a.name}が持っていません`);
    return;
  }
  const damageDice = document.getElementById('afDamageDice').value.trim() || '1d6';
  const melee = !document.getElementById('afRanged').checked;
  const pierce = parseInt(document.getElementById('afPierce').value, 10) || 0;
  attackDraft = { attackerId: a.id, skill, damageDice, pierce, melee };
  attackFormDraft = null;
  logSystem(`${a.name} が攻撃対象を選択中… 盤面の駒をクリックしてください`);
  render();
}
function renderAttackFormPrompt() {
  let el = document.getElementById('attack-form-prompt');
  if (!attackFormDraft) {
    if (el) el.hidden = true;
    return;
  }
  const a = state.actors[attackFormDraft.attackerId];
  if (!a) {
    attackFormDraft = null;
    return;
  }
  if (!el) {
    el = document.createElement('div');
    el.id = 'attack-form-prompt';
    document.body.appendChild(el);
  }
  const skillNames = Object.keys(a.skills || {});
  const options =
    skillNames.map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(k)}(${a.skills[k]})</option>`).join('') +
    `<option value="__other__">その他(手入力)…</option>`;
  el.innerHTML = `
    <div class="af-title">${escapeHtml(a.name)} の攻撃を宣言</div>
    <label>技能<select id="afSkillSelect">${options}</select></label>
    <input type="text" id="afSkillOther" placeholder="技能名(その他選択時)" hidden>
    <label>ダメージダイス<input type="text" id="afDamageDice" value="1d6" placeholder="例: 1d6+1"></label>
    <label class="af-check"><input type="checkbox" id="afRanged"> 遠隔攻撃</label>
    <label>貫通値<input type="number" id="afPierce" value="0"></label>
    <div class="af-actions">
      <button type="button" id="afCancel">キャンセル</button>
      <button type="button" id="afConfirm" class="primary">対象を選ぶ…</button>
    </div>
  `;
  el.hidden = false;
  const skillSel = el.querySelector('#afSkillSelect');
  const otherInput = el.querySelector('#afSkillOther');
  skillSel.addEventListener('change', () => {
    otherInput.hidden = skillSel.value !== '__other__';
    if (!otherInput.hidden) otherInput.focus();
  });
  el.querySelector('#afCancel').addEventListener('click', cancelAttackFormDraft);
  el.querySelector('#afConfirm').addEventListener('click', confirmAttackFormDraft);
  // フォーム内のinput/selectにフォーカスがある間はグローバルEscapeハンドラが素通しするため、ここで個別に拾う
  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') cancelAttackFormDraft();
  });
}
async function fireAttackDraft(targetId) {
  if (!attackDraft) return;
  const intent = {
    type: 'attack',
    attackerId: attackDraft.attackerId,
    targetId,
    skill: attackDraft.skill,
    damageDice: attackDraft.damageDice,
    pierce: attackDraft.pierce,
    melee: attackDraft.melee,
  };
  attackDraft = null;
  const result = await resolve(state, intent);
  state = result.newState;
  persist();
  render();
  processFeedbackEvents(result.events, state); // §9.12.7(2026-09-27追補)
  netBroadcastEvents(result.events, state); // §9.13.4(2026-09-27追補)
}
// §9.12.1: 解決待ちの物理攻撃(state.pendingAttack)がある間、対象の操作者(PLは自分の駒の時のみ、KPは常に)へ
// 回避/受け流し/受けるの選択プロンプトを自動表示する(「攻撃宣言→命中ロール自動→防御選択」の自動フローの一部)。
async function defendPromptAction(mode) {
  const vs = currentChatViewState();
  const pa = vs.pendingAttack;
  if (!pa) return;
  let skill = null;
  if (mode === 'parry') {
    const target = vs.actors[pa.targetId];
    const names = Object.keys((target && target.skills) || {});
    skill = prompt(`受け流しに使う技能名を入力してください(候補: ${names.join('/')})`, names[0] || '');
    if (!skill) return;
  }
  const intent = { type: 'defend', targetId: pa.targetId, mode, skill };
  if (!netClientMode && viewMode.role === 'kp') {
    const result = await resolve(state, intent);
    state = result.newState;
    persist();
    render();
    processFeedbackEvents(result.events, state); // §9.12.7(2026-09-27追補)
    netBroadcastEvents(result.events, state); // §9.13.4(2026-09-27追補)
  } else {
    await dispatchPlIntent(intent);
  }
}
function renderDefendPrompt() {
  let el = document.getElementById('axe-defend-prompt');
  const vs = currentChatViewState();
  const pa = vs.pendingAttack;
  let show = false,
    target = null,
    attacker = null;
  if (pa) {
    target = vs.actors[pa.targetId];
    attacker = vs.actors[pa.attackerId];
    if (!netClientMode && viewMode.role === 'kp') show = !!target;
    else show = !!target && pa.targetId === viewMode.actorId;
  }
  if (!show) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('div');
    el.id = 'axe-defend-prompt';
    el.className = 'axe-defend-prompt';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div class="adp-text">${escapeHtml(attacker ? attacker.name : '?')} の攻撃! ${escapeHtml(target ? target.name : '?')} はどう応じますか?</div>
    <div class="adp-actions">
      <button type="button" data-mode="dodge">回避</button>
      <button type="button" data-mode="parry">受け流し</button>
      <button type="button" class="primary" data-mode="accept">受ける</button>
    </div>
  `;
  el.querySelectorAll('button').forEach((b) => (b.onclick = () => defendPromptAction(b.dataset.mode)));
}

/* ============================================================
   §9.12.3(2026-09-27追補) 移動UI刷新(自動経路探索・到達可能範囲ハイライト・分割移動)。
   design_doc_v0.md §9.12.3参照。エンジン側の純粋関数(computeMovementField等)は
   §9.2/9.5のグリッド関数群(gridCellPct等)の直後に定義済み。ここはUI層のみ。
   「厳密な移動」(従来のドラッグ移動。attachDrag)は削除せず、編集補助として並存させる
   (自動経路のクリック確定が主モード、ドラッグはいつでも使える副モードという位置づけ)。
   ============================================================ */
let movementDraft = null; // { actorId, field, hoverCell:{c,r}|null }
let showReachableHighlight = true; // ローカルのみ(同期しない)。btnToggleMoveReachで切替
function isMyControllableActor(actorId) {
  if (viewMode.role === 'kp' && !netClientMode) return true;
  return actorId === viewMode.actorId;
}
function startMovementDraft(actorId) {
  const actor = state.actors[actorId];
  if (!actor) return;
  // maxCostは指定しない(=盤面全域をフラッド探索)。到達可能ハイライトの色分け(通常MOV/doubleMove/それ以上)は
  // 表示側でコスト値と閾値を比較して決めるため、探索自体は打ち切らない方が「あと少しで届かない」ことも
  // 経路の途中から赤くする表現(§9.12.3の要求)に使える。
  movementDraft = { actorId, field: computeMovementField(state, actorId, undefined), hoverCell: null };
  logSystem(`${actor.name} の移動先を選択中… 盤面をクリックして移動を確定(Escでキャンセル)`); // logSystem内でrender()される
}
function cancelMovementDraft() {
  if (!movementDraft) return;
  movementDraft = null;
  render();
}
// field(computeMovementFieldの結果)とpath(起点含むセル列)から、通常MOV以内/doubleMove範囲内/それ超過の
// 3区間に色分けする(§9.12.3: 「移動距離超過分は途中から赤くなる」の実装)。境界セル単位での簡略な分割。
function pathSegmentsByBudget(field, path, mov, doubleBudget) {
  const buckets = { normal: [], warn: [], unreachable: [] };
  const bucketOf = (cost) => (cost <= mov + 1e-9 ? 'normal' : cost <= doubleBudget + 1e-9 ? 'warn' : 'unreachable');
  let prevBucket = bucketOf(field.dist.get(cellKey(path[0].c, path[0].r)) || 0);
  buckets[prevBucket].push(path[0]);
  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    const cost = field.dist.get(cellKey(p.c, p.r));
    const bucket = bucketOf(cost);
    if (bucket !== prevBucket) buckets[bucket].push(path[i - 1]); // 区間の切れ目を橋渡し(線を繋げる)
    buckets[bucket].push(p);
    prevBucket = bucket;
  }
  return buckets;
}
function renderMovementOverlayInto(hostId) {
  const el = document.getElementById(hostId);
  if (!el) return;
  if (!movementDraft) {
    el.innerHTML = '';
    return;
  }
  const { actorId, field, hoverCell } = movementDraft;
  const actor = state.actors[actorId];
  if (!actor || !field) {
    el.innerHTML = '';
    return;
  }
  const mov = actorMov(state, actor);
  const doubleMove = (state.config.combat && state.config.combat.doubleMove) || 2;
  const remainingBudget = Math.max(0, mov * doubleMove - (actor.movUsedThisRound || 0));
  const remainingMov = Math.max(0, mov - (actor.movUsedThisRound || 0));
  const cellPct = gridCellPct(state);
  const parts = [];

  if (showReachableHighlight) {
    field.dist.forEach((cost, key) => {
      if (key === cellKey(field.start.c, field.start.r)) return;
      const cls =
        cost <= remainingMov + 1e-9 ? 'mv-reach-normal' : cost <= remainingBudget + 1e-9 ? 'mv-reach-warn' : null;
      if (!cls) return;
      const [c, r] = key.split(',').map(Number);
      parts.push(
        `<div class="mv-reach-cell ${cls}" style="left:${c * cellPct}%; top:${r * cellPct}%; width:${cellPct}%; height:${cellPct}%;"></div>`
      );
    });
  }

  if (hoverCell) {
    const result = reconstructPathFromField(field, hoverCell);
    if (result && result.path.length) {
      const segs = pathSegmentsByBudget(field, result.path, remainingMov, remainingBudget);
      ['normal', 'warn', 'unreachable'].forEach((bucket) => {
        if (segs[bucket].length < 2) return;
        const pts = segs[bucket].map((p) => cellToPosCenter(state, p));
        const svgPoints = pts.map((p) => `${p.x},${p.y}`).join(' ');
        const cls = bucket === 'normal' ? 'seg-normal' : bucket === 'warn' ? 'seg-warn' : 'seg-unreachable';
        parts.push(
          `<svg class="mv-ribbon-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline class="${cls}" points="${svgPoints}"/></svg>`
        );
      });
      const pathColorClass =
        result.cost > remainingBudget + 1e-9
          ? 'mv-path-unreachable'
          : result.cost > remainingMov + 1e-9
            ? 'mv-path-warn'
            : '';
      result.path.forEach((p, i) => {
        if (i === 0) return;
        const pt = cellToPosCenter(state, p);
        parts.push(`<div class="mv-step-dot ${pathColorClass}" style="left:${pt.x}%; top:${pt.y}%;"></div>`);
      });
      const destPt = cellToPosCenter(state, hoverCell);
      parts.push(
        `<div class="mv-distance-label ${pathColorClass}" style="left:${destPt.x}%; top:${destPt.y}%;">${result.cost}/${mov}マス</div>`
      );
      parts.push(`<div class="mv-ghost-token ${pathColorClass}" style="left:${destPt.x}%; top:${destPt.y}%;"></div>`);
    }
  }
  el.innerHTML = parts.join('');
}
function renderMovementOverlays() {
  renderMovementOverlayInto('board-move-overlay');
  renderMovementOverlayInto('pl-board-move-overlay');
}
async function confirmMovementDraft(toCell) {
  if (!movementDraft) return;
  const { actorId, field } = movementDraft;
  const result = reconstructPathFromField(field, toCell);
  if (!result) {
    logError('移動失敗: そのマスには到達できません');
    return;
  } // budget以内かは engine側(handleMoveConfirmIntent)が最終判定するため、ここはfield上の到達可能性のみの軽い事前チェック
  const tokenEl = findTokenElById(actorId);
  const fromRect = tokenEl ? tokenEl.getBoundingClientRect() : null;
  movementDraft = null;
  const intent = { type: 'moveConfirm', actorId, toCell };
  if (!netClientMode && viewMode.role === 'kp') {
    const r = await resolve(state, intent);
    state = r.newState;
    persist();
    render();
    processFeedbackEvents(r.events, state); // §9.12.7(2026-09-27追補)
    netBroadcastEvents(r.events, state); // §9.13.4(2026-09-27追補)
  } else {
    await dispatchPlIntent(intent);
  }
  // §9.12.3: 「勝手に進み、間違いだけ拾う」(Item1と同じ思想)。状態更新は待たせず、見た目の追従だけ軽いWAAPIで演出する(fire-and-forget)。
  if (fromRect) {
    const newTokenEl = findTokenElById(actorId);
    if (newTokenEl && newTokenEl.animate) {
      const toRect = newTokenEl.getBoundingClientRect();
      const dx = fromRect.left - toRect.left,
        dy = fromRect.top - toRect.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const base = newTokenEl.style.transform || '';
        try {
          newTokenEl.animate([{ transform: `translate(${dx}px, ${dy}px) ${base}` }, { transform: base }], {
            duration: 260,
            easing: 'ease-out',
          });
        } catch (e) {
          /* WAAPI未対応環境では演出のみ諦める(fire-and-forget) */
        }
      }
    }
  }
}
// §9.9のwireAoeBoardClickと同じ「駒コンテナの空きスペースクリック」パターンを流用する。
function wireMovementBoardInteraction(tokensElId, boardElId) {
  const tokensEl = document.getElementById(tokensElId);
  const boardEl = document.getElementById(boardElId);
  if (!tokensEl || !boardEl) return;
  tokensEl.addEventListener('pointermove', (ev) => {
    if (!movementDraft) return;
    const pt = clientToBoardPercent(ev.clientX, ev.clientY, boardEl);
    const cell = posToCell(state, pt);
    if (!movementDraft.hoverCell || movementDraft.hoverCell.c !== cell.c || movementDraft.hoverCell.r !== cell.r) {
      movementDraft.hoverCell = cell;
      renderMovementOverlays();
    }
  });
  tokensEl.addEventListener('click', (ev) => {
    if (!movementDraft) return;
    if (ev.target !== tokensEl) return; // 駒本体のクリックは各駒のclickハンドラに任せる(自分の駒を再クリック=キャンセル代わりにはしない)
    const pt = clientToBoardPercent(ev.clientX, ev.clientY, boardEl);
    const cell = posToCell(state, pt);
    confirmMovementDraft(cell);
  });
}

/* ============================================================
   §9.12.7(2026-09-27追補) 数値変化の体感フィードバック。
   design_doc_v0.md §9.12.7参照。これは§3演出層(幕・立ち絵・カットイン)ではなくUIフィードバックであり、
   夜間作業の禁止事項(§3着手禁止)の対象外として扱う。CSS Animation + Web Animations APIのみ、外部ライブラリ不使用。
   fire-and-forget: state適用(render()まで)を一切遅延させない。events[]を購読する形にし、
   ロード/再接続時の過去イベント再生はしない(各resolve()呼び出し直後にその場のeventsだけを処理する。
   ページ読み込み時にstate.log等を遡ってこの関数を呼ぶ処理は存在しない=再生されない)。
   ============================================================ */
// §9.13.5(2026-09-27追補): ダークテーマ「夜の卓」既定化。per-viewerのローカル設定(effectIntensityと同じ扱い)
let uiTheme = 'dark'; // "dark" | "light"
(function initUiTheme() {
  try {
    const saved = localStorage.getItem('nepheria_uiTheme');
    if (saved === 'dark' || saved === 'light') uiTheme = saved;
  } catch (e) {
    /* localStorage不可環境では既定(dark)のまま */
  }
  document.documentElement.setAttribute('data-theme', uiTheme);
})();
function toggleUiTheme() {
  uiTheme = uiTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', uiTheme);
  try {
    localStorage.setItem('nepheria_uiTheme', uiTheme);
  } catch (e) {}
  const btn = document.getElementById('btnUiTheme');
  if (btn)
    btn.dataset.tip =
      '見た目: ' + (uiTheme === 'dark' ? '夜の卓(ダーク)' : 'ライト') + '(クリックで切替。自分の画面のみ)';
}
let effectIntensity = 'normal'; // "off" | "subdued" | "normal"。ローカルのみ(state.configには入れない。per-viewerの表示設定のため)
(function initEffectIntensity() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) effectIntensity = 'subdued';
    const saved = localStorage.getItem('nepheria_effectIntensity');
    if (saved === 'off' || saved === 'subdued' || saved === 'normal') effectIntensity = saved;
  } catch (e) {
    /* localStorage不可環境(プライベートモード等)ではnormal/subdued既定のままにする */
  }
})();
function cycleEffectIntensity() {
  effectIntensity = effectIntensity === 'normal' ? 'subdued' : effectIntensity === 'subdued' ? 'off' : 'normal';
  try {
    localStorage.setItem('nepheria_effectIntensity', effectIntensity);
  } catch (e) {}
  const btn = document.getElementById('btnEffectIntensity');
  if (btn) btn.dataset.tip = '数値変化の体感フィードバック: ' + effectIntensity + '(クリックで切替。自分の画面のみ)';
}
function feedbackMagnitude(amount, max) {
  if (!max || max <= 0) return 'normal';
  return Math.abs(amount) / max >= 0.3 ? 'strong' : 'normal';
}
// events[]の1要素 → 体感フィードバックの記述子への変換(DOM操作を含まない純粋関数。テスト対象はここまで)。
// 未対応のev.evはnullを返し、呼び出し側は何もしない(安全側)。
function classifyFeedbackEvent(ev, state) {
  const actors = (state && state.actors) || {};
  switch (ev.ev) {
    case 'damage.apply': {
      const a = actors[ev.target];
      return {
        kind: 'hp-loss',
        targetId: ev.target,
        amount: ev.amount,
        isCrit: false,
        magnitude: feedbackMagnitude(ev.amount, a && a.stats.maxHp),
        floaterText: '-' + ev.amount,
      };
    }
    case 'attack.damage.apply': {
      const a = actors[ev.targetId];
      const mag = feedbackMagnitude(ev.amount, a && a.stats.maxHp);
      return {
        kind: 'hp-loss',
        targetId: ev.targetId,
        amount: ev.amount,
        isCrit: !!ev.isCrit,
        magnitude: ev.isCrit ? 'strong' : mag,
        floaterText: '-' + ev.amount,
      };
    }
    case 'heal.apply': {
      const a = actors[ev.target];
      return {
        kind: 'hp-gain',
        targetId: ev.target,
        amount: ev.amount,
        isCrit: false,
        magnitude: feedbackMagnitude(ev.amount, a && a.stats.maxHp),
        floaterText: '+' + ev.amount,
      };
    }
    case 'hp.direct': {
      const a = actors[ev.target];
      const mag = feedbackMagnitude(ev.amount, a && a.stats.maxHp);
      return ev.amount < 0
        ? {
            kind: 'hp-loss',
            targetId: ev.target,
            amount: ev.amount,
            isCrit: false,
            magnitude: mag,
            floaterText: String(ev.amount),
          }
        : {
            kind: 'hp-gain',
            targetId: ev.target,
            amount: ev.amount,
            isCrit: false,
            magnitude: mag,
            floaterText: '+' + ev.amount,
          };
    }
    case 'mp.apply':
    case 'mp.direct': {
      const a = actors[ev.target];
      return {
        kind: 'mp-change',
        targetId: ev.target,
        amount: ev.amount,
        isCrit: false,
        magnitude: feedbackMagnitude(ev.amount, a && a.stats.maxMp),
        floaterText: (ev.amount >= 0 ? '+' : '') + ev.amount + 'MP',
      };
    }
    case 'san.direct': {
      const a = actors[ev.target];
      const mag = feedbackMagnitude(ev.amount, a && a.stats.maxSan);
      return ev.amount < 0
        ? {
            kind: 'san-loss',
            targetId: ev.target,
            amount: ev.amount,
            isCrit: false,
            magnitude: mag,
            floaterText: String(ev.amount) + 'SAN',
          }
        : {
            kind: 'san-gain',
            targetId: ev.target,
            amount: ev.amount,
            isCrit: false,
            magnitude: mag,
            floaterText: '+' + ev.amount + 'SAN',
          };
    }
    case 'resist.apply':
      return { kind: 'resist-tick', targetId: ev.target, amount: ev.amount, isCrit: false, magnitude: 'normal' };
    case 'resist.locked':
      return {
        kind: 'lock-onset',
        targetId: ev.target,
        amount: ev.rounds,
        isCrit: false,
        magnitude: 'strong',
        floaterText: '詠唱不能',
      };
    case 'status.apply': {
      const threshold = ev.id === '気絶' || ev.id === '瀕死' || ev.id === '死亡';
      const stacksTag = ev.stacks !== undefined && ev.stacks !== 1 ? (ev.stacks > 0 ? '+' : '') + ev.stacks : '';
      return {
        kind: threshold ? 'status-threshold' : 'status-apply',
        targetId: ev.target,
        statusId: ev.id,
        stacks: ev.stacks,
        isCrit: false,
        magnitude: threshold ? 'strong' : 'normal',
        floaterText: '[' + ev.id + stacksTag + ']',
      };
    }
    case 'status.cleanse':
      return {
        kind: 'status-cleanse',
        targetId: ev.target,
        statusId: ev.id,
        isCrit: false,
        magnitude: 'normal',
        floaterText: '[' + ev.id + ']解除',
      };
    case 'stack.counter':
      return {
        kind: 'counter',
        targetIds: ev.targets && ev.targets.length ? ev.targets.slice() : ev.casterId ? [ev.casterId] : [],
        isCrit: false,
        magnitude: 'strong',
        floaterText: '打ち消し',
      };
    default:
      return null;
  }
}
function fxHudCardsFor(actorId) {
  return Array.from(document.querySelectorAll('.hud-card')).filter((c) => c.dataset.actorId === actorId);
}
function fxRestartAnimation(el, classNames) {
  if (!el) return;
  const classes = classNames.split(/\s+/).filter(Boolean);
  el.classList.remove(...classes);
  void el.offsetWidth; // 強制リフロー。連打時にアニメーションを積み重ねず再スタートさせる(§9.12.7要求)
  el.classList.add(...classes);
  el.addEventListener('animationend', () => el.classList.remove(...classes), { once: true });
}
function fxFloaterAt(clientX, clientY, text, cls) {
  if (!text) return;
  const el = document.createElement('div');
  el.className = 'fx-floater ' + (cls || '');
  el.textContent = text;
  el.style.left = clientX + 'px';
  el.style.top = clientY + 'px';
  document.body.appendChild(el);
  if (el.animate) {
    const anim = el.animate(
      [
        { transform: 'translate(-50%,-50%)', opacity: 1 },
        { transform: 'translate(-50%,-160%)', opacity: 0 },
      ],
      { duration: 900, easing: 'ease-out' }
    );
    anim.onfinish = () => el.remove();
  } else {
    setTimeout(() => el.remove(), 900);
  }
}
let fxFloaterStaggerCount = 0;
function fxSpawnFloaterOverToken(actorId, text, cls) {
  const tokenEl = findTokenElById(actorId);
  if (!tokenEl || !text) return;
  const r = tokenEl.getBoundingClientRect();
  // §9.12.7: 同時発生イベント(AoE等)が重ならないよう、駒ごとに軽くx方向をずらす
  const jitter = ((fxFloaterStaggerCount++ % 5) - 2) * 6;
  fxFloaterAt(r.left + r.width / 2 + jitter, r.top, text, cls);
}
function fxBarAfterimage(barEl, fromPct, toPct) {
  if (!barEl) return;
  const ghost = document.createElement('i');
  ghost.className = 'bar-afterimage';
  ghost.style.width = Math.max(0, Math.min(100, fromPct)) + '%';
  barEl.insertBefore(ghost, barEl.firstChild);
  if (ghost.animate) {
    const anim = ghost.animate(
      [{ width: Math.max(0, Math.min(100, fromPct)) + '%' }, { width: Math.max(0, Math.min(100, toPct)) + '%' }],
      { duration: 500, easing: 'ease-out' }
    );
    anim.onfinish = () => ghost.remove();
  } else {
    setTimeout(() => ghost.remove(), 500);
  }
}
const FX_BAR_CLASS_OF_KIND = {
  'hp-loss': 'hp',
  'hp-gain': 'hp',
  'mp-change': 'mp',
  'san-loss': 'san',
  'san-gain': 'san',
};
const FX_FLASH_CLASS_OF_KIND = {
  'hp-loss': 'fx-flash-red',
  'hp-gain': 'fx-flash-green',
  'mp-change': 'fx-flash-blue',
  'san-loss': 'fx-flash-purple',
  'san-gain': 'fx-flash-purple',
};
// 記述子(classifyFeedbackEventの戻り値)を実際のDOM/WAAPI演出に反映する(ここから先はテスト対象外。
// 「シェイクの体感」自体は人間の目視確認待ちとする=design_doc_v0.md §9.12.7)。
function applyFeedbackEffect(desc, state) {
  if (!desc || effectIntensity === 'off') return;
  const subdued = effectIntensity === 'subdued';
  const strong = desc.magnitude === 'strong' && !subdued;
  const barClass = FX_BAR_CLASS_OF_KIND[desc.kind];
  const flashClass = FX_FLASH_CLASS_OF_KIND[desc.kind];
  const isLossKind = desc.kind === 'hp-loss' || desc.kind === 'san-loss';
  const isGainKind =
    desc.kind === 'hp-gain' || desc.kind === 'san-gain' || (desc.kind === 'mp-change' && desc.amount >= 0);

  if (desc.targetId && barClass) {
    // §9.12.7要求②: バーの残像(afterimage)。既にrender()済みの新しい値から、イベントの変化量(amount)を
    // 逆算して「変化前の%」を求める(この関数が呼ばれる時点でDOMは既に新しい値になっているため)。
    const actorNow = state.actors[desc.targetId];
    const maxKey = 'max' + barClass[0].toUpperCase() + barClass.slice(1);
    const maxVal = actorNow ? actorNow.stats[maxKey] : 0;
    const afterVal = actorNow ? actorNow.stats[barClass] : null;
    const beforeVal = afterVal !== null && afterVal !== undefined ? afterVal - (desc.amount || 0) : null;
    fxHudCardsFor(desc.targetId).forEach((card) => {
      const bar = card.querySelector('.hsr-bar.' + barClass);
      if (bar) {
        if (flashClass && !subdued) fxRestartAnimation(bar, flashClass);
        if (!subdued && maxVal > 0 && beforeVal !== null) {
          fxBarAfterimage(bar, (100 * beforeVal) / maxVal, (100 * afterVal) / maxVal);
        }
      }
      if (desc.kind === 'hp-loss' && !subdued) fxRestartAnimation(card, strong ? 'fx-shake fx-strong' : 'fx-shake');
      else if (isGainKind && !subdued) {
        const numEl = card.querySelector('.hsr-num .cur');
        if (numEl) fxRestartAnimation(numEl, 'fx-pop');
      }
    });
    if (viewMode && desc.targetId === viewMode.actorId) {
      const sheetBar = document.querySelector('#pl-sheet .bar.' + barClass);
      if (sheetBar) {
        if (flashClass && !subdued) fxRestartAnimation(sheetBar, flashClass);
        if (!subdued && maxVal > 0 && beforeVal !== null)
          fxBarAfterimage(sheetBar, (100 * beforeVal) / maxVal, (100 * afterVal) / maxVal);
      }
    }
  }
  if (desc.kind === 'resist-tick' && desc.targetId && !subdued) {
    fxHudCardsFor(desc.targetId).forEach((card) => fxRestartAnimation(card, 'fx-pulse-tick'));
  }
  if (desc.kind === 'lock-onset' && desc.targetId) {
    if (!subdued) fxHudCardsFor(desc.targetId).forEach((card) => fxRestartAnimation(card, 'fx-lock-flash'));
    fxSpawnFloaterOverToken(desc.targetId, desc.floaterText, 'fx-loss fx-crit');
  }
  if (desc.kind === 'status-threshold' && desc.targetId) {
    if (!subdued) {
      fxHudCardsFor(desc.targetId).forEach((card) => fxRestartAnimation(card, 'fx-threshold-pulse'));
      const tokenEl = findTokenElById(desc.targetId);
      if (tokenEl) {
        const overlay = document.createElement('div');
        overlay.className = 'fx-token-status-overlay';
        tokenEl.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2000);
      }
    }
    fxSpawnFloaterOverToken(desc.targetId, desc.floaterText, 'fx-loss');
  } else if (desc.kind === 'status-apply' && desc.targetId) {
    fxSpawnFloaterOverToken(desc.targetId, desc.floaterText, '');
  } else if (desc.kind === 'status-cleanse' && desc.targetId) {
    fxSpawnFloaterOverToken(desc.targetId, desc.floaterText, 'fx-gain');
  }
  if (desc.kind === 'counter') {
    (desc.targetIds || []).forEach((id) => fxSpawnFloaterOverToken(id, desc.floaterText, 'fx-crit'));
  }
  if ((isLossKind || isGainKind || desc.kind === 'mp-change') && desc.targetId && desc.floaterText) {
    const cls = isLossKind || (desc.kind === 'mp-change' && desc.amount < 0) ? 'fx-loss' : 'fx-gain';
    fxSpawnFloaterOverToken(desc.targetId, desc.floaterText, desc.isCrit ? cls + ' fx-crit' : cls);
    if ((strong || desc.isCrit) && !subdued) {
      const tokenEl = findTokenElById(desc.targetId);
      if (tokenEl) fxRestartAnimation(tokenEl, 'fx-token-flicker');
    }
  }
}
// events[](resolve()の戻り値)を受け取り、体感フィードバックを発火させる。fire-and-forget(呼び出し元をawaitさせない)。
// 同時発生イベントは軽くstaggerして重なりを避ける(§9.12.7要求)。
function processFeedbackEvents(events, state) {
  if (!events || !events.length || effectIntensity === 'off') return;
  events.forEach((ev, i) => {
    const desc = classifyFeedbackEvent(ev, state);
    if (!desc) return;
    setTimeout(() => applyFeedbackEffect(desc, state), i * 60);
  });
}

function attachDrag(el, actor) {
  el.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return; // 2026-09-26(挙動完全移植): 右/中クリックは駒ドラッグではなくカメラ操作(回転/パン)側へ委ねる(掴み分けルール)
    if (spaceHeldForPan) return; // 2026-09-27: Space押下中は駒の上でも常にパン優先(design_doc_v0.md §9.12.0)
    ev.preventDefault();
    el.setPointerCapture(ev.pointerId);
    el.classList.add('dragging');
    const move = (mv) => {
      const { x, y } = clientToBoardPercent(mv.clientX, mv.clientY, el);
      el.style.left = x + '%';
      el.style.top = y + '%';
      actor.pos.x = x;
      actor.pos.y = y;
      el._dragged = true;
    };
    const up = (uv) => {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      if (el._dragged) {
        warnIfMoveExceedsBudget(actor); // §9.2(2026-09-26): MOV超過・壁を横切る移動はソフト警告のみ(ドラッグ自体は妨げない)
        persist();
        render();
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
}

/* ---- HUD(§8-D。旧#actor-list/.actor-cardを廃止して置き換え) ---- */
function hudStatRowHtml(label, cur, max, barClass) {
  // §1-3(ロードマップ2026-09-05): cur===null は視界フィルタによる意図的なマスク(非公開駒)。
  // 0扱いにすると「瀕死」を捏造してしまうため、実数を伏せて「???」とだけ表示する。
  if (cur === null) {
    return `<div class="hud-stat-row"><span class="hsr-label">${label}</span><span class="hsr-bar ${barClass}"><i style="width:100%"></i></span><span class="hsr-num">???</span></div>`;
  }
  const c = cur === undefined ? 0 : cur;
  const m = max === null || max === undefined ? 0 : max;
  const pct = m > 0 ? Math.max(0, Math.min(100, (100 * c) / m)) : 0;
  const ratio = m > 0 ? c / m : 1;
  const sevClass = ratio <= 0.25 ? 'low' : ratio <= 0.5 ? 'mid' : '';
  return `<div class="hud-stat-row"><span class="hsr-label">${label}</span><span class="hsr-bar ${barClass}"><i style="width:${pct}%"></i></span><span class="hsr-num ${sevClass}"><span class="cur">${c}</span>/${m}</span></div>`;
}
function hudHpRowHtml(a) {
  // §1.5視界フィルタ: NPC/敵のHP方針が"hidden"/"bar"のときhp=nullでhpRatioだけ来る場合がある。実数を捏造しない。
  // §1-3(2026-09-05): a.statsHidden(駒ごとの非公開フラグ)のときは比率バーも出さず「???」にする。
  if (a.stats.hp === null || a.stats.hp === undefined) {
    if (a.statsHidden) {
      return `<div class="hud-stat-row"><span class="hsr-label">HP</span><span class="hsr-bar hp"><i style="width:100%"></i></span><span class="hsr-num">???</span></div>`;
    }
    const pct = a.hpRatio !== undefined ? a.hpRatio * 100 : 100;
    const sevClass =
      a.hpRatio !== undefined && a.hpRatio <= 0.25 ? 'low' : a.hpRatio !== undefined && a.hpRatio <= 0.5 ? 'mid' : '';
    return `<div class="hud-stat-row"><span class="hsr-label">HP</span><span class="hsr-bar hp"><i style="width:${pct}%"></i></span><span class="hsr-num ${sevClass}">?</span></div>`;
  }
  return hudStatRowHtml('HP', a.stats.hp, a.stats.maxHp, 'hp');
}
function renderHud() {
  const list = document.getElementById('hud-list');
  if (!list) return;
  list.innerHTML = '';
  Object.values(state.actors).forEach((a) => {
    const card = document.createElement('div');
    card.className =
      'hud-card' + (a.id === selectedActorId ? ' selected' : '') + (a.visible === false ? ' is-stowed' : '');
    card.dataset.actorId = a.id; // §9.12.7(2026-09-27追補): 体感フィードバック(HUDカードの特定)用
    const paramsHtml = Object.entries(a.customParams || {})
      .map(([k, v]) => `<span>${escapeHtml(k)}:${escapeHtml(String(v))}</span>`)
      .join('');
    const flagsHtml = Object.entries(a.statusFlags || {})
      .filter(([, v]) => v)
      .map(([k]) => `<span>${escapeHtml(k)}</span>`)
      .join('');
    const statusHtml = (a.statuses || []).map((s) => `<span>${escapeHtml(s.id)}${s.stacks}</span>`).join('');
    const resistText = a.resist
      ? `抵抗 ${a.resist.current}/${a.resist.cap}` +
        (a.resist.lockedRounds > 0 ? `(不能残${a.resist.lockedRounds}R)` : '')
      : '';
    card.innerHTML = `
      <div class="hud-avatar" style="${tokenPortraitStyle(a)}">${tokenPortraitInner(a)}</div>
      <div class="hud-body">
        <div class="hud-row1"><span class="hud-name">${escapeHtml(a.name)}</span><span class="hud-kind">${a.kind}</span></div>
        ${hudHpRowHtml(a)}
        ${hudStatRowHtml('MP', a.stats.mp, a.stats.maxMp, 'mp')}
        ${hudStatRowHtml('SAN', a.stats.san, a.stats.maxSan, 'san')}
        <div class="hud-extra"><span>${escapeHtml(resistText)}</span>${statusHtml}${flagsHtml}${paramsHtml}</div>
        <div class="hud-actions"><button data-act="edit">編集</button><button data-act="stow">${a.visible === false ? '出す' : 'しまう'}</button></div>
      </div>
    `;
    card.addEventListener('click', async (ev) => {
      if (ev.target.dataset.act === 'edit') {
        openActorModal(a.id);
        return;
      }
      if (ev.target.dataset.act === 'stow') {
        const result = await resolve(state, { type: 'stow', actorId: a.id, visible: a.visible === false });
        state = result.newState;
        persist();
        render();
        return;
      }
      selectedActorId = a.id;
      render();
    });
    list.appendChild(card);
  });
}
function renderPlHud(viewState) {
  const list = document.getElementById('pl-hud-list');
  if (!list) return;
  list.innerHTML = '';
  Object.values(viewState.actors || {}).forEach((a) => {
    const card = document.createElement('div');
    card.className =
      'hud-card' + (a.id === viewMode.actorId ? ' selected' : '') + (a.visible === false ? ' is-stowed' : '');
    card.dataset.actorId = a.id; // §9.12.7(2026-09-27追補): 体感フィードバック(HUDカードの特定)用
    const resistText = a.resist ? `抵抗 ${a.resist.current}/${a.resist.cap}` : '';
    card.innerHTML = `
      <div class="hud-avatar" style="${tokenPortraitStyle(a)}">${tokenPortraitInner(a)}</div>
      <div class="hud-body">
        <div class="hud-row1"><span class="hud-name">${escapeHtml(a.name)}${a.id === viewMode.actorId ? ' (自分)' : ''}</span><span class="hud-kind">${a.kind}</span></div>
        ${hudHpRowHtml(a)}
        ${hudStatRowHtml('MP', a.stats.mp, a.stats.maxMp, 'mp')}
        ${hudStatRowHtml('SAN', a.stats.san, a.stats.maxSan, 'san')}
        <div class="hud-extra"><span>${escapeHtml(resistText)}</span></div>
        ${a.id === viewMode.actorId ? `<div class="hud-actions"><button data-act="stow">${a.visible === false ? '盤面に出す' : 'しまう'}</button></div>` : ''}
      </div>
    `;
    if (a.id === viewMode.actorId) {
      card.addEventListener('click', async (ev) => {
        if (ev.target.dataset.act === 'stow') {
          await dispatchPlIntent({ type: 'stow', actorId: a.id, visible: a.visible === false });
        }
      });
    }
    list.appendChild(card);
  });
}

/* ---- PLクライアント画面(手順8)。viewStateは常に projectStateForViewer 済みのものを渡す ---- */
function renderBoardPl(viewState) {
  renderScreenPanels('pl-board-panels', viewState.screenPanels, viewState.assets, true); // §2-5(2026-09-06)。読み取り専用
  renderGridOverlay('pl-board-grid', viewState.scene.grid); // §9.5(2026-09-26)
  renderWalls('pl-board-walls', viewState.scene.walls, false); // PL側は表示のみ(編集不可)
  const board = document.getElementById('pl-board-tokens'); // §1-4(2026-09-05): 前景レイヤー(#pl-board-fg)を巻き込まないようサブ要素だけ差し替える
  // 【要確認/既知の制約】素材(state.assets)はまだNET越しに同期していないため、
  // ネットワーク接続したPLクライアントでは背景画像・アイコンが表示されない(ローカルデバッグPL視点では表示される)。
  board.innerHTML = '';
  Object.values(viewState.actors).forEach((a) => {
    if (a.visible === false) return; // §1-3(2026-09-05): 「しまう」で待機領域へ退避した駒は盤面に描画しない
    const isMine = a.id === viewMode.actorId;
    const isCastTarget = !!(castDraft && castDraft.targets.includes(a.id)); // §9.9(2026-09-26)
    const isSecret = !!(a.hidden && a.hidden.statsHidden); // 2026-09-26: Axe準拠ペデスタルの秘匿色分け
    const el = document.createElement('div');
    el.className =
      'token' +
      (isMine ? '' : ' readonly') +
      (isCastTarget ? ' cast-target' : '') +
      (castDraft ? ' cast-targetable' : '') +
      (isSecret ? ' secret-token' : '');
    el.style.left = a.pos.x + '%';
    el.style.top = a.pos.y + '%';
    el.style.zIndex = a.zIndex || 0;
    el.style.transform = `scale(${a.tokenScale || 1}) rotateZ(${-boardCamera.rotateZDeg}deg)`; // 2026-09-26: 名前・HPバーのビルボード化(上のKP側コメント参照)
    el.dataset.id = a.id;
    el.dataset.scale = a.tokenScale || 1;
    const hpPct =
      a.stats.hp !== null && a.stats.maxHp > 0
        ? Math.max(0, Math.min(100, (100 * a.stats.hp) / a.stats.maxHp))
        : a.hpRatio !== undefined
          ? a.hpRatio * 100
          : 100;
    el.innerHTML = `
      <div class="portrait" style="${tokenPortraitStyle(a)}">${tokenPortraitInner(a)}</div>
      <div class="minibar"><i style="width:${hpPct}%"></i></div>
      <div class="name">${escapeHtml(a.name)}${isMine ? ' (自分)' : ''}</div>
    `;
    if (isMine) {
      // 自駒のみ移動可(§1.3: 自駒の位置はPL操作○)。表示中のviewStateではなく実stateのactorを動かす。
      const realActor = state.actors[a.id];
      attachDrag(el, realActor);
    }
    // §9.9(2026-09-26): ターゲティングモード中は他人の駒もクリックして対象に選べる(呪文の対象指定)
    el.addEventListener('click', (ev) => {
      if (el._dragged) {
        el._dragged = false;
        return;
      }
      // §9.12.3(2026-09-27追補): 戦闘モード中、ターゲティング中でなければ自分の駒クリックで移動UIに入る
      if (state.scene.grid.enabled && !movementDraft && !castDraft && isMine) {
        startMovementDraft(a.id);
        return;
      }
      toggleCastTarget(a.id);
    });
    board.appendChild(el);
  });
  renderMovementOverlayInto('pl-board-move-overlay'); // §9.12.3(2026-09-27追補)
}

function renderPlSheetHtml(me) {
  const hpPct = me.stats.maxHp > 0 ? Math.max(0, Math.min(100, (100 * me.stats.hp) / me.stats.maxHp)) : 0;
  const mpPct = me.stats.maxMp > 0 ? Math.max(0, Math.min(100, (100 * me.stats.mp) / me.stats.maxMp)) : 0;
  const sanPct = me.stats.maxSan > 0 ? Math.max(0, Math.min(100, (100 * me.stats.san) / me.stats.maxSan)) : 0;
  const mainStatsHtml = MAIN_STATS.map((k) => `<div>${k.toUpperCase()}<br>${me.stats[k]}</div>`).join('');
  const skillsHtml =
    Object.entries(me.skills || {})
      .map(([k, v]) => `<span>${escapeHtml(k)} ${v}</span>`)
      .join('') || '<span class="empty-hint">技能値未設定</span>';
  const statusesHtml =
    (me.statuses || []).map((s) => `<span>${escapeHtml(s.id)}${s.stacks}</span>`).join('') ||
    '<span class="empty-hint">状態異常なし</span>';
  const resistText = me.resist
    ? `術式抵抗 ${me.resist.current}/${me.resist.cap}` +
      (me.resist.lockedRounds > 0 ? `(詠唱不能:残${me.resist.lockedRounds}R)` : '')
    : '';
  return `
    <h2>自分のシート</h2>
    <div class="avatar-picker" style="margin-bottom:10px;">
      <div class="ap-preview" style="${tokenPortraitStyle(me)}">${tokenPortraitInner(me)}</div>
      <div style="font-size:var(--fs-md); font-weight:700; color:var(--text-primary);">${escapeHtml(me.name)}</div>
    </div>
    <div class="bar hp"><i style="width:${hpPct}%"></i><span>HP ${me.stats.hp}/${me.stats.maxHp}</span></div>
    <div class="bar mp"><i style="width:${mpPct}%"></i><span>MP ${me.stats.mp}/${me.stats.maxMp}</span></div>
    <div class="bar san"><i style="width:${sanPct}%"></i><span>SAN ${me.stats.san}/${me.stats.maxSan}</span></div>
    <div class="pl-statgrid">${mainStatsHtml}</div>
    <div class="pl-skilllist">${skillsHtml}</div>
    <div class="pl-skilllist" style="margin-top:4px;">${statusesHtml}</div>
    <div class="empty-hint" style="margin-top:4px;">${escapeHtml(resistText)}</div>
    <label style="display:flex; align-items:center; gap:6px; margin-top:8px; font-size:var(--fs-xs); color:var(--text-secondary);">
      <input type="checkbox" id="plAutoPassAlways" ${me.autoPassMode === 'always' ? 'checked' : ''}> 呪文スタックを常に自動パスする(§9.12.2)
    </label>
  `;
}

/* ---- §9.9(2026-09-26): 呪文専用UI ----
   旧実装(renderPlSpellPaletteHtml/renderPlStackWindowHtml。テキスト行+ターゲットのselectのみ)は
   このスペルブックパネルに統合・置き換えたため削除した(#pl-palette/#pl-stack-windowのDOMも撤去済み)。
   KP/PL共通のカード描画・合法性判定(checkCastLegality)・ターゲティング・スタックビューア・応答・反響を持つ。 */
let spellbookOn = false; // ヘッダーのトグル状態。ローカルのみ(同期しない)
let sbActingActorId = null; // KPが「誰として詠唱するか」選んでいるactorId。PLは常にviewMode.actorId固定
let sbSearch = '';
let sbSchoolFilter = '';
let castDraft = null; // {actorId, spellId, mode:"cast"|"respond", targets:[actorId,...]}
let wallEditMode = false; // §9.5(2026-09-26): 壁編集モード(KPのみ)。ローカルのみ(同期しない)
let wallDrawStart = null; // {x,y}(盤面%座標)。壁編集モード中のドラッグ開始点
let creaturePanelOn = false; // §9.8(2026-09-26): クリーチャー配置パネルの開閉(KPのみ)。ローカルのみ
let creaturePlacementDraft = null; // 配置モード中のcreatureId。盤面クリックで配置、選択中の行を再クリックで解除

function spellbookViewState() {
  return currentChatViewState(); // 既存関数(KP:state、PL:射影済み、netClient:ホストからのview)を流用
}
function spellRegistrySrc() {
  return netClientMode ? netClient.view.registry : state.registry;
}
/** 呪文の対象指定モードをtargetテキストから推定する(簡易ヒューリスティック。厳密な数量指定はspellデータに無いため)。 */
function spellTargetMode(spell) {
  const t = (spell && spell.target) || '';
  if (t === '自身') return 'self';
  if (t === '単体') return 'single';
  return 'multi';
}
function startCastDraft(actorId, spellId, mode) {
  const vs = spellbookViewState();
  const legality = checkCastLegality(vs, actorId, spellId, { isRespond: mode === 'respond' });
  if (!legality.ok) return;
  const spell = spellRegistrySrc().spells[spellId];
  const tmode = spellTargetMode(spell);
  castDraft = { actorId, spellId, mode, targets: tmode === 'self' ? [actorId] : [] };
  render();
}
function cancelCastDraft() {
  castDraft = null;
  render();
}
async function confirmCastDraft() {
  if (!castDraft) return;
  const { actorId, spellId, mode, targets } = castDraft;
  const intent = {
    type: mode === 'respond' ? 'respond' : 'cast',
    casterId: actorId,
    spellId,
    targets: targets.slice(),
  };
  if (viewMode.role === 'kp' && !netClientMode) {
    const result = await resolve(state, intent);
    state = result.newState;
    persist();
    processFeedbackEvents(result.events, state); // §9.12.7(2026-09-27追補)
    netBroadcastEvents(result.events, state); // §9.13.4(2026-09-27追補)
  } else {
    await dispatchPlIntent(intent);
  }
  castDraft = null;
  render();
}
/** 盤面のコマをクリックしたときにターゲティングモード中なら対象へ追加/解除する。通常クリックならfalseを返す(呼び出し元が従来の選択動作へフォールバックする)。 */
function toggleCastTarget(actorId) {
  if (!castDraft) return false;
  const spell = spellRegistrySrc().spells[castDraft.spellId];
  const tmode = spellTargetMode(spell);
  if (tmode === 'self') return true; // 自身対象は選択不要。クリックは無視するが処理済み扱い
  const idx = castDraft.targets.indexOf(actorId);
  if (idx >= 0) {
    castDraft.targets.splice(idx, 1);
    render();
    return true;
  }
  // §9.5(2026-09-26): 射線(LoS)最小則。戦闘モード(グリッド表示)中のみ判定する(design_doc_v0.md §9.5【仮既定】)。
  const vs = spellbookViewState();
  if (vs && vs.scene && vs.scene.grid && vs.scene.grid.enabled) {
    const caster = vs.actors[castDraft.actorId];
    const target = vs.actors[actorId];
    if (caster && target && losBlocked(vs, caster.pos, target.pos)) {
      pushLog({ kind: 'error', from: 'system', text: `対象指定失敗: ${target.name} への射線が壁に遮られています` });
      render();
      return true;
    }
  }
  if (tmode === 'single') castDraft.targets = [actorId];
  else castDraft.targets.push(actorId);
  render();
  return true;
}

function resistGaugeHtml(actor) {
  if (!actor || !actor.resist) return '';
  const cur = actor.resist.current || 0,
    cap = actor.resist.cap || 0;
  const pct = cap > 0 ? Math.max(0, Math.min(100, (100 * cur) / cap)) : 0;
  let cls = '';
  if (cap > 0 && cur >= cap - 1) cls = 'danger';
  else if (cap > 0 && cur > (cap * 2) / 3) cls = 'warn';
  const lockHtml =
    actor.resist.lockedRounds > 0 ? ` <span class="sb-lock">🔒詠唱不能 残${actor.resist.lockedRounds}R</span>` : '';
  return `
    <div class="sb-gauge-label"><span>術式抵抗</span><span>${cur}/${cap}${lockHtml}</span></div>
    <div class="sb-gauge-bar ${cls}"><i style="width:${pct}%"></i></div>
  `;
}

function spellCardHtml(vs, actorId, spellId, mode) {
  const spell = spellRegistrySrc().spells[spellId];
  if (!spell) return `<div class="spell-card disabled">${escapeHtml(spellId)}(未読込)</div>`;
  const legality = checkCastLegality(vs, actorId, spellId, { isRespond: mode === 'respond' });
  const kw = parseKeywords(spell.keywords);
  const badges = [];
  if (kw.echo !== null) badges.push(`反響(${kw.echo})`);
  if (kw.congeal !== null) badges.push(`凝集(${kw.congeal})`);
  if (kw.pierce !== null) badges.push(`貫通(${kw.pierce})`);
  if (kw.quickcast) badges.push('瞬唱');
  if (kw.contestable) badges.push('対抗可能');
  kw.others.forEach((o) => badges.push(o));
  const isActive = !!(
    castDraft &&
    castDraft.actorId === actorId &&
    castDraft.spellId === spellId &&
    castDraft.mode === mode
  );
  const resistCost = 1 + (spell.resist || 0);
  return `
    <div class="spell-card ${legality.ok ? '' : 'disabled'} ${isActive ? 'active' : ''}"
         data-spell="${escapeHtml(spellId)}" data-actor="${escapeHtml(actorId)}" data-mode="${escapeHtml(mode)}"
         title="${legality.ok ? '' : escapeHtml(legality.reason)}">
      <div class="sc-head"><span class="sc-name">${escapeHtml(spell.name)}</span><span class="sc-grade">Lv${spell.grade ?? '?'}</span></div>
      <div class="sc-meta">${escapeHtml(spell.school || '-')} ・ MP${escapeHtml(spell.mp !== undefined ? String(spell.mp) : '-')} ・ 抵抗+${resistCost}</div>
      ${badges.length ? `<div class="sc-badges">${badges.map((b) => `<span class="sc-badge">${escapeHtml(b)}</span>`).join('')}</div>` : ''}
      <div class="sc-range">射程:${escapeHtml(spell.range || '-')} / 対象:${escapeHtml(spell.target || '-')}</div>
      ${!legality.ok ? `<div class="sc-reason">${escapeHtml(legality.reason)}</div>` : ''}
    </div>
  `;
}

function respondBannerHtml(vs, actorId) {
  const top = vs.stack[0];
  if (!top || !top.window || top.window.state !== 'open') return '';
  if (!top.window.respondableBy.includes(actorId) || top.window.decided.includes(actorId)) return '';
  const caster = vs.actors[top.casterId];
  const spell = spellRegistrySrc().spells[top.spellId];
  const kpForce =
    viewMode.role === 'kp' && !netClientMode
      ? `<button type="button" data-act="sb-force-resolve">強制解決</button>`
      : '';
  return `<div class="sb-respond-banner">
    <b>${escapeHtml(caster ? caster.name : top.casterId)}</b> が <b>${escapeHtml(spell ? spell.name : top.spellId)}</b> を詠唱。応答しますか?
    <div style="margin-top:6px; display:flex; gap:8px;">
      <button type="button" data-act="sb-pass">パス</button>
      ${kpForce}
    </div>
  </div>`;
}

function echoChipsHtml(vs, actorId) {
  const actor = vs.actors[actorId];
  if (!actor || !actor.castLog) return '';
  const chips = [];
  Object.entries(actor.castLog).forEach(([sid, log]) => {
    if (!log || log.round !== vs.round.number) return;
    const spell = spellRegistrySrc().spells[sid];
    if (!spell) return;
    const kw = parseKeywords(spell.keywords);
    if (kw.echo === null) return;
    if ((actor.stats.mp || 0) < kw.echo) return;
    chips.push(
      `<div class="sb-echo-chip"><span>反響: ${escapeHtml(spell.name)}(${kw.echo}MP)</span><button type="button" data-act="sb-echo" data-spell="${escapeHtml(sid)}">再詠唱</button></div>`
    );
  });
  return chips.join('');
}

/* ============================================================
   §9.12.2(2026-09-27追補): スタックUI刷新。
   MTGのスタック(LIFO)という「挙動・情報設計」だけを参考にし、アセット・固有ビジュアルの複製はしない。
   ・ vs.stack は末尾(push側)が「次に解決される」要素(resolveEntireStackがconfig末尾からpopする実装と対応)。
   ・ vs.stack[0] は「現在開いている応答ウィンドウ」を持つエントリ(既存respondBannerHtml等と同じ前提)。
   ============================================================ */
function stackPriorityRowHtml(vs) {
  const top = vs.stack && vs.stack[0];
  if (!top || !top.window || top.window.state !== 'open') return '';
  const respondedIds = new Set(vs.stack.filter((e) => e !== top).map((e) => e.casterId));
  const icons = top.window.respondableBy
    .map((id) => {
      const a = vs.actors[id];
      const name = a ? a.name : id;
      const decided = top.window.decided.includes(id);
      let cls, label;
      if (!decided) {
        cls = 'considering';
        label = '検討中';
      } else if (respondedIds.has(id)) {
        cls = 'interrupted';
        label = '応答(割込み)';
      } else {
        cls = 'passed';
        label = 'パス済み';
      }
      return `<span class="sb-priority-icon ${cls}" title="${escapeHtml(name)}: ${label}">${escapeHtml(name.slice(0, 2))}</span>`;
    })
    .join('');
  return `<div class="sb-priority-row">優先権:${icons}</div>`;
}
function stackViewerHtml(vs) {
  if (!vs.stack || !vs.stack.length) return '<div class="empty-hint">スタックは空です</div>';
  const top = vs.stack[0];
  const display = vs.stack.slice().reverse(); // 末尾(=次に解決)を先頭に表示
  const cards = display
    .map((entry, i) => {
      const caster = vs.actors[entry.casterId];
      const spell = entry.spellId ? spellRegistrySrc().spells[entry.spellId] : null;
      const targetNames = (entry.targets || []).map((id) => (vs.actors[id] ? vs.actors[id].name : id)).join(', ');
      const isOpenWindow = entry === top && entry.window && entry.window.state === 'open';
      const isTop = i === 0;
      const fanX = i * 8,
        fanY = i * 5,
        fanRot = i * 2.2;
      const label = entry.spellId
        ? `<b>${escapeHtml(caster ? caster.name : entry.casterId)}</b> → ${escapeHtml(spell ? spell.name : entry.spellId)}`
        : `<b>KP裁定待ち</b>(${escapeHtml(entry.kind || '?')})`;
      const metaLine = entry.spellId
        ? `対象: ${escapeHtml(targetNames || '-')}${isOpenWindow ? ' ・ 応答受付中' : ''}`
        : `status=${escapeHtml(entry.status || '-')} ・ /KP裁定 ${escapeHtml(entry.id)} <結果テキスト>`;
      return `<div class="sb-stack-entry${isOpenWindow ? ' open' : ''}${isTop ? ' top' : ''}" data-entry-id="${escapeHtml(entry.id)}"
         style="transform: translate(${fanX}px, ${fanY}px) rotate(${fanRot}deg); z-index:${100 - i};">
      <div>${label}</div>
      <div class="empty-hint">${metaLine}</div>
    </div>`;
    })
    .join('');
  return stackPriorityRowHtml(vs) + `<div class="sb-stack-fan" id="sbStackFan">${cards}</div>`;
}
function stackEntryFullCardHtml(vs, entry) {
  const caster = vs.actors[entry.casterId];
  const targetNames = (entry.targets || []).map((id) => (vs.actors[id] ? vs.actors[id].name : id)).join(', ') || '-';
  const spell = entry.spellId ? spellRegistrySrc().spells[entry.spellId] : null;
  if (!spell) {
    return `<div class="sc-head"><span class="sc-name">${escapeHtml(entry.kind || entry.spellId || '?')}</span></div>
      <div class="scm-meta-row"><span>種別</span><span>${escapeHtml(entry.kind || '呪文(未読込)')}</span></div>
      <div class="scm-meta-row"><span>詠唱者/対象者</span><span>${escapeHtml(caster ? caster.name : entry.casterId || entry.attackerId || entry.actorId || '-')}</span></div>
      <div class="scm-meta-row"><span>状態</span><span>${escapeHtml(entry.status || '-')}</span></div>`;
  }
  const kw = parseKeywords(spell.keywords);
  const badges = [];
  if (kw.echo !== null) badges.push(`反響(${kw.echo})`);
  if (kw.congeal !== null) badges.push(`凝集(${kw.congeal})`);
  if (kw.pierce !== null) badges.push(`貫通(${kw.pierce})`);
  if (kw.quickcast) badges.push('瞬唱');
  if (kw.contestable) badges.push('対抗可能');
  kw.others.forEach((o) => badges.push(o));
  return `
    <div class="sc-head"><span class="sc-name">${escapeHtml(spell.name)}</span><span class="sc-grade">Lv${spell.grade ?? '?'}</span></div>
    <div class="sc-meta">${escapeHtml(spell.school || '-')} ・ MP${escapeHtml(spell.mp !== undefined ? String(spell.mp) : '-')}</div>
    ${badges.length ? `<div class="sc-badges">${badges.map((b) => `<span class="sc-badge">${escapeHtml(b)}</span>`).join('')}</div>` : ''}
    <div class="sc-range">射程:${escapeHtml(spell.range || '-')} / 対象:${escapeHtml(spell.target || '-')}</div>
    <div class="scm-meta-row"><span>詠唱者</span><span>${escapeHtml(caster ? caster.name : entry.casterId)}</span></div>
    <div class="scm-meta-row"><span>対象</span><span>${escapeHtml(targetNames)}</span></div>
    <div class="scm-meta-row"><span>状態</span><span>${escapeHtml(entry.status || '-')}</span></div>
  `;
}
function ensureStackCardModal() {
  let ov = document.getElementById('stackCardModalOverlay');
  if (ov) return ov;
  ov = document.createElement('div');
  ov.id = 'stackCardModalOverlay';
  ov.hidden = true;
  ov.innerHTML =
    '<div id="stackCardModal"><button type="button" class="scm-close" data-act="scm-close">✕</button><div id="stackCardModalBody"></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click', (ev) => {
    if (ev.target === ov) ov.hidden = true;
  });
  ov.querySelector('[data-act="scm-close"]').addEventListener('click', () => {
    ov.hidden = true;
  });
  return ov;
}
function openStackEntryCardModal(vs, entry) {
  const ov = ensureStackCardModal();
  document.getElementById('stackCardModalBody').innerHTML = stackEntryFullCardHtml(vs, entry);
  ov.hidden = false;
}
function findTokenElById(id) {
  const all = document.querySelectorAll('.token');
  for (const t of all) {
    if (t.dataset.id === id) return t;
  }
  return null;
}
let stackLineData = []; // [{entryId, fromEl, toIds:[...]}] applyBoardCameraCss()のライブ再描画から参照される
function ensureStackLinesSvg() {
  let svg = document.getElementById('stackTargetLinesOverlay');
  if (svg) return svg;
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'stackTargetLinesOverlay';
  document.body.appendChild(svg);
  return svg;
}
function renderStackTargetLines() {
  const svg = ensureStackLinesSvg();
  if (!spellbookOn || !stackLineData.length) {
    svg.innerHTML = '';
    return;
  }
  const parts = [];
  stackLineData.forEach(({ entryId, fromEl, toIds }) => {
    if (!fromEl || !fromEl.isConnected) return;
    const fr = fromEl.getBoundingClientRect();
    const sx = fr.left,
      sy = fr.top + fr.height / 2;
    toIds.forEach((tid) => {
      const tokenEl = findTokenElById(tid);
      if (!tokenEl) return;
      const tr = tokenEl.getBoundingClientRect();
      const ex = tr.left + tr.width / 2,
        ey = tr.top + tr.height / 2;
      const mx = (sx + ex) / 2 - Math.min(80, Math.abs(sy - ey) * 0.3 + 20);
      const my = (sy + ey) / 2;
      parts.push(
        `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" class="sb-target-line" data-entry="${escapeHtml(entryId)}"></path>`
      );
    });
  });
  svg.innerHTML = parts.join('');
}
function setStackLineHighlight(entryId, on) {
  const svg = document.getElementById('stackTargetLinesOverlay');
  if (!svg) return;
  svg.querySelectorAll('path').forEach((p) => {
    if (p.dataset.entry === entryId) p.classList.toggle('hi', on);
  });
}
function animateStackEntryPushIn(el) {
  if (!el || !el.animate) return;
  const finalTransform = el.style.transform || 'none';
  try {
    el.animate(
      [
        { transform: finalTransform + ' scale(.82) translateY(-14px)', opacity: 0 },
        { transform: finalTransform, opacity: 1 },
      ],
      { duration: 260, easing: 'cubic-bezier(.2,.8,.3,1)' }
    );
  } catch (e) {
    /* WAAPI未対応環境では演出を諦めるだけ(fire-and-forget。design_doc_v0.md §9.12.2/7と同じ思想) */
  }
}
function spawnStackResolveFx(rect, kind) {
  // kind: "resolved"(発光して消える) | "countered"(グレーアウトして消える)
  if (!rect || !document.body.animate) return;
  const clone = document.createElement('div');
  clone.className = 'sb-stack-fx-clone';
  clone.style.left = rect.left + 'px';
  clone.style.top = rect.top + 'px';
  clone.style.width = rect.width + 'px';
  clone.style.height = rect.height + 'px';
  clone.style.borderRadius = 'var(--radius-sm)';
  clone.style.background = kind === 'countered' ? 'rgba(120,120,120,.55)' : 'rgba(216,166,87,.4)';
  document.body.appendChild(clone);
  const kf =
    kind === 'countered'
      ? [
          { opacity: 1, filter: 'grayscale(0)' },
          { opacity: 0, filter: 'grayscale(1)', transform: 'scale(.9)' },
        ]
      : [
          { opacity: 1, boxShadow: '0 0 0 rgba(216,166,87,0)' },
          { opacity: 0.9, boxShadow: '0 0 24px rgba(216,166,87,.9)' },
          { opacity: 0, transform: 'scale(1.08)' },
        ];
  try {
    const anim = clone.animate(kf, { duration: 420, easing: 'ease-out' });
    anim.onfinish = () => clone.remove();
  } catch (e) {
    clone.remove();
  }
}
let prevStackEntrySnapshot = {}; // id -> {rect, status}。push/resolve/counter演出の差分検出用(design_doc_v0.md §9.12.2)
function syncStackVisuals(vs) {
  const fan = document.getElementById('sbStackFan');
  const currentIds = new Set((vs.stack || []).map((e) => e.id));
  Object.keys(prevStackEntrySnapshot).forEach((id) => {
    if (currentIds.has(id)) return;
    const snap = prevStackEntrySnapshot[id];
    spawnStackResolveFx(snap.rect, snap.status === 'countered' ? 'countered' : 'resolved');
  });
  const nextSnapshot = {};
  if (fan) {
    fan.querySelectorAll('.sb-stack-entry').forEach((el) => {
      const id = el.dataset.entryId;
      if (!prevStackEntrySnapshot[id]) animateStackEntryPushIn(el);
      nextSnapshot[id] = { rect: el.getBoundingClientRect(), status: 'open' };
    });
  }
  (vs.stack || []).forEach((e) => {
    if (nextSnapshot[e.id]) nextSnapshot[e.id].status = e.status;
  });
  prevStackEntrySnapshot = nextSnapshot;

  stackLineData = [];
  if (fan) {
    fan.querySelectorAll('.sb-stack-entry').forEach((el) => {
      const id = el.dataset.entryId;
      const entry = (vs.stack || []).find((e) => e.id === id);
      if (entry && entry.targets && entry.targets.length) {
        stackLineData.push({ entryId: id, fromEl: el, toIds: entry.targets.slice() });
      }
    });
  }
  renderStackTargetLines();
}

function renderSpellbookPanel() {
  const panel = document.getElementById('spellbook-panel');
  if (!panel) return;
  panel.hidden = !spellbookOn;
  document.getElementById('btnToggleSpellbook').classList.toggle('active', spellbookOn);
  if (!spellbookOn) {
    // パネルを閉じた間はターゲットラインの起点(スタックカード)が画面から消えるため、残像を残さず消す
    const svg = document.getElementById('stackTargetLinesOverlay');
    if (svg) svg.innerHTML = '';
    stackLineData = [];
    return;
  }

  const vs = spellbookViewState();
  const isKp = viewMode.role === 'kp' && !netClientMode;

  const selectEl = document.getElementById('sbActorSelect');
  if (isKp) {
    selectEl.hidden = false;
    const options = Object.values(vs.actors || {})
      .map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`)
      .join('');
    if (selectEl.dataset.builtFor !== options) {
      selectEl.innerHTML = options;
      selectEl.dataset.builtFor = options;
    }
    if (!sbActingActorId || !vs.actors[sbActingActorId])
      sbActingActorId = kpSpeakerId || Object.keys(vs.actors || {})[0] || null;
    if (selectEl.value !== sbActingActorId) selectEl.value = sbActingActorId || '';
  } else {
    selectEl.hidden = true;
    sbActingActorId = viewMode.actorId;
  }
  const actorId = sbActingActorId;
  const actor = actorId ? vs.actors[actorId] : null;

  document.getElementById('sbResistGauge').innerHTML = actor ? resistGaugeHtml(actor) : '';

  const schoolSelectEl = document.getElementById('sbSchoolFilter');
  const schools = Array.from(
    new Set(
      Object.values(spellRegistrySrc().spells || {})
        .map((sp) => sp.school)
        .filter(Boolean)
    )
  );
  const schoolOptions =
    '<option value="">系統:すべて</option>' +
    schools.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if (schoolSelectEl.dataset.builtFor !== schoolOptions) {
    schoolSelectEl.innerHTML = schoolOptions;
    schoolSelectEl.dataset.builtFor = schoolOptions;
  }
  schoolSelectEl.value = sbSchoolFilter;

  let bodyHtml = '';
  if (!actor) {
    bodyHtml = '<div class="empty-hint">キャラクターがいません</div>';
  } else {
    const banner = respondBannerHtml(vs, actorId);
    bodyHtml += banner;
    bodyHtml += echoChipsHtml(vs, actorId);
    const registrySrc = spellRegistrySrc();
    const spellIds = (actor.spells || []).filter((sid) => {
      const spell = registrySrc.spells[sid];
      if (!spell) return true; // 未読込でも一覧には出す(理由表示のため)
      if (sbSchoolFilter && spell.school !== sbSchoolFilter) return false;
      if (sbSearch && !spell.name.includes(sbSearch)) return false;
      return true;
    });
    const mode = banner ? 'respond' : 'cast';
    if (!spellIds.length) {
      bodyHtml += '<div class="empty-hint">所持呪文なし(キャラ編集の「所持呪文」欄で設定します)</div>';
    } else {
      bodyHtml += spellIds.map((sid) => spellCardHtml(vs, actorId, sid, mode)).join('');
    }
    bodyHtml += '<div class="section-label" style="margin-top:var(--sp-3);">スタック</div>';
    bodyHtml += stackViewerHtml(vs);
  }
  document.getElementById('sbBody').innerHTML = bodyHtml;

  const chipEl = document.getElementById('sbConfirmChip');
  if (castDraft && castDraft.actorId === actorId && actor) {
    chipEl.hidden = false;
    const spell = spellRegistrySrc().spells[castDraft.spellId];
    const legality = checkCastLegality(vs, actorId, castDraft.spellId, { isRespond: castDraft.mode === 'respond' });
    const cap = legality.resistCap ?? (actor.resist ? actor.resist.cap : 0);
    const cur = legality.resistCurrent ?? (actor.resist ? actor.resist.current : 0);
    const cost = legality.resistCost ?? 1 + ((spell && spell.resist) || 0);
    const tmode = spellTargetMode(spell);
    const targetNames =
      castDraft.targets.map((id) => (vs.actors[id] ? vs.actors[id].name : id)).join(', ') || '(未選択)';
    const needsTarget = tmode !== 'self' && !castDraft.targets.length;
    chipEl.innerHTML = `
      <div class="cc-row"><b>${escapeHtml(spell ? spell.name : castDraft.spellId)}</b><span>MP${legality.mpEstimate ?? '-'}</span></div>
      <div class="cc-row"><span>術式抵抗予測</span><span>${cur}/${cap} → ${cur + cost}/${cap}</span></div>
      <div class="cc-row"><span>対象</span><span>${escapeHtml(targetNames)}</span></div>
      ${tmode !== 'self' ? '<div class="empty-hint">盤面のコマをクリックして対象を選んでください</div>' : ''}
      <div class="cc-actions">
        <button type="button" data-act="sb-cancel">キャンセル</button>
        <button type="button" class="primary" data-act="sb-confirm"${needsTarget ? ' disabled' : ''}>宣言</button>
      </div>
    `;
  } else {
    chipEl.hidden = true;
  }

  wireSpellbookBodyEvents(vs);
  // §9.12.2(2026-09-27追補): push/resolve/counter演出・ターゲットラインの再構築はDOM確定後に行う。
  // actor未選択時は#sbStackFanごと描画されない(スタック自体の状態とは無関係)ので、
  // 「消えた」と誤検出しないよう同期をスキップする(prevStackEntrySnapshotは前回のまま保持)。
  if (actor) syncStackVisuals(vs);
}

function wireSpellbookBodyEvents(vs) {
  const bodyEl = document.getElementById('sbBody');
  bodyEl.querySelectorAll('.sb-stack-entry').forEach((el) => {
    const entryId = el.dataset.entryId;
    el.addEventListener('click', () => {
      const entry = (vs.stack || []).find((e) => e.id === entryId);
      if (entry) openStackEntryCardModal(vs, entry);
    });
    el.addEventListener('mouseenter', () => setStackLineHighlight(entryId, true));
    el.addEventListener('mouseleave', () => setStackLineHighlight(entryId, false));
  });
  bodyEl.querySelectorAll('.spell-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disabled')) return;
      startCastDraft(card.dataset.actor, card.dataset.spell, card.dataset.mode);
    });
  });
  bodyEl.querySelectorAll('[data-act="sb-pass"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const actorId = sbActingActorId;
      if (viewMode.role === 'kp' && !netClientMode) {
        const result = await resolve(state, { type: 'pass', actorId });
        state = result.newState;
        persist();
        render();
      } else {
        await dispatchPlIntent({ type: 'pass', actorId });
      }
    });
  });
  bodyEl.querySelectorAll('[data-act="sb-force-resolve"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const result = await resolve(state, { type: 'forceResolveStack' });
      state = result.newState;
      persist();
      render();
    });
  });
  bodyEl.querySelectorAll('[data-act="sb-echo"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      startCastDraft(sbActingActorId, btn.dataset.spell, 'cast');
    });
  });
  const chipEl = document.getElementById('sbConfirmChip');
  const cancelBtn = chipEl.querySelector('[data-act="sb-cancel"]');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelCastDraft);
  const confirmBtn = chipEl.querySelector('[data-act="sb-confirm"]');
  if (confirmBtn) confirmBtn.addEventListener('click', confirmCastDraft);
}

function renderPlHandoutsHtml(viewState) {
  const items = Object.values(viewState.handouts || {});
  if (!items.length) return '<h2>受信ハンドアウト</h2><div class="empty-hint">まだ受け取っていません</div>';
  return (
    '<h2>受信ハンドアウト</h2>' +
    items
      .map(
        (h) => `
    <div class="handout-item">
      <div class="htitle">${escapeHtml(h.title || '')}</div>
      <div>${escapeHtml(h.body || '')}</div>
    </div>
  `
      )
      .join('')
  );
}

function renderPlSidebar(viewState) {
  // §9.9(2026-09-26): 呪文の詠唱・応答・スタック閲覧はスペルブックパネル(renderSpellbookPanel)に統合済み。
  // ここではシート・受信ハンドアウトのみを描画する。
  const me = viewState.actors[viewMode.actorId];
  if (!me) {
    document.getElementById('pl-sheet').innerHTML =
      '<div class="pl-section empty-hint">視点キャラクターが見つかりません</div>';
    document.getElementById('pl-handouts').innerHTML = '';
    return;
  }
  document.getElementById('pl-sheet').innerHTML = '<div class="pl-section">' + renderPlSheetHtml(me) + '</div>';
  document.getElementById('pl-handouts').innerHTML =
    '<div class="pl-section">' + renderPlHandoutsHtml(viewState) + '</div>';
  const autoPassEl = document.getElementById('plAutoPassAlways');
  if (autoPassEl) {
    autoPassEl.addEventListener('change', async () => {
      await dispatchPlIntent({ type: 'setAutoPass', actorId: me.id, always: autoPassEl.checked });
    });
  }
}

/* ---- チャットの台本化(§8-D-4)。1発言=1ブロック、ダイス結果はチップ表示 ---- */
function detectRollChip(text) {
  // ログ本文からクリ/ファン/成功/失敗を検出するレンダリング専用ヒューリスティック。
  // ロール系呼び出し元(cmdJudge/cmdRoll/BCDice等)を全て構造化情報付きに書き換える余地は残るが、
  // 今回はUI層だけの改修に留め、生成済みテキストから検出する形にした。
  let resultClass = null,
    resultLabel = null;
  if (/クリティカル|決定的成功/.test(text)) {
    resultClass = 'critical';
    resultLabel = 'クリティカル';
  } else if (/ファンブル/.test(text)) {
    resultClass = 'fumble';
    resultLabel = 'ファンブル';
  } else if (/部分成功/.test(text)) {
    resultClass = 'success';
    resultLabel = '部分成功';
  } else if (/成功/.test(text)) {
    resultClass = 'success';
    resultLabel = '成功';
  } else if (/失敗/.test(text)) {
    resultClass = 'failure';
    resultLabel = '失敗';
  }
  if (!resultClass) return null;
  const m = /(?:→|＞)\s*\(?(-?\d+)/.exec(text);
  const value = m ? m[1] : null;
  return { resultClass, resultLabel, value };
}
function findAvatarInfoByName(name, actorsDict) {
  if (!actorsDict) return null;
  const hit = Object.values(actorsDict).find((a) => a.name === name);
  return hit ? { color: hit.color, iconAssetId: hit.iconAssetId } : null;
}
function msgAvatarHtml(fromName, actorsDict, colorOverride) {
  const info = findAvatarInfoByName(fromName, actorsDict);
  const color = colorOverride || (info && info.color) || '#4a4f5c';
  const icon = info && info.iconAssetId ? state.assets[info.iconAssetId] : null;
  const style =
    icon && icon.type === 'image'
      ? `background-image:url(${icon.dataUrl}); background-color:${color};`
      : `background:${color};`;
  const inner = icon && icon.type === 'image' ? '' : escapeHtml((fromName || '?').slice(0, 2));
  return `<div class="msg-avatar" style="${style}">${inner}</div>`;
}
function formatMsgTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return (isoStr || '').slice(11, 16);
  const now = new Date();
  const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const sameDay =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  if (sameDay) return '今日 ' + hm;
  return d.getMonth() + 1 + '/' + d.getDate() + ' ' + hm;
}
function renderLog(entries, actorsDict) {
  const log = document.getElementById('log');
  const atBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 10;
  const fullLog = entries || state.log;
  updateChatUnread(fullLog);
  updateMessageWindow(fullLog, actorsDict);
  renderChatTabs();
  const filtered = fullLog.filter((e) => (e.channel || 'main') === activeChatTab);
  log.innerHTML = filtered
    .map((e) => {
      const time = formatMsgTime(e.t);
      const kindClass =
        e.kind === 'system' ? 'is-system' : e.kind === 'error' ? 'is-error' : e.kind === 'gm' ? 'is-gm' : '';
      const nameColor = e.color ? ` style="color:${escapeHtml(e.color)}"` : '';
      const chip = e.kind === 'roll' ? detectRollChip(e.text || '') : null;
      let bodyHtml;
      if (chip) {
        const labelText = (e.text || '').replace(new RegExp(chip.resultLabel + '\\s*$'), '').trim();
        bodyHtml =
          `<div class="roll-chip rc-${chip.resultClass}">` +
          (chip.value !== null ? `<span class="roll-value">${escapeHtml(chip.value)}</span>` : '') +
          `<span class="roll-label">${escapeHtml(labelText)}</span>` +
          `<span class="roll-result">${escapeHtml(chip.resultLabel)}</span>` +
          `</div>`;
      } else {
        bodyHtml = `<div class="msg-text">${escapeHtml(e.text || '')}</div>`;
      }
      return (
        `<div class="msg ${kindClass}">` +
        msgAvatarHtml(e.from, actorsDict, e.color) +
        `<div class="msg-body"><div class="msg-bubble">` +
        `<div class="msg-head"><span class="msg-name"${nameColor}>${escapeHtml(e.from || '')}</span><span class="msg-time">${time}</span></div>` +
        bodyHtml +
        `</div></div></div>`
      );
    })
    .join('');
  if (atBottom) log.scrollTop = log.scrollHeight;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

/* ---- キャラクター編集モーダル ---- */
const MAIN_STATS = ['str', 'con', 'pow', 'dex', 'app', 'siz', 'int', 'edu'];

function updateIconPreview() {
  const sel = document.getElementById('f-icon-asset');
  const preview = document.getElementById('f-icon-preview');
  const name = document.getElementById('f-name').value || '?';
  const asset = sel.value ? state.assets[sel.value] : null;
  const color =
    (editingActorId && state.actors[editingActorId] && state.actors[editingActorId].color) ||
    TOKEN_COLORS[nextTokenColorIdx % TOKEN_COLORS.length];
  if (asset && asset.type === 'image') {
    preview.style.backgroundImage = `url(${asset.dataUrl})`;
    preview.style.background = '';
    preview.textContent = '';
  } else {
    preview.style.backgroundImage = '';
    preview.style.background = color;
    preview.textContent = name.slice(0, 2);
  }
}
function openActorModal(id) {
  editingActorId = id || null;
  const a = id ? state.actors[id] : null;
  document.getElementById('modalTitle').textContent = a ? 'キャラクター編集: ' + a.name : 'キャラクター追加';
  document.getElementById('f-name').value = a ? a.name : '';
  const iconSel = document.getElementById('f-icon-asset');
  const imageAssets = Object.values(state.assets || {}).filter((x) => x.type === 'image');
  iconSel.innerHTML =
    '<option value="">(未設定。キャラ色+頭文字を自動生成)</option>' +
    imageAssets.map((x) => `<option value="${x.id}">${escapeHtml(x.name)}</option>`).join('');
  iconSel.value = a && a.iconAssetId ? a.iconAssetId : '';
  updateIconPreview();
  document.getElementById('f-kind').value = a ? a.kind : 'PC';
  document.getElementById('f-hp').value = a ? a.stats.hp : 10;
  document.getElementById('f-maxHp').value = a ? a.stats.maxHp : 10;
  document.getElementById('f-mp').value = a ? a.stats.mp : 10;
  document.getElementById('f-maxMp').value = a ? a.stats.maxMp : 10;
  document.getElementById('f-san').value = a ? a.stats.san : 60;
  document.getElementById('f-maxSan').value = a ? a.stats.maxSan : 99;
  document.getElementById('f-armor').value = a ? a.stats.armor : 0;
  document.getElementById('f-db').value = a ? a.stats.db : '0';
  document.getElementById('f-mov').value = a && a.stats.mov !== undefined ? a.stats.mov : '';
  MAIN_STATS.forEach((k) => {
    document.getElementById('f-' + k).value = a ? a.stats[k] : 12;
  });
  const rows = document.getElementById('skillRows');
  rows.innerHTML = '';
  if (a) {
    Object.entries(a.skills).forEach(([k, v]) => addSkillRow(k, v));
  }
  const spriteRowsEl = document.getElementById('spriteRows');
  spriteRowsEl.innerHTML = '';
  if (a) {
    Object.entries(a.sprites || {}).forEach(([k, v]) => addSpriteRow(k, v));
  }
  document.getElementById('f-spells').value = a ? (a.spells || []).join(', ') : '';
  document.getElementById('f-chatpalette').value = a ? a.chatPalette || '' : '';

  document.getElementById('f-initiative').value = a && a.initiative !== undefined ? a.initiative : '';
  document.getElementById('f-tokenscale').value = a && a.tokenScale !== undefined ? a.tokenScale : 1;
  document.getElementById('f-x').value = a ? Math.round(a.pos.x) : 50;
  document.getElementById('f-y').value = a ? Math.round(a.pos.y) : 50;

  const paramRows = document.getElementById('paramRows');
  paramRows.innerHTML = '';
  Object.entries((a && a.customParams) || {}).forEach(([k, v]) => addParamRow(k, v));

  const flagRows = document.getElementById('statusFlagRows');
  flagRows.innerHTML = '';
  const defaultFlags = { 戦闘不能: false, 錯乱: false, 気絶: false };
  const flags = a && a.statusFlags ? a.statusFlags : defaultFlags;
  Object.entries(flags).forEach(([k, v]) => addStatusFlagRow(k, v));

  document.getElementById('f-memo-public').value = a ? a.publicMemo || '' : '';
  document.getElementById('f-memo-secret').value = a && a.hidden ? a.hidden.memo || '' : '';
  document.getElementById('f-stats-hidden').checked = !!(a && a.hidden && a.hidden.statsHidden);
  document.getElementById('f-autopass-always').checked = !!(a && a.autoPassMode === 'always');

  document.getElementById('btnDeleteActor').style.display = a ? '' : 'none';
  document.getElementById('modal-backdrop').classList.add('open');
  document.getElementById('f-name').focus();
}
function closeActorModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
  editingActorId = null;
}
function addSkillRow(name, val) {
  const rows = document.getElementById('skillRows');
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.innerHTML = `
    <input class="sname" type="text" placeholder="技能名" value="${escapeHtml(name || '')}">
    <input class="sval" type="number" placeholder="値" value="${val !== undefined ? val : ''}">
    <button data-act="rm">×</button>
  `;
  row.querySelector('[data-act="rm"]').addEventListener('click', () => row.remove());
  rows.appendChild(row);
}
function collectSkills() {
  const skills = {};
  document.querySelectorAll('#skillRows .skill-row').forEach((row) => {
    const name = row.querySelector('.sname').value.trim();
    const val = parseInt(row.querySelector('.sval').value, 10);
    if (name && !isNaN(val)) skills[name] = val;
  });
  return skills;
}
/* ---- §2-3(2026-09-05): 立ち絵差分(ラベル名→画像素材id) ---- */
function addSpriteRow(label, assetId) {
  const rows = document.getElementById('spriteRows');
  const row = document.createElement('div');
  row.className = 'skill-row';
  const imageAssets = Object.values(state.assets || {}).filter((x) => x.type === 'image');
  const options =
    '<option value="">(未設定)</option>' +
    imageAssets
      .map((x) => `<option value="${x.id}"${x.id === assetId ? ' selected' : ''}>${escapeHtml(x.name)}</option>`)
      .join('');
  const initialAsset = assetId ? state.assets[assetId] : null;
  row.innerHTML = `
    <span class="sprite-thumb">${initialAsset && initialAsset.type === 'image' ? `<img src="${initialAsset.dataUrl}" alt="">` : ''}</span>
    <input class="sname" type="text" placeholder="ラベル名(例: 笑顔)" value="${escapeHtml(label || '')}">
    <select class="sval sprite-select">${options}</select>
    <button data-act="rm">×</button>
  `;
  row.querySelector('[data-act="rm"]').addEventListener('click', () => row.remove());
  // §9.13.3(2026-09-27追補): 選択中のプルダウンに応じてサムネイルをライブ更新する
  row.querySelector('.sprite-select').addEventListener('change', (ev) => {
    const asset = ev.target.value ? state.assets[ev.target.value] : null;
    row.querySelector('.sprite-thumb').innerHTML =
      asset && asset.type === 'image' ? `<img src="${asset.dataUrl}" alt="">` : '';
  });
  rows.appendChild(row);
}
function collectSprites() {
  const sprites = {};
  document.querySelectorAll('#spriteRows .skill-row').forEach((row) => {
    const name = row.querySelector('.sname').value.trim();
    const val = row.querySelector('.sval').value;
    if (name && val) sprites[name] = val;
  });
  return sprites;
}
/* ---- §8-D: 自由追加パラメータ / ステータス(チェック型) ---- */
function addParamRow(name, val) {
  const rows = document.getElementById('paramRows');
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.innerHTML = `
    <input class="sname" type="text" placeholder="パラメータ名" value="${escapeHtml(name || '')}">
    <input class="sval" type="text" placeholder="値" value="${val !== undefined ? escapeHtml(String(val)) : ''}">
    <button data-act="rm">×</button>
  `;
  row.querySelector('[data-act="rm"]').addEventListener('click', () => row.remove());
  rows.appendChild(row);
}
function collectParams() {
  const params = {};
  document.querySelectorAll('#paramRows .skill-row').forEach((row) => {
    const name = row.querySelector('.sname').value.trim();
    const val = row.querySelector('.sval').value;
    if (name) params[name] = val;
  });
  return params;
}
function addStatusFlagRow(name, checked) {
  const rows = document.getElementById('statusFlagRows');
  const row = document.createElement('div');
  row.className = 'skill-row';
  row.innerHTML = `
    <input class="sname" type="text" placeholder="ステータス名(例: 戦闘不能)" value="${escapeHtml(name || '')}">
    <label class="toggle-wrap">
      <input class="sval" type="checkbox" ${checked ? 'checked' : ''}>
    </label>
    <button data-act="rm">×</button>
  `;
  row.querySelector('[data-act="rm"]').addEventListener('click', () => row.remove());
  rows.appendChild(row);
}
function collectStatusFlags() {
  const flags = {};
  document.querySelectorAll('#statusFlagRows .skill-row').forEach((row) => {
    const name = row.querySelector('.sname').value.trim();
    const checked = row.querySelector('.sval').checked;
    if (name) flags[name] = checked;
  });
  return flags;
}
function saveActorFromModal() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) {
    alert('名前を入力してください');
    return;
  }
  const isNew = !editingActorId;
  const id = editingActorId || uid('actor');
  const existing = editingActorId ? state.actors[editingActorId] : null;

  const stats = {
    hp: parseInt(document.getElementById('f-hp').value, 10) || 0,
    maxHp: parseInt(document.getElementById('f-maxHp').value, 10) || 0,
    mp: parseInt(document.getElementById('f-mp').value, 10) || 0,
    maxMp: parseInt(document.getElementById('f-maxMp').value, 10) || 0,
    san: parseInt(document.getElementById('f-san').value, 10) || 0,
    maxSan: parseInt(document.getElementById('f-maxSan').value, 10) || 0,
    armor: parseInt(document.getElementById('f-armor').value, 10) || 0,
    db: document.getElementById('f-db').value.trim() || '0',
  };
  // §9.2(2026-09-26): MOVは空欄なら未設定のままにする(actorMov()がconfig.combat.defaultMovへフォールバックする)。
  const movRaw = document.getElementById('f-mov').value.trim();
  if (movRaw !== '') stats.mov = parseInt(movRaw, 10) || 0;
  MAIN_STATS.forEach((k) => {
    stats[k] = parseInt(document.getElementById('f-' + k).value, 10) || 0;
  });

  const actor = existing || {
    id,
    pos: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
    tokenAssetId: null,
    visible: true,
    hidden: {},
    statuses: [],
    resist: { current: 0, cap: 0, lockedRounds: 0 },
    spells: [],
    items: [],
    sprites: {},
    macros: {},
    ownerConn: null,
    color: TOKEN_COLORS[nextTokenColorIdx++ % TOKEN_COLORS.length],
    hasActed: false,
    castLog: {},
    triggers: [],
    zIndex: 0,
    tokenScale: 1,
    initiative: null,
    customParams: {},
    statusFlags: {},
    publicMemo: '',
    iconAssetId: null,
  };
  actor.id = id;
  actor.name = name;
  actor.kind = document.getElementById('f-kind').value;
  actor.stats = stats;
  actor.skills = collectSkills();
  actor.sprites = collectSprites();
  actor.spells = document
    .getElementById('f-spells')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  actor.chatPalette = document.getElementById('f-chatpalette').value;
  actor.iconAssetId = document.getElementById('f-icon-asset').value || null;
  const initiativeVal = document.getElementById('f-initiative').value;
  actor.initiative = initiativeVal === '' ? null : parseInt(initiativeVal, 10);
  actor.tokenScale = parseFloat(document.getElementById('f-tokenscale').value) || 1;
  const xVal = parseFloat(document.getElementById('f-x').value);
  const yVal = parseFloat(document.getElementById('f-y').value);
  if (!isNaN(xVal)) actor.pos.x = xVal;
  if (!isNaN(yVal)) actor.pos.y = yVal;
  actor.customParams = collectParams();
  actor.statusFlags = collectStatusFlags();
  actor.publicMemo = document.getElementById('f-memo-public').value;
  actor.hidden = actor.hidden || {};
  actor.hidden.memo = document.getElementById('f-memo-secret').value;
  actor.hidden.statsHidden = document.getElementById('f-stats-hidden').checked;
  actor.autoPassMode = document.getElementById('f-autopass-always').checked ? 'always' : 'noOptions'; // §9.12.2(2026-09-27)
  actor.resist.cap = Math.floor((stats.pow || 0) / 3);

  state.actors[id] = actor;
  logSystem((isNew ? 'キャラクター追加: ' : 'キャラクター更新: ') + name);
  persist();
  render();
  closeActorModal();
}
function deleteActorFromModal() {
  if (!editingActorId) return;
  const a = state.actors[editingActorId];
  if (!a) return;
  showInlineConfirm(`${a.name} を削除しますか?`, () => {
    delete state.actors[editingActorId];
    if (selectedActorId === editingActorId) selectedActorId = null;
    logSystem('キャラクター削除: ' + a.name);
    persist();
    render();
    closeActorModal();
  });
}

/* ============================================================
   起動処理・イベント配線
   ============================================================ */
let cmdHistory = [];
let cmdHistoryPos = -1;

/* ---- NET接続モーダル(手順9) ---- */
let netHostPendingConnId = null;
function openNetModal() {
  const sel = document.getElementById('net-host-actor');
  sel.innerHTML = Object.values(state.actors)
    .filter((a) => a.kind === 'PC')
    .map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`)
    .join('');
  renderNetHostConns();
  document.getElementById('net-modal-backdrop').classList.add('open');
}
function closeNetModal() {
  document.getElementById('net-modal-backdrop').classList.remove('open');
}
function renderNetHostConns() {
  const el = document.getElementById('net-host-conns');
  const conns = Array.from(netHost.connections.values());
  if (!conns.length) {
    el.textContent = 'まだいません';
    el.className = 'empty-hint';
    return;
  }
  el.className = '';
  el.innerHTML = conns
    .map((c) => {
      const actor = state.actors[c.actorId];
      const st = c.dc ? c.dc.readyState : 'unknown';
      return `<div class="net-conn-row">${escapeHtml(c.name || '(未挨拶)')} — 担当:${escapeHtml(actor ? actor.name : c.actorId)} — ${st}</div>`;
    })
    .join('');
}
async function handleNetHostCreate() {
  const actorId = document.getElementById('net-host-actor').value;
  if (!actorId) {
    logError('[NET] PCキャラクターを追加してから招待を作成してください');
    return;
  }
  try {
    const { connId, code } = await netHostCreateInvite(actorId, null);
    netHostPendingConnId = connId;
    document.getElementById('net-host-invite-out').value = code;
    logSystem('[NET] 招待コードを作成しました。PLに渡してください。');
  } catch (e) {
    logError('[NET] 招待コード作成に失敗しました: ' + e.message);
  }
}
async function handleNetHostComplete() {
  const answerCode = document.getElementById('net-host-answer-in').value;
  if (!netHostPendingConnId) {
    logError('[NET] 先に招待コードを作成してください');
    return;
  }
  if (!answerCode.trim()) {
    logError('[NET] 応答コードを貼り付けてください');
    return;
  }
  try {
    await netHostCompleteInvite(netHostPendingConnId, answerCode);
    logSystem('[NET] 応答コードを適用しました。接続確立を待っています…');
    renderNetHostConns();
  } catch (e) {
    logError('[NET] 接続完了に失敗しました: ' + e.message);
  }
}
async function handleNetClientAccept() {
  const inviteCode = document.getElementById('net-client-invite-in').value;
  const name = document.getElementById('net-client-name').value.trim() || 'PL';
  if (!inviteCode.trim()) {
    logError('[NET] 招待コードを貼り付けてください');
    return;
  }
  try {
    const answerCode = await netClientAcceptInvite(inviteCode);
    document.getElementById('net-client-answer-out').value = answerCode;
    document.getElementById('net-client-status').textContent = '応答コードをKPに渡し、接続確立を待っています…';
    netClientFinishJoin(name);
  } catch (e) {
    document.getElementById('net-client-status').textContent = 'エラー: ' + e.message;
  }
}

/* ---- 呪文JSONのドラッグ&ドロップ読み込み(手順11) ---- */
function wireSpellDragDrop() {
  let dragCounter = 0;
  document.body.addEventListener('dragover', (ev) => {
    if (viewMode.role !== 'kp' || netClientMode) return; // KP専用機能
    ev.preventDefault();
  });
  document.body.addEventListener('dragenter', (ev) => {
    if (viewMode.role !== 'kp' || netClientMode) return;
    ev.preventDefault();
    dragCounter++;
    document.body.classList.add('dragging-file');
  });
  document.body.addEventListener('dragleave', (ev) => {
    dragCounter = Math.max(0, dragCounter - 1);
    if (dragCounter === 0) document.body.classList.remove('dragging-file');
  });
  document.body.addEventListener('drop', (ev) => {
    document.body.classList.remove('dragging-file');
    dragCounter = 0;
    if (viewMode.role !== 'kp' || netClientMode) return;
    ev.preventDefault();
    const files = Array.from((ev.dataTransfer && ev.dataTransfer.files) || []);
    const jsonFiles = files.filter((f) => f.name.toLowerCase().endsWith('.json'));
    if (!jsonFiles.length) {
      if (files.length) logError('ドロップされたファイルに.jsonがありません(呪文JSONのみ受け付けます)');
      return;
    }
    jsonFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => importSpellsFromJsonText(reader.result, f.name + '(D&D)');
      reader.readAsText(f, 'utf-8');
    });
  });
}

/* ============================================================
   Axe準拠フローティングウィンドウ(2026-09-26 UI全面改修・挙動完全移植)。
   ドラッグ移動・リサイズ・最前面化・最小化を扱う汎用の薄い実装(vanilla JS。
   Axeの appDraggable/appResizable ディレクティブ等TSコードは一切参照・移植していない
   —draggable.directive.ts/ui-panel.component.tsの挙動(数値のみ)を実測して独自に再実装した)。
   docs/axe_behavior_checklist.md (d)参照:
   - ドラッグ範囲: bounds='body'・allowOverHalf=false相当(ビューポート内に完全に収まるよう厳格クランプ)
   - リサイズ: 最小100×100px、最大はビューポートサイズが実質上限
   ============================================================ */
let axeWinZCounter = 200;
function axeWinBringToFront(win) {
  axeWinZCounter += 1;
  win.style.zIndex = String(axeWinZCounter);
}
function axeWinInitAll() {
  document.querySelectorAll('.axe-win').forEach((win) => {
    win.addEventListener('pointerdown', () => axeWinBringToFront(win));
    const handle = win.querySelector(':scope > .axe-win-title[data-axe-drag]');
    if (handle) {
      handle.addEventListener('pointerdown', (ev) => {
        if (ev.target.closest('.axe-win-btn')) return; // タイトルバー上のボタン類はドラッグ扱いにしない
        ev.preventDefault();
        axeWinBringToFront(win);
        win.classList.add('dragging');
        const rect = win.getBoundingClientRect();
        // 初期配置はright/bottom指定のウィンドウもあるため、ドラッグ開始時に必ずleft/top指定へ揃え直す
        win.style.left = rect.left + 'px';
        win.style.top = rect.top + 'px';
        win.style.right = 'auto';
        win.style.bottom = 'auto';
        const startX = ev.clientX,
          startY = ev.clientY,
          baseLeft = rect.left,
          baseTop = rect.top;
        const move = (mv) => {
          let nx = baseLeft + (mv.clientX - startX),
            ny = baseTop + (mv.clientY - startY);
          // Axe(draggable.directive.ts)のallowOverHalf=false相当: ウィンドウ全体が常にビューポート内に収まる
          nx = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, nx));
          ny = Math.max(0, Math.min(window.innerHeight - win.offsetHeight, ny));
          win.style.left = nx + 'px';
          win.style.top = ny + 'px';
        };
        const up = () => {
          win.classList.remove('dragging');
          handle.removeEventListener('pointermove', move);
          handle.removeEventListener('pointerup', up);
        };
        handle.setPointerCapture(ev.pointerId);
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', up);
      });
    }
    const minBtn = win.querySelector(':scope > .axe-win-title [data-axe-min]');
    if (minBtn) {
      minBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        win.classList.toggle('minimized');
        updateMinimizedDock(); // §9.14.1(2026-09-27追補): 復帰導線
      });
    }
    // リサイズハンドル(右下角)をJSで動的に追加する(既存4ウィンドウのHTMLを個別に触らずに済ませるため)
    if (!win.querySelector(':scope > .axe-win-resize')) {
      const rz = document.createElement('div');
      rz.className = 'axe-win-resize';
      win.appendChild(rz);
      rz.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        axeWinBringToFront(win);
        const rect = win.getBoundingClientRect();
        const startX = ev.clientX,
          startY = ev.clientY,
          baseW = rect.width,
          baseH = rect.height;
        rz.setPointerCapture(ev.pointerId);
        const move = (mv) => {
          let w = baseW + (mv.clientX - startX),
            h = baseH + (mv.clientY - startY);
          w = Math.max(100, Math.min(window.innerWidth - rect.left, w)); // Axe実測: 最小100×100px、最大はビューポート内
          h = Math.max(100, Math.min(window.innerHeight - rect.top, h));
          win.style.width = w + 'px';
          win.style.height = h + 'px';
        };
        const up = () => {
          rz.removeEventListener('pointermove', move);
          rz.removeEventListener('pointerup', up);
        };
        rz.addEventListener('pointermove', move);
        rz.addEventListener('pointerup', up);
      });
    }
  });
  updateMinimizedDock(); // 起動直後は最小化ウィンドウが無いはずだが、保存stateの復元後に呼ばれる可能性も考慮し毎回同期する
}
// §9.14.1(2026-09-27追補): 最小化したウィンドウの復帰導線。最小化してもタイトルバー自体はその場に残るが、
// 別のウィンドウに覆われると押せなくなる(手順0.b「復帰導線が無い」の実体)。常に最前面に出せる
// 小さなドックを新設し、どのウィンドウが最小化中かに関わらずワンクリックで復元できるようにする。
function ensureMinimizedDock() {
  let el = document.getElementById('axe-minimized-dock');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'axe-minimized-dock';
  el.hidden = true;
  document.body.appendChild(el);
  return el;
}
function updateMinimizedDock() {
  const el = ensureMinimizedDock();
  const minimized = Array.from(document.querySelectorAll('.axe-win.minimized'));
  if (!minimized.length) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  el.hidden = false;
  el.innerHTML = minimized
    .map((w) => {
      const label = w.querySelector('.axe-win-titletext');
      return `<button type="button" class="axe-dock-item" data-win-id="${escapeHtml(w.id)}">▲ ${escapeHtml(label ? label.textContent : w.id)}</button>`;
    })
    .join('');
  el.querySelectorAll('.axe-dock-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const w = document.getElementById(btn.dataset.winId);
      if (w) {
        w.classList.remove('minimized');
        axeWinBringToFront(w);
        updateMinimizedDock();
      }
    });
  });
}

function wireEvents() {
  document.getElementById('btnAddActor').addEventListener('click', () => openActorModal(null));
  document.getElementById('btnCancelModal').addEventListener('click', closeActorModal);
  document.getElementById('btnCloseModalX').addEventListener('click', closeActorModal);
  document.getElementById('btnSaveActor').addEventListener('click', saveActorFromModal);
  document.getElementById('btnDeleteActor').addEventListener('click', deleteActorFromModal);
  document.getElementById('f-icon-asset').addEventListener('change', updateIconPreview);
  document.getElementById('f-name').addEventListener('input', updateIconPreview);
  document.getElementById('btnAddSkillRow').addEventListener('click', () => addSkillRow('', ''));
  document.getElementById('btnAddSpriteRow').addEventListener('click', () => addSpriteRow('', ''));
  document.getElementById('btnAddParamRow').addEventListener('click', () => addParamRow('', ''));
  document.getElementById('btnAddStatusFlagRow').addEventListener('click', () => addStatusFlagRow('', false));
  document.getElementById('modal-backdrop').addEventListener('click', (ev) => {
    if (ev.target.id === 'modal-backdrop') closeActorModal();
  });

  document.getElementById('btnOverflowToggle').addEventListener('click', (ev) => {
    ev.stopPropagation();
    document.getElementById('header-overflow-menu').classList.toggle('open');
  });
  document.addEventListener('click', (ev) => {
    const menu = document.getElementById('header-overflow-menu');
    const wrap = document.getElementById('header-overflow');
    if (menu.classList.contains('open') && wrap && !wrap.contains(ev.target)) {
      menu.classList.remove('open');
    }
  });
  document.getElementById('header-overflow-menu').addEventListener('click', (ev) => {
    if (ev.target.tagName === 'BUTTON') document.getElementById('header-overflow-menu').classList.remove('open');
  });

  document.getElementById('btnAssetOpen').addEventListener('click', () => {
    renderAssetList();
    renderScenePresetList();
    document.getElementById('asset-modal-backdrop').classList.add('open');
  });
  // §1-5(2026-09-05): BGM音量・ミュートはこのブラウザだけのローカル設定
  const bgmVolumeEl = document.getElementById('bgmVolume');
  bgmVolumeEl.value = String(Math.round(localBgmVolume * 100));
  bgmVolumeEl.addEventListener('input', () => {
    localBgmVolume = Math.max(0, Math.min(100, parseInt(bgmVolumeEl.value, 10) || 0)) / 100;
    localStorage.setItem('nepheria_bgm_vol', String(localBgmVolume));
    render();
  });
  const btnBgmMute = document.getElementById('btnBgmMute');
  btnBgmMute.classList.toggle('muted', localBgmMuted);
  btnBgmMute.addEventListener('click', () => {
    localBgmMuted = !localBgmMuted;
    localStorage.setItem('nepheria_bgm_muted', localBgmMuted ? '1' : '0');
    btnBgmMute.classList.toggle('muted', localBgmMuted);
    render();
  });
  document.getElementById('btnBgmStopKp').addEventListener('click', () => {
    stopBgm();
  });
  document.getElementById('btnToggleMw').addEventListener('click', () => {
    messageWindowOn = !messageWindowOn;
    localStorage.setItem('nepheria_mw_on', messageWindowOn ? '1' : '0');
    render();
  });
  document.getElementById('btnMwClose').addEventListener('click', () => {
    messageWindowOn = false;
    localStorage.setItem('nepheria_mw_on', '0');
    render();
  });
  // §9.9(2026-09-26): スペルブックパネル
  document.getElementById('btnToggleSpellbook').addEventListener('click', () => {
    spellbookOn = !spellbookOn;
    render();
  });
  document.getElementById('btnEffectIntensity').dataset.tip =
    '数値変化の体感フィードバック: ' + effectIntensity + '(クリックで切替。自分の画面のみ)'; // §9.12.7(2026-09-27追補)
  document.getElementById('btnEffectIntensity').addEventListener('click', cycleEffectIntensity);
  document.getElementById('btnUiTheme').dataset.tip =
    '見た目: ' + (uiTheme === 'dark' ? '夜の卓(ダーク)' : 'ライト') + '(クリックで切替。自分の画面のみ)'; // §9.13.5(2026-09-27追補)
  document.getElementById('btnUiTheme').addEventListener('click', toggleUiTheme);
  document.getElementById('btnCombatMode').addEventListener('click', () => {
    state.scene.grid.enabled = !state.scene.grid.enabled;
    applyCombatModeCameraLock(state.scene.grid.enabled); // design_doc_v0.md §9.12.0: 戦闘モードON時は真上視点へ自動遷移
    if (state.scene.grid.enabled) state.config.combat.autoApply = true; // design_doc_v0.md §9.12.1: 戦闘モード中は既定で全自動
    if (!state.scene.grid.enabled) movementDraft = null; // §9.12.3(2026-09-27追補): 戦闘モードOFF時は移動UIも閉じる
    persist();
    render();
  });
  document.getElementById('btnWallEdit').addEventListener('click', () => {
    wallEditMode = !wallEditMode;
    if (!wallEditMode) wallDrawStart = null;
    render();
  });
  wireWallDrawing('board-walls', 'board');
  wireWallDrawing('pl-board-walls', 'pl-board');
  wireAoeBoardClick('board-tokens', 'board');
  wireAoeBoardClick('pl-board-tokens', 'pl-board');
  wireMovementBoardInteraction('board-tokens', 'board'); // §9.12.3(2026-09-27追補)
  wireMovementBoardInteraction('pl-board-tokens', 'pl-board');
  document.getElementById('btnToggleMoveReach').classList.toggle('active', showReachableHighlight);
  document.getElementById('btnToggleMoveReach').addEventListener('click', () => {
    showReachableHighlight = !showReachableHighlight;
    document.getElementById('btnToggleMoveReach').classList.toggle('active', showReachableHighlight);
    renderMovementOverlays();
  });
  wireCreaturePlacementClick('board-tokens', 'board'); // §9.8: クリーチャー配置はKP盤面のみ
  document.getElementById('btnToggleCreatures').addEventListener('click', () => {
    creaturePanelOn = !creaturePanelOn;
    render();
  });
  document.getElementById('btnCrClose').addEventListener('click', () => {
    creaturePanelOn = false;
    creaturePlacementDraft = null;
    render();
  });
  document.getElementById('crBody').addEventListener('click', (ev) => {
    const card = ev.target.closest('.creature-card');
    if (!card) return;
    const id = card.dataset.id;
    creaturePlacementDraft = creaturePlacementDraft === id ? null : id;
    renderCreaturePanel();
  });
  document
    .getElementById('btnLoadCreatures')
    .addEventListener('click', () => document.getElementById('fileCreatures').click());
  document.getElementById('fileCreatures').addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (file) loadCreaturesFile(file);
    ev.target.value = '';
  });
  document.getElementById('btnCombatConfigOpen').addEventListener('click', () => {
    renderCombatConfigModal();
    document.getElementById('combat-config-modal-backdrop').classList.add('open');
  });
  document.getElementById('btnCombatConfigClose').addEventListener('click', () => {
    document.getElementById('combat-config-modal-backdrop').classList.remove('open');
  });
  document.getElementById('combat-config-modal-backdrop').addEventListener('click', (ev) => {
    if (ev.target.id === 'combat-config-modal-backdrop')
      document.getElementById('combat-config-modal-backdrop').classList.remove('open');
  });
  document.getElementById('btnCombatConfigSave').addEventListener('click', saveCombatConfigFromModal);
  document.getElementById('btnSbClose').addEventListener('click', () => {
    spellbookOn = false;
    castDraft = null;
    render();
  });
  document.getElementById('sbActorSelect').addEventListener('change', (ev) => {
    sbActingActorId = ev.target.value || null;
    castDraft = null;
    render();
  });
  document.getElementById('sbSearch').addEventListener('input', (ev) => {
    sbSearch = ev.target.value;
    render();
  });
  document.getElementById('sbSchoolFilter').addEventListener('change', (ev) => {
    sbSchoolFilter = ev.target.value;
    render();
  });
  // §2-5(2026-09-06): スクリーンパネル設定ポップオーバー
  function currentEditingPanel() {
    return editingPanelId ? state.screenPanels[editingPanelId] : null;
  }
  document.getElementById('psLocked').addEventListener('change', (ev) => {
    const p = currentEditingPanel();
    if (p) {
      p.locked = ev.target.checked;
      persist();
      render();
    }
  });
  document.getElementById('psSizeLocked').addEventListener('change', (ev) => {
    const p = currentEditingPanel();
    if (p) {
      p.sizeLocked = ev.target.checked;
      persist();
      render();
    }
  });
  document.getElementById('psTerrain').addEventListener('change', (ev) => {
    const p = currentEditingPanel();
    if (p) {
      p.terrain = ev.target.checked;
      persist();
    }
  });
  document.getElementById('psHidden').addEventListener('change', (ev) => {
    const p = currentEditingPanel();
    if (p) {
      p.hiddenFromPl = ev.target.checked;
      persist();
      render();
    }
  });
  document.getElementById('psMemo').addEventListener('input', (ev) => {
    const p = currentEditingPanel();
    if (p) {
      p.memo = ev.target.value;
    }
  });
  document.getElementById('psSendToBack').addEventListener('click', () => {
    const p = currentEditingPanel();
    if (p) {
      sendPanelToBack(p);
      persist();
      render();
    }
  }); // §9.13.3(2026-09-27追補)
  document.getElementById('psMemo').addEventListener('blur', () => {
    persist();
    render();
  });
  document.getElementById('psDelete').addEventListener('click', () => {
    if (editingPanelId && state.screenPanels[editingPanelId]) {
      delete state.screenPanels[editingPanelId];
      persist();
      closePanelSettings();
      render();
    }
  });
  document.getElementById('psClose').addEventListener('click', closePanelSettings);
  document.addEventListener('click', (ev) => {
    const pop = document.getElementById('panel-settings-popover');
    if (pop.classList.contains('open') && !pop.contains(ev.target) && !ev.target.closest('.sp-gear')) {
      closePanelSettings();
    }
  });
  // 素材一覧からのドラッグ&ドロップでパネル追加
  ['board', 'board-wrap'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('dragover', (ev) => {
      if (ev.dataTransfer.types.includes('text/nepheria-asset-id')) ev.preventDefault();
    });
    el.addEventListener('drop', (ev) => {
      const assetId = ev.dataTransfer.getData('text/nepheria-asset-id');
      if (!assetId) return;
      ev.preventDefault();
      // §9.13.3(2026-09-27追補): 無条件でパネル追加していたのを、割当先を選ぶメニューに変更
      const pt = clientToBoardPercent(ev.clientX, ev.clientY, document.getElementById('board'));
      const x = Math.max(0, Math.min(85, pt.x - 15));
      const y = Math.max(0, Math.min(85, pt.y - 15));
      showContextMenu(ev.clientX, ev.clientY, [
        {
          label: '背景に設定',
          action: () => {
            state.scene.bgAssetId = assetId;
            persist();
            render();
            logSystem('背景を設定しました');
          },
        },
        {
          label: '前景に設定',
          action: () => {
            state.scene.fgAssetId = assetId;
            persist();
            render();
            logSystem('前景を設定しました');
          },
        },
        {
          label: '盤上パネルとして配置',
          action: () => {
            addScreenPanel(assetId, x, y);
            document.getElementById('asset-modal-backdrop').classList.remove('open');
          },
        },
      ]);
    });
  });
  document.getElementById('btnAssetModalClose').addEventListener('click', () => {
    document.getElementById('asset-modal-backdrop').classList.remove('open');
  });
  document.getElementById('asset-modal-backdrop').addEventListener('click', (ev) => {
    if (ev.target.id === 'asset-modal-backdrop')
      document.getElementById('asset-modal-backdrop').classList.remove('open');
  });
  document.getElementById('fileAssetUpload').addEventListener('change', (ev) => {
    // §9.13.3(2026-09-27追補): 複数ファイルの一括登録に対応
    Array.from(ev.target.files || []).forEach((f) => uploadAssetFile(f));
    ev.target.value = '';
  });
  (function wireAssetDropzone() {
    const dz = document.getElementById('asset-dropzone');
    if (!dz) return;
    let counter = 0;
    dz.addEventListener('dragover', (ev) => {
      ev.preventDefault();
    });
    dz.addEventListener('dragenter', (ev) => {
      ev.preventDefault();
      counter++;
      dz.classList.add('dragover');
    });
    dz.addEventListener('dragleave', () => {
      counter = Math.max(0, counter - 1);
      if (counter === 0) dz.classList.remove('dragover');
    });
    dz.addEventListener('drop', (ev) => {
      ev.preventDefault();
      counter = 0;
      dz.classList.remove('dragover');
      const files = Array.from((ev.dataTransfer && ev.dataTransfer.files) || []);
      if (!files.length) return; // 素材サムネイル自体のドラッグ(text/nepheria-asset-id)はファイルを持たないため無視される
      files.forEach((f) => uploadAssetFile(f));
    });
  })();
  document.getElementById('btnSaveScenePreset').addEventListener('click', () => {
    const name = document.getElementById('f-scene-preset-name').value.trim();
    if (!name) {
      logError('プリセット名を入力してください');
      return;
    }
    saveCurrentSceneAsPreset(name);
    document.getElementById('f-scene-preset-name').value = '';
    renderScenePresetList();
  });
  document.getElementById('cutin-overlay').addEventListener('click', () => {
    document.getElementById('cutin-overlay').hidden = true;
  });
  document.getElementById('btnStopBgm').addEventListener('click', stopBgm);
  document.getElementById('btnCcfImportOpen').addEventListener('click', () => {
    document.getElementById('ccf-import-modal-backdrop').classList.add('open');
  });
  document.getElementById('btnCcfImportClose').addEventListener('click', () => {
    document.getElementById('ccf-import-modal-backdrop').classList.remove('open');
  });
  document.getElementById('ccf-import-modal-backdrop').addEventListener('click', (ev) => {
    if (ev.target.id === 'ccf-import-modal-backdrop')
      document.getElementById('ccf-import-modal-backdrop').classList.remove('open');
  });
  document.getElementById('btnCcfImportRun').addEventListener('click', runCcfoliaImport);

  document.getElementById('btnNetOpen').addEventListener('click', openNetModal);
  document.getElementById('btnNetClose').addEventListener('click', closeNetModal);
  document.getElementById('net-modal-backdrop').addEventListener('click', (ev) => {
    if (ev.target.id === 'net-modal-backdrop') closeNetModal();
  });
  document.getElementById('btnNetHostCreate').addEventListener('click', () => {
    handleNetHostCreate().catch((e) => {
      logError('内部エラー: ' + e.message);
      console.error(e);
    });
  });
  document.getElementById('btnNetHostComplete').addEventListener('click', () => {
    handleNetHostComplete().catch((e) => {
      logError('内部エラー: ' + e.message);
      console.error(e);
    });
  });
  document.getElementById('btnNetClientAccept').addEventListener('click', () => {
    handleNetClientAccept().catch((e) => {
      logError('内部エラー: ' + e.message);
      console.error(e);
    });
  });

  document.getElementById('btnRoundNext').addEventListener('click', () => {
    handleCommand('/ラウンド next').catch((e) => {
      logError('内部エラー: ' + e.message);
      console.error(e);
    });
  });
  document.getElementById('btnExportLogTxt').addEventListener('click', exportLogAsText);
  document.getElementById('btnExportLogHtml').addEventListener('click', exportLogAsHtml);
  document.getElementById('btnSaveJson').addEventListener('click', downloadSave);
  document.getElementById('btnLoadJson').addEventListener('click', () => document.getElementById('fileLoad').click());
  document.getElementById('fileLoad').addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (file) handleLoadFile(file);
    ev.target.value = '';
  });
  document
    .getElementById('btnLoadSpells')
    .addEventListener('click', () => document.getElementById('fileSpells').click());
  document.getElementById('fileSpells').addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (file) loadSpellsFile(file);
    ev.target.value = '';
  });

  document.getElementById('viewSelect').addEventListener('change', (ev) => {
    const v = ev.target.value;
    viewMode = v === 'kp' ? { role: 'kp' } : { role: 'pl', actorId: v.slice(3) };
    selectedActorId = null;
    render();
  });

  // チャットタブ(動的に追加されるカスタムチャンネルも拾えるよう、親要素へのイベント委譲にする)
  document.querySelector('.chat-tabs').addEventListener('click', (ev) => {
    const addBtn = ev.target.closest('#btnAddChatTab');
    if (addBtn) {
      const name = prompt('新しいチャンネル名を入力してください');
      if (name && name.trim()) addCustomChatTab(name.trim());
      return;
    }
    const rmBtn = ev.target.closest('.chat-tab-rm');
    if (rmBtn) {
      ev.stopPropagation();
      const tabId = rmBtn.closest('.chat-tab').dataset.tab;
      removeCustomChatTab(tabId);
      return;
    }
    const tabBtn = ev.target.closest('.chat-tab');
    if (tabBtn) {
      activeChatTab = tabBtn.dataset.tab;
      chatUnread[activeChatTab] = false;
      render();
    }
  });
  document.getElementById('speaker-select').addEventListener('change', (ev) => {
    if (viewMode.role === 'kp' && !netClientMode) kpSpeakerId = ev.target.value || null;
    renderChatPalette();
  });
  function toggleSpeakerPopover(ev) {
    ev.stopPropagation();
    renderSpeakerPickerPopover();
    document.getElementById('speakerPickerPopover').classList.toggle('open');
  }
  // 発言者名表示・リストアイコン・顔アイコンのいずれも同じ自前ポップオーバーを開く
  // (ネイティブselectのドロップダウンは暗色UIから浮いて見えるため直接は開かせない)
  document.getElementById('btnSpeakerList').addEventListener('click', toggleSpeakerPopover);
  document.getElementById('speakerNameLabel').addEventListener('click', toggleSpeakerPopover);
  document.getElementById('btnSpeakerFace').addEventListener('click', toggleSpeakerPopover);
  document.getElementById('speakerPickerPopover').addEventListener('click', (ev) => {
    const row = ev.target.closest('.speaker-pick-row');
    if (!row) return;
    const id = row.dataset.id;
    if (viewMode.role === 'kp' && !netClientMode) {
      kpSpeakerId = id || null;
      renderChatPalette();
    }
    // PL視点は自キャラ固定のため、ここで選べるのは自分自身の行のみ(実質何も変わらない)
    document.getElementById('speakerPickerPopover').classList.remove('open');
    render();
  });
  document.getElementById('btnChatHelp').addEventListener('click', () => {
    alert(
      'チャット入力にダイスコマンドを直接打てます。\n例: 1d6 / 2d6+3 / CCB<=65 / CC<=50\nEnterで送信、Shift+Enterで改行します。\n"/"から始めると神権限コマンド(ターミナルと同じ)になります。'
    );
  });
  function renderColorPickerPopover() {
    const pop = document.getElementById('colorPickerPopover');
    const speaker = currentSpeakerActor();
    pop.innerHTML = TOKEN_COLORS.map(
      (c) =>
        `<button type="button" class="swatch${speaker && speaker.color === c ? ' selected' : ''}" data-color="${c}" style="background:${c};"></button>`
    ).join('');
  }
  document.getElementById('btnColorPicker').addEventListener('click', (ev) => {
    ev.stopPropagation();
    const speaker = currentSpeakerActor();
    const btn = document.getElementById('btnColorPicker');
    btn.disabled = !speaker;
    if (!speaker) return;
    renderColorPickerPopover();
    document.getElementById('colorPickerPopover').classList.toggle('open');
  });
  document.getElementById('colorPickerPopover').addEventListener('click', (ev) => {
    const sw = ev.target.closest('.swatch');
    if (!sw) return;
    const speaker = currentSpeakerActor();
    if (!speaker) return;
    speaker.color = sw.dataset.color;
    persist();
    document.getElementById('colorPickerPopover').classList.remove('open');
    render();
  });
  document.addEventListener('click', (ev) => {
    const pop = document.getElementById('colorPickerPopover');
    if (pop.classList.contains('open') && !pop.contains(ev.target) && !ev.target.closest('#btnColorPicker')) {
      pop.classList.remove('open');
    }
    const spPop = document.getElementById('speakerPickerPopover');
    if (spPop.classList.contains('open') && !spPop.contains(ev.target) && !ev.target.closest('#btnSpeakerFace')) {
      spPop.classList.remove('open');
    }
  });
  document.getElementById('btnCopyPalette').addEventListener('click', async () => {
    const ta = document.getElementById('f-chatpalette');
    try {
      await navigator.clipboard.writeText(ta.value);
      logSystem('チャットパレットをクリップボードへコピーしました');
    } catch (e) {
      ta.select();
      logError(
        'クリップボードへのコピーに失敗しました(テキストエリアを選択状態にしたので手動でコピーしてください): ' +
          e.message
      );
    }
  });
  const chatInput = document.getElementById('chatInput');
  chatInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      submitChatInput();
    }
    // Shift+Enterは既定動作(改行)のまま
  });
  chatInput.addEventListener('input', () => {
    chatInput.style.height = '';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  const input = document.getElementById('cmdInput');
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      const val = input.value;
      if (val.trim()) {
        cmdHistory.push(val);
        cmdHistoryPos = cmdHistory.length;
      }
      input.value = '';
      handleCommand(val).catch((e) => {
        logError('内部エラー: ' + e.message);
        console.error(e);
      });
    } else if (ev.key === 'ArrowUp') {
      if (cmdHistoryPos > 0) {
        cmdHistoryPos--;
        input.value = cmdHistory[cmdHistoryPos];
        ev.preventDefault();
      }
    } else if (ev.key === 'ArrowDown') {
      if (cmdHistoryPos < cmdHistory.length - 1) {
        cmdHistoryPos++;
        input.value = cmdHistory[cmdHistoryPos];
      } else {
        cmdHistoryPos = cmdHistory.length;
        input.value = '';
      }
      ev.preventDefault();
    }
  });
}

// tests.html がこのscript全体を読み込んでも自動起動しないためのガード
// (#board が無い＝実ツールのDOMではない＝テスト用ロードとみなす)
function applyViewModeFromUrl() {
  // デバッグ用: ?view=pl&actor=<キャラ名 または id> で起動時からPL視点にできる(手順8)
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('view') === 'pl') {
      const key = params.get('actor') || '';
      const a = state.actors[key] ? state.actors[key] : findActor(key);
      if (a) viewMode = { role: 'pl', actorId: a.id };
    }
  } catch (e) {
    /* URL未対応環境等は無視してKP視点のまま */
  }
}
function boot() {
  initState();
  applyViewModeFromUrl();
  wireEvents();
  wireSpellDragDrop();
  axeWinInitAll(); // 2026-09-26 UI全面改修: フローティングウィンドウ(ドラッグ・最小化・最前面化)の配線
  applyBoardCameraCss(); // 2026-09-26: 盤面3D傾斜の初期適用
  wireBoardCamera('board-wrap', 'board-pan');
  wireBoardCamera('pl-board-wrap', 'pl-board-pan');
  wireBoardCameraKeyboard();
  wireHelpOverlayKey(); // §9.12.5(2026-09-27追補・仕上げ)
  wireGlobalTooltip(); // §9.14.1(2026-09-27追補・手順0.e)
  document.getElementById('btnCameraSettingsKp').addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleCameraSettingsPopover(ev.currentTarget);
  }); // §9.13.2
  document.getElementById('btnCameraSettingsPl').addEventListener('click', (ev) => {
    ev.stopPropagation();
    toggleCameraSettingsPopover(ev.currentTarget);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (attackDraft) {
      attackDraft = null;
      render();
    }
    if (attackFormDraft) {
      cancelAttackFormDraft();
    } // §9.13.5(2026-09-27追補)
    if (castDraft) {
      cancelCastDraft();
    }
    if (movementDraft) {
      cancelMovementDraft();
    } // §9.12.3(2026-09-27追補)
  });
  render();
  const inp = document.getElementById('cmdInput');
  if (inp) inp.focus();
}
if (typeof document !== 'undefined' && document.getElementById('board')) {
  boot();
}
