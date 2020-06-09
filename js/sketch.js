/**
 * @author Lenny
 */

var mic;
var fftw;
var ffts;

var soundWindow;

var posx;
var posy;
var r = 80;
var R = r;

var vel = 5;

var tmpx, tmpy;

var downLevel = 5;
var upLevel = 3;
var voiceLevel = [0.1, 0.4, 0.7];

var spRage = 5;
var spBorderUp = 240;
var spBorderDw = 200;

var f = [];
var ball = [];
var elem = [];
const eleNum = 20;
var NUM = 700;

var selectColor;

var countTimeElem = 0;
var countTimeFire = 0;
var countTimeReturn = 0;

var ballOn = true;
var burstOn = false;
var gaugeOn = false;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //createCanvas(512, 256);

    //noCanvas();
    //var capture = createCapture(VIDEO);

    tmpx = width / 2;
    // tmpy = height - 200;
    tmpy = height / 2;


    posx = tmpx;
    posy = tmpy;

    soundWindow = {
        position: {
            x: 0,
            y: 0
        },
        width: width,
        height: height / 3
    };

    mic = new p5.AudioIn();

    fftw = new p5.FFT(0.8, 512);
    fftw.setInput(mic);

    ffts = new p5.FFT(0.8, 128);
    ffts.setInput(mic);

    mic.start();
}

function draw() {
    var waveform = fftw.waveform();
    var spectrum = ffts.analyze();

    background(255);

    console.log(mic);
    // サウンドグラフのウィンドウ
    /*
    fill(0);
    rect(soundWindow.position.x, soundWindow.position.y, soundWindow.width, soundWindow.height);
    */


    if (ballOn) {
        if (gaugeOn) {
            fill(0, 200, 200);
            noStroke();
            var v = map(r, R, R * 10, 0, width);
            rect(0, 0, v, 50);
        }

        /*
        var vr = map(R*10-20, R, R*10, 0, width);
        stroke(0);
        line(vr, 0, vr, 100);
        */
    }

    var maxOsc = 0;
    var maxSp = 0;
    var x1, y1, x2, y2, x3, y3, x4, y4, x5, y5;
    var moveUp = false;
    var moveDown = false;
    var elemOn = false;
    var fireGo = false;

    // 波形描画
    beginShape();
    for (var i = 0; i < waveform.length; i++) {
        //var x = map(i, 0, waveform.length, 0, soundWindow.width);
        //var y = map(waveform[i], -1.0, 1.0, soundWindow.position.y+soundWindow.height, soundWindow.position.y);
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1.0, 1.0, height, 0);
        noFill();
        stroke(0);
        strokeWeight(2);
        //vertex(x, y)

        /*
        // 波の設定地点
        var l = map(voiceLevel, -1.0, 1.0, soundWindow.position.y+soundWindow.height, soundWindow.position.y);
        var l = map(voiceLevel, -1.0, 1.0, soundWindow.position.y+soundWindow.height, soundWindow.position.y);
        var l = map(voiceLevel, -1.0, 1.0, soundWindow.position.y+soundWindow.height, soundWindow.position.y);
        push();
        stroke(255,100,100, 1);
        line(soundWindow.position.x, l, soundWindow.width, l);
        stroke(255,100,100, 1);
        line(soundWindow.position.x, l, soundWindow.width, l);
        stroke(255,100,100, 1);
        line(soundWindow.position.x, l, soundWindow.width, l);
        pop();
        */

        //console.log(waveform[i]);


        if (r <= R * 10) {
            if (abs(waveform[i]) >= voiceLevel[0]) { // レベル１
                r += 0.02;

                elemOn = true;

                if (abs(waveform[i]) >= voiceLevel[1]) { // レベル２
                    r += 0.02;

                    if (abs(waveform[i]) >= voiceLevel[2]) { // レベル３
                        r += 0.02;

                    }
                }
            }
        }


        if (r > R) {
            r -= 0.003;
        } else if (r < R) {
            r += 0.003;
        }

    }
    endShape();


    if (r >= R * 10 - 20) {
        for (var i = Math.floor(spectrum.length * (1 / 5)); i < spectrum.length; i++) { // default: 1/2
            if (spectrum[i] == Math.max.apply(null, spectrum)) {
                fireGo = true;
                break;
            }
        }

        // 満タン時の振動
        if (r > R * 10 - 1) {
            r -= 5;
        }
        //console.log(spectrum.length);
    }



    // エナジーボールの処理

    if (ball.length !== 1) {
        energyBall(posx, posy, r);

        /*
        selectColor = Math.floor(random(2));
        switch (selectColor) {
            case 0:
                ball[0].color.set(255,100,20);
                break;
            
            case 1:
                ball[0].color.set(100,255,20);
                break;

            default:
                break;
        }

        console.log(selectColor);
        */
    }
    if (ballOn) {
        if (ball[0].radius < R) {
            ball[0].radius += 1;
            ball[0].draw();
            if (ball[0].radius > R) {
                r = R;
            }
        } else {
            ball[0].radius = r;
            ball[0].draw();
        }
        //console.log(ball[0].radius);
    } else {
        elem = [];
    }

    if (elemOn) {
        energyElement();
        countTimeElem = 0;

    } else {
        countTimeElem++;
        if (countTimeElem / 60 == 2) {
            /*
            for(var i = 0; i < elem.length; i++) {
                elem[i].color.set()
            }
            */
            //elem = [];

            for (var i = 0; i < elem.length; i++) {
                if (elem[i].radius > 0) {
                    elem[i].radius -= 1.5;
                }
            }
            countTimeElem--;
        }
    }

    var hit = false;

    for (var i = 0; i < elem.length; i++) {
        if (ballOn) {
            elem[i].update();

            /*
            switch (selectColor) {
                case 0:
                    elem[i].color.set(random(60,100),random(50,150),255);
                    break;
                
                case 1:
                    elem[i].color.set(255,random(50,150),random(60,100));
                    break;
    
                default:
                    break;
            }
            */

            elem[i].draw();
        }

        hit = collideCircleCircle(ball[0].location.x, ball[0].location.y, r,
            elem[i].location.x, elem[i].location.y, elem[i].radius);

        if (hit) {
            //r += 5;
            elem.splice(i, 1);
            hit = false;
        }
    }

    // 爆けるエフェクト
    if (fireGo) {
        firework(posx, posy);
        if (ball.length == 1) {
            //console.log(true);
            ball = [];
        }
        r = R;
        ballOn = false;
        burstOn = true;
    }

    if (burstOn) {
        for (var i = 0; i < NUM; i++) {
            f[i].update();

            /*
            switch (selectColor) {
                case 0:
                    f[i].color.set(255,100,20);
                    break;
                
                case 1:
                    f[i].color.set(100,255,20);
                    break;
    
                default:
                    break;
            }
            */

            f[i].draw();
            //f[i].bounceOffWalls();
        }


        countTimeFire++;
        if (countTimeFire / 60 == 6) {
            for (var i = 0; i < NUM; i++) {
                if (f[i].radius > 0) {
                    f[i].radius -= 0.5;
                }
            }
            countTimeFire--;
        }

        countTimeReturn++;
    }

    // リセット
    if (countTimeReturn / 60 == 8) {
        reset();
    }


    //var vl = map(waveform[i], -1.0, 1.0, 0, 10);

    console.log(gaugeOn);


    // スペクトラム描画
    //     /*
    // for (var i = 0; i < spectrum.length; i++) {
    //     var x = map(i, 0, spectrum.length, 0, soundWindow.width);
    //     var y = map(spectrum[i], 0, 255, 0, soundWindow.height);
    //     fill(255);
    //     stroke(0);
    //     strokeWeight(2);
    //     rect(x, soundWindow.position.y + soundWindow.height, (soundWindow.width) / spectrum.length, -y);


    //     // スペクトラムの設定地点
    //     var lu = map(spBorderUp, 0, 255, 0, soundWindow.height);
    //     var ld = map(spBorderDw, 0, 255, 0, soundWindow.height);
    //     push();
    //     stroke(100, 255, 100, 1);
    //     line(soundWindow.position.x, soundWindow.height - lu, soundWindow.width, soundWindow.height - lu);
    //     stroke(100, 255, 250, 1);
    //     line(soundWindow.position.x, soundWindow.height - ld, soundWindow.width, soundWindow.height - ld);
    //     pop();


    //     // 最大スペクトラム
    //     if (spectrum[i] == Math.max.apply(null, spectrum)) { //> maxOsc) {
    //         // スペクトラムの最大値の色づけ
    //         fill(220, 30, 0);
    //         rect(x, soundWindow.position.y + soundWindow.height, soundWindow.width / spectrum.length, -y);
    //     }

    // }
    //     */



    //console.log(maxSp, maxOsc);

    /*
    if(posy > height - r/2) {
        posy = height - r/2;
    }
    else if(posy < soundWindow.height + r/2) {
        posy = soundWindow.height + r/2;
    }
    */


    //energyBall(posx, posy, r);

    //energyElement();

    /*
    fill(200,50,0);
    stroke(0);
    ellipse(posx, posy, r, r);
    */


    //console.log(posx, posy);

    /*
        spectrum.sort(
            function(a,b) {
                if(a < b) return 1;
                if(a > b) return -1;
                return 0;
            }
        )
    */
    // console.log(spectrum);

}

function mouseClicked() {
    //fireGo = true;
    //r += 50;
    if (collidePointRect(mouseX, mouseY, 0, 0, width, 50)) {
        if (gaugeOn) {
            gaugeOn = false;
        } else {
            gaugeOn = true;
        }
    } else {
        reset();
    }
}

function touchStarted() {
    getAudioContext().resume();

    fireGo = true;
    return false;
}

function touchMoved() {
    return false;
}

function touchEnded() {
    fireGo = true;
    return false;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function reset() {
    countTimeFire = 0;
    countTimeReturn = 0;
    ballOn = true;
    burstOn = false;
    r = 0;
    elem = [];
}

function firework(x, y) {
    drawOn2 = true;
    var w = x; //random(100, width-100);
    var h = y; //random(100, height-100);
    NUM = random(300, NUM);
    for (var i = 0; i < NUM; i++) {
        f[i] = new Fireball();
        //f[i].location.set(mouseX, mouseY);
        f[i].location.set(w, h);
        var angle = random(PI * 2.0);
        var length = random(0.5, 20);
        var posX = cos(angle) * length;
        var posY = sin(angle) * length;
        f[i].velocity.set(0.0, 0.0);
        f[i].acceleration.set(posX, posY);
        f[i].gravity.set(0.0, 0.0);
        f[i].radius = random(10, 35);
        f[i].color.set(255, 100, 20);
    }
}

function energyBall(posx, posy, r) {
    //var ball = new Ball();
    ball.push(new Ball());
    ball[0].location.set(posx, posy);
    ball[0].radius = r;
    ball[0].color.set(255, 100, 20);
}

function energyElement() {
    elem.push(new Energy());
    elem[elem.length - 1].location.set(posx + random(-r, r), posy + random(-r, r));
    elem[elem.length - 1].radius = random(R / 6, R / 2);
    //elem[elem.length-1].color.set(157,204,224);
    //elem[elem.length-1].color.set(80,100,255);
    elem[elem.length - 1].color.set(random(60, 100), random(100, 200), 255);
    var rad = -Math.atan2(ball[0].location.y - elem[elem.length - 1].location.y, ball[0].location.x - elem[elem.length - 1].location.x);
    elem[elem.length - 1].velocity.set(cos(rad) * vel, -sin(rad) * vel);
}