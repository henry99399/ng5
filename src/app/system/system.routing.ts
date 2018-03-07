import { Routes } from '@angular/router';
//模块组建
import { UserComponent } from './user/user.component';
import { MainComponent } from './main/main.component';
import { RoleComponent } from './role/role.component';
import { ResourceComponent } from './resource/resource.component';
import { PayComponent } from './pay/pay.component';
import { OutfitComponent } from './outfit/outfit.component';
import { OrgComponent } from './org/org.component';
import { MessageComponent } from './message/message.component';
import { AuthorityComponent } from './authority/authority.component';
export const routes: Routes = [
    { path: '', component: MainComponent, data: { title: '系统管理', module: 'system', power: "SHOW" } },
    { path: 'user', component: UserComponent, data: { title: '用户管理', module: 'user', power: "SHOW" } },
    { path: 'resource', component: ResourceComponent, data: { title: '菜单管理', module: 'resource', power: "SHOW" } },
    { path: 'pay', component: PayComponent, data: { title: '支付管理', module: 'pay', power: "SHOW" } },
    { path: 'outfit', component: OutfitComponent, data: { title: '机构管理', module: 'outfit', power: "SHOW" } },
    { path: 'org', component: OrgComponent, data: { title: '组织管理', module: 'org', power: "SHOW" } },
    { path: 'message', component: MessageComponent, data: { title: '消息管理', module: 'message', power: "SHOW" } },
    { path: 'authority', component: AuthorityComponent, data: { title: '权限管理', module: 'authority', power: "SHOW" } },
    { path: 'role', component: RoleComponent, data: { title: '角色管理', module: 'role', power: "SHOW" } }
];