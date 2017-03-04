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
        let
            tcmode=false,
            p,
            div=document.createElement('div'),
            rowDiv=document.createElement('div'),
            leftDiv=document.createElement('div'),
            rightDiv=document.createElement('div')
        div.style.display='table'
        div.style.tableLayout='fixed'
        div.style.width='100%'
        rowDiv.style.display='table-row'
        leftDiv.style.display='table-cell'
        leftDiv.style.width='50%'
        rightDiv.style.display='none'
        rightDiv.style.width='50%'
        rowDiv.appendChild(leftDiv)
        rowDiv.appendChild(rightDiv)
        div.appendChild(rowDiv)
        this.node=div
        // left
        this.fm.on('fileExecuted',e=>{
            if(!e.isDirectory)
                location=e.href
            else
                this.fm.directory+='/'+e.name
        })
        this.fm.directory=directory
        this.fm.parent=leftDiv
        // right
        this.rightFm.directory=this.fm.directory
        this.rightFm.parent=rightDiv
        // end right
        div.onkeydown=e=>{
            if(e.key=='t'){
                e.preventDefault()
                if(tcmode==false){
                    tcmode=true
                    rightDiv.style.display='table-cell'
                    this.fm.getDiskSpace().then(disk=>{
                        p=createP(disk)
                        document.body.insertBefore(p,div)
                    })
                    function createP(disk){
                        let p=document.createElement('p')
                        p.textContent=
                            Math.floor(disk.free/1e9)+
                            'G/'+
                            Math.floor(disk.total/1e9)+
                            'G'
                        return p
                    }
                }else{
                    tcmode=false
                    rightDiv.style.display='none'
                    p.parentNode.removeChild(p)
                }
            }
        }
    }
    return Home
})()
