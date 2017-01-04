(function () {
    var messages = [
        "sniffing around",
        "getting focused",
        "finding assets",
        "pulling posts",
        "importing your details",
        "gathering photos",
        "reviewing reviews",
        "tidying up a bit",
        "pondering it all",
        "some housecleaning",
        "sifting through it",
        "picking your colors",
        "selecting your typography",
        "building your sections",
        "distilling your essence",
        "concentrating...",
        "implementing genius",
        "doing smart stuff",
        "connecting the dots",
        "feeding the unicorns",
        "finalizing details"
    ];
    var whiteCheckmarkIdPrefix = "defaultSplash-whiteCheckSVG-";
    var checkmarkCircleIdPrefix = "defaultSplash-checkCircleSVG-";
    var phraseIdPrefix = "defaultSplash-phraseText-";
    var verticalSpacing = 90;
    var secondsPerSlide = 1.5;
    
    

    this.AsanaStyleLoader = function () {
        var container = null;

        if (arguments[0] && typeof arguments[0] === "string") {
            container = document.getElementById(arguments[0]);
            if (container.classList) {
                container.classList.add("scrolling-text");
            } else {
                container.className += ' ' + "scrolling-text";
            }
            var phrasesDiv = document.createElement('div');
            phrasesDiv.id = "defaultSplash-phrases";

            var gradient = document.createElement('div');
            gradient.id = "scrolling-text-gradient";

            container.appendChild(phrasesDiv);
            container.appendChild(gradient);
        }

        if (arguments[1] && typeof arguments[1] === "object") {
            var params = arguments[1];
            if (params.messages && Array.isArray(params.messages)) {
                messages = params.messages;
            }
            if(params.verticalSpacing && isNumeric(params.verticalSpacing)){
                verticalSpacing = params.verticalSpacing;
            }
            
            if(params.secondsPerSlide && isNumeric(params.secondsPerSlide)){
                secondsPerSlide = params.secondsPerSlide;
            }

        }

        splash_loading_messages = messages;
        phrases = shuffleArray(getPhrases());
        while (phrases.length > 0 && phrases.length < 70) {
            phrases = phrases.concat(phrases);
        }

        if (container) {
            initializeLoading();
        } else {
            console.error("AsanaStyleText: container not found.")
        }
    }

    function initializeLoading() {
        addPhrasesToDocument(phrases);

        function getBrowser() {
            var N = navigator.appName, ua = navigator.userAgent, tem;
            var M = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);

            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
                M[2] = tem[1];
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

            return M[0];
        }

        var browser = getBrowser();
        if (browser === "MSIE" || browser === "Trident") {
            /**
             * IE doesn't support animations on SVG elements, so we manually animate
             * the upwards scroll.
             */
            var upward_moving_group = document.getElementById("defaultSplash-phrases");
            upward_moving_group.currentY = 0;
            var last_time = new Date().getTime();

            function manuallyAnimateLoading() {
                var current_time = new Date().getTime();
                upward_moving_group.setAttribute("transform",
                        "translate(0 " + upward_moving_group.currentY + ")");
                upward_moving_group.currentY -= verticalSpacing * (current_time - last_time) / (1000 * secondsPerSlide);
                if (upward_moving_group.currentY > -phrases.length * verticalSpacing) {
                    requestAnimationFrame(manuallyAnimateLoading);
                }
                last_time = current_time;
            }

            manuallyAnimateLoading();
        }

        generateKeyframeCSS(phrases.length);

        var fontTimeout;


        function removeDefaultSplash() {
            var default_splash = document.getElementById("loading_screen");
            if (fontTimeout) {
                window.clearTimeout(fontTimeout);
            }
            if (default_splash.className.contains("defaultSplash--displayNone")) {
                return;
            }
            default_splash.className = default_splash.className + " defaultSplash--displayNone"
        }

        //AsanaStyleText.prototype.stop = removeDefaultSplash;

        /**
         * Transition to the app once it loads. Apparently this doesn't detect if
         * LunaUI is completely loaded, but it should be good enough. After we fade
         * out remove the loader from the dom so as to prevent any possible breakage
         * via covering the entire app with a transparent screen.
         */
        (function fadeOutOnUILoaded() {
            if (document.getElementById("asana_main") !== null) {
                var default_splash = document.getElementById("loading_screen");
                default_splash.className =
                        default_splash.className + " defaultSplash--fadeOutLoading";

                default_splash.addEventListener("animationend", removeDefaultSplash,
                        false);
                // Safety so that even if animation end doesn't fire we still hide.
                window.setTimeout(removeDefaultSplash, 1000);
            } else {
                window.setTimeout(fadeOutOnUILoaded, 100);
            }
        })();
    }



    function getPhrases() {
        // #LoadingMessages
        // These are just fallback messages in case our cluster config yields
        // no messages for some reason.
        var default_phrases = [];
        // Ensure compatibility to where we don't have the messages embedded in
        // a variable, and ensure we always have a default set of phrases even
        // if somehow cluster config yields an empty set.
        var custom_phrases = window.splash_loading_messages;
        if (custom_phrases && custom_phrases.length > 0) {
            return custom_phrases;
        } else {
            return default_phrases;
        }
    }

    function shuffleArray(array) {
        return array;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function createSVG(tag, properties, opt_children) {
        var newElement = document.createElement(tag);
        for (prop in properties) {
            newElement.setAttribute(prop, properties[prop]);
        }
        if (opt_children) {
            opt_children.forEach(function (child) {
                newElement.appendChild(child);
            })
        }
        return newElement;
    }

    function createPhraseText(phrase, index, yOffset) {
        var text = createSVG("div", {
            id: phraseIdPrefix + index,
            class: 'splash-text check-green'
        });
        text.appendChild(document.createTextNode(phrase + "..."));
        return text;
    }

    function addPhrasesToDocument(phrases) {
        phrases.forEach(function (phrase, index) {
            var yOffset = 30 + verticalSpacing * index;
            document.getElementById("defaultSplash-phrases").appendChild(createPhraseText(phrase, index, yOffset));
        });
    }

    /**
     * We generate the css for keyframes in javascript in order to
     * 1. Minimize page load time (with many phrases these take up many lines)
     * 2. Scale appropriately as phrases are added/removed.
     * 3. Make everything well factored. This could be done in sass (loops) but
     * would then require an additional build step. (And we'd have to maintain
     * consistency in the phrase count between the two.)
     */
    function generateKeyframeCSS(num_keyframes) {
        var generated_keyframes_style = document.createElement("style");
        generated_keyframes_style.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(generated_keyframes_style);
        function enumerateSlideUpKeyframes() {
            var style = "";
            for (var i = 0; i < num_keyframes + 1; i++) {
                style += "\
        " + (i * 100 / num_keyframes) + "% {\
            -webkit-transform: translateY(-" + (verticalSpacing * i) + "px);\
                    transform: translateY(-" + (verticalSpacing * i) + "px);\
        } ";
            }
            return style;
        }

        function enumerateFadeKeyframes() {
            var style = "";
            for (var i = 0; i < num_keyframes + 1; i++) {
                style += "#" + checkmarkCircleIdPrefix + i + " { \
      animation: fade-opacity-in 5000ms;\
      animation-delay: " + ((i - 1.5) * secondsPerSlide) + "s;\
      opacity: 0;\
    }";
                style += "#" + whiteCheckmarkIdPrefix + i + " { \
      animation: fade-opacity-in 5000ms;\
      animation-delay: " + ((i - 1.5) * secondsPerSlide) + "s;\
    }";
            }
            return style;
        }

        var animation_duration = secondsPerSlide * num_keyframes;
        var slide_up_keyframes = enumerateSlideUpKeyframes();
        var style_rule = "@-webkit-keyframes slide-phrases-upward { " + slide_up_keyframes + " }" +
                "@keyframes slide-phrases-upward { " + slide_up_keyframes + " }";
        style_rule += " #defaultSplash-phrases {\
  -webkit-animation: slide-phrases-upward " + animation_duration + "s;\
          animation: slide-phrases-upward " + animation_duration + "s;\
}";
        style_rule += enumerateFadeKeyframes();
        generated_keyframes_style.innerHTML = style_rule;
    }

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

}());




