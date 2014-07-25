var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');


var audioDir = "public/audio/";
var metadataJSON = "files.json";
var acceptedExtensions = ['mp3','wav','ogg','aac','mp4','webm'];

var mediainfo = "mediainfo";
var mediaInfoGeneralArgs = " --Inform=\"General; title:%Title%\" ";
var mediaInfoAudioArgs = " --Inform=\"Audio; duration:%Duration%, bitrateMode:%BitRate_Mode%, channels:%Channels%, bitrate:%BitRate%, format:%Format%, bitdepth:%BitDepth%, samplingRate:%SamplingRate%\" ";

var metadata = {files:[]};


function getChannels(string){
	return string.match(/^Channels\s*:\s(\d)/m)[1];
}

fs.readdir(audioDir,function(err,files){
	if (err) throw err;

	var fileCount = 0;
	files.forEach(function(file){
		var ext = path.extname(file).substring(1);
		if (ext.length > 1 && acceptedExtensions.indexOf(ext) > -1){
			fileCount++;
			exec(mediainfo + mediaInfoGeneralArgs + audioDir + file, function(err, generalResult) {
				if (err) throw err;
				var generalData =  JSON.parse('{"'+generalResult.replace(/(\:)/g,'"$1"').replace(/(, )/g,'"$1"').trim() + '"}');
				exec(mediainfo + mediaInfoAudioArgs + audioDir + file, function(err, audioResult) {
					if (err) throw err;
					fileCount--;
					var mediaInfoData = JSON.parse('{"'+audioResult.replace(/(\:)/g,'"$1"').replace(/(, )/g,'"$1"').trim() + '"}');
					metadata.files.push({
						"filename" : file,
						"description" : generalData.title,
						"type" : mediaInfoData.format,
						"bitdepth" : mediaInfoData.bitdepth,
						"samplingrate" : mediaInfoData.samplingRate,
						"length" : mediaInfoData.duration,
						"kbps" : (parseInt(mediaInfoData.bitrate)/1000 + ( (mediaInfoData.bitrateMode=== "VBR") ? " (VBR)" : "")),
						"channels" : mediaInfoData.channels
					});
					if(fileCount <= 0 ){

						fs.writeFile(audioDir + metadataJSON, JSON.stringify(metadata), function (err){
							if (err) throw err;
							console.log("Generated metadata for ", metadata.files.length, " files");
							console.log("Done!");
						});
					}
				});
			});
		}
	});
});

