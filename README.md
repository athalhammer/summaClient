# summaClient

This JavaScript client implementation of the SUMMA API lets you integrate summaries from arbitrary SUMMA servers into your HTML documents.

It supports three modes:

- **SUMMA client** This mode lets you retrieve a summary from a specific entity that will be attached to a predefined DIV element in your page.
- **qSUM** This mode lets you annotate elements with the Internationalization Tag Set (ITS) property `its-ta-ident-ref` inside your HTML and summaries will be displayed as soon as you hover over the annotated elements.
- **ELES** This mode combines qSUM with DBpedia Spotlight ITS annotations.

## Demo
An integrated demo can be found at http://athalhammer.github.io/summaClient.

## Use
Include the following lines in your HTML:

- **SUMMA client**
``` html
<link rel="stylesheet" type="text/css" href="http://athalhammer.github.io/summaClient/css/summaClient.css" />
<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script src="http://athalhammer.github.io/summaClient/js/summaClient.js"></script>
<script>
$(document).ready(function() {

	// define which element should contain a specific summary
	// parameters: entity, topK, language, fixed properties, (html) DIV-id, service
	summa("http://dbpedia.org/resource/Quentin_Tarantino", 5, "en",
		 "http://dbpedia.org/ontology/director,http://dbpedia.org/ontology/knownFor",
		 "pf-summary", "http://km.aifb.kit.edu/services/link/sum");
});
</script>
<!-- here is the element that should contain a specific summary -->
<div class="sum" id="pf-summary"></div>
```

- **qSUM**
``` html
<link rel="stylesheet" type="text/css" href="http://athalhammer.github.io/summaClient/css/summaClient.css" />
<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script src="http://athalhammer.github.io/summaClient/js/summaClient.js"></script>
<script>
$(document).ready(function() {

	// inline popups for annotated text
	// parameters: topK, language, fixed properties, service
	qSUM(5, "en", null, "http://km.aifb.kit.edu/services/link/sum");

});
</script>
The narrative sequence called "The Gold Watch" of 
<span its-ta-ident-ref="http://dbpedia.org/resource/Pulp_Fiction">Pulp Fiction</span>
ends with Butch picking up Fabienne with Zed's
<span its-ta-ident-ref="http://dbpedia.org/resource/Chopper_(motorcycle)">chopper</span>
```

- **ELES**
``` html
<link rel="stylesheet" type="text/css" href="http://athalhammer.github.io/summaClient/css/summaClient.css" />
<script src="http://code.jquery.com/jquery-2.2.1.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script src="http://dbpedia-spotlight.github.io/demo/dbpedia-spotlight-0.3.js"></script>
<script src="http://athalhammer.github.io/summaClient/js/summaClient.js"></script>
<script>
$(document).ready(function() {
// selector on HTML element(s)
var select = ".annotate";

// as soon as the annotations are ready, start registering mouseover events
// parameters: topK, language, fixed properties, service
$(select).bind("DOMSubtreeModified", function() {
qSUM(5, "en", null, "http://km.aifb.kit.edu/services/link/sum");
});

// DBpedia Spotlight configuration and annotation
var settings = { "endpoint" : "http://spotlight.sztaki.hu:2222/rest", "its" : "yes",
"spotter" : "Default" };
$(select).annotate(settings); $(select).annotate("best");
});
</script>
<div class="annotate">Angela Merkel is TIME Person of the Year 2015.</div>

```

As a matter of fact, you can download the above *.js files respectively and include them on your own server.

## Summaries
You don't like the summaries of [LinkSUM](http://km.aifb.kit.edu/services/link)? Build your own ones by implementing the interface `edu.kit.aifb.summa.Summarizer` of 
https://github.com/athalhammer/summaServer.

## License
This source code is dual-licensed under the MIT license and GPL v3.
