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
        let f=new File(fileManager,name,isDirectory)
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
