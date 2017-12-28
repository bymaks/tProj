<?php

/* @var $this yii\web\View */

$this->title = 'My Yii Application';
?>
<div class="site-index">

    <video id="video">

    </video>


    <br>


    <canvas id="my_canvas">

    </canvas>
    <section>
        <div style="float:left;">
            <button id="camera-me" >1. Show video</button>
        </div>
        <div id="video-preview">
            <button id="record-me" disabled>2. Record<!--⚫--></button>
            <button id="stop-me">◼</button>
        </div>
    </section>
</div>
