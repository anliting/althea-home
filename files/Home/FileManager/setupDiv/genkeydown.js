(home=>e=>{
    if(e.keyCode==35){ // end
        e.preventDefault()
        home.focusOn(home.filelist.length-1)
    }else if(e.keyCode==36){ // home
        e.preventDefault()
        home.focusOn(0)
    }else if(e.keyCode==65){ // a
        e.preventDefault()
        if(home.focus==undefined)
            return
        home.filelist[home.focus].beRenamed('append').then(()=>{
            home.purgeFilelist()
            home.setupFilelist()
        })
    }else if(e.keyCode==68||e.keyCode==46){ // d
        e.preventDefault()
        if(home.focus==undefined)
            return
        home.filelist[home.focus].beRemoved().then(()=>{
            home.purgeFilelist()
            home.setupFilelist()
        })
    }else if(e.keyCode==71){ // g
        e.preventDefault()
        home.focusOn(e.shiftKey?home.filelist.length-1:0)
    }else if(e.keyCode==72){ // h
        e.preventDefault()
        home.directory+='/..'
    }else if(e.keyCode==73){ // i
        e.preventDefault()
        if(home.focus==undefined)
            return
        home.filelist[home.focus].beRenamed('insert').then(()=>{
            home.purgeFilelist()
            home.setupFilelist()
        })
    }else if(e.keyCode==74){ // j
        e.preventDefault()
        if(home.focus==undefined)
            home.focusOn(0)
        else if(home.focus+1<home.filelist.length)
            home.focusOn(home.focus+1)
    }else if(e.keyCode==75){ // k
        e.preventDefault()
        if(home.focus==undefined)
            home.focusOn(0)
        else if(0<=home.focus-1)
            home.focusOn(home.focus-1)
    }else if(e.keyCode==76||e.keyCode==13){ // l
        e.preventDefault()
        if(home.focus==undefined)
            return
        home.filelist[home.focus].execute()
    }else if(e.keyCode==79){ // o
        e.preventDefault()
        let li=createLi()
        home.div.ul.appendChild(
            li
        )
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
                home.div.focus()
                mkdir(input.value).then(()=>{
                    home.purgeFilelist()
                    home.setupFilelist()
                })
            }
        }
        return input
    }
    async function mkdir(name){
        let site=await home.home._site
        return site.send({
            function:'createDirectory',
            path:`${home.directory}/${name}`,
        })
    }
})
