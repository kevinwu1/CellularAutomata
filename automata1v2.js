document.body.style="margin:0px";
const w=4;
const h=4;
const c1="black";
const c2="white";
const spacerColor="skyblue"
const context = document.getElementById("canvas").getContext("2d");


const numCells = Math.floor(window.innerWidth/w);
const iterations = 270;

function rand() {
    return Array(numCells).fill().map(a=>~~(Math.random()*2))
}

function draw(context){
    let line = this.line;
    let ar = this.d;
    ar.forEach((cel,pos)=>drawRect(context, cel?c1:c2, pos*w, line*h, w,h));
    this.line++;
    return this;
}

function drawRect(context, color, x, y, w, h) {
    context.fillStyle = color;
    context.fillRect(x,y,w,h)
}


const rule = Array(8).fill().map(a=>~~(Math.random()*2));//[1,1,1,0,1,0,0,0]
console.log("Rule: " + rule)

function showRule(){
    let d=makeElement("div",window.innerWidth,h*4,"white");
    let dw = document.createElement("div");
    dw.style.position="absolute";
    dw.style.left="50%";
    let d1=makeElement("div",33*w,h,"white");
    let d2=makeElement("div",33*w,h,"white");
    [cell(0,spacerColor)].concat(Array(8).fill().map((a,b)=>[(~~(b/4))%2,(~~(b/2))%2,b%2]).map(function(a){
        let a0 = cell(a[0]);
        let a1 = cell(a[1]);
        let a2 = cell(a[2]);
        let spacer = cell(0,spacerColor);
        return [a0,a1,a2,spacer]
    }).reduce((a,b)=>a.concat(b))).forEach(d1.appendChild.bind(d1));
    [cell(0,spacerColor)].concat(Array(8).fill().map((a,b)=>b).map(function(a){
        let a0 = cell(0,spacerColor);
        let a1 = cell(rule[a]);
        let a2 = cell(0,spacerColor);
        let spacer = cell(0,spacerColor);
        return [a0,a1,a2,spacer]
    }).reduce((a,b)=>a.concat(b))).forEach(d2.appendChild.bind(d2));
    dw.appendChild(d1);
    dw.appendChild(d2);
    d1.style.position="relative"
    d2.style.position="relative"
    d1.style.left="-50%"
    d2.style.left="-50%"
    d.appendChild(dw);
    document.getElementById("rule").appendChild(d)
}

showRule();
//"10010100".split("").map(parse)
/*=
[
    1,//000
    0,//001
    0,//010
    1,//011
    0,//100
    1,//101
    1,//110
    0//111
]
*/
function grow(cel,pos,ar){
    const len = ar.length;
    return rule[
        ar[(pos-1+len)%len]*4
        +cel*2
        +ar[(pos+1)%len]];
}
function init(){
    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = h*iterations;
}

function makeStuff(n){
    m = Monad({line:0,d:rand()},
        function(){
            this.d=[].map.apply(this.d,[].slice.call(arguments))
            return this;
        },[draw]).repeat(n,
            function(){
                draw.call(this,context);
                this.d = this.d.map(grow);
                return this;
            }
        );
}

init();
makeStuff(iterations)
// m = Monad({line:0,d:rand()},
//     function(){
//         this.d=[].map.apply(this.d,[].slice.call(arguments))
//         return this;
//     },[draw]);
// setInterval(function(){
//     m=m.draw(context);
//     m=m(grow);
// }, 25)
