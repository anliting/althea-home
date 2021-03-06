import{path}from '/lib/core.static.js'
import EventEmitter from'../lib/EventEmitter.mjs'
import setupFilelist from './FileManager/prototype.setupFilelist.js'
import genkeydown from './FileManager/genkeydown.js'
import Fileuploading from './FileManager/Fileuploading.js'
import AudioPlayer from './FileManager/AudioPlayer.js'
import Ui from './FileManager/Ui.js'
function FileManager(){
    EventEmitter.call(this)
    this.pendingRequest=[]
    this.audioPlayer=new AudioPlayer
    this.fileuploadings=[]
    this.setupFilelistStatus=0
}
Object.setPrototypeOf(FileManager.prototype,EventEmitter.prototype)
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
    this.emit('directoryChange')
    this.purgeFilelist()
    this.setupFilelist()
}
FileManager.prototype.setupFilelist=setupFilelist
FileManager.prototype.purgeFilelist=function(){
    this.focus=undefined
    this.ui.purgeFilelist()
}
FileManager.prototype.focusOn=function(id){
    if(this.focus!=undefined)
        this.filelist[this.focus].ui.li.style.backgroundColor=''
    this.focus=id
    this.filelist[this.focus].ui.li.style.backgroundColor='lightgray'
}
FileManager.prototype.beFocused=function(){
    this.ui.focus()
}
Object.defineProperty(FileManager.prototype,'ui',{get(){
    if(this._ui)
        return this._ui 
    let sendfile=(file,update)=>{
        let fileuploading=new Fileuploading(
            this.directory,
            file.name,
            file
        )
        this.fileuploadings.push(fileuploading)
        fileuploading.send().then(()=>{
            this.fileuploadings.splice(
                this.fileuploadings.indexOf(fileuploading),
                1
            )
            update()
        })
        update()
    }
    let ui=new Ui
    ui.node.addEventListener('keydown',genkeydown(this))
    ui.sendFile=f=>sendfile(f,()=>{
        this.purgeFilelist()
        this.setupFilelist()
    })
    return this._ui=ui
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
FileManager.prototype._rename=async function(f,name){
    await this.rename(f,name)
    this.ui.focus()
    this.purgeFilelist()
    this.setupFilelist()
}
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
export default FileManager
