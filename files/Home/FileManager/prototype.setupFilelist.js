;(async()=>{
    let[
        path,
        File,
        site,
    ]=await Promise.all([
        module.repository.npm.path,
        module.shareImport('prototype.setupFilelist/File.js'),
        module.repository.althea.site,
    ])
    function createFile(fileManager,name,isDirectory){
        let f=new File(name,isDirectory)
        f.href=path.normalize(
            '/home/'+fileManager.directory+'/'+name+
            (isDirectory?'/':'')
        )
        f.on('execute',()=>
            fileManager.emit('fileExecuted',f)
        )
        f.on('click',()=>
            fileManager.focusOn(f.index)
        )
        f.on('startAudio',()=>{
            if(fileManager.audioPlayer.audio)
                fileManager.audioPlayer.end()
            fileManager.audioPlayer.start(f.href)
            fileManager.div.appendChild(fileManager.audioPlayer.audio)
        })
        f.on('endAudio',()=>{
            fileManager.audioPlayer.end()
        })
        f.beRemoved=function(){
            return site.send({
                function:'remove',
                path:`${fileManager.directory}/${f.name}`,
            })
        }
        return f
    }
    return async function(){
        let fileManager=this
        if(fileManager.setupFilelistStatus!=0)
            return fileManager.setupFilelistStatus=2
        fileManager.setupFilelistStatus=1
        let files=await fileManager.getDirectoryInformation(
            fileManager.directory
        )
        fileManager.files=[]
        if(fileManager.directory[0]!='.')
            files.push({name:'..',isDirectory:true})
        files.map(file=>{
            fileManager.files.push(createFile(
                fileManager,
                file.name,
                file.isDirectory
            ))
        })
        fileManager.filelist=fileManager.files.concat(
            fileManager.fileuploadings
        )
        fileManager.filelist.sort((a,b)=>{
            return a.name.localeCompare(b.name)
        })
        fileManager.div.ul=createUl(fileManager,fileManager.filelist)
        fileManager.div.appendChild(fileManager.div.ul)
        {
            let toDoAgain=fileManager.setupFilelistStatus==2
            fileManager.setupFilelistStatus=0
            if(!toDoAgain)
                return
            fileManager.purgeFilelist()
            fileManager.setupFilelist()
        }
        function createUl(fileManager,a){
            let ul=document.createElement('ul')
            a.map((file,index)=>{
                let li=file.ui.li
                li.onclick=()=>fileManager.focusOn(index)
                ul.appendChild(li)
            })
            return ul
        }
    }
})()
