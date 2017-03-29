(async()=>{
    let dom=await module.repository.althea.dom
    function Ui(){
        this.node=createNode(this)
    }
    function createNode(ui){
        return dom('div',ui.div=createDiv(ui))
    }
    Ui.prototype.appendLeftChild=function(n){
        this.leftDiv.appendChild(n)
    }
    Ui.prototype.appendRightChild=function(n){
        this.rightDiv.appendChild(n)
    }
    function createDiv(ui){
        let div=dom('div')
        div.style.display='table'
        div.style.tableLayout='fixed'
        div.style.width='100%'
        ui.rowDiv=dom('div',n=>{
            n.style.display='table-row'
            ui.leftDiv=dom('div')
            ui.leftDiv.style.display='table-cell'
            ui.leftDiv.style.width='50%'
            ui.rightDiv=dom('div')
            ui.rightDiv.style.display='none'
            ui.rightDiv.style.width='50%'
            return[ui.leftDiv,ui.rightDiv]
        })
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
            p=dom('p',`${~~(disk.free/1e9)}G/${~~(disk.total/1e9)}G`)
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
    }
    return Ui
})()
