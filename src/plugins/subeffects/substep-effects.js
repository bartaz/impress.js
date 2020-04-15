/**
 * Substep effects Plugin
 *
 * This plugin will do the following things:
 *
 *  - The plugin adds the effects for the substeps. 
 * 
 *      When an object with class substep uses one of the following attributes, the value of these attributes
 *      indicate the objects that are subjected to some effectes:
 * 
 *      - data-show-only = "CLASS" : The objects with class="CLASS" are shown only in the corresponding substep.
 * 
 *      - data-hide-only = "CLASS" : The objects with class="CLASS" are hidden only in the corresponding substep.
 * 
 *      - data-show-from = "CLASS" : The objects with class="CLASS" are shown from the corresponding substep until the end or "data-show-to".
 *      - data-show-to = "CLASS" : It is used with "data-show-from", the objects with class="CLASS" are shown 
 *          from the substep with "data-show-from" to the corresponding substep.
 * 
 *      - data-hide-from = "CLASS" : The objects with class="CLASS" are hidden from the corresponding substep until the end or "data-hide-to".
 *      - data-hide-to = "CLASS" : It is used with "data-hide-from", the objects with class="CLASS" are hidden 
 *          from the substep with "data-hide-from" to the corresponding substep. 
 *      
 *      When an object with class substep uses one of the following attributes, the value of these attributes
 *      indicate the css style to apply to a certain class. 
 *      In particular:
 * 
 *      - data-style-only-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css style="STYL_LIST" only in the corresponding substep.
 * 
 *      - data-style-from-CLASS = "STYLE_LIST" : Apply to objects with class=CLASS the css style="STYL_LIST" from the corresponding substep 
 *          until the end or "data-syle-to-CLASS".
 *      - data-style-to-CLASS = "STYLE_LIST" : It is used with "data-syle-from-CLASS", the objects with class="CLASS" are setted to style="" or
 *          if "data-style-base='LIST_STYLE_BASE'" is configured in the object with class=CLASS the style is setted to style="LIST_STYLE_BASE".
 *      
 *      Some examples of all these features are presented in the file example.html
 * 
 *
 * Copyright 2020 Gastone Pietro Rosati Papini (@tonegas) 
 * http://tonegas.com
 * Released under the MIT license.
 */

(function(document) {
    "use strict";
    var slide_from = null;
    /* Function for resetting the css attributes */
    function reset_css(sub_el){
        for (var i = 0, atts = sub_el.attributes, n = atts.length, names = []; i < n; i++) {
            /* Find all objects that are referred by "data-style-only" */
            let len_str = "data-style-only".length;
            if ("data-style-only" === atts[i].nodeName.substring(0, len_str)) {
                document.querySelectorAll(
                    "." + atts[i].nodeName.substring(len_str+1)
                ).forEach(to_show => {
                    /* Set style to "" or set style to "data-style-base" */
                    to_show.setAttribute("style", "");
                    if (to_show.getAttribute("data-style-base")) {
                        to_show.setAttribute("style",to_show.getAttribute("data-style-base"));
                    }
                });
            }
            /* Find all objects that are referred by "data-style-from" */
            len_str = "data-style-from".length;
            if ("data-style-from" === atts[i].nodeName.substring(0, len_str)) {
                document.querySelectorAll(
                    "." + atts[i].nodeName.substring(len_str+1)
                ).forEach(to_show => {
                    /* Set style to "" or set style to "data-style-base" */
                    to_show.setAttribute("style", "");
                    if (to_show.getAttribute("data-style-base")) {
                        to_show.setAttribute("style",to_show.getAttribute("data-style-base"));
                    }
                });
            }
        }
    }

    document.addEventListener("impress:stepenter", function(event) {
        /* It is used when I start from a slide (F5 - refesh) */
        event.target.querySelectorAll(".substep").forEach(sub_el => {
            /* Hide from the beginning all elements that are referred by "data-show-only" and  "data-show-from"*/
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-only") + "," +
                "." + sub_el.getAttribute("data-show-from")
            ).forEach(to_show => {
                to_show.style.opacity = 0;
            });
            /* Show from the beginning all elements that are referred by "data-hide-only" and "data-hide-from" */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-hide-only") + "," +
                "." + sub_el.getAttribute("data-hide-from")
            ).forEach(to_show => {
                to_show.style.opacity = 1;
            });
            /* Set the base css attribute to the objects */
            reset_css(sub_el);
        });
        /* Reset the of the objects that are modified to the default */
        /* It is useful when I show element of other slide */
        if (slide_from !== null) {
            slide_from.querySelectorAll(".substep").forEach(sub_el => {
                /* Reset opacity */
                document.querySelectorAll(
                    "." + sub_el.getAttribute("data-show-only") + "," +
                    "." + sub_el.getAttribute("data-hide-only") + "," +
                    "." + sub_el.getAttribute("data-show-from") + "," +
                    "." + sub_el.getAttribute("data-hide-from")
                ).forEach(to_show => {
                    to_show.style.opacity = "";
                });
                /* Set the base css attribute to the objects */
                reset_css(sub_el);
            });
        }
    }, false);


    function sub_effects(event) {
        /* Reset all condition at each substep */
        event.target.querySelectorAll(".substep:not(.substep-active)").forEach(sub_el => {
            /* Hide all elements are referred by "data-show-only" and "data-show-from" in all substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-only") + "," +
                "." + sub_el.getAttribute("data-show-from")
            ).forEach(to_show => {
                to_show.style.opacity = 0;
                to_show.style.transition = "opacity 1s";
            });
            /* Show all elements are referred by "data-hide-only" and "data-hide-from" in all substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-hide-only") + "," +
                "." + sub_el.getAttribute("data-hide-from")
            ).forEach(to_show => {
                to_show.style.opacity = 1;
                to_show.style.transition = "opacity 1s";
            });
            /* Set the base css attribute to the objects */
            if (event.type === "impress:substep:stepleaveaborted") {
                reset_css(sub_el);
            }
        });
        /* Active the condition of the each visible substep */
        event.target.querySelectorAll(".substep.substep-visible").forEach(sub_el => {
            /* Show the elements that are referred between "data-show-from" and "data-show-to" */
            /* Hide the elements that are referred between "data-hide-from" and "data-hide-to" */
            /* Show all elements that are referred by "data-show-from" or "data-show-to"  in the visible substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-from") + "," +
                "." + sub_el.getAttribute("data-hide-to")
            ).forEach(to_show => {
                to_show.style.opacity = 1;
                to_show.style.transition = "opacity 1s";
            });
            /* Hide all elements that are referred by "data-show-to" or "data-hide-from" in the visible substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-to") + "," +
                "." + sub_el.getAttribute("data-hide-from")
            ).forEach(to_show => {
                to_show.style.opacity = 0;
                to_show.style.transition = "opacity 1s";
            });
            /* Apply the css attribute to the objects referred by "data-style-from" */ 
            for (var i = 0, atts = sub_el.attributes, n = atts.length, names = []; i < n; i++) {
                /* The css attribute are applied from the substep with "data-style-from" to the substep with "data-style-to" */
                let len_str = "data-style-from".length;
                if ("data-style-from" === atts[i].nodeName.substring(0, len_str)) {
                    document.querySelectorAll(
                        "." + atts[i].nodeName.substring(len_str+1)
                    ).forEach(to_show => {
                        to_show.setAttribute("style", atts[i].value);
                    });
                }
                len_str = "data-style-to".length;
                if ("data-style-to" === atts[i].nodeName.substring(0, len_str)) {
                    document.querySelectorAll(
                        "." + atts[i].nodeName.substring(len_str+1)
                    ).forEach(to_show => {
                        /* Set style to "" or set style to "data-style-base" */
                        to_show.setAttribute("style", "");
                        if (to_show.getAttribute("data-style-base")) {
                            to_show.setAttribute("style",to_show.getAttribute("data-style-base"));
                        }
                    });
                }
            }
        });
        /* Active the condition of the active substep */
        event.target.querySelectorAll(".substep.substep-active").forEach(sub_el => {
            /* Show all elements that are referred by "data-show-only", "data-show-from" or "data-hide-to" in the active substep */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-only") + "," +
                "." + sub_el.getAttribute("data-show-from") + "," +
                "." + sub_el.getAttribute("data-hide-to")
            ).forEach(to_show => {
                to_show.style.opacity = 1;
                to_show.style.transition = "opacity 1s";
            });
            /* Hide all elements that are referred by "data-hide-only", "data-show-to" or "data-hide-from" in the active substep */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-hide-only") + "," +
                "." + sub_el.getAttribute("data-show-to") + "," +
                "." + sub_el.getAttribute("data-hide-from")
            ).forEach(to_show => {
                to_show.style.opacity = 0;
                to_show.style.transition = "opacity 1s";
            });
            
            for (var i = 0, atts = sub_el.attributes, n = atts.length, names = []; i < n; i++) {
                /* Apply the css attribute to the objects referred by "data-style-only" */ 
                let len_str = "data-style-only".length;
                if ("data-style-only" === atts[i].nodeName.substring(0, len_str)) {
                    document.querySelectorAll(
                        "." + atts[i].nodeName.substring(len_str+1)
                    ).forEach(to_show => {
                        to_show.setAttribute("style", atts[i].value);
                    });
                }
                /* Apply the css attribute to the objects referred  by "data-style-from" */ 
                len_str = "data-style-from".length;
                if ("data-style-from" === atts[i].nodeName.substring(0, len_str)) {
                    document.querySelectorAll(
                        "." + atts[i].nodeName.substring(len_str+1)
                    ).forEach(to_show => {
                        to_show.setAttribute("style", atts[i].value);
                    });
                }
                /* Reset the css attribute to the objects referred  by "data-style-to" */ 
                len_str = "data-style-to".length;
                if ("data-style-to" === atts[i].nodeName.substring(0, len_str)) {
                    document.querySelectorAll(
                        "." + atts[i].nodeName.substring(len_str+1)
                    ).forEach(to_show => {
                        /* Set style to "" or set style to "data-style-base" */
                        to_show.setAttribute("style", "");
                        if (to_show.getAttribute("data-style-base")) {
                            to_show.setAttribute("style",to_show.getAttribute("data-style-base"));
                        }
                    });
                }
            }
        });
    }

    let elementsArray = document.querySelectorAll(".step");
    elementsArray.forEach(function(elem) {
        /* At each substep */
        elem.addEventListener("impress:substep:enter", sub_effects, false);
        elem.addEventListener("impress:substep:stepleaveaborted", sub_effects, false);
    });

    document.addEventListener("impress:stepleave", function(event) {
        /* Save the step has to be reset when I enter in the new step */
        slide_from = event.target;
        /* Effect to be set-up before entering in the step */
        event.detail.next.querySelectorAll(".substep").forEach(sub_el => {
            /* Hide all elements are referred by "data-show-only" and "data-show-from" in all substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-show-only") + "," +
                "." + sub_el.getAttribute("data-show-from")
            ).forEach(to_show => {
                to_show.style.opacity = 0;
                to_show.style.transition = "";
            });
            /* Show all elements are referred by "data-hide-only" or "data-hide-only" in all substeps */
            document.querySelectorAll(
                "." + sub_el.getAttribute("data-hide-only") + "," +
                "." + sub_el.getAttribute("data-hide-from")
            ).forEach(to_show => {
                to_show.style.transition = "";
                to_show.style.opacity = 1;
            });
            // /* Set the base css attribute to the objects */
            // reset_css(sub_el);
        });
    }, false);
})(document)