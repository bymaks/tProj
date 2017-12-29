

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

    var video = $('#video');
    var canvas = $('#my_canvas');
    var ctx;

    var QRcode='';

    function $(selector) {
        return document.querySelector(selector) || null;
    }

    function openCamera(e) {
        e.target.disabled = true;// отключение кнопки от повторного нажатия
        video.autoplay = true;
        ctx = canvas.getContext('2d');

        var finishVideoSetup_ = function() {
            setInterval(
                function() {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    canvas.style.width = 640+'px';//размер пропорционально должен совпадать с картинкой камеры
                    canvas.style.height = 360+'px';//размер пропорционально должен совпадать с картинкой камеры
                    decode();
                },
             2000);// переод обновления картинки для распознавания
        };

        navigator.getUserMedia({ audio: false, video: { width: 640, height: 360 } },
            function(stream) {// succsess function
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
                finishVideoSetup_();
            },
            function(e) {//error function
                console.log('camera not found');
            }
        );


    };

    function saveQRcode(a) {
        QRcode = a;
        $('#wallet').append(a);
        console.log('decode and save qr-code:'+a);
    }
    
    function decode() {
        console.log('decodeQR');
        var img = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        qrcode.decode(img);
        qrcode.callback = saveQRcode;
    };

    function initEvents() {
        $('#camera-me').addEventListener('click', openCamera);
        $('#decode-me').addEventListener('click', decode);
    }

    initEvents();

    exports.$ = $;
})(window);