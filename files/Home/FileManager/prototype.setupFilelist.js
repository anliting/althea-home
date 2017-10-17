import{dom,path}from '/lib/core.static.js'
import site from '/lib/site.js'
import File from './prototype.setupFilelist/File.js'
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
        fileManager.ui.node.appendChild(fileManager.audioPlayer.audio)
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
export default async function(){
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
    fileManager.ui.ul=createUl(fileManager,fileManager.filelist)
    fileManager.ui.node.appendChild(fileManager.ui.ul)
    {
        let toDoAgain=fileManager.setupFilelistStatus==2
        fileManager.setupFilelistStatus=0
        if(!toDoAgain)
            return
        fileManager.purgeFilelist()
        fileManager.setupFilelist()
    }
    function createUl(fileManager,a){
        return dom('ul',a.map((file,index)=>{
            let li=file.ui.li
            li.onclick=()=>fileManager.focusOn(index)
            return li
        }))
    }
}
