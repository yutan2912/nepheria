import{t as E$1}from"./chunk-SkGxJy5J.js";import{B as Ye,C as P$1,F as Ve$1,W as b$1,d as Ee$1,f as F$1,g as He$1,gt as yt,h as H$1,o as Be$1,ot as ot$1,pt as wt,t as $$1}from"./chunk-Devm31Jg.js";var E=new Set;var q=!1;function Q(e,r,t=2){let n=r&&r.length,i=n?r[0]*t:e.length;E.size&&E.clear();let o=Tt(e,0,i,t,!0),s=[];if(!o||o.next===o.prev)return s;let u=0,a=0,c=0;if(n&&(o=ge(e,r,o,t)),e.length>80*t){u=e[0],a=e[1];let f=u,d=a;for(let m=t;m<i;m+=t){let x=e[m],h=e[m+1];x<u&&(u=x),h<a&&(a=h),x>f&&(f=x),h>d&&(d=h)}c=Math.max(f-u,d-a),c=c!==0?32767/c:0}return tt(o,s,u,a,c),s}function Tt(e,r,t,n,i){let o=null;if(i===Te(e,r,t,n)>0)for(let s=r;s<t;s+=n)o=zt(s/n|0,e[s],e[s+1],o);else for(let s=t-n;s>=r;s-=n)o=zt(s/n|0,e[s],e[s+1],o);return o&&V(o,o.next)&&(R(o),o=o.next),o}function U(e,r=e){let t=r===e,n=e,i;do i=!1,n!==n.next&&(E.size===0||!E.has(n))&&(V(n,n.next)||b(n.prev,n,n.next)===0)?((t||n===r)&&(r=n.prev),q=!0,R(n),n=n.prev,i=!0):(t||n!==r)&&(n=n.next,i=!t);while(i||n!==r);return r}function tt(e,r,t,n,i){i&&Ae(e,t,n,i);let o=e,s=!1;for(;e.prev!==e.next;){let u=e.prev,a=e.next;if(b(u,e,a)<0&&(i?me(e,t,n,i):pe(e))){r.push(u.i,e.i,a.i),R(e),e=a,o=a;continue}if(e=a,e===o){if(q=!1,e=U(e),q){o=e;continue}if(!s){e=de(e,r),o=e,s=!0;continue}ve(e,r,t,n,i);break}}}function pe(e){let r=e.prev,t=e,n=e.next,i=r.x,o=t.x,s=n.x,u=r.y,a=t.y,c=n.y,f=Math.min(i,o,s),d=Math.min(u,a,c),m=Math.max(i,o,s),x=Math.max(u,a,c),h=n.next;for(;h!==r;){if(h.x>=f&&h.x<=m&&h.y>=d&&h.y<=x&&!(i===h.x&&u===h.y)&&K(i,u,o,a,s,c,h.x,h.y)&&b(h.prev,h,h.next)>=0)return!1;h=h.next}return!0}function me(e,r,t,n){let i=e.prev,o=e,s=e.next,u=i.x,a=o.x,c=s.x,f=i.y,d=o.y,m=s.y,x=Math.min(u,a,c),h=Math.min(f,d,m),v=Math.max(u,a,c),_=Math.max(f,d,m),w=it(x,h,r,t,n),l=it(v,_,r,t,n),g=e.prevZ;for(;g&&g.z>=w;){if(g.x>=x&&g.x<=v&&g.y>=h&&g.y<=_&&g!==s&&!(u===g.x&&f===g.y)&&K(u,f,a,d,c,m,g.x,g.y)&&b(g.prev,g,g.next)>=0)return!1;g=g.prevZ}let p=e.nextZ;for(;p&&p.z<=l;){if(p.x>=x&&p.x<=v&&p.y>=h&&p.y<=_&&p!==s&&!(u===p.x&&f===p.y)&&K(u,f,a,d,c,m,p.x,p.y)&&b(p.prev,p,p.next)>=0)return!1;p=p.nextZ}return!0}function de(e,r){let t=e,n=!1;do{let i=t.prev,o=t.next.next;Gt(i,t,t.next,o,!1)&&D(i,o)&&D(o,i)&&(r.push(i.i,t.i,o.i),R(t),R(t.next),t=e=o,n=!0),t=t.next}while(t!==e);return n?U(t):t}function ve(e,r,t,n,i){let o=e;do{let s=o.next.next;for(;s!==o.prev;){if(o.i!==s.i&&Ue(o,s)){let u=Et(o,s);o=U(o,o.next),u=U(u,u.next),tt(o,r,t,n,i),tt(u,r,t,n,i);return}s=s.next}o=o.next}while(o!==e)}var et=!1;function ge(e,r,t,n){let i=[];for(let o=0,s=r.length;o<s;o++){let c=Tt(e,r[o]*n,o<s-1?r[o+1]*n:e.length,n,!1);c===c.next&&E.add(c),i.push(Me(c))}i.sort(ye),_e(e.length/n,r.length),kt(t,t),et=!0;for(let o=0;o<i.length;o++)t=be(i[o],t);return et=!1,U(t)}function ye(e,r){return e.x-r.x||e.y-r.y||(e.next.y-e.y)/(e.next.x-e.x)-(r.next.y-r.y)/(r.next.x-r.x)}function be(e,r){let t=Se(e,r);if(!t)return r;let n=Et(t,e),i=n.next;return kt(t,i.next),U(n,n.next),U(t,t.next)}var Ct=16;var y=new Float64Array(0);var Y=0;var rt=[];var nt=[];function _e(e,r){let t=Math.ceil((e+2*r)/Ct)+r+2;y.length<t*4&&(y=new Float64Array(t*4)),Y=0}function kt(e,r){let t=e;do{let n=Y++;rt[n]=t;let i=t.x,o=t.y,s=t.x,u=t.y,a=0;do{let f=t.next;t.z=n,f.x<i&&(i=f.x),f.x>s&&(s=f.x),f.y<o&&(o=f.y),f.y>u&&(u=f.y),t=f}while(++a<Ct&&t!==r);nt[n]=t;let c=n*4;y[c]=i,y[c+1]=o,y[c+2]=s,y[c+3]=u}while(t!==r)}function we(e,r){let t=e.z*4;r.x<y[t]&&(y[t]=r.x),r.y<y[t+1]&&(y[t+1]=r.y),r.x>y[t+2]&&(y[t+2]=r.x),r.y>y[t+3]&&(y[t+3]=r.y)}function Ut(e){let r=nt[e];for(;r.prev.next!==r;)r=r.next;return nt[e]=r,r}function Pt(e){let r=rt[e];for(;r.prev.next!==r;)r=r.next;return rt[e]=r,r}function Se(e,r){let t=r,n=e.x,i=e.y,o=-Infinity,s;if(V(e,t))return t;for(let m=0,x=0;m<Y;m++,x+=4){if(i<y[x+1]||i>y[x+3]||y[x]>n||y[x+2]<=o)continue;let h=Ut(m);t=Pt(m);do{if(t.prev.next===t){if(V(e,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){let v=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(v<=n&&v>o&&(o=v,s=t.x<t.next.x?t:t.next,v===n))return s}}t=t.next}while(t!==h)}if(!s)return null;let u=s.x,a=s.y,c=Math.min(i,a),f=Math.max(i,a),d=Infinity;for(let m=0,x=0;m<Y;m++,x+=4){if(y[x+2]<u||y[x]>n||y[x+3]<c||y[x+1]>f)continue;let h=Ut(m);t=Pt(m);do{if(t.prev.next===t&&n>=t.x&&t.x>=u&&n!==t.x&&K(i<a?n:o,i,u,a,i<a?o:n,i,t.x,t.y)){let v=Math.abs(i-t.y)/(n-t.x);(D(t,e)||t.y===i&&t.next.y===i&&t.next.x>n)&&(v<d||v===d&&(t.x>s.x||t.x===s.x&&Be(s,t)))&&(s=t,d=v)}t=t.next}while(t!==h)}return s}function Be(e,r){return b(e.prev,e,r.prev)<0&&b(r.next,e,e.next)<0}var S=[];var P=[];var M=new Uint32Array(0);var k=new Uint32Array(0);var G=new Uint32Array(256);function Ae(e,r,t,n){let i=e,o=0;do i.z=it(i.x,i.y,r,t,n),S[o++]=i,i=i.next;while(i!==e);Ie(o);let s=null;for(let u=0;u<o;u++){let a=S[u];a.prevZ=s,s&&(s.nextZ=a),s=a}s.nextZ=null,S.fill(null,0,o),P.fill(null,0,o)}function Ie(e){if(e<=32){for(let r=1;r<e;r++){let t=S[r],n=t.z,i=r-1;for(;i>=0&&S[i].z>n;)S[i+1]=S[i],i--;S[i+1]=t}return}M.length<e&&(M=new Uint32Array(e),k=new Uint32Array(e),P=new Array(e));for(let r=0;r<e;r++)M[r]=S[r].z;N(e,S,M,P,k,0),N(e,P,k,S,M,8),N(e,S,M,P,k,16),N(e,P,k,S,M,24)}function N(e,r,t,n,i,o){G.fill(0);for(let u=0;u<e;u++)G[t[u]>>>o&255]++;let s=0;for(let u=0;u<256;u++){let a=G[u];G[u]=s,s+=a}for(let u=0;u<e;u++){let a=t[u],c=G[a>>>o&255]++;n[c]=r[u],i[c]=a}}function it(e,r,t,n,i){return e=(e-t)*i|0,r=(r-n)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e|r<<1}function Me(e){let r=e,t=e;do(r.x<t.x||r.x===t.x&&r.y<t.y)&&(t=r),r=r.next;while(r!==e);return t}function K(e,r,t,n,i,o,s,u){return(i-s)*(r-u)>=(e-s)*(o-u)&&(e-s)*(n-u)>=(t-s)*(r-u)&&(t-s)*(o-u)>=(i-s)*(n-u)}function Ue(e,r){let t=V(e,r)&&b(e.prev,e,e.next)>0&&b(r.prev,r,r.next)>0;return e.next.i!==r.i&&(t||D(e,r)&&D(r,e)&&(b(e.prev,e,r.prev)!==0||b(e,r.prev,r)!==0))&&!Pe(e,r)&&(t||ze(e,r))}function b(e,r,t){return(r.y-e.y)*(t.x-r.x)-(r.x-e.x)*(t.y-r.y)}function V(e,r){return e.x===r.x&&e.y===r.y}function Gt(e,r,t,n,i=!0){let o=b(e,r,t),s=b(e,r,n),u=b(t,n,e),a=b(t,n,r);return(o>0&&s<0||o<0&&s>0)&&(u>0&&a<0||u<0&&a>0)?!0:i?!!(o===0&&W(e,t,r)||s===0&&W(e,n,r)||u===0&&W(t,e,n)||a===0&&W(t,r,n)):!1}function W(e,r,t){return r.x<=Math.max(e.x,t.x)&&r.x>=Math.min(e.x,t.x)&&r.y<=Math.max(e.y,t.y)&&r.y>=Math.min(e.y,t.y)}function Pe(e,r){let t=Math.min(e.x,r.x),n=Math.max(e.x,r.x),i=Math.min(e.y,r.y),o=Math.max(e.y,r.y),s=e;do{let u=s.next;if(s.x>n&&u.x>n||s.x<t&&u.x<t||s.y>o&&u.y>o||s.y<i&&u.y<i){s=u;continue}if(s.i!==e.i&&u.i!==e.i&&s.i!==r.i&&u.i!==r.i&&Gt(s,u,e,r))return!0;s=u}while(s!==e);return!1}function D(e,r){return b(e.prev,e,e.next)<0?b(e,r,e.next)>=0&&b(e,e.prev,r)>=0:b(e,r,e.prev)<0||b(e,e.next,r)<0}function ze(e,r){let t=e,n=!1,i=(e.x+r.x)/2,o=(e.y+r.y)/2;do{let s=t.next;t.y>o!=s.y>o&&i<(s.x-t.x)*(o-t.y)/(s.y-t.y)+t.x&&(n=!n),t=s}while(t!==e);return n}function Et(e,r){let t=ot(e.i,e.x,e.y),n=ot(r.i,r.x,r.y),i=e.next,o=r.prev;return e.next=r,r.prev=e,t.next=i,i.prev=t,n.next=t,t.prev=n,o.next=n,n.prev=o,n}function zt(e,r,t,n){let i=ot(e,r,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function R(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ),et&&we(e.prev,e.next)}function ot(e,r,t){return{i:e,x:r,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null}}function Te(e,r,t,n){let i=0;for(let o=r,s=t-n;o<t;o+=n)i+=(e[s]-e[o])*(e[o+1]+e[s+1]),s=o;return i}var Le=Q.default||Q;function st(e,r,t){if(e)for(let n in e){let o=r[n.toLocaleLowerCase()];if(o){let s=e[n];n===`header`&&(s=s.replace(/@in\s+[^;]+;\s*/g,``).replace(/@out\s+[^;]+;\s*/g,``)),t&&o.push(`//----${t}----//`),o.push(s)}else H$1(`${n} placement hook does not exist in shader`)}}var Ce=/\{\{(.*?)\}\}/g;function ut(e){let r={};return(e.match(Ce)?.map(n=>n.replace(/[{()}]/g,``))??[]).forEach(n=>{r[n]=[]}),r}function Vt(e,r){let t,n=/@in\s+([^;]+);/g;for(;(t=n.exec(e))!==null;)r.push(t[1])}function at(e,r,t=!1){let n=[];Vt(r,n),e.forEach(u=>{u.header&&Vt(u.header,n)});let i=n;t&&i.sort();let o=i.map((u,a)=>`       @location(${a}) ${u},`).join(`
`),s=r.replace(/@in\s+[^;]+;\s*/g,``);return s=s.replace(`{{in}}`,`
${o}
`),s}function Dt(e,r){let t,n=/@out\s+([^;]+);/g;for(;(t=n.exec(e))!==null;)r.push(t[1])}function ke(e){let t=/\b(\w+)\s*:/g.exec(e);return t?t[1]:``}function Ge(e){return e.replace(/@.*?\s+/g,``)}function Rt(e,r){let t=[];Dt(r,t),e.forEach(a=>{a.header&&Dt(a.header,t)});let n=0,i=t.sort().map(a=>a.indexOf(`builtin`)>-1?a:`@location(${n++}) ${a}`).join(`,
`),o=t.sort().map(a=>`       var ${Ge(a)};`).join(`
`),s=`return VSOutput(
            ${t.sort().map(a=>` ${ke(a)}`).join(`,
`)});`,u=r.replace(/@out\s+[^;]+;\s*/g,``);return u=u.replace(`{{struct}}`,`
${i}
`),u=u.replace(`{{start}}`,`
${o}
`),u=u.replace(`{{return}}`,`
${s}
`),u}function lt(e,r){let t=e;for(let n in r){let i=r[n];i.join(`
`).length?t=t.replace(`{{${n}}}`,`//-----${n} START-----//
${i.join(`
`)}
//----${n} FINISH----//`):t=t.replace(`{{${n}}}`,``)}return t}var I=Object.create(null);var ct=new Map;var Ee=0;function $t({template:e,bits:r}){let t=Ht(e,r);if(I[t])return I[t];let{vertex:n,fragment:i}=Ve(e,r);return I[t]=jt(n,i,r),I[t]}function Ft({template:e,bits:r}){let t=Ht(e,r);return I[t]||(I[t]=jt(e.vertex,e.fragment,r)),I[t]}function Ve(e,r){let t=r.map(s=>s.vertex).filter(s=>!!s),n=r.map(s=>s.fragment).filter(s=>!!s),i=at(t,e.vertex,!0);i=Rt(t,i);let o=at(n,e.fragment,!0);return{vertex:i,fragment:o}}function Ht(e,r){return r.map(t=>(ct.has(t)||ct.set(t,Ee++),ct.get(t))).sort((t,n)=>t-n).join(`-`)+e.vertex+e.fragment}function jt(e,r,t){let n=ut(e),i=ut(r);return t.forEach(o=>{st(o.vertex,n,o.name),st(o.fragment,i,o.name)}),{vertex:lt(e,n),fragment:lt(r,i)}}var Zt=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`;var Nt=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`;var Wt=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`;var Yt=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`;var Kt={name:`global-uniforms-bit`,vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}};var hr={name:`global-uniforms-ubo-bit`,vertex:{header:`
          uniform globalUniforms {
            mat3 uProjectionMatrix;
            mat3 uWorldTransformMatrix;
            vec4 uWorldColorAlpha;
            vec2 uResolution;
          };
        `}};var Qt={name:`global-uniforms-bit`,vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function Xt({bits:e,name:r}){let t=$t({template:{fragment:Nt,vertex:Zt},bits:[Kt,...e]});return yt.from({name:r,vertex:{source:t.vertex,entryPoint:`main`},fragment:{source:t.fragment,entryPoint:`main`}})}function Lt({bits:e,name:r}){return new Ye(E$1({name:r},Ft({template:{vertex:Wt,fragment:Yt},bits:[Qt,...e]})))}var Jt={name:`color-bit`,vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}};var Ot={name:`color-bit`,vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}};var ft={};function De(e){let r=[];if(e===1)r.push(`@group(1) @binding(0) var textureSource1: texture_2d<f32>;`),r.push(`@group(1) @binding(1) var textureSampler1: sampler;`);else{let t=0;for(let n=0;n<e;n++)r.push(`@group(1) @binding(${t++}) var textureSource${n+1}: texture_2d<f32>;`),r.push(`@group(1) @binding(${t++}) var textureSampler${n+1}: sampler;`)}return r.join(`
`)}function Re(e){let r=[];if(e===1)r.push(`outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);`);else{r.push(`switch vTextureId {`);for(let t=0;t<e;t++)t===e-1?r.push(`  default:{`):r.push(`  case ${t}:{`),r.push(`      outColor = textureSampleGrad(textureSource${t+1}, textureSampler${t+1}, vUV, uvDx, uvDy);`),r.push(`      break;}`);r.push(`}`)}return r.join(`
`)}function qt(e){return ft[e]||(ft[e]={name:`texture-batch-bit`,vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${De(e)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Re(e)}
            `}}),ft[e]}var ht={};function $e(e){let r=[];for(let t=0;t<e;t++)t>0&&r.push(`else`),t<e-1&&r.push(`if(vTextureId < ${t}.5)`),r.push(`{`),r.push(`	outColor = texture(uTextures[${t}], vUV);`),r.push(`}`);return r.join(`
`)}function te(e){return ht[e]||(ht[e]={name:`texture-batch-bit`,vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,main:`

                ${$e(e)}
            `}}),ht[e]}var ee={name:`round-pixels-bit`,vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}};var re={name:`round-pixels-bit`,vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}};var $=class{constructor(r){typeof r==`number`?this.rawBinaryData=new ArrayBuffer(r):r instanceof Uint8Array?this.rawBinaryData=r.buffer:this.rawBinaryData=r,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(r){return this[`${r}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(r){switch(r){case`int8`:case`uint8`:return 1;case`int16`:case`uint16`:return 2;case`int32`:case`uint32`:case`float32`:return 4;default:throw new Error(`${r} isn't a valid view type`)}}};function xt(e,r,t,n){if(t??(t=0),n??(n=Math.min(e.byteLength-t,r.byteLength)),!(t&7)&&!(n&7)){let i=n/8;new Float64Array(r,0,i).set(new Float64Array(e,t,i))}else if(!(t&3)&&!(n&3)){let i=n/4;new Float32Array(r,0,i).set(new Float32Array(e,t,i))}else new Uint8Array(r).set(new Uint8Array(e,t,n))}var ne={normal:`normal-npm`,add:`add-npm`,screen:`screen-npm`};var Fe=(e=>(e[e.DISABLED=0]=`DISABLED`,e[e.RENDERING_MASK_ADD=1]=`RENDERING_MASK_ADD`,e[e.MASK_ACTIVE=2]=`MASK_ACTIVE`,e[e.INVERSE_MASK_ACTIVE=3]=`INVERSE_MASK_ACTIVE`,e[e.RENDERING_MASK_REMOVE=4]=`RENDERING_MASK_REMOVE`,e[e.NONE=5]=`NONE`,e))(Fe||{});function pt(e,r){return r.alphaMode===`no-premultiply-alpha`&&ne[e]||e}var He=[`precision mediump float;`,`void main(void){`,`float test = 0.1;`,`%forloop%`,`gl_FragColor = vec4(0.0);`,`}`].join(`
`);function je(e){let r=``;for(let t=0;t<e;++t)t>0&&(r+=`
else `),t<e-1&&(r+=`if(test == ${t}.0){}`);return r}function ie(e,r){if(e===0)throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");let t=r.createShader(r.FRAGMENT_SHADER);try{for(;;){let n=He.replace(/%forloop%/gi,je(e));if(r.shaderSource(t,n),r.compileShader(t),!r.getShaderParameter(t,r.COMPILE_STATUS))e=e/2|0;else break}}finally{r.deleteShader(t)}return e}var z=null;function oe(){if(z)return z;let e=Ee$1();return z=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),z=ie(z,e),e.getExtension(`WEBGL_lose_context`)?.loseContext(),z}var X=class{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let r=0;r<this.count;r++){let t=this.textures[r];this.textures[r]=null,this.ids[t.uid]=null}this.count=0}};var mt=class{constructor(){this.renderPipeId=`batch`,this.action=`startBatch`,this.start=0,this.size=0,this.textures=new X,this.blendMode=`normal`,this.topology=`triangle-strip`,this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}};var H=[];var L=0;ot$1.register({clear:()=>{if(H.length>0)for(let e of H)e&&e.destroy();H.length=0,L=0}});function se(){return L>0?H[--L]:new mt}function ue(e){e.elements=null,H[L++]=e}var F=0;var le=(()=>{let e=class ae{constructor(t){this.uid=b$1(`batcher`),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t=E$1(E$1({},ae.defaultOptions),t),t.maxTextures||(F$1(`v8.8.0`,`maxTextures is a required option for Batcher now, please pass it in the options`),t.maxTextures=oe());let{maxTextures:n,attributesInitialSize:i,indicesInitialSize:o}=t;this.attributeBuffer=new $(i*4),this.indexBuffer=new Uint16Array(o),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let t=0;t<this.batchIndex;t++)ue(this.batches[t]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(t){this._elements[this.elementSize++]=t,t._indexStart=this.indexSize,t._attributeStart=this.attributeSize,t._batcher=this,this.indexSize+=t.indexSize,this.attributeSize+=t.attributeSize*this.vertexSize}checkAndUpdateTexture(t,n){let i=t._batch.textures.ids[n._source.uid];return!i&&i!==0?!1:(t._textureId=i,t.texture=n,!0)}updateElement(t){this.dirty=!0;let n=this.attributeBuffer;t.packAsQuad?this.packQuadAttributes(t,n.float32View,n.uint32View,t._attributeStart,t._textureId):this.packAttributes(t,n.float32View,n.uint32View,t._attributeStart,t._textureId)}break(t){let n=this._elements;if(!n[this.elementStart])return;let i=se(),o=i.textures;o.clear();let s=n[this.elementStart],u=pt(s.blendMode,s.texture._source),a=s.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);let c=this.attributeBuffer.float32View,f=this.attributeBuffer.uint32View,d=this.indexBuffer,m=this._batchIndexSize,x=this._batchIndexStart,h=`startBatch`,v=[],_=this.maxTextures;for(let w=this.elementStart;w<this.elementSize;++w){let l=n[w];n[w]=null;let p=l.texture._source,B=pt(l.blendMode,p),A=u!==B||a!==l.topology;if(p._batchTick===F&&!A){l._textureId=p._textureBindLocation,m+=l.indexSize,l.packAsQuad?(this.packQuadAttributes(l,c,f,l._attributeStart,l._textureId),this.packQuadIndex(d,l._indexStart,l._attributeStart/this.vertexSize)):(this.packAttributes(l,c,f,l._attributeStart,l._textureId),this.packIndex(l,d,l._indexStart,l._attributeStart/this.vertexSize)),l._batch=i,v.push(l);continue}p._batchTick=F,(o.count>=_||A)&&(this._finishBatch(i,x,m-x,o,u,a,t,h,v),h=`renderBatch`,x=m,u=B,a=l.topology,i=se(),o=i.textures,o.clear(),v=[],++F),l._textureId=p._textureBindLocation=o.count,o.ids[p.uid]=o.count,o.textures[o.count++]=p,l._batch=i,v.push(l),m+=l.indexSize,l.packAsQuad?(this.packQuadAttributes(l,c,f,l._attributeStart,l._textureId),this.packQuadIndex(d,l._indexStart,l._attributeStart/this.vertexSize)):(this.packAttributes(l,c,f,l._attributeStart,l._textureId),this.packIndex(l,d,l._indexStart,l._attributeStart/this.vertexSize))}o.count>0&&(this._finishBatch(i,x,m-x,o,u,a,t,h,v),x=m,++F),this.elementStart=this.elementSize,this._batchIndexStart=x,this._batchIndexSize=m}_finishBatch(t,n,i,o,s,u,a,c,f){t.gpuBindGroup=null,t.bindGroup=null,t.action=c,t.batcher=this,t.textures=o,t.blendMode=s,t.topology=u,t.start=n,t.size=i,t.elements=f,++F,this.batches[this.batchIndex++]=t,a.add(t)}finish(t){this.break(t)}ensureAttributeBuffer(t){t*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(t*4)}ensureIndexBuffer(t){t<=this.indexBuffer.length||this._resizeIndexBuffer(t)}_resizeAttributeBuffer(t){let i=new $(Math.max(t,this.attributeBuffer.size*2));xt(this.attributeBuffer.rawBinaryData,i.rawBinaryData),this.attributeBuffer=i}_resizeIndexBuffer(t){let n=this.indexBuffer,i=Math.max(t,n.length*1.5);i+=i%2;let o=i>65535?new Uint32Array(i):new Uint16Array(i);if(o.BYTES_PER_ELEMENT!==n.BYTES_PER_ELEMENT)for(let s=0;s<n.length;s++)o[s]=n[s];else xt(n.buffer,o.buffer);this.indexBuffer=o}packQuadIndex(t,n,i){t[n]=i+0,t[n+1]=i+1,t[n+2]=i+2,t[n+3]=i+0,t[n+4]=i+2,t[n+5]=i+3}packIndex(t,n,i,o){let s=t.indices,u=t.indexSize,a=t.indexOffset,c=t.attributeOffset;for(let f=0;f<u;f++)n[i++]=o+s[f+a]-c}destroy(t={}){if(this.batches!==null){for(let n=0;n<this.batchIndex;n++)ue(this.batches[n]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,t.shader&&(this.shader?.destroy(),this.shader=null);for(let n=0;n<this._elements.length;n++)this._elements[n]&&(this._elements[n]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};return e.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6},e})();var Ne=new Float32Array(1);var We=new Uint32Array(1);var J=class extends Be$1{constructor(){let t=new $$1({data:Ne,label:`attribute-batch-buffer`,usage:P$1.VERTEX|P$1.COPY_DST,shrinkToFit:!1}),n=new $$1({data:We,label:`index-batch-buffer`,usage:P$1.INDEX|P$1.COPY_DST,shrinkToFit:!1}),i=24;super({attributes:{aPosition:{buffer:t,format:`float32x2`,stride:i,offset:0},aUV:{buffer:t,format:`float32x2`,stride:i,offset:8},aColor:{buffer:t,format:`unorm8x4`,stride:i,offset:16},aTextureIdAndRound:{buffer:t,format:`uint16x2`,stride:i,offset:20}},indexBuffer:n})}};var ce={};function fe(e){let r=ce[e];if(r)return r;let t=new Int32Array(e);for(let n=0;n<e;n++)t[n]=n;return r=ce[e]=new He$1({uTextures:{value:t,type:`i32`,size:e}},{isStatic:!0}),r}var j=class extends Ve$1{constructor(r){let t=Lt({name:`batch`,bits:[Ot,te(r),re]}),n=Xt({name:`batch`,bits:[Jt,qt(r),ee]});super({glProgram:t,gpuProgram:n,resources:{batchSamplers:fe(r)}}),this.maxTextures=r}};var Z=null;var an=(()=>{let e=class he extends le{constructor(t){super(t),this.geometry=new J,this.name=he.extension.name,this.vertexSize=6,Z??(Z=new j(t.maxTextures)),this.shader=Z}packAttributes(t,n,i,o,s){let u=s<<16|t.roundPixels&65535,a=t.transform,c=a.a,f=a.b,d=a.c,m=a.d,x=a.tx,h=a.ty,{positions:v,uvs:_}=t,w=t.color,l=t.attributeOffset,g=l+t.attributeSize;for(let p=l;p<g;p++){let B=p*2,A=v[B],dt=v[B+1];n[o++]=c*A+d*dt+x,n[o++]=m*dt+f*A+h,n[o++]=_[B],n[o++]=_[B+1],i[o++]=w,i[o++]=u}}packQuadAttributes(t,n,i,o,s){let u=t.texture,a=t.transform,c=a.a,f=a.b,d=a.c,m=a.d,x=a.tx,h=a.ty,v=t.bounds,_=v.maxX,w=v.minX,l=v.maxY,g=v.minY,p=u.uvs,B=t.color,A=s<<16|t.roundPixels&65535;n[o+0]=c*w+d*g+x,n[o+1]=m*g+f*w+h,n[o+2]=p.x0,n[o+3]=p.y0,i[o+4]=B,i[o+5]=A,n[o+6]=c*_+d*g+x,n[o+7]=m*g+f*_+h,n[o+8]=p.x1,n[o+9]=p.y1,i[o+10]=B,i[o+11]=A,n[o+12]=c*_+d*l+x,n[o+13]=m*l+f*_+h,n[o+14]=p.x2,n[o+15]=p.y2,i[o+16]=B,i[o+17]=A,n[o+18]=c*w+d*l+x,n[o+19]=m*l+f*w+h,n[o+20]=p.x3,n[o+21]=p.y3,i[o+22]=B,i[o+23]=A}_updateMaxTextures(t){this.shader.maxTextures!==t&&(Z=new j(t),this.shader=Z)}destroy(){this.shader=null,super.destroy()}};return e.extension={type:[wt.Batcher],name:`default`},e})();var xe=class{constructor(r){this.items=Object.create(null);let{renderer:t,type:n,onUnload:i,priority:o,name:s}=r;this._renderer=t,t.gc.addResourceHash(this,`items`,n,o??0),this._onUnload=i,this.name=s}add(r){return this.items[r.uid]?!1:(this.items[r.uid]=r,r.once(`unload`,this.remove,this),r._gcLastUsed=this._renderer.gc.now,!0)}remove(r,...t){if(!this.items[r.uid])return;let n=r._gpuData[this._renderer.uid];n&&(this._onUnload?.(r,...t),r.off(`unload`,this.remove,this),n.destroy(),r._gpuData[this._renderer.uid]=null,this.items[r.uid]=null)}removeAll(...r){Object.values(this.items).forEach(t=>t&&this.remove(t,...r))}destroy(...r){this.removeAll(...r),this.items=Object.create(null),this._renderer=null,this._onUnload=null}};export{oe as A,hr as C,lt as D,le as E,te as F,ut as I,xe as L,qt as M,re as N,mt as O,st as P,xt as R,fe as S,j as T,Yt as _,J as a,at as b,Le as c,Ot as d,Qt as f,Xt as g,X as h,Ft as i,pt as j,ne as k,Lt as l,Wt as m,$t as n,Jt as o,Rt as p,Fe as r,Kt as s,$ as t,Nt as u,Zt as v,ie as w,ee as x,an as y};