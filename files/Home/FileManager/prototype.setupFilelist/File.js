import{doe}from '/lib/core.static.js'
import{EventEmmiter}from 'https://gitcdn.link/cdn/anliting/simple.js/3b5e122ded93bb9a5a7d5099ac645f1e1614a89b/src/simple.static.js'
import beRenamed from './File/prototype.beRenamed.js'
function File(name,isDirectory){
    EventEmmiter.call(this)
    this.name=name
    this.isDirectory=isDirectory
}
Object.setPrototypeOf(File.prototype,EventEmmiter.prototype)
File.prototype.execute=function(){
    this.emit('execute')
}
Object.defineProperty(File.prototype,'ui',{get(){
    if(this._ui)
        return this._ui
    return this._ui=new Ui(this)
}})
File.prototype.beRenamed=beRenamed
function Ui(file){
    this.li=createLi(file)
}
function createLi(file){
    let li=doe.li(createA(file),n=>{
        if(getExtension(file.name)=='mp3'){
            let a=createAAudio(file)
            a.ondblclick=e=>e.stopPropagation()
            doe(n,'',a)
        }
    })
    li.onclick=()=>file.emit('click')
    li.ondblclick=()=>file.execute()
    return li
}
function createA(file){
    let a=doe.a(file.name+(file.isDirectory?'/':''))
    a.href=file.href
    a.onclick=e=>{
        e.stopPropagation()
        if(e.which!=1)
            return
        e.preventDefault()
        file.execute()
    }
    return a
}
function createAAudio(file){
    let
        state=0,
        a=doe.a('(play)')
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
    return a
}
function getExtension(s){
    let p=s.lastIndexOf('.')+1
    return p<0?null:s.substring(p)
}
export default File
