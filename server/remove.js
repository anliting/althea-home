let
    fs=require('mz/fs'),
    path=require('path')
module.exports=async(args,env)=>{
    let pathToTarget=env.config.pathToUsersFiles+'/home/'+args.path
    if(!(
        env.currentUser.isadmin&&
        path.normalize(path.relative(
            `${env.config.pathToUsersFiles}/home`,pathToTarget
        )).substring(0,2)!='..'
    ))
        return
    try{
        let stat=await fs.lstat(pathToTarget)
        stat.isFile()?
            fs.unlink(pathToTarget)
        :stat.isDirectory&&
            fs.rmdir(pathToTarget).catch(err=>{
                if(err.code=='ENOTEMPTY')
                    return
                throw err
            })
    }catch(err){
        if(err.code=='ENOENT')
            return
        throw err
    }
    return null
}
