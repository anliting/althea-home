function Ui(home){
    this._home=home
    this._node=document.createElement('div')
    createDiv(this)
    this._node.appendChild(this.div)
    return this._node
}
function createDiv(ui){
    ui.div=document.createElement('div')
    ui.div.style.display='table'
    ui.div.style.tableLayout='fixed'
    ui.div.style.width='100%'
    ui.rowDiv=document.createElement('div')
    ui.rowDiv.style.display='table-row'
    ui.leftDiv=document.createElement('div')
    ui.leftDiv.style.display='table-cell'
    ui.leftDiv.style.width='50%'
    ui.leftDiv.appendChild(ui._home.fm.div)
    ui.rightDiv=document.createElement('div')
    ui.rightDiv.style.display='none'
    ui.rightDiv.style.width='50%'
    ui.rightDiv.appendChild(ui._home.rightFm.div)
    ui.rowDiv.appendChild(ui.leftDiv)
    ui.rowDiv.appendChild(ui.rightDiv)
    ui.div.appendChild(ui.rowDiv)
    ui.div.onkeydown=e=>{
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
}
function createTc(ui){
    let ended=false,p
    ui.rightDiv.style.display='table-cell'
    ui._home.fm.getDiskSpace().then(disk=>{
        if(ended)
            return
        p=createP(disk)
        ui._node.insertBefore(p,ui.div)
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
;(async()=>{
    let[
        FileManager,
    ]=await Promise.all([
        module.shareImport('Home/FileManager.js'),
    ])
    function Home(site,directory){
        this._site=site
        this.fm=new FileManager(this)
        this.fm.directory=directory
        this.fm.send=a=>this.send(a)
        this.rightFm=new FileManager(this)
        this.rightFm.directory=directory
        this.rightFm.send=a=>this.send(a)
    }
    Home.prototype.send=async function(a){
        return(await this._site).send(a)
    }
    Object.defineProperty(Home.prototype,'ui',{configurable:true,get(){
        Object.defineProperty(this,'ui',{value:new Ui(this)})
        return this.ui
    }})
    return Home
})()
