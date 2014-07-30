window.addEventListener('load', function(){

	var audioPath = "public/audio/";
	var indexFile = "files.json";
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext = new window.AudioContext();

	var ractive;
	var titles;
	var tests = [];
	var testData = [];


	// Fetch datafile and create tests.
	xhrLoadJSON(audioPath + indexFile, function (jsonData){
		ractive = new Ractive({
			el: "testlist",
			template: '#head',
			data: { tests: tests}
		});
		jsonData.files.forEach(function (titles){
			var test = createTestForFile(titles);
			tests.push(test);
		});

		ractive.on('starttest', function(event, index){
			// Disable Test Button
			var test = tests[index];

			test.onFinish = function (error, buffer){
				console.log("done", test);
				var statusPath = 'tests.' + index + ".data.status";
				if (error){
					ractive.set(statusPath,error.toString());
				}else{
					ractive.set(statusPath,"Passed");

				}
			};
			test.start();
		});

		window.tests = tests;
	});

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
		var test = new Test(fileData, audioContext);
		console.log(test);

		return test;
	}
});

