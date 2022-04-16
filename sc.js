const columns = document.querySelectorAll('.column')
let dragItem = null

// modal
let addBtnElm = document.getElementById("add_btn")
let overlayElm = document.getElementById("overlay")
let todoFormElm = document.getElementById("modal_todo_form")
let closeBtnElm = document.querySelector(".close-modal")

//add
let addColElm = document.getElementById("first_col")
let addElm = document.getElementById("todo_submit")
let inputElm = document.getElementById("todo_input")

addBtnElm.addEventListener("click", function(event){
    overlayElm.style.display = "block"
    todoFormElm.style.display = "block"
    inputElm.focus()
})
addBtnElm.addEventListener("dragstart", function(e){
    e.preventDefault()
    e.stopPropagation();
})

let hElm = document.getElementsByTagName("h1")
Array.from(hElm).forEach((ele)=>{
    ele.addEventListener("dragstart", function(e){
        e.preventDefault()
        e.stopPropagation()
    })
})

closeBtnElm.addEventListener("click", function(){
    overlayElm.style.display = "none"
    todoFormElm.style.display = "none"  
})


addElm.addEventListener("click", function(){
    let val = inputElm.value
    val = val[0].toUpperCase() + val.substring(1)
    Store.addTodo(val)
})

inputElm.addEventListener("keypress", function(event){
    if(event.key === 'Enter'){
        let val = inputElm.value
        val = val[0].toUpperCase() + val.substring(1)
        Store.addTodo(val)
    }
})


function dragStart() {
    dragItem = this
}

columns.forEach(column => {
    column.addEventListener('dragover', dragOver)
    column.addEventListener('drop', dragDrop)
    // console.log(column.id)
})

function dragOver(e) {
    e.preventDefault()
  }

function dragDrop() {
    this.append(dragItem)
    //this.id ==> column
    // dragItem.setAttribute("col-data", this.id)
    // console.log(dragItem);
    // console.log(this.id);
    // if(this.id === sec_col){
    //     dragItem
    // }
    // console.log(dragItem.getAttribute("col-data"));
    // Store.change(this.id,dragItem.getAttribute("data-id"))
}  

columns.forEach((column) => {
    new Sortable(column, {
        group: "shared",
        animation: 300,
        ghostClass: "blue-background-class"
    })
})

let itemObj = {}
class Store{
    static getItems(){
        if(localStorage.getItem('items') === null){
            return []
        }
        return JSON.parse(localStorage.getItem('items'))
    }
    static addTodo(item){
        const items = Store.getItems()
        itemObj = {
            id : items.length + 1,
            title : item,
            col : 0
        }
        items.push(itemObj)
        makeTodo(itemObj)
        localStorage.setItem('items', JSON.stringify(items))

    }
    // static change(col,id){
    //     const items = Store.getItems()
    //     items.forEach(item => {
    //         if(item.id == id){
    //             localStorage.removeItem("id")
                // console.log(item.col);
                // console.log(item.id);
                // console.log(item.title);
        //     }
        // })
        //make new item and push
        // if(id === 'sec_col'){
        //     console.log('areeeeeeeeeee');
        // }
        // console.log(col);
        // console.log(id);
    // }
}


class Ui{
    static displayList(){
        const items = Store.getItems()
        items.forEach( item => {
            Ui.addList(item)
            // console.log(item);
        })
    }
    static addList(item){
        makeTodo(item)
    }
}

// addColElm.addEventListener("click", e =>{
//     if(e.target.classList.contains('close')) {
//         console.log(e.target);
//         e.target.parentElement.remove()
//     }
// })


function makeTodo(val){
    // console.log(val);
    let todoElm = document.createElement("div")
    let spanElm = document.createElement("span")
    todoElm.classList.add("list-group-item")
    todoElm.setAttribute("draggable", "true")
    todoElm.setAttribute("data-id",val.id)
    todoElm.setAttribute("col-data","first_col")
    todoElm.classList.add("delete")
    todoElm.innerHTML = val.title
    todoElm.style.fontSize = "1.2rem"
    todoElm.style.padding = "0.75rem"
    spanElm.classList.add("close")
    spanElm.innerHTML = '&times;'
    todoElm.appendChild(spanElm)
    addColElm.appendChild(todoElm)
    overlayElm.style.display = "none"
    todoFormElm.style.display = "none"
    inputElm.value = ""
    todoElm.addEventListener('dragstart', dragStart)
    spanElm.addEventListener("click", function(){
        todoElm.remove()
    })
    spanElm.setAttribute('onclick', 'removeItem('+ val.id + ')')
}


function removeItem(id){
    const items = Store.getItems()
    items.forEach((item, index) => {
        if(item.id === id) {
            items.splice(index, 1);
        }
    });
    localStorage.setItem('items', JSON.stringify(items));
}

document.addEventListener('DOMContentLoaded', Ui.displayList);