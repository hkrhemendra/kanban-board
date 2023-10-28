import axios from "axios";

const callApi = async(config) => {
    const start = Date.now();
    try{
        let response = await axios(config);
        const millis = Date.now() - start;
        let returnData = {
            status: true,
            request: config,
            data: response.data,
            apiStatus: response.status,
            msg: response.statusText,
            authorization: response.headers.authorization,
            timetaken: "" + (millis / 1000) + "s"
        };

        console.log("API CALL RESPONSE :: =======> ", returnData);
        return returnData;
    } catch (error){
        console.log(error);
        const millis = Date.now() - start;
        let returnData = {
            status: false,
            request: config,
            timetaken: "" + (millis / 1000) + "s",
            error: error.message,
            data: error.response.data
        };

        console.log("API CALL RESPONSE :: =======> ", returnData);
        return returnData;

    }
}

export default callApi;