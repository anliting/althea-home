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
            createDiv(home)
            n.appendChild(home.div)
            return n
        }
        function createDiv(home){
            home.rowDiv=document.createElement('div')
            home.div=document.createElement('div')
            home.div.style.display='table'
            home.div.style.tableLayout='fixed'
            home.div.style.width='100%'
            home.rowDiv.style.display='table-row'
            home.leftDiv=document.createElement('div')
            home.leftDiv.style.display='table-cell'
            home.leftDiv.style.width='50%'
            home.leftDiv.appendChild(home.fm.div)
            home.rightDiv=document.createElement('div')
            home.rightDiv.style.display='none'
            home.rightDiv.style.width='50%'
            home.rightDiv.appendChild(home.rightFm.div)
            home.rowDiv.appendChild(home.leftDiv)
            home.rowDiv.appendChild(home.rightDiv)
            home.div.appendChild(home.rowDiv)
            home.div.onkeydown=e=>{
                if(e.key!='t')
                    return
                e.preventDefault()
                if(home.tc==undefined){
                    home.tc=createTc(home)
                }else{
                    home.tc.end()
                    delete home.tc
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
        p.textContent=`${~~(disk.free/1e9)}G/${~~(disk.total/1e9)}G`
        return p
    }
}
