// BLOX ENVIRONMENT ****************************************************************

if (publishController.visual) {
	
	let counter = new Vue({
		delimiters: ['${', '}'],
		el: '#counterPlugin',
		data: {
			matches: document.querySelectorAll(".blox"),
		},

		created: function() {
			this.create();
			this.currentSituation(this.matches);
		},
		
		mounted: function() {

			document.addEventListener('click', function (event) {
				//let target = event.target;
				//let parent = target.parentNode
				//let id = parent.id;
				var p = event.target;
				let id = null;
				while(p = p.parentNode)
					if(p.id && (p.id).substr(0,5) == 'blox-')
						id = p.id

				if(id){
console.log(id);
				//if(id.substr(0,5)=='blox-'){
					let counter_plugin_counters = document.getElementById("counter_plugin_counters");
					let counter_plugin_current_item = document.getElementById("counter_plugin_current_item");
					if(counter_plugin_current_item===null){
						let counter_plugin_current_item = document.createElement("p");
						counter_plugin_current_item.id = "counter_plugin_current_item";
						counter_plugin_current_item.dataset.current = id;
						counter_plugin_counters.appendChild(counter_plugin_current_item);
					} else {
						counter_plugin_current_item.dataset.current = id;
					}
				}
			});

			eventBus.$on('updatedMarkdown', function(value) {
				this.updateNumbers(value);
			}.bind(this));
		},
	  
		methods: {

			currentSituation: function(content) {
//console.log(content);
				let numbers = this.getNumbers(content);
				let readingTime = this.getReadingTime(numbers.words);
				this.axios(numbers.characters, numbers.words, numbers.phrases, readingTime);
//console.log(typeof numbers.characters);
				this.copyTotals(numbers.characters, numbers.words, numbers.phrases);
			},


			getNumbers: function(content) {
				let characters=0, words=0, phrases=0;
				let spaceCount=0;

				if(typeof content === 'string') {
					// remove asterisk (UL), number 1 (OL), carriage return
					content = content.replace(/\*/g, '').replace(/1. /g, ' ').replace(/\n/g, '').trim();
//console.log('['+content+']');
					// count characters including spaces
					characters += content.length;
					// count the spaces
					spaceCount = (content.split(" ").length - 1);
					// count characters without spaces
					characters = characters - spaceCount;
			
					words += content.trim().replace(/^[\s,.;!?]+/, "").replace(/[\s,.;!?]+$/, "").split(/[\s,.;!?]+/).length;
					phrases += content.split(/[\;\.\?\!]\s/).length;
				}

				if(typeof content === 'object') {
					Array.prototype.forEach.call(content, function (item) {
//console.log(item);
						if (item.dataset.chars) {
							characters += parseInt(item.dataset.chars,10);
							words += parseInt(item.dataset.words,10);
							phrases += parseInt(item.dataset.phrases,10);
						}
					});
				}

				return {characters: characters, words: words, phrases: phrases};
			},


			getReadingTime: function(words) {
				if (words) {
					seconds = Math.floor(words * 60 / 160);
					if (seconds > 59) {
						minutes = Math.floor(seconds / 60);
						seconds = seconds - minutes * 60;
						readingTime = minutes + "'" + seconds + '"';
					} else {
						readingTime = seconds + '"';
					}
				} else {
					readingTime = '0"';
				}
				return readingTime;
			},
			

			axios: function(characters, words, phrases, readingTime) {
				myaxios.get('/counter_tool',{
					params: {
						'characters': characters,
						'words': words,
						'phrases': phrases,
						'readingTime': readingTime
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
			},


			copyTotals: function(characters, words, phrases) {
//console.log(typeof characters);
				let totalsCounters = document.getElementById("counter_plugin_totals_counters");
				totalsCounters.dataset.characters = characters;
				totalsCounters.dataset.words = words;
				totalsCounters.dataset.phrases = phrases;
			},

			
			updateNumbers: function(value) {
				let historical_characters = 0, historical_words = 0, historical_phrases = 0;
				let numbers = this.getNumbers(value);
				let current_characters = numbers.characters;
				let current_words = numbers.words;
				let current_phrases = numbers.phrases;

				let counter_plugin_current_item = document.getElementById("counter_plugin_current_item").dataset.current;
				let id = counter_plugin_current_item.replace("blox-","");
//console.log('ID: '+id);

				if(id!="99999"){
					historical_characters = this.matches[id].dataset.chars;
					historical_words = this.matches[id].dataset.words;
					historical_phrases = this.matches[id].dataset.phrases;
				}
				diff_characters = current_characters - historical_characters;
				diff_words = current_words - historical_words;
				diff_phrases = current_phrases - historical_phrases;

				let totalsCounters = document.getElementById("counter_plugin_totals_counters");

				let total_characters = parseInt(totalsCounters.dataset.characters,10) + parseInt(diff_characters,10);//console.log(total_characters);
				let total_words = parseInt(totalsCounters.dataset.words,10) + parseInt(diff_words,10);//console.log(total_words);
				let total_phrases = parseInt(totalsCounters.dataset.phrases,10) + parseInt(diff_phrases,10);//console.log(total_phrases);

				let readingTime = this.getReadingTime(total_words);
				this.axios(total_characters, total_words, total_phrases, readingTime);
			},


			create: function() {
				if( document.querySelector('#counter_plugin_counters') === null ){
					let counter_plugin_counters = document.createElement('div');
					counter_plugin_counters.setAttribute("id","counter_plugin_counters");
					document.body.appendChild(counter_plugin_counters);
				}

				let counter_plugin_counters = document.getElementById("counter_plugin_counters");
				let totalsCounters = document.createElement("p");
				totalsCounters.id = "counter_plugin_totals_counters";
				totalsCounters.dataset.characters = 0;
				totalsCounters.dataset.words = 0;
				totalsCounters.dataset.phrases = 0;
				counter_plugin_counters.appendChild(totalsCounters);
			}
			
		}

	});

}
