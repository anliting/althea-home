let
    diskspace=require('diskspace')
module.exports=(args,env)=>{
    env.currentUser.isadmin||0()
    return diskSpace()
}
function diskSpace(){
    return new Promise((rs,rj)=>{
        diskspace.check('/',(err,total,free,status)=>{
            if(err)
                return rj(err)
            rs({
                total,
                free,
            })
        })
    })
}
