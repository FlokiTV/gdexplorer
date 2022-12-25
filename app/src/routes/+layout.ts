import { dev } from "$app/environment";

//@ts-ignore

export const load = async function ({ data }) {
    if(dev){
        let file = "auth_info.json";
        let json = await import("./../../../.tmp/"+file)
        return {
            port: json.port,
            token: json.accessToken
        }
    }
};