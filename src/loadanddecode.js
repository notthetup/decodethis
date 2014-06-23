/*
* Downloads a sound file using XHR and decodes it using WebAudio
*
* @method loadanddecode
* @param {String} URL URL of the audio file to be downloaded.
* @param {Function} onLoadCallback Callback for when the decoded AudioBuffer is ready. Callback returns an {Error} (if any) and an {AudioBuffer}
* @param {Function} onProgressCallback Callback for progress event from the XHR download.
* @param {AudioContext} [AudioContext] Optional AudioContext to be used for decoding.
*
*/
function loadanddecode(URL, onLoadCallback, onProgressCallback, audioContext){
    if (!audioContext){
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
    }
    var request = new XMLHttpRequest();
    request.open('GET', URL, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        if (request.status === 200 || request.status === 304){
            audioContext.decodeAudioData(request.response, function(buffer){
                if (typeof onLoadCallback === 'function')
                    onLoadCallback(null, buffer);
            },function (){
                if (typeof onLoadCallback === 'function')
                    onLoadCallback(new Error("Decoding Error"), null);
            });
        }else{
            if (typeof onLoadCallback === 'function'){
                onLoadCallback(new Error("Loading Error : " + request.status), null);
            }
        }
    };
    request.onerror = function(){
        if (typeof onLoadCallback === 'function'){
           onLoadCallback(new Error("Loading Error : " + request.status), null);
       }
   };
   request.onprogress = function(event){
    if (typeof onProgressCallback === 'function'){
        onProgressCallback(event);
    }
};
request.send();
}
