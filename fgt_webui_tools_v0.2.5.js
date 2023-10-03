/*
FortiGate WebUI Tools v0.2.5 (Fortinet Community Edition)

URL: https://github.com/fwsec/fgt-webui-tools

Author       : Danny Jung
Contributors : Ahmed El-Marakby, Cameron Perrin, Murat Atay, James Shopland, David Bolt

License      : GNU General Public License (GPL)
Disclaimer   : Script use is of your own risk.
*/

javascript: (async function () {

    const version = "0.2.5";

    const cliStartingTokens = ["\u0000"]
    const cliStoppingTokens = []

    window.addEventListener("fpCliResponse", (evt) => {
      // Three capture groups:
      // command: everything until the \u0000
      // command response (body): everything after that and until we see a stopping token
      // stopping token: optional stopping token. Optional to prevent cutting the body.
      const pattern = new RegExp(`^(.*?)\\u0000(.*?)(?=${evt.data.stoppingToken}|$)(.*)?`, 's');

      // Use the exec method to capture the groups
      let match;
      if ((match = pattern.exec(evt.data.message)) !== null) {
        const command = match[1];
        const body = match[2];
        const endToken = match[3];
        handleMessage(body.trim(), evt.data.it);
      }
    });

    function createBadge() {
      const badge = document.createElement("div");
      badge.textContent = "1";
      badge.style.position = "absolute";
      badge.style.top = "50%";
      badge.style.transform = "translateY(-50%)";
      badge.style.width = "20px";
      badge.style.height = "20px";
      badge.style.borderRadius = "50%";
      badge.style.backgroundColor = "red";
      badge.style.color = "white";
      badge.style.fontSize = "12px";
      badge.style.textAlign = "center";
      badge.style.lineHeight = "20px";
      return badge;
    }


    function createMenuItem() {
      const itemEl = document.createElement("li");
      itemEl.style.listStyle = "none";
      itemEl.style.position = "relative";
      itemEl.style.color = "black";
      itemEl.style.backgroundColor = "#FFD700";
      itemEl.style.margin = 0;
      itemEl.style.padding = "6px 0 5px 35px";
      itemEl.style.cursor = "pointer";
      itemEl.style.fontWeight = "normal";
      itemEl.addEventListener("mousedown", (event) => {
        event.preventDefault();
      }); // Prevent text selection
      itemEl.onmouseover = function () {
        if (this.dataset.active !== "active") {
          this.style["background-color"] = "#FFE86D";
        }
      };
      itemEl.onmouseout = function () {
        if (this.dataset.active !== "active") {
          this.style["background-color"] = "#FFD700";
        }
      };
      return itemEl;
    }

    fetch('https://api.github.com/repos/fwsec/fgt-webui-tools/contents')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const regexPattern = /fgt_webui_tools_v([0-9]+\.[0-9]+\.[0-9]+)\.js/;
        const matchingItem = data.find(item => regexPattern.test(item.name));
        if (!matchingItem) {
          return;
        }
        const match = matchingItem.name.match(regexPattern);
        const extractedVersion = match[1];
        if (extractedVersion !== version) {
          const updateItem = createMenuItem();
          updateItem.innerText = "Update available!";
          const updateBadge = createBadge();
          updateBadge.style.left = "8px";
          updateItem.onclick = function () {
            const menuItems = menuEl.querySelectorAll("li");
            menuItems.forEach((menuItem) => {
              menuItem.dataset.active = "";
              menuItem.style.backgroundColor = "#FFD700";
            });
            this.dataset.active = "active";
            this.style.backgroundColor = "#FFE86D";

            handleMenuItemClick({
              script: async function (parentEl) {
                const versionText = document.createElement("table")
                versionText.innerHTML = "<tbody><tr><td colspan=\"2\"><span style=\"font-weight:bold\">FortiGate WebUI Tools</span></td></tr><tr><td>Current Version:</td><td>" + version + "</td></tr><tr><td>Recommended Version:</td><td>" + extractedVersion + "</td></tr></tbody>"
                versionText.style.borderSpacing = "8px"
                versionText.style.paddingBottom = "10px"
                const link = document.createElement("a")
                link.href = "https://fwsec.github.io/fgt-webui-tools/"
                link.innerText = "View recommended version on GitHub"
                link.target = "_blank"
                link.style.marginLeft = "8px"
                parentEl.innerHTML = "";
                parentEl.style.overflow = "auto";
                parentEl.style.padding = "1.5rem";
                parentEl.appendChild(versionText);
                parentEl.appendChild(link)
              }
            })
          }

          let canCreateDOM = true;
          if(!updateItem) {
            canCreateDOM = false;
          }
          const customMenu = document.getElementById("custom-menu");
          if(!customMenu) {
            canCreateDOM = false;
          }
          const toolMenu = document.getElementById("menu-toggle");
          if(!toolMenu) {
            canCreateDOM = false;
          }

          if(canCreateDOM){
            updateItem.appendChild(updateBadge);
            customMenu.appendChild(updateItem);
            const menuBadge = createBadge();
            menuBadge.style.right = "28px";
            toolMenu.appendChild(menuBadge);
          } else {
            setTimeout(() => {
              const customMenu = document.getElementById("custom-menu");
              const toolMenu = document.getElementById("menu-toggle");
              updateItem.appendChild(updateBadge);
              customMenu.appendChild(updateItem);
              const menuBadge = createBadge();
              menuBadge.style.right = "28px";
              toolMenu.appendChild(menuBadge);
            }, 500)
          }
        }
      })
      .catch(error => {
      });

      document.contains(document.getElementById("tools")) && document.getElementById("tools").remove();
      function findDirectory() {
        const scripts = document.querySelectorAll("script[src]");
        const targetScript = Array.from(scripts).find((script) =>
          /\/[a-f0-9]{32}\/runtime\.js/.test(script.src)
        );
        const key = targetScript.src.match(/\/([a-f0-9]{32})\/runtime\.js/)[1];
        return key;
      }

      function loadPrism() {
        const theme = document.createElement("style");
        theme.innerHTML =
          "code[class*=language-],pre[class*=language-]{color:#000;background:0 0;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{position:relative;margin:.5em 0;overflow:visible;padding:1px}pre[class*=language-]>code{position:relative;z-index:1;border-left:9px solid #499258;box-shadow:-1px 0 0 0 #358ccb,0 0 0 1px #dfdfdf;background-color:#fdfdfd;background-image:linear-gradient(transparent 50%,rgba(69,142,209,.04) 50%);background-size:3em 3em;background-origin:content-box;background-attachment:local}code[class*=language-]{max-height:inherit;height:inherit;padding:0 1em;display:block;overflow:auto}:not(pre)>code[class*=language-],pre[class*=language-]{background-color:#fdfdfd;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-bottom:1em}:not(pre)>code[class*=language-]{position:relative;padding:.2em;border-radius:.3em;color:#c92c2c;border:1px solid rgba(0,0,0,.1);display:inline;white-space:normal}pre[class*=language-]:before,pre[class*=language-]:after {display:none}.token.block-comment,.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#7d8b99}.token.punctuation{color:#5f6364}.token.boolean,.token.constant,.token.deleted,.token.function-name,.token.number,.token.property,.token.symbol,.token.tag{color:#c92c2c}.token.attr-name,.token.builtin,.token.char,.token.function,.token.inserted,.token.selector,.token.string{color:#2f9c0a}.token.entity,.token.operator,.token.url,.token.variable{color:#a67f59;background:rgba(255,255,255,.5)}.token.atrule,.token.attr-value,.token.class-name,.token.keyword{color:#1990b8}.token.important,.token.regex{color:#e90}.language-css .token.string,.style .token.string{color:#a67f59;background:rgba(255,255,255,.5)}.token.important{font-weight:400}.token.bold{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}.token.namespace{opacity:.7}@media screen and (max-width:767px){pre[class*=language-]:after,pre[class*=language-]:before{bottom:14px;box-shadow:none}}pre[class*=language-].line-numbers.line-numbers{padding-left:0}pre[class*=language-].line-numbers.line-numbers code{padding-left:3.8em}pre[class*=language-].line-numbers.line-numbers .line-numbers-rows{left:0}pre[class*=language-][data-line]{padding-top:0;padding-bottom:0;padding-left:0}pre[data-line] code{position:relative;padding-left:4em}pre .line-highlight{margin-top:0}#custom-ng1-app{height:calc(100% - (41px))}";
        document.head.appendChild(theme);
        const prismCore = document.createElement("script");
        prismCore.innerHTML = "var _self=\"undefined\"!=typeof window?window:\"undefined\"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(e){var n=\/(?:^|\\s)lang(?:uage)?-([\\w-]+)(?=\\s|$)\/i,t=0,r={},a={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(n){return n instanceof i?new i(n.type,e(n.content),n.alias):Array.isArray(n)?n.map(e):n.replace(\/&\/g,\"&amp;\").replace(\/<\/g,\"&lt;\").replace(\/\\u00a0\/g,\" \")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,\"__id\",{value:++t}),e.__id},clone:function e(n,t){var r,i;switch(t=t||{},a.util.type(n)){case\"Object\":if(i=a.util.objId(n),t[i])return t[i];for(var l in r={},t[i]=r,n)n.hasOwnProperty(l)&&(r[l]=e(n[l],t));return r;case\"Array\":return i=a.util.objId(n),t[i]?t[i]:(r=[],t[i]=r,n.forEach((function(n,a){r[a]=e(n,t)})),r);default:return n}},getLanguage:function(e){for(;e;){var t=n.exec(e.className);if(t)return t[1].toLowerCase();e=e.parentElement}return\"none\"},setLanguage:function(e,t){e.className=e.className.replace(RegExp(n,\"gi\"),\"\"),e.classList.add(\"language-\"+t)},currentScript:function(){if(\"undefined\"==typeof document)return null;if(\"currentScript\"in document)return document.currentScript;try{throw new Error}catch(r){var e=(\/at [^(\\r\\n]*\\((.*):[^:]+:[^:]+\\)$\/i.exec(r.stack)||[])[1];if(e){var n=document.getElementsByTagName(\"script\");for(var t in n)if(n[t].src==e)return n[t]}return null}},isActive:function(e,n,t){for(var r=\"no-\"+n;e;){var a=e.classList;if(a.contains(n))return!0;if(a.contains(r))return!1;e=e.parentElement}return!!t}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,n){var t=a.util.clone(a.languages[e]);for(var r in n)t[r]=n[r];return t},insertBefore:function(e,n,t,r){var i=(r=r||a.languages)[e],l={};for(var o in i)if(i.hasOwnProperty(o)){if(o==n)for(var s in t)t.hasOwnProperty(s)&&(l[s]=t[s]);t.hasOwnProperty(o)||(l[o]=i[o])}var u=r[e];return r[e]=l,a.languages.DFS(a.languages,(function(n,t){t===u&&n!=e&&(this[n]=l)})),l},DFS:function e(n,t,r,i){i=i||{};var l=a.util.objId;for(var o in n)if(n.hasOwnProperty(o)){t.call(n,o,n[o],r||o);var s=n[o],u=a.util.type(s);\"Object\"!==u||i[l(s)]?\"Array\"!==u||i[l(s)]||(i[l(s)]=!0,e(s,t,o,i)):(i[l(s)]=!0,e(s,t,null,i))}}},plugins:{},highlightAll:function(e,n){a.highlightAllUnder(document,e,n)},highlightAllUnder:function(e,n,t){var r={callback:t,container:e,selector:\'code[class*=\"language-\"], [class*=\"language-\"] code, code[class*=\"lang-\"], [class*=\"lang-\"] code\'};a.hooks.run(\"before-highlightall\",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),a.hooks.run(\"before-all-elements-highlight\",r);for(var i,l=0;i=r.elements[l++];)a.highlightElement(i,!0===n,r.callback)},highlightElement:function(n,t,r){var i=a.util.getLanguage(n),l=a.languages[i];a.util.setLanguage(n,i);var o=n.parentElement;o&&\"pre\"===o.nodeName.toLowerCase()&&a.util.setLanguage(o,i);var s={element:n,language:i,grammar:l,code:n.textContent};function u(e){s.highlightedCode=e,a.hooks.run(\"before-insert\",s),s.element.innerHTML=s.highlightedCode,a.hooks.run(\"after-highlight\",s),a.hooks.run(\"complete\",s),r&&r.call(s.element)}if(a.hooks.run(\"before-sanity-check\",s),(o=s.element.parentElement)&&\"pre\"===o.nodeName.toLowerCase()&&!o.hasAttribute(\"tabindex\")&&o.setAttribute(\"tabindex\",\"0\"),!s.code)return a.hooks.run(\"complete\",s),void(r&&r.call(s.element));if(a.hooks.run(\"before-highlight\",s),s.grammar)if(t&&e.Worker){var c=new Worker(a.filename);c.onmessage=function(e){u(e.data)},c.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}))}else u(a.highlight(s.code,s.grammar,s.language));else u(a.util.encode(s.code))},highlight:function(e,n,t){var r={code:e,grammar:n,language:t};if(a.hooks.run(\"before-tokenize\",r),!r.grammar)throw new Error(\'The language \"\'+r.language+\'\" has no grammar.\');return r.tokens=a.tokenize(r.code,r.grammar),a.hooks.run(\"after-tokenize\",r),i.stringify(a.util.encode(r.tokens),r.language)},tokenize:function(e,n){var t=n.rest;if(t){for(var r in t)n[r]=t[r];delete n.rest}var a=new s;return u(a,a.head,e),o(e,a,n,a.head,0),function(e){for(var n=[],t=e.head.next;t!==e.tail;)n.push(t.value),t=t.next;return n}(a)},hooks:{all:{},add:function(e,n){var t=a.hooks.all;t[e]=t[e]||[],t[e].push(n)},run:function(e,n){var t=a.hooks.all[e];if(t&&t.length)for(var r,i=0;r=t[i++];)r(n)}},Token:i};function i(e,n,t,r){this.type=e,this.content=n,this.alias=t,this.length=0|(r||\"\").length}function l(e,n,t,r){e.lastIndex=n;var a=e.exec(t);if(a&&r&&a[1]){var i=a[1].length;a.index+=i,a[0]=a[0].slice(i)}return a}function o(e,n,t,r,s,g){for(var f in t)if(t.hasOwnProperty(f)&&t[f]){var h=t[f];h=Array.isArray(h)?h:[h];for(var d=0;d<h.length;++d){if(g&&g.cause==f+\",\"+d)return;var v=h[d],p=v.inside,m=!!v.lookbehind,y=!!v.greedy,k=v.alias;if(y&&!v.pattern.global){var x=v.pattern.toString().match(\/[imsuy]*$\/)[0];v.pattern=RegExp(v.pattern.source,x+\"g\")}for(var b=v.pattern||v,w=r.next,A=s;w!==n.tail&&!(g&&A>=g.reach);A+=w.value.length,w=w.next){var E=w.value;if(n.length>e.length)return;if(!(E instanceof i)){var P,L=1;if(y){if(!(P=l(b,A,e,m))||P.index>=e.length)break;var S=P.index,O=P.index+P[0].length,j=A;for(j+=w.value.length;S>=j;)j+=(w=w.next).value.length;if(A=j-=w.value.length,w.value instanceof i)continue;for(var C=w;C!==n.tail&&(j<O||\"string\"==typeof C.value);C=C.next)L++,j+=C.value.length;L--,E=e.slice(A,j),P.index-=A}else if(!(P=l(b,0,E,m)))continue;S=P.index;var N=P[0],_=E.slice(0,S),M=E.slice(S+N.length),W=A+E.length;g&&W>g.reach&&(g.reach=W);var z=w.prev;if(_&&(z=u(n,z,_),A+=_.length),c(n,z,L),w=u(n,z,new i(f,p?a.tokenize(N,p):N,k,N)),M&&u(n,w,M),L>1){var I={cause:f+\",\"+d,reach:W};o(e,n,t,w.prev,A,I),g&&I.reach>g.reach&&(g.reach=I.reach)}}}}}}function s(){var e={value:null,prev:null,next:null},n={value:null,prev:e,next:null};e.next=n,this.head=e,this.tail=n,this.length=0}function u(e,n,t){var r=n.next,a={value:t,prev:n,next:r};return n.next=a,r.prev=a,e.length++,a}function c(e,n,t){for(var r=n.next,a=0;a<t&&r!==e.tail;a++)r=r.next;n.next=r,r.prev=n,e.length-=a}if(e.Prism=a,i.stringify=function e(n,t){if(\"string\"==typeof n)return n;if(Array.isArray(n)){var r=\"\";return n.forEach((function(n){r+=e(n,t)})),r}var i={type:n.type,content:e(n.content,t),tag:\"span\",classes:[\"token\",n.type],attributes:{},language:t},l=n.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(i.classes,l):i.classes.push(l)),a.hooks.run(\"wrap\",i);var o=\"\";for(var s in i.attributes)o+=\" \"+s+\'=\"\'+(i.attributes[s]||\"\").replace(\/\"\/g,\"&quot;\")+\'\"\';return\"<\"+i.tag+\' class=\"\'+i.classes.join(\" \")+\'\"\'+o+\">\"+i.content+\"<\/\"+i.tag+\">\"},!e.document)return e.addEventListener?(a.disableWorkerMessageHandler||e.addEventListener(\"message\",(function(n){var t=JSON.parse(n.data),r=t.language,i=t.code,l=t.immediateClose;e.postMessage(a.highlight(i,a.languages[r],r)),l&&e.close()}),!1),a):a;var g=a.util.currentScript();function f(){a.manual||a.highlightAll()}if(g&&(a.filename=g.src,g.hasAttribute(\"data-manual\")&&(a.manual=!0)),!a.manual){var h=document.readyState;\"loading\"===h||\"interactive\"===h&&g&&g.defer?document.addEventListener(\"DOMContentLoaded\",f):window.requestAnimationFrame?window.requestAnimationFrame(f):window.setTimeout(f,16)}return a}(_self);\"undefined\"!=typeof module&&module.exports&&(module.exports=Prism),\"undefined\"!=typeof global&&(global.Prism=Prism);"
        document.head.appendChild(prismCore);
        const prismBash = document.createElement("script");
        prismBash.innerHTML = "!function(e){var t=\"\\\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\\\b\",a={pattern:\/(^([\"\']?)\\w+\\2)[ \\t]+\\S.*\/,lookbehind:!0,alias:\"punctuation\",inside:null},n={bash:a,environment:{pattern:RegExp(\"\\\\$\"+t),alias:\"constant\"},variable:[{pattern:\/\\$?\\(\\([\\s\\S]+?\\)\\)\/,greedy:!0,inside:{variable:[{pattern:\/(^\\$\\(\\([\\s\\S]+)\\)\\)\/,lookbehind:!0},\/^\\$\\(\\(\/],number:\/\\b0x[\\dA-Fa-f]+\\b|(?:\\b\\d+(?:\\.\\d*)?|\\B\\.\\d+)(?:[Ee]-?\\d+)?\/,operator:\/--|\\+\\+|\\*\\*=?|<<=?|>>=?|&&|\\|\\||[=!+\\-*\/%<>^&|]=?|[?~:]\/,punctuation:\/\\(\\(?|\\)\\)?|,|;\/}},{pattern:\/\\$\\((?:\\([^)]+\\)|[^()])+\\)|`[^`]+`\/,greedy:!0,inside:{variable:\/^\\$\\(|^`|\\)$|`$\/}},{pattern:\/\\$\\{[^}]+\\}\/,greedy:!0,inside:{operator:\/:[-=?+]?|[!\\\/]|##?|%%?|\\^\\^?|,,?\/,punctuation:\/[\\[\\]]\/,environment:{pattern:RegExp(\"(\\\\{)\"+t),lookbehind:!0,alias:\"constant\"}}},\/\\$(?:\\w+|[#?*!@$])\/],entity:\/\\\\(?:[abceEfnrtv\\\\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})\/};e.languages.bash={shebang:{pattern:\/^#!\\s*\\\/.*\/,alias:\"important\"},comment:{pattern:\/(^|[^\"{\\\\$])#.*\/,lookbehind:!0},\"function-name\":[{pattern:\/(\\bfunction\\s+)[\\w-]+(?=(?:\\s*\\(?:\\s*\\))?\\s*\\{)\/,lookbehind:!0,alias:\"function\"},{pattern:\/\\b[\\w-]+(?=\\s*\\(\\s*\\)\\s*\\{)\/,alias:\"function\"}],\"for-or-select\":{pattern:\/(\\b(?:for|select)\\s+)\\w+(?=\\s+in\\s)\/,alias:\"variable\",lookbehind:!0},\"assign-left\":{pattern:\/(^|[\\s;|&]|[<>]\\()\\w+(?:\\.\\w+)*(?=\\+?=)\/,inside:{environment:{pattern:RegExp(\"(^|[\\\\s;|&]|[<>]\\\\()\"+t),lookbehind:!0,alias:\"constant\"}},alias:\"variable\",lookbehind:!0},parameter:{pattern:\/(^|\\s)-{1,2}(?:\\w+:[+-]?)?\\w+(?:\\.\\w+)*(?=[=\\s]|$)\/,alias:\"variable\",lookbehind:!0},string:[{pattern:\/((?:^|[^<])<<-?\\s*)(\\w+)\\s[\\s\\S]*?(?:\\r?\\n|\\r)\\2\/,lookbehind:!0,greedy:!0,inside:n},{pattern:\/((?:^|[^<])<<-?\\s*)([\"\'])(\\w+)\\2\\s[\\s\\S]*?(?:\\r?\\n|\\r)\\3\/,lookbehind:!0,greedy:!0,inside:{bash:a}},{pattern:\/(^|[^\\\\](?:\\\\\\\\)*)\"(?:\\\\[\\s\\S]|\\$\\([^)]+\\)|\\$(?!\\()|`[^`]+`|[^\"\\\\`$])*\"\/,lookbehind:!0,greedy:!0,inside:n},{pattern:\/(^|[^$\\\\])\'[^\']*\'\/,lookbehind:!0,greedy:!0},{pattern:\/\\$\'(?:[^\'\\\\]|\\\\[\\s\\S])*\'\/,greedy:!0,inside:{entity:n.entity}}],environment:{pattern:RegExp(\"\\\\$?\"+t),alias:\"constant\"},variable:n.variable,function:{pattern:\/(^|[\\s;|&]|[<>]\\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\\s;|&])\/,lookbehind:!0},keyword:{pattern:\/(^|[\\s;|&]|[<>]\\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\\s;|&])\/,lookbehind:!0},builtin:{pattern:\/(^|[\\s;|&]|[<>]\\()(?:\\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\\s;|&])\/,lookbehind:!0,alias:\"class-name\"},boolean:{pattern:\/(^|[\\s;|&]|[<>]\\()(?:false|true)(?=$|[)\\s;|&])\/,lookbehind:!0},\"file-descriptor\":{pattern:\/\\B&\\d\\b\/,alias:\"important\"},operator:{pattern:\/\\d?<>|>\\||\\+=|=[=~]?|!=?|<<[<-]?|[&\\d]?>>|\\d[<>]&?|[<>][&=]?|&[>&]?|\\|[&|]?\/,inside:{\"file-descriptor\":{pattern:\/^\\d\/,alias:\"important\"}}},punctuation:\/\\$?\\(\\(?|\\)\\)?|\\.\\.|[{}[\\];\\\\]\/,number:{pattern:\/(^|\\s)(?:[1-9]\\d*|0)(?:[.,]\\d+)?\\b\/,lookbehind:!0}},a.inside=e.languages.bash;for(var s=[\"comment\",\"function-name\",\"for-or-select\",\"assign-left\",\"parameter\",\"string\",\"environment\",\"function\",\"keyword\",\"builtin\",\"boolean\",\"file-descriptor\",\"operator\",\"punctuation\",\"number\"],o=n.variable[1].inside,i=0;i<s.length;i++)o[s[i]]=e.languages.bash[s[i]];e.languages.sh=e.languages.bash,e.languages.shell=e.languages.bash}(Prism);"
        document.head.appendChild(prismBash);
      }

      let hostname = "";
      async function loadDomains(){
        const data = await fetch("/api/v2/monitor/system/status");
        const body = await data.json();
        hostname = body.results.hostname;
        cliStoppingTokens.push(`${hostname} [#\$]`);
      }

      function loadCSS(url) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        link.type = "text/css";
        document.head.appendChild(link);
      }

      loadPrism()
      await loadDomains()

      // Keywords
      Prism.languages.bash = {
        ...Prism.languages.bash,
        keyword: {
          // Add keywords to list below
          pattern:
            /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while|set)(?=$|[)\s;|&])/,
          lookbehind: true,
        },
      };

      const key = findDirectory();
      loadCSS("/" + key + "/css/legacy-main.css");
      const stateKey = "_cliWS";
      let command = "",it = "";
      const sys_cmd = ["get system status","get system global","get system settings"];
      const arp_cmd = ["get system arp","diag ip arp list"];
      const ntp_cmd = ["show system ntp","diag sys ntp status","diag sys dayst-info"];
      const loading = "<span style=\"padding-top:42vh\"><f-icon class=\"fa-loading icon-xxl\"></f-icon></span>";
      const arrosvg = '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;"><path d="m12.01 9.531-4.25 4.25a.747.747 0 0 1-1.06 0l-.706-.706a.747.747 0 0 1 0-1.06l3.012-3.012-3.012-3.012a.747.747 0 0 1 0-1.06l.703-.712a.747.747 0 0 1 1.06 0l4.25 4.25a.748.748 0 0 1 .002 1.062z"></path></svg></nu-icon>';
      const cmdview = '<nu-icon class="icon" style="margin-left:auto;width:18px;height:14px;transform:rotate(0deg)">'+arrosvg;
      let ws = window[stateKey];
      let active_command;

      function sendCommand(cmd){
        if(ws.readyState == 1){
          ws.send(cmd+" \n")
        }
      }

      function insertAfter(newNode,existingNode){existingNode.parentNode.insertBefore(newNode,existingNode.nextSibling)}

      function formatNtpResponse(messages) {
        if (Array.isArray(messages)) {
          line = messages.map(line => line.trim()).join(" ");
        } else {
          line = messages.split("\n").map(line => line.trim()).join(" ");
        }

        let lines = [];
        const words = line.split(/\s+/).filter(f => f != '');
        let indentLvl = 0;
        let indentStep = "    ";
        for (let i = 0; i < words.length; i += 3) {
          let group = words.slice(i, i + 3).join(" ");
          if (group.indexOf("set") >= 0 && !group.trim().startsWith("set")) {
            const setIdx = group.indexOf("set");
            const newBehind = group.substring(0, setIdx).trim();
            const newFront = group.substring(setIdx).trim();
            group = `${newFront} ${newBehind}`;
          }
          indentLvl = group.startsWith("set") ? 1 : 0;
          lines.push(`${indentStep.repeat(indentLvl)}${group}`);
        }
        return lines.join("\r\n").replace(hostname, "").trim();
      }
      let removedIndices = [];

      function buildTable(message, headersArg=undefined, invisibleHeaders=undefined, contentFunc, lineSplitter=" ", headerSplitter="  ", ){
        let localHeaders = headersArg ?? [];
        removedIndices = [];

        function buildHeader(localHeaders, invisibleHeaders){
          if(localHeaders && localHeaders.length > 0) {
            if(invisibleHeaders && invisibleHeaders.length > 0) {
                localHeaders = localHeaders.filter((header, index) => {
                    if (invisibleHeaders.includes(header)) {
                      removedIndices.push(index);
                      return false; // Exclude the header
                    }
                    return true; // Keep the header
                });
            }
            return '<tr>' + localHeaders.map(d => {
              return '<td style="border:1px solid grey;text-align:center">'+d+'</td>';
            }).join('') + '</tr>'
          }
        }

        function beautifyData(data, contentFunc){
          return data.map(entry => {
            entry = entry.replace("00000000",'<span title="Pseudo state used while an ARP entry is initially created or just before it is removed"><f-icon class="fa-connected"></f-icon>&nbsp;NONE<span>');
            entry = entry.replace("00000001",'<span title="First ARP request sent"><f-icon class="fa-connected"></f-icon>&nbsp;INCOMPLETE</span>');
            entry = entry.replace("00000002",'<span title="ARP response is received"><f-icon class="fa-connected"></f-icon>&nbsp;REACHABLE</span>');
            entry = entry.replace("00000004",'<span title="ARP response is not received within expected time"><f-icon class="fa-custom-action"></f-icon>&nbsp;STALE</span>');
            entry = entry.replace("00000008",'<span title="Schedule ARP request"><f-icon class="fa-clock-plus"></f-icon>&nbsp;DELAY</span>');
            entry = entry.replace("00000010",'<span title="Actively sending ARP requests to try and resolve the address"><f-icon class="fa-clock-plus"></f-icon>&nbsp;PROBE</span>');
            entry = entry.replace("00000020",'<span title="Not managed to resolve ARP within max configured number of probes"><f-icon class="fa-cancel"></f-icon>&nbsp;FAILED</span>');
            entry = entry.replace("00000040",'<span title="Device does not support ARP e.g. IPsec Interface"><f-icon class="fa-dismiss"></f-icon>&nbsp;NOARP</span>');
            entry = entry.replace("00000080",'<span title="Statically configured ARP entry">PERMANENT</span>');

            entry = entry.replace(/[dD]isable/g,'<f-icon class="fa-disabled"></f-icon>&nbsp;<span style="color:silver">Disabled</span>');
            entry = entry.replace(/[nN]ot [aV]vailable/g,'<f-icon class="fa-disabled"></f-icon>&nbsp;<span style="color:silver">Not available</span>');
            entry = entry.replace(/[eE]nable/g,'<f-icon class="fa-enabled"></f-icon>&nbsp;<span>Enabled</span>');
            entry = entry.replace(/[cC]ertified/g,'<f-icon class="fa-enabled"></f-icon>&nbsp;<span>Certified</span>');

            if(contentFunc) return contentFunc(entry);
            return entry;
          })
        }

        function buildContent(message, localHeaders, contentFunc, lineSplitter){
          return message.split("\n").filter(f => f.trim() != "").map((line, index) => {
            let data = line.split(lineSplitter).map(data => data.trim()).filter(data => data != "");;
            if (removedIndices.length > 0) {
              data = data.filter((_, index) => !removedIndices.includes(index));
            }

            if(data.length === 0) return '';
            else if(data.length != (localHeaders.length - removedIndices.length)) {
              return '';

            };

            data = beautifyData(data, contentFunc);

            return '<tr>' + data.map(d => {
              return '<td style="border:1px solid grey;text-align:center">'+d+'</td>';
            }).join('') + '</tr>'
          }).filter(f => f != "").join("\n");
        }

        let headerDOM = buildHeader(localHeaders, invisibleHeaders);
        let contentDOM = buildContent(message, localHeaders, contentFunc, lineSplitter);
        return `${headerDOM}\r\n${contentDOM}`;
      }

      let headers=[];
      function handleMessage(msg, it) {
        const tableMode = ["sys_cmd", "arp_cmd1", "arp_cmd2"].includes(it);
        let tableEl = tableMode ? document.querySelector('table[data-command="' + active_command + '"]') : document.querySelector('code[data-command="' + active_command + '"]');
        let preEl;
        if (!tableEl) {
          if (!tableMode) {
            preEl = document.createElement("pre");
            preEl.classList.add("language-bash");
            preEl.dataset.active = "active";
          }
          tableEl = tableMode ? document.createElement("table") : document.createElement("code");
          tableEl.dataset.command = active_command;
          tableEl.dataset.active = "active";
          tableEl.style.margin = "1rem";
          tableEl.style.display = "block";
          const liEl = document.querySelector('li[data-command="'+active_command+'"]');
          if(!tableMode) {
            preEl.appendChild(tableEl);
            insertAfter(preEl, liEl);
          } else {
            insertAfter(tableEl, liEl);
          }
        }

        if(msg.toLowerCase().includes("Unknown Action".toLowerCase())) {
          tableEl.innerHTML = '<span>Command is not accessible</span>'
          return;
        }

        switch (it) {
          case "sys_cmd":
            headers = ['Key', 'Value']
            tableEl.innerHTML = buildTable(msg, headers, undefined, undefined, ': ');
            break;
          case "arp_cmd1":
            headers = ['IP Address', 'Age(min)', 'MAC Address', 'Interface'];
            tableEl.innerHTML = buildTable(msg, headers);
            break;
          case "arp_cmd2":
            headers = ['Index', 'Interface', 'IP Address', 'MAC Address', 'Status', 'Use', 'Confirm', 'Update', 'Ref']
            invisibleHeaders= ['Index']
            tableEl.innerHTML = buildTable(msg, headers, invisibleHeaders, (line) => line.substring(line.indexOf("=")+1));
            break;
          case "ntp_info":
            tableEl.innerHTML = formatNtpResponse(msg);
            break;
          default:
            tableEl.innerHTML += msg;
            break;
        }

        Prism.highlightAll();
      }

      let currentMessage = "";
      let currentMessageStarted = false;
      let currentMessageStopped = false;
      async function onMessage(evt) {
        // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
        if(ws.bufferedAmount!=0){
          return;
        }
        let txt;
        if ( evt.data instanceof ArrayBuffer ) {
          var bytearray = new Uint8Array( evt.data );
          txt = uintToString(bytearray);
        }
        else {
          txt = await evt.data.text();
        }

        const startingToken = cliStartingTokens.find(token => txt.includes(token));
        const stoppingToken = cliStoppingTokens.find(token => {
          const pattern = new RegExp(token);
          return pattern.test(txt);
        });

        if(startingToken) {
          currentMessage = '';
          currentMessageStarted = true;
          currentMessageStopped = false;
        }

        currentMessage += txt;

        if(currentMessageStarted && !currentMessageStopped && stoppingToken) {
          const responseEvent = new Event('fpCliResponse');
          responseEvent.data = {
            message: currentMessage,
            it: it,
            stoppingToken
          };
          window.dispatchEvent(responseEvent);

          currentMessage = '';
          currentMessageStopped = true;
          currentMessageStarted = false;
        }
      }

      function uintToString(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(encodedString));
        return decodedString;
      }

      function setupWebSocket() {
        const protocol = location.protocol === "https:" ? "wss:" : "ws:";
          const url = protocol+'//'+location.hostname+':'+location.port+'/ws/cli/open?cols=500&rows=500';
        window[stateKey] = ws = new WebSocket(url);
        ws.binaryType = "arraybuffer";
        ws.addEventListener("message", onMessage);
        ws.addEventListener("close", () => (window[stateKey] = null));
      }

      const items = [
        {
          label: "System info",
          content: "",
          script: function (parentEl) {
            if (!ws) {
              setupWebSocket();
            }
            const commandListEl = document.createElement("ul");
            commandListEl.id = "system-info-command-list";

            sys_cmd.forEach((command) => {
              const el = document.createElement("li");
              el.style.marginBottom = "1rem";
              el.style.color = "green";
              el.style.cursor = "pointer";
              el.style.userSelect = 'none';
              el.dataset.command = command;
                el.innerHTML = "&nbsp;"+command+cmdview;
              el.onclick = function () {
                it = "sys_cmd";

                if (!ws) {
                  setupWebSocket();
                } else {
                  const tableEl =
                    this.nextSibling && this.nextSibling.nodeName === "TABLE"
                      ? this.nextSibling
                      : null;
                  const arrwoEl = this.querySelector(".icon");

                  if (!tableEl) {
                    ready = true;
                    const command = el.dataset.command;
                    sendCommand(command);
                    active_command = command;
                    arrwoEl.style.transform = "rotate(90deg)";
                  } else {
                    if (tableEl.dataset.active === "active") {
                      tableEl.dataset.active = "";
                      tableEl.style.display = "none";
                      arrwoEl.style.transform = "rotate(0deg)";
                    } else {
                      tableEl.dataset.active = "active";
                      tableEl.style.display = "block";
                      arrwoEl.style.transform = "rotate(90deg)";
                    }
                  }
                }
              };
              commandListEl.appendChild(el);
            });

            parentEl.innerHTML = "";
            parentEl.style.overflow = "auto";
            parentEl.style.padding = "1.5rem";
            parentEl.appendChild(commandListEl);
          },
        },
        {
          label: "ARP info",
          content: "",
          script: function (parentEl) {
            if (!ws) {
              setupWebSocket();
            }
            const commandListEl = document.createElement("ul");
            commandListEl.id = "system-arp-command-list";

            arp_cmd.forEach((command) => {
              const el = document.createElement("li");
              el.style.marginBottom = "1rem";
              el.style.color = "green";
              el.style.cursor = "pointer";
              el.style.userSelect = 'none';
              el.dataset.command = command;
                el.innerHTML = "&nbsp;"+command+cmdview;
              el.onclick = function () {
                it = "arp_cmd1";
                if (this.innerHTML.substr(6, 4) == "diag") {
                  it = "arp_cmd2";
                }
                if (!ws) {
                  setupWebSocket();
                } else {
                  const tableEl =
                    this.nextSibling && this.nextSibling.nodeName === "TABLE"
                      ? this.nextSibling
                      : null;
                  const arrwoEl = this.querySelector(".icon");

                  if (!tableEl) {
                    ready = true;
                    const command = el.dataset.command;
                    sendCommand(command);

                    active_command = command;
                    arrwoEl.style.transform = "rotate(90deg)";
                  } else {
                    if (tableEl.dataset.active === "active") {
                      tableEl.dataset.active = "";
                      tableEl.style.display = "none";
                      arrwoEl.style.transform = "rotate(0deg)";
                    } else {
                      tableEl.dataset.active = "active";
                      tableEl.style.display = "block";
                      arrwoEl.style.transform = "rotate(90deg)";
                    }
                  }
                }
              };
              commandListEl.appendChild(el);
            });

            parentEl.innerHTML = "";
            parentEl.style.overflow = "auto";
            parentEl.style.padding = "1.5rem";
            parentEl.appendChild(commandListEl);
          },
        },
        {
          label: "Local-in policy",
          content: "",
          script: async function (parentEl) {
              const ip4 = await fetch("/api/v2/cmdb/firewall/local-in-policy");const a4 = await ip4.json();
              const ip6 = await fetch("/api/v2/cmdb/firewall/local-in-policy6");const a6 = await ip6.json();
              const def = await fetch("/api/v2/monitor/firewall/local-in");const df = await def.json();
              const ifs = await fetch("/api/v2/monitor/system/available-interfaces?start=0&view_type=limited");const it = await ifs.json();
            const p = document.createElement("div");
            p.setAttribute("id", "clip");
            var s, t;
            s = t = "<table style='width:100%;padding:0;border-spacing:0;border-collapse:collapse'><tr>";
            if (a4.size === 0 && a6.size === 0) {
              s += "<td style='text-align:center;color:#aaa'>No custom Local-in policy configured.</td></tr>";
            } else {
              u = "<td style='height:37px;text-align:center;background-color:gainsboro;border:1px solid #B9B9B9' colspan='9'>Custom Local-In ";
              v = "Policy<span style='color:#aaa'> &rarr; configured via CLI / API</span></td></tr>";
              w = "<tr style='height:32px;text-align:center;color:#fff;background-color:#5A5A5A;border:1px solid #B9B9B9'><td>&nbsp;#&nbsp;</td><td>Status</td><td>Interface</td><td>Source</td><td>Destination</td><td>Service</td><td>Action</td><td>Schedule</td><td>Comments</td></tr>";
            }
            function IPdo(ver) {
              for (const _ of ver.results) {
                src_ = "";
                for (let i in _.srcaddr) {
                  if (i != 0) { src_ += "<br>"; }
                  if (_["srcaddr-negate"] == "enable") { src_ += '<f-icon class="fa-negate" title="Negated" style="cursor:pointer"></f-icon>&nbsp;'; }
                  src_ += _.srcaddr[i].name;
                }
                dst_ = "";
                for (let j in _.dstaddr) {
                  if (j != 0) { dst_ += "<br>"; }
                  if (_["dstaddr-negate"] == "enable") {
                    dst_ += '<f-icon class="fa-negate" title="Negated" style="cursor:pointer"></f-icon>&nbsp;';
                  }
                    dst_ += _.dstaddr[j].name.replace("all","<f-icon class=\"ftnt-device-fortinet\" title=\"This FortiGate\" style=\"cursor:pointer\"></f-icon>&nbsp;FortiGate (all)");
                }
                svc_ = "";
                for (let k in _.service) {
                  if (k != 0) { svc_ += "<br>"; }
                  if (_["service-negate"] == "enable") { svc_ += '<f-icon class="fa-negate" title="Negated" style="cursor:pointer"></f-icon>&nbsp;'; }
                  svc_ += _.service[k].name;
                }
                s += '<tr style="height:32px;text-align:center"><td style="border:1px solid #E2E2E2">' +
                  _.policyid + '</td><td style="border:1px solid #E2E2E2">' +
                  _.status
                      .replace("enable",'<f-icon class="fa-enabled" title="Enabled" style="cursor:pointer"></f-icon>&nbsp;Enabled')
                      .replace("disable",'<f-icon class="fa-disabled" title="Disabled" style="cursor:pointer"></f-icon>&nbsp;<span style="color:silver">Disabled</span>') +
                  _["ha-mgmt-intf-only"]
                      .replace("enable","<br>HA&nbsp;management&nbsp;interface&nbsp;only")
                    .replace("disable", "") +
                  '</td><td style="border:1px solid #E2E2E2">' +
                    _.intf.replace("any","<f-icon class=\"fa-square-o\" title=\"Any interface\" style=\"cursor:pointer\"></f-icon>&nbsp;any") + '</td><td style="border:1px solid #E2E2E2">' +
                  src_ + '</td><td style="border:1px solid #E2E2E2">' +
                  dst_ + '</td><td style="border:1px solid #E2E2E2">' +
                  svc_ + '</td><td style="border:1px solid #E2E2E2">' +
                    _.action.replace("deny",'<f-icon class="fa-denied" title="Deny" style="cursor:pointer"></f-icon>&nbsp;Deny')
                      .replace("accept",'<f-icon class="fa-accepted" title="Accept" style="cursor:pointer"></f-icon>&nbsp;Accept') +
                  '</td><td style="border:1px solid #E2E2E2">' +
                  _.schedule + '</td><td style="border:1px solid #E2E2E2">' +
                  _.comments + "</td></tr>";
              }
            }
              if (a4.size != 0) { if (a6.size === 0) { s += u + v + w; } else { s += u + "<span style='color:green'>IPv4</span> " + v + w; }
              IPdo(a4)
            }
              if (a6.size != 0) { t += u + "<span style='color:darkviolet'>IPv6</span> " + v + w;
              IPdo(a6)
            }
            f = "</table><br><table style='width:100%;padding:0;border-spacing:0;border-collapse:collapse'><tr><td style='height:37px;text-align:center;background-color:gainsboro;border:1px solid #B9B9B9;border-bottom:0' colspan='7'>Auto Local-In Policy<span style='color:#aaa'> &rarr; managed by FortiGate</span></td></tr>";

            const serviceSortOrder = (name) => {
              switch (name) {
                case "icmp":
                  return 1;
                case "udp":
                  return 2;
                case "tcp":
                  return 3;
                default:
                  return 100;
              }
            };

              f+= '<tr style="height:32px;text-align:center;color:#fff;background-color:#5A5A5A;border:1px solid #B9B9B9"><td>#</td><td>Status</td><td>Source Interface/Zone</td><td>Source</td><td>Destination</td><td>Service</td><td>Action</td></tr>';

              f+= Object.entries(df.results).map(section => {
              const [sectionKey, sectionRules] = section;

              const sectionRulesGroup1 = sectionRules.reduce((r, c) => {
                const f = r.find(ri =>
                  JSON.stringify(ri.from_zone) == JSON.stringify(c.from_zone) &&
                  JSON.stringify(ri.source) == JSON.stringify(c.source) &&
                  ri.action == c.action
                );

                if (f)
                  f.services.push(...c.services);

                  return !f ? [...r, c] : r}, []
              );

                const sectionRulesGroup2 = sectionRulesGroup1.reduce((r, c) => {const f = r.find(ri => JSON.stringify(ri.source) == JSON.stringify(c.source) && JSON.stringify(ri.services) == JSON.stringify(c.services) && ri.action == c.action);

                if (f)
                  f.from_zone.push(...c.from_zone);

                  return !f ? [...r, c] : r}, []
              );

              const sectionRulesGroup3 = sectionRulesGroup2.reduce((r, c) => {
                const f = r.find(ri =>
                  JSON.stringify(ri.from_zone) == JSON.stringify(c.from_zone) &&
                  JSON.stringify(ri.services) == JSON.stringify(c.services) &&
                  ri.action == c.action
                );

                if (f)
                  f.source.push(...c.source);

                  return !f ? [...r, c] : r}, []
              );

              for (const sectionRule of sectionRulesGroup3) {
                sectionRule.services = sectionRule.services.reduce((r, c) => {
                  const fs = r.find(ri =>
                    ri.proto_name == c.proto_name &&
                    ri.dst_port_start == c.dst_port_end + 1
                  );

                  if (fs)
                    fs.dst_port_start = c.dst_port_start;

                  const fe = r.find(ri =>
                    ri.proto_name == c.proto_name &&
                    ri.dst_port_end == c.dst_port_start - 1
                  );

                  if (fe)
                    fe.dst_port_end = c.dst_port_end;

                    return !fs && !fe ? [...r, c] : r}, []
                );

                sectionRule.services.sort((a, b) => {
                  const sr = serviceSortOrder(a.proto_name) - serviceSortOrder(b.proto_name);

                  return sr != 0 ? sr : a.dst_port_start - b.dst_port_start;
                });
              }

              return "".concat(
                '<tr style="height:32px;text-align:center;background-color:gainsboro;border:1px solid #E2E2E2">',
                '<td colspan="7">',
                sectionKey.charAt(0).toUpperCase(),
                sectionKey.slice(1),
                '</td>',
                '</tr>',
                sectionRulesGroup2.map((r, i) => {
                  return "".concat(
                    '<tr style="height:32px;text-align:center">',
                    '<td style="border:1px solid #E2E2E2">', i + 1, '</td>',
                    '<td style="border:1px solid #E2E2E2"><f-icon class="fa-enabled" title="Enabled" style="cursor:pointer"></f-icon>&nbsp;Enabled</td>',
                    '<td style="border:1px solid #E2E2E2; padding: 10px;">',
                    r.from_zone.map(z => {
                      if (z == "any")
                        return "<f-icon class=\"fa-square-o\" title=\"Any interface\" style=\"cursor:pointer\"></f-icon>&nbsp;any";

                      const zi = it.results.find(i => i.name == z);

                            return zi?.alias && zi.alias != z ?
                        "".concat("<f-icon style='padding-right: 3px;' class='" + zi.icon + "'></f-icon>", zi.alias, " (", z, ")") : "".concat("<f-icon style='padding-right: 3px;' class='" + zi.icon + "'></f-icon>", z);
                    }).join("<br>"),
                    '</td>',
                    '<td style="border:1px solid #E2E2E2">',
                    r.source.map(s =>
                      s.start == "0.0.0.0" && s.end == "255.255.255.255" ?
                        "all" : "".concat(s.start, " - ", s.end)
                    ).join("<br>"),
                    '</td>',
                    '<td style="border:1px solid #E2E2E2"><f-icon class="ftnt-device-fortinet" title="This FortiGate" style="cursor:pointer"></f-icon>&nbsp;FortiGate</td>',
                    '<td style="border:1px solid #E2E2E2">',
                    r.services.map(s =>
                      ["ospf", "igmp", "pim"].includes(s.proto_name) ?
                        s.proto_name :
                        s.dst_port_start == s.dst_port_end ?
                          (s.dst_port_start ? "".concat(s.dst_port_start, "/", s.proto_name ?? "Any") : s.proto_name ?? "Any") :
                          "".concat(s.dst_port_start, "-", s.dst_port_end, "/", s.proto_name ?? "Any")
                    ).join("<br>")
                          .replace("ospf","OSPF")
                          .replace("pim","PIM")
                          .replace("igmp","IGMP")
                          .replace("8/icmp","Ping")
                          .replace("13/icmp","Timestamp")
                          .replace("53/udp","DNS (53/udp)")
                          .replace("67/udp","DHCP (67/udp)")
                          .replace("68/udp","DHCP (68/udp)")
                          .replace("123/udp","NTP (123/udp)")
                          .replace("161/udp","SNMP")
                          .replace("500/udp","IKE (ISAKMP)")
                          .replace("520/udp","RIP")
                          .replace("2048/udp","WCCP")
                          .replace("4500/udp","IPsec NAT-T")
                          .replace("22/tcp","SSH")
                          .replace("53/tcp","DNS (53/tcp)")
                          .replace("80/tcp","HTTP")
                          .replace("123/tcp","NTP (123/tcp)")
                          .replace("179/tcp","BGP")
                          .replace("443/tcp","HTTPS")
                          .replace("541/tcp","FortiManager")
                          .replace("1000/tcp","Authd (1000/tcp)")
                          .replace("1003/tcp","Authd (1003/tcp)"),
                    '</td>',
                    '<td style="border:1px solid #E2E2E2">',
                    r.action
                          .replace("drop",'<f-icon class="fa-disable" title="Drop" style="cursor:pointer"></f-icon>&nbsp;Drop')
                          .replace("accept",'<f-icon class="fa-accepted" title="Accept" style="cursor:pointer"></f-icon>&nbsp;Accept'),
                    '</td>',
                    '</tr>'
                  );
                }).join("")
              );
            }).join("");

            f += "</table><br>&nbsp;";
            if (a6.size === 0) { p.innerHTML = s + f; } else {
              if (a4.size === 0) { p.innerHTML = t + f; } else {
                p.innerHTML = s + "</table><br>" + t + f;
              }
            }
            parentEl.innerHTML = "";
            parentEl.style.overflow = "auto";
            parentEl.style.padding = "1.5rem";
            parentEl.appendChild(p);
          },
        },
        {
          label: "NTP info",
          content: "",
          script: async function (parentEl) {
              const time = await fetch('/api/v2/monitor/system/time');const epoch = await time.json();
              const data = await fetch('/api/v2/monitor/system/ntp/status');const ntp=await data.json();
              const cntp = await fetch('/api/v2/cmdb/system/ntp');const ctp=await cntp.json();
              var date = new Date(epoch.results.time*1000);
            const p = document.createElement("div");
            p.setAttribute("id", "pntp");
              let s="<table style='padding:0;border-spacing:0;border-collapse:collapse;display:block'><tr><td style='border:1px solid #ddd;background:#ddd;padding:2px 5px 2px 5px'>NTP Server</td><td style='border:1px solid #ddd;background:#ddd;padding:2px 5px 2px 5px'>IP Address</td><td style='border:1px solid #ddd;background:#ddd;padding:2px 5px 2px 5px;text-align:center'>Version</td><td style='border:1px solid #ddd;background:#ddd;padding:2px 5px 2px 5px;text-align:center'>Reachable</td></tr>";
              for(const _ of ntp.results){s+="<tr><td style='border:1px solid #ddd;padding:2px 5px 2px 5px'>"+_.server+"</td><td style='border:1px solid #ddd;padding:2px 5px 2px 5px'>"+_.ip+"</td><td style='border:1px solid #ddd;padding:2px 5px 2px 5px;text-align:center'>"+_.version+"</td><td style='border:1px solid #ddd;padding:2px 5px 2px 5px;text-align:center'>"+_.reachable+"</td></tr>"}
              s=s.replace(/true/g,'<f-icon class="fa-accepted" title="Reachable" style="cursor:pointer"></f-icon>');
              s=s.replace(/false/g,'<f-icon class="fa-denied" title="Unreachable" style="cursor:pointer"></f-icon>');
              s=s.replace(/undefined/g,'-');
              p.innerHTML = "<span style='color:green'>Current system time:</span><br>"+date+"<br>&nbsp;<br>"+s+"</table><p style=\"white-space:nowrap\">NTP server mode:&nbsp;"+ctp.results["server-mode"].replace(/[eE]nable/g,'<span style="color:green">Enabled</span>').replace(/[dD]isable/g,'<span style="color:pink">Disabled</span>');

            if (!ws) {
              setupWebSocket();
            }
            const commandListEl = document.createElement("ul");
            commandListEl.id = "ntp-sync-command-list";

            ntp_cmd.forEach((command) => {
              const el = document.createElement("li");
              el.style.marginBottom = "1rem";
              el.style.color = "green";
              el.style.cursor = "pointer";
              el.style.userSelect = "none";
              el.dataset.command = command;
              el.innerHTML = "&nbsp;"+command+cmdview;
              el.onclick = function () {
                it = "ntp_info";
                if (this.innerHTML.substr(6, 4) == "diag") {
                  it = "default";
                }
                if (!ws) {
                  setupWebSocket();
                }
                const tableEl =
                  this.nextSibling && this.nextSibling.nodeName === "PRE"
                    ? this.nextSibling
                    : null;
                const arrwoEl = this.querySelector(".icon");

                if (!tableEl) {
                  ready = true;
                  const command = el.dataset.command;
                  sendCommand(command)

                  active_command = command;
                  arrwoEl.style.transform = "rotate(90deg)";
                } else {
                  if (tableEl.dataset.active === "active") {
                    tableEl.dataset.active = "";
                    tableEl.style.display = "none";
                    arrwoEl.style.transform = "rotate(0deg)";
                  } else {
                    tableEl.dataset.active = "active";
                    tableEl.style.display = "block";
                    arrwoEl.style.transform = "rotate(90deg)";
                  }
                }
              };
              commandListEl.appendChild(el);
            });

            parentEl.innerHTML = "";
            parentEl.style.overflow = "auto";
            parentEl.style.padding = "1.5rem";
            parentEl.appendChild(p).appendChild(commandListEl);
          },
        },
        {
          label: "Firewall policy",
          content: "",
          script: async function (parentEl) {
              const data = await fetch("/api/v2/cmdb/firewall/policy?datasource=1");const policy = await data.json();
            const interfaceCall = await fetch(
              "/api/v2/monitor/system/available-interfaces?&vdom=root&view_type=limited"
            );
            const results = await interfaceCall.json();
              const defaultColumnSet = new Set(["status","name","srcintf","dstintf","srcaddr","dstaddr","service","nat","schedule","action","logtraffic"]);

            const columnSet = new Set();

            for (const p of policy.results) {
              const e = Object.entries(p);

              for (const x of e) {
                if (x[1] == null || x[1] == false)
                  continue;

                columnSet.add(x[0]);
              }
            }

            const activeColumnSet = new Set(defaultColumnSet);

            const run = () => {
              const customizerHTML =
                "".concat(
                  '<div id="firewall-policy-customizer" style="display:none;padding:5px;position:absolute;top:75px;left:0;right:0;margin:30px 124px 30px 50px;background-color:white;border:1px solid #000;z-index:1">',
                  '<div style="display:flex;flex-wrap:wrap;gap:5px">',
                  '<button id="firewall-policy-customizer-ok">OK</button>',
                  '</div>',
                  '<div style="display:flex;flex-wrap:wrap;gap:5px">',
                  [...columnSet].map(c => {
                    return "".concat(
                      '<label>',
                      activeColumnSet.has(c) ?
                        '<input type="checkbox" name="firewall-policy-columns" value="' + c + '" checked>' :
                        '<input type="checkbox" name="firewall-policy-columns" value="' + c + '">',
                      c,
                      '</label>'
                    )
                  }).join("")
                  ,
                  '</div>',
                  '</div>'
                );

              const style = document.createElement("style");
              style.innerHTML = ".sticky-table td { border: 1px solid white; } .sticky-table .header td { border-bottom: 0px; }";
              document.head.appendChild(style);
              const tableHTML =
                "".concat(
                  '<button id="firewall-policy-customizer-trigger">Select&nbsp;&rsaquo;</button>',
                  '<button id="firewall-policy-customizer-default" ' + (activeColumnSet.size == defaultColumnSet.size && [...activeColumnSet].every((x) => defaultColumnSet.has(x)) ? 'disabled' : '') + '>Default</button>',
                    '<button id="firewall-policy-customizer-all" ' + (activeColumnSet.size == columnSet.size ? 'disabled' : '') +  '>All</button>',
                  '<div style="width:100%;height:calc(100vh - 95px);overflow:auto">',
                  '<table class="sticky-table" style="margin-bottom:10px;border-spacing: 0;">',
                  '<tr class="sticky-table header" style="position:sticky;top:0;text-align:center;color:#fff;background-color:#5A5A5A;border-spacing:0;border-collapse:collapse;z-index:1">',
                  '<td>',
                  '#',
                  '</td>',
                  [...activeColumnSet].map(c => {
                    return "".concat(
                      '<td style="padding:5px 10px;text-wrap:nowrap">',
                      c,
                      '</td>'
                    )
                  }).join(""),
                  '</tr>',
                  policy.results.map((p, pi) => {
                    const bgColor = pi % 2 ? "rgba(0, 0, 0, .1)" : "rgba(0, 0, 0, .3)";

                    return "".concat(
                      '<tr style="text-align:center;background-color:' + bgColor + '">',
                      '<td style="padding: 0 5px">',
                      (pi + 1),
                      '</td>',
                      [...activeColumnSet].map(c => {
                        let row;
                            if(c == "srcintf" || c == "dstintf") {
                          row = p[c].map(q => {
                            const iface = results.results.find(i => i.name == q.name)
                            const icon = iface.icon;
                                return ("<div style='display: flex;'><f-icon class='" + icon + "'></f-icon><span>" + q.name+"</span></div>")}).join("</br>")
                        }
                        return "".concat(
                          '<td style="padding: 5px">',
                              ["srcintf","dstintf","srcaddr","dstaddr","poolname","service"].includes(c) ?
                                row ? row : p[c].map(q => q["css-class"] ? "<div style='display: flex;'><f-icon class='" + q["css-class"] +"'></f-icon><span>" + q.name + "</span></div>" : q.name).join("<br>") :
                            typeof p[c] == "object" ?
                              (c == "schedule" ? p[c].name : JSON.stringify(p[c])) : p[c],
                          '</td>'
                        )
                          .replace(/[eE]nable/g, '<f-icon class="fa-enabled"></f-icon>&nbsp;Enabled')
                          .replace(/[dD]isable/g, '<f-icon class="fa-disabled"></f-icon>&nbsp;Disabled')
                          .replace(/[aA]ccept/g, '<f-icon class="fa-accepted"></f-icon>&nbsp;Accept')
                      }).join(""),
                      '</tr>'
                    )
                  }).join(""),
                  '<tr>',
                  '<td colspan="' + (activeColumnSet.size + 1) + '" style="text-align:center;color:lightgray">',
                  'Implicit deny of all connections which are not allowed by the rules above.',
                  '</td>',
                  '</tr>',
                  '</table>',
                  '</div>'
                );

              const p = document.createElement("div");
              p.setAttribute("id", "fwpol");
              p.innerHTML = "".concat(customizerHTML, tableHTML);

              parentEl.innerHTML = "";
              parentEl.style.overflow = "auto";
              parentEl.style.padding = "1.5rem";
              parentEl.appendChild(p);

              document.getElementById("firewall-policy-customizer-trigger").addEventListener("click", () => {
                document.getElementById("firewall-policy-customizer").style.display = "block";
              });

              document.getElementById("firewall-policy-customizer-ok").addEventListener("click", () => {
                const ces = document.getElementsByName("firewall-policy-columns");

                activeColumnSet.clear();

                for (const ce of ces) {
                  if (!ce.checked)
                    continue;

                  activeColumnSet.add(ce.value);
                }

                run();
              });

              document.getElementById("firewall-policy-customizer-default").addEventListener("click", () => {
                activeColumnSet.clear();

                for (const defaultColumn of defaultColumnSet)
                  activeColumnSet.add(defaultColumn);

                run();
              });

              document.getElementById("firewall-policy-customizer-all").addEventListener("click", () => {
                activeColumnSet.clear();

                for (const column of columnSet)
                  activeColumnSet.add(column);

                run();
              });
            };

            run();
          }
        }
      ];

      const t = document.querySelector("nu-nav-entry");
      const n = document.createElement("li");
      n.style.listStyle = "none";
      n.style.cursor = "pointer";
      n.id = "tools";
        n.innerHTML = '<div id="menu-toggle" style="position:relative;color:#000;background-color:goldenrod;margin:0;padding:4px 4px 1px 5px;border-left:3px solid #ffd700;display:flex;"><f-icon class="ftnt-webhook icon-lg"></f-icon>&nbsp;Tools<nu-icon class="icon" style="margin-left:auto;width:18px;height:18px;transform:rotate(90deg)">'+arrosvg+'</div>';
        n.addEventListener("mousedown", (event) => {event.preventDefault()}); // Prevent text selection
      t.before(n);

      document.addEventListener("click", function (event) {
        const closestMenuItem = event.target.closest("a.menu-label");
        if (closestMenuItem) {
          const menuEl = document.getElementById("custom-menu");
          const menuItems = menuEl.getElementsByTagName("li");
          for (let i = 0; i < menuItems.length; i++) {
            let child = menuItems[i];
            child.dataset.active = "";
            child.style.backgroundColor = "#FFD700";
          }
          const parent = document.getElementById("ng1-app").parentElement;
          const children = parent.children;
          for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.id !== "custom-ng1-app") {
              child.setAttribute("style", "");
            }
          }
          const elementToDelete = document.getElementById("custom-ng1-app");
          if (elementToDelete) {
            elementToDelete.parentNode.removeChild(elementToDelete);
          }
        }
      });

      let isMenuOpen = true;

      const menuEl = document.createElement("ul");
      menuEl.id = "custom-menu";
      menuEl.style.margin = 0;
      menuEl.style.padding = 0;

      async function handleMenuItemClick(item) {
        const activeElement = document.querySelector("nu-nav-entry.active");
        if (activeElement) {
          activeElement.classList.remove("active");
        }

        let o;
        const ngApp = document.getElementById("ng1-app");
        let resultEl = document.getElementById("custom-ng1-app");
        if (!resultEl) {
          resultEl = document.createElement("div");
          resultEl.id = "custom-ng1-app";
          resultEl.className = "ng1 ng-tns-c49-0 ng-scope";
        }
        ngApp.parentElement.insertBefore(resultEl, ngApp);
          o = item.content;

        resultEl.style.width = "calc(100% - 3rem)";
        resultEl.innerHTML = "".concat('<div style="position:relative;overflow-y:auto"><pre style="padding:1em;margin:0;display:flex"><code style="width:100%; display:flex; justify-content:center">', o || loading, '</code></pre></div>');
        const parent = ngApp.parentElement;
        const children = parent.children;
        for (let i = 0; i < children.length; i++) {
          let child = children[i];
          if (child.id !== "custom-ng1-app") {
            child.style.display = "none";
          }
        }
        item.script?.(resultEl);
      }

      items.forEach((item, i) => {
        const itemEl = createMenuItem();
        itemEl.innerText = item.label;

        itemEl.onclick = async function () {
          const menuItems = menuEl.querySelectorAll("li");
          menuItems.forEach((menuItem) => {
            menuItem.dataset.active = "";
            menuItem.style.backgroundColor = "#FFD700";
          });
          this.dataset.active = "active";
          await handleMenuItemClick(item);
          this.style.backgroundColor = "#FFE86D";
        };
        menuEl.appendChild(itemEl);
      });
      const toggleEl = document.querySelector("#tools #menu-toggle");
      const iconEl = toggleEl.querySelector(".icon");
      toggleEl.after(menuEl);
      toggleEl.onclick = () => {
        if (isMenuOpen) {
          menuEl.style.display = "none";
          iconEl.style.transform = "rotate(0deg)";
          isMenuOpen = false;
        } else {
          menuEl.style.display = "block";
          iconEl.style.transform = "rotate(90deg)";
          isMenuOpen = true;
        }
      };
    })();