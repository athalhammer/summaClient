# summaClient

This JavaScript client implementation of the SUMMA API lets you integrate summaries from arbitrary SUMMA servers into your HTML documents.

It supports two modes:

- **SUMMA client** This mode lets you retrieve a summary from a specific entity that will be attached to a predefined DIV element in your page.
- **qSum** This mode lets you annotate elements with the Internationalization Tag Set (ITS) property "its-ta-ident-ref" inside your HTML and summaries will be displayed as soon as you hover over the annotated elements.

## Demo
An integrated demo can be found at http://people.aifb.kit.edu/ath/summaClient/

## Use
Include the following lines in your HTML:

- **SUMMA client**
``` html
<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script src="http://people.aifb.kit.edu/ath/summaClient/js/summaClient.js"></script>
<script>
$(document).ready(function() {

	// define which element should contain a specific summary
	// parameters: entity, topK, language, fixed properties, (html) DIV-id, service
	summa("http://dbpedia.org/resource/Quentin_Tarantino", 5, "en",
		 "http://dbpedia.org/ontology/director,http://dbpedia.org/ontology/knownFor",
		 "pf-summary", "http://km.aifb.kit.edu/summa/summarum");
});
</script>
<!-- here is the element that should contain a specific summary -->
<div class="sum" id="pf-summary"></div>
```

- **qSum**
``` html
<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script src="http://people.aifb.kit.edu/ath/summaClient/js/summaClient.js"></script>
<script>
$(document).ready(function() {

	// inline popups for annotated text
	// parameters: topK, language, fixed properties, service
	qSum(5, "en", null, "http://km.aifb.kit.edu/summa/summarum");

});
</script>
The narrative sequence called "The Gold Watch" of 
<span its-ta-ident-ref="http://dbpedia.org/resource/Pulp_Fiction">Pulp Fiction</span>
ends with Butch picking up Fabienne with Zed's
<span its-ta-ident-ref="http://dbpedia.org/resource/Chopper_(motorcycle)">chopper</span>
```

As a matter of fact, you can download the above *.js files respectively and include it on your own server.

## Summaries
You don't like the summaries of [Summarum](http://km.aifb.kit.edu/summa/summarum)? Build your own ones by implementing the interface Summarizer.java of 
https://github.com/athalhammer/summaServer.

## License
This source code is dual-licensed under the MIT license and GPL v3.
