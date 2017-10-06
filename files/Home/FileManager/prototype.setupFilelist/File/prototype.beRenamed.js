import dom from '/lib/tools/dom.js'
export default function(type){
    let input=createInput(this)
    this.ui.li.innerHTML=''
    let p=new Promise(rs=>{
        input.onkeydown=e=>{
            e.stopPropagation()
            if(
                e.keyCode==27||
                e.ctrlKey&&e.keyCode==67&&
                    input.selectionStart==input.selectionEnd
            ){
                input.parentNode.remove(input)
                rs(input.value)
            }
        }
    })
    input.style.width='-webkit-fill-available'
    this.ui.li.appendChild(input)
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
        let input=dom('input')
        input.value=file.name
        return input
    }
}
