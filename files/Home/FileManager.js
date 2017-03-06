;(async()=>{
    let[
        setupDiv,
        path,
        EventEmmiter,
        setupFilelist,
    ]=await Promise.all([
        module.shareImport('FileManager/setupDiv.js'),
        module.repository.npm.path,
        module.repository.althea.EventEmmiter,
        module.shareImport('FileManager/prototype.setupFilelist.js'),
    ])
    let FileManager=class FileManager extends EventEmmiter{
    /*
    Properties:
        this.directory is the current working directory, which is a relative
            path that relatives to /home.
        this.parent the parent node of this.div.
    Events:
        directoryChange is fired when this.directory is changed.
    */
        constructor(home){
            super()
            this.pendingRequest=[]
            this.home=home
            this.on('directoryChange',()=>{
                if(!this.div){
                    this.fileuploadings=[]
                    this.div=document.createElement('div')
                    this.setupDiv()
                }else{
                    this.purgeFilelist()
                    this.setupFilelist()
                }
            })
        }
        set parent(parent){
            this._parent=parent
            this.emit('parentChange')
        }
        get parent(){
            return this._parent
        }
        set directory(pth){
            let targetPath=path.normalize(pth)
            if(targetPath.substring(0,2)=='..')
                return
            this._directory=targetPath
            this.emit('directoryChange')
        }
        get directory(){
            return this._directory
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
    return FileManager
})()
