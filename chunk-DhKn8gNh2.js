var a=`ping`;var p=`pong`;var r=`ecdsa-p256-v1`;function _(e,t,o,s){return`nepheria-relay-create/${r}
${e}
${t}
${o}
${s}`}function E(e,t,o){return`nepheria-relay-delete/${r}
${e}
${t}
${o}`}var n=256*1024;var c={maxMessageBytes:1024*1024,maxBinaryBytes:n+4096,msgPerSec:60,msgBurst:120,passAttemptsPerConn:3,passAttemptsPerRoom:20,passWindowMs:600*1e3,passAttemptsPerIp:10,maxParticipants:12,maxMirrorObjects:6e4,maxMirrorBytes:64*1024*1024,maxImageBytes:8*1024*1024,maxImageTotalBytes:200*1024*1024,maxAwayLog:2e3,handshakeTimeoutMs:1e4,maxShrinkRatio:.5};var I=4429;var A=4403;var T=4409;export{_ as a,n as c,T as i,p as l,E as n,a as o,I as r,c as s,A as t,r as u};