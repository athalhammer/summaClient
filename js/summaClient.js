/*!
 * SUMMA Client JavaScript Library
 * http://people.aifb.kit.edu/ath/summaClient/
 *
 * Includes jQuery and jQueryUI
 * http://jquery.com/
 * http://jqueryui.com/
 *
 * Copyright 2015 Andreas Thalhammer
 * Released under the MIT license and GPL v3.
 * https://github.com/athalhammer/summaClient/blob/master/LICENSE
 *
 * Date: 2015-08-28
 */
function summa(uri, topK, language, fixedProperty, id, service) {
    //$("#" + id).after("<div id=" + id + "_loading><img src='css/images/712.GIF'></div>");
    //$("#" + id + "_loading").hide();
    $("#" + id).hide();
    $.ajaxSetup({
        accepts : {
            "json" : "application/rdf+json, application/json, text/javascript"
        },
        contents : {
            "rdf+json" : "application/rdf+json"
        },
        converters : {
            "rdf+json json" : jQuery.parseJSON
        }
    });
    var url = service + "?entity=" + uri + "&topK=" + topK + "&maxHops=1";

    if (language != null) {
        url += "&language=" + language;
    }
    if (fixedProperty != null) {
        url += "&fixedProperty=" + fixedProperty;
    }
    $.ajax({
        dataType : "json",
        url : url,
        beforeSend : function() {
            // show loading bar
            $("#" + id + "_loading").show();
        },
        complete : function() {
            // remove loading bar
            $("#" + id + "_loading").remove();
        },
        success : function(data) {
            function label(uri) {
                var part1 = data[uri];
                if (part1 != null) {
                    return labels = part1["http://www.w3.org/2000/01/rdf-schema#label"][0]["value"];
                } else {
                    var strArry = uri.split("/");
                    return strArry[strArry.length - 1];
                }
            }

            var print = {
                "entity" : "",
                "statements" : []
            };

            var keys = Object.keys(data);

            for ( i = 0; i < keys.length; i++) {
                var types = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"];
                if (types != null) {
                    if (types[0]["value"] == "http://purl.org/voc/summa/Summary") {
                        print["entity"] = data[keys[i]]["http://purl.org/voc/summa/entity"][0]["value"];
                    }
                    if (types[0]["value"] == "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement") {
                        var statement = {
                            "subject" : "",
                            "predicate" : "",
                            "object" : ""
                        };
                        statement["subject"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"][0]["value"];
                        statement["predicate"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"][0]["value"];
                        statement["object"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#object"][0]["value"];
                        print.statements.push(statement);
                    }
                }
            }
            $("#" + id).append("<div style='float:right' id='" + id + "_close'>x</div><h2>" + label(print.entity) + "</h2>"
            + "<table class='abstract'></table><table class='points'></table>");
            for ( i = 0; i < print.statements.length; i++) {
                if (print.statements[i].subject == print.entity) {
                    $("#" + id).children(".points").append("<tr><td>" + label(print.statements[i].predicate) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\" id=\"" + print.statements[i].object + "\" href=\"#" + print.statements[i].object + "\">" + label(print.statements[i].object) + "</a></td></tr>");
                } else if (print.statements[i].object == print.entity) {
                    $("#" + id).children(".points").append("<tr><td>" + label(print.statements[i].predicate) + " of&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\"id=\"" + print.statements[i].subject + "\" href=\"#" + print.statements[i].subject + "\">" + label(print.statements[i].subject) + "</a></td></tr>");
                }
            }
            $("#" + id).append("<i style='font-size:10px'>_______<br>Summary by: <a href='" + service.substring(0, service.lastIndexOf("/")) + "'>" 
            + service.substring(0, service.lastIndexOf("/")) + "</a>"
            + "<br>Sources: <a href='http://dbpedia.org'>http://dbpedia.org</a>"
            + ", <a href='http://wikipedia.org'>http://wikipedia.org</a>"
            + ", <a href='http://duckduckgo.com/'>http://duckduckgo.com/</a></i>");
            $("#" + id).show();
            $("#" + id + "_close").click(function() {
                $("#" + id).remove();
            });
            $('.' + id + '.click').click(function() {
                $("#" + id).empty();
                $("#" + id).hide();
                summa(this.id, topK, language, fixedProperty, id, service);
            });
            //REN
            var url2 = "http://km.aifb.kit.edu/services/duckbpedia?dbpedia=" + uri;
            var statement2 = {
                "img" : "",
                "text" : "",
                "heading" : ""
            };
            $.ajax({
                dataType : "json",
                url : url2,
                success : function(data2) {
                    statement2["img"] = data2["Image"];
                    statement2["text"] = data2["Abstract"];
                    statement2["heading"] = data2["Heading"];
                    
                    $("#" + id).children("h2").text(statement2["heading"]);
                    /*var keys2 = Object.keys(data2);
                    for ( i = 0; i < keys.length; i++) {
                        var types2 = data2[keys2[i]];
                        if (types2 != null) {
                            if (keys2[i] == 'Image') {
                                console.log("checkpoint");
                                statement2["img"] = types2;
                            }
                            if (keys2[i] == 'Abstract') {
                                statement2["text"] = types2;
                            }
                        }
                    }*/
                    //if abstract longer than 100 characters, it is shortened to the next space after 100 characters
                    if (statement2["text"].length < 100) {
                        if (statement2["img"] == "") {//exception: no image
                            $("#" + id).children(".abstract").prepend("<tr><td>" + statement2["text"] + "</td>");
                        } else {
                            $("#" + id).children(".abstract").prepend("<tr><td width='66%'>" + statement2["text"] + "</td>" 
                            + "<td>" + "<img src ='" + statement2["img"] + "' width='100%'>" + "</td></tr>");
                        }
                    } else {

                        var shorttext = statement2["text"].substring(0, statement2["text"].indexOf(" ", 99) + 1);
                        var resttext = statement2["text"].substring(statement2["text"].indexOf(" ", 99) + 1 + " ", statement2["text"].length);
                        var tabletext = "<span class='short' style='background-color: transparent;'>" + shorttext + "</span>" 
                        + "<span class='rest' style='background-color: transparent;'>" + resttext + "</span>" + " " 
                        + "<a href='#' class='more'>" + "(more...)" + "</a>";

                        if (statement2["img"] == "") {//exception: no image
                            $("#" + id).children(".abstract").prepend("<tr><td>" + tabletext + "</td>");
                            var clicked = false;
                            $(".rest").toggle();
                            $(".more").click(function() {
                                if (clicked) {
                                    clicked = false;
                                    $(".rest").toggle();
                                    $(".more").text("(more...)");
                                } else {//default start
                                    clicked = true;
                                    $(".rest").toggle();
                                    $(".more").text("(less...)");
                                }
                            });
                        } else {//with image longer than x characters
                            $("#" + id).children(".abstract").prepend("<tr><td width='66%'>" + tabletext + "</td>" 
                            + "<td>" + "<img src ='" + statement2["img"] + "' width='100%'>" + "</td>");
                            var clicked = false;
                            $(".rest").toggle();
                            $(".more").click(function() {
                                if (clicked) {
                                    clicked = false;
                                    $(".rest").toggle();
                                    $(".more").text("(more...)");
                                } else {//default start
                                    clicked = true;
                                    $(".rest").toggle();
                                    $(".more").text("(less...)");
                                }
                            });
                        }
                    }

                }
            });
            //REN end
        }
    });
}

function qSUM(topK, lang, fixedproperty, service) {
    var clicked = false;
    $("[its-ta-ident-ref]").mouseover(function() {
        var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var identifier = letter + Date.now();
        $("body").append("<div class='sum sum-popup' id='" + identifier + "'></div>");
        $("#" + identifier).position({
            my : "left top",
            at : "right",
            of : $(this),
            collision : "fit"
        });
        summa($(this).attr("its-ta-ident-ref"), topK, lang, fixedproperty, identifier, service);
    });
    $("[its-ta-ident-ref]").click(function() {
        clicked = true;
    });
    $("[its-ta-ident-ref]").mouseout(function() {
        if (!clicked) {
            $(".sum-popup").remove();
        } else {
            clicked = false;
        }
    });
}
