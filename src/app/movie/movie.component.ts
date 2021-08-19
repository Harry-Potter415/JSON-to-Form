import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup, FormControl } from '@angular/forms';
// import { MovieService } from '../movie.service';
// import { ActorsService } from '../actors.service';
// import { ApiService } from '../api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';

// import {ActorsMetadataService} from '../../../../player/src/app/actors-metadata.service';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    // private actorsService: ActorsService,
    // private movieService: MovieService,
    // private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    // private actorsMetadataService: ActorsMetadataService;
  ) {
  }

  @ViewChild('myDOMElement', { static: true }) MyDOMElement: ElementRef;





  objKeys = Object.keys;

  public actors = ['Peter', 'James', 'John', 'Andrew', 'Simon'];
  // tslint:disable-next-line:max-line-length
  public cameras = [{ label: 'Side', value: 'side' }, { label: 'Front', value: 'front' }, { label: 'Back', value: 'back' }, { label: '3/4', value: '3/4' }, { label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }];
  public effects = ['quake', 'Lightning', 'Fog', 'Rain'];
  public sets = ['Sagrada Familia', 'Syndney Opera House', 'Yosemite', 'Timbuktu', 'airport'];
  public positions = ['left', 'right', 'center'];
  public actorNames;
  public actorObjs;
  public json;
  public saveStatus;
  public playerPath: string;

  public movieForm;
  public submitResponse;
  public moviePath;
  public previewPath;
  public showResponse = false;

  public loadJson;
  public loadData;
  public file: any;

  // -------------------------------------------------------
  public validateForm() {
    if (1 + 1 === 2) // Your form conditions go here
    {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    // this.playerPath = this.movieService.PLAYER_PATH;
    // this.actorObjs = this.actorsService.actors;
    this.actorObjs = {
      malcom: {
        enabled: true,
        actions: {
          walking: {
            enabled: true,
            modes: {
              default: {
                totalFrames: 32,
                visual: 'walking',
                zeroPadding: 4,
                startFrame: 0
              }
            }
          }
        }
      },
      james: {
        enabled: true,
        actions: {
          rapping: {
            enabled: true,
            modes: {
              default: {
                totalFrames: 237,
                visual: 'rapping',
                zeroPadding: 4,
                startFrame: 0
              }
            }
          },
          gestures: {
            enabled: true,
            modes: {
              'hands-forward': {
                totalFrames: 94,
                visual: 'hands-forward',
                zeroPadding: 4,
                startFrame: 0
              }
            }
          }
        }
      }
    };
    Object.keys(this.actorObjs).forEach(key => {
      // tslint:disable-next-line:max-line-length
      this.actorObjs[key].enabled = this.actorObjs[key].enabled === null || this.actorObjs[key].enabled === undefined ? false : this.actorObjs[key].enabled;
    });

    this.actorNames = this.objKeys(this.actorObjs);
    this.json = JSON;
    this.movieForm = this.fb.group({
      title: ['Title of your Movie', [Validators.required, Validators.pattern('[0-9]{4}')]],
      maker: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      producer: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      music: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      scenes: this.fb.array([
        this.initScene()
      ])
    });
    this.movieForm.valueChanges.subscribe(data => this.validateForm());
    this.validateForm();
  }

  initScene() {
    return this.fb.group({
      //  ---------------------forms fields on scenes level ------------------------
      number: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      title: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      caption: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      set: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      fx: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      // ---------------------------------------------------------------------
      actors: this.fb.array([
        this.initActor()
      ])
    });
  }

  initActor() {
    return this.fb.group({
      //  ---------------------forms fields on actors level ------------------------
      name: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      alias: ['alias', [Validators.required, Validators.pattern('[0-9]{4}')]],
      camera: ['camera', [Validators.required, Validators.pattern('[0-9]{4}')]],
      position: ['position', [Validators.required, Validators.pattern('[0-9]{4}')]],
      // ---------------------------------------------------------------------
      actions: this.fb.array([
        this.initAction()
      ])
    });
  }

  initAction() {
    return this.fb.group({
      //  ---------------------forms fields on actions level ------------------------
      verb: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      adverb: ['adverb', [Validators.required, Validators.pattern('[0-9]{4}')]],
      duration: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      speechThoughtLines: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      speechThoughtType: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      // ---------------------------------------------------------------------
    });
  }

  addScene() {
    const control = this.movieForm.controls.scenes as FormArray;
    control.push(this.initScene());
  }


  addActor(sceneIndex) {
    const control = (this.movieForm.controls.scenes as FormArray).at(sceneIndex).get('actors') as FormArray;
    control.push(this.initActor());
  }

  addAction(sceneIndex, actorIndex) {
    // tslint:disable-next-line:max-line-length
    const control = ((this.movieForm.controls.scenes as FormArray).at(sceneIndex).get('actors') as FormArray).at(actorIndex).get('actions') as FormArray;
    control.push(this.initAction());
  }
  onSubmit(movieInfo) {
    // console.warn('Your movie is in the works!', movieInfo, this);
    // this.apiService.saveMovie(movieInfo).subscribe(response => {
    //   this.showResponse = true;
    //   this.submitResponse = JSON.parse(response).movieTitle;
    //   console.log(this.submitResponse.toLowerCase().split(' ').join('_'));
    //   this.moviePath = this.submitResponse.toLowerCase().split(' ').join('_');
    //   this.previewPath = this.domSanitizer.bypassSecurityTrustUrl(this.playerPath + '/' + this.moviePath);
    // });
    // // this.movieDataForm.reset();
    // this.movieService.movieTitle = movieInfo.filmTitle;
    // console.log("onsubmit clicked");
    const blob = new Blob([JSON.stringify(this.movieForm.value)], { type: 'application/json' });
    saveAs(blob, 'abc.json');
  }
  initMovieForm() {
    this.movieForm = this.fb.group({
      title: ['Title of your Movie', [Validators.required, Validators.pattern('[0-9]{4}')]],
      maker: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      producer: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      music: ['', [Validators.required, Validators.pattern('[0-9]{4}')]],
      scenes: this.fb.array([
      ])
    });
    this.movieForm.valueChanges.subscribe(data => this.validateForm());
    this.validateForm();
  }

  handleFileInput(e) {
    this.file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      // this.loadData = fileReader.result;
      // this.loadJson = JSON.parse(this.loadData);
      // console.log(fileReader.result);
      this.loadData = fileReader.result;
      this.loadJson = JSON.parse(this.loadData);
      console.log(this.loadJson);
      this.initMovieForm();
      const countScene = this.loadJson.scenes.length;
      for (let i = 0; i < countScene; i++) {
        this.addScene();
        const countActor = this.loadJson.scenes[i].actors.length;
        let j = 0;
        for (j = 0; j < countActor - 1; j++) {
          this.addActor(i);
        }
      }
      this.movieForm.patchValue({
        maker: this.loadJson.maker,
        producer: this.loadJson.producer,
        scenes: this.loadJson.scenes
      });
    };
    fileReader.readAsText(this.file);


  }

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      // tslint:disable-next-line:only-arrow-functions
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
}
