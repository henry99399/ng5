import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//web ui 
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';//引入NZ 使用的form核心
import { FormsModule, ReactiveFormsModule } from "@angular/forms";//引入NZ 使用的form核心
import { routes } from './system.routing';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user/user.component';
import { MainComponent } from './main/main.component';
import { RoleComponent } from './role/role.component';
import { ResourceComponent } from './resource/resource.component';
import { PayComponent } from './pay/pay.component';
import { OutfitComponent } from './outfit/outfit.component';
import { OrgComponent } from './org/org.component';
import { MessageComponent } from './message/message.component';
import { AuthorityComponent } from './authority/authority.component';



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule.forRoot() //引入NZ
  ],
  declarations: [
    UserComponent,
    MainComponent,
    PayComponent,
    ResourceComponent,
    OutfitComponent,
    OrgComponent,
    MessageComponent,
    AuthorityComponent,
    RoleComponent
  ],
  providers: [  //引入NZ
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop: '20px' } }
  ]
})
export class SystemModule { }
