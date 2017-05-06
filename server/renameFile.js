let
    fs=require('fs')
module.exports=async(options,env)=>{
    if(!(
        env.currentUser.isadmin
    ))
        return
    await new Promise((rs,rj)=>{
        fs.rename(
            `${env.config.pathToUsersFiles}/home/`+options.path,
            `${env.config.pathToUsersFiles}/home/`+options.newpath,
            err=>err?rj(err):rs()
        )
    })
    return null
}
