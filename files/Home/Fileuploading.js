function Fileuploading(directory,name,rawfile){
    this.directory=directory
    this.name=name
    this.rawfile=rawfile
    this.showedLoaded=0
    {
        let update=()=>{
            this.showLoaded()
            return setTimeout(update,30)
        }
        this.timeoutId=update()
    }
}
Fileuploading.prototype.showLoaded=function(){
    let
        fileuploading=this,
        proportion,
        loadedToBeShown,
        timeAfterLastUpdate
    if(!fileuploading.loaded)
        return
    timeAfterLastUpdate=(new Date).getTime()-this.loaded.time
    if(1000<timeAfterLastUpdate)
        return
    loadedToBeShown=
        this.showedLoaded+
        timeAfterLastUpdate/1000*
        (this.loaded.loaded-this.showedLoaded)
    proportion=loadedToBeShown/this.loaded.total
    this.showedLoaded=loadedToBeShown
    let timeSpentInMs=(new Date).getTime()-this.starttime
    fileuploading.div.style.width=proportion*100+'%'
    fileuploading.span.textContent=
        fileuploading.name+' ('+(
            Math.floor(
                100*(proportion*100)
            )/100
        )+'% uploaded'+(
            timeSpentInMs?
                ', '+0.001*Math.floor(
                    1000*this.loaded.loaded/1048576/(timeSpentInMs/1000)
                )+'MiB/s'
            :
                ''
        )+')'
}
Fileuploading.prototype.setupLi=function(){
    let fileuploading=this
    this.li=createLi()
    function createLi(){
        let li=document.createElement('li')
        li.style.position='relative'
        li.style.border='1px solid black'
        li.appendChild(createDiv())
        li.appendChild(createSpan())
        return li
    }
    function createSpan(){
        fileuploading.span=document.createElement('span')
        fileuploading.span.style.position='absolute'
        fileuploading.span.style.top='0px'
        fileuploading.span.textContent=fileuploading.name
        return fileuploading.span
    }
    function createDiv(){
        fileuploading.div=document.createElement('div')
        fileuploading.div.style.position='absolute'
        fileuploading.div.style.top='0px'
        fileuploading.div.style.height='100%'
        fileuploading.div.style.width='0%'
        fileuploading.div.style.backgroundColor='lightgreen'
        return fileuploading.div
    }
}
Fileuploading.prototype.send=function(){
    let
        fileuploading=this
    return new Promise((rs,rj)=>{
        let request=new XMLHttpRequest
        let formdata=new FormData
        request.onreadystatechange=()=>{
            if(request.readyState==4&&request.status==200){
                clearTimeout(this.timeoutId)
                rs()
            }
        }
        request.upload.onprogress=e=>{
            if(!e.lengthComputable)
                return
            if(fileuploading.div)
                this.loaded={
                    time:(new Date).getTime(),
                    loaded:e.loaded,
                    total:e.total,
                }
        }
        request.open('POST','api')
        formdata.append('function','uploadFile')
        formdata.append('directory',this.directory)
        formdata.append('file',this.rawfile)
        this.starttime=(new Date).getTime()
        request.send(formdata)
    })
}
Fileuploading
