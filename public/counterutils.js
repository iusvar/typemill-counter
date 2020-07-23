
let counterUtilities = {

	getItems: function()
	{
		this.counterItems = document.querySelectorAll( ".blox" );
	},

	cycleItems: function(){
		if(this.counterItems)
		{
			for(var i = 0; i < this.counterItems.length; i++)
			{
				var counterItem = this.counterItems[i];
				this.addCounters(counterItem);
//console.log(counterItem);
			}
		}	
	},

	addCounters: function(element)
	{
		html = element.childNodes[0].innerHTML;
		elementType = element.childNodes[0].tagName;
//console.log(elementType);
		if(elementType == "UL"){
			html = html.replace(/<[^>]*>?/gm, '');
		}
		if(elementType == "OL"){
			html = html.replace(/<[^>]*>?/gm, '');
			html = html.replace(/1. /g, '');
		}
//console.log('['+html+']');
		if(elementType== "P" || elementType == "UL" || elementType == "OL"){
		//if(elementType=="P" || elementType=="H1"){
			current_chars = html.length;
			var spaceCount = (html.split(" ").length - 1);
			current_chars = current_chars - spaceCount;

			current_words = html.trim().replace(/^[\s,.;!?]+/, "").replace(/[\s,.;!?]+$/, "").split(/[\s,.;!?]+/).length;
			current_phrases = html.split(/[\;\.\?\!]\s/).length;

			element.dataset.chars = current_chars;
			element.dataset.words = current_words;
			element.dataset.phrases = current_phrases;
		}

	},


	start: function(){
		this.getItems();
		this.cycleItems();
	},
};