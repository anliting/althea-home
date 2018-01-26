let
    fs=require('mz/fs'),
    path=require('path')
module.exports=async(opt,env)=>{
    opt instanceof Object&&
    typeof opt.path=='string'&&
    env.currentUser.isadmin||0()
    let pathToTarget=env.config.pathToUsersFiles+'/home/'+opt.path
    path.normalize(path.relative(
        `${env.config.pathToUsersFiles}/home`,pathToTarget
    )).substring(0,2)!='..'||0()
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
