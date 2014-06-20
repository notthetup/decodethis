(function (){

	var audioPath = "audio/";
	var indexFile = "files.json";

	var listElement = document.getElementById("testlist");
	var tests = [];

	xhrLoadJSON(audioPath + indexFile, function (jsonData){
		jsonData.files.forEach(function (thisFile){
			var test = createTestForFile(thisFile);
			tests.append(test);
			listElement.append(createTestRow(test));
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


	function createTestForFile( file){
		var test = {};


		return test;
	}


	function createTestRow(test){

		rowElement = document.createElement("div");


		return rowElement;
	}
})();

