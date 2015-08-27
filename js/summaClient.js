function summa(uri, topK, language, fixedProperty, id, service) {
	$("#" + id).after("<div id=" + id + "_loading><img src='css/images/712.GIF'></div>");
	$("#" + id + "_loading").hide();
	$("#" + id).hide();
	$.ajaxSetup({
		accepts: {"json" : "application/rdf+json, application/json, text/javascript" },
		contents: {"rdf+json" :  "application/rdf+json" },
		converters: {"rdf+json json" : jQuery.parseJSON}
	});
	var url = service + "?entity=" + uri + "&topK=" + topK + "&maxHops=1";

	if (language != null) {
		url += "&language=" + language;
	}
	if (fixedProperty != null) {
		url += "&fixedProperty=" + fixedProperty;
	}
	$.ajax({
		dataType: "json",
		url: url,
        beforeSend: function() {
		// show loading bar
        	$("#" + id + "_loading").show();
        },
        complete: function() {
		// remove loading bar
        	$("#" + id + "_loading").remove();
        },
		success:
		function (data) {
			function label(uri) {
				var part1 = data[uri];
				if (part1 != null) {
					return labels = part1["http://www.w3.org/2000/01/rdf-schema#label"][0]["value"];
				} else {
					var strArry = uri.split("/");
					return strArry[strArry.length - 1];
				}
			}		
		
			var print = {"entity" : "", "statements" : []}
			
			var keys = Object.keys(data);
			
			for (i = 0; i < keys.length; i++) {
				var types = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"];
				if (types != null) {
					if (types[0]["value"] == "http://purl.org/voc/summa/Summary") {
						print["entity"] = data[keys[i]]["http://purl.org/voc/summa/entity"][0]["value"];
					}
					if (types[0]["value"] == "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement") {
						var statement = {"subject" : "", "predicate" : "", "object" : ""};
						statement["subject"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"][0]["value"];
						statement["predicate"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"][0]["value"];
						statement["object"] = data[keys[i]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#object"][0]["value"];
						print.statements.push(statement);
					}
				}
			}			
			$("#" + id).append("<div style='float:right' id='" + id + "_close'>x</div><h2>" + label(print.entity) + "</h2><br><table>");
			for (i = 0; i < print.statements.length; i++) {
				if (print.statements[i].subject == print.entity) {
					$("#" + id).append("<tr><td>" + label(print.statements[i].predicate) + "&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\" id=\"" + print.statements[i].object + "\" href=\"#" + print.statements[i].object + "\">" + label(print.statements[i].object) + "</a></td></tr>");
				} else if (print.statements[i].object == print.entity) {
					$("#" + id).append("<tr><td>" + label(print.statements[i].predicate) + " of&nbsp;&nbsp;&nbsp;&nbsp;</td><td><a class=\"" + id + " " + "click\"id=\"" + print.statements[i].subject + "\" href=\"#" + print.statements[i].subject + "\">" + label(print.statements[i].subject) + "</a></td></tr>");
				}
			}
			$("#" + id).show();
			$("#" + id + "_close").click(function() {
				$("#" + id).remove();
			});
			$('.' + id + '.click').click(function() {
				$("#" + id).empty();
				$("#" + id).hide();
				summa(this.id, topK, language, fixedProperty, id, service);
			});
		}
	});
}


function qsum(topK, lang, fixedproperty, service) {
	var clicked = false;
	$("[its-ta-ident-ref]").mouseover(function() {
		var letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
		var identifier = letter + Date.now();
		$("body").append("<div class='sum sum-popup' id='" + identifier + "'></div>");
		$("#" + identifier).position({
			my: "left top",
			at: "right",
			of:  $(this),
			collision: "fit"
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
