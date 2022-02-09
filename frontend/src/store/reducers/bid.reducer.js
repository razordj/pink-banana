import { UPLOAD_CREATE_BID_SUCCESS, UPLOAD_CREATE_BID_FAIL, GET_NFT_BID_SUCCESS, GET_NFT_BID_FAIL} from "../actions/types";

const uploading = {
    upload: {},
    bidData: {},
}
export default function Uploading(state = uploading, action) {
    switch(action.type) {
        case UPLOAD_CREATE_BID_SUCCESS:
            return {...state, upload: action.payload};
        case UPLOAD_CREATE_BID_FAIL:
            return {...state, upload: action.payload};
        case GET_NFT_BID_SUCCESS:
            return {...state, bidData: action.payload};
        case GET_NFT_BID_FAIL:
        return {...state, bidData: action.payload};
        default:
            return {...state};
    }
}