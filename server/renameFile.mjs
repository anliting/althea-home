import fs from 'fs'
export default async(opt,env)=>{
    opt instanceof Object&&
    typeof opt.path=='string'&&
    typeof opt.newpath=='string'&&
    env.currentUser.isadmin||0()
    await new Promise((rs,rj)=>{
        fs.rename(
            `${env.althea._dataDir}/${env.config.pathToUsersFiles}/home/`+opt.path,
            `${env.althea._dataDir}/${env.config.pathToUsersFiles}/home/`+opt.newpath,
            err=>err?rj(err):rs()
        )
    })
    return null
}
