let
    diskspace=require('diskspace')
module.exports=(args,env)=>{
    env.currentUser.isadmin||0()
    return diskSpace()
}
function diskSpace(){
    return new Promise((rs,rj)=>{
        diskspace.check('/',(err,res)=>{
            if(err)
                return rj(err)
            rs({
                total:res.total,
                free:res.free,
            })
        })
    })
}
