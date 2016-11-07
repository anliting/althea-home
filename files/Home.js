Promise.all([
    module.import('Home/FileManager.js'),
    module.repository.npm.path,
]).then(modules=>{
    let
        FileManager=    modules[0],
        path=           modules[1]
    function Home(site){
        this._site=site
        let
            tcmode=false,
            p,
            div=document.createElement('div'),
            rowDiv=document.createElement('div'),
            leftDiv=document.createElement('div'),
            rightDiv=document.createElement('div'),
            fm=new FileManager(this),
            rightFm=new FileManager(this)
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
        document.body.appendChild(div)
        // left
        fm.on('fileExecuted',e=>{
            if(!e.isDirectory)
                location=e.href
            else
                fm.directory+='/'+e.name
        })
        let directory=decodeURI(location.pathname).match(/\/home\/(.*)/)[1]
        history.replaceState(
            {directory},
            '',
            path.normalize(`/home/${directory}/`)
        )
        fm.directory=directory
        fm.on('directoryChange',e=>{
            history.pushState(
                {directory:fm.directory},
                '',
                path.normalize('/home/'+fm.directory+'/')
            )
            document.title=location.pathname
        })
        fm.parent=leftDiv
        onpopstate=e=>{
            if(location.pathname.substring(0,6)=='/home/')
                fm.directory=e.state.directory
        }
        // right
        rightFm.directory=
            decodeURI(location.pathname).match(/\/home\/(.*)/)[1]
        rightFm.parent=rightDiv
        // end right
        setTimeout(()=>{
            fm.div.focus()
        },0)
        div.onkeydown=e=>{
            if(e.keyCode==84){
                e.preventDefault()
                if(tcmode==false){
                    tcmode=true
                    rightDiv.style.display='table-cell'
                    fm.getDiskSpace().then(disk=>{
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
})
