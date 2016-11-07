Promise.all([
    module.import('../File.js'),
]).then(modules=>{
    let
        File=           modules[0]
    return function(){
        let
            home=this
        if(home.setupFilelistStatus!=0)
            return home.setupFilelistStatus=2
        home.setupFilelistStatus=1
        home.getDirectoryInformation(home.directory).then(files=>{
            home.files=[]
            if(home.directory[0]!='.')
                files.push({name:'..',isDirectory:true})
            files.forEach(file=>{
                home.files.push(new File(
                    home,
                    file.name,
                    file.isDirectory
                ))
            })
            home.div.ul=createUl()
            home.div.appendChild(home.div.ul)
            {
                let toDoAgain=home.setupFilelistStatus==2
                home.setupFilelistStatus=0
                if(!toDoAgain)
                    return
                home.purgeFilelist()
                home.setupFilelist()
            }
        },err=>{
            throw err
        })
        function createUl(){
            var ul,files
            ul=document.createElement('ul')
            home.filelist=home.files.concat(home.fileuploadings)
            home.filelist.sort((a,b)=>{
                return a.name.localeCompare(b.name)
            })
            home.filelist.forEach((file,index)=>{
                file.setupLi()
                file.li.onclick=()=>{
                    home.focusOn(index)
                }
                ul.appendChild(
                    file.li
                )
            })
            return ul
        }
    }
})
