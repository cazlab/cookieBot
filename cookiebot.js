// ==UserScript==
// @name         Cookie bot
// @namespace    cookiebot
// @description  cookiebot
// @include      http://orteil.dashnet.org/cookieclicker/
// @include      orteil.dashnet.org/cookieclicker/
// @updateURL    
// @run-at       document-end
// @grant        none
// @version      0.1
// ==/UserScript== 

(function () {
    var options = {
        panelId: 'cookie-bot',
        intervalDelay: 1,
        timeMachineWaitThreshold: 0.03,
        buttons: {
            'showGoldenCookieDelay': {
                label: 'Display Golden Cookie Delay In Title',
                action: function () {
                    toggleAutoAction('showGoldenCookieDelay', function () {
                        document.title = '(' + Math.floor(Game.goldenCookie.delay / Game.fps) + ' s) ' + Beautify(Game.cookies) + ' ' + (Game.cookies == 1 ? 'cookie' : 'cookies')
                    })
                }
            },
            'showMetaStats': {
                label: 'Show Meta Stats',
                action: function () {
                        if (document.getElementById("metaStats")) {
                            toggleAutoAction('showMetaStats', function () { addMetaStats(); });
                            document.getElementById("metaStats").remove();
                        }
                        else { 
                            toggleAutoAction('showMetaStats', function () { addMetaStats(); });
                        }
                }
            },
            'runBot': {
                label: 'Run Bot',
                action: function () {
                    toggleAutoAction('runBot', function () {

                        /* auto-click big cookie and spawn/auto-click golden cookie after getting neverclick achieve
                           do no more than 15 times just to get the rapid clicker achieve */
                        if(Game.cookiesEarned >= 1000000001) {
                        	for(var i=0; i < 15; i++)
                                Game.ClickCookie();
                        }  

                        //if we want, otherwise just wait a few minutes for a golden cookie 
                        Game.goldenCookie.click();  // do this and click any that appear

                        var timeMachine; //= Game.ObjectsById[Game.ObjectsById.length - 2];
                        for (var i in Game.ObjectsById) {
                            var building = Game.ObjectsById[i];
                            if(building.name == "Time machine") {
                                timeMachine = Game.ObjectsById[i];
                            }
                        }
                        
                        // buy  upgrades if they are available in store
                        if (Game.UpgradesInStore.length > 0) {
                            Game.UpgradesInStore[0].buy();
                        }

                        //now to buy buildings other than cursors
                        for (var i in Game.ObjectsById) {
                            var building = Game.ObjectsById[i];
                            if(building.price < (timeMachine.price * options.timeMachineWaitThreshold)) {
                                console.log(building.cps);
                                //alert("coefficient: "+ options.timeMachineWaitThreshold+"   price: "+building.price+ "      threshold: " + (timeMachine.price * options.timeMachineWaitThreshold));
                                building.buy();
                                //return;
                            }
                        }
                        //always buy a time machine if able
                        timeMachine.buy();
                    })
                }
            },
        }
    };

    addStyleSheet();
    addPanel();
    for (var name in options.buttons) {
        if (!options.buttons[name]) {
            return;
        }
        addButton(name, options.buttons[name].label, options.buttons[name].action);
    }

    function autoAction(name, action) {
        if (!options.buttons[name]) {
            return;
        }
        options.buttons[name].interval = setInterval(action, options.intervalDelay);
    }
    function stopAutoAction(name) {
        clearInterval(options.buttons[name].interval);
    }

    function toggleAutoAction(name, action) {
        if (!options.buttons[name].on) {
            autoAction(name, action);
            options.buttons[name].on = true;
            options.buttons[name].element.className = 'active';
        } else {
            stopAutoAction(name);
            options.buttons[name].on = false;
            options.buttons[name].element.className = '';
        }
    }

    function addPanel() {
        if (document.getElementById(options.panelId)) {
            document.getElementById(options.panelId).remove();
        }
        options.panel = document.createElement("div");
        options.panel.id = options.panelId;
        document.body.appendChild(options.panel);
    }

    function addButton(name, label, action) {
        if (!options.buttons[name]) {
            return;
        }
        options.buttons[name].element = document.createElement('button');
        options.buttons[name].element[(typeof document.body.style.WebkitAppearance == "string") ? "innerText" : "innerHTML"] = label;
        options.buttons[name].element.addEventListener('click', action);
        options.panel.appendChild(options.buttons[name].element);
    }

    function addMetaStats() {
        //nneds to: actually collect meta-stats
        if (document.getElementById("metaStats")) {
            document.getElementById("metaStats").remove();
        }
        options.metastats = document.createElement('div');
        options.metastats.id = "metaStats";
		//.element[(typeof document.body.style.WebkitAppearance == "string") ? "innerText" : "innerHTML"] 
        options.metastats.innerHTML
		= "<span><b>Primary Stats:</b></span><br/>"
		+ "<span>All Time Cookies: " + Game.cookiesEarned + "</span><br/>"
		+ "<span>Cookies Per Second: " + Game.cookiesPs + "</span><br/>"

		+ "</br><span><b>Meta Stats:</b></span><br/>"
		+ "<span>Total Cookies Generated: " + Game.cookiesEarned + "</span><br/>"
		+ "<span>Current Cookies Per Second Increase Per Second: " + Game.cookiesEarned + "</span><br/>"
		+ "<span>Average Cookies Per Second Increase Per Second: " + Game.cookiesEarned + "</span><br/>"
		;
        
        document.getElementById(options.panelId).appendChild(options.metastats);
    }

    function addStyleSheet() {
        var stylesClassName = options.panelId + '-styles';
        var styles = document.getElementsByClassName(stylesClassName);
        if (styles.length <= 0) {
            styles = document.createElement('style');
            styles.type = 'text/css';
            styles.className += ' ' + stylesClassName;
            document.body.appendChild(styles);
        }
        var css = '#' + options.panelId + '{position:fixed;top:0;right:0;background:#fff;color:#000;padding:5px;z-index:9999;}#' + options.panelId + ' button{margin-left: 5px;}#' + options.panelId + ' button.active:after{content:"*";color:red;}';
        styles[(typeof document.body.style.WebkitAppearance == "string") ? "innerText" : "innerHTML"] = css;
    }

//var goldenCookieRawSound = "http://dc144.4shared.com/img/926529133/bd50c11b/dlink__2Fdownload_2FiEhv4VrW_3Ftsid_3D20130907-80140-a0150fa0/preview.mp3";

//var theSound = new Audio(goldenCookieRawSound);

})();