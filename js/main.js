'use strict';

let fulterInput = document.getElementById('fulter-input'),
    results = document.getElementById('autocomplete-result'),
    phone = document.getElementById('phone'),
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
    get('js/main.json').then((value) => { data = JSON.parse(value) });

    if(event.keyCode == "13"){
        event.preventDefault();
    }
});

// Поиск адрессов
fulterInput.addEventListener('keyup', function(event){
    results.innerHTML = '';
    toggleResults('hide');    

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
    let matchList = [];
    try{
        if(!data || Object.keys(data).length === 0)
            throw new Eroor('Данных нет');

        for(let item of data){
            /*if( item.url.toLowerCase().indexOf( inputText.toLowerCase() ) != -1 ){ }*/
            if (item.url.substr(0, inputText.length).toUpperCase() == inputText.toUpperCase()) {
                matchList.push( item.url );
            }
        }

    }catch(e){
        console.error(e.message)
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


function get(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.addEventListener('load', () => {
            resolve(xhr.responseText);
         });
    })
}