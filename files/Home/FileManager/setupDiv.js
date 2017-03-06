(async()=>{
    let[
        genkeydown,
        Fileuploading,
    ]=await Promise.all([
        module.shareImport('setupDiv/genkeydown.js'),
        module.shareImport('Fileuploading.js'),
    ])
    function setupDiv(){
        let
            home=this,
            div
        home.setupFilelistStatus=0
        home.div.tabIndex=0
        home.div.style.outline='none'
        home.div.style.position='relative'
        home.div.addEventListener('keydown',genkeydown(this))
        home.div.addEventListener('drop',e=>{
            e.preventDefault()
            home.div.style.backgroundColor=''
            for(let i=0;i<e.dataTransfer.files.length;i++){
                sendfile(e.dataTransfer.files[i],()=>{
                    home.purgeFilelist()
                    home.setupFilelist()
                })
            }
        })
        home.div.addEventListener('dragover',e=>{
            e.preventDefault()
        })
        home.div.addEventListener('dragenter',e=>{
            e.preventDefault()
            home.div.style.backgroundColor='lightgray'
            if(!div){
                div=document.createElement('div')
                div.style.position='absolute'
                div.style.top='0'
                div.style.width='100%'
                div.style.height='100%'
                div.addEventListener('dragleave',e=>{
                    home.div.removeChild(div)
                    home.div.style.backgroundColor=''
                    div=undefined
                })
                home.div.appendChild(div)
            }
        })
        home.setupFilelist()
        function sendfile(file,update){
            let fileuploading=new Fileuploading(
                home.directory,
                file.name,
                file
            )
            home.fileuploadings.push(fileuploading)
            fileuploading.send().then(()=>{
                home.fileuploadings.splice(
                    home.fileuploadings.indexOf(fileuploading),
                    1
                )
                update()
            })
            update()
        }
    }
    return setupDiv
})()
