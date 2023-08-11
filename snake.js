
function Jogador(x, y, index) {
    this.x = x;
    this.y = y;

    this.tempX = index == 0 ? 0 : jogador[index - 1].x;
    this.tempY = index == 0 ? 0 : jogador[index - 1].y;

    this.w = sizes.cel.w;
    this.h = sizes.cel.h;

    this.index = index;
    this.img = imgs.head;

    this.ang = index == 0 ? 0 : jogador[index - 1].ang;
    this.tempA = index == 0 ? 0 : jogador[index - 1].ang;

    this.valve = true;

    this.Update = function () {


        if (this.index != 0) {
            this.x = this.tempX;
            this.y = this.tempY;

            this.ang = this.tempA;


            this.tempX = jogador[this.index - 1].x;
            this.tempY = jogador[this.index - 1].y;
            this.tempA = jogador[this.index - 1].ang;


            this.img = imgs.body;
            if (this.index == jogador.length - 1) {
                this.img = imgs.tail;
            }
            else if (this.ang != jogador[this.index - 1].ang) {

                if (((this.ang < jogador[this.index - 1].ang && jogador[this.index - 1].ang != 0)
                    || (jogador[this.index - 1].ang == 0 && this.ang == 1.5))
                    && !(jogador[this.index - 1].ang == 1.5 && this.ang == 0)) {
                    this.img = imgs.curve1;
                }
                else {
                    this.img = imgs.curve2;
                }
            }
        }

        else {
            this.Ang(this.ang);
            this.tempA = this.ang;
        }

        this.valve = true;
    }


    this.Ang = function (ang) {

        switch (ang) {
            case 0:
                this.x = this.x + sizes.cel.w;
                break;
            case 0.5:
                this.y = this.y + sizes.cel.h;
                break;
            case 1:
                this.x = this.x - sizes.cel.w;
                break;
            case 1.5:
                this.y = this.y - sizes.cel.h;
                break;
        }
    }


    this.Direction = function (keycode) {

        if (this.valve) {
            switch (keycode) {
                case 37:
                    if (this.ang != 0) {
                        this.ang = 1;
                        this.valve = false;
                    }
                    break;
                case 38:
                    if (this.ang != 0.5) {
                        this.ang = 1.5;
                        this.valve = false;
                    }
                    break;
                case 39:
                    if (this.ang != 1) {
                        this.ang = 0;
                        this.valve = false;
                    }
                    break;
                case 40:
                    if (this.ang != 1.5) {
                        this.ang = 0.5;
                        this.valve = false;
                    }
                    break;
            }
        }
    }


    this.Position = function () {

        var pos = { x: this.x + (this.w / 2), y: this.y + (this.h / 2) }
        return pos;
    }


    this.BoundingBox = function () {

        var bb = { x: this.x, y: this.y, w: this.w, h: this.h }
        return bb;

    }


    this.Draw = function () {

        DrawCel(this.x, this.y, this.w, this.h, this.tempA, this.img);
    }
}


function Alvo() {
    this.x;
    this.y;
    this.w;
    this.h;
    this.ang = -0.05;
    this.img = imgs.fruit;

    this.Refresh = function () {
        var minX = 0;
        var minY = 0;
        var maxX = sizes.ratio.x * 10;
        var maxY = sizes.ratio.y * 10;

        this.x = sizes.screen.x + (Math.floor(Math.random() * (maxX - minX)) * sizes.cel.w);
        this.y = sizes.screen.y + (Math.floor(Math.random() * (maxY - minY)) * sizes.cel.h);
        this.w = sizes.cel.w;
        this.h = sizes.cel.h;
        this.ang = -0.05;
    }


    this.Position = function () {
        var pos = { x: this.x + (this.w / 2), y: this.y + (this.h / 2) }
        return pos;
    }


    this.BoundingBox = function () {
        var bb = { x: this.x, y: this.y, w: this.w, h: this.h }
        return bb;

    }

    this.Draw = function () {

        this.ang += 0.05;
        if (this.ang >= 2) {
            this.ang = 0;
        }
        DrawCel(this.x, this.y, this.w, this.h, this.ang, this.img);
    }
}


function Button(x, y, w, h, func) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.func = func;


    this.img = function () {

        var image;

        switch (this.func) {
            case "up":
                image = imgs.btUp;
                break;
            case "down":
                image = imgs.btDown;
                break;
            case "left":
                image = imgs.btLeft;
                break;
            case "right":
                image = imgs.btRight;
                break;
            default:
                image = null;
                break;
        }
        return image;
    }

    // ...
    this.BoundingBox = function () {
        var bb = { x: this.x, y: this.y, w: this.w, h: this.h }
        return bb;

    }

    // ...
    this.Draw = function () {

        ctx.drawImage(this.img(), x, y, w, h);
    }
}



var canvas, ctx, sizes, ingame = false;
var jogador, alvo, cM, inputs;
var update, draw, speed = 1, framerate = 16;
var imgs;
var points = 0;



function Inicialize() {


    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");


    sizes = { cnvS: 0, ratio: 0, botton: 0, top: 0, screen: 0, cel: 0, brd: 0 }

    Resize();

    imgs = {
        head: new Image(), fruit: new Image(), body: new Image(), curve1: new Image(), curve2: new Image(), tail: new Image(),
        bg: new Image(), btUp: new Image(), btDown: new Image(), btLeft: new Image(), btRight: new Image()
    }

    imgs.head.src = "head.png"; imgs.fruit.src = "Apple.png"; imgs.body.src = "body.png";
    imgs.curve1.src = "curve1.png"; imgs.curve2.src = "curve2.png"; imgs.tail.src = "tail.png";
    imgs.bg.src = "snake_background.jpg"; imgs.btUp.src = "Up_button.png"; imgs.btDown.src = "Down_button.png";
    imgs.btLeft.src = "Left_button.png"; imgs.btRight.src = "Right_button.png";


    cM = new CollisionManager();


    inputs = new Array();
    inputs[0] = new Button(sizes.botton.x, sizes.botton.y + (sizes.botton.h * (1 / 3)), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "left");
    inputs[1] = new Button(sizes.botton.x + sizes.botton.w / 2, sizes.botton.y + (sizes.botton.h * (1 / 3)), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "right");
    inputs[2] = new Button(sizes.botton.x + sizes.botton.w / 4, sizes.botton.y, sizes.botton.w / 2, sizes.botton.h * (1 / 3), "up");
    inputs[3] = new Button(sizes.botton.x + sizes.botton.w / 4, sizes.botton.y + sizes.botton.h * (2 / 3), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "down");

    Awake();


    window.addEventListener("keydown", function (e) {

        switch (e.keyCode) {
            case 13:
                if (!ingame) {
                    Start();
                } else {
                    Pause();
                }
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                jogador[0].Direction(e.keyCode);
                break;
            default:
                break;
        }
    });


    canvas.addEventListener("click", function (e) {

        var mousePos = { x: e.clientX, y: e.clientY }

        Event(mousePos);
    });


    canvas.addEventListener("touchstart", function (e) {

        var touchPos = { x: e[0].clientX, y: e[0].clientY }

        Event(touchPos);
    });
}
function Event(pPos) {
    for (var i = 0; i < inputs.length; i++) {
        if (cM.ChkCollision(inputs[i].BoundingBox(), pPos)) {
            switch (inputs[i].func) {
                case "up":
                    jogador[0].Direction(38);
                    break;
                case "down":
                    jogador[0].Direction(40);
                    break;
                case "left":
                    jogador[0].Direction(37);
                    break;
                case "right":
                    jogador[0].Direction(39);
                    break;
                case "enter":
                    break;
            }
        }
    }
}


function Awake() {

    jogador = new Array();
    jogador[0] = new Jogador(sizes.cel.w + sizes.screen.x, sizes.cel.h + sizes.screen.y, 0);


    alvo = new Alvo();
    alvo.Refresh();

    cM.AddCollisor(jogador[0]);
    cM.AddCollided(alvo);

    Draw();
}

function Start() {
    Update();

    update = setInterval("Update()", 500 / speed);
    draw = setInterval("Draw()", framerate);

    ingame = true;
}

function Loop() {
    update();
    Draw();
    window.requestAnimationFrame(loop);
}

function Update() {

    if (points >= 10) {
        GameOver(true);
    }

    for (var i = 0; i < jogador.length; i++) {
        jogador[i].Update();
    }

    cM.Update();
}


function CollisionManager() {
    this.collisor = new Array();
    this.collided = new Array();

    this.AddCollisor = function (collisor) {

        this.collisor[this.collisor.length] = collisor;
    }

    this.AddCollided = function (collider) {

        this.collided[this.collided.length] = collider;
    }

    this.Reset = function () {

        this.collisor = 0;
        this.collisor = new Array();
        this.collided = 0;
        this.collided = new Array();
    }

    this.Update = function () {

        for (var i = 0; i < this.collisor.length; i++) {
            var _thisI = this.collisor[i];

            for (var j = 0; j < this.collided.length; j++) {
                var _thisJ = this.collided[j];

                if (this.ChkCollision(_thisJ.BoundingBox(), _thisI.Position())) {
                    PowerUp();
                    return;
                }
            }

            for (var j = 0; j < this.collisor.length; j++) {
                var _thisJ = this.collisor[j];


                if (i != j && (j + 1 != i && j - 1 != i)) {
                    if (this.ChkCollision(_thisJ.BoundingBox(), _thisI.Position())) {
                        GameOver(false);
                        return;
                    }
                }
            }


            if (!this.ChkCollision(sizes.screen, _thisI.Position())) {
                GameOver(false);
                return;
            }
        }
    }


    this.ChkCollision = function (bb, pos) {


        if ((pos.x > bb.x && pos.x < bb.x + bb.w) && (pos.y > bb.y && pos.y < bb.y + bb.h))
            return true;
        else
            return false;
    }
}

function Draw() {

    ctx.clearRect(sizes.cnvS.x, sizes.cnvS.y,
        sizes.cnvS.w, sizes.cnvS.h);


    ctx.fillStyle = "black";
    ctx.fillRect(sizes.cnvS.x, sizes.cnvS.y, sizes.cnvS.w, sizes.cnvS.h);


    ctx.fillStyle = "white";
    ctx.font = "30px Arial Black";
    ctx.textAlign = "center";
    var text = "Press Enter to Start!";
    ctx.fillText(text, sizes.cnvS.w / 2, sizes.cnvS.h / 2);

    ctx.drawImage(imgs.bg, sizes.screen.x, sizes.screen.y, sizes.screen.w, sizes.screen.h);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial Black";
    ctx.textAlign = "center";
    var text = "Points: " + points + "         Speed: " + speed;
    ctx.fillText(text, sizes.cnvS.w / 2, sizes.top.h - sizes.brd);

    for (var i = jogador.length; i > 0; i--) {
        jogador[i - 1].Draw();
    }

    alvo.Draw();

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].Draw();
    }
}
function DrawGrid() {
    var celsX = (sizes.ratio.x * 10);
    var celsY = (sizes.ratio.y * 10);

    for (var i = 0; i < celsX; i++) {
        for (var j = 0; j < celsY; j++) {
            var draw = {
                x: sizes.screen.x + (sizes.cel.w * i),
                y: sizes.screen.y + (sizes.cel.h * j),
                w: sizes.screen.w / celsX, h: sizes.screen.h / celsY
            }

            ctx.strokeStyle = "yellow";
            ctx.strokeRect(draw.x, draw.y, draw.w, draw.h);
        }
    }
}
function DrawCel(x, y, w, h, ang, img) {
    var cx = (x + (x + w)) / 2;
    var cy = (y + (y + h)) / 2;

    ctx.translate(cx, cy);
    ctx.rotate(ang * Math.PI);

    ctx.drawImage(img, -w / 2, -h / 2, w, h);

    ctx.rotate(-ang * Math.PI);
    ctx.translate(-cx, -cy);
}

function Resize() {

    if (!ingame) {
        sizes.brd = 4;
        sizes.cnvS = {
            x: 0, y: 0,
            w: 800 + (sizes.brd * 2), h: 600 + (sizes.brd * 2)
        }
        sizes.ratio = { x: 4, y: 2 }
        sizes.botton = {
            x: sizes.cnvS.x + sizes.brd, y: sizes.cnvS.y + sizes.cnvS.h - sizes.cnvS.h / 4 + sizes.brd,
            w: sizes.cnvS.w - (sizes.brd * 2), h: sizes.cnvS.h - sizes.cnvS.h * (3 / 4) - sizes.brd * 2
        }
        sizes.top = { w: sizes.cnvS.w - (sizes.brd * 2), h: sizes.cnvS.h / 10 - sizes.brd }
        sizes.screen = {
            x: sizes.cnvS.x + sizes.brd, y: sizes.cnvS.y + sizes.brd + sizes.top.h, w: sizes.cnvS.w - (sizes.brd * 2),
            h: sizes.cnvS.h - sizes.top.h - sizes.botton.h - sizes.brd * 3
        }
        sizes.cel = { w: sizes.screen.w / (sizes.ratio.x * 10), h: sizes.screen.h / (sizes.ratio.y * 10) }

        canvas.width = sizes.cnvS.w;
        canvas.height = sizes.cnvS.h;
    }
}

function PowerUp() {
    points++;


    if (points % 5 == 0 && points != 0) {
        speed++;
        clearInterval(update);
        update = 0;
        update = setInterval("Update()", 500 / speed);
    }

    alvo.Refresh();


    var j = jogador[jogador.length - 1];
    jogador[j.index + 1] = new Jogador(j.x, j.y, j.index + 1);
    cM.AddCollisor(jogador[j.index + 1]);
}

function Pause() {
    clearInterval(update);
    clearInterval(draw);
    update = 0;
    draw = 0;

    ingame = false;
}

function GameOver(victory) {
    Pause();
    jogador = 0;
    alvo = 0;
    points = 0;
    speed = 1;
    cM.Reset();
    Awake();

    if (victory) {
        alert("Parabéns!!! Você ganhou!");
        alert("Aperte Enter para começar novamente...");
    }
    else {
        alert("Game Over");
        alert("Aperte Enter para começar novamente...");
    }
}