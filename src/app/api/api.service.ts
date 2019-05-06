import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import nbRepoStats from '../../nbRepoStats.json';
import basicStats from '../../basicStats.json';
import nbMembresStats from '../../nbMembresStats.json';
import populareLanguages from '../../populareLanguages.json';
import popularePR from '../../popularePR.json';

const API_URL_DEV = "http://localhost:8080/";
const API_URL_PROD = "https://nataliia-radina.github.io/react-vis-example/";
const TOKEN = "30b5a3a6c9d7c9db1aaec4e93b6d4d6e285eb0d3";
const LOGIN = "Benoitoi";
const ORGANISATION = "Zenika"

@Injectable()
export class ApiService {
    constructor() { }

    getStats(stats): Promise<any> {
        return new Promise((resolve, reject) => {
            if (stats == 'nbRepoStats') {
                console.log(nbRepoStats);
                resolve(nbRepoStats.data)
            } else if (stats == 'basicStats') {
                console.log(basicStats);
                resolve(basicStats.data)
            } else if (stats == 'nbMembresStats') {
                console.log(nbMembresStats);
                resolve(nbMembresStats.data)
            } else if (stats == 'populareLanguages') {
                console.log(populareLanguages);
                resolve(populareLanguages.data)
            } else if (stats == 'popularePR') {
                console.log(popularePR);
                resolve(popularePR.data)
            }
            /*this.createCORSRequest(stats)
                .then((response) => {
                    console.log(response)
                    console.log(stats + " : réponse du serveur ok");
                    resolve(response.data);
                }).catch((error) => {
                    console.log(stats + " : réponse du serveur ko");
                    reject(error);
                })*/
        });
    }

    createCORSRequest(stats): Promise<any> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                var params = `token=${TOKEN}&login=${LOGIN}&orga=${ORGANISATION}`;

                xhr.open('POST', API_URL_DEV + stats, true);
                xhr.onreadystatechange = () => { if (xhr.readyState == 4) console.log(`Contact du serveur pour récupération ${stats} réussi !`); };
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(params);

                xhr.onload = () => { console.log(xhr.response); console.log(JSON.parse(xhr.response)); resolve(JSON.parse(xhr.response)); };
                xhr.onerror = () => { reject('Woops, there was an error making the request.'); };

            } else {
                reject('CORS not supported !');
            }
        });
    }
}
