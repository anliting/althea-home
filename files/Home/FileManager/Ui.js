function Ui(){
    this.node=createNode(this)
}
Ui.prototype.focus=function(){
    this.node.focus()
}
function createNode(ui){
    let n=document.createElement('div')
    n.tabIndex=0
    n.style.outline='none'
    n.style.position='relative'
    n.addEventListener('dragover',e=>{
        e.preventDefault()
    })
    n.addEventListener('drop',e=>{
        e.preventDefault()
        n.style.backgroundColor=''
        ui.drop(e)
    })
    let dropDiv
    n.addEventListener('dragenter',e=>{
        e.preventDefault()
        n.style.backgroundColor='lightgray'
        if(!dropDiv){
            dropDiv=createDropDiv()
            dropDiv.addEventListener('dragleave',e=>{
                n.removeChild(dropDiv)
                n.style.backgroundColor=''
                dropDiv=undefined
            })
            n.appendChild(dropDiv)
        }
    })
    /*let fileInput=createFileInput()
    n.appendChild(fileInput)*/
    return n
}
function createDropDiv(){
    let n=document.createElement('div')
    n.style.position='absolute'
    n.style.top='0'
    n.style.width='100%'
    n.style.height='100%'
    return n
}
function createFileInput(){
    let n=document.createElement('input')
    n.type='file'
    return n
}
Ui
