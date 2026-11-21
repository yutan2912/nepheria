function a(e){return`nepheria-${e}`}var p=`ping`;var E=`pong`;var o=`ecdsa-p256-v1`;function _(e,t,r,s){return`nepheria-relay-create/${o}
${e}
${t}
${r}
${s}`}function x(e,t,r){return`nepheria-relay-delete/${o}
${e}
${t}
${r}`}function c(e,t,r){return`nepheria-relay-restore/${o}
${e}
${t}
${r}`}var n=256*1024;var I={maxMessageBytes:1024*1024,maxBinaryBytes:n+4096,msgPerSec:60,msgBurst:120,passAttemptsPerConn:3,passAttemptsPerRoom:20,passWindowMs:600*1e3,passAttemptsPerIp:10,maxParticipants:12,maxMirrorObjects:6e4,maxMirrorBytes:64*1024*1024,maxImageBytes:8*1024*1024,maxImageTotalBytes:200*1024*1024,maxAwayLog:2e3,handshakeTimeoutMs:1e4,maxShrinkRatio:.5};var O=4429;var R=4403;var i=4409;export{_ as a,i as c,p as d,x as f,R as i,n as l,I as n,a as o,O as r,c as s,E as t,o as u};