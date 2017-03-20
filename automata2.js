document.body.style="margin:0px";
const w=16;
const h=16;
const c1="black";
const c2="white";
const spacerColor="skyblue"
const context = document.getElementById("canvas").getContext("2d");
const wid = Math.floor(window.innerWidth/w);
const hei = Math.floor(window.innerHeight / h);

const numCells = wid * hei;
const iterations = 270;

const wrap = false;

function rand() {
    return Array(numCells).fill().map(a=>~~(Math.random()*2))
}

function rand2() {
    const f = 3;
    return Array(numCells).fill().map((a,b)=>b<numCells/f||b%wid<wid/f||b%wid>(f-1)*wid/f||b>(f-1)*numCells/f?0:Math.random()>0.1?0:1)
}
function rand3() {
    let re = Array(numCells).fill(0);
    re[234+wid*4]=1;
    re[235+wid*4]=1;
    re[236+wid*4]=1;
    return re;
}

function draw(context){
    let line = this.line;
    let ar = this.d;
    ar.forEach((cel,pos)=>drawRect(context, cel?c1:c2, (pos%wid)*w, (Math.floor(pos/wid))*h, w,h));
    this.line++;
    return this;
}

function drawRect(context, color, x, y, w, h) {
    context.fillStyle = color;
    context.fillRect(x,y,w,h)
}

function GOLtest(n){
    return n.toString(2).split("").map(parse10).reduce(sum);//-((n&(1<<4))>>4);
}

const GOL = Array(1<<9).fill().map(function(a,b){
    let nu = GOLtest(b);
    if (b&(1<<4)) {
        if (nu == 3 || nu == 4)
            return 1;
        return 0;
    } else {
        if (nu == 3 ) {
            return 1;
        }
        return 0;
    }
})
const rule = GOL//Array(1<<9).fill().map(a=>Math.random()>0.1?0:1);//[1,1,1,0,1,0,0,0]
console.log("Rule: " + rule)

function grow(cel,pos,ar){
    const len = ar.length;
    //a1, a2, a3
    //b1, b2, b3
    //c1, c2, c3
    let a1 = pos-wid-1;
    let a2 = pos-wid;
    let a3 = pos-wid+1;
    let b1 = pos-1;
    let b2 = pos;
    let b3 = pos+1;
    let c1 = pos+wid-1;
    let c2 = pos+wid;
    let c3 = pos+wid+1;
    let o1 = [-wid,-wid,-wid,0,0,0,wid,wid,wid];
    let o2 = [-1,0,1,-1,0,1,-1,0,1];


    const none = -wid*hei;

    let dat = Array(9).fill(pos)
    .map((a,b)=>a+o1[b])
    .map(function(a){
        if (a < 0) {
            if (wrap) {
                a += wid*hei;
            }
            else {
                a = none;
            }
        }
        if (a > wid*hei) {
            if (wrap) {
                a -= wid*hei;
            }
            else {
                a = none;
            }
        }
        return a;
    })
    .map((a,b)=>a+o2[b])
    .map(function(a){
        if (a==none)
            return none;
        if ((a + 1 + wid)%wid == 0&& pos%wid == 0){
            a = wrap?a + wid:none;
        }
        if ((a - 1 + wid)%wid == wid-1 && pos%wid == wid-1) {
            a = wrap?a - wid:none;
        }
        return a;
    })
    .map(a=>a==none?0:ar[a])
    .map((a,b)=>a<<(8-b))
    .reduce(sum);
    return rule[dat];
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
        },{draw:draw}).repeat(n,
            function(){
                draw.call(this,context);
                this.d = this.d.map(grow);
                return this;
            }
        );
}

init();
// makeStuff(iterations)
m = Monad({line:0,d:rand2()},
    function(){
        this.d=[].map.apply(this.d,[].slice.call(arguments))
        return this;
    },{draw:draw});
inter = setInterval(function(){
    m=m.draw(context);
    m=m(grow);
    if(m().d.reduce(sum) == 0) {
        m.draw(context);
        clearInterval(inter);
    }
}, 1)
