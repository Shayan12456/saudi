let n = 1;
let el = document.querySelector(`.r${n}`);
for(; n<=12; n++){
    if(n==2 || n==7){
        continue;
    }
    console.log(n);
    let el = document.querySelector(`.r${n}`);

    let inp1 = el.children[0].children[1];
    let inp2 = el.children[1].children[1];

    inp1.addEventListener('input', function() {
        inp2.value = inp1.value;
    });

    inp2.addEventListener('input', function() {
        inp1.value = inp2.value;
    });
}

