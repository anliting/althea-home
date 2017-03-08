(function(type){
    let
        file=this,
        input,
        p
    input=createInput(this)
    this.li.innerHTML=''
    p=new Promise(rs=>{
        input.onkeydown=e=>{
            e.stopPropagation()
            if(
                e.keyCode==27||
                e.ctrlKey&&e.keyCode==67&&
                    input.selectionStart==input.selectionEnd
            ){
                input.parentNode.remove(input)
                file.home.div.focus()
                rs(file.rename(input.value))
            }
        }
    })
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
    return p
    function createInput(file){
        let input=document.createElement('input')
        input.value=file.name
        return input
    }
})
