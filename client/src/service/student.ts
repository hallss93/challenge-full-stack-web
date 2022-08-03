/* eslint-disable @typescript-eslint/no-explicit-any*/
import api from "./index";
import params from "./params";
import URL from './URLs';
export default {
    getStudents: async ({ query, page, limit, sortBy, sortDesc, }: { query: string; page: number; limit: number; sortBy: string; sortDesc: boolean; }): Promise<any> => {
        return await api.get(`${URL.STUDENT}/${params.toParamns([{ query, page, limit, sortBy, sortDesc }])}`);
    },
};
