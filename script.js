const listsContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []

const LOCAL_STORAGE_CURRENT_LIST_ID_KEY = 'task.currentListID'
let currentListID = localStorage.getItem(LOCAL_STORAGE_CURRENT_LIST_ID_KEY)

listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'li'){
        currentListID = e.target.dataset.listID
        saveAndRender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const currentList = lists.find(list => list.id === currentListID)
        const currentTask = currentList.tasks.find(task => task.id === e.target.id)
        currentTask.complete = e.target.checked
        save()
        renderTaskCount(currentList)
    }
})

clearCompleteTasksButton.addEventListener('click', e => {
    const currentList = lists.find(list => list.id === currentListID)
    currentList.tasks = currentList.tasks.filter(task => !task.complete)
    saveAndRender()
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== currentListID)
    currentListID = null
    saveAndRender()
})

newListForm.addEventListener('submit', e => {
    e.preventDefault()

    if(newListInput.value == null || newListInput.value == '') return

    const listName = newListInput.value
    newListInput.value = null
    
    const list = createList(listName)
    lists.push(list)
    saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()

    if(newTaskInput.value == null || newTaskInput.value == '') return

    const taskName = newTaskInput.value
    newTaskInput.value = null
    
    const task = createTask(taskName)

    const currentList = lists.find(list => list.id === currentListID)
    currentList.tasks.push(task)
    saveAndRender()
})

function createList(listname) {
    return {
        id: Date.now().toString(), 
        name: listname, 
        tasks: [] 
    }
}

function createTask(taskName) {
    return {
        id: Date.now().toString(), 
        name: taskName, 
        complete: false 
    }
}

function saveAndRender() {
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_CURRENT_LIST_ID_KEY, currentListID)
}

function render() {
    clearElement(listsContainer)
    renderLists()

    const currentList = lists.find(list => list.id === currentListID)

    if (currentListID == 'null' || currentListID == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = currentList.name
        renderTaskCount(currentList)
        clearElement(tasksContainer)
        renderTasks(currentList)
      }
}

function renderTasks(currentList){
    currentList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)

        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete

        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)

        tasksContainer.appendChild(taskElement)
    })
}

function renderTaskCount(currentList) {
    const incompleteTaskCount = currentList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listID = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name

        if (list.id === currentListID) {
            listElement.classList.add('current-list')
        }

        listsContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while(element.firstChild) 
    {
        element.removeChild(element.firstChild)
    }
}

render()