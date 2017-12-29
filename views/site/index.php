<?php

/* @var $this yii\web\View */

$this->title = 'My Yii Application';
?>
<div class="site-index">

    <video id="video" >

    </video>


    <br>


    <canvas id="my_canvas" style="display: none;">

    </canvas>
    <section>
        <div style="float:left;">
            <button id="camera-me" >1. Show video</button>
        </div>
        <div id="video-preview">
            <button id="decode-me">2. Decode</button>
        </div>
    </section>

    <div>
        <label id="wallet"></label>
    </div>
</div>
