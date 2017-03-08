(async()=>{
    let[
        genkeydown,
        Fileuploading,
    ]=await Promise.all([
        module.shareImport('prototype.setupDiv/genkeydown.js'),
        module.shareImport('Fileuploading.js'),
    ])
    function setupDiv(){
        let
            fileManager=this,
            div
        fileManager.setupFilelistStatus=0
        fileManager.div.tabIndex=0
        fileManager.div.style.outline='none'
        fileManager.div.style.position='relative'
        fileManager.div.addEventListener('keydown',genkeydown(this))
        fileManager.div.addEventListener('drop',e=>{
            e.preventDefault()
            fileManager.div.style.backgroundColor=''
            for(let i=0;i<e.dataTransfer.files.length;i++){
                sendfile(e.dataTransfer.files[i],()=>{
                    fileManager.purgeFilelist()
                    fileManager.setupFilelist()
                })
            }
        })
        fileManager.div.addEventListener('dragover',e=>{
            e.preventDefault()
        })
        fileManager.div.addEventListener('dragenter',e=>{
            e.preventDefault()
            fileManager.div.style.backgroundColor='lightgray'
            if(!div){
                div=document.createElement('div')
                div.style.position='absolute'
                div.style.top='0'
                div.style.width='100%'
                div.style.height='100%'
                div.addEventListener('dragleave',e=>{
                    fileManager.div.removeChild(div)
                    fileManager.div.style.backgroundColor=''
                    div=undefined
                })
                let fileInput=createFileInput()
                fileManager.div.appendChild(div)
            }
        })
        fileManager.setupFilelist()
        function sendfile(file,update){
            let fileuploading=new Fileuploading(
                fileManager.directory,
                file.name,
                file
            )
            fileManager.fileuploadings.push(fileuploading)
            fileuploading.send().then(()=>{
                fileManager.fileuploadings.splice(
                    fileManager.fileuploadings.indexOf(fileuploading),
                    1
                )
                update()
            })
            update()
        }
    }
    function createFileInput(){
        let n=document.createElement('input')
        n.type='file'
        return n
    }
    return setupDiv
})()
