import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { CodePopoverPage } from '../pages/hello-ionic/code-popover';
import { OptionPopoverPage } from '../pages/hello-ionic/option-popover';
import { ProjectsPage, ProjectsTabsPage } from '../pages/projects/projects';
import { PopoverPage } from '../pages/projects/popover';
import { SignInPage } from '../pages/sign-in/sign-in';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { SettingsPage } from '../pages/settings/settings';
import { PreviewPage } from '../pages/preview/preview';
import { SearchPage } from '../pages/search/search';

import { FileTypePipe } from './pipes/file-type.pipe';
import { SortService } from './services/sort.service';
import { DeliverService } from './services/deliver.service';
import { SettingService } from './services/setting.service';


let pipes=[
  FileTypePipe
];
let pages = [
  MyApp,
  ProjectsPage,
  HelloIonicPage,
  SignInPage,
  SignUpPage,
  SettingsPage,
  PopoverPage,
  PreviewPage,
  ProjectsTabsPage,
  SearchPage,
  CodePopoverPage,
  OptionPopoverPage
];

@NgModule({
  declarations: [...pages, ...pipes],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [SortService, DeliverService, SettingService]
})
export class AppModule {}
