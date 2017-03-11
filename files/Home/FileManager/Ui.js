(async()=>{
    let browser=await module.repository.althea.browser
    function Ui(){
        this.node=createNode(this)
    }
    Ui.prototype.focus=function(){
        this.node.focus()
    }
    Ui.prototype.purgeFilelist=function(){
        if(!this.ul)
            return
        this.node.removeChild(this.ul)
        delete this.ul
    }
    Ui.prototype._sendFiles=function(c){
        for(let i=0;i<c.length;i++)
            this.sendFile(c[i])
    }
    function createNode(ui){
        let n=document.createElement('div')
        n.tabIndex=0
        n.style.outline='none'
        n.style.position='relative'
        let dropDiv
        n.addEventListener('dragover',e=>{
            e.preventDefault()
        })
        n.addEventListener('drop',e=>{
            e.preventDefault()
            n.style.backgroundColor=''
            ui._sendFiles(e.dataTransfer.files)
            removeDropDiv()
        })
        n.addEventListener('dragenter',e=>{
            e.preventDefault()
            n.style.backgroundColor='lightgray'
            if(!dropDiv){
                dropDiv=createDropDiv()
                dropDiv.addEventListener('dragleave',e=>{
                    n.removeChild(dropDiv)
                    n.style.backgroundColor=''
                    dropDiv=undefined
                })
                n.appendChild(dropDiv)
            }
        })
        if(browser.isMobile)
            n.appendChild(createFileButton(ui))
        return n
        function removeDropDiv(){
            if(!dropDiv)
                return
            n.removeChild(dropDiv)
            dropDiv=undefined
        }
    }
    function createDropDiv(){
        let n=document.createElement('div')
        n.style.position='absolute'
        n.style.top='0'
        n.style.width='100%'
        n.style.height='100%'
        return n
    }
    function createFileButton(ui){
        let n=document.createElement('button')
        n.textContent='Upload'
        n.onclick=e=>{
            let o=createFileInput(ui)
            o.click()
        }
        return n
    }
    function createFileInput(ui){
        let n=document.createElement('input')
        n.type='file'
        n.onchange=e=>ui._sendFiles(n.files)
        return n
    }
    return Ui
})()
