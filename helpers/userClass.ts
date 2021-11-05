interface banReason {
    reason:string;
    days?:number;
}

exports.user = class user {
    #userIdentifier:string;
    #client:any;
    #user:any;
    #guild:any;

    //--// Bans //--//
    #banned:boolean;
    private gateKeeper():boolean {
        if(this.#guild === undefined) return false;
        if(this.#userIdentifier === undefined) return false;
    }

    ban(reason?:banReason){
        if(this.gateKeeper() !== true) return false;
        return this.#user.then((usr:any) => {
            usr.ban(reason);
            return true;
        })
    }

    unban(){
        if(this.gateKeeper() !== true) return false;
        this.#guild.members.unban(this.#userIdentifier);
    }

    kick(reason?:string) {
        return this.#user.then((usr:any) => {
            usr.kick(reason)
                .then(() => { return true; })
                .catch(() => { return false; });
        })
    }

    //--// Bans End //--//

    constructor(userIdentifier:string, guildIdentifier:string, client:any){
        this.#userIdentifier = userIdentifier;
        this.#client = client; 
        this.#guild = client?.guilds?.cache?.get(guildIdentifier); // get the guild
        this.#user = this.#guild?.members?.fetch(userIdentifier); // get the user
        this.getUser();
    }

    getUser(){
        if(this.#guild === undefined) return;
        return this.#user.then((usr:any) => {
            return usr;
        })
    }

    sendMessage(content:any){
        if(this.#guild === undefined) return;
        return this.#user.then((usr:any) => {
            return usr.send(content);
        })
    }

    //--// ROLES //--//
    hasRoles(requiredRoles:string[] | string){
        if(this.#guild === undefined) return;
        return this.#user.then(() => {
            if(requiredRoles.length === 0) return true;

            let pass:boolean = false;

            return this.getRolesName().then((roles:string[]) => {
                // set the user roles array to lowercase, just incase the inputs are weirdly capatalized.
                roles = roles.map(r => r.toLowerCase());

                if(Array.isArray(requiredRoles) === true) {
                    // Set the requiredRoles array to lowercase
                    (requiredRoles as string[]).map(role => role.toLowerCase());

                    // Go trough each role and check if it matches any of the roles in the required roles array
                    roles.forEach((givenRole:string) => {

                        // If both arrays share a role, set pass to true which will later be returned
                        if(requiredRoles.includes(givenRole)) pass = true;
                    });
                }
                else if(roles?.includes((requiredRoles as string).toLowerCase())) pass = true;

                return pass;
            });
        });
    }

    getRoles(){
        if(this.#guild === undefined) return;
        return this.#user.then((usr:any) => {
            let roles:string[] = [];
            usr.roles.cache.forEach((role:any) => roles = [...roles, role]);
            return roles;
        })
    }

    getRolesId(){
        if(this.#guild === undefined) return;
        return this.#user.then((usr:any) => {
            let roles:string[] = [];
            usr.roles.cache.forEach((role:any) => roles = [...roles, (role.id as string)]);
            return roles;
        })
    }

    getRolesName(){
        if(this.#guild === undefined) return;
        return this.#user.then((usr:any) => {
            let roles:string[] = [];
            usr.roles.cache.forEach((role:any) => roles = [...roles, (role.name as string)]);
            return roles;
        })
    }
    //--// END //--//
};