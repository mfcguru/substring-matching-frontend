import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import axios from 'axios';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  matchingAlgorithmTypes = [
    { id: 0, text: 'OffsetBased' },
    { id: 1, text: 'RegexBased' },
  ];

  model = {
    text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.',
    subtext: '',
    matchingAlgorithmType: 0,
  };

  message = '';
  selectedMatchingAlgorithmType = ''
  showLoading = false;
  showError = false;
  showSuccess = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  submit(): void {
    let self = this;
    self.message = 'Processing... ';
    self.showLoading = true;
    self.showError = false;
    self.showSuccess = false;
    const url = environment.apiBaseUrl + '/findmatch';
    axios
      .post(url, this.model)
      .then((response) => {
        let positions = response.data.positions.join(', ') 
        self.selectedMatchingAlgorithmType = response.data.selectedMatchingAlgorithmType               
        if (response.data.positions.length == 1) {
          self.message = 'A matching substring was found at the following zero-based position [ ' + positions + ' ]'        
        } else {
          self.message = 'Matching (' + response.data.positions.length + ') substrings were found at the following zero-based positions [ ' + positions + ' ]'        
        }        
        self.showSuccess = true;
      })
      .catch((error) => {
        if (error.response.data.title != null) {
          self.message = error.response.data.title  + ' Please ensure that all required fields are filled out.'
        } else if (error.response.data.message != null) {
          self.message = error.response.data.message
        } else {
          self.message =
            'Connection error, please check your internet connection.';
        }
        self.showError = true;
      })
      .finally(() => {
        self.showLoading = false;
      });
  }
}
