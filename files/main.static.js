import { Site, browser, dom, general, path } from '/lib/core.static.js';
import EventEmmiter from 'https://gitcdn.link/cdn/anliting/simple.js/eae977ecf2a856ecb072259aa63b003d186ba618/src/simple/EventEmmiter.js';

var style = `a:active,a:link,a:hover,a:visited{
    color:blue;
}
`;

var beRenamed = function(type){
    let input=createInput(this);
    this.ui.li.innerHTML='';
    let p=new Promise(rs=>{
        input.onkeydown=e=>{
            e.stopPropagation();
            if(
                e.keyCode==27||
                e.ctrlKey&&e.keyCode==67&&
                    input.selectionStart==input.selectionEnd
            ){
                input.parentNode.remove(input);
                rs(input.value);
            }
        };
    });
    input.style.width='-webkit-fill-available';
    this.ui.li.appendChild(input);
    input.focus();
    if(type=='insert')
        input.setSelectionRange(0,0);
    else if(type=='append')
        input.setSelectionRange(
            input.value.length,
            input.value.length
        );
    return p
    function createInput(file){
        let input=dom('input');
        input.value=file.name;
        return input
    }
};

function File(name,isDirectory){
    EventEmmiter.call(this);
    this.name=name;
    this.isDirectory=isDirectory;
}
Object.setPrototypeOf(File.prototype,EventEmmiter.prototype);
File.prototype.execute=function(){
    this.emit('execute');
};
Object.defineProperty(File.prototype,'ui',{get(){
    if(this._ui)
        return this._ui
    return this._ui=new Ui(this)
}});
File.prototype.beRenamed=beRenamed;
function Ui(file){
    this.li=createLi(file);
}
function createLi(file){
    let li=dom('li',createA(file),()=>{
        if(getExtension(file.name)=='mp3'){
            let a=createAAudio(file);
            a.ondblclick=e=>e.stopPropagation();
            return['',a]
        }
    });
    li.onclick=()=>file.emit('click');
    li.ondblclick=()=>file.execute();
    return li
}
function createA(file){
    let a=dom('a',file.name+(file.isDirectory?'/':''));
    a.href=file.href;
    a.onclick=e=>{
        e.stopPropagation();
        if(e.which!=1)
            return
        e.preventDefault();
        file.execute();
    };
    return a
}
function createAAudio(file){
    let
        state=0,
        a=dom('a','(play)');
    a.href='javascript:';
    a.onclick=e=>{
        e.stopPropagation();
        if(state==0){
            state=1;
            file.emit('startAudio',file.href);
            a.textContent='(stop)';
        }else if(state==1){
            state=0;
            file.emit('endAudio',file.href);
            a.textContent='(play)';
        }
    };
    return a
}
function getExtension(s){
    let p=s.lastIndexOf('.')+1;
    return p<0?null:s.substring(p)
}

function createFile(fileManager,name,isDirectory){
    let f=new File(name,isDirectory);
    f.href=path.normalize(
        '/home/'+fileManager.directory+'/'+name+
        (isDirectory?'/':'')
    );
    f.on('execute',()=>
        fileManager.emit('fileExecuted',f)
    );
    f.on('click',()=>
        fileManager.focusOn(f.index)
    );
    f.on('startAudio',()=>{
        if(fileManager.audioPlayer.audio)
            fileManager.audioPlayer.end();
        fileManager.audioPlayer.start(f.href);
        fileManager.ui.node.appendChild(fileManager.audioPlayer.audio);
    });
    f.on('endAudio',()=>{
        fileManager.audioPlayer.end();
    });
    f.beRemoved=()=>
        fileManager.remove(`${fileManager.directory}/${f.name}`);
    return f
}
var setupFilelist = async function(){
    let fileManager=this;
    if(fileManager.setupFilelistStatus!=0)
        return fileManager.setupFilelistStatus=2
    fileManager.setupFilelistStatus=1;
    let files=await fileManager.getDirectoryInformation(
        fileManager.directory
    );
    fileManager.files=[];
    if(fileManager.directory[0]!='.')
        files.push({name:'..',isDirectory:true});
    files.map(file=>{
        fileManager.files.push(createFile(
            fileManager,
            file.name,
            file.isDirectory
        ));
    });
    fileManager.filelist=fileManager.files.concat(
        fileManager.fileuploadings
    );
    fileManager.filelist.sort((a,b)=>{
        return a.name.localeCompare(b.name)
    });
    fileManager.ui.ul=createUl(fileManager,fileManager.filelist);
    fileManager.ui.node.appendChild(fileManager.ui.ul);
    {
        let toDoAgain=fileManager.setupFilelistStatus==2;
        fileManager.setupFilelistStatus=0;
        if(!toDoAgain)
            return
        fileManager.purgeFilelist();
        fileManager.setupFilelist();
    }
    function createUl(fileManager,a){
        return dom('ul',a.map((file,index)=>{
            let li=file.ui.li;
            li.onclick=()=>fileManager.focusOn(index);
            return li
        }))
    }
};

var genkeydown = fileManager=>e=>{
    if(e.keyCode==35){ // end
        e.preventDefault();
        fileManager.focusOn(fileManager.filelist.length-1);
    }else if(e.keyCode==36){ // fileManager
        e.preventDefault();
        fileManager.focusOn(0);
    }else if(e.keyCode==65){ // a
        e.preventDefault();
        if(fileManager.focus==undefined)
            return
        let f=fileManager.filelist[fileManager.focus];(async()=>{
            let name=await f.beRenamed('append');
            fileManager._rename(f,name);
        })();
    }else if(e.keyCode==68||e.keyCode==46){ // d
        e.preventDefault();
        if(fileManager.focus==undefined)
            return
        ;(async()=>{
            await fileManager.filelist[fileManager.focus].beRemoved();
            fileManager.purgeFilelist();
            fileManager.setupFilelist();
        })();
    }else if(e.keyCode==71){ // g
        e.preventDefault();
        fileManager.focusOn(e.shiftKey?fileManager.filelist.length-1:0);
    }else if(e.keyCode==72){ // h
        e.preventDefault();
        fileManager.directory+='/..';
    }else if(e.keyCode==73){ // i
        e.preventDefault();
        if(fileManager.focus==undefined)
            return
        let f=fileManager.filelist[fileManager.focus];(async()=>{
            let name=await f.beRenamed('insert');
            fileManager._rename(f,name);
        })();
    }else if(e.keyCode==74){ // j
        e.preventDefault();
        if(fileManager.focus==undefined)
            fileManager.focusOn(0);
        else if(fileManager.focus+1<fileManager.filelist.length)
            fileManager.focusOn(fileManager.focus+1);
    }else if(e.keyCode==75){ // k
        e.preventDefault();
        if(fileManager.focus==undefined)
            fileManager.focusOn(0);
        else if(0<=fileManager.focus-1)
            fileManager.focusOn(fileManager.focus-1);
    }else if(e.keyCode==76||e.keyCode==13){ // l
        e.preventDefault();
        if(fileManager.focus==undefined)
            return
        fileManager.filelist[fileManager.focus].execute();
    }else if(e.keyCode==79){ // o
        e.preventDefault();
        let li=createLi();
        fileManager.ui.ul.appendChild(li);
        li.firstChild.select();
    }
    function createLi(){
        return dom('li',createInput())
    }
    function createInput(){
        let input=dom('input');
        input.style.width='-webkit-fill-available';
        input.onkeydown=e=>{
            e.stopPropagation();
            if(
                e.keyCode==27||
                e.ctrlKey&&e.keyCode==67&&
                    input.selectionStart==input.selectionEnd
            ){
                input.parentNode.remove(input);
                fileManager.ui.focus()
                ;(async()=>{
                    await fileManager.mkdir(input.value);
                    fileManager.purgeFilelist();
                    fileManager.setupFilelist();
                })();
            }
        };
        return input
    }
};

function Fileuploading(directory,name,rawfile){
    this.directory=directory;
    this.name=name;
    this.rawfile=rawfile;
    this.showedLoaded=0;
    {
        let update=()=>{
            this.showLoaded();
            return setTimeout(update,30)
        };
        this.timeoutId=update();
    }
}
Fileuploading.prototype.showLoaded=function(){
    let
        fileuploading=this,
        proportion,
        loadedToBeShown,
        timeAfterLastUpdate;
    if(!fileuploading.loaded)
        return
    timeAfterLastUpdate=(new Date).getTime()-this.loaded.time;
    if(1000<timeAfterLastUpdate)
        return
    loadedToBeShown=
        this.showedLoaded+
        timeAfterLastUpdate/1000*
        (this.loaded.loaded-this.showedLoaded);
    proportion=loadedToBeShown/this.loaded.total;
    this.showedLoaded=loadedToBeShown;
    let timeSpentInMs=(new Date).getTime()-this.starttime;
    fileuploading.div.style.width=proportion*100+'%';
    fileuploading.span.textContent=`${fileuploading.name} (${
            (proportion*100).toFixed(2)
    }% uploaded${
        timeSpentInMs?
            `, ${
                (
                    this.loaded.loaded/1048576/(timeSpentInMs/1000)
                ).toFixed(3)
            }MiB/s`
        :
            ''
    })`;
};
Object.defineProperty(Fileuploading.prototype,'ui',{get(){
    if(this._ui)
        return this._ui
    return this._ui=new Ui$1(this)
}});
function Ui$1(fileuploading){
    fileuploading.setupLi();
    this.li=fileuploading.li;
}
Fileuploading.prototype.setupLi=function(){
    let fileuploading=this;
    this.li=createLi();
    function createLi(){
        let li=dom('li',createDiv(),createSpan());
        li.style.position='relative';
        li.style.border='1px solid black';
        return li
    }
    function createSpan(){
        fileuploading.span=dom('span',fileuploading.name);
        fileuploading.span.style.position='absolute';
        fileuploading.span.style.top='0px';
        return fileuploading.span
    }
    function createDiv(){
        fileuploading.div=dom('div');
        fileuploading.div.style.position='absolute';
        fileuploading.div.style.top='0px';
        fileuploading.div.style.height='100%';
        fileuploading.div.style.width='0%';
        fileuploading.div.style.backgroundColor='lightgreen';
        return fileuploading.div
    }
};
Fileuploading.prototype.send=function(){
    let
        fileuploading=this;
    return new Promise((rs,rj)=>{
        let request=new XMLHttpRequest;
        let formdata=new FormData;
        request.onreadystatechange=()=>{
            if(request.readyState==4&&request.status==200){
                clearTimeout(this.timeoutId);
                rs();
            }
        };
        request.upload.onprogress=e=>{
            if(!e.lengthComputable)
                return
            if(fileuploading.div)
                this.loaded={
                    time:(new Date).getTime(),
                    loaded:e.loaded,
                    total:e.total,
                };
        };
        request.open('POST','_api');
        formdata.append('function','uploadFile');
        formdata.append('directory',this.directory);
        formdata.append('file',this.rawfile);
        this.starttime=(new Date).getTime();
        request.send(formdata);
    })
};

function AudioPlayer(){
}
AudioPlayer.prototype.start=function(src){
    this.audio=dom('audio',{src,autoplay:true});
};
AudioPlayer.prototype.end=function(){
    this.audio.parentNode.removeChild(
        this.audio
    );
    delete this.audio;
};

function Ui$2(){
    this.node=createNode(this);
}
Ui$2.prototype.focus=function(){
    this.node.focus();
};
Ui$2.prototype.purgeFilelist=function(){
    if(!this.ul)
        return
    this.node.removeChild(this.ul);
    delete this.ul;
};
Ui$2.prototype._sendFiles=function(c){
    for(let i=0;i<c.length;i++)
        this.sendFile(c[i]);
};
function createNode(ui){
    let n=dom('div');
    n.tabIndex=0;
    n.style.outline='none';
    n.style.position='relative';
    let dropDiv;
    n.addEventListener('dragover',e=>{
        e.preventDefault();
    });
    n.addEventListener('drop',e=>{
        e.preventDefault();
        n.style.backgroundColor='';
        ui._sendFiles(e.dataTransfer.files);
        removeDropDiv();
    });
    n.addEventListener('dragenter',e=>{
        e.preventDefault();
        n.style.backgroundColor='lightgray';
        if(!dropDiv){
            dropDiv=createDropDiv();
            dropDiv.addEventListener('dragleave',e=>{
                n.removeChild(dropDiv);
                n.style.backgroundColor='';
                dropDiv=undefined;
            });
            n.appendChild(dropDiv);
        }
    });
    if(browser.isMobile){
        let fb=dom.createFileButton();
        fb.on('file',a=>
            ui._sendFiles(a)
        );
        n.appendChild(fb.n);
    }
    return n
    function removeDropDiv(){
        if(!dropDiv)
            return
        n.removeChild(dropDiv);
        dropDiv=undefined;
    }
}
function createDropDiv(){
    let n=dom('div');
    n.style.position='absolute';
    n.style.top='0';
    n.style.width='100%';
    n.style.height='100%';
    return n
}

function FileManager(){
    EventEmmiter.call(this);
    this.pendingRequest=[];
    this.audioPlayer=new AudioPlayer;
    this.fileuploadings=[];
    this.setupFilelistStatus=0;
}
Object.setPrototypeOf(FileManager.prototype,EventEmmiter.prototype);
Object.defineProperty(FileManager.prototype,'directory',{set(pth){
    let targetPath=path.normalize(pth);
    if(targetPath.substring(0,2)=='..')
        return
    this._directory=targetPath;
    this._directoryChange();
},get(){
    return this._directory
}});
FileManager.prototype._directoryChange=function(){
    this.emit('directoryChange');
    this.purgeFilelist();
    this.setupFilelist();
};
FileManager.prototype.setupFilelist=setupFilelist;
FileManager.prototype.purgeFilelist=function(){
    this.focus=undefined;
    this.ui.purgeFilelist();
};
FileManager.prototype.focusOn=function(id){
    if(this.focus!=undefined)
        this.filelist[this.focus].ui.li.style.backgroundColor='';
    this.focus=id;
    this.filelist[this.focus].ui.li.style.backgroundColor='lightgray';
};
FileManager.prototype.beFocused=function(){
    this.ui.focus();
};
Object.defineProperty(FileManager.prototype,'ui',{get(){
    if(this._ui)
        return this._ui 
    let sendfile=(file,update)=>{
        let fileuploading=new Fileuploading(
            this.directory,
            file.name,
            file
        );
        this.fileuploadings.push(fileuploading);
        fileuploading.send().then(()=>{
            this.fileuploadings.splice(
                this.fileuploadings.indexOf(fileuploading),
                1
            );
            update();
        });
        update();
    };
    let ui=new Ui$2;
    ui.node.addEventListener('keydown',genkeydown(this));
    ui.sendFile=f=>sendfile(f,()=>{
        this.purgeFilelist();
        this.setupFilelist();
    });
    return this._ui=ui
}});
Object.defineProperty(FileManager.prototype,'send',{
    configurable:true,
    set(v){
        Object.defineProperty(this,'send',{value:v});
        this.pendingRequest.map(rq=>
            this.send(rq.doc).then(rq.rs)
        );
        this.pendingRequest=[];
    },get(){
        return d=>new Promise(rs=>
            this.pendingRequest.push({doc:d,rs})
        )
    }
});
FileManager.prototype._rename=async function(f,name){
    await this.rename(f,name);
    this.ui.focus();
    this.purgeFilelist();
    this.setupFilelist();
};
FileManager.prototype.getDiskSpace=function(){
    return this.send({
        function:'getDiskSpace',
    })
};
FileManager.prototype.getDirectoryInformation=function(path$$1){
    return this.send({
        function:'getDirectoryInformation',
        path: path$$1
    })
};

function Ui$4(){
    this.node=createNode$1(this);
}
function createNode$1(ui){
    return dom('div',ui.div=createDiv(ui))
}
Ui$4.prototype.appendLeftChild=function(n){
    this.leftDiv.appendChild(n);
};
Ui$4.prototype.appendRightChild=function(n){
    this.rightDiv.appendChild(n);
};
function createDiv(ui){
    let div=dom('div');
    div.style.display='table';
    div.style.tableLayout='fixed';
    div.style.width='100%';
    ui.rowDiv=dom('div',n=>{
        n.style.display='table-row';
        ui.leftDiv=dom('div');
        ui.leftDiv.style.display='table-cell';
        ui.leftDiv.style.width='50%';
        ui.rightDiv=dom('div');
        ui.rightDiv.style.display='none';
        ui.rightDiv.style.width='50%';
        return[ui.leftDiv,ui.rightDiv]
    });
    div.appendChild(ui.rowDiv);
    div.onkeydown=e=>{
        if(e.key!='t')
            return
        e.preventDefault();
        if(ui.tc==undefined){
            ui.tc=createTc(ui);
        }else{
            ui.tc.end();
            delete ui.tc;
        }
    };
    return div
}
function createTc(ui){
    let ended=false,p;
    ui.rightDiv.style.display='table-cell';
    ui.getDiskSpace().then(disk=>{
        if(ended)
            return
        p=dom('p',`${~~(disk.free/1e9)}G/${~~(disk.total/1e9)}G`);
        ui.node.insertBefore(p,ui.div);
    });
    return{
        end(){
            ui.rightDiv.style.display='none';
            if(p)
                p.parentNode.removeChild(p);
            ended=true;
        }
    }
}

function Home(site,directory){
    this._site=site;
    this.fm=createFM(this,directory);
    this.rightFm=createFM(this,directory);
}
function createFM(home,directory){
    let fm=new FileManager;
    fm.directory=directory;
    fm.rename=async(f,name)=>{
        let site=await home._site;
        await site.send({
            function:'renameFile',
            path:`${fm.directory}/${f.name}`,
            newpath:`${fm.directory}/${name}`,
        });
    };
    fm.mkdir=async name=>{
        let site=await home._site;
        return site.send({
            function:'createDirectory',
            path:`${fm.directory}/${name}`,
        })
    };
    fm.remove=async path$$1=>{
        let site=await home._site;
        return site.send({
            function:'remove',
            path: path$$1,
        })
    };
    fm.send=a=>home.send(a);
    return fm
}
Home.prototype.focus=function(){
    this.fm.beFocused();
};
Home.prototype.send=async function(a){
    return(await this._site).send(a)
};
Object.defineProperty(Home.prototype,'ui',{configurable:true,get(){
    let ui=new Ui$4;
    ui.appendLeftChild(this.fm.ui.node);
    ui.appendRightChild(this.rightFm.ui.node);
    ui.getDiskSpace=()=>this.getDiskSpace();
    Object.defineProperty(this,'ui',{value:ui.node});
    return this.ui
}});
Home.prototype.getDiskSpace=function(){
    return this.fm.getDiskSpace()
};

let directory=path.normalize(
        decodeURIComponent(location.pathname).match(/\/home\/?(.*)/)[1]
    );
let home=new Home(new Site,directory);
let listenToDirectoryChange=true;
general();
changeHistory('replaceState',directory);
home.fm.on('directoryChange',e=>{
    if(listenToDirectoryChange)
        changeHistory('pushState',home.fm.directory);
});
home.fm.on('fileExecuted',e=>{
    if(!e.isDirectory)
        location=e.href;
    else
        home.fm.directory+='/'+e.name;
});
onpopstate=e=>{
    listenToDirectoryChange=false;
    home.fm.directory=e.state.directory;
    listenToDirectoryChange=true;
};
dom.head(dom.style(style));
document.body.appendChild(home.ui);
home.focus();
function changeHistory(method,directory){
    history[method](
        {directory},
        '',
        path.normalize(`/home/${directory}`)
    );
    document.title=directory;
}
