// RAW ENVIRONMENT *****************************************************************

document.addEventListener("DOMContentLoaded", function() {

  // create element where to put the counters
  //createElement();

  // select the content to count on
  if (document.querySelector('#content') !== null) {
    var contentNode = document.querySelector('#content');
    contentNode.addEventListener('input', showRawChanges);
  }

  // initial static situation
  if (document.querySelector('#content') !== null) {
    //showRaw(contentNode.innerHTML);
    performCounting(contentNode.innerHTML);
  }
  
});

// situation in case of changes
function showRawChanges(e) {
	//showRaw(e.target.value); // vecchio sistema
	performCounting(e.target.value);
}


function performCounting(contentText) {
	let new_content = contentText;
	new_content = new_content.replace(/<[^>]*>/m, '');

	//CHARACTERS
	this.characters = new_content.replace(/[\n\r]+/g, '').length;

	//WORDS
	this.words = new_content.split(/\b\S+\b/g).length - 1;

	//PHRASES
	let regex = /[?!.]/gm;
	let m;
	let count=0;
	while ((m = regex.exec(new_content)) !== null) {
		count++;
		if (m.index === regex.lastIndex) {
		  regex.lastIndex++;
		}
	}
	this.phrases = count;

	//READING TIME
	if (this.words) {
		let seconds = Math.floor(this.words * 60 / 160);
		if (seconds > 59) {
			let minutes = Math.floor(seconds / 60);
			seconds = seconds - minutes * 60;
			this.readingTime = minutes + "' " + seconds + '"';
		} else {
			this.readingTime = seconds + '"';
		}
	} else {
		this.readingTime = '0"';
	}

	myaxios.get('/counter_tool',{
		params: {
			'characters': this.characters,
			'words': this.words,
			'phrases': this.phrases,
			'readingTime': this.readingTime
		}
	})
	.then(function (response) {
		counterPlugin = document.querySelector('#counterPlugin');
		counterPlugin.innerHTML = response.data;
	})
	.catch(function (error) {
		if(error.response) {
			console.log(error.response.data.errors);
		}
	});
}