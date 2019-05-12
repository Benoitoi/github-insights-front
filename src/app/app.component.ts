import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from './api/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
const axios = require('axios');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  nbRepositoriesReady: boolean = false;
  nbMembersReady: boolean = false;
  iamUrl = environment.iam + "api/code"
  dataError: boolean;
  data2Error: boolean;
  data3Error: boolean;
  data4Error: boolean;
  data5Error: boolean;
  data6Error: boolean;
  nbMembersError: boolean;
  nbRepositoriesError: boolean;
  constructor(private apiService: ApiService, private http: HttpClient) { }

  title = 'Browser market shares at a specific website, 2014';
  type = 'PieChart';
  nbMembers;
  nbRepositories;
  data = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  data6 = [];
  organisation = "Zenika";
  user = null;
  token = null;
  connected = false;
  dataReady = false
  data2Ready = false
  data3Ready = false
  data4Ready = false
  data5Ready = false
  data6Ready = false
  errorIam = false;
  errorApi = false
  columnNames = ['Browser', 'Percentage'];
  options = {
    colors: [],
  };

  optionsTree = {
    minColor: "#ff7777",
    midColor: '#ffff77',
    maxColor: '#77ff77',
    headerHeight: 15,
    showScale: true,
    generateTooltip: this.showStaticTooltip
  };
  width = 900;
  height = 650;
  innerWidth = window.innerWidth - 15;
  showStaticTooltip(row, size, value) {
    console.log(value)
    return "";
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth - 15;
    //this.innerLength = window.innerWidth;
  }

  getCookie(name: string) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length == 2) {
      return parts.pop().split(";").shift();
    }
  }


  ngOnInit(): void {
    var token = this.getCookie("token");
    if (token) {
      this.connected = true;
      var reqHeader = new HttpHeaders({
        'Authorization': 'Bearer ' + token,
      });

      // console.log(token);
      // var instance = axios.create({
      //   baseURL: this.iamUrl,
      //   timeout: 60000,
      //   headers: { 'Authorization': 'Bearer ' + token }
      // });


      axios.get(this.iamUrl, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then(response => {
        console.log(response.data)
        this.user = response.data.username;
        this.token = response.data.token;
        console.log(response.data.username)
        console.log(response.data.token)
        this.load();
      }
      ).catch(response => {
        this.errorIam = true;
        console.log(response)
      });
      // instance.get()
      //   .then(function (response) {
      //     // handle success
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     // handle error
      //     console.log(error);
      //   })
      //   .finally(function () {
      //     // always executed
      //   });
      //   this.apiService.createCORSRequestIam(token)
      //   .then((response) => {
      //       console.log(response)
      //   }).catch((error) => {
      //       console.log("réponse du serveur ko");
      //   })
      // this.getUser(token, reqHeader)
      //    .subscribe((data: string) => {
      //      console.log(data)
      //    });
    }
  }

  getUser(token: string, reqHeader: HttpHeaders) {
    return this.http.get(this.iamUrl, { headers: reqHeader });
  }

  login() {
    window.location.href = environment.iam + 'login/github';
  }

  disconnect() {
    window.location.href = environment.iam + 'logout';
  }

  load() {
    this.dataReady = false
    this.data2Ready = false
    this.data3Ready = false
    this.data4Ready = false
    this.data5Ready = false
    this.data6Ready = false
    this.dataError = false
    this.data2Error = false
    this.data3Error = false
    this.data4Error = false
    this.data5Error = false
    this.data6Error = false
    this.nbMembersError = false;
    this.nbRepositoriesError = false;
    this.nbMembers = null;
    this.nbRepositories = null;
    this.data = [];
    this.data2 = [];
    this.data3 = [];
    this.data4 = [];
    this.data5 = [];
    this.data6 = [];
    // Nb de membres
    this.apiService.getStats('nbMembresStats', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
      this.nbMembers = response.countMembers;
      this.nbMembersReady = true;
    }).catch((error) => {
      this.nbMembersError = true;
      console.log(error)
    })
    // Stats basiques
    this.apiService.getStats('basicStats', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
      console.log(response.data.organization.membersWithRole.edges)
      this.data4.push(["Famous Members", null, 0])
      let usersLangagues = [];
      let count = 0;
      for (let node of response.data.organization.membersWithRole.edges) {
        console.log(node)
        console.log(node.node.name)
        console.log(node.node.followers.totalCount)
        this.data4.push([(node.node.name.trim() === '' ? node.node.login : node.node.name) + " (" + node.node.followers.totalCount + ")", 'Famous Members', node.node.followers.totalCount])
        this.data5.push([(node.node.name.trim() === '' ? node.node.login : node.node.name), node.node.repositories.totalCount])
        for (let repo of node.node.repositories.nodes) {
          if (repo.primaryLanguage) {
            if (!usersLangagues[count]) {
              usersLangagues.push(new Map())
            }
            /*console.log(count)
            console.log(repo.primaryLanguage.name)
            console.log(usersLangagues[count].get(repo.primaryLanguage.name))
            console.log(usersLangagues[count])*/
            if (usersLangagues[count].get(repo.primaryLanguage.name)) {
              usersLangagues[count].set(repo.primaryLanguage.name, usersLangagues[count].get(repo.primaryLanguage.name) + 1);
            } else {
              usersLangagues[count].set(repo.primaryLanguage.name, 1)
            }
          }
        }
        var array = [];
        usersLangagues[count].forEach((value, key) => {
          console.log(key + " = " + value);
          array.push({
            language: key,
            count: value
          });
        });
        var sorted = array.sort((a, b) => {
          return (b.count > a.count) ? 1 : ((a.count > b.count) ? -1 : 0)
        });
        this.data3.push([(node.node.name.trim() === '' ? node.node.login : node.node.name), sorted[0].language, sorted[0].count])
        console.log(sorted)
        console.log(usersLangagues[count]);
        count++;
      }
      console.log(this.data4)
      var map = new Map();
      for (let stats of this.data3) {
        if (map.get(stats[1])) {
          map.set(stats[1], map.get(stats[1]) + 1)
        } else {
          map.set(stats[1], 1)
        }
      }
      var array = [];
      map.forEach((value, key) => {
        console.log(key + " = " + value);
        array.push({
          language: key,
          count: value
        });
      });
      var sorted = array.sort((a, b) => {
        return (b.count > a.count) ? 1 : ((a.count > b.count) ? -1 : 0)
      });
      for (let lang of sorted) {
        this.data6.push([lang.language, lang.count])
      }
      console.log(this.data6)
      this.data3 = this.data3.sort((a, b) => b[2] - a[2]);
      this.data4 = this.data4.sort((a, b) => b[2] - a[2]);
      this.data5 = this.data5.sort((a, b) => b[1] - a[1]);
      this.data3Ready = true;
      this.data6Ready = true;
      this.data4Ready = true;
      this.data5Ready = true;
      console.log(this.data4)
      console.log(this.data5)
    }).catch((error) => {
      this.data3Error = true;
      this.data6Error = true;
      this.data4Error = true;
      this.data5Error = true;
      console.log(error)
    })

    // Stats des respos collaboratifs
    this.apiService.getStats('collaborativesRepos', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })

    // Nb de repo
    this.apiService.getStats('nbRepoStats', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
      this.nbRepositories = response.countRepositories;
      this.nbRepositoriesReady = true;
    }).catch((error) => {
      this.nbRepositoriesError = true;
      console.log(error)
    })

    // Langages populaires
    this.apiService.getStats('populareLanguages', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
      let languagesArray = []
      for (let i = 0; i < response.langages.length; i++) {
        languagesArray.push({ language: response.langages[i], nbRepositories: response.nbRepositories[i] })
      }
      console.log(languagesArray)
      languagesArray = languagesArray.sort((a, b) => b.nbRepositories - a.nbRepositories);
      console.log(languagesArray)
      // storing all letter and digit combinations
      // for html color code
      var letters = "0123456789ABCDEF";


      for (let language of languagesArray) {
        // html color code starts with #
        var color = '#';
        // generating 6 times as HTML color code consist
        // of 6 letter or digits
        for (var i = 0; i < 6; i++) {
          color += letters[(Math.floor(Math.random() * 16))];
        }
        console.log(color)
        this.options.colors.push(color);
        console.log(this.options.colors)
        this.data.push([language.language, language.nbRepositories])
      }
      this.dataReady = true;
    }).catch((error) => {
      this.dataError = true;
      console.log(error)
    })

    // Grosses PR
    this.apiService.getStats('popularePR', this.organisation, this.user, this.token).then((response) => {
      console.log(response)
      response = response.sort((a, b) => b.count - a.count);
      for (let user of response) {
        this.data2.push([user.member, user.count])
      }
      this.data2Ready = true;
      console.log(response)
    }).catch((error) => {
      this.data2Error = true;
      console.log(error)
    })
  }
}
