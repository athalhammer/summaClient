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
			"json" : "application/ld+json, application/json, text/javascript"
		},
		contents : {
			"ld+json" : "application/ld+json"
		},
		converters : {
			"ld+json json" : jQuery.parseJSON
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
				for ( k = 0; k < keys.length; k++) {
					if (data[keys[k]]["@id"] == uri) {
						var part1 = data[keys[k]];
					}
				}
				if (part1 != null) {
					return labels = part1["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
				} else {
					var strArry = uri.split("/");
					strArry[strArry.length - 1] = strArry[strArry.length - 1].split("_").join(" ");
					;
					return strArry[strArry.length - 1];
				}
			}

			var print = {
				"entity" : "",
				"statements" : []
			};

			var keys = Object.keys(data);

			for ( j = 0; j < topK; j++) {
				for ( i = 0; i < keys.length; i++) {
					var types = data[keys[i]]["http://purl.org/voc/summa/statement"];
					if (types != null) {
						print["entity"] = data[keys[i]]["http://purl.org/voc/summa/entity"][0]["@id"];
						for ( k = 0; k < keys.length; k++) {
							if (types[0]["value"] == "http://purl.org/voc/summa/Summary") {
                					   print["entity"] = data[keys[i]]["http://purl.org/voc/summa/entity"][0]["value"];
                    					}
							if (data[keys[k]]["@id"] == data[keys[i]]["http://purl.org/voc/summa/statement"][j]["@id"]) {
								var statement = {
									"subject" : "",
									"predicate" : "",
									"object" : "",
									"rankValue" : 0.0
								};
								statement["subject"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"][0]["@id"];
								statement["predicate"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"][0]["@id"];
								statement["object"] = data[keys[k]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#object"][0]["@id"];

								// var rankNode = data[keys[k]]["http://purl.org/voc/vrank#hasRank"][0]["@id"];
								//assumption: rankValue object always follows respective content object
								//otherwise another for and if loop would be necessary
								statement["rankValue"] = data[keys[k + 1]]["http://purl.org/voc/vrank#rankValue"][0]["@value"];
								print.statements.push(statement);
							}
						}
					}
				}
			}

			//sort statements by rankValue
			function compare(a, b) {
				if (parseFloat(a["rankValue"]) < parseFloat(b["rankValue"])) {
					return 1;
				} else if (parseFloat(a["rankValue"]) > parseFloat(b["rankValue"])) {
					return -1;
				} else {
					return 0;
				}
			}


			print["statements"].sort(compare);

			var all_predicates = [];

			var pred_list = {
				"predicates" : []
			};

			//get every unique predicate
			for (var i = 0; i < print["statements"].length; i++) {
				var found = jQuery.inArray(print["statements"][i]["predicate"], all_predicates);
				if (found >= 0) {
					// Element was found
				} else {
					// Element was not found, add it.
					all_predicates.push(print["statements"][i]["predicate"]);
				}
			}

			//push objects to respective predicates
			for (var k = 0; k < all_predicates.length; k++) {
				var total_rank = 0.0;
				var counter = 0.0;
				var predicate = {
					"pred" : "",
					"obj" : [],
					"subj" : [],
					"rnk" : 0.0
				};
				predicate["pred"] = all_predicates[k];
				for (var i = 0; i < print["statements"].length; i++) {
					if (all_predicates[k] == print["statements"][i]["predicate"]) {
						predicate.obj.push(print["statements"][i]["object"]);
						predicate.subj.push(print["statements"][i]["subject"]);
						total_rank += parseFloat(print["statements"][i]["rankValue"]);
						counter++;
					}
				}
				predicate["rnk"] = total_rank / counter;
				pred_list.predicates.push(predicate);
			}

			function compare2(a, b) {
				if (parseFloat(a["rnk"]) < parseFloat(b["rnk"])) {
					return 1;
				} else if (parseFloat(a["rnk"]) > parseFloat(b["rnk"])) {
					return -1;
				} else {
					return 0;
				}
			}


			pred_list["predicates"].sort(compare2);

			/* for (var i = 0; i < print["statements"].length; i++) {
			console.log(print["statements"][i]["predicate"] + " " + print["statements"][i]["subject"] + " " + print["statements"][i]["rankValue"]);
			}

			for (var i = 0; i < pred_list["predicates"].length; i++) {
			console.log(pred_list["predicates"][i]["pred"] + " " + pred_list["predicates"][i]["subj"] + " " + pred_list["predicates"][i]["rnk"]);
			} */

			//add to html
			$("#" + id).append("<div style='float:right' id='" + id + "_close'>x</div><h2>" + label(print.entity) + "</h2>"
            + "<table class='abstract'></table><table class='points'></table>");
			for ( i = 0; i < all_predicates.length; i++) {
				if (pred_list["predicates"][i]["subj"][0] == print.entity) {
					$("#" + id).children(".points").append("<tr><td>" + label(pred_list["predicates"][i]["pred"]) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\" id=\"" + pred_list["predicates"][i]["obj"][0] + "\" href=\"#" + pred_list["predicates"][i]["obj"][0] + "\">" + label(pred_list["predicates"][i]["obj"][0]) + "</a></td></tr>");
					//for each row after the first: without first column;
					for ( m = 1; m < pred_list["predicates"][i]["obj"].length; m++) {
						$("#" + id).children(".points").append("<tr><td>" + "<td><a class=\"" + id + " " + "click\" id=\"" + pred_list["predicates"][i]["obj"][m] + "\" href=\"#" + pred_list["predicates"][i]["obj"][m] + "\">" + label(pred_list["predicates"][i]["obj"][m]) + "</a></td></tr>");
					}
				} else if (pred_list["predicates"][i]["obj"][0] == print.entity) {
					$("#" + id).children(".points").append("<tr><td>" + label(pred_list["predicates"][i]["pred"]) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\" id=\"" + pred_list["predicates"][i]["subj"][0] + "\" href=\"#" + pred_list["predicates"][i]["subj"][0] + "\">" + label(pred_list["predicates"][i]["subj"][0]) + "</a></td></tr>");
					//for each row after the first: without first column;
					for ( m = 1; m < pred_list["predicates"][i]["subj"].length; m++) {
						$("#" + id).children(".points").append("<tr><td>" + "<td><a class=\"" + id + " " + "click\" id=\"" + pred_list["predicates"][i]["subj"][m] + "\" href=\"#" + pred_list["predicates"][i]["subj"][m] + "\">" + label(pred_list["predicates"][i]["subj"][m]) + "</a></td></tr>");
					}
				}
			}

			/* for ( i = 0; i < print.statements.length; i++) {
			 if (print.statements[i].subject == print.entity) {
			 $("#" + id).children("table").append("<tr><td>" + label(print.statements[i].predicate) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\" id=\"" + print.statements[i].object + "\" href=\"#" + print.statements[i].object + "\">" + label(print.statements[i].object) + "</a></td></tr>");
			 } else if (print.statements[i].object == print.entity) {
			 $("#" + id).children("table").append("<tr><td>" + label(print.statements[i].predicate) + " of&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\"id=\"" + print.statements[i].subject + "\" href=\"#" + print.statements[i].subject + "\">" + label(print.statements[i].subject) + "</a></td></tr>");
			 }
			 } */
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

			//duck duck go parts of pictures and abstract

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
					//if abstract longer than 100 characters, it is shortened to the next space after 100 characters
					if (statement2["text"].length < 100) {
						if (statement2["img"] == "") {//exception: no image
							$("#" + id).children(".abstract").prepend("<tr><td>" + statement2["text"] + "</td>");
						} else {
							$("#" + id).children(".abstract").prepend("<tr><td width='66%'>" + statement2["text"] + "</td>" + "<td>" + "<img src ='" + statement2["img"] + "' width='100%'>" + "</td></tr>");
						}
					} else {

						var shorttext = statement2["text"].substring(0, statement2["text"].indexOf(" ", 99) + 1);
						var resttext = statement2["text"].substring(statement2["text"].indexOf(" ", 99) + 1 + " ", statement2["text"].length);
						var tabletext = "<span class='short' style='background-color: transparent;'>" + shorttext + "</span>" + "<span class='rest' style='background-color: transparent;'>" + resttext + "</span>" + " " + "<a href='#' class='more'>" + "(more...)" + "</a>";

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
							$("#" + id).children(".abstract").prepend("<tr><td width='66%'>" + tabletext + "</td>" + "<td>" + "<img src ='" + statement2["img"] + "' width='100%'>" + "</td>");
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
