(function(type){
    return new Promise((rs,rj)=>{
        let
            file=this,
            input
        input=createInput()
        this.li.innerHTML=''
        input.style.width='-webkit-fill-available'
        this.li.appendChild(input)
        input.focus()
        if(type=='insert')
            input.setSelectionRange(0,0)
        else if(type=='append')
            input.setSelectionRange(
                input.value.length,
                input.value.length
            )
        function createInput(){
            let input=document.createElement('input')
            input.onkeydown=e=>{
                e.stopPropagation()
                if(
                    e.keyCode==27||
                    e.ctrlKey&&e.keyCode==67&&
                        input.selectionStart==input.selectionEnd
                ){
                    input.parentNode.remove(input)
                    file.home.div.focus()
                    rs(rename(input.value))
                }
            }
            input.value=file.name
            return input
        }
        async function rename(newname){
            let site=await file.home.home._site
            return site.send({
                function:'renameFile',
                path:`${file.home.directory}/${file.name}`,
                newpath:`${file.home.directory}/${newname}`,
            })
        }
    })
})
