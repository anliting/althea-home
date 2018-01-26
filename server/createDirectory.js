let
    fs=require('fs'),
    path=require('path')
module.exports=async(opt,env)=>{
    opt instanceof Object&&
    typeof opt.path=='string'||0()
    let pathToTarget=`${env.config.pathToUsersFiles}/home/${opt.path}`
    env.currentUser.isadmin&&
    path.normalize(
        path.relative(
            `${env.config.pathToUsersFiles}/home`,
            pathToTarget
        )
    ).substring(0,2)!='..'||0()
    await mkdir(pathToTarget).catch(e=>{
        if(
            e.code=='EEXIST'||
            e.code=='ENOENT'
        )
            return
        throw e
    })
    return null
}
function mkdir(path){
    return new Promise((rs,rj)=>
        fs.mkdir(path,err=>err?rj():rs())
    )
}
