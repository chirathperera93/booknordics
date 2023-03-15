/**
 * State for information about configured fulfillment systems
 */
export interface FulfillmentState {

    fulfillmentSystems: FulfillmentSystem[];
}



/**
 * Information about a fulfillment system
 */
export interface FulfillmentSystem {

    /** Fulfillment system id (aka filfillment schema id) */
    readonly id: string|undefined;

    /** Filfillment system name */
    readonly name: string|undefined;
}


export const initialFulfillmentState: FulfillmentState = {
    fulfillmentSystems: []
};


enum FulfillmentActionTypes {
    SET = "SetFulfillmentSystems"
}


/** Action for setting information about configured fulfillment systems */
export const setFulfillmentSystemsAction = (fulfillmentSystems: FulfillmentSystem[]) =>
    ({
        type: FulfillmentActionTypes.SET,
        fulfillmentSystems: fulfillmentSystems
    } as const);



export type FulfillmentActions =
    | ReturnType<typeof setFulfillmentSystemsAction>;



export function fulfillmentReducer(state = initialFulfillmentState, action: FulfillmentActions): FulfillmentState
{
    switch (action.type) {
        case FulfillmentActionTypes.SET: {
            return {
                ...state,
                fulfillmentSystems: action.fulfillmentSystems
            };
        }
        default: {
            return state;
        }
    }
}
