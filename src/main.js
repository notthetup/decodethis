window.addEventListener('load', function(){

	var audioPath = "audio/";
	var indexFile = "files.json";
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var audioContext = new window.AudioContext();

	var listElement = document.getElementById("testlist");
	var tests = [];

	xhrLoadJSON(audioPath + indexFile, function (jsonData){
		jsonData.files.forEach(function (thisFile){
			var test = createTestForFile(thisFile);
			tests.push(test);
			listElement.appendChild(createTestRow(test));
		});
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


	function createTestRow(test){

		var rowElement = document.createElement("tr");
		rowElement.className = "test";
		rowElement.id = test.data.filename;

		var tableData = document.createElement("td");
		var startButton = document.createElement("button");
		startButton.innerHTML = '▶';
		startButton.id = "startButton";
		tableData.appendChild(startButton);
		rowElement.appendChild(tableData);

		tableData = document.createElement("td");
		var nameElement = document.createElement("div");
		nameElement.innerHTML = test.data.filename;
		tableData.appendChild(nameElement);
		rowElement.appendChild(tableData);

		tableData = document.createElement("td");
		var progressElement = document.createElement("div");
		progressElement.innerHTML = "0%";
		tableData.appendChild(progressElement);
		rowElement.appendChild(tableData);

		tableData = document.createElement("td");
		var statusElement = document.createElement("div");
		statusElement.innerHTML = test.status;
		tableData.appendChild(statusElement);
		rowElement.appendChild(tableData);

		startButton.addEventListener('click', function(){
			if (test.status == "init"){
				test.onFinish = function(error, buffer){
					if (error){
						statusElement.innerHTML = error.toString();
					}else {
						statusElement.innerHTML = buffer.toString();
					}
					startButton.innerHTML = '<';
				};

				test.onProgress = function(percentComplete){
					progressElement.innerHTML = percentComplete + "%";
				};

				test.onReset = function(){
					startButton.innerHTML = '▶';
				};
				test.start();
			}else if (test.status == "complete"){
				test.reset();
				test.start();
			}
		});

		return rowElement;
	}
});

