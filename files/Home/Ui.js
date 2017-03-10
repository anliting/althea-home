function Ui(){
    this.node=createNode(this)
}
function createNode(ui){
    let n=document.createElement('div')
    ui.div=createDiv(ui)
    n.appendChild(ui.div)
    return n
}
Ui.prototype.appendLeftChild=function(n){
    this.leftDiv.appendChild(n)
}
Ui.prototype.appendRightChild=function(n){
    this.rightDiv.appendChild(n)
}
function createDiv(ui){
    let div=document.createElement('div')
    div.style.display='table'
    div.style.tableLayout='fixed'
    div.style.width='100%'
    ui.rowDiv=document.createElement('div')
    ui.rowDiv.style.display='table-row'
    ui.leftDiv=document.createElement('div')
    ui.leftDiv.style.display='table-cell'
    ui.leftDiv.style.width='50%'
    ui.rightDiv=document.createElement('div')
    ui.rightDiv.style.display='none'
    ui.rightDiv.style.width='50%'
    ui.rowDiv.appendChild(ui.leftDiv)
    ui.rowDiv.appendChild(ui.rightDiv)
    div.appendChild(ui.rowDiv)
    div.onkeydown=e=>{
        if(e.key!='t')
            return
        e.preventDefault()
        if(ui.tc==undefined){
            ui.tc=createTc(ui)
        }else{
            ui.tc.end()
            delete ui.tc
        }
    }
    return div
}
function createTc(ui){
    let ended=false,p
    ui.rightDiv.style.display='table-cell'
    ui.getDiskSpace().then(disk=>{
        if(ended)
            return
        p=createP(disk)
        ui.node.insertBefore(p,ui.div)
    })
    return{
        end(){
            ui.rightDiv.style.display='none'
            if(p)
                p.parentNode.removeChild(p)
            ended=true
        }
    }
    function createP(disk){
        let p=document.createElement('p')
        p.textContent=`${~~(disk.free/1e9)}G/${~~(disk.total/1e9)}G`
        return p
    }
}
Ui
