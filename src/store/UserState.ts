/**
 * State information about the application user
 */
export interface UserState {

    /** Username of current application user */
    readonly username: string|undefined;

    /** API key that this user can use to access the service */
    readonly apiKey: string|undefined;

    /** All tenants that this user is authorized for */
    readonly tenants: Tenant[];

    /** The current tenant this user is accessing, as an index into the tenants array */
    readonly currentTenant: number|undefined;

    /** The tenant id corresponding to currentTenant */
    readonly currentTenantId: string|undefined;
}


export interface Tenant {
    readonly id: string;
    readonly name?: string;
}


export const initialUserState: UserState = {
    username: undefined,
    apiKey: undefined,
    currentTenant: undefined,
    currentTenantId: undefined,
    tenants: []
};


enum UserActionTypes {
    AUTHORIZE = "AuthorizeUser",
    LOGOUT = "Logout",
    SET_CURRENT_TENANT = "SetCurrentTenant",
    SET_TENANTS = "SetTenants"
}


/** The user has logged out. */
export const logoutUserAction = () =>
    ({
        type: UserActionTypes.LOGOUT
    } as const);


/** Authorize a user by setting the API key */
export const setAuthorizationAction = (username: string, apikey: string) =>
    ({
        type: UserActionTypes.AUTHORIZE,
        apikey: apikey,
        username: username
    } as const);


/** Set the tenant currently accessed by the user */
export const setCurrentTenantAction = (tenant: number) =>
    ({
        type: UserActionTypes.SET_CURRENT_TENANT,
        tenant: tenant
    } as const);


/** Set the tenants available to this user */
export const setTenantsAction = (tenants: Tenant[]) =>
    ({
        type: UserActionTypes.SET_TENANTS,
        tenants: tenants
    } as const);



export type UserActions =
    | ReturnType<typeof logoutUserAction>
    | ReturnType<typeof setAuthorizationAction>
    | ReturnType<typeof setCurrentTenantAction>
    | ReturnType<typeof setTenantsAction>;



export function userReducer(state = initialUserState, action: UserActions): UserState
{
    switch (action.type) {
        case UserActionTypes.LOGOUT: {
            return initialUserState;
        }
        case UserActionTypes.AUTHORIZE: {
            return {
                ...state,
                apiKey: action.apikey,
                username: action.username
            };
        }
        case UserActionTypes.SET_CURRENT_TENANT: {
            if (action.tenant < 0 || action.tenant >= state.tenants.length) {
                throw new RangeError(`Trying to select tenant ${action.tenant} when ${state.tenants.length} exists`);
            }
            return {
                ...state,
                currentTenant: action.tenant,
                currentTenantId: state.tenants[action.tenant].id
            };
        }
        case UserActionTypes.SET_TENANTS: {
            return {
                ...state,
                tenants: action.tenants,
                currentTenant: action.tenants.length > 0 ? 0 : undefined,
                currentTenantId: action.tenants.length > 0 ? action.tenants[0].id : undefined
            };
        }
        default: {
            return state;
        }
    }
}
