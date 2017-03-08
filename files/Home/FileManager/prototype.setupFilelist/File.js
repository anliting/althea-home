Promise.all([
    module.repository.althea.site,
    module.repository.npm.path,
    module.repository.althea.EventEmmiter,
    module.shareImport('File/prototype.beRenamed.js'),
]).then(modules=>{
    let
        site=           modules[0],
        path=           modules[1],
        EventEmmiter=   modules[2]
    function File(fileManager,name,isDirectory){
        EventEmmiter.call(this)
        this.fileManager=fileManager
        this.name=name
        this.isDirectory=isDirectory
        this.href=path.normalize(
            '/home/'+this.fileManager.directory+'/'+this.name+
            (this.isDirectory?'/':'')
        )
    }
    Object.setPrototypeOf(File.prototype,EventEmmiter.prototype)
    File.prototype.execute=function(){
        this.emit('execute')
        this.fileManager.emit('fileExecuted',this)
    }
    File.prototype.setupLi=function(){
        let file=this
        this.li=createLi()
        function createLi(){
            let li=document.createElement('li')
            li.onclick=()=>{
                file.fileManager.focusOn(file.index)
            }
            li.ondblclick=()=>{
                file.execute()
            }
            li.appendChild(createA())
            if(getExtension(file.name)=='mp3'){
                li.appendChild(document.createTextNode(' '))
                li.appendChild(createAAudio())
            }
            return li
        }
        function createA(){
            let a=document.createElement('a')
            a.href=file.href
            a.onclick=e=>{
                e.stopPropagation()
                if(file.isDirectory&&e.which==1){
                    e.preventDefault()
                    file.fileManager.directory=
                        path.normalize(file.fileManager.directory+'/'+file.name)
                }
            }
            a.textContent=file.name+
                (file.isDirectory?'/':'')
            return a
        }
        function createAAudio(){
            let
                state=0,
                a=document.createElement('a')
            a.href='javascript:'
            a.onclick=e=>{
                e.stopPropagation()
                if(state==0){
                    state=1
                    if(file.fileManager.audioPlayer)
                        stop()
                    file.fileManager.audioPlayer=document.createElement('audio')
                    file.fileManager.audioPlayer.src=file.href
                    file.fileManager.audioPlayer.autoplay=true
                    file.fileManager.div.appendChild(file.fileManager.audioPlayer)
                    a.textContent='(stop)'
                }else if(state==1){
                    state=0
                    stop()
                    a.textContent='(play)'
                }
            }
            a.textContent='(play)'
            return a
            function stop(){
                file.fileManager.audioPlayer.parentNode.removeChild(
                    file.fileManager.audioPlayer
                )
                delete file.fileManager.audioPlayer
            }
        }
        function getExtension(s){
            let p=s.lastIndexOf('.')+1
            return p<0?null:s.substring(p)
        }
    }
    File.prototype.beRemoved=function(){
        return site.send({
            function:'remove',
            path:`${this.fileManager.directory}/${this.name}`,
        })
    }
    File.prototype.beRenamed=modules[3]
    return File
})
