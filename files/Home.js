(async()=>{
    let[
        path,
        FileManager,
    ]=await Promise.all([
        module.repository.npm.path,
        module.shareImport('Home/FileManager.js'),
    ])
    function Home(site,directory){
        this._site=site
        this.fm=new FileManager(this)
        this.rightFm=new FileManager(this)
        this.fm.directory=directory
        this.rightFm.directory=directory
    }
    Object.defineProperty(Home.prototype,'node',{configurable:true,get(){
        Object.defineProperty(this,'node',{value:createNode(this)})
        return this.node
        function createNode(home){
            let n=document.createElement('div')
            createDiv.call(home)
            n.appendChild(home.div)
            return n
        }
        function createDiv(){
            this.rowDiv=document.createElement('div')
            this.div=document.createElement('div')
            this.div.style.display='table'
            this.div.style.tableLayout='fixed'
            this.div.style.width='100%'
            this.rowDiv.style.display='table-row'
            this.leftDiv=document.createElement('div')
            this.leftDiv.style.display='table-cell'
            this.leftDiv.style.width='50%'
            this.leftDiv.appendChild(this.fm.div)
            this.rightDiv=document.createElement('div')
            this.rightDiv.style.display='none'
            this.rightDiv.style.width='50%'
            this.rightDiv.appendChild(this.rightFm.div)
            this.rowDiv.appendChild(this.leftDiv)
            this.rowDiv.appendChild(this.rightDiv)
            this.div.appendChild(this.rowDiv)
            this.div.onkeydown=e=>{
                if(e.key!='t')
                    return
                e.preventDefault()
                if(this.tc==undefined){
                    this.tc=createTc(this)
                }else{
                    this.tc.end()
                    delete this.tc
                }
            }
        }
    }})
    return Home
})()
function createTc(home){
    let ended=false,p
    home.rightDiv.style.display='table-cell'
    home.fm.getDiskSpace().then(disk=>{
        if(ended)
            return
        p=createP(disk)
        home.node.insertBefore(p,home.div)
    })
    return{
        end(){
            home.rightDiv.style.display='none'
            if(p)
                p.parentNode.removeChild(p)
            ended=true
        }
    }
    function createP(disk){
        let p=document.createElement('p')
        p.textContent=
            Math.floor(disk.free/1e9)+
            'G/'+
            Math.floor(disk.total/1e9)+
            'G'
        return p
    }
}
