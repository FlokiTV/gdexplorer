import{S as r,i as u,s as f,C as c,D as _,E as d,F as p,f as m,t as g,o as h}from"../../chunks/index-7f3551f2.js";function y(a){let n;const o=a[3].default,t=c(o,a,a[2],null);return{c(){t&&t.c()},l(e){t&&t.l(e)},m(e,s){t&&t.m(e,s),n=!0},p(e,[s]){t&&t.p&&(!n||s&4)&&_(t,o,e,e[2],n?p(o,e[2],s,null):d(e[2]),null)},i(e){n||(m(t,e),n=!0)},o(e){g(t,e),n=!1},d(e){t&&t.d(e)}}}function N(a,n,o){let{$$slots:t={},$$scope:e}=n,{data:s}=n;const i=!0;return h(()=>{Neutralino.init(),Neutralino.events.on("ready",async()=>{let l=await Neutralino.os.showOpenDialog("Open a file",{filters:[{name:"Images",extensions:["jpg","png"]},{name:"All files",extensions:["*"]}]});console.log("You have selected:",l)})}),a.$$set=l=>{"data"in l&&o(0,s=l.data),"$$scope"in l&&o(2,e=l.$$scope)},[s,i,e,t]}class w extends r{constructor(n){super(),u(this,n,N,y,f,{data:0,prerender:1})}get prerender(){return this.$$.ctx[1]}}export{w as default};