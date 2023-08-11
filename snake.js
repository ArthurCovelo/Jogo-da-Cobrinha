/// classes

// classe que representa os blocos da cobrinha
function Jogador(x, y, index)
{
    this.x = x;             // armazena a posicao deste bloco
    this.y = y;
    
    this.tempX = index == 0 ? 0 : jogador[index - 1].x;     // armazena a posicao do bloco anterior
    this.tempY = index == 0 ? 0 : jogador[index - 1].y;
    
    this.w = sizes.cel.w;   // tamanho do bloco
    this.h = sizes.cel.h;
    
    this.index = index;     // posicao do bloco dentro do vetor que compoe a cobrinha
    this.img = imgs.head;   // sprite a ser desenhado
    
    this.ang = index == 0 ? 0 : jogador[index - 1].ang;     // rotacao do bloco, herdada do bloco anterior a cada update
    this.tempA = index == 0 ? 0 : jogador[index - 1].ang;
    
    this.valve = true;      // variavel auxiliar que controla o input, impedindo que o jogador dê mais de um comando por update
    
    this.Update = function(){
        
        // corpo
        if(this.index != 0)
        {
            this.x = this.tempX;        // atualiza a posicao deste bloco
            this.y = this.tempY;
            
            this.ang = this.tempA;      // atualiza a rotacao deste bloco
            
            // armazena os dados do bloco anterior para usar no proximo update
            this.tempX = jogador[this.index - 1].x;
            this.tempY = jogador[this.index - 1].y;
            this.tempA = jogador[this.index - 1].ang;
            
            // atualiza o sprite do bloco
            this.img = imgs.body;
            if(this.index == jogador.length - 1)    // se esse e o ultimo bloco ...
            {
                this.img = imgs.tail;               // ... sprite da calda
            }
            else if(this.ang != jogador[this.index - 1].ang)    // verifica se houve mudanca na rotacao
            {
                // seleciona o sprite de acordo com a direcao
                if(((this.ang < jogador[this.index - 1].ang && jogador[this.index - 1].ang != 0)
                    || (jogador[this.index - 1].ang == 0 && this.ang == 1.5))
                    && !(jogador[this.index - 1].ang == 1.5 && this.ang == 0))
                {
                    this.img = imgs.curve1;
                }
                else
                {
                    this.img = imgs.curve2;
                }
            }
        }
        // cabeca
        else
        {
            this.Ang(this.ang);     // atualiza a posicao da cabeca
            this.tempA = this.ang;
        }
        
        this.valve = true;          // libera o input para o proximo update
    }
    
    // atualiza a posicao da cabeca de acordo com a direcao, dada pelo angulo em radianos
    // 0 = esquerda, 0.5 = baixo, 1 = direita, 1.5 = cima.
    this.Ang = function(ang){
        
        switch(ang)
        {
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
    
    // recebe o input e atualiza a direcao
    this.Direction = function(keycode){
        
        if(this.valve)                      // somente uma vez por update
        {
            switch(keycode)
            {
                case 37:                    // keycode 37 = seta direita
                    if(this.ang != 0)       // nao pode virar 180
                    {
                        this.ang = 1;       // atualiza o angulo para direita
                        this.valve = false; // nao pode mais aceitar comandos nesse update
                    }
                    break;
                case 38:                    // ... seta pra cima
                    if(this.ang != 0.5)     // nao pode virar 180
                    {
                        this.ang = 1.5;     // ... cima
                        this.valve = false; // ...
                    }
                    break;
                case 39:                    // ... esquerda
                    if(this.ang != 1)       // ...
                    {
                        this.ang = 0;       // ... esquerda
                        this.valve = false; // ...
                    }
                    break;
                case 40:                    // ... baixo
                    if(this.ang != 1.5)     // ...
                    {
                        this.ang = 0.5;     // ... baixo
                        this.valve = false; // ...
                    }
                    break;
            }
        }
    }
    
    // retorna um Vector2 com a posicao do bloco
    this.Position = function(){
        
        var pos = {x: this.x + (this.w / 2), y: this.y + (this.h / 2)}
        return pos;
    }
    
    // retorna um box do bloco pra ser usado pelo collision manager
    this.BoundingBox = function(){
        
        var bb = {x: this.x, y: this.y, w: this.w, h: this.h}
        return bb;
        
    }
    
    // desenha o bloco
    this.Draw = function(){
        
        DrawCel(this.x, this.y, this.w, this.h, this.tempA, this.img);
    }
}

// classe que representa a fruta
function Alvo()
{
    this.x;
    this.y;
    this.w;
    this.h;
    this.ang = -0.05;
    this.img = imgs.fruit;
    
    // chamada para atualizar a posicao da fruta apos ser comida
    this.Refresh = function()
    {
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
    
    // ...
    this.Position = function(){
        var pos = {x: this.x + (this.w / 2), y: this.y + (this.h / 2)}
        return pos;
    }
    
    // ...
    this.BoundingBox = function(){
        var bb = {x: this.x, y: this.y, w: this.w, h: this.h}
        return bb;
        
    }
    
    // ...
    this.Draw = function()
    {
        // rotaciona a fruta
        this.ang += 0.05;
        if(this.ang >= 2)
        {
            this.ang = 0;
        }
        DrawCel(this.x, this.y, this.w, this.h, this.ang, this.img);    // ... lembrei pq
    }
}

// classe que representa os botoes na tela de jogo
function Button(x, y, w, h, func)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.func = func;       // armazena a funcao do botao
    
    // seleciona o sprite de acordo com a funcao
    this.img = function(){
        
        var image;
        
        switch(this.func)
        {
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
    this.BoundingBox = function(){
        var bb = {x: this.x, y: this.y, w: this.w, h: this.h}
        return bb;
        
    }
    
    // ...
    this.Draw = function(){
        
        ctx.drawImage(this.img(), x, y, w, h);
    }
}


/// variaveis
var canvas, ctx, sizes, ingame = false;
var jogador, alvo, cM, inputs;                  // objetos do jogo
var update, draw, speed = 1, framerate = 16;    // variaveis referentes ao loop de jogo
var imgs;                                       // armazena os sprites em um vetor
var points = 0;                                 // pontuacao


/// funções
function Inicialize()
{
    //alert("bla");
    
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    
    // armazena os tamanhos e proporcoes da tela e dos objetos do jogo
    sizes = {cnvS: 0, ratio: 0, botton: 0, top: 0, screen: 0, cel: 0, brd: 0}
    
    Resize();   // seta o tamanho da tela e as proporcoes dos objetos no jogo
    
    /// carrega os sprites
    imgs = {head: new Image(), fruit: new Image(), body: new Image(), curve1: new Image(), curve2: new Image(), tail: new Image(),
        bg: new Image(), btUp: new Image(), btDown: new Image(), btLeft: new Image(), btRight: new Image()}
    
        imgs.head.src = "head.png"; imgs.fruit.src = "Apple.png"; imgs.body.src = "body.png";
        imgs.curve1.src = "curve1.png"; imgs.curve2.src = "curve2.png"; imgs.tail.src = "tail.png";
        imgs.bg.src = "snake_background.jpg"; imgs.btUp.src = "Up_button.png"; imgs.btDown.src = "Down_button.png";
        imgs.btLeft.src = "Left_button.png"; imgs.btRight.src = "Right_button.png";
    ///
    
    cM = new CollisionManager();    // cria o objeto que fara os testes de colisao
    
    // cria os botoes
    inputs = new Array();
    inputs[0] = new Button(sizes.botton.x, sizes.botton.y + (sizes.botton.h * (1 / 3)), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "left");
    inputs[1] = new Button(sizes.botton.x + sizes.botton.w / 2, sizes.botton.y + (sizes.botton.h * (1 / 3)), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "right");
    inputs[2] = new Button(sizes.botton.x + sizes.botton.w / 4, sizes.botton.y, sizes.botton.w / 2, sizes.botton.h * (1 / 3), "up");
    inputs[3] = new Button(sizes.botton.x + sizes.botton.w / 4, sizes.botton.y + sizes.botton.h * (2 / 3), sizes.botton.w / 2, sizes.botton.h * (1 / 3), "down");
    
    Awake();    // cria os objetos do jogo
    
    // permite utilizar inputs de teclado
    window.addEventListener("keydown", function(e){
        
        // {up: 38, down: 40, left: 37, right: 39, enter: 13}
        
        switch(e.keyCode)
        {
            case 13:
                if(!ingame)
                {
                    Start();    // inicia o jogo
                }else{
                    Pause();    // pausa o jogo
                }
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                jogador[0].Direction(e.keyCode);    // inputs direcionais
                break;
            default:
                break;
        }
    });
    
    // permite utilizar inputs do mouse
    canvas.addEventListener("click", function(e){
        
        var mousePos = {x: e.clientX, y: e.clientY}
        
        Event(mousePos);
    });
    
    // permite utilizar touch
    canvas.addEventListener("touchstart", function(e){
        
        var touchPos = {x: e[0].clientX, y: e[0].clientY}
        
        Event(touchPos);
    });
}

// recebe inputs do mouse ou touch
function Event(pPos)
{
    for(var i = 0; i < inputs.length; i++)
    {
        if(cM.ChkCollision(inputs[i].BoundingBox(), pPos))  // verifica se a posicao do click coincide com algum objeto clicavel na tela
        {
            switch(inputs[i].func)
            {
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
                    //jogador[0].Direction(13);
                    break;
            }
        }
    }
}

// inicializa os objetos do jogo
function Awake()
{
    // a cobrinha e um vetor de blocos que trabalham individualmente, sequindo o bloco anterior,
    // exceto o primeiro, a cabeca, que recebe inputs e segue na direcao ordenada
    jogador = new Array();
    jogador[0] = new Jogador(sizes.cel.w  + sizes.screen.x, sizes.cel.h + sizes.screen.y, 0);
    
    // maca
    alvo = new Alvo();
    alvo.Refresh();
    
    // add ao collision manager
    cM.AddCollisor(jogador[0]);
    cM.AddCollided(alvo);
    
    Draw();
}

// inicia ou despausa o jogo
function Start()
{
    Update();
    
    // cria o loop de jogo
    update = setInterval("Update()", 500 / speed);
    draw = setInterval("Draw()", framerate);
    
    ingame = true;
}

function Loop() { /*Definindo loop da partida para jogar novamente*/
    update();
    Draw();
    window.requestAnimationFrame(loop);
}

function Update()
{
    // isso determina que ao chegar em 10 pontos o jogo acaba
    // pode incrementar a pontuação pra aumentar a duracao
    // ou comentar esse trecho pro jogo seguir indefinidadmente
    if(points >= 10)
    {
        GameOver(true);
    }
    
    // atualiza a cobrinha
    for(var i = 0; i < jogador.length; i++)
    {
        jogador[i].Update();
    }
    
    cM.Update();
}

// classe que representa os testes de colisao
function CollisionManager()
{
    this.collisor = new Array();    // colisores dinamicos
    this.collided = new Array();    // colisores estaticos
    
    this.AddCollisor = function(collisor){
        
        this.collisor[this.collisor.length] = collisor;
    }
    
    this.AddCollided = function(collider){
        
        this.collided[this.collided.length] = collider;
    }
    
    this.Reset = function(){
        
        this.collisor = 0;
        this.collisor = new Array();
        this.collided = 0;
        this.collided = new Array();
    }
    
    this.Update = function(){
        
        for(var i = 0; i < this.collisor.length; i++)       // cehcamos colisao entre um colisor dinamico e qualquer outra coisa
        {
            var _thisI = this.collisor[i];
            
            for(var j = 0; j < this.collided.length; j++)   // checamos colisao entre colisor estatico e dinamico, nao entre estatico e estatico
            {
                var _thisJ = this.collided[j];
                
                if(this.ChkCollision(_thisJ.BoundingBox(), _thisI.Position()))      // verifica interseccao entre objetos
                {
                    PowerUp();  // colisores estaticos sao resumidamente a maca
                    return;
                }
            }
            
            for(var j = 0; j < this.collisor.length; j++)   // checamos colisao entre colisor dinamico e dinamico
            {
                var _thisJ = this.collisor[j];
                
                // subentende-se que blocos sequenciais da cobrinha estao em contato, mas nao colidindo
                // isto evita essa confusao
                if(i != j && (j + 1 != i && j - 1 != i))
                {
                    if(this.ChkCollision(_thisJ.BoundingBox(), _thisI.Position()))  // verifica interseccao entre objetos
                    {
                        GameOver(false);    // colisores dinamicos sao resumidamente os blocos da cobrinha
                        return;
                    }
                }
            }
            
            // checa colisao com as paredes
            if(!this.ChkCollision(sizes.screen, _thisI.Position()))
            {
                GameOver(false);
                return;
            }
        }
    }
    
    // checa interseccao entre objetos
    this.ChkCollision = function(bb, pos){
        
        // isso e da epoca que eu nao conhecia AABB, colisao entre retangulos sem rotacao.
        // tem uma formula mais simples, mas agora ja era
        if((pos.x > bb.x && pos.x < bb.x + bb.w) && (pos.y > bb.y && pos.y < bb.y + bb.h))
            return true;
        else
            return false;
    }
}

// desenha na tela
function Draw()
{
    /// nao precisa fazer os dois, pode usar so o segundo
    // limpa a tela do update anterior
    ctx.clearRect(sizes.cnvS.x, sizes.cnvS.y,
            sizes.cnvS.w, sizes.cnvS.h);
    
    // pinta a tela toda de preto
    ctx.fillStyle = "black";
    ctx.fillRect(sizes.cnvS.x, sizes.cnvS.y, sizes.cnvS.w, sizes.cnvS.h);
    ///
    
    ctx.fillStyle = "white";
    ctx.font = "30px Arial Black";
    ctx.textAlign = "center";
    var text = "Press Enter to Start!";
    ctx.fillText(text, sizes.cnvS.w / 2, sizes.cnvS.h / 2);
    
    // desenha o background
    ctx.drawImage(imgs.bg, sizes.screen.x, sizes.screen.y, sizes.screen.w, sizes.screen.h);
    
    ctx.fillStyle = "white";
    ctx.font = "30px Arial Black";
    ctx.textAlign = "center";
    var text = "Points: " + points + "         Speed: " + speed;
    ctx.fillText(text, sizes.cnvS.w / 2, sizes.top.h - sizes.brd);
    
    //DrawGrid();       // isso era pra debug, serve para desenhar a grade por onde a cobra se movimenta
    
    // desenha a cobrinha
    for(var i = jogador.length; i > 0; i--)
    {
        jogador[i - 1].Draw();  // desenha cada bloco
    }
    
    alvo.Draw();    // desenha a fruta
    
    // desenha os botoes
    for(var i = 0; i < inputs.length; i++)
    {
        inputs[i].Draw();
    }
}

// desenha um grid na tela. isso era pra debug, pode ignorar
function DrawGrid()
{
    var celsX = (sizes.ratio.x * 10);
    var celsY = (sizes.ratio.y * 10);
    
    for(var i = 0; i < celsX; i++)
    {
        for(var j = 0; j < celsY; j++)
        {
            var draw = {    x: sizes.screen.x + (sizes.cel.w * i),
                    y: sizes.screen.y + (sizes.cel.h * j),
                    w: sizes.screen.w / celsX, h: sizes.screen.h / celsY}
            
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(draw.x, draw.y, draw.w, draw.h);
        }
    }
}

// desenha os blocos do jogo (cobrinha e maca)
function DrawCel(x, y, w, h, ang, img)
{
    var cx = (x + (x + w)) / 2;
    var cy = (y + (y + h)) / 2;
    
    ctx.translate(cx, cy);
    ctx.rotate(ang * Math.PI);
    
    // e aqui que desenha mesmo, o resto todo e pra fazer rotacao, ja que essa linguagem nao implementa isso.
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    
    ctx.rotate(-ang * Math.PI);
    ctx.translate(-cx, -cy);
}

// redimensiona a tela
// originalmente permitia mudar o tamanho e a orientacao da tela pelo jogo,
// tinha botoes na tela pra isso. agora so serve pra setar essas variaveis ao carregar a pagina
function Resize()
{
    
    if(!ingame)
    {
        sizes.brd = 4;
        sizes.cnvS = {x: 0/*canvas.getBoundingClientRect().left*/, y: 0/*canvas.getBoundingClientRect().top*/,
                w: 800 + (sizes.brd * 2), h: 600 + (sizes.brd * 2)}
        sizes.ratio = {x: 4, y: 2}
        sizes.botton = {x: sizes.cnvS.x + sizes.brd, y: sizes.cnvS.y + sizes.cnvS.h - sizes.cnvS.h / 4 + sizes.brd,
                w: sizes.cnvS.w - (sizes.brd * 2), h: sizes.cnvS.h - sizes.cnvS.h * (3 / 4) - sizes.brd * 2}
        sizes.top = {w: sizes.cnvS.w - (sizes.brd * 2), h: sizes.cnvS.h / 10 - sizes.brd}
        sizes.screen = {x: sizes.cnvS.x + sizes.brd, y: sizes.cnvS.y + sizes.brd + sizes.top.h, w: sizes.cnvS.w - (sizes.brd * 2),
                h: sizes.cnvS.h - sizes.top.h - sizes.botton.h - sizes.brd * 3}
        sizes.cel = {w: sizes.screen.w / (sizes.ratio.x * 10), h: sizes.screen.h / (sizes.ratio.y * 10)}
        
        canvas.width = sizes.cnvS.w;
        canvas.height = sizes.cnvS.h;
    }
}

// chamada quando a cobrinha come a maca
function PowerUp()
{
    points++;   // atualiza a pontuacao

    // atualiza a velocidade do jogo a cada 5 pontos
    if(points%5 == 0 && points != 0)
    {
        speed++;
        clearInterval(update);
        update = 0;
        update = setInterval("Update()", 500 / speed);
    }

    alvo.Refresh();     // reposiciona a maca aleatoriamente

    // incrementa a cobrinha com mais um bloco
    var j = jogador[jogador.length - 1];
    jogador[j.index + 1] = new Jogador(j.x, j.y, j.index + 1);
    cM.AddCollisor(jogador[j.index + 1]);
}

function Pause()
{
    clearInterval(update);
    clearInterval(draw);
    update = 0;
    draw = 0;
    
    ingame = false;
}

function GameOver(victory) { /*Definindo as vitorias do jogador como gameOver*/
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