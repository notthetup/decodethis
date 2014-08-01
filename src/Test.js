function Test (testFileJSON, audioContext){

	if (!testFileJSON)
		return;

	testFileJSON.status = "Untested";


	this.data = testFileJSON;
	this.data.class = "untested";
	this.onFinish = null;
	this.onProgress = null;
	this.onReset = null;
	this.percentComplete = 0;

	this.start = function(){
		self = this;
		this.status = "running";
		loadanddecode(this.data.path + this.data.filename, function (error, buffer){
			self.status = "complete";
			if (typeof self.onFinish === 'function'){
				self.onFinish(error, buffer);
			}
		}, function (event){
			if (event.lengthComputable) {
				self.percentComplete = Math.round(100*event.loaded/event.total);
			}
			if (typeof self.onProgress === 'function'){
				self.onProgress(self.percentComplete);
			}
		}, audioContext);
	};

	this.reset = function(){
		this.status = "init";
		this.percentComplete = 0;
		if (typeof this.onReset === 'function'){
			this.onReset();
		}
	};

	this.status = "init";
}

