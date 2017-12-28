

(function(exports) {

    exports.URL = exports.URL || exports.webkitURL;

    exports.requestAnimationFrame = exports.requestAnimationFrame ||
        exports.webkitRequestAnimationFrame || exports.mozRequestAnimationFrame ||
        exports.msRequestAnimationFrame || exports.oRequestAnimationFrame;

    exports.cancelAnimationFrame = exports.cancelAnimationFrame ||
        exports.webkitCancelAnimationFrame || exports.mozCancelAnimationFrame ||
        exports.msCancelAnimationFrame || exports.oCancelAnimationFrame;

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    var ORIGINAL_DOC_TITLE = document.title;
    var video = $('#video');
    var canvas = $('#my_canvas');//document.createElement('canvas'); // offscreen canvas.
    var rafId = null;
    var startTime = null;
    var endTime = null;
    var frames = [];
    var ctx;

    function $(selector) {
        return document.querySelector(selector) || null;
    }

    function toggleActivateRecordButton() {
        var b = $('#record-me');
        b.textContent = b.disabled ? 'Record' : 'Recording...';
        b.classList.toggle('recording');
        b.disabled = !b.disabled;
    }

    function startPlay(e) {
        e.target.disabled = true;
        //video.controls = true;
        video.autoplay = true;
        ctx = canvas.getContext('2d');

        var finishVideoSetup_ = function() {setInterval(function() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            //video.width = 320;//video.clientWidth;
            //video.height = 240;// video.clientHeight;
            canvas.style.width = 640+'px';
            canvas.style.height = 360+'px';
            var img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
            qrcode.decode(img);
            qrcode.callback = logged;
            //canvas.width = 640;
            //canvas.height = 360;
        }, 2000);};

        navigator.getUserMedia({ audio: false, video: { width: 640, height: 360 } },
            function(stream) {
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
                finishVideoSetup_();
            },
            function(e) {
                alert('Fine, you get a movie instead of your beautiful face ;)');
            }
        );
    };

    function record() {
        var elapsedTime = $('#elasped-time');
        var ctx = canvas.getContext('2d');
        var CANVAS_HEIGHT = canvas.height;
        var CANVAS_WIDTH = canvas.width;

        frames = []; // clear existing frames;
        startTime = Date.now();

        toggleActivateRecordButton();
        $('#stop-me').disabled = false;

        function drawVideoFrame_(time) {
            rafId = requestAnimationFrame(drawVideoFrame_);

            ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            document.title = 'Recording...' + Math.round((Date.now() - startTime) / 1000) + 's';

            // Read back canvas as webp.
            //console.time('canvas.dataURL() took');
            var url = canvas.toDataURL('image/webp', 1); // image/jpeg is way faster :(
            //console.timeEnd('canvas.dataURL() took');
            frames.push(url);

            // UInt8ClampedArray (for Worker).
            //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);

            // ImageData
            //frames.push(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT));
        };

        rafId = requestAnimationFrame(drawVideoFrame_);
    };

    function logged(a) {
        console.log(a);
        
    }
    
    function stop() {
        console.log('stop');
        //var t = canvas.qrcode.decode();
        var img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        qrcode.decode(img);
        qrcode.callback = logged;
        //console.log(t+"-/*");

        /*
        html2canvas($('#video'), {
            onrendered: function (canvas) {
                //var img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");


                canvas.toBlob(function(img) {
                    saveAs(img, "123.png");
                });

            },
            background:'#fff'
        });*/
        /*
        cancelAnimationFrame(rafId);
        endTime = Date.now();
        $('#stop-me').disabled = true;
        document.title = ORIGINAL_DOC_TITLE;

        toggleActivateRecordButton();

        console.log('frames captured: ' + frames.length + ' => ' +
            ((endTime - startTime) / 1000) + 's video');

        embedVideoPreview();*/
    };

    function embedVideoPreview(opt_url) {
        var url = opt_url || null;
        var video = $('#video-preview video') || null;
        var downloadLink = $('#video-preview a[download]') || null;

        if (!video) {
            video = document.createElement('video');
            video.autoplay = true;
            video.controls = true;
            video.loop = true;
            //video.style.position = 'absolute';
            //video.style.top = '70px';
            //video.style.left = '10px';
            video.style.width = canvas.width + 'px';
            video.style.height = canvas.height + 'px';
            $('#video-preview').appendChild(video);

            downloadLink = document.createElement('a');
            downloadLink.download = 'capture.webm';
            downloadLink.textContent = '[ download video ]';
            downloadLink.title = 'Download your .webm video';
            var p = document.createElement('p');
            p.appendChild(downloadLink);

            $('#video-preview').appendChild(p);

        } else {
            window.URL.revokeObjectURL(video.src);
        }

        // https://github.com/antimatter15/whammy
        // var encoder = new Whammy.Video(1000/60);
        // frames.forEach(function(dataURL, i) {
        //   encoder.add(dataURL);
        // });
        // var webmBlob = encoder.compile();

        if (!url) {
            var webmBlob = Whammy.fromImageArray(frames, 1000 / 60);
            url = window.URL.createObjectURL(webmBlob);
        }

        video.src = url;
        downloadLink.href = url;
    }

    function initEvents() {
        $('#camera-me').addEventListener('click', startPlay);
        $('#record-me').addEventListener('click', record);
        $('#stop-me').addEventListener('click', stop);
    }

    initEvents();

    exports.$ = $;

})(window);