'use strict';

let fulterInput = document.getElementById('fulter-input'),
    results = document.getElementById('autocomplete-result'),
    phone = document.getElementById('phone'),
    getAjax = get(),
    data = {},
    matches = [],
    cursorIndex = 0,
    saveButton = document.getElementById('save-button'),
    cleanButton = document.getElementById('clean-button');

// Клик по кнопке сохранить
saveButton.addEventListener('click', function(){
    var reslult = false;

    for(let i=0; i < data.length; i++){
        if(fulterInput.value == data[i].url ){
            reslult = true;
            break;
        }
    }
    if(reslult){
        saveLocalStorage(fulterInput.value, phone.value);
    }    
});

// Клик по кнопке очистить
cleanButton.addEventListener('click', function(){
    clearLocalStorage();
});

window.onload = function(){
    if( localStorage.getItem('url') !== null ){
        fulterInput.value = localStorage.getItem('url');
    }
    if( localStorage.getItem('phone') !== null ){
        phone.value = localStorage.getItem('phone');
    }
}

document.addEventListener("click", function (e) {
    closeAllLists();
});

fulterInput.addEventListener('keydown', function(event){
    if(event.keyCode == "13"){
        event.preventDefault();
    }
});

// Поиск адрессов
fulterInput.addEventListener('keyup', function(event){
    results.innerHTML = '';
    toggleResults('hide');

    // var xhr = new XMLHttpRequest();
    // console.log(xhr);
    // xhr.open('GET', 'js/main.txt');
    // xhr.send();
    // xhr.addEventListener('load', () => {
    //     getAjax = xhr.responseText;
    //     console.log(xhr.responseText)
    // });

//     getAjax = get();
// console.log('getAjax',get );
    if(this.value.length > 0){
        matches = getMatches(this.value);

        if( matches.length > 0 ){
            displayMatches(matches);
        }
    }

    if(results.classList.contains('visible')){
        
        switch(event.keyCode){
            case 13:
                fulterInput.value = results.children[cursorIndex].innerHTML;
                toggleResults('hide');
                cursorIndex = 0;
                break;
            case 38:            
                if(cursorIndex > 0){
                    cursorIndex --;

                    cursorList(cursorIndex);
                }
                break;
            case 40:
                if(cursorIndex < ( matches.length -1 )){
                    cursorIndex ++;

                    cursorList(cursorIndex);
                }
                break;
        }
    }
});

function toggleResults(action){
    if(action == 'show'){
        results.classList.add('visible');
    }else if(action == 'hide'){
        results.classList.remove('visible');
    }
}

function getMatches(inputText){
    let matchList = [],
        item;
    for(let item of data){
    // for(let key in data){
    //  item = data[key];
        /*if( item.url.toLowerCase().indexOf( inputText.toLowerCase() ) != -1 ){
            matchList.push( item.url );
        }*/
        if (item.url.substr(0, inputText.length).toUpperCase() == inputText.toUpperCase()) {
            matchList.push( item.url );
        }

    }

    return matchList;
}

function displayMatches(matchList){
    let i = 0, li;

    while( i < matchList.length ){
        li = document.createElement("LI");
        li.setAttribute("index", i);
        li.innerHTML = matchList[i];

        li.addEventListener("click", function(event) {
            let index = this.getAttribute('index') || 0;
            fulterInput.value = this.innerText;
            cursorList(index);

            closeAllLists();
        });        

        results.appendChild(li);

        i++;
    }

    cursorList(cursorIndex);

    toggleResults('show');
}

function closeAllLists() {
    results.innerHTML = '';
}

function cursorList(pos){
    for(let i =0; i < results.children.length; i++){
        results.children[i].classList.remove('active');
    }

    results.children[pos].classList.add('active');

}

function saveLocalStorage(url, phone){
    localStorage.setItem('url', url);
    localStorage.setItem('phone', phone);
}

function clearLocalStorage(){
    localStorage.clear();
}

function get(){
    let xhr = new XMLHttpRequest(),
        url = 'js/main.json';

    xhr.open('GET', url);
    xhr.send();

    xhr.addEventListener('load', () => {
        if (xhr.status != 200) {
          console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
        } else {
            data = JSON.parse(xhr.responseText)
        }
    });

    
}