import { ROLES } from "src/enums/role.enum"

export type Payload = {
    userId: number,
    email: string,
    role: ROLES
}