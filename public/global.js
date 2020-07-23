document.addEventListener("DOMContentLoaded", function() {
	// create element where to put the counters
	createElement();
});

// create element where to put the counters
function createElement() {
	var counterPlugin = document.querySelector('#counterPlugin');
	if (counterPlugin === null) {
		var secondaryNode = document.querySelector('.secondary');
		if (secondaryNode !== null) {
			var wordCounterSpan = document.createElement('span');
			wordCounterSpan.setAttribute("id", "counterPlugin");
			secondaryNode.prepend(wordCounterSpan);
		}
	}
}