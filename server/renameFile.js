let
    fs=require('fs')
module.exports=function(options,env){
    if(!(
        env.currentUser.isadmin
    ))
        return
    return new Promise((rs,rj)=>{
        fs.rename(
            `${env.config.pathToUsersFiles}/home/`+options.path,
            `${env.config.pathToUsersFiles}/home/`+options.newpath,
            err=>err?rj(err):rs()
        )
    })
}
