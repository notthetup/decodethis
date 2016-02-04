window.addEventListener('load', function(){

	var audioPath = "public/audio/";
	var indexFile = "files.json";
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext = new window.AudioContext();

	var ractive;
	var titles;
	var tests = [];
	var testData = [];
	var results = {
		count: 0,
		success: 0,
		failure: 0
	};

	// Fetch datafile and create tests.
	xhrLoadJSON(audioPath + indexFile, function (jsonData){
		ractive = new Ractive({
			el: "testlist",
			template: '#head',
			data: { tests: tests}
		});
		ractiveResults = new Ractive({
			el: 'result-container',
			template: '#result-template',
			data: results
		});

		if (typeof jsonData === 'string'){
			jsonData = JSON.parse(jsonData);
		}

		jsonData.files.forEach(function (titles){
			var test = createTestForFile(titles);
			tests.push(test);
		});

		var playallBtn = document.getElementById('playall');
		playallBtn.addEventListener('click', function() {
			function testCompleteCallback(index){
				if (index < tests.length-1){
					runTest(++index, testCompleteCallback);
				}else{
					actionSpan.className = "";
					playallBtn.firstElementChild.innerHTML = "✓";
					var styletag = document.getElementById('testAllOveride');
					styletag.innerHTML = ".play-all:after{content: 'tests done';}";
				}
			}
			var actionSpan = playallBtn.firstElementChild;
			actionSpan.innerHTML = "↻";
			actionSpan.className = "spin";
			playallBtn.disabled = true;
			var styletag = document.getElementById('testAllOveride');
			styletag.innerHTML = ".play-all:after{content: 'testing';}";
			runTest(0, testCompleteCallback);
		});

		ractive.on('starttest', function(event, index){
			runTest(index);
		});

		window.tests = tests;
	});

	function runTest(index, finishCallback){
		// Disable Test Button
		var test = tests[index];
		var dataPath = 'tests.' + index + ".data";

		test.onFinish = function (error, buffer){
			//console.log("done", index);
			results.count++;
			if (error){
				ractive.set(dataPath+".status",error.toString());
				ractive.set(dataPath+".class","failed");
				ractive.set(dataPath+".action","✗");
				results.failure++;
			}else{
				ractive.set(dataPath+".status","Passed");
				ractive.set(dataPath+".class","passed");
				ractive.set(dataPath+".action","✓");
				results.success++;
			}
			ractiveResults.set(results);
			if (typeof finishCallback === 'function'){
				finishCallback(index);
			}
		};
		ractive.set(dataPath+".status","Testing");
		ractive.set(dataPath+".class","testing");
		ractive.set(dataPath+".action","↻");
		ractive.set(dataPath+".button","false");
		test.start();
	}

	function xhrLoadJSON(url, onLoadCallback){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'json';
		request.onload = function (event){
			if (typeof onLoadCallback === 'function'){
				onLoadCallback(request.response);
			}
		};
		request.error = function (event){
			if (typeof onLoadCallback === 'function'){
				onLoadCallback(null);
			}
		};
		request.send();
	}


	function createTestForFile(fileData){
		fileData.path = audioPath;
		var test = new TestCase(fileData, audioContext);
		//console.log(test);
		return test;
	}
});
