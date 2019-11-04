document.addEventListener('DOMContentLoaded', function(){

    let modal = document.querySelector('[class="modal"]');
    
    // Search panel
    const searchBar = document.forms['search-todo'].querySelector('#search-name');
    const searchStatus = document.forms['search-todo'].querySelector('#status');
    const searchPriority = document.forms['search-todo'].querySelector('#priority');
    searchBar.addEventListener('keyup',function(e){
        search();
    })
    searchStatus.addEventListener('change',function(e){
        search();
    })
    searchPriority.addEventListener('change',function(e){
        search();
    })
    
    function search(){
        const titleTerm = document.querySelector('#search-name').value.toLowerCase();
        const statusTermVal = document.querySelector('#status').value;
        const priorityTerm = document.querySelector('#priority').value;

        const statusTerm = (statusTermVal==="Done" || statusTermVal==="Open")?true:false;
        const todos = document.querySelectorAll('.todo');
        
        Array.from(todos).forEach(function(todo){
            const title = todo.querySelector('.titleContent').textContent;
            const status = todo.classList.contains("done"); 
            const priority = todo.querySelector('.priorityContent').textContent;
        
            if(!statusTerm && priorityTerm==="all"){ //empty status and priority
                if(title.toLowerCase().indexOf(titleTerm)!==-1){
                    todo.style.display = 'block'
                }
                else{
                    todo.style.display = 'none'
                }
            }
            else if(!statusTerm && priorityTerm!=="all"){//empty status 
                if(title.toLowerCase().indexOf(titleTerm)!==-1 && priority===priorityTerm){ 
                    todo.style.display = 'block'
                }
                else{
                    todo.style.display = 'none'
                }
            }
            else if(statusTerm && priorityTerm==="all"){//empty priority
                if(title.toLowerCase().indexOf(titleTerm)!==-1 && status && statusTermVal==="Done"){
                    todo.style.display = 'block'
                }
                else if(title.toLowerCase().indexOf(titleTerm)!==-1 && !status && statusTermVal==="Open"){
                    todo.style.display = 'block'
                }
                else{
                     todo.style.display = 'none'
                }
            }
            else{
                if(title.toLowerCase().indexOf(titleTerm)!==-1 && status && statusTermVal==="Done" && priority===priorityTerm){
                    todo.style.display = 'block'
                }
                else if(title.toLowerCase().indexOf(titleTerm)!==-1 && !status && statusTermVal==="Open" && priority===priorityTerm){
                    todo.style.display = 'block'
                }
                else{
                    todo.style.display = 'none'
                }
            }     
        })
    }
    // Search panel


    document.addEventListener('click', function (e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    
    // Close dropdown
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              let buttonid="";
                if (event.target.matches('.dropbtn')) {
                    buttonid = event.target.parentElement.querySelector(".dropdown-content").id;
                }
                if(buttonid!==openDropdown.id){
                    openDropdown.classList.remove('show');
                }
          } 
        }
   
    
    // Finish Todo
    if (target.getAttribute('class') == 'done'){
        let finishTodo =  target.parentElement.parentElement;
        finishTodo.classList.add('done');
        const finishTodoClone = finishTodo.cloneNode(true);

        const settings = finishTodoClone.querySelector(".dropbtn");
        settings.setAttribute("src","/jsband/done.png");
        
        const dropdown = finishTodoClone.querySelector(".dropdown-content");
        dropdown.parentNode.removeChild(dropdown);
        finishTodo.parentNode.removeChild(finishTodo);
        const divContent = document.getElementById("content");
        divContent.appendChild(finishTodoClone);
   }

    // Open dropdown
    if (target.getAttribute('class') == 'dropbtn'){
            target.parentElement.querySelector(".dropdown-content").classList.toggle("show"); 
    }

    // Delete Todo
    if (target.getAttribute('class') == 'delete'){
         let deleteBtn =  target.parentElement.parentElement;
         deleteBtn.parentNode.removeChild(deleteBtn);

    }


    // Open modal window
    if (target.hasAttribute('data-toggle') && (target.getAttribute('data-toggle') == 'modal' || target.getAttribute('data-toggle') == 'modalEdit')) {
        if (target.hasAttribute('data-target')) {
            let m_ID = target.getAttribute('data-target');
                      
            // check for edit modal
            if(target.getAttribute('data-toggle') == 'modalEdit'){
                let editTodo = target.parentElement.parentElement//.parentElement.parentElement;
                
                let editTitle = editTodo.querySelector('.titleContent').textContent;
                let editDesc = editTodo.querySelector('.descContent').textContent;
                let editPriority = editTodo.querySelector('.priorityContent').textContent;
                 //preset values edit modal              
                document.getElementById(m_ID).querySelector('#inputTitleEdit').value = editTitle;
                document.getElementById(m_ID).querySelector('#inputDescriptionEdit').value = editDesc;
                document.getElementById(m_ID).querySelector('#inputPriorityEdit').value = editPriority;
            }
            else{
                document.getElementById("inputTitle").value = "";
                document.getElementById("inputDescription").value = "";
            }

            document.getElementById(m_ID).classList.add('open');
            e.preventDefault();
        }
    }

    // Close modal window with 'data-dismiss' attribute or when the backdrop is clicked
    if ((target.hasAttribute('data-dismiss') && (target.getAttribute('data-dismiss') == 'modal' || target.getAttribute('data-dismiss') == 'modalEdit')) 
    || target.classList.contains('modal') ) {
        let modal = document.querySelector('[class="modal open"]');
        modal.classList.remove('open');
        e.preventDefault();
    }

    // Edit Todo
    if (target.getAttribute('class') == 'editTodo'){
        let editTodo = target.parentElement.parentElement.parentElement.parentElement.parentElement;
        let editTitle = editTodo.querySelector('.titleContent');
        let editDesc = editTodo.querySelector('.descContent');
        let editPriority = editTodo.querySelector('.priorityContent');
        
        const title = target.parentElement.parentElement.querySelector("#inputTitleEdit").value;
        const description = target.parentElement.parentElement.querySelector("#inputDescriptionEdit").value;  
        const priority = target.parentElement.parentElement.querySelector("#inputPriorityEdit").value; 
        
        editPriority.setAttribute("priority",priority);

        editTitle.textContent = title;
        editDesc.textContent = description;
        editPriority.textContent = priority;
        
        let modal = document.querySelector('[class="modal open"]');
        modal.classList.remove('open');   
    };   

    // Create new Todo
    if (target.getAttribute('class') == 'save'){
        const title = document.getElementById("inputTitle").value;
        const description = document.getElementById("inputDescription").value;
        const priority = document.getElementById("inputPriority").value;
       
        const divContent = document.getElementById("content");
        const divTodo = document.createElement('div');
        const h2Title = document.createElement('h2');
        const h2Desc = document.createElement('h2');
        const pPriority = document.createElement('p');
        const button = document.createElement('img');
        const divDropdown = document.createElement('div');
        
        const aDone = document.createElement('a');
        const aEdit = document.createElement('a');
        const aDelete = document.createElement('a');

        divTodo.classList.add('todo');
        divTodo.id = "todo_"+Date.now()+"_"+Math.floor(Math.random() * 999);

        h2Title.textContent = title;
        h2Title.classList.add('titleContent');
        h2Desc.textContent = description;
        h2Desc.classList.add('descContent');
        pPriority.textContent = priority;
        pPriority.classList.add('priorityContent');
        pPriority.setAttribute("priority",priority)

        button.classList.add('dropbtn');
        button.setAttribute("src","/jsband/settings.png");
        button.setAttribute("alt","settings");
      
        divDropdown.id = "dropdown_"+Date.now()+"_"+Math.floor(Math.random() * 999);
        divDropdown.classList.add('dropdown-content');
        
        aDone.textContent = "done";
        aEdit.textContent = "edit";
        aDelete.textContent = "delete";

        aDone.classList.add('done');
        aEdit.classList.add('edit');
        aDelete.classList.add('delete');

        let newDate = Date.now();
        aEdit.setAttribute("data-target","CreateModalEdit"+ newDate);
        aEdit.setAttribute("data-toggle","modalEdit");


        divDropdown.appendChild(aDone);
        divDropdown.appendChild(aEdit);
        divDropdown.appendChild(aDelete);
        divTodo.appendChild(divDropdown);
        divTodo.appendChild(button);
        divTodo.appendChild(h2Title);
        divTodo.appendChild(h2Desc);
        divTodo.appendChild(pPriority);
        
        divTodo.appendChild(button);
        divTodo.appendChild(divDropdown);

        const htmlModal = document.createElement ('div');
        htmlModal.id= "CreateModalEdit"+newDate;
        htmlModal.classList.add('modal');

        htmlModal.innerHTML = `
        
                   <div class="modal-window">
                            
                            <form id="add-todo">
                                    <div class="form-group">
                                      <label for="recipient-name" class="col-form-label">Title:</label><br>
                                      <input type="text" class="form-control" id="inputTitleEdit">
                                    </div>
                                    <div class="form-group">
                                      <label for="message-text" class="col-form-label">Description:</label><br>
                                      <textarea class="form-control" id="inputDescriptionEdit"></textarea>
                                    </div>
                                    <div class="form-group">
                                       <label for="message-text" class="col-form-label">Priority:</label><br>
                                     
                                        <select class="custom-select" id="inputPriorityEdit">
                                               
                                                <option value="High" selected>High</option>
                                                <option value="Normal">Normal</option>
                                                <option value="Low">Low</option>
                                              </select>
            
                                    </div>
                                    <div class="modalButtons">
                                        <button type="button" class="cancel" data-dismiss="modalEdit">Cancel</button>
                                        <button type="button" class="editTodo">Save</button>   
                                    </div>
                            </form>
                    
                    </div>
           
            `;
           
            divTodo.appendChild(htmlModal);
            divContent.insertBefore(divTodo, divContent.childNodes[0]);  
             //  divContent.appendChild(divTodo);

         modal.classList.remove('open'); 
    };
   
}, false);


})

