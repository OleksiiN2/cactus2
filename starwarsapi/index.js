window.onload = function(){

    var url = 'https://swapi.co/api/people/?page=';///?page=2
    
    //вызов создание списка и пагинации
    getPeople("");

    function getPeople(e){ 

        var page = 1;
        //проверяем запрос при лоаде, или при переходе на другую страницу
        if(e.target){
            let target = e.target;
            page = target.getAttribute('goto');
        }

        fetch(url+page)
            .then(function (resp) {
            return resp.json()
        })
            .then(function (data) {
         
                //удаляем существующий список,подпись и пагинацию,если есть при переходе между страницами
                const ulForDelete1 = document.getElementsByTagName("ul");
                const h5ForDelete = document.getElementsByTagName("h5")[0];
                if(h5ForDelete != "undefind" && h5ForDelete != "" && h5ForDelete != null){
                    const h5parent = h5ForDelete.parentElement;
                    h5parent.removeChild(h5ForDelete);
                }
                if(ulForDelete1.length>0){
                    for (i=ulForDelete1.length-1; i>=0; i--){
                        let parent = ulForDelete1[i].parentElement;
                        parent.removeChild(ulForDelete1[i]);
                    }
                }

                //строим список из ответа
                let ul = document.createElement('ul');
                ul.id = "peopleList";
                document.body.appendChild(ul);
                
                let totalRows = data.count;
                let pagesCnt = Math.ceil(totalRows*1 / 10) ;//общее к-во страниц
                
                //определяем предыдующую страницу для пагинации
                if(data.previous){
                    var prevPage = data.previous.split('=')[1];
                } else{
                    var prevPage = 1;
                }
                //определяем следующую страницу для пагинации
                if(data.next){
                    var nextPage = data.next.split('=')[1];
                } else{
                    var nextPage = pagesCnt;
                }
                
                //создаем строки в списке
                for (var item of data.results) {
                    let li = document.createElement('li');
                    li.innerHTML = item.name;
                    li.id = item.url;
                    li.addEventListener('click', getDetails)
                    ul.appendChild(li);
                }

                //добавляем пагинацию
                let ulPagination = document.createElement('ul');
                ulPagination.classList.add("pagination","justify-content-center");
                //кнопка previous
                let liPrev = document.createElement("li");
                liPrev.classList.add("page-item");
                if(!data.previous){
                    liPrev.classList.add("disabled");
                }  
                
                let aPrev = document.createElement("a");
                aPrev.classList.add("page-link");
                aPrev.setAttribute("href", "#");
                aPrev.setAttribute("goto",prevPage);
                aPrev.innerHTML = "Previous";
                liPrev.appendChild(aPrev);

                //кнопка next
                let liNext = document.createElement("li");
                liNext.classList.add("page-item");
                if(!data.next){
                    liNext.classList.add("disabled");
                } 
                            
                let aNext = document.createElement("a");
                aNext.classList.add("page-link");
                aNext.setAttribute("href", "#");
                aNext.setAttribute("goto",nextPage);
                aNext.innerHTML = "Next";
                liNext.appendChild(aNext);

                ulPagination.appendChild(liPrev);
                //добавляем в цикле 3 промежуточные кнопки в зависимости от номера текущей страницы
                for(i = prevPage ; i<prevPage*1+3 && i<=pagesCnt; i++){
                    let li = document.createElement("li");
                    li.classList.add("page-item");
                    if(i==page){
                        li.classList.add("active");
                    }                               
                    let a = document.createElement("a");
                    a.classList.add("page-link");
                    
                    a.setAttribute("href", "#");
                    a.setAttribute("goto",i);
                    a.innerHTML = i;
                    li.appendChild(a);
                    ulPagination.appendChild(li);
                }
                ulPagination.appendChild(liNext);
                document.body.appendChild(ulPagination);
            
                var paginationLiArray = document.getElementsByClassName("page-link");

                //addEventListener на каждую кнопку пагинации
                for (var i = 0; i < paginationLiArray.length; i++) {
                    paginationLiArray[i].addEventListener('click', getPeople);
                }
                const reserved = document.createElement("h5");
                reserved.innerHTML = "@2019 Oleksii Nedosiek -onedosiek@gmail.com-"
                document.body.appendChild(reserved);
            
            });
    };

    //получаем детализацию по персонажу, с детализации получаем ссылки на планету, вид, фильмы.  
    async function getDetails(e){
        //удаляем ивентЛисенер для избежания двойного клика и повторного запроса данных
        e.target.removeEventListener('click', getDetails);

        //определяем место клика на елементе списка, чтоб свернуть детализацию
        let target;
        if(e.target.tagName === "LI" && e.target.parentElement.parentElement.tagName !=="TD"){
            target = e.target;
        } else if(e.target.tagName === "LI" && e.target.parentElement.parentElement.parentElement.parentElement.tagName ==="TABLE"){
            target = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        } else if(e.target.tagName === "UL" && e.target.parentElement.parentElement.parentElement.tagName ==="TABLE"){
            target = e.target.parentElement.parentElement.parentElement.parentElement;
        } else if((e.target.tagName === "TD" || e.target.tagName === "TH") && e.target.parentElement.parentElement.tagName ==="TABLE"){
            target = e.target.parentElement.parentElement.parentElement;
        } else if(e.target.tagName === "TR" && e.target.parentElement.tagName ==="TABLE"){
            target = e.target.parentElement.parentElement;
        } else if(e.target.tagName === "TABLE"){
            target = e.target.parentElement;
        }

        let urlPeopleDetails = target.id;
        let detailsTable = document.querySelector('table[linked="'+urlPeopleDetails+'"]');
        //если детали по персонажу уже запрашивались, просто открываем список. При переходе между страницами происходит перезапись и условие пойдет в else
        if(detailsTable){
            detailsTable.classList.toggle("hideDetails");
            target.addEventListener('click', getDetails);//добавляем ивентЛисенер назад
        } else{
            //получаем детали персонажа
            return fetch(urlPeopleDetails)
                    .then(function (resp) {
                        return resp.json()
                    })
                    .then(function (data) {
                        let dataSet = [data.name,data.birth_year,data.gender];
                        let homePlanetUrl = data.homeworld;//ссылка на планету
                        let speciesUrl = data.species[0];//ссылка на вид
                        let filmsUrl = data.films;//массив ссылок на фильмы

                        //получаем родную планету
                        return  fetch(homePlanetUrl)
                            .then(function (resp) {
                                return resp.json()
                            })
                            .then(function (data) {
                                let homePlanet = data.name 
                                dataSet.push(homePlanet); 

                                //получаем вид
                                return  fetch(speciesUrl)
                                    .then(function (resp) {
                                        return resp.json()
                                    })
                                        .then(function (data) {
                                            let species = data.name;   
                                            dataSet.push(species);   
                                          
                                            //получаем фильмы
                                            return getFilms(filmsUrl)
                                                .then(function(resp){
                                                    dataSet.push(resp); 
                                                    openDetails(dataSet,target);
                                                    target.addEventListener('click', getDetails);//добавляем ивентЛисенер назад
                                                });      
                                        })  
                            })
                    })
        } 
    }

    //функция получения фильмов
    async function getFilms(url){
        let filmNameArray = new Array();
        for(i=0;i<url.length; i++){
            await fetch(url[i])
                .then(function (resp) {
                    return resp.json()
                })
                    .then(function (data) {
                        filmNameArray.push(data.title)   
                    })   
        }
        return filmNameArray
    }

    //формируем таблицу 
    function openDetails(dataSet,target){
        let table = document.createElement("table");
        table.setAttribute("linked",target.id);
        let trHeader = document.createElement("tr");
        let th1 = document.createElement("th");
        th1.innerHTML = "Name";
        let th2 = document.createElement("th");
        th2.innerHTML = "Date of birth";
        let th3 = document.createElement("th");
        th3.innerHTML = "Gender";
        let th4 = document.createElement("th");
        th4.innerHTML = "Home planet";
        let th5 = document.createElement("th");
        th5.innerHTML = "Genus";
        let th6 = document.createElement("th");
        th6.innerHTML = "Met in films";
        trHeader.appendChild(th1); 
        trHeader.appendChild(th2);
        trHeader.appendChild(th3);
        trHeader.appendChild(th4);
        trHeader.appendChild(th5);
        trHeader.appendChild(th6);
        
        let trData = document.createElement("tr");
        for(i=0; i<dataSet.length; i++){
            let td = document.createElement("td");
            //если массив фильмов
            if(typeof dataSet[i] == "object"){
                let ulFilms = document.createElement("ul");
                let filmArrLength = dataSet[i].length;
                for(j=0;j<dataSet[i].length;j++){
                    let liFilms = document.createElement("li");
                    liFilms.innerHTML = dataSet[i][j]; console.log(dataSet[i][j])
                    ulFilms.appendChild(liFilms);    
                } 
                td.appendChild(ulFilms);
            }else{
                td.innerHTML = dataSet[i];//если строки(остальные елементы массива параметров)
            }
            trData.appendChild(td);
        }
        table.appendChild(trHeader);
        table.appendChild(trData);
        target.appendChild(table);   
    }
}