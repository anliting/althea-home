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
    function File(name,isDirectory){
        EventEmmiter.call(this)
        this.name=name
        this.isDirectory=isDirectory
    }
    Object.setPrototypeOf(File.prototype,EventEmmiter.prototype)
    File.prototype.execute=function(){
        this.emit('execute')
    }
    File.prototype.setupLi=function(){
        let file=this
        this.li=createLi()
        function createLi(){
            let li=document.createElement('li')
            li.onclick=()=>{
                file.emit('click')
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
                if(e.which!=1)
                    return
                e.preventDefault()
                file.execute()
            }
            a.textContent=file.name+(file.isDirectory?'/':'')
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
                    file.emit('startAudio',file.href)
                    a.textContent='(stop)'
                }else if(state==1){
                    state=0
                    file.emit('endAudio',file.href)
                    a.textContent='(play)'
                }
            }
            a.ondblclick=e=>{
                e.stopPropagation()
            }
            a.textContent='(play)'
            return a
        }
        function getExtension(s){
            let p=s.lastIndexOf('.')+1
            return p<0?null:s.substring(p)
        }
    }
    File.prototype.beRenamed=modules[3]
    return File
})
