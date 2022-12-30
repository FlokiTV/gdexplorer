import { dev } from "$app/environment";

interface IAuthInfo{
    accessToken: string;
    port: number;
}

export const load = async function () {
    if(dev){
        // let json = await import("./../../../.tmp/auth_info.json")
        let json = await import(`$tmp/auth_info.json`) as IAuthInfo;
        return {
            port: json.port,
            token: json.accessToken
        }
    }
};