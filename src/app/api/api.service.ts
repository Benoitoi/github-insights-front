import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import nbRepoStats from '../../nbRepoStats.json';
import basicStats from '../../basicStats.json';
import nbMembresStats from '../../nbMembresStats.json';
import populareLanguages from '../../populareLanguages.json';
import popularePR from '../../popularePR.json';
import { environment } from '../../environments/environment';

const API_URL_DEV = environment.api;

@Injectable()
export class ApiService {
    LOGIN = "Benoitoi";
    TOKEN = "1c3a208d14285e81351066386bbac74c4b81431f";
    ORGANISATION = "Zenika"
    constructor() { }

    getStats(stats, organisation, token, login): Promise<any> {
        this.ORGANISATION = organisation ? organisation : this.ORGANISATION
        this.LOGIN = login ? login : this.LOGIN
        this.TOKEN = token ? token : this.TOKEN
        return new Promise((resolve, reject) => {
            /*setTimeout(() => {
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
            }, 3000);*/
            this.createCORSRequest(stats)
                .then((response) => {
                    console.log(response)
                    console.log(stats + " : réponse du serveur ok");
                    resolve(response.data);
                }).catch((error) => {
                    console.log(stats + " : réponse du serveur ko");
                    reject(error);
                })
        });
    }

    createCORSRequest(stats): Promise<any> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                var params = `token=${this.TOKEN}&login=${this.LOGIN}&orga=${this.ORGANISATION}`;

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

    createCORSRequestIam(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.open('GET', environment.iam + "api/code", true);
                xhr.onreadystatechange = () => { if (xhr.readyState == 4) console.log(`Contact du serveur pour IAM réussi !`); };
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Authorization", "Bearer " + token);
                xhr.send();

                xhr.onload = () => { console.log(xhr.response); console.log(JSON.parse(xhr.response)); resolve(JSON.parse(xhr.response)); };
                xhr.onerror = () => { reject('Woops, there was an error making the request.'); };

            } else {
                reject('CORS not supported !');
            }
        });
    }
}
