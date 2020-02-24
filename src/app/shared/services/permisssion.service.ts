import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { from } from 'rxjs';

import { Injectable } from '@angular/core';

import { Permission } from '../enums/permission.enum';
import { Role } from '../enums/role.enum';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: any;
  private roles: any;

  constructor(
    protected ps: NgxPermissionsService,
    protected rs: NgxRolesService
  ) {
    this.permissions = Object.values(Permission);
    this.roles = {
      [Role.Admin]: this.permissions,
      [Role.Moderator]: [
        Permission.UsersPage,
        Permission.ContactsSearchAllOption
      ],
      [Role.User]: []
    };
  }
  hasPermission$(permission: Permission) {
    return from(this.ps.hasPermission(permission));
  }

  setActiveRole(role: Role): void {
    const permissions = this.roles[role];
    this.ps.loadPermissions(permissions);
    this.rs.addRole(role, permissions);
  }

  removeActiveRole(): void {
    this.ps.flushPermissions();
    this.rs.flushRoles();
  }
}
