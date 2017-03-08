(async()=>{
    let File=await module.shareImport('prototype.setupFilelist/File.js')
    return function(){
        let fileManager=this
        if(fileManager.setupFilelistStatus!=0)
            return fileManager.setupFilelistStatus=2
        fileManager.setupFilelistStatus=1
        fileManager.getDirectoryInformation(
            fileManager.directory
        ).then(files=>{
            fileManager.files=[]
            if(fileManager.directory[0]!='.')
                files.push({name:'..',isDirectory:true})
            files.map(file=>{
                fileManager.files.push(new File(
                    fileManager,
                    file.name,
                    file.isDirectory
                ))
            })
            fileManager.div.ul=createUl()
            fileManager.div.appendChild(fileManager.div.ul)
            {
                let toDoAgain=fileManager.setupFilelistStatus==2
                fileManager.setupFilelistStatus=0
                if(!toDoAgain)
                    return
                fileManager.purgeFilelist()
                fileManager.setupFilelist()
            }
        },err=>{
            throw err
        })
        function createUl(){
            let
                ul=document.createElement('ul'),
                files
            fileManager.filelist=fileManager.files.concat(
                fileManager.fileuploadings
            )
            fileManager.filelist.sort((a,b)=>{
                return a.name.localeCompare(b.name)
            })
            fileManager.filelist.map((file,index)=>{
                file.setupLi()
                file.li.onclick=()=>{
                    fileManager.focusOn(index)
                }
                ul.appendChild(
                    file.li
                )
            })
            return ul
        }
    }
})()
