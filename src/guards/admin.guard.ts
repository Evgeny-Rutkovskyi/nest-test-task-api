import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES } from "../enums/role.enum";


@Injectable()
export class AdminGuard implements CanActivate {
    constructor (){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest();
            const potentialAdmin = req.user.role;
            return potentialAdmin && potentialAdmin === ROLES.ADMIN;
        } catch (error) {
            return false;
        }
    }
}