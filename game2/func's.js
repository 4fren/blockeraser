let eachEffectList = [[250, 1000], [25, 75], [1, 4], ["bit", "interdestructiveness"], [2], ["Dodge"], [0, 1], ["ON"], 1];
let bonus = Array(9).fill().map((_, i) => i*500);
bonus.shift();

let word;
let totalScore;
let scoreMultiplier;
let specialEffectFlag;
let generationNumber;
let movingDistance;
let sec1;
let sec2;
let modeFlag;
let movingSpeed;
let comboContinuation;

let effectCounter;

let currentParameters;
let setParameters;

let effectPointer;
let determinedEffect1;
let determinedEffect2;

let score;
let scoreFluctuationRate;

let penalty;

let timelimit;

let score_copy;
let combo;
let totalCombo;

let timer1;
let timer2;
let timer3;
let timer4;
let timer5;

if(! localStorage.getItem('BlockErasingGame_BestScore')){
    localStorage.setItem('BlockErasingGame_BestScore', 0);
};

function displayExplanation(){
    document.getElementById("explanation").style.visibility = 'visible';
};

function deleteExplanation(){
    document.getElementById("explanation").style.visibility = 'hidden';
};

function showRule(){
    displayExplanation();
    document.getElementById("rule").setAttribute('onclick', "deleteRule();");
};

function deleteRule(){
    deleteExplanation();
    document.getElementById("rule").setAttribute('onclick', "showRule();");
};

function setWord(word){
    let h1 = document.getElementById("h1");
    h1.innerText = word;
};

function setMovingSpeed(movingSpeed){
    let h1 = document.getElementById("h1");
    h1.style.transition = "linear " + movingSpeed + "s";
};

function setInformation(information){
    let table = document.getElementsByClassName("status");
    for(let i=0; i<table.length; i++){
    table[i].innerText = information[i];
    };
};

function setColorOnTheTable(currentParameters, setParameters){
    let table = document.getElementsByTagName("tr");
    for(let i=0; i<table.length; i++){
    table[i].style.backgroundColor = "rgb(255, 255, 255)"
    if(currentParameters[i] != setParameters[i]){
        table[i].style.backgroundColor = "rgb(255, 255, 0)"
    };
    };
};

function setBestScore(){
    let score = Number(document.getElementById("totalScore").innerText);
    if(score > Number(localStorage.getItem('BlockErasingGame_BestScore'))){
        localStorage.setItem('BlockErasingGame_BestScore', score);
    };
    };

function removeAllBlocks(){
    $('.blockDiv').remove();
};

function rand(multiple){
    let random = Math.floor(Math.random() * multiple);

    return random;
};

let colorList = Array(100).fill("rgba(0, 0, 0, 0.5)");
let specialColorPercentage = 0.3;
let specialColorList = ["rgb(255, 0, 0)", "rgb(0, 0, 255)", "rgb(0, 0, 0)", "rgb(255, 153, 255)"];
let eachSpecialColorPercentageList = [0.2, 0.6, 0.1, 0.1];

function makeColorList(){
    let count = 0;
    let allcount = 0;
    let specialColorWidth = colorList.length * specialColorPercentage;
    for(let i=0; i<eachSpecialColorPercentageList.length; i++){
    while(count<specialColorWidth*eachSpecialColorPercentageList[i]){
        colorList[allcount] = specialColorList[i];
        count += 1;
        allcount += 1;
    };
    count = 0;
    };
};

makeColorList();

function makeDiv(){
    //wid = window.innerWidth
    let randomPX = rand(100);

    let color = colorList[rand(colorList.length)]
    
    let blockDiv = document.createElement("div");
    blockDiv.setAttribute('class', 'blockDiv');
    blockDiv.style.top = 0 + 'px';
    blockDiv.style.left = randomPX + '%';
    blockDiv.style.backgroundColor = color;
    blockDiv.style.width = 20 + 'px';
    blockDiv.style.height = 20 + 'px';
    document.body.appendChild(blockDiv)
};

function moveDiv(distance){
    let blockDiv = document.getElementsByClassName('blockDiv');

    let hei = window.innerHeight;

    for(let i=0; i<blockDiv.length; i++){
    let top = getComputedStyle(blockDiv[i]).top;
    //let left = getComputedStyle(blockDiv[i]).left;
    //let right = getComputedStyle(blockDiv[i]).right;
    let replacedTop = Number(top.replace('px', ''));
    //let replacedLeft = Number(left.replace('px', ''));
    //let replacedRight = Number(right.replace('px', ''));
    replacedTop += distance;
    //replacedLeft += 10;
    //replacedRight -= 10;

    if(replacedTop >= hei){
        blockDiv[i].remove();
        if(currentParameters[5] == "Erase"){
        totalScore -= 1 * scoreFluctuationRate;
        if(currentParameters[7] != "ON"){
            if(getComputedStyle(blockDiv[i]).backgroundColor != 'rgb(0, 0, 0)' && getComputedStyle(blockDiv[i]).backgroundColor !='rgb(255, 153, 255)'){
            totalCombo = 0;
            };
        };
        
        document.getElementById("totalScore").textContent = totalScore.toString();
        document.getElementById("combo").innerText = totalCombo;
        };
    }else{
        blockDiv[i].style.top = replacedTop + 'px';
    //blockDiv[i].style.left = replacedLeft + 'px';
    //blockDiv[i].style.right = replacedRight + 'px';
    };
    };
};

/**
* @param rect1
* @param rect2
* @return boolean
*/
function detectCollision(rect1, rect2) {
    if( ( ( rect1.xStart <= rect2.xStart && rect2.xStart <= rect1.xEnd ) ||
        ( rect1.xStart <= rect2.xEnd && rect2.xEnd <= rect1.xEnd ) ) &&
        ( ( rect1.yStart <= rect2.yStart && rect2.yStart <= rect1.yEnd ) ||
        ( rect1.yStart <= rect2.yEnd && rect2.yEnd <= rect1.yEnd ) )
    ) {
    return true;
    } else {
    return false;
    }
}
/**
* @param e Element
* @return Object
*/
function createBoundingClientRect(e) {
    let x = (window.pageXOffset !== undefined)
    ? window.pageXOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    let y = (window.pageYOffset !== undefined)
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    let rect = e.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    let xStart = rect.left + x;
    let xEnd = xStart + width;
    let yStart = rect.top + y;
    let yEnd = yStart + height;
    return {
    rect: rect,
    width: width,
    height: height,
    xStart: xStart,
    xEnd: xEnd,
    yStart: yStart,
    yEnd: yEnd
    };
};

function startGame(){
    word = "disintegration";
    totalScore = 0;
    scoreMultiplier = 1;
    specialEffectFlag = 0;
    generationNumber = 2;
    movingDistance = 40;
    sec1 = 400;
    sec2 = 30;
    modeFlag = "Erase";
    movingSpeed = 0.5;
    comboContinuation = "OFF";

    effectCounter = 1;

    currentParameters = [sec1, movingDistance, generationNumber, word, scoreMultiplier, modeFlag, movingSpeed, comboContinuation];
    setParameters = currentParameters.concat();

    scoreFluctuationRate = 1;
    
    penalty = 0;

    timelimit = 90;

    combo = 0;
    totalCombo = 0;

    document.getElementById("timer").innerText = 0;
    document.getElementById("totalScore").innerText = totalScore;
    document.getElementById("limit").innerText = timelimit;
    document.getElementById("combo").innerText = combo;

    setWord(word);
    setMovingSpeed(movingSpeed);
    setInformation(currentParameters);
    setColorOnTheTable(currentParameters, setParameters);

    document.getElementById("bestScore").innerText = localStorage.getItem('BlockErasingGame_BestScore');

    timer5 = setInterval(function(){
    timelimit--;
    document.getElementById("limit").innerText = timelimit;

    if(timelimit <= 0){
        clearInterval(timer5);
        setBestScore();
        removeAllBlocks();
    };
    },1000);

    timer1 = setInterval(function(){
    //do something
    moveDiv(currentParameters[1]);

    if(timelimit <= 0){
        clearInterval(timer1);
    };
    },currentParameters[0]);

    timer4 = setInterval(function(){
    let element11 = document.querySelector('#h1');
    let element11Rect = createBoundingClientRect(element11);
    let element3 = document.querySelectorAll('.row');

    for(let ii=0; ii<element3.length; ii++){
        let element3Rect = createBoundingClientRect(element3[ii]);
        if(detectCollision(element3Rect, element11Rect)){
        scoreFluctuationRate = Number(element3[ii].innerText);
        document.getElementById("multiplier").innerText = scoreFluctuationRate;
        };
    };

    if(timelimit <= 0){
        clearInterval(timer4);
    };
    },sec2);

    timer2 = setInterval(function(){
    //do something
    let element1 = document.querySelector('#h1');
    let element2 = document.querySelectorAll('.blockDiv');
    let element1Rect = createBoundingClientRect(element1);

    for(let i=0; i<element2.length; i++){
        let element2Rect = createBoundingClientRect(element2[i]);
        if(detectCollision(element1Rect, element2Rect)){
        console.log('Eclipse!');

        let bgc = getComputedStyle(element2[i]).backgroundColor;
        if(currentParameters[5] == "Erase"){
            if(bgc == 'rgb(255, 0, 0)'){
            score = 5;
            }else if(bgc == 'rgb(0, 0, 255)'){
            score = 2;
            }else if(bgc == 'rgb(0, 0, 0)'){
            totalScore = Math.floor(totalScore * 0.5);              
            score = 0;
            combo = 0;
            }else{
            score = 1;
            };

            combo = 1;
        }else if(currentParameters[5] == "Dodge"){
            if(bgc == 'rgb(255, 0, 0)'){
            score = -5;
            }else if(bgc == 'rgb(0, 0, 255)'){
            score = -2;
            }else if(bgc == 'rgb(0, 0, 0)'){
            //totalScore = Math.floor(totalScore * 0.5);
            score = 0;
            }else{
            score = -1;
            };

            penalty++;

            combo = 0;
        };

        if(bgc == 'rgb(255, 153, 255)'){
            if(specialEffectFlag == 0){
            effectPointer = rand(eachEffectList.length);
            //effectPointer = 7;
            determinedEffect1 = eachEffectList[effectPointer];

            let p_timer = document.getElementById("timer");

            if(determinedEffect1 instanceof Array){
                determinedEffect2 = determinedEffect1[rand(determinedEffect1.length)];
                currentParameters[effectPointer] = determinedEffect2;
                specialEffectFlag = 1;
                effectCounter = 10;
                p_timer.innerText = effectCounter;
            }else{
                effectCounter = 1;
                p_timer.innerText = effectCounter;
            };

            if(effectPointer == 6){
                setMovingSpeed(currentParameters[effectPointer]);
            }else if(effectPointer == 3){
                setWord(currentParameters[effectPointer]);
            }else if(effectPointer == 8){
                removeAllBlocks();
            };

            setInformation(currentParameters);

            setColorOnTheTable(currentParameters, setParameters);

            let effectTimer = setInterval(function(){
                //do something 
                if(effectCounter <= 1){
                currentParameters[effectPointer] = setParameters[effectPointer];
                if(effectPointer == 6){
                    setMovingSpeed(currentParameters[effectPointer]);
                }else if(effectPointer == 3){
                    setWord(currentParameters[effectPointer]);
                }else if(effectPointer == 5){
                    totalScore += Math.floor(10 * scoreFluctuationRate * (1 * (1 + totalCombo * 0.1))) - penalty;
                };

                setInformation(currentParameters);

                setColorOnTheTable(currentParameters, setParameters);

                specialEffectFlag = 0;
                clearInterval(effectTimer);
                console.log("finish");
                };

                penalty = 0;

                effectCounter--;
                p_timer.innerText = effectCounter;

                if(timelimit <= 0){
                clearInterval(effectTimer);
                };
            },1000);
            }else if(specialEffectFlag == 1){
            totalScore -= 10 * scoreMultiplier * scoreFluctuationRate;
            combo = 0;
            };
        };
        
        element2[i].remove();

        totalScore += Math.floor(score * scoreMultiplier * scoreFluctuationRate * (1 * (1 + totalCombo * 0.1)));

        if(currentParameters[7] == "ON"){
            combo = 1;
        };
        totalCombo += combo;

        
        
        document.getElementById("totalScore").textContent = totalScore.toString();
        document.getElementById("combo").innerText = totalCombo;
        };
    };

    if(totalScore >= bonus[0]){
        timelimit += 10;
        bonus.shift();
    };

    if(timelimit <= 0){
        clearInterval(timer2);
    };
    },sec2);

    timer3 = setInterval(function(){
    //do something
    for(let i=0; i<currentParameters[2]; i++){
        makeDiv();
    };      

    if(timelimit <= 0){
        clearInterval(timer3);
        removeAllBlocks();
    };
    },currentParameters[0]);
};

//startGame();

stkx=0;stky=0;
pntx=0;pnty=0;
stks=1;//????????????

let element5 = document.querySelector("body");
let element5Rect = createBoundingClientRect(element5);

function deviceJudgment(){
    if(element5Rect.xEnd <= element5Rect.yEnd){
    return true;
    }else{
    return false;
    };
};

function setWordSize(){
    if(deviceJudgment() == true){
    document.getElementById("h1").style.fontSize = '110%';
    };
};

setWordSize();

document.addEventListener('mousemove',mv,false);
document.addEventListener('touchmove',mvt,false);

timer=setInterval(function(){
    stkx=(stkx*stks+pntx)/(stks+1);
    stky=(stky*stks+pnty)/(stks+1);
    h1.style.left=stkx+'px';
    h1.style.top=stky+'px';
},10);

function mv(e){
    let height = getComputedStyle(h1).height;
    let replacedHeight = Number(height.replace('px', ''))
    let width = getComputedStyle(h1).width;
    let replacedWidth = Number(width.replace('px', ''));

    if((e.pageY > element5Rect.yEnd) || (e.pageY < element5Rect.yStart) || (e.pageX < element5Rect.xStart) || (e.pageX > element5Rect.xEnd)){
    pntx = element5Rect.xEnd*0.25;
    pnty = element5Rect.yEnd*0.25;
    }else{
    pntx=e.pageX-replacedWidth*0.5;
    pnty=e.pageY-replacedHeight*0.5;
    };
}

function mvt(e){
    let height = getComputedStyle(h1).height;
    let replacedHeight = Number(height.replace('px', ''))
    let width = getComputedStyle(h1).width;
    let replacedWidth = Number(width.replace('px', ''));

    pntx=e.touches[0].pageX-replacedWidth*0.5;
    pnty=e.touches[0].pageY-replacedHeight*0.5;
}

function clearTimer(){
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
    clearInterval(timer4);
    clearInterval(timer5);
};

document.querySelector("#start").addEventListener('click', () => {
    removeAllBlocks();
});

function reset(){
    clearTimer();
};