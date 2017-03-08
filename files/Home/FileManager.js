;(async()=>{
    let[
        path,
        EventEmmiter,
        setupDiv,
        setupFilelist,
    ]=await Promise.all([
        module.repository.npm.path,
        module.repository.althea.EventEmmiter,
        module.shareImport('FileManager/prototype.setupDiv.js'),
        module.shareImport('FileManager/prototype.setupFilelist.js'),
    ])
    function FileManager(){
        EventEmmiter.call(this)
        this.pendingRequest=[]
        this.audioPlayer=new AudioPlayer
    }
    Object.setPrototypeOf(FileManager.prototype,EventEmmiter.prototype)
    Object.defineProperty(FileManager.prototype,'directory',{set(pth){
        let targetPath=path.normalize(pth)
        if(targetPath.substring(0,2)=='..')
            return
        this._directory=targetPath
        this._directoryChange()
    },get(){
        return this._directory
    }})
    FileManager.prototype._directoryChange=function(){
        if(!this.div){
            this.fileuploadings=[]
            this.div=document.createElement('div')
            this.setupDiv()
        }else{
            this.purgeFilelist()
            this.setupFilelist()
        }
    }
    FileManager.prototype.setupDiv=setupDiv
    FileManager.prototype.setupFilelist=setupFilelist
    FileManager.prototype.purgeFilelist=function(){
        this.focus=undefined
        this.div.innerHTML=''
    }
    FileManager.prototype.focusOn=function(id){
        if(this.focus!=undefined)
            this.filelist[this.focus].li.style.backgroundColor=''
        this.focus=id
        this.filelist[this.focus].li.style.backgroundColor='lightgray'
    }
    Object.defineProperty(FileManager.prototype,'ui',{get(){
        return this.div
    }})
    Object.defineProperty(FileManager.prototype,'send',{
        configurable:true,
        set(v){
            Object.defineProperty(this,'send',{value:v})
            this.pendingRequest.map(rq=>
                this.send(rq.doc).then(rq.rs)
            )
            this.pendingRequest=[]
        },get(){
            return d=>new Promise(rs=>
                this.pendingRequest.push({doc:d,rs})
            )
        }
    })
    FileManager.prototype.getDiskSpace=function(){
        return this.send({
            function:'getDiskSpace',
        })
    }
    FileManager.prototype.getDirectoryInformation=function(path){
        return this.send({
            function:'getDirectoryInformation',
            path
        })
    }
    function AudioPlayer(){
    }
    AudioPlayer.prototype.start=function(src){
        this.audio=createAudio(src)
        function createAudio(src){
            let a=document.createElement('audio')
            a.src=src
            a.autoplay=true
            return a
        }
    }
    AudioPlayer.prototype.end=function(){
        this.audio.parentNode.removeChild(
            this.audio
        )
        delete this.audio
    }
    return FileManager
})()
