(fileManager=>e=>{
    if(e.keyCode==35){ // end
        e.preventDefault()
        fileManager.focusOn(fileManager.filelist.length-1)
    }else if(e.keyCode==36){ // fileManager
        e.preventDefault()
        fileManager.focusOn(0)
    }else if(e.keyCode==65){ // a
        e.preventDefault()
        if(fileManager.focus==undefined)
            return
        let f=fileManager.filelist[fileManager.focus]
        f.beRenamed('append').then(name=>{
            fileManager._rename(f,name)
        })
    }else if(e.keyCode==68||e.keyCode==46){ // d
        e.preventDefault()
        if(fileManager.focus==undefined)
            return
        fileManager.filelist[fileManager.focus].beRemoved().then(()=>{
            fileManager.purgeFilelist()
            fileManager.setupFilelist()
        })
    }else if(e.keyCode==71){ // g
        e.preventDefault()
        fileManager.focusOn(e.shiftKey?fileManager.filelist.length-1:0)
    }else if(e.keyCode==72){ // h
        e.preventDefault()
        fileManager.directory+='/..'
    }else if(e.keyCode==73){ // i
        e.preventDefault()
        if(fileManager.focus==undefined)
            return
        let f=fileManager.filelist[fileManager.focus]
        f.beRenamed('insert').then(name=>{
            fileManager._rename(f,name)
        })
    }else if(e.keyCode==74){ // j
        e.preventDefault()
        if(fileManager.focus==undefined)
            fileManager.focusOn(0)
        else if(fileManager.focus+1<fileManager.filelist.length)
            fileManager.focusOn(fileManager.focus+1)
    }else if(e.keyCode==75){ // k
        e.preventDefault()
        if(fileManager.focus==undefined)
            fileManager.focusOn(0)
        else if(0<=fileManager.focus-1)
            fileManager.focusOn(fileManager.focus-1)
    }else if(e.keyCode==76||e.keyCode==13){ // l
        e.preventDefault()
        if(fileManager.focus==undefined)
            return
        fileManager.filelist[fileManager.focus].execute()
    }else if(e.keyCode==79){ // o
        e.preventDefault()
        let li=createLi()
        fileManager.ui.ul.appendChild(li)
        li.firstChild.select()
    }
    function createLi(){
        let li=document.createElement('li')
        li.appendChild(createInput())
        return li
    }
    function createInput(){
        let input=document.createElement('input')
        input.style.width='-webkit-fill-available'
        input.onkeydown=e=>{
            e.stopPropagation()
            if(
                e.keyCode==27||
                e.ctrlKey&&e.keyCode==67&&
                    input.selectionStart==input.selectionEnd
            ){
                input.parentNode.remove(input)
                fileManager.ui.focus()
                fileManager.mkdir(input.value).then(()=>{
                    fileManager.purgeFilelist()
                    fileManager.setupFilelist()
                })
            }
        }
        return input
    }
})
