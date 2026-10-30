import{s as I,x as u}from"./chunk-BKQddlf6.js";import{c as L,n as F$1,t as E$1}from"./chunk-SkGxJy5J.js";import{s as z}from"./chunk-DR1ySeiy.js";import{n as m$1,t as a}from"./chunk-BE8cGO9X.js";import{s as w}from"./chunk-CRVlcR1p.js";import{i as c,n as L$1,r as a$1}from"./chunk-BMj9PFIv.js";import{a as v}from"./chunk-CTPgI5kJ.js";import{_ as m$2,a as K,b as y,g as l,h as h$1}from"./chunk-DoidRL41.js";import{n as u$1,t as S}from"./chunk-D9uoCeVV.js";import{i as h$2}from"./chunk-DGFcVoYo.js";import{c as D,ct as f,i as A,tt as c$1}from"./chunk-pnjrfsLw.js";import{lr as re,lt as T$1}from"./chunk-D3rO_2Dy.js";import{t as a$2}from"./chunk-BTJU4ZeS.js";import{t as c$2}from"./chunk-DEy4wgL42.js";import{t as a$3}from"./chunk-CNUIBJEB2.js";import{t as A$1,u as v$1}from"./chunk-BQVj3Fyh2.js";import{t as c$3}from"./chunk-B-CpVQW62.js";import{a as l$1,o as r,t as A$2}from"./chunk-DiwRT7_z2.js";import{t as i}from"./chunk-BwrQQjEE2.js";import{n as o}from"./chunk-D7ZS74iL2.js";import{t as I$1}from"./chunk-D9Ewg--Q.js";import{t as p$1}from"./chunk-jlUYeV0F.js";import{t as h$3}from"./chunk-D30oxD48.js";import{t as o$1}from"./chunk-Cqkea286.js";import{n}from"./chunk-CJKwXPIa.js";import{r as r$1}from"./chunk-Cl5wblso.js";import{n as p$2,t as n$1}from"./chunk-BB7W2q44.js";import{t as L$2}from"./chunk-BzhTzJlt.js";import{t as s}from"./chunk-DEoDdkaH.js";import{t as F$2}from"./chunk-D9EEwMwT.js";import{t as f$1}from"./chunk-DSJgTR74.js";import{t as r$2}from"./chunk-C25GxZox.js";import{E as u$2,c as Nt$1,p as c$4,u as Xt$1,w as s$1}from"./chunk-C_Jp3IbF.js";function pt(a,t){let e=Math.min(a,t);return{sx:Math.floor((a-e)/2),sy:0,side:e}}function le(r,o){return L(this,arguments,function*(a,t,e={}){if(!a)return a??null;if(t<=0||a.type&&!a.type.startsWith(`image/`)||typeof document>`u`||typeof Image>`u`||typeof URL>`u`||typeof URL.createObjectURL!=`function`)return a;let i=null;try{i=URL.createObjectURL(a);let n=yield mt(i,e.loadTimeoutMs),s=n.naturalWidth||n.width,c=n.naturalHeight||n.height;if(s<=0||c<=0)return a;let l=e.square===!0,f=0,x=0,v=s,k=c,b,w;if(l){let A=pt(s,c);f=A.sx,x=A.sy,v=A.side,k=A.side,b=w=Math.min(A.side,t)}else{let A=Math.max(s,c);if(A<=t)b=s,w=c;else{let ke=t/A;b=Math.max(1,Math.round(s*ke)),w=Math.max(1,Math.round(c*ke))}}let D=document.createElement(`canvas`);D.width=b,D.height=w;let ye=D.getContext(`2d`);if(!ye)return a;ye.drawImage(n,f,x,v,k,0,0,b,w);let K=yield p$1(D,.8);return K&&K.size<a.size?K:a}catch(n){return a}finally{i!==null&&URL.revokeObjectURL(i)}})}var ft=3e3;function mt(a,t=ft){return new Promise((e,r)=>{let o=new Image,i=setTimeout(()=>{o.onload=o.onerror=null,r(new Error(`image load timeout`))},t);o.onload=()=>{clearTimeout(i),e(o)},o.onerror=n=>{clearTimeout(i),r(n)},o.src=a})}var gt=/<[^>]*>|[^<]+/g;function Je(a,t={}){let e=t.indentation??`  `,r=t.lineSeparator??`
`,o=[],i=0,n=null,s=``,c=l=>{n!==null&&(o.push(e.repeat(i)+n+s+(l??``)),l===void 0&&(i+=1),n=null,s=``)};for(let l of a.match(gt)??[]){if(!l.startsWith(`<`)){n!==null&&(s+=l.trim());continue}if(bt(l)){if(n!==null){c(l);continue}i=Math.max(0,i-1),o.push(e.repeat(i)+l);continue}if(c(),ut(l)){o.push(e.repeat(i)+l);continue}n=l}return c(),o.join(r)}function bt(a){return a.startsWith(`</`)}function ut(a){return a.startsWith(`<?`)||a.startsWith(`<!`)||a.endsWith(`/>`)}var Ve=`
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
`;var m=`"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","Noto Serif CJK JP",serif`;var T=`"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Noto Sans JP","Meiryo",system-ui,sans-serif`;var j=`"Hiragino Maru Gothic ProN","M PLUS Rounded 1c","Yu Gothic UI","Noto Sans JP","Meiryo",sans-serif`;var N=`"SFMono-Regular","Cascadia Mono",Consolas,Menlo,"Osaka-Mono","MS Gothic",monospace`;var de=`"Courier New",Courier,"Osaka-Mono","MS Gothic",monospace`;var xt=`
:root{--bg:#2b1d12;--paper:#f2e4c4;--ink:#3b2b1c;--muted:#80684a;--line:#cdb48a;--accent:#8a3b1f;--accent-ink:#fbf1dc;--chip:rgba(138,90,40,.1);--quote-bg:rgba(138,90,40,.08);--roll-bg:rgba(255,250,236,.55);--roll-border:1px dashed #bda274;--crit:#a87412;--fumble:#8e1c1c;--ok:#52692d;--ng:#7a6a58;--font-body:${m};--font-head:${m};--font-mono:${m};--flavor:"\u2766\\2003 CHRONICLE\\2003 \u2766";--head-bg:transparent;--head-border:0;--pt-border:2px solid #cdb48a;--name-mix:82%;--gap:4px}
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
`;var ht=`
:root{color-scheme:dark;--bg:#0a0b0b;--paper:#121514;--ink:#cdd2cb;--muted:#7b847a;--line:#262c29;--accent:#9a2a2a;--accent-ink:#f4eaea;--chip:rgba(255,255,255,.035);--quote-bg:rgba(255,255,255,.03);--roll-bg:rgba(8,10,9,.7);--roll-border:1px solid #262c29;--crit:#a9cfa6;--fumble:#d0303a;--ok:#7f9c80;--ng:#666c66;--font-body:${m};--font-head:${m};--font-mono:${de};--flavor:"\u2014 CASE FILE \u2014";--head-bg:linear-gradient(180deg,#151918,#0e1110);--head-shadow:inset 0 0 80px rgba(0,0,0,.7);--radius:2px;--radius-sm:2px;--pt-radius:2px;--pt-border:1px solid #2e3531;--name-mix:50%;--msg-pad:12px 14px}
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
`;var vt=`
:root{color-scheme:dark;--bg:#05070f;--paper:rgba(9,16,34,.78);--ink:#dce8ff;--muted:#7d90b5;--line:rgba(64,196,255,.24);--accent:#2bd4ff;--accent-ink:#03121a;--chip:rgba(43,212,255,.08);--quote-bg:rgba(43,212,255,.06);--roll-bg:rgba(6,12,28,.88);--roll-border:1px solid rgba(43,212,255,.38);--crit:#2effc8;--fumble:#ff2f8e;--ok:#2bd4ff;--ng:#66779a;--font-body:${T};--font-head:${T};--font-mono:${N};--flavor:"// SESSION_LOG";--head-border:1px solid rgba(43,212,255,.35);--head-shadow:inset 0 0 40px rgba(43,212,255,.08);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid rgba(43,212,255,.55);--name-mix:42%;--oc-ink:#03121a;--gap:6px;--msg-bg:linear-gradient(90deg,rgba(43,212,255,.06),transparent 55%)}
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
`;var yt=`
:root{--bg:#e8e0cf;--paper:#fbf8f0;--ink:#2a2521;--muted:#7d7166;--line:#dcd1bd;--accent:#b52b2e;--accent-ink:#fff8f0;--chip:rgba(42,37,33,.05);--quote-bg:rgba(181,43,46,.05);--roll-bg:#fffdf8;--roll-border:1px solid #dcd1bd;--crit:#b52b2e;--fumble:#2a2521;--ok:#35557a;--ng:#8b8074;--font-body:${m};--font-head:${m};--font-mono:${m};--head-bg:transparent;--head-border:0;--radius:0;--radius-sm:0;--pt-radius:3px;--pt-border:1px solid #cfc3ad;--msg-pad:14px 16px;--gap:0}
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
`;var kt=`
:root{--bg:#dfe5ec;--paper:#ffffff;--ink:#1e2733;--muted:#6a7686;--line:#d3dae3;--accent:#2f6fed;--accent-ink:#fff;--chip:#eef2f7;--quote-bg:rgba(255,255,255,.6);--roll-bg:#fff;--roll-border:0;--crit:#d98b00;--fumble:#e0245e;--ok:#12a36e;--ng:#8a95a5;--font-body:${T};--font-head:${T};--font-mono:${T};--head-bg:rgba(255,255,255,.9);--head-border:0;--head-shadow:0 10px 30px rgba(30,39,51,.08);--radius:20px;--radius-sm:14px;--name-mix:78%;--gap:6px;--msg-pad:0}
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
`;var Qe={parchment:xt,washi:yt,gothic:`
:root{color-scheme:dark;--bg:#120a0e;--paper:#1c1016;--ink:#eadbd9;--muted:#a08790;--line:#4a2530;--accent:#b8923e;--accent-ink:#1a0d10;--chip:rgba(184,146,62,.08);--quote-bg:rgba(120,20,40,.2);--roll-bg:rgba(30,12,18,.85);--roll-border:1px solid #5a2a36;--crit:#d4af37;--fumble:#c41e3a;--ok:#a3b18a;--ng:#7d6970;--font-body:${m};--font-head:${m};--font-mono:${m};--flavor:"\u2726 NOCTURNE \u2726";--head-bg:linear-gradient(180deg,#24121a,#160b10);--head-border:1px solid #5a2a36;--head-shadow:inset 0 0 0 1px rgba(184,146,62,.3),0 0 0 4px #120a0e,0 0 0 5px rgba(184,146,62,.4);--radius:2px;--radius-sm:2px;--pt-border:2px solid rgba(184,146,62,.6);--name-mix:55%;--oc-ink:#1a0d10;--title:#ecd9a8}
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
`,eerie:ht,noir:`
:root{color-scheme:dark;--bg:#141414;--paper:#1f1e1b;--ink:#e6e1d6;--muted:#8f887b;--line:#3a3732;--accent:#d9a441;--accent-ink:#1a1408;--chip:rgba(230,225,214,.05);--quote-bg:rgba(217,164,65,.07);--roll-bg:#191816;--roll-border:1px solid #3a3732;--crit:#e8c170;--fumble:#c9463d;--ok:#b9b09c;--ng:#6f695e;--font-body:${m};--font-head:${m};--font-mono:${de};--flavor:"CONFIDENTIAL";--head-border:1px solid #3a3732;--head-shadow:0 20px 50px rgba(0,0,0,.5);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid #4a463f;--name-mix:40%;--oc-ink:#1a1408}
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
`,neon:vt,terminal:`
:root{color-scheme:dark;--bg:#030a04;--paper:#051006;--ink:#8dff98;--muted:#44a152;--line:rgba(80,255,120,.22);--accent:#7dff8a;--accent-ink:#021003;--chip:rgba(80,255,120,.06);--quote-bg:rgba(80,255,120,.05);--roll-bg:rgba(3,14,5,.9);--roll-border:1px dashed rgba(80,255,120,.35);--crit:#e6ff7a;--fumble:#ff6a5c;--ok:#7dff8a;--ng:#44a152;--font-body:${N};--font-head:${N};--font-mono:${N};--flavor:"> SESSION LOG";--head-bg:transparent;--head-border:1px solid rgba(80,255,120,.35);--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid rgba(80,255,120,.45);--name-mix:25%;--oc-ink:#021003;--gap:0;--msg-pad:6px 12px}
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
:root{color-scheme:dark;--bg:#070818;--paper:rgba(16,18,48,.72);--ink:#e6e8ff;--muted:#8d92c4;--line:rgba(160,170,255,.2);--accent:#f5c96a;--accent-ink:#17120a;--chip:rgba(160,170,255,.08);--quote-bg:rgba(160,170,255,.07);--roll-bg:rgba(12,14,40,.8);--roll-border:1px solid rgba(245,201,106,.35);--crit:#ffd978;--fumble:#ff6b8b;--ok:#8fd3ff;--ng:#7a7fae;--font-body:${T};--font-head:${m};--font-mono:${T};--flavor:"\u2727 STARLOG \u2727";--head-border:1px solid rgba(160,170,255,.25);--head-shadow:0 0 60px rgba(120,100,255,.18);--radius:14px;--radius-sm:10px;--pt-border:2px solid rgba(245,201,106,.55);--name-mix:45%;--oc-ink:#17120a;--title:#fff4d6;--msg-bg:linear-gradient(90deg,rgba(160,170,255,.05),transparent 70%)}
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
:root{color-scheme:dark;--bg:#1e2218;--paper:#262b1f;--ink:#dfe3cf;--muted:#98a07f;--line:#434a36;--accent:#d9c45a;--accent-ink:#1e2218;--chip:rgba(223,227,207,.05);--quote-bg:rgba(217,196,90,.06);--roll-bg:#20241a;--roll-border:1px solid #545c42;--crit:#d9e36a;--fumble:#e0603a;--ok:#9fbf6a;--ng:#7a8068;--font-body:${T};--font-head:${T};--font-mono:${N};--flavor:"// OPERATION LOG // CLASSIFIED";--head-border:1px solid #545c42;--radius:0;--radius-sm:0;--pt-radius:0;--pt-border:1px solid #6b7452;--name-mix:50%;--oc-ink:#1e2218}
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
:root{color-scheme:dark;--bg:#1b130c;--paper:#2a1d12;--ink:#efdcbc;--muted:#b0916a;--line:#6b4a2b;--accent:#d49a3a;--accent-ink:#1b130c;--chip:rgba(212,154,58,.1);--quote-bg:rgba(212,154,58,.08);--roll-bg:linear-gradient(180deg,#332416,#261a10);--roll-border:1px solid #8a6232;--crit:#f0c05a;--fumble:#c0492e;--ok:#8fae6a;--ng:#8a7358;--font-body:${m};--font-head:${m};--font-mono:${de};--flavor:"\u2699 ENGINE LOG \u2699";--head-bg:linear-gradient(180deg,#3a2816,#241a0f);--head-border:2px solid #8a6232;--head-shadow:inset 0 0 0 4px #241a0f,inset 0 0 0 5px rgba(212,154,58,.45),0 12px 30px rgba(0,0,0,.5);--pt-border:3px solid #b07f38;--name-mix:55%;--oc-ink:#1b130c}
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
:root{--bg:#0f2a3d;--paper:#f4ead3;--ink:#23303a;--muted:#6d7a80;--line:#cdbd98;--accent:#1d5f86;--accent-ink:#fff;--chip:rgba(29,95,134,.08);--quote-bg:rgba(29,95,134,.07);--roll-bg:rgba(255,252,242,.7);--roll-border:1px solid #cdbd98;--crit:#c8932a;--fumble:#a8322d;--ok:#2d7a5f;--ng:#7d8790;--font-body:${m};--font-head:${m};--font-mono:${m};--flavor:"\u2248 SHIP'S LOG \u2248";--head-bg:transparent;--head-border:0;--radius:4px;--radius-sm:3px;--pt-border:2px solid #1d5f86;--name-mix:82%;--gap:4px}
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
`,messenger:kt,notebook:`
:root{--bg:#d8d0bf;--paper:#fdfcf7;--ink:#243a73;--muted:#7a869f;--line:#c7d3ea;--accent:#e0524f;--accent-ink:#fff;--chip:rgba(36,58,115,.06);--quote-bg:rgba(255,236,120,.35);--roll-bg:rgba(255,255,255,.75);--roll-border:1.5px dashed #9fb0d6;--crit:#e0524f;--fumble:#4a4a4a;--ok:#2f8f5b;--ng:#8a8a8a;--font-body:${j};--font-head:${j};--font-mono:${j};--head-bg:transparent;--head-border:0;--radius:0;--radius-sm:4px;--pt-border:2px solid #c7d3ea;--name-mix:75%;--gap:0;--msg-pad:6px 14px}
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
:root{--bg:#fff4f8;--paper:#ffffff;--ink:#3d2c4a;--muted:#9a85a8;--line:#f3cfe0;--accent:#ff5fa2;--accent-ink:#fff;--chip:#fff0f6;--quote-bg:#fffafc;--roll-bg:#ffffff;--roll-border:3px solid #3d2c4a;--crit:#ffd23f;--fumble:#b9a6ff;--ok:#7ee8c0;--ng:#e5dcea;--font-body:${j};--font-head:${j};--font-mono:${j};--flavor:"\u2605 PLAY LOG \u2605";--head-bg:#fff;--head-border:3px solid #3d2c4a;--head-shadow:6px 6px 0 #3d2c4a;--radius:18px;--radius-sm:14px;--pt-border:3px solid #3d2c4a;--name-mix:85%;--oc-ink:#3d2c4a;--gap:10px;--msg-pad:0}
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
`};var Et={secret:`シークレットダイス`,edited:`編集済`,quote:`引用`,reply:`返信先`,critical:`クリティカル`,fumble:`ファンブル`,success:`成功`,failure:`失敗`,allTabs:`全タブ`,everyTab:`すべて`,messages:a=>`${a} \u4EF6\u306E\u767A\u8A00`,exportedWith:`Udonarium Axe`};var Lt=300*1e3;var _t=32;var jt=`#666666`;var Rt=/^(#[0-9a-f]{3,8}|[a-z]{3,20}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i;var Nt=/^<(?:Secret-)?BCDice[：:](.*)>$/s;var Ft={critical:`crit`,fumble:`fumble`,success:`ok`,failure:`ng`};var Pt=`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/></svg>`;var Dt=`<script>(function(){var n=document.querySelector(".tabs");if(!n)return;n.addEventListener("click",function(e){var b=e.target.closest("button[data-tab]");if(!b)return;var t=b.getAttribute("data-tab");n.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});document.querySelectorAll("[data-t]").forEach(function(el){el.hidden=t!=="*"&&el.getAttribute("data-t")!==t;});});})();<\/script>`;var p=A$1.escapeHtml;var W=A$1.escapeAttribute;function et(a,t,e,r={}){let o=E$1(E$1({},Et),r.labels),i=t===`all`?A$1.spokenTabs(e):e.slice(0,1),n=t===`all`?A$1.mergeEntries(i,r.userId):zt(i[0],r),s=t===`all`&&i.length>1,c={options:r,labels:o,showTab:s},l=t===`all`?o.allTabs:i[0]?.name??``,f=r.roomName?`${l} \u2014 ${r.roomName}`:l,x=`<footer class="foot">${p(o.exportedWith)}`+(r.exportedAt!=null?` \xB7 ${pe(r.exportedAt)}`:``)+`</footer>`;return`<!DOCTYPE html>
<html lang="${W(r.lang||`ja`)}" data-style="${a}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Udonarium Axe">
<title>${p(f)}</title>
<style>${Ve}${Qe[a]}</style>
</head>
<body>
<div class="log">
`+Xt(l,n,i,s,c)+`
<main class="body">
`+Bt(n,c)+`</main>
`+x+`
</div>
`+(s?Dt+`
`:``)+`</body>
</html>`}function zt(a,t){return a?a.chatMessages.filter(e=>A$1.isVisibleMessage(e,t.userId)).map(e=>({tab:a,tabIndex:0,message:e})):[]}function F(a){return a.isDicebot?`roll`:a.isSystemMessage?`system`:`say`}function Xt(a,t,e,r,o){let{labels:i,options:n}=o,s=n.roomName?`<p class="kicker">${p(n.roomName)}</p>`:``,c=t.filter(b=>F(b.message)!==`system`),l=[],f=ea(t);f&&l.push(`<span>${f}</span>`),l.push(`<span>${p(i.messages(c.length))}</span>`);let x=Gt(c,o),v=x.length?`<ul class="cast">${x.map(b=>`<li style="--c:${b.color}">${p(b.name)}</li>`).join(``)}</ul>`:``,k=r?`<nav class="tabs"><button type="button" data-tab="*" aria-pressed="true">${p(i.everyTab)}</button>`+e.map((b,w)=>`<button type="button" data-tab="${w}" aria-pressed="false">${p(b.name)}</button>`).join(``)+`</nav>`:``;return`<header class="head">`+s+`<h1 class="title">${p(a)}</h1><p class="meta">${l.join(``)}</p>`+v+k+`</header>`}function Gt(a,t){let e=new Map;for(let{message:r}of a){if(F(r)!==`say`)continue;let o=M(r.name,t).trim();if(!(!o||e.has(o))&&(e.set(o,fe(r.messColor)),e.size>=_t))break}return[...e].map(([r,o])=>({name:r,color:o}))}function Bt(a,t){let e=[],r=``,o=null;for(let i of a){let n=H(i.message.placedAt);n!==r&&(r=n,e.push(`<div class="day"><span>${n}</span></div>
`),o=null),e.push(Wt(i,Ut(o,i),t)),o=i}return e.join(``)}function Ut(a,t){if(!a)return!1;let e=a.message,r=t.message;return F(e)===`say`&&F(r)===`say`&&a.tabIndex===t.tabIndex&&e.name===r.name&&e.messColor===r.messColor&&e.image?.identifier===r.image?.identifier&&!e.isSecret&&!r.isSecret&&!!e.isOutOfStory==!!r.isOutOfStory&&r.placedAt-e.placedAt<Lt}function Wt(a,t,e){switch(F(a.message)){case`roll`:return Ht(a,e);case`system`:return Yt(a,e);default:return qt(a,t,e)}}function qt(a,t,e){let{message:r}=a,{labels:o}=e,i=M(r.name,e),n=!r.isSecret||A$1.canSee(r,e.options.userId),s=[`msg`];t&&s.push(`cont`),r.isOutOfStory&&s.push(`ooc`),n||s.push(`sealed`);let c=n?rt(v$1(r.vnEmote,M(r.text,e)))+Vt(r,e):`<span class="seal">${p(o.secret)}</span>`,l=r.fixd?`<span class="ed">${p(o.edited)}</span>`:``;return`<article class="${s.join(` `)}" data-t="${a.tabIndex}" style="--c:${fe(r.messColor)}"><div class="pt">${Kt(r,i,e)}</div><div class="bd"><div class="hd"><span class="nm">${p(i)}</span>${tt(a,e)}${at(r)}</div>`+Jt(r,e)+`<div class="tx">${c}${l}</div></div></article>
`}function Ht(a,t){let{message:e}=a,{labels:r}=t,o=!e.isSecret||A$1.canSee(e,t.options.userId),i=o?e.rollDetail?.outcome??``:``,n=[`msg`,`roll`];i&&n.push(Ft[i]),e.isOutOfStory&&n.push(`ooc`),o||n.push(`sealed`);let s=Zt(M(e.name,t)),c=i?`<span class="oc">${p(r[i])}</span>`:``,l=o?Qt(M(e.text,t)):`<span class="seal">${p(r.secret)}</span>`;return`<article class="${n.join(` `)}" data-t="${a.tabIndex}" style="--c:${fe(e.messColor)}"><div class="pt">${Pt}</div><div class="bd"><div class="hd"><span class="nm">${p(s)}</span>${c}${tt(a,t)}${at(e)}</div><div class="tx">${l}</div></div></article>
`}function Yt(a,t){return`<div class="sys" data-t="${a.tabIndex}"><span>${rt(M(a.message.text,t))}</span></div>
`}function tt(a,t){return t.showTab?`<span class="tg">${p(a.tab.name)}</span>`:``}function at(a){return`<time>${me(a.timestamp)}</time>`}function Kt(a,t,e){let r=a.image,o=r?e.options.imageSrcResolver?.(r)??r.url:``;if(r&&o)return`<img data-img-key="${W(o)}" alt="">`;return`<span class="ini">${p(Array.from(t.trim())[0]??``)}</span>`}function Jt(a,t){let{labels:e}=t,r=a.quoteOf?a.quoteOfMessage:null,o=a.replyTo?a.replyToMessage:null,i=``;return r&&(i+=Ze(`❝`,r,280,e.quote,t)),o&&(i+=Ze(`↩`,o,120,e.reply,t)),i}function Ze(a,t,e,r,o){let i=M(t.name,o)||r,n=A$1.referenceExcerpt(t,e,o.options.textDecoder);return`<div class="ref"><span class="rn">${a} ${p(i)}</span><span class="rt">${p(n)}</span></div>`}function Vt(a,t){let e=(a.attachmentImages??[]).map(r=>{let o=t.options.imageSrcResolver?.(r)??r.url;return o?`<img data-img-key="${W(o)}" alt="${W(r.name||``)}">`:``}).filter(r=>r.length>0).join(``);return e?`<div class="att">${e}</div>`:``}function rt(a){return a.split(`
`).map(t=>p(t)).join(`<br>`)}function Qt(a){let t=a.split(`
`);return t.map((e,r)=>{let o=t[r+1],i=e.lastIndexOf(`→`);if(i<0||o!=null&&o.trimStart().startsWith(`→`))return p(e);let n=e.slice(i+1).trim();return n?`${p(e.slice(0,i+1))} <strong class="res">${p(n)}</strong>`:p(e)}).join(`<br>`)}function Zt(a){return Nt.exec(a)?.[1]??a}function M(a,t){return A$1.decode(a,t.options.textDecoder)}function fe(a){let t=(a??``).trim().toLowerCase();return Rt.test(t)?t:jt}function ea(a){if(a.length<1)return``;let t=a[0].message.placedAt,e=a[a.length-1].message.placedAt,r=pe(t);return H(t)===H(e)?`${r} \u2013 ${me(e)}`:`${r} \u2013 ${pe(e)}`}function q(a){return String(a).padStart(2,`0`)}function H(a){let t=new Date(a);return`${t.getFullYear()}/${q(t.getMonth()+1)}/${q(t.getDate())}`}function me(a){let t=new Date(a);return`${q(t.getHours())}:${q(t.getMinutes())}`}function pe(a){return`${H(a)} ${me(a)}`}var ta={name:``,chatMessages:[]};function ot(a,t,e,r={}){let{userId:o,imageSrcResolver:i,textDecoder:n}=r,s=e[0]??ta;switch(a){case`standard`:return t===`all`?A$1.exportAllTabsHtml(e,r.showTime??!0,o,i,n):A$1.exportTabHtml(s,o,i,n);case`coc`:return t===`all`?A$1.exportAllTabsHtmlCoc(e,o,i,n):A$1.exportTabHtmlCoc(s,o,i,n);default:return et(a,t,e,r)}}var ge;var R=ge=class extends m$2{constructor(){super(...arguments),this.identifiers=[]}onStoreAdded(){super.onStoreAdded(),l.instance.remove(this)}innerXml(){let t=[];for(let e of new Set(this.identifiers)){let r=r$2.get(e);r&&t.push(r.toXml())}return t.join(``)}static create(t){let e=new ge;return e.identifiers=t.map(r=>r.identifier),e}};R=ge=v([u$1(`audio-tag-list`)],R);function be(a){let t=a?.carriedImageIdentifiers;return Array.isArray(t)?t.filter(e=>typeof e==`string`&&e.length>0):[]}var ue;var O=ue=class extends m$2{constructor(){super(...arguments),this.identifiers=[]}onStoreAdded(){super.onStoreAdded(),l.instance.remove(this)}innerXml(){let t=[];for(let e of new Set(this.identifiers)){let r=n$1.get(e);r&&t.push(r.toXml())}return t.join(``)}static create(t){let e=new ue;return e.identifiers=t.map(r=>r.identifier),e}};O=ue=v([u$1(`image-tag-list`)],O);var aa=`cutInSamplePortrait_image`;var ra=`cutInSampleFace_image`;var oa=`./assets/images/cutin_sample_portrait.png`;var na=`./assets/images/cutin_sample_face.png`;var xe={scaleX:[{t:0,v:.02,e:`outCubic`},{t:110,v:1}],opacity:[{t:0,v:1,e:`linear`},{t:950,v:1,e:`inCubic`},{t:1080,v:0}]};var he={wipe:[{t:0,v:0,e:`outQuad`},{t:300,v:1}],crumble:[{t:1050,v:1,e:`inQuad`},{t:1440,v:0}],opacity:[{t:0,v:1,e:`linear`},{t:1400,v:1,e:`inCubic`},{t:1500,v:0}]};var nt={scaleX:[{t:170,v:.45,e:`outBack`},{t:330,v:1}],scaleY:[{t:170,v:.45,e:`outBack`},{t:330,v:1}],opacity:[{t:170,v:0,e:`linear`},{t:220,v:1},{t:950,v:1,e:`inCubic`},{t:1080,v:0}]};var ia=[{identifier:`sample-cut-in-flash`,sceneIdentifier:`sample-cut-in-flash-scene`,name:`Sample1`,width:1e3,height:330,durationMs:1100,sounds:[{atMs:0,soundKey:`flashImpact`,volume:90}],layers:[{identifier:`sample-cut-in-flash-frame`,name:`帯の縁`,kind:`fill`,x:0,y:12,width:1e3,height:306,fillFrom:`#d8f1ff`,tracks:xe},{identifier:`sample-cut-in-flash-plate`,name:`帯の下地`,kind:`fill`,x:6,y:18,width:988,height:294,fillShape:`linear`,fillFrom:`#0a1c40`,fillTo:`#04102a`,fillAngleDeg:180,tracks:xe},{identifier:`sample-cut-in-flash-face`,name:`目 : 画像を差し替える`,kind:`image`,x:6,y:18,width:988,height:294,portrait:!0,objectFit:`cover`,objectPosY:42,tracks:F$1(E$1({},xe),{scaleX:[{t:0,v:.02,e:`outCubic`},{t:100,v:1.06},{t:420,v:1}],scaleY:[{t:100,v:1.06,e:`outCubic`},{t:420,v:1}]})},{identifier:`sample-cut-in-flash-rays`,name:`集中線`,kind:`fill`,x:6,y:18,width:988,height:294,fillShape:`speedlines`,fillFrom:`#bfe9ff`,fillTo:`#0a1c40`,fillAngleDeg:0,fillScalePx:22,tracks:{opacity:[{t:60,v:0,e:`linear`},{t:120,v:.55},{t:460,v:.55,e:`inCubic`},{t:700,v:0}]}},{identifier:`sample-cut-in-flash-sheen`,name:`走査光`,kind:`fill`,x:0,y:18,width:320,height:294,skewXDeg:-26,effect:`glow`,effectStrength:.9,effectColor:`#bfe9ff`,fillShape:`linear`,fillFrom:`#bfe9ff00`,fillMid:`#eafbff`,fillTo:`#bfe9ff00`,fillAngleDeg:90,tracks:{x:[{t:120,v:-340,e:`outCubic`},{t:430,v:1040}],opacity:[{t:120,v:0,e:`linear`},{t:170,v:1},{t:360,v:1,e:`inCubic`},{t:450,v:0}]}},{identifier:`sample-cut-in-flash-word`,name:`文字 : カ`,kind:`text`,x:774,y:8,width:160,height:180,rotation:-12,text:`カ`,vertical:!0,fontSizePx:138,fontWeight:900,color:`#eafbff`,textAlign:`center`,strokeColor:`#0a1c40`,strokeWidthPx:6,effect:`glow`,effectStrength:.7,effectColor:`#9fdcff`,tracks:nt},{identifier:`sample-cut-in-flash-word-small`,name:`文字 : ッ`,kind:`text`,x:872,y:168,width:120,height:140,rotation:-12,text:`ッ`,vertical:!0,fontSizePx:88,fontWeight:900,color:`#eafbff`,textAlign:`center`,strokeColor:`#0a1c40`,strokeWidthPx:5,effect:`glow`,effectStrength:.7,effectColor:`#9fdcff`,tracks:nt}]},{identifier:`sample-cut-in-tear`,sceneIdentifier:`sample-cut-in-tear-scene`,name:`Sample2`,width:1240,height:500,durationMs:1500,sounds:[{atMs:0,soundKey:`flashImpact`,volume:90},{atMs:1050,soundKey:`collapse`,volume:55}],layers:[{identifier:`sample-cut-in-tear-backing`,name:`裂け目の裏地`,kind:`fill`,x:-12,y:48,width:1264,height:404,rotation:-5,clip:`gash`,wipeShape:`chevronRight`,crumbleShape:`crumbleLeft`,fillFrom:`#e10f22`,tracks:he},{identifier:`sample-cut-in-tear-edge`,name:`裂け目の縁`,kind:`fill`,x:0,y:56,width:1240,height:388,rotation:-5,clip:`gash`,wipeShape:`chevronRight`,crumbleShape:`crumbleLeft`,fillFrom:`#ffffff`,tracks:he},{identifier:`sample-cut-in-tear-face`,name:`目 : 画像を差し替える`,kind:`image`,x:10,y:64,width:1220,height:372,rotation:-5,clip:`gash`,wipeShape:`chevronRight`,crumbleShape:`crumbleLeft`,face:!0,objectFit:`cover`,objectPosY:50,tracks:F$1(E$1({},he),{opacity:[{t:70,v:0,e:`linear`},{t:150,v:1},{t:1320,v:1,e:`inCubic`},{t:1500,v:0}]})},{identifier:`sample-cut-in-tear-word`,name:`文字 : ブチッ`,kind:`text`,x:930,y:10,width:300,height:480,rotation:8,text:`ブチッ`,vertical:!0,letterSpacingPx:-14,fontSizePx:104,fontWeight:900,color:`#ffffff`,textAlign:`center`,strokeColor:`#0b0b0d`,strokeWidthPx:8,effect:`shake`,effectStrength:.4,crumbleShape:`crumbleLeft`,tracks:{crumble:[{t:1150,v:1,e:`inQuad`},{t:1460,v:0}],x:[{t:200,v:1260,e:`outBack`},{t:440,v:930}],rotation:[{t:200,v:26,e:`outBack`},{t:440,v:8}],opacity:[{t:200,v:0,e:`linear`},{t:260,v:1},{t:1320,v:1,e:`inCubic`},{t:1500,v:0}]}}]}];function st(a){let t={portrait:it(a,aa,oa),face:it(a,ra,na)},e=[];return y.batch(()=>{for(let r of ia){let o=new c$4(r.identifier);o.initialize(),l.instance.get(r.identifier)===o&&sa(o,r,t)&&e.push(o)}return e})}function it(a,t,e){let r=c.createEmpty(t).toContext();r.url=e;let o=a.add(r);return n$1.create(o.identifier).tag=p$2,o.identifier}function sa(a,t,e){let r=new u$2(t.sceneIdentifier);if(r.initialize(),l.instance.get(t.sceneIdentifier)!==r)return!1;a.name=t.name,a.width=t.width,a.height=t.height,a.originalSize=!1,a.keepImageAspect=!1,a.imageIdentifier=``,a.frameless=!0,a.chatActivate=!0,r.cutInIdentifier=a.identifier,r.durationMs=t.durationMs,r.sounds=Xt$1(ca(t));for(let o of t.layers)r.appendChild(la(o,e));return!0}function ca(a){let t=[];for(let e of a.sounds){let r=a$3[e.soundKey];r&&t.push({t:e.atMs,a:r,v:e.volume})}return t}function la(a,t){let e=new s$1(a.identifier);return e.initialize(),e.name=a.name,e.kind=a.kind,e.x=a.x,e.y=a.y,e.width=a.width,e.height=a.height,a.rotation!==void 0&&(e.rotation=a.rotation),a.skewXDeg!==void 0&&(e.skewXDeg=a.skewXDeg),a.clip&&(e.clip=a.clip),a.wipeShape&&(e.wipeShape=a.wipeShape),a.crumbleShape&&(e.crumbleShape=a.crumbleShape),a.opacity!==void 0&&(e.opacity=a.opacity),a.effect&&(e.effect=a.effect),a.effectStrength!==void 0&&(e.effectStrength=a.effectStrength),a.effectColor&&(e.effectColor=a.effectColor),a.tracks&&(e.tracks=Nt$1(a.tracks)),a.fillShape&&(e.fillShape=a.fillShape),a.fillFrom&&(e.fillFrom=a.fillFrom),a.fillMid&&(e.fillMid=a.fillMid),a.fillTo&&(e.fillTo=a.fillTo),a.fillAngleDeg!==void 0&&(e.fillAngleDeg=a.fillAngleDeg),a.fillScalePx!==void 0&&(e.fillScalePx=a.fillScalePx),a.portrait&&(e.imageIdentifier=t.portrait),a.face&&(e.imageIdentifier=t.face),a.objectFit&&(e.objectFit=a.objectFit),a.objectPosY!==void 0&&(e.objectPosY=a.objectPosY),a.text&&(e.text=a.text),a.vertical!==void 0&&(e.vertical=a.vertical),a.letterSpacingPx!==void 0&&(e.letterSpacingPx=a.letterSpacingPx),a.fontSizePx!==void 0&&(e.fontSizePx=a.fontSizePx),a.fontWeight!==void 0&&(e.fontWeight=a.fontWeight),a.color&&(e.color=a.color),a.textAlign&&(e.textAlign=a.textAlign),a.strokeColor&&(e.strokeColor=a.strokeColor),a.strokeWidthPx!==void 0&&(e.strokeWidthPx=a.strokeWidthPx),e}var Y;var h=Y=class extends I{constructor(){super(...arguments),this.isLock=!1,this.isScratch=!1,this.dispLockMark=!0,this.color=`#404040`,this.changeColor=`#FF5050`,this.owner=``,this.M=[],this.fillMapBack=[],this.scratchingGrids=``,this.scratchedGrids=``,this.dummy=0,this.maxSize=50}getMaxSize(){return this.maxSize}getMapXY(t,e,r){return r?this.fillMapBack.length<this.M.length?!1:this.fillMapBack[this.maxSize*e+t]:this.M[this.maxSize*e+t]}setMapXY(t,e,r){this.fillMapBack.length<this.M.length||(this.fillMapBack[this.maxSize*e+t]=r)}copyBack2MainMap(){this.M=[...this.fillMapBack],this.dummy++,this.dummy>=100&&(this.dummy=0)}copyMain2BackMap(){this.fillMapBack=[...this.M]}reverseMapXY(t,e){this.fillMapBack.length<this.M.length||(this.fillMapBack[this.maxSize*e+t]=!this.fillMapBack[this.maxSize*e+t])}isMapXYChange(t,e){return this.fillMapBack.length<this.M.length?!1:this.M[this.maxSize*e+t]!=this.fillMapBack[this.maxSize*e+t]}get width(){return this.getCommonValue(`width`,1)}get height(){return this.getCommonValue(`height`,1)}static create(t,e,r,o,i){let n;return i?n=new Y(i):n=new Y,n.M=new Array(n.maxSize*n.maxSize).fill(1),n.createDataElements(),n.commonDataElement.appendChild(h$2.create(`name`,t,{},`name_${n.identifier}`)),n.commonDataElement.appendChild(h$2.create(`width`,e,{},`width_${n.identifier}`)),n.commonDataElement.appendChild(h$2.create(`height`,r,{},`height_${n.identifier}`)),n.initialize(),n}};v([S()],h.prototype,`isLock`,void 0);v([S()],h.prototype,`isScratch`,void 0);v([S()],h.prototype,`dispLockMark`,void 0);v([S()],h.prototype,`color`,void 0);v([S()],h.prototype,`changeColor`,void 0);v([S()],h.prototype,`owner`,void 0);v([S()],h.prototype,`M`,void 0);v([S()],h.prototype,`scratchingGrids`,void 0);v([S()],h.prototype,`scratchedGrids`,void 0);v([S()],h.prototype,`dummy`,void 0);h=Y=v([u$1(`table-scratch-mask`)],h);var P;var ve=`identifier`;var ct=/^[A-Za-z0-9_-]+$/;var E=class extends y{static{P=this}static{this.keepCharacterOwners=!1}onStoreAdded(){super.onStoreAdded(),l.instance.remove(this)}get reloadCheck(){return l.instance.get(`ReloadCheck`)}innerXml(){let t=``;for(let e of this.rootObjects())t+=P.rootXml(e);return t}static rootXml(t){let e=t.toXml();return!(t instanceof u)||!ct.test(t.identifier)?e:e.replace(/^<([A-Za-z0-9_-]+)/,`<$1 ${ve}="${t.identifier}"`)}rootObjects(){return[...l.instance.getObjects(c$1),...l.instance.getObjects(r$1),...l.instance.getObjects(u),...l.instance.getObjects(r),...l.instance.getObjects(A),...l.instance.getObjects(l$1),...l.instance.getObjects(o).filter(t=>t.parent===null),...l.instance.getObjects(i),...l.instance.getObjects(c$4),...P.extraAliases.flatMap(t=>l.instance.getObjects(t))]}static{this.extraAliases=[`nepheria-scene-state`,`nepheria-combat-state`,`nepheria-reveal-registry`,`jukebox`,`nepheria-bgm-library`,`nepheria-hall-state`]}parseInnerXml(t){let r$3=(n=>Array.from(t.children).some(s=>s.nodeName===n))(c$4.aliasName),o$2=[...l.instance.getObjects(c$1),...l.instance.getObjects(D),...l.instance.getObjects(h),...l.instance.getObjects(f),...l.instance.getObjects(r$1),...l.instance.getObjects(u),...l.instance.getObjects(r),...l.instance.getObjects(A),...l.instance.getObjects(l$1),...l.instance.getObjects(o),...l.instance.getObjects(i),...r$3?l.instance.getObjects(c$4):[]];if(this.reloadCheck.answerCheck()){for(let n of o$2)n.destroy();this.announceWhatIsComingBack(t);for(let n=0;n<t.children.length;n++){let s=t.children[n],c=null;s.nodeName===u.aliasName&&(c=s.getAttribute(ve),s.removeAttribute(ve));let l$2=!!c&&ct.test(c)&&!l.instance.get(c);h$1.instance.parseXml(s,l$2&&c?c:void 0)}l.instance.getObjects(c$4).length<1&&st(L$1.instance),A$2(l.instance.getObjects().filter(n=>!(P.keepCharacterOwners&&n instanceof u)))}}announceWhatIsComingBack(t){let e=Array.from(t.querySelectorAll(`[identifier]`)).map(r=>r.getAttribute(`identifier`)??``).filter(r=>r.length>0);e.length<1||(l.instance.forgetDeleted(e),w(`FORGET_DELETED_OBJECTS`,{identifiers:e}))}};E=P=v([u$1(`room`)],E);var da=/ImageIdentifier$|^imageIdentifier$/;var pa=`attachmentImageIdentifiers`;var lt=4;var dt=class a{constructor(){this.imageStorage=T$1(L$1),this.audioStorage=T$1(c$2),this.fileArchiver=T$1(F$2),this.chatTabList=T$1(c$3),this.appConfig=T$1(o$1),this.dataSummarySetting=T$1(n),this.statusAilmentCatalog=T$1(I$1),this.translate=T$1(a$2),this.chatLogTextDecoder=t=>f$1(t,this.translate)}static{this.queue=new h$3(`SaveDataServiceQueue`)}saveRoomAsync(t=``,e){return a.queue.add(()=>this._saveRoomAsync(t,e))}createRoomArchiveAsync(){return a.queue.add(()=>this.fileArchiver.createZipBlobAsync(this.buildRoomFiles(!1)))}buildAssetFiles(t){let e=[],r=this.imageStorage.images.filter(n=>n.state===a$1.COMPLETE&&t.images.has(n.identifier));for(let n of r){let s=this.createImageArchiveFile(n);s&&e.push(s)}e.push(new File([this.convertToXml(O.create(r))],`imagetag.xml`,{type:`text/plain`}));let o=this.audioStorage.audios.filter(n=>!n.isHidden&&t.audios.has(n.identifier)),i=new Set(e.map(n=>n.name.toLowerCase()));for(let n of o){let s=ma(n,i);s&&e.push(s)}return e.push(new File([this.convertToXml(R.create(o))],`audiotag.xml`,{type:`text/plain`})),e}roomRootObjects(){return new E().rootObjects().map(t=>({identifier:t.identifier,toXml:()=>E.rootXml(t),carriedImageIdentifiers:be(t)}))}buildSidecarXml(){return[{name:`chat.xml`,xml:this.convertToXml(this.chatTabList,!1)},{name:`config.xml`,xml:this.convertToXml(this.appConfig,!1)},{name:`summary.xml`,xml:this.convertToXml(this.dataSummarySetting,!1)},{name:`ailment.xml`,xml:this.convertToXml(this.statusAilmentCatalog,!1)}]}imagesNamedIn(t){return this.searchImageFiles(t)}buildTagXml(t){let e=this.audioStorage.audios.filter(r=>!r.isHidden);return{imageTagXml:this.convertToXml(O.create([...t]),!1),audioTagXml:this.convertToXml(R.create(e),!1)}}imageArchiveName(t,e){return t.identifier+`.`+m$1(e.type)}_saveRoomAsync(t=``,e){return this.saveAsync(this.buildRoomFiles(),this.appendTimestamp(t),e)}buildRoomXmlParts(t){let e=this.convertToXml(new E,t),r=this.convertToXml(this.chatTabList,t),o=this.convertToXml(this.appConfig,t),i=this.convertToXml(this.dataSummarySetting,t),n=this.convertToXml(this.statusAilmentCatalog,t);return{roomXml:e,chatXml:r,files:[new File([e],`data.xml`,{type:`text/plain`}),new File([r],`chat.xml`,{type:`text/plain`}),new File([o],`config.xml`,{type:`text/plain`}),new File([i],`summary.xml`,{type:`text/plain`}),new File([n],`ailment.xml`,{type:`text/plain`})]}}buildRoomFiles(t=!0){let{roomXml:e,chatXml:r,files:o}=this.buildRoomXmlParts(t),i=this.withCarried([...this.searchImageFiles(e),...this.searchImageFiles(r)],new E().rootObjects());for(let l of i){let f=this.createImageArchiveFile(l);f&&o.push(f)}let n=this.convertToXml(O.create(i),t);o.push(new File([n],`imagetag.xml`,{type:`text/plain`}));let s=this.audioStorage.audios.filter(l=>!l.isHidden),c=this.convertToXml(R.create(s),t);return o.push(new File([c],`audiotag.xml`,{type:`text/plain`})),o}saveGameObjectAsync(t,e=`xml_data`,r){return a.queue.add(()=>this._saveGameObjectAsync(t,e,r))}createGameObjectArchiveAsync(t){return a.queue.add(()=>{let e=[],r=this.convertToXml(t);e.push(new File([r],`data.xml`,{type:`text/plain`}));let o=this.withCarried(this.searchImageFiles(r),[t]);for(let i of o){let n=this.createImageArchiveFile(i);n&&e.push(n)}return e.push(new File([this.convertToXml(O.create(o))],`imagetag.xml`,{type:`text/plain`})),this.fileArchiver.createZipBlobAsync(e)})}_saveGameObjectAsync(t,e=`xml_data`,r){let o=[],i=this.convertToXml(t);o.push(new File([i],`data.xml`,{type:`text/plain`}));let n=this.withCarried(this.searchImageFiles(i),[t]);for(let c of n){let l=this.createImageArchiveFile(c);l&&o.push(l)}let s=this.convertToXml(O.create(n));return o.push(new File([s],`imagetag.xml`,{type:`text/plain`})),this.saveAsync(o,this.appendTimestamp(e),r)}saveAsync(t,e,r){let o=-1;return this.fileArchiver.saveAsync(t,e,i=>{let n=i.percent|0;n<=o||(o=n,r?.(o))})}createImageArchiveFile(t){if(t.state!==a$1.COMPLETE)return null;let e=t.blob;return e?new File([e],t.identifier+`.`+m$1(e.type),{type:e.type}):null}convertToXml(t,e=!0){let o=`<?xml version="1.0" encoding="UTF-8"?>`+t.toXml();return e?Je(o,{indentation:`  `,lineSeparator:`
`}):o}withCarried(t,e){let r=new Map(t.map(o=>[o.identifier,o]));for(let o of e)for(let i of be(o)){if(r.has(i))continue;let n=this.imageStorage.get(i);n&&r.set(i,n)}return[...r.values()]}searchImageFiles(t){let e=K(t),r=[];if(!e)return r;let o={},i=e.ownerDocument.querySelectorAll(`*[type="image"]`);for(let n=0;n<i.length;n++){let s=i[n].innerHTML;o[s]=this.imageStorage.get(s)}for(let n of Array.from(e.ownerDocument.querySelectorAll(`*`))){for(let{name:c,value:l}of Array.from(n.attributes))!l||!da.test(c)||(o[l]=this.imageStorage.get(l));let s=n.getAttribute(pa)??``;for(let c of this.parseAttachmentImageIdentifiers(s))c&&(o[c]=this.imageStorage.get(c))}for(let n of Object.values(o))n&&r.push(n);return r}parseAttachmentImageIdentifiers(t){let e=t.trim();if(e.startsWith(`[`))try{let r=JSON.parse(e);if(Array.isArray(r))return r.map(o=>String(o))}catch(r){return[]}return e.split(/\n+/)}saveChatLog(t,e,r,o,i){return L(this,null,function*(){let n=yield this.prepareChatLogImages(r),s=this.renderChatLog(t,e,r,n);L$2(new Blob([s],{type:`text/plain;charset=utf-8`}),i??this.appendTimestamp(`${this.chatLogRoomName()}_log_${o}`)+`.html`)})}renderChatLog(t,e,r,o){let i=ot(t,e,r,{imageSrcResolver:o.resolver,textDecoder:this.chatLogTextDecoder,showTime:this.chatTabList.simpleDispFlagTime,roomName:s.peerContext?.roomName||void 0,labels:this.chatLogLabels(),lang:document.documentElement.lang||void 0,exportedAt:Date.now()});return a.injectImageRegistry(i,o.registryScript)}chatLogRoomName(){return s.peerContext?.roomName||this.translate(`app.roomDataDefault`)}chatLogLabels(){let t=(e,r)=>this.translate(`feature.chat.log.labels.${e}`,r);return{secret:t(`secret`),edited:t(`edited`),quote:t(`quote`),reply:t(`reply`),critical:t(`critical`),fumble:t(`fumble`),success:t(`success`),failure:t(`failure`),allTabs:t(`allTabs`),everyTab:t(`everyTab`),messages:e=>t(`messages`,{count:e}),exportedWith:t(`exportedWith`)}}static{this.PORTRAIT_MAX_DIMENSION=96}static{this.ATTACHMENT_MAX_DIMENSION=360}prepareChatLogImages(t){return L(this,null,function*(){let e=new Set,r=new Map;for(let f of t)for(let x of f.chatMessages){let v=x.image;v&&(r.set(v.identifier,v),e.add(v.identifier));for(let k of x.attachmentImages)r.has(k.identifier)||r.set(k.identifier,k)}let o=new Map,i={},n=0,s=[...r.values()];for(let f=0;f<s.length;f+=lt)yield Promise.all(s.slice(f,f+lt).map(x=>L(this,null,function*(){let v=e.has(x.identifier),k=v?a.PORTRAIT_MAX_DIMENSION:a.ATTACHMENT_MAX_DIMENSION,b=yield this.createChatLogImageSrc(x,k,v);if(!b)return;let w=`i${n++}`;o.set(x.identifier,w),i[w]=b})));let c=f=>o.get(f.identifier)??``;return{resolver:c,registryScript:a.buildImageRegistryScript(i)}})}createChatLogImageSrc(t,e,r=!1){return L(this,null,function*(){let o=t.blob;if(o)return e>0&&(o=(yield le(o,e,{square:r}))??o),z(o);let i=t.url;return!i||i.startsWith(`data:`)?i:(yield this.createChatLogImageSrcFromUrl(i,e,r))??i})}createChatLogImageSrcFromUrl(t,e,r){return L(this,null,function*(){try{let o=yield fetch(t);if(!o.ok)return null;let i=yield o.blob();return e>0&&(i=(yield le(i,e,{square:r}))??i),z(i)}catch(o){return null}})}static buildImageRegistryScript(t){return Object.keys(t).length===0?``:`<script>(function(){var m=${JSON.stringify(t).replace(/<\/(script)/gi,`<\\/$1`)};document.querySelectorAll('img[data-img-key]').forEach(function(el){var k=el.getAttribute('data-img-key');if(k&&Object.prototype.hasOwnProperty.call(m,k))el.setAttribute('src',m[k]);});})();<\/script>`}static injectImageRegistry(t,e){if(!e)return t;let r=t.lastIndexOf(`</body>`);return r<0?t+`
`+e:t.slice(0,r)+e+`
`+t.slice(r)}appendTimestamp(t){let e=new Date;return t+`_${e.getFullYear()}-${(`00`+(e.getMonth()+1)).slice(-2)}-${(`00`+e.getDate()).slice(-2)}_${(`00`+e.getHours()).slice(-2)}${(`00`+e.getMinutes()).slice(-2)}`}static{this.ɵfac=function(e){return new(e||a)}}static{this.ɵprov=re({token:a,factory:a.ɵfac,providedIn:`root`})}};var fa={"audio/mpeg":`mp3`,"audio/mp3":`mp3`,"audio/wav":`wav`,"audio/wave":`wav`,"audio/x-wav":`wav`,"audio/aac":`m4a`,"audio/mp4":`m4a`,"audio/x-m4a":`m4a`,"audio/ogg":`ogg`};function ma(a$4,t){let e=a$4.blob;if(!e)return null;let r=a$4.name.lastIndexOf(`.`),o=r>0?a$4.name.slice(r+1).toLowerCase():``,i=a(`sound.${o}`).startsWith(`audio/`),n=i?o:fa[e.type];if(!n)return null;let s=(i?a$4.name.slice(0,r):a$4.name).trim()||a$4.identifier,c=`${s}.${n}`;for(let l=2;t.has(c.toLowerCase());l++)c=`${s} (${l}).${n}`;return t.add(c.toLowerCase()),new File([e],c,{type:a(`sound.${n}`)})}export{st as i,dt as n,h as r,E as t};