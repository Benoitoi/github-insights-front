import { Component, OnInit } from '@angular/core';
import { ApiService } from './api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data2Ready: boolean = false;

  constructor(private apiService: ApiService) { }

  title = 'Browser market shares at a specific website, 2014';
  type = 'PieChart';
  nbMembers;
  nbRepositories;
  data = [];
  data2 = [];
  columnNames = ['Browser', 'Percentage'];
  options = {
    colors: [],
  };
  width = 900;
  height = 400;

  ngOnInit(): void {
    // Nb de membres
    this.apiService.getStats('nbMembresStats').then((response) => {
      console.log(response)
      this.nbMembers = response.countMembers;
    }).catch((error) => {
      console.log(error)
    })

    // Stats basiques
    this.apiService.getStats('basicStats').then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })

    // Stats des respos collaboratifs
    this.apiService.getStats('collaborativesRepos').then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })

    // Nb de repo
    this.apiService.getStats('nbRepoStats').then((response) => {
      console.log(response)
      this.nbRepositories = response.countRepositories;
    }).catch((error) => {
      console.log(error)
    })

    // Langages populaires
    this.apiService.getStats('populareLanguages').then((response) => {
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
      this.data2Ready = true;
    }).catch((error) => {
      console.log(error)
    })

    // Grosses PR
    this.apiService.getStats('popularePR').then((response) => {
      console.log(response)
      response = response.sort((a, b) => b.count - a.count);
      for (let user of response) {
        this.data2.push([user.member, user.count])
      }
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }
}
