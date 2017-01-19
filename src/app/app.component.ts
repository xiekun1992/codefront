import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, NavController } from 'ionic-angular';

import { StatusBar } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ProjectsPage, ProjectsTabsPage } from '../pages/projects/projects';
// import { ListPage } from '../pages/list/list';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { SettingsPage } from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: Nav;
  @ViewChild('content') navCtrl: NavController;
  @ViewChild('rightContent') navRight: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  rightMenuPage: any = ProjectsPage;
  // rightMenuPage: any = ProjectsTabsPage;

  // rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      // { title: 'Coding', component: HelloIonicPage },
      // { title: 'Projects', component: ProjectsPage },
      // { title: 'My First List', component: ListPage },
      // { title: 'Sign In', component: SignInPage },
      // { title: 'Sign Up', component: SignUpPage },
      { title: 'Settings', component: SettingsPage }
    ]
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.navRight.setRoot(this.rightMenuPage);
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.navCtrl.push(page.component);
  }
}
