Promise.all([
    module.repository.althea.site,
    module.shareImport('FileManager/prototype.setupFilelist.js'),
    module.shareImport('FileManager/setupDiv.js'),
    module.repository.npm.path,
    module.repository.althea.EventEmmiter,
    module.extractByPath('https://cdn.rawgit.com/anliting/Decision/d1402e78190047e1ad49c35b0b2da5af478050d2/Decision.js','Decision'),
]).then(modules=>{
    let
        site=           modules[0],
        setupDiv=       modules[2],
        path=           modules[3],
        EventEmmiter=   modules[4],
        Decision=       modules[5]
    var FileManager=class FileManager extends EventEmmiter{
    /*
    Properties:
        this.directory is the current working directory, which is a relative
            path that relatives to /home.
        this.parent the parent node of this.div.
    Events:
        directoryChange is fired when this.directory is changed.
    */
        constructor(home){
            var
                directorySet=new Decision,
                parentSet=new Decision,
                directoryParentSet=new Decision
            super()
            this.home=home
            this.on('directoryChange',()=>directorySet.yes)
            this.on('parentChange',()=>parentSet.yes)
            directorySet.and(parentSet).then(()=>
                setTimeout(()=>
                    this.parent.appendChild(this.div)
                ,0)
            )
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
            var targetPath=path.normalize(pth)
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
    FileManager.prototype.setupFilelist=modules[1]
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
    FileManager.prototype.getDiskSpace=function(){
        return site.send({
            function:'getDiskSpace',
        })
    }
    FileManager.prototype.getDirectoryInformation=function(path){
        return site.send({
            function:'getDirectoryInformation',
            path
        })
    }
    return FileManager
})
