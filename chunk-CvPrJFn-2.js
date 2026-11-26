import{c as L,t as E}from"./chunk-SkGxJy5J.js";import{$n as oe,dt as T$1,y as FC}from"./chunk-GcmSWzES.js";import{s as z}from"./chunk-DR1ySeiy.js";import{n as m,t as a}from"./chunk-BE8cGO9X.js";import{n as L$1,r as a$1}from"./chunk-CtpHSzlr.js";import{_ as l$1,o as K$1,v as m$1}from"./chunk-CJHTkYOL.js";import{n as u}from"./chunk-ZBjvF5XZ.js";import{t as a$2}from"./chunk-CVUmHGT9.js";import{t as o}from"./chunk-vT0TZkdo.js";import{t as n}from"./chunk-D2gihxV22.js";import{t as L$2}from"./chunk-BzhTzJlt2.js";import{t as s}from"./chunk-DGQcJDFP2.js";import{t as c}from"./chunk-Bp_k6bPo2.js";import{r as S$1}from"./chunk-u1xJP_5K2.js";import{t as A$1,u as v}from"./chunk-B84qg7452.js";import{t as c$1}from"./chunk-CBCJWmSG2.js";import{t as f$1}from"./chunk-DSJgTR74.js";import{r as q}from"./chunk-CYvX-03H2.js";import{t as I}from"./chunk-BadlOkeW2.js";import{t as p}from"./chunk-jlUYeV0F2.js";import{n as n$1}from"./chunk-tuX9wrJ52.js";import{t as h}from"./chunk-D30oxD482.js";import{t as r}from"./chunk-n_GMZvtK2.js";function Ce(r,e){let t=Math.min(r,e);return{sx:Math.floor((r-t)/2),sy:0,side:t}}function G(a,o){return L(this,arguments,function*(r,e,t={}){if(!r)return r??null;if(e<=0||r.type&&!r.type.startsWith(`image/`)||typeof document>`u`||typeof Image>`u`||typeof URL>`u`||typeof URL.createObjectURL!=`function`)return r;let n=null;try{n=URL.createObjectURL(r);let i=yield Ee(n,t.loadTimeoutMs),s=i.naturalWidth||i.width,c=i.naturalHeight||i.height;if(s<=0||c<=0)return r;let d=t.square===!0,p$1=0,b=0,x=s,u=c,g,h;if(d){let k=Ce(s,c);p$1=k.sx,b=k.sy,x=k.side,u=k.side,g=h=Math.min(k.side,e)}else{let k=Math.max(s,c);if(k<=e)g=s,h=c;else{let ee=e/k;g=Math.max(1,Math.round(s*ee)),h=Math.max(1,Math.round(c*ee))}}let L=document.createElement(`canvas`);L.width=g,L.height=h;let Z=L.getContext(`2d`);if(!Z)return r;Z.drawImage(i,p$1,b,x,u,0,0,g,h);let j=yield p(L,.8);return j&&j.size<r.size?j:r}catch(i){return r}finally{n!==null&&URL.revokeObjectURL(n)}})}var Le=3e3;function Ee(r,e=Le){return new Promise((t,a)=>{let o=new Image,n=setTimeout(()=>{o.onload=o.onerror=null,a(new Error(`image load timeout`))},e);o.onload=()=>{clearTimeout(n),t(o)},o.onerror=i=>{clearTimeout(n),a(i)},o.src=r})}var Me=/<[^>]*>|[^<]+/g;function he(r,e={}){let t=e.indentation??`  `,a=e.lineSeparator??`
`,o=[],n=0,i=null,s=``,c=d=>{i!==null&&(o.push(t.repeat(n)+i+s+(d??``)),d===void 0&&(n+=1),i=null,s=``)};for(let d of r.match(Me)??[]){if(!d.startsWith(`<`)){i!==null&&(s+=d.trim());continue}if(Ne(d)){if(i!==null){c(d);continue}n=Math.max(0,n-1),o.push(t.repeat(n)+d);continue}if(c(),Re(d)){o.push(t.repeat(n)+d);continue}i=d}return c(),o.join(a)}function Ne(r){return r.startsWith(`</`)}function Re(r){return r.startsWith(`<?`)||r.startsWith(`<!`)||r.endsWith(`/>`)}var ve=`
:root{--gap:2px;--msg-pad:10px 14px;--msg-bg:transparent;--radius:6px;--radius-sm:4px;--pt-radius:50%;--pt-border:0;--head-bg:var(--paper);--head-border:1px solid var(--line);--head-shadow:none;--title:var(--ink);--name-mix:85%;--oc-ink:#fff;--flavor:none}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:15px;line-height:1.85;-webkit-font-smoothing:antialiased}
[hidden]{display:none!important}
.log{--pt:48px;max-width:860px;margin:0 auto;padding:56px 28px 72px}
.head{position:relative;margin:0 0 36px;padding:36px 28px 30px;text-align:center;background:var(--head-bg);border:var(--head-border);border-radius:var(--radius);box-shadow:var(--head-shadow)}
.head::before{content:var(--flavor);display:block;margin-bottom:12px;color:var(--accent);font-family:var(--font-mono);font-size:11px;letter-spacing:.42em}
.kicker{margin:0 0 6px;color:var(--muted);font-size:13px;letter-spacing:.14em}
.title{margin:0;color:var(--title);font-family:var(--font-head);font-size:clamp(26px,4.6vw,40px);font-weight:700;line-height:1.3;letter-spacing:.08em;overflow-wrap:anywhere}
.meta{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 20px;margin:14px 0 0;color:var(--muted);font-family:var(--font-mono);font-size:12.5px;letter-spacing:.04em}
.msg,.cast li{--name:color-mix(in oklab,var(--c) var(--name-mix),var(--ink))}
.cast{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:18px 0 0;padding:0;list-style:none}
.cast li{display:inline-flex;align-items:center;gap:7px;padding:1px 11px;border:1px solid var(--line);border-radius:999px;background:var(--chip);font-size:12.5px;line-height:1.9}
.cast li::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--c)}
.tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:20px 0 0}
.tabs button{padding:3px 13px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);font:inherit;font-size:12.5px;cursor:pointer}
.tabs button:hover{border-color:var(--accent);color:var(--ink)}
.tabs button[aria-pressed="true"]{border-color:var(--accent);background:var(--accent);color:var(--accent-ink)}
.body{display:flex;flex-direction:column;gap:var(--gap)}
.day{display:flex;align-items:center;gap:16px;margin:26px 0 10px;color:var(--muted);font-family:var(--font-mono);font-size:12px;letter-spacing:.24em}
.day::before,.day::after{content:"";flex:1;height:1px;background:var(--line)}
.msg{position:relative;display:grid;grid-template-columns:var(--pt) minmax(0,1fr);gap:0 14px;padding:var(--msg-pad);background:var(--msg-bg);border-radius:var(--radius)}
.msg.cont{padding-top:0}
.cont .pt{height:0;visibility:hidden}
.cont .hd{display:none}
.pt{display:grid;place-items:center;width:var(--pt);height:var(--pt);overflow:hidden;border:var(--pt-border);border-radius:var(--pt-radius);background:var(--chip)}
.pt img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 0}
.ini{color:var(--name);font-family:var(--font-head);font-size:calc(var(--pt) * .42);font-weight:700}
.bd{min-width:0}
.hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;margin:0 0 2px}
.nm{color:var(--name);font-family:var(--font-head);font-weight:700;letter-spacing:.04em}
.tg{padding:0 8px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:11px;line-height:1.7}
.hd time{margin-left:auto;color:var(--muted);font-family:var(--font-mono);font-size:11.5px;letter-spacing:.04em}
.tx{overflow-wrap:anywhere}
.tx rt{font-size:.5em}
.ed{margin-left:8px;color:var(--muted);font-size:11px}
.ref{display:flex;gap:8px;max-width:100%;margin:4px 0 6px;padding:5px 12px;border-left:3px solid var(--accent);border-radius:0 var(--radius-sm) var(--radius-sm) 0;background:var(--quote-bg);color:var(--muted);font-size:13px;line-height:1.6}
.rn{flex:none;font-weight:700}
.rt{display:-webkit-box;min-width:0;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.att{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.att img{display:block;max-width:min(100%,320px);max-height:260px;border:1px solid var(--line);border-radius:var(--radius-sm)}
.ooc{opacity:.7}
.ooc .tx{font-size:.92em}
.seal{color:var(--muted);letter-spacing:.2em}
.sys{margin:8px 0;padding:0 8%;color:var(--muted);font-size:12.5px;line-height:1.7;text-align:center}
.sys span{display:inline-block;padding:3px 16px;border-radius:999px;background:var(--chip)}
.roll{grid-template-columns:24px minmax(0,1fr);gap:0 10px;margin-left:calc(var(--pt) + 14px);padding:8px 14px;background:var(--roll-bg);border:var(--roll-border);border-radius:var(--radius-sm)}
.roll .pt{width:24px;height:24px;border:0;border-radius:0;background:none;color:var(--accent)}
.roll .pt svg{width:22px;height:22px}
.roll .tx{font-family:var(--font-mono);font-size:13.5px;line-height:1.7}
.res{padding:0 2px;color:var(--ink);font-size:1.3em;font-weight:700}
.crit{--oc:var(--crit)}
.fumble{--oc:var(--fumble)}
.ok{--oc:var(--ok)}
.ng{--oc:var(--ng)}
.crit .res,.fumble .res{color:var(--oc)}
.oc{padding:0 9px;border-radius:999px;background:var(--oc);color:var(--oc-ink);font-size:11px;font-weight:700;letter-spacing:.1em;line-height:1.8}
.foot{margin-top:56px;color:var(--muted);font-size:11.5px;letter-spacing:.12em;text-align:center}
@media (max-width:640px){.log{--pt:38px;padding:24px 12px 48px}.head{padding:26px 16px 22px}.msg{gap:0 10px}.roll{margin-left:0}}
@media print{
:root{color-scheme:light;--bg:#fff!important;--paper:#fff!important;--ink:#111!important;--muted:#555!important;--line:#ccc!important;--chip:#f2f2f2!important;--quote-bg:#f5f5f5!important;--roll-bg:#fff!important;--roll-border:1px solid #ccc!important;--head-bg:#fff!important;--head-shadow:none!important;--msg-bg:transparent!important;--title:#111!important}
body{background:#fff!important;text-shadow:none!important}
body::before,body::after{display:none!important}
.log{margin:0 auto!important;background:#fff!important;box-shadow:none!important}
.title{background:none!important;color:#111!important;text-shadow:none!important;filter:none!important}
.tabs{display:none}
.msg,.sys{break-inside:avoid}
}
`;var f=`"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","Noto Serif CJK JP",serif`;var y=`"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Noto Sans JP","Meiryo",system-ui,sans-serif`;var A=`"Hiragino Maru Gothic ProN","M PLUS Rounded 1c","Yu Gothic UI","Noto Sans JP","Meiryo",sans-serif`;var O=`"SFMono-Regular","Cascadia Mono",Consolas,Menlo,"Osaka-Mono","MS Gothic",monospace`;var W=`"Courier New",Courier,"Osaka-Mono","MS Gothic",monospace`;var Fe=`
:root{--bg:#2b1d12;--paper:#f2e4c4;--ink:#3b2b1c;--muted:#80684a;--line:#cdb48a;--accent:#8a3b1f;--accent-ink:#fbf1dc;--chip:rgba(138,90,40,.1);--quote-bg:rgba(138,90,40,.08);--roll-bg:rgba(255,250,236,.55);--roll-border:1px dashed #bda274;--crit:#a87412;--fumble:#8e1c1c;--ok:#52692d;--ng:#7a6a58;--font-body:${f};--font-head:${f};--font-mono:${f};--flavor:"\u2766\\2003 CHRONICLE\\2003 \u2766";--head-bg:transparent;--head-border:0;--pt-border:2px solid #cdb48a;--name-mix:82%;--gap:4px}
body{background:radial-gradient(ellipse at 50% 30%,#5b4029 0%,#2b1d12 70%,#1a110a 100%) fixed}
.log{margin:48px auto;background-color:var(--paper);background-image:radial-gradient(circle at 18% 12%,rgba(255,255,255,.45),transparent 42%),radial-gradient(circle at 82% 88%,rgba(120,78,30,.16),transparent 46%),radial-gradient(ellipse at 50% 50%,transparent 62%,rgba(105,66,28,.28) 100%);border-radius:3px;box-shadow:0 0 0 1px #b89a6a,0 0 0 7px #efe0bd,0 0 0 8px #9c7d50,0 24px 70px rgba(0,0,0,.55)}
.head{margin-bottom:28px;border-bottom:3px double var(--line);border-radius:0}
.title{font-size:clamp(28px,5vw,44px);letter-spacing:.12em;text-shadow:0 1px 0 rgba(255,255,255,.5)}
.kicker{font-style:italic}
.day{letter-spacing:.3em}
.day span::before{content:"\u2767 "}
.pt{box-shadow:0 2px 6px rgba(80,50,20,.25)}
.nm{letter-spacing:.08em}
.tx{font-size:15.5px}
.oc{padding:1px 10px;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--oc) 65%,#fff),var(--oc) 60%,color-mix(in oklab,var(--oc) 70%,#000));box-shadow:0 1px 2px rgba(60,30,10,.4),inset 0 0 0 1px rgba(0,0,0,.15);text-shadow:0 1px 0 rgba(0,0,0,.25)}
.sys span{background:transparent;font-style:italic}
.foot::before{content:"\u2014 \u2726 \u2014";display:block;margin-bottom:8px;color:var(--line);letter-spacing:.3em}
@media (max-width:640px){.log{margin:0;border-radius:0;box-shadow:none}}
`;var _e=`
:root{color-scheme:dark;--bg:#0a0b0b;--paper:#121514;--ink:#cdd2cb;--muted:#7b847a;--line:#262c29;--accent:#9a2a2a;--accent-ink:#f4eaea;--chip:rgba(255,255,255,.035);--quote-bg:rgba(255,255,255,.03);--roll-bg:rgba(8,10,9,.7);--roll-border:1px solid #262c29;--crit:#a9cfa6;--fumble:#d0303a;--ok:#7f9c80;--ng:#666c66;--font-body:${f};--font-head:${f};--font-mono:${W};--flavor:"\u2014 CASE FILE \u2014";--head-bg:linear-gradient(180deg,#151918,#0e1110);--head-shadow:inset 0 0 80px rgba(0,0,0,.7);--radius:2px;--radius-sm:2px;--pt-radius:2px;--pt-border:1px solid #2e3531;--name-mix:50%;--msg-pad:12px 14px}
body{background:radial-gradient(ellipse at 50% -10%,#1d2220 0%,#0a0b0b 55%,#040404 100%) fixed}
body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.7) 100%)}
.head::after{content:"";position:absolute;right:28px;bottom:0;left:28px;height:1px;background:linear-gradient(90deg,transparent,var(--accent),transparent)}
.title{font-weight:600;letter-spacing:.2em;text-shadow:0 0 22px rgba(154,42,42,.55),0 0 2px rgba(0,0,0,.9)}
.pt img{filter:grayscale(.6) sepia(.15) contrast(1.1) brightness(.85);transition:filter .4s}
.msg:hover .pt img{filter:none}
.msg{border-left:1px solid transparent;transition:background .3s,border-color .3s}
.msg:hover{border-left-color:var(--accent);background:rgba(255,255,255,.02)}
.nm{letter-spacing:.12em}
.roll{border-left:2px solid var(--accent)}
.roll .pt{color:var(--muted)}
.oc{border:1px solid var(--oc);border-radius:0;background:transparent;color:var(--oc);font-family:var(--font-mono);letter-spacing:.24em}
.crit .res{text-shadow:0 0 12px rgba(169,207,166,.6)}
.fumble .res{text-shadow:0 0 10px rgba(208,48,58,.8),0 0 2px #000}
.day{color:#5c645b}
.sys span{border:1px dashed var(--line);border-radius:0;background:transparent;font-family:var(--font-mono);letter-spacing:.08em}
::selection{background:#9a2a2a;color:#fff}
`;var Xe=`
:root{color-scheme:dark;--bg:#05070f;--paper:rgba(9,16,34,.78);--ink:#dce8ff;--muted:#7d90b5;--line:rgba(64,196,255,.24);--accent:#2bd4ff;--accent-ink:#03121a;--chip:rgba(43,212,255,.08);--quote-bg:rgba(43,212,255,.06);--roll-bg:rgba(6,12,28,.88);--roll-border:1px solid rgba(43,212,255,.38);--crit:#2effc8;--fumble:#ff2f8e;--ok:#2bd4ff;--ng:#66779a;--font-body:${y};--font-head:${y};--font-mono:${O};--flavor:"// SESSION_LOG";--head-border:1px solid rgba(43,212,255,.35);--head-shadow:inset 0 0 40px rgba(43,212,255,.08);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid rgba(43,212,255,.55);--name-mix:42%;--oc-ink:#03121a;--gap:6px;--msg-bg:linear-gradient(90deg,rgba(43,212,255,.06),transparent 55%)}
body{background:radial-gradient(ellipse at 15% -10%,rgba(255,47,142,.22),transparent 50%),radial-gradient(ellipse at 90% 110%,rgba(43,212,255,.2),transparent 55%),linear-gradient(rgba(43,212,255,.045) 1px,transparent 1px) 0 0/100% 28px,linear-gradient(90deg,rgba(43,212,255,.045) 1px,transparent 1px) 0 0/28px 100%,#05070f;background-attachment:fixed}
.head::after{content:"";position:absolute;inset:-1px;pointer-events:none;background:linear-gradient(var(--accent),var(--accent)) 0 0/20px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) 0 0/2px 20px no-repeat,linear-gradient(var(--accent),var(--accent)) 100% 100%/20px 2px no-repeat,linear-gradient(var(--accent),var(--accent)) 100% 100%/2px 20px no-repeat}
.title{font-weight:800;letter-spacing:.14em;text-shadow:0 0 14px rgba(43,212,255,.65),2px 0 rgba(255,47,142,.55),-2px 0 rgba(43,212,255,.55)}
.kicker{color:var(--accent);font-family:var(--font-mono)}
.msg{border-left:2px solid color-mix(in oklab,var(--c) 45%,var(--accent))}
.nm{text-shadow:0 0 10px color-mix(in oklab,var(--c) 35%,var(--accent))}
.hd time::before{content:"["}
.hd time::after{content:"]"}
.pt{box-shadow:0 0 14px rgba(43,212,255,.28)}
.roll{border-left:2px solid var(--accent);box-shadow:inset 0 0 24px rgba(43,212,255,.08),0 0 18px rgba(43,212,255,.08)}
.res{text-shadow:0 0 12px currentColor}
.oc{border-radius:0;font-family:var(--font-mono);box-shadow:0 0 12px var(--oc)}
.day{color:var(--accent)}
.day::before{background:linear-gradient(90deg,transparent,var(--line))}
.day::after{background:linear-gradient(90deg,var(--line),transparent)}
.cast li,.tabs button,.tg,.ref{border-radius:0}
.cast li::before{border-radius:0;box-shadow:0 0 6px var(--c)}
.sys span{border:1px solid var(--line);border-radius:0;background:rgba(43,212,255,.06);font-family:var(--font-mono)}
::selection{background:#ff2f8e;color:#fff}
`;var je=`
:root{--bg:#e8e0cf;--paper:#fbf8f0;--ink:#2a2521;--muted:#7d7166;--line:#dcd1bd;--accent:#b52b2e;--accent-ink:#fff8f0;--chip:rgba(42,37,33,.05);--quote-bg:rgba(181,43,46,.05);--roll-bg:#fffdf8;--roll-border:1px solid #dcd1bd;--crit:#b52b2e;--fumble:#2a2521;--ok:#35557a;--ng:#8b8074;--font-body:${f};--font-head:${f};--font-mono:${f};--head-bg:transparent;--head-border:0;--radius:0;--radius-sm:0;--pt-radius:3px;--pt-border:1px solid #cfc3ad;--msg-pad:14px 16px;--gap:0}
body{background-color:#e8e0cf;background-image:repeating-linear-gradient(118deg,rgba(110,90,60,.035) 0 1px,transparent 1px 7px),repeating-linear-gradient(28deg,rgba(110,90,60,.03) 0 1px,transparent 1px 11px)}
.log{margin:48px auto;background:var(--paper);border-top:5px solid var(--accent);box-shadow:0 1px 0 #d6cbb6,0 22px 50px rgba(80,60,30,.14)}
.head{border-bottom:1px solid var(--line);border-radius:0}
.head::before{content:"\u8A18\u9332";display:inline-block;margin-bottom:16px;padding:8px 5px;border:2px solid var(--accent);border-radius:4px;color:var(--accent);font-family:var(--font-head);font-size:14px;font-weight:700;letter-spacing:.25em;writing-mode:vertical-rl;transform:rotate(-5deg);opacity:.9}
.title{font-weight:600;letter-spacing:.24em}
.msg{border-top:1px solid rgba(220,209,189,.7)}
.msg.cont,.day+.msg{border-top:0}
.nm{letter-spacing:.14em}
.ini{font-weight:600}
.roll{margin-top:4px;margin-bottom:8px;border-left:3px solid var(--accent)}
.oc{padding:0 7px;border:2px solid var(--oc);border-radius:4px;background:transparent;color:var(--oc);font-family:var(--font-head);letter-spacing:.14em;transform:rotate(-4deg)}
.day span::before{content:"\u301C "}
.day span::after{content:" \u301C"}
.sys span{border-top:1px solid var(--line);border-bottom:1px solid var(--line);border-radius:0;background:transparent;letter-spacing:.1em}
.foot::before{content:"";display:block;width:34px;height:34px;margin:0 auto 10px;border:2px solid var(--accent);border-radius:50%;opacity:.7}
@media (max-width:640px){.log{margin:0;box-shadow:none}}
`;var ze=`
:root{--bg:#dfe5ec;--paper:#ffffff;--ink:#1e2733;--muted:#6a7686;--line:#d3dae3;--accent:#2f6fed;--accent-ink:#fff;--chip:#eef2f7;--quote-bg:rgba(255,255,255,.6);--roll-bg:#fff;--roll-border:0;--crit:#d98b00;--fumble:#e0245e;--ok:#12a36e;--ng:#8a95a5;--font-body:${y};--font-head:${y};--font-mono:${y};--head-bg:rgba(255,255,255,.9);--head-border:0;--head-shadow:0 10px 30px rgba(30,39,51,.08);--radius:20px;--radius-sm:14px;--name-mix:78%;--gap:6px;--msg-pad:0}
body{background:linear-gradient(180deg,#e8edf3 0%,#d9e0e9 100%) fixed}
.log{max-width:760px}
.head{border-radius:22px}
.title{font-size:clamp(22px,4vw,30px);letter-spacing:.04em}
.hd{margin:0 0 3px 4px;font-size:12px}
.nm{font-size:12.5px;letter-spacing:.02em}
.hd time{margin-left:0}
.tx{display:inline-block;max-width:100%;padding:9px 15px;border-radius:4px 18px 18px 18px;background:color-mix(in oklab,var(--c) 6%,#fff);box-shadow:0 1px 2px rgba(30,39,51,.1);line-height:1.7}
.cont .tx{border-radius:18px}
.ref{margin:0 0 4px;padding:6px 12px;border-left:0;border-radius:12px}
.att img{border:0;border-radius:14px;box-shadow:0 1px 3px rgba(30,39,51,.15)}
.roll{width:fit-content;max-width:calc(100% - var(--pt) - 14px);padding:9px 15px;border-radius:16px;box-shadow:0 1px 2px rgba(30,39,51,.1)}
.roll .tx{display:block;padding:0;border-radius:0;background:none;box-shadow:none}
.day{justify-content:center;font-family:var(--font-body);letter-spacing:.08em}
.day::before,.day::after{display:none}
.day span{padding:2px 14px;border-radius:999px;background:rgba(30,39,51,.28);color:#fff;font-size:11.5px}
.sys span{background:rgba(30,39,51,.08);font-size:12px}
.oc{letter-spacing:.04em}
@media (max-width:640px){.roll{max-width:100%}}
`;var ye={parchment:Fe,washi:je,gothic:`
:root{color-scheme:dark;--bg:#120a0e;--paper:#1c1016;--ink:#eadbd9;--muted:#a08790;--line:#4a2530;--accent:#b8923e;--accent-ink:#1a0d10;--chip:rgba(184,146,62,.08);--quote-bg:rgba(120,20,40,.2);--roll-bg:rgba(30,12,18,.85);--roll-border:1px solid #5a2a36;--crit:#d4af37;--fumble:#c41e3a;--ok:#a3b18a;--ng:#7d6970;--font-body:${f};--font-head:${f};--font-mono:${f};--flavor:"\u2726 NOCTURNE \u2726";--head-bg:linear-gradient(180deg,#24121a,#160b10);--head-border:1px solid #5a2a36;--head-shadow:inset 0 0 0 1px rgba(184,146,62,.3),0 0 0 4px #120a0e,0 0 0 5px rgba(184,146,62,.4);--radius:2px;--radius-sm:2px;--pt-border:2px solid rgba(184,146,62,.6);--name-mix:55%;--oc-ink:#1a0d10;--title:#ecd9a8}
body{background:radial-gradient(ellipse at 50% 0%,#3a1320 0%,#120a0e 55%,#07040a 100%) fixed}
.head::after{content:"\u2766";display:block;margin-top:14px;color:var(--accent);font-size:18px}
.title{font-weight:600;letter-spacing:.16em;text-shadow:0 0 18px rgba(196,30,58,.45)}
.kicker{color:var(--accent);letter-spacing:.3em}
.pt{box-shadow:0 0 0 3px #120a0e,0 0 0 4px rgba(184,146,62,.3)}
.nm{letter-spacing:.1em}
.msg:not(.roll):hover{background:rgba(196,30,58,.05)}
.roll{border-left:2px solid var(--accent)}
.oc{border-radius:2px;background:linear-gradient(180deg,color-mix(in oklab,var(--oc) 75%,#fff),var(--oc));letter-spacing:.16em}
.fumble .res{text-shadow:0 0 10px rgba(196,30,58,.7)}
.day{color:var(--accent)}
.day span::before{content:"\u2726 "}
.day span::after{content:" \u2726"}
.day::before{background:linear-gradient(90deg,transparent,rgba(184,146,62,.5))}
.day::after{background:linear-gradient(90deg,rgba(184,146,62,.5),transparent)}
.sys span{background:transparent;color:var(--accent);letter-spacing:.12em}
.foot::before{content:"\u2020";display:block;margin-bottom:6px;color:var(--accent);font-size:16px}
::selection{background:#c41e3a;color:#fff}
`,eerie:_e,noir:`
:root{color-scheme:dark;--bg:#141414;--paper:#1f1e1b;--ink:#e6e1d6;--muted:#8f887b;--line:#3a3732;--accent:#d9a441;--accent-ink:#1a1408;--chip:rgba(230,225,214,.05);--quote-bg:rgba(217,164,65,.07);--roll-bg:#191816;--roll-border:1px solid #3a3732;--crit:#e8c170;--fumble:#c9463d;--ok:#b9b09c;--ng:#6f695e;--font-body:${f};--font-head:${f};--font-mono:${W};--flavor:"CONFIDENTIAL";--head-border:1px solid #3a3732;--head-shadow:0 20px 50px rgba(0,0,0,.5);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid #4a463f;--name-mix:40%;--oc-ink:#1a1408}
body{background:radial-gradient(ellipse at 30% 0%,#2a2824 0%,#141414 60%,#0b0b0b 100%) fixed}
body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:repeating-linear-gradient(170deg,rgba(255,236,190,.035) 0 34px,transparent 34px 72px)}
.head::before{display:inline-block;margin-bottom:18px;padding:2px 12px;border:2px solid var(--accent);font-weight:700;letter-spacing:.3em;transform:rotate(-3deg)}
.title{letter-spacing:.1em}
.pt img{filter:grayscale(1) contrast(1.15);transition:filter .4s}
.msg:hover .pt img{filter:grayscale(.2)}
.nm{letter-spacing:.08em}
.roll{border-left:3px solid var(--accent)}
.oc{border-radius:0;font-family:var(--font-mono);letter-spacing:.18em}
.day span::before{content:"\u2014 "}
.day span::after{content:" \u2014"}
.sys span{border:1px solid var(--line);border-radius:0;background:transparent;font-family:var(--font-mono);letter-spacing:.06em}
.cast li,.tabs button,.tg,.ref{border-radius:0}
::selection{background:#d9a441;color:#141414}
`,neon:Xe,terminal:`
:root{color-scheme:dark;--bg:#030a04;--paper:#051006;--ink:#8dff98;--muted:#44a152;--line:rgba(80,255,120,.22);--accent:#7dff8a;--accent-ink:#021003;--chip:rgba(80,255,120,.06);--quote-bg:rgba(80,255,120,.05);--roll-bg:rgba(3,14,5,.9);--roll-border:1px dashed rgba(80,255,120,.35);--crit:#e6ff7a;--fumble:#ff6a5c;--ok:#7dff8a;--ng:#44a152;--font-body:${O};--font-head:${O};--font-mono:${O};--flavor:"> SESSION LOG";--head-bg:transparent;--head-border:1px solid rgba(80,255,120,.35);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid rgba(80,255,120,.45);--name-mix:25%;--oc-ink:#021003;--gap:0;--msg-pad:6px 12px}
body{background:radial-gradient(ellipse at center,#062b0c 0%,#030a04 70%) fixed;font-size:14px;text-shadow:0 0 4px rgba(125,255,138,.45)}
body::after{content:"";position:fixed;inset:0;z-index:1;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 1px,transparent 1px 3px)}
.log{--pt:34px}
.head{text-align:left}
.title::after{content:"_";animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.title::after{animation:none}}
.meta,.cast,.tabs{justify-content:flex-start}
.pt{background:transparent}
.pt img{filter:grayscale(1) sepia(1) hue-rotate(70deg) saturate(2.5) brightness(.9)}
.ini{color:var(--accent)}
.nm::before{content:"<"}
.nm::after{content:">"}
.hd time::before{content:"["}
.hd time::after{content:"]"}
.cast li,.tabs button,.tg,.sys span,.ref,.oc{border-radius:0}
.cast li::before{border-radius:0}
.oc{letter-spacing:.1em;text-shadow:none}
.sys span{border:1px dashed var(--line);background:transparent}
.att img{filter:grayscale(1) sepia(1) hue-rotate(70deg) saturate(2)}
::selection{background:#7dff8a;color:#021003;text-shadow:none}
`,cosmos:`
:root{color-scheme:dark;--bg:#070818;--paper:rgba(16,18,48,.72);--ink:#e6e8ff;--muted:#8d92c4;--line:rgba(160,170,255,.2);--accent:#f5c96a;--accent-ink:#17120a;--chip:rgba(160,170,255,.08);--quote-bg:rgba(160,170,255,.07);--roll-bg:rgba(12,14,40,.8);--roll-border:1px solid rgba(245,201,106,.35);--crit:#ffd978;--fumble:#ff6b8b;--ok:#8fd3ff;--ng:#7a7fae;--font-body:${y};--font-head:${f};--font-mono:${y};--flavor:"\u2727 STARLOG \u2727";--head-border:1px solid rgba(160,170,255,.25);--head-shadow:0 0 60px rgba(120,100,255,.18);--radius:14px;--radius-sm:10px;--pt-border:2px solid rgba(245,201,106,.55);--name-mix:45%;--oc-ink:#17120a;--title:#fff4d6;--msg-bg:linear-gradient(90deg,rgba(160,170,255,.05),transparent 70%)}
body{background:radial-gradient(1px 1px at 23px 41px,#fff,transparent) 0 0/173px 173px,radial-gradient(1px 1px at 97px 131px,#dfe4ff,transparent) 0 0/211px 211px,radial-gradient(1.5px 1.5px at 151px 67px,#fff6d6,transparent) 0 0/263px 263px,radial-gradient(1px 1px at 61px 199px,#fff,transparent) 0 0/307px 307px,radial-gradient(ellipse at 15% 5%,rgba(140,80,255,.28),transparent 50%),radial-gradient(ellipse at 85% 95%,rgba(40,150,255,.22),transparent 55%),#070818;background-attachment:fixed}
.head{backdrop-filter:blur(4px)}
.title{font-weight:600;letter-spacing:.12em;text-shadow:0 0 24px rgba(245,201,106,.45)}
.pt{box-shadow:0 0 16px rgba(245,201,106,.25)}
.roll{box-shadow:0 0 20px rgba(245,201,106,.08)}
.crit .res{text-shadow:0 0 14px rgba(255,217,120,.8)}
.oc{box-shadow:0 0 10px var(--oc)}
.day{color:var(--accent)}
.day span::before{content:"\u2726 "}
.day span::after{content:" \u2726"}
.day::before{background:linear-gradient(90deg,transparent,var(--line))}
.day::after{background:linear-gradient(90deg,var(--line),transparent)}
.foot::before{content:"\u2727 \u2726 \u2727";display:block;margin-bottom:8px;color:var(--accent);letter-spacing:.4em}
::selection{background:#f5c96a;color:#17120a}
`,military:`
:root{color-scheme:dark;--bg:#1e2218;--paper:#262b1f;--ink:#dfe3cf;--muted:#98a07f;--line:#434a36;--accent:#d9c45a;--accent-ink:#1e2218;--chip:rgba(223,227,207,.05);--quote-bg:rgba(217,196,90,.06);--roll-bg:#20241a;--roll-border:1px solid #545c42;--crit:#d9e36a;--fumble:#e0603a;--ok:#9fbf6a;--ng:#7a8068;--font-body:${y};--font-head:${y};--font-mono:${O};--flavor:"// OPERATION LOG // CLASSIFIED";--head-border:1px solid #545c42;--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid #6b7452;--name-mix:50%;--oc-ink:#1e2218}
body{background:repeating-linear-gradient(45deg,rgba(0,0,0,.08) 0 2px,transparent 2px 6px),radial-gradient(ellipse at center,#2a3021 0%,#161a12 100%);background-attachment:fixed}
.head{padding-top:42px}
.head::after{content:"";position:absolute;top:0;right:0;left:0;height:6px;background:repeating-linear-gradient(-45deg,#d9c45a 0 10px,#1e2218 10px 20px)}
.head::before{letter-spacing:.3em}
.title{font-weight:800;letter-spacing:.18em}
.meta{text-transform:uppercase}
.pt img{filter:saturate(.6) contrast(1.05)}
.msg{border-left:3px solid color-mix(in oklab,var(--c) 50%,#6b7452)}
.nm{letter-spacing:.06em}
.roll{border-left:3px solid var(--accent)}
.oc{border-radius:0;font-family:var(--font-mono);letter-spacing:.18em}
.day{color:var(--accent)}
.day::before,.day::after{background:repeating-linear-gradient(90deg,var(--line) 0 8px,transparent 8px 12px)}
.cast li,.tabs button,.tg,.sys span,.ref{border-radius:0}
.cast li::before{border-radius:0}
.sys span{border:1px solid var(--line);background:transparent;font-family:var(--font-mono);letter-spacing:.08em}
::selection{background:#d9c45a;color:#1e2218}
`,steampunk:`
:root{color-scheme:dark;--bg:#1b130c;--paper:#2a1d12;--ink:#efdcbc;--muted:#b0916a;--line:#6b4a2b;--accent:#d49a3a;--accent-ink:#1b130c;--chip:rgba(212,154,58,.1);--quote-bg:rgba(212,154,58,.08);--roll-bg:linear-gradient(180deg,#332416,#261a10);--roll-border:1px solid #8a6232;--crit:#f0c05a;--fumble:#c0492e;--ok:#8fae6a;--ng:#8a7358;--font-body:${f};--font-head:${f};--font-mono:${W};--flavor:"\u2699 ENGINE LOG \u2699";--head-bg:linear-gradient(180deg,#3a2816,#241a0f);--head-border:2px solid #8a6232;--head-shadow:inset 0 0 0 4px #241a0f,inset 0 0 0 5px rgba(212,154,58,.45),0 12px 30px rgba(0,0,0,.5);--pt-border:3px solid #b07f38;--name-mix:55%;--oc-ink:#1b130c}
body{background:radial-gradient(ellipse at 50% 0%,#3d2a17 0%,#1b130c 60%,#0f0a06 100%) fixed}
.title{background:linear-gradient(180deg,#fbe3a3,#c8903a 55%,#8a5a22);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:.14em;filter:drop-shadow(0 2px 0 rgba(0,0,0,.6))}
.pt{box-shadow:0 0 0 2px #2a1d12,0 0 0 4px #6b4a2b,0 3px 8px rgba(0,0,0,.5)}
.nm{letter-spacing:.08em}
.roll{box-shadow:inset 0 1px 0 rgba(255,220,160,.1)}
.oc{border-radius:3px;background:linear-gradient(180deg,color-mix(in oklab,var(--oc) 70%,#fff),var(--oc) 60%,color-mix(in oklab,var(--oc) 70%,#000));box-shadow:0 1px 0 rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.3)}
.day{color:var(--accent)}
.day span::before{content:"\u2699 "}
.day span::after{content:" \u2699"}
.day::before,.day::after{height:2px;background:linear-gradient(90deg,#6b4a2b,#b07f38,#6b4a2b)}
.sys span{border:1px solid #6b4a2b;border-radius:3px;background:transparent;font-family:var(--font-mono)}
::selection{background:#d49a3a;color:#1b130c}
`,ocean:`
:root{--bg:#0f2a3d;--paper:#f4ead3;--ink:#23303a;--muted:#6d7a80;--line:#cdbd98;--accent:#1d5f86;--accent-ink:#fff;--chip:rgba(29,95,134,.08);--quote-bg:rgba(29,95,134,.07);--roll-bg:rgba(255,252,242,.7);--roll-border:1px solid #cdbd98;--crit:#c8932a;--fumble:#a8322d;--ok:#2d7a5f;--ng:#7d8790;--font-body:${f};--font-head:${f};--font-mono:${f};--flavor:"\u2248 SHIP'S LOG \u2248";--head-bg:transparent;--head-border:0;--radius:4px;--radius-sm:3px;--pt-border:2px solid #1d5f86;--name-mix:82%;--gap:4px}
body{background:radial-gradient(circle at 50% 100%,transparent 14px,rgba(255,255,255,.05) 15px 16px,transparent 17px) 0 0/40px 20px,linear-gradient(180deg,#123a55 0%,#0b2233 100%);background-attachment:fixed}
.log{margin:48px auto;background-color:var(--paper);background-image:linear-gradient(rgba(29,95,134,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(29,95,134,.07) 1px,transparent 1px),radial-gradient(ellipse at 50% 50%,transparent 60%,rgba(120,90,40,.2) 100%);background-size:48px 48px,48px 48px,100% 100%;border-radius:4px;box-shadow:0 0 0 6px #f4ead3,0 0 0 8px #1d5f86,0 24px 60px rgba(0,0,0,.5)}
.head{border-bottom:2px solid var(--accent);border-radius:0}
.title{letter-spacing:.12em}
.pt{box-shadow:0 0 0 3px #f4ead3,0 0 0 4px rgba(29,95,134,.4)}
.roll{border-left:3px solid var(--accent)}
.day{color:var(--accent)}
.day span::before{content:"\u2248 "}
.day span::after{content:" \u2248"}
.sys span{border:1px dashed var(--line);background:transparent}
.foot::before{content:"\u2248\u2248\u2248";display:block;margin-bottom:6px;color:var(--accent);letter-spacing:.2em}
@media (max-width:640px){.log{margin:0;border-radius:0;box-shadow:none}}
`,messenger:ze,notebook:`
:root{--bg:#d8d0bf;--paper:#fdfcf7;--ink:#243a73;--muted:#7a869f;--line:#c7d3ea;--accent:#e0524f;--accent-ink:#fff;--chip:rgba(36,58,115,.06);--quote-bg:rgba(255,236,120,.35);--roll-bg:rgba(255,255,255,.75);--roll-border:1.5px dashed #9fb0d6;--crit:#e0524f;--fumble:#4a4a4a;--ok:#2f8f5b;--ng:#8a8a8a;--font-body:${A};--font-head:${A};--font-mono:${A};--head-bg:transparent;--head-border:0;--radius:0;--radius-sm:4px;--pt-border:2px solid #c7d3ea;--name-mix:75%;--gap:0;--msg-pad:6px 14px}
body{background:linear-gradient(135deg,#e7e1d3,#d2c9b6) fixed}
.log{position:relative;margin:40px auto;padding-left:84px;background-color:var(--paper);background-image:linear-gradient(90deg,transparent 62px,rgba(224,82,79,.55) 62px,rgba(224,82,79,.55) 64px,transparent 64px),repeating-linear-gradient(transparent 0 31px,#c7d3ea 31px 32px);box-shadow:0 1px 2px rgba(0,0,0,.08),0 12px 30px rgba(60,50,30,.15)}
.log::before{content:"";position:absolute;top:24px;bottom:24px;left:20px;width:18px;background:radial-gradient(circle,#d8d0bf 7px,transparent 8px) 0 0/18px 64px repeat-y}
.head{text-align:left;border-bottom:2px solid var(--ink);border-radius:0}
.meta,.cast,.tabs{justify-content:flex-start}
.title{letter-spacing:.04em}
.ref{border-left-color:#f2c200}
.oc{border:2px solid var(--oc);background:transparent;color:var(--oc);transform:rotate(-6deg)}
.day{color:var(--accent)}
.day::before,.day::after{background:repeating-linear-gradient(90deg,var(--accent) 0 6px,transparent 6px 10px)}
.sys span{border-radius:0;background:#fff6b3;box-shadow:0 1px 2px rgba(0,0,0,.12);transform:rotate(-1deg)}
.cast li{background:#fff}
::selection{background:#fff176;color:#243a73}
@media (max-width:640px){.log{margin:0;padding-left:36px;background-image:linear-gradient(90deg,transparent 22px,rgba(224,82,79,.55) 22px,rgba(224,82,79,.55) 24px,transparent 24px),repeating-linear-gradient(transparent 0 31px,#c7d3ea 31px 32px);box-shadow:none}.log::before{display:none}}
`,pop:`
:root{--bg:#fff4f8;--paper:#ffffff;--ink:#3d2c4a;--muted:#9a85a8;--line:#f3cfe0;--accent:#ff5fa2;--accent-ink:#fff;--chip:#fff0f6;--quote-bg:#fffafc;--roll-bg:#ffffff;--roll-border:3px solid #3d2c4a;--crit:#ffd23f;--fumble:#b9a6ff;--ok:#7ee8c0;--ng:#e5dcea;--font-body:${A};--font-head:${A};--font-mono:${A};--flavor:"\u2605 PLAY LOG \u2605";--head-bg:#fff;--head-border:3px solid #3d2c4a;--head-shadow:6px 6px 0 #3d2c4a;--radius:18px;--radius-sm:14px;--pt-border:3px solid #3d2c4a;--name-mix:85%;--oc-ink:#3d2c4a;--gap:10px;--msg-pad:0}
body{background-color:#fff4f8;background-image:radial-gradient(#ffc6de 2px,transparent 2.5px),radial-gradient(#c9f0ff 2px,transparent 2.5px);background-size:28px 28px;background-position:0 0,14px 14px}
.head::before{color:#3d2c4a}
.title{color:var(--accent);font-weight:800;letter-spacing:.04em;text-shadow:3px 3px 0 #3d2c4a}
.hd{margin:0 0 4px 4px}
.nm{font-weight:800}
.hd time{margin-left:0}
.tx{display:inline-block;max-width:100%;padding:8px 16px;border:3px solid #3d2c4a;border-radius:18px;background:#fff;box-shadow:4px 4px 0 color-mix(in oklab,var(--c) 70%,#3d2c4a)}
.roll{width:fit-content;max-width:calc(100% - var(--pt) - 14px);padding:8px 16px;box-shadow:4px 4px 0 #3d2c4a}
.roll .tx{display:block;padding:0;border:0;border-radius:0;background:none;box-shadow:none}
.crit .res,.fumble .res{color:#3d2c4a;background:linear-gradient(transparent 55%,var(--oc) 55%)}
.oc{border:2px solid #3d2c4a;box-shadow:2px 2px 0 #3d2c4a}
.ref{border:2px dashed #f3a6c8;border-radius:12px}
.att img{border:3px solid #3d2c4a;border-radius:14px}
.day{justify-content:center;letter-spacing:.1em}
.day::before,.day::after{display:none}
.day span{padding:2px 14px;border-radius:999px;background:#3d2c4a;color:#fff}
.sys span{border:2px dashed #f3a6c8;background:#fff}
.cast li,.tabs button{border:2px solid #3d2c4a;background:#fff;color:#3d2c4a;font-weight:700}
::selection{background:#ff5fa2;color:#fff}
@media (max-width:640px){.roll{max-width:100%}}
`};var Je={secret:`シークレットダイス`,edited:`編集済`,quote:`引用`,reply:`返信先`,critical:`クリティカル`,fumble:`ファンブル`,success:`成功`,failure:`失敗`,allTabs:`全タブ`,everyTab:`すべて`,messages:r=>`${r} \u4EF6\u306E\u767A\u8A00`,exportedWith:`Udonarium Axe`};var Ke=300*1e3;var Ve=32;var Qe=`#666666`;var Ze=/^(#[0-9a-f]{3,8}|[a-z]{3,20}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i;var et=/^<(?:Secret-)?BCDice[：:](.*)>$/s;var tt={critical:`crit`,fumble:`fumble`,success:`ok`,failure:`ng`};var at=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/></svg>`;var rt=`<script>(function(){var n=document.querySelector(".tabs");if(!n)return;n.addEventListener("click",function(e){var b=e.target.closest("button[data-tab]");if(!b)return;var t=b.getAttribute("data-tab");n.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});document.querySelectorAll("[data-t]").forEach(function(el){el.hidden=t!=="*"&&el.getAttribute("data-t")!==t;});});})();<\/script>`;var l=A$1.escapeHtml;var F=A$1.escapeAttribute;function we(r,e,t,a={}){let o=E(E({},Je),a.labels),n=e===`all`?A$1.spokenTabs(t):t.slice(0,1),i=e===`all`?A$1.mergeEntries(n,a.userId):ot(n[0],a),s=e===`all`&&n.length>1,c={options:a,labels:o,showTab:s},d=e===`all`?o.allTabs:n[0]?.name??``,p=a.roomName?`${d} \u2014 ${a.roomName}`:d,b=`<footer class="foot">${l(o.exportedWith)}`+(a.exportedAt!=null?` \xB7 ${B(a.exportedAt)}`:``)+`</footer>`;return`<!DOCTYPE html>
<html lang="${F(a.lang||`ja`)}" data-style="${r}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Udonarium Axe">
<title>${l(p)}</title>
<style>${ve}${ye[r]}</style>
</head>
<body>
<div class="log">
`+nt(d,i,n,s,c)+`
<main class="body">
`+st(i,c)+`</main>
`+b+`
</div>
`+(s?rt+`
`:``)+`</body>
</html>`}function ot(r,e){return r?r.chatMessages.filter(t=>A$1.isVisibleMessage(t,e.userId)).map(t=>({tab:r,tabIndex:0,message:t})):[]}function C(r){return r.isDicebot?`roll`:r.isSystemMessage?`system`:`say`}function nt(r,e,t,a,o){let{labels:n,options:i}=o,s=i.roomName?`<p class="kicker">${l(i.roomName)}</p>`:``,c=e.filter(g=>C(g.message)!==`system`),d=[],p=ht(e);p&&d.push(`<span>${p}</span>`),d.push(`<span>${l(n.messages(c.length))}</span>`);let b=it(c,o),x=b.length?`<ul class="cast">${b.map(g=>`<li style="--c:${g.color}">${l(g.name)}</li>`).join(``)}</ul>`:``,u=a?`<nav class="tabs"><button type="button" data-tab="*" aria-pressed="true">${l(n.everyTab)}</button>`+t.map((g,h)=>`<button type="button" data-tab="${h}" aria-pressed="false">${l(g.name)}</button>`).join(``)+`</nav>`:``;return`<header class="head">`+s+`<h1 class="title">${l(r)}</h1><p class="meta">${d.join(``)}</p>`+x+u+`</header>`}function it(r,e){let t=new Map;for(let{message:a}of r){if(C(a)!==`say`)continue;let o=S(a.name,e).trim();if(!(!o||t.has(o))&&(t.set(o,Y(a.messColor)),t.size>=Ve))break}return[...t].map(([a,o])=>({name:a,color:o}))}function st(r,e){let t=[],a=``,o=null;for(let n of r){let i=X(n.message.placedAt);i!==a&&(a=i,t.push(`<div class="day"><span>${i}</span></div>
`),o=null),t.push(ct(n,dt(o,n),e)),o=n}return t.join(``)}function dt(r,e){if(!r)return!1;let t=r.message,a=e.message;return C(t)===`say`&&C(a)===`say`&&r.tabIndex===e.tabIndex&&t.name===a.name&&t.messColor===a.messColor&&t.image?.identifier===a.image?.identifier&&!t.isSecret&&!a.isSecret&&!!t.isOutOfStory==!!a.isOutOfStory&&a.placedAt-t.placedAt<Ke}function ct(r,e,t){switch(C(r.message)){case`roll`:return pt(r,t);case`system`:return ft(r,t);default:return lt(r,e,t)}}function lt(r,e,t){let{message:a}=r,{labels:o}=t,n=S(a.name,t),i=!a.isSecret||A$1.canSee(a,t.options.userId),s=[`msg`];e&&s.push(`cont`),a.isOutOfStory&&s.push(`ooc`),i||s.push(`sealed`);let c=i?Ae(v(a.vnEmote,S(a.text,t)))+bt(a,t):`<span class="seal">${l(o.secret)}</span>`,d=a.fixd?`<span class="ed">${l(o.edited)}</span>`:``;return`<article class="${s.join(` `)}" data-t="${r.tabIndex}" style="--c:${Y(a.messColor)}"><div class="pt">${gt(a,n,t)}</div><div class="bd"><div class="hd"><span class="nm">${l(n)}</span>${Te(r,t)}${Se(a)}</div>`+mt(a,t)+`<div class="tx">${c}${d}</div></div></article>
`}function pt(r,e){let{message:t}=r,{labels:a}=e,o=!t.isSecret||A$1.canSee(t,e.options.userId),n=o?t.rollDetail?.outcome??``:``,i=[`msg`,`roll`];n&&i.push(tt[n]),t.isOutOfStory&&i.push(`ooc`),o||i.push(`sealed`);let s=ut(S(t.name,e)),c=n?`<span class="oc">${l(a[n])}</span>`:``,d=o?xt(S(t.text,e)):`<span class="seal">${l(a.secret)}</span>`;return`<article class="${i.join(` `)}" data-t="${r.tabIndex}" style="--c:${Y(t.messColor)}"><div class="pt">${at}</div><div class="bd"><div class="hd"><span class="nm">${l(s)}</span>${c}${Te(r,e)}${Se(t)}</div><div class="tx">${d}</div></div></article>
`}function ft(r,e){return`<div class="sys" data-t="${r.tabIndex}"><span>${Ae(S(r.message.text,e))}</span></div>
`}function Te(r,e){return e.showTab?`<span class="tg">${l(r.tab.name)}</span>`:``}function Se(r){return`<time>${J(r.timestamp)}</time>`}function gt(r,e,t){let a=r.image,o=a?t.options.imageSrcResolver?.(a)??a.url:``;if(a&&o)return`<img data-img-key="${F(o)}" alt="">`;return`<span class="ini">${l(Array.from(e.trim())[0]??``)}</span>`}function mt(r,e){let{labels:t}=e,a=r.quoteOf?r.quoteOfMessage:null,o=r.replyTo?r.replyToMessage:null,n=``;return a&&(n+=ke(`❝`,a,280,t.quote,e)),o&&(n+=ke(`↩`,o,120,t.reply,e)),n}function ke(r,e,t,a,o){let n=S(e.name,o)||a,i=A$1.referenceExcerpt(e,t,o.options.textDecoder);return`<div class="ref"><span class="rn">${r} ${l(n)}</span><span class="rt">${l(i)}</span></div>`}function bt(r,e){let t=(r.attachmentImages??[]).map(a=>{let o=e.options.imageSrcResolver?.(a)??a.url;return o?`<img data-img-key="${F(o)}" alt="${F(a.name||``)}">`:``}).filter(a=>a.length>0).join(``);return t?`<div class="att">${t}</div>`:``}function Ae(r){return r.split(`
`).map(e=>l(e)).join(`<br>`)}function xt(r){let e=r.split(`
`);return e.map((t,a)=>{let o=e[a+1],n=t.lastIndexOf(`→`);if(n<0||o!=null&&o.trimStart().startsWith(`→`))return l(t);let i=t.slice(n+1).trim();return i?`${l(t.slice(0,n+1))} <strong class="res">${l(i)}</strong>`:l(t)}).join(`<br>`)}function ut(r){return et.exec(r)?.[1]??r}function S(r,e){return A$1.decode(r,e.options.textDecoder)}function Y(r){let e=(r??``).trim().toLowerCase();return Ze.test(e)?e:Qe}function ht(r){if(r.length<1)return``;let e=r[0].message.placedAt,t=r[r.length-1].message.placedAt,a=B(e);return X(e)===X(t)?`${a} \u2013 ${J(t)}`:`${a} \u2013 ${B(t)}`}function _(r){return String(r).padStart(2,`0`)}function X(r){let e=new Date(r);return`${e.getFullYear()}/${_(e.getMonth()+1)}/${_(e.getDate())}`}function J(r){let e=new Date(r);return`${_(e.getHours())}:${_(e.getMinutes())}`}function B(r){return`${X(r)} ${J(r)}`}var vt={name:``,chatMessages:[]};function $e(r,e,t,a={}){let{userId:o,imageSrcResolver:n,textDecoder:i}=a,s=t[0]??vt;switch(r){case`standard`:return e===`all`?A$1.exportAllTabsHtml(t,a.showTime??!0,o,n,i):A$1.exportTabHtml(s,o,n,i);case`coc`:return e===`all`?A$1.exportAllTabsHtmlCoc(t,o,n,i):A$1.exportTabHtmlCoc(s,o,n,i);default:return we(r,e,t,a)}}var K;var $=K=class extends m$1{constructor(){super(...arguments),this.identifiers=[]}onStoreAdded(){super.onStoreAdded(),l$1.instance.remove(this)}innerXml(){let e=[];for(let t of new Set(this.identifiers)){let a=r.get(t);a&&e.push(a.toXml())}return e.join(``)}static create(e){let t=new K;return t.identifiers=e.map(a=>a.identifier),t}};$=K=FC([u(`audio-tag-list`)],$);function V(r){let e=r?.carriedImageIdentifiers;return Array.isArray(e)?e.filter(t=>typeof t==`string`&&t.length>0):[]}var Q;var T=Q=class extends m$1{constructor(){super(...arguments),this.identifiers=[]}onStoreAdded(){super.onStoreAdded(),l$1.instance.remove(this)}innerXml(){let e=[];for(let t of new Set(this.identifiers)){let a=n.get(t);a&&e.push(a.toXml())}return e.join(``)}static create(e){let t=new Q;return t.identifiers=e.map(a=>a.identifier),t}};T=Q=FC([u(`image-tag-list`)],T);var yt=/ImageIdentifier$|^imageIdentifier$/;var kt=`attachmentImageIdentifiers`;var Ie=4;var Oe=class r{constructor(){this.imageStorage=T$1(L$1),this.audioStorage=T$1(c),this.fileArchiver=T$1(S$1),this.chatTabList=T$1(c$1),this.appConfig=T$1(o),this.dataSummarySetting=T$1(n$1),this.statusAilmentCatalog=T$1(I),this.translate=T$1(a$2),this.chatLogTextDecoder=e=>f$1(e,this.translate)}static{this.queue=new h(`SaveDataServiceQueue`)}saveRoomAsync(e=``,t){return r.queue.add(()=>this._saveRoomAsync(e,t))}createRoomArchiveAsync(){return r.queue.add(()=>this.fileArchiver.createZipBlobAsync(this.buildRoomFiles(!1)))}buildAssetFiles(e){let t=[],a=this.imageStorage.images.filter(i=>i.state===a$1.COMPLETE&&e.images.has(i.identifier));for(let i of a){let s=this.createImageArchiveFile(i);s&&t.push(s)}t.push(new File([this.convertToXml(T.create(a))],`imagetag.xml`,{type:`text/plain`}));let o=this.audioStorage.audios.filter(i=>!i.isHidden&&e.audios.has(i.identifier)),n=new Set(t.map(i=>i.name.toLowerCase()));for(let i of o){let s=Tt(i,n);s&&t.push(s)}return t.push(new File([this.convertToXml($.create(o))],`audiotag.xml`,{type:`text/plain`})),t}roomRootObjects(){return new q().rootObjects().map(e=>({identifier:e.identifier,toXml:()=>q.rootXml(e),carriedImageIdentifiers:V(e)}))}buildSidecarXml(){return[{name:`chat.xml`,xml:this.convertToXml(this.chatTabList,!1)},{name:`config.xml`,xml:this.convertToXml(this.appConfig,!1)},{name:`summary.xml`,xml:this.convertToXml(this.dataSummarySetting,!1)},{name:`ailment.xml`,xml:this.convertToXml(this.statusAilmentCatalog,!1)}]}imagesNamedIn(e){return this.searchImageFiles(e)}buildTagXml(e){let t=this.audioStorage.audios.filter(a=>!a.isHidden);return{imageTagXml:this.convertToXml(T.create([...e]),!1),audioTagXml:this.convertToXml($.create(t),!1)}}imageArchiveName(e,t){return e.identifier+`.`+m(t.type)}_saveRoomAsync(e=``,t){return this.saveAsync(this.buildRoomFiles(),this.appendTimestamp(e),t)}buildRoomXmlParts(e){let t=this.convertToXml(new q,e),a=this.convertToXml(this.chatTabList,e),o=this.convertToXml(this.appConfig,e),n=this.convertToXml(this.dataSummarySetting,e),i=this.convertToXml(this.statusAilmentCatalog,e);return{roomXml:t,chatXml:a,files:[new File([t],`data.xml`,{type:`text/plain`}),new File([a],`chat.xml`,{type:`text/plain`}),new File([o],`config.xml`,{type:`text/plain`}),new File([n],`summary.xml`,{type:`text/plain`}),new File([i],`ailment.xml`,{type:`text/plain`})]}}buildRoomFiles(e=!0){let{roomXml:t,chatXml:a,files:o}=this.buildRoomXmlParts(e),n=this.withCarried([...this.searchImageFiles(t),...this.searchImageFiles(a)],new q().rootObjects());for(let d of n){let p=this.createImageArchiveFile(d);p&&o.push(p)}let i=this.convertToXml(T.create(n),e);o.push(new File([i],`imagetag.xml`,{type:`text/plain`}));let s=this.audioStorage.audios.filter(d=>!d.isHidden),c=this.convertToXml($.create(s),e);return o.push(new File([c],`audiotag.xml`,{type:`text/plain`})),o}saveGameObjectAsync(e,t=`xml_data`,a){return r.queue.add(()=>this._saveGameObjectAsync(e,t,a))}createGameObjectArchiveAsync(e){return r.queue.add(()=>{let t=[],a=this.convertToXml(e);t.push(new File([a],`data.xml`,{type:`text/plain`}));let o=this.withCarried(this.searchImageFiles(a),[e]);for(let n of o){let i=this.createImageArchiveFile(n);i&&t.push(i)}return t.push(new File([this.convertToXml(T.create(o))],`imagetag.xml`,{type:`text/plain`})),this.fileArchiver.createZipBlobAsync(t)})}_saveGameObjectAsync(e,t=`xml_data`,a){let o=[],n=this.convertToXml(e);o.push(new File([n],`data.xml`,{type:`text/plain`}));let i=this.withCarried(this.searchImageFiles(n),[e]);for(let c of i){let d=this.createImageArchiveFile(c);d&&o.push(d)}let s=this.convertToXml(T.create(i));return o.push(new File([s],`imagetag.xml`,{type:`text/plain`})),this.saveAsync(o,this.appendTimestamp(t),a)}saveAsync(e,t,a){let o=-1;return this.fileArchiver.saveAsync(e,t,n=>{let i=n.percent|0;i<=o||(o=i,a?.(o))})}createImageArchiveFile(e){if(e.state!==a$1.COMPLETE)return null;let t=e.blob;return t?new File([t],e.identifier+`.`+m(t.type),{type:t.type}):null}convertToXml(e,t=!0){let o=`<?xml version="1.0" encoding="UTF-8"?>`+e.toXml();return t?he(o,{indentation:`  `,lineSeparator:`
`}):o}withCarried(e,t){let a=new Map(e.map(o=>[o.identifier,o]));for(let o of t)for(let n of V(o)){if(a.has(n))continue;let i=this.imageStorage.get(n);i&&a.set(n,i)}return[...a.values()]}searchImageFiles(e){let t=K$1(e),a=[];if(!t)return a;let o={},n=t.ownerDocument.querySelectorAll(`*[type="image"]`);for(let i=0;i<n.length;i++){let s=n[i].innerHTML;o[s]=this.imageStorage.get(s)}for(let i of Array.from(t.ownerDocument.querySelectorAll(`*`))){for(let{name:c,value:d}of Array.from(i.attributes))!d||!yt.test(c)||(o[d]=this.imageStorage.get(d));let s=i.getAttribute(kt)??``;for(let c of this.parseAttachmentImageIdentifiers(s))c&&(o[c]=this.imageStorage.get(c))}for(let i of Object.values(o))i&&a.push(i);return a}parseAttachmentImageIdentifiers(e){let t=e.trim();if(t.startsWith(`[`))try{let a=JSON.parse(t);if(Array.isArray(a))return a.map(o=>String(o))}catch(a){return[]}return t.split(/\n+/)}saveChatLog(e,t,a,o,n){return L(this,null,function*(){let i=yield this.prepareChatLogImages(a),s=this.renderChatLog(e,t,a,i);L$2(new Blob([s],{type:`text/plain;charset=utf-8`}),n??this.appendTimestamp(`${this.chatLogRoomName()}_log_${o}`)+`.html`)})}renderChatLog(e,t,a,o){let n=$e(e,t,a,{imageSrcResolver:o.resolver,textDecoder:this.chatLogTextDecoder,showTime:this.chatTabList.simpleDispFlagTime,roomName:s.peerContext?.roomName||void 0,labels:this.chatLogLabels(),lang:document.documentElement.lang||void 0,exportedAt:Date.now()});return r.injectImageRegistry(n,o.registryScript)}chatLogRoomName(){return s.peerContext?.roomName||this.translate(`app.roomDataDefault`)}chatLogLabels(){let e=(t,a)=>this.translate(`feature.chat.log.labels.${t}`,a);return{secret:e(`secret`),edited:e(`edited`),quote:e(`quote`),reply:e(`reply`),critical:e(`critical`),fumble:e(`fumble`),success:e(`success`),failure:e(`failure`),allTabs:e(`allTabs`),everyTab:e(`everyTab`),messages:t=>e(`messages`,{count:t}),exportedWith:e(`exportedWith`)}}static{this.PORTRAIT_MAX_DIMENSION=96}static{this.ATTACHMENT_MAX_DIMENSION=360}prepareChatLogImages(e){return L(this,null,function*(){let t=new Set,a=new Map;for(let p of e)for(let b of p.chatMessages){let x=b.image;x&&(a.set(x.identifier,x),t.add(x.identifier));for(let u of b.attachmentImages)a.has(u.identifier)||a.set(u.identifier,u)}let o=new Map,n={},i=0,s=[...a.values()];for(let p=0;p<s.length;p+=Ie)yield Promise.all(s.slice(p,p+Ie).map(b=>L(this,null,function*(){let x=t.has(b.identifier),u=x?r.PORTRAIT_MAX_DIMENSION:r.ATTACHMENT_MAX_DIMENSION,g=yield this.createChatLogImageSrc(b,u,x);if(!g)return;let h=`i${i++}`;o.set(b.identifier,h),n[h]=g})));let c=p=>o.get(p.identifier)??``;return{resolver:c,registryScript:r.buildImageRegistryScript(n)}})}createChatLogImageSrc(e,t,a=!1){return L(this,null,function*(){let o=e.blob;if(o)return t>0&&(o=(yield G(o,t,{square:a}))??o),z(o);let n=e.url;return!n||n.startsWith(`data:`)?n:(yield this.createChatLogImageSrcFromUrl(n,t,a))??n})}createChatLogImageSrcFromUrl(e,t,a){return L(this,null,function*(){try{let o=yield fetch(e);if(!o.ok)return null;let n=yield o.blob();return t>0&&(n=(yield G(n,t,{square:a}))??n),z(n)}catch(o){return null}})}static buildImageRegistryScript(e){return Object.keys(e).length===0?``:`<script>(function(){var m=${JSON.stringify(e).replace(/<\/(script)/gi,`<\\/$1`)};document.querySelectorAll('img[data-img-key]').forEach(function(el){var k=el.getAttribute('data-img-key');if(k&&Object.prototype.hasOwnProperty.call(m,k))el.setAttribute('src',m[k]);});})();<\/script>`}static injectImageRegistry(e,t){if(!t)return e;let a=e.lastIndexOf(`</body>`);return a<0?e+`
`+t:e.slice(0,a)+t+`
`+e.slice(a)}appendTimestamp(e){let t=new Date;return e+`_${t.getFullYear()}-${(`00`+(t.getMonth()+1)).slice(-2)}-${(`00`+t.getDate()).slice(-2)}_${(`00`+t.getHours()).slice(-2)}${(`00`+t.getMinutes()).slice(-2)}`}static{this.ɵfac=function(t){return new(t||r)}}static{this.ɵprov=oe({token:r,factory:r.ɵfac,providedIn:`root`})}};var wt={"audio/mpeg":`mp3`,"audio/mp3":`mp3`,"audio/wav":`wav`,"audio/wave":`wav`,"audio/x-wav":`wav`,"audio/aac":`m4a`,"audio/mp4":`m4a`,"audio/x-m4a":`m4a`,"audio/ogg":`ogg`};function Tt(r,e){let t=r.blob;if(!t)return null;let a$3=r.name.lastIndexOf(`.`),o=a$3>0?r.name.slice(a$3+1).toLowerCase():``,n=a(`sound.${o}`).startsWith(`audio/`),i=n?o:wt[t.type];if(!i)return null;let s=(n?r.name.slice(0,a$3):r.name).trim()||r.identifier,c=`${s}.${i}`;for(let d=2;e.has(c.toLowerCase());d++)c=`${s} (${d}).${i}`;return e.add(c.toLowerCase()),new File([t],c,{type:a(`sound.${i}`)})}export{Oe as t};