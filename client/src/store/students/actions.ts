import { Func2 } from '@/interfaces/types';
import studentService from '../../service/student';
import { IStudent } from './state';
export default {
    async GET_STUDENTS({ commit }: { commit: Func2<string, boolean | IStudent | number, void> }, { query, page, limit, sortBy, sortDesc, }: { query: string; page: number; limit: number; sortBy: string; sortDesc: boolean; }): Promise<void> {
        commit('SET_LOADING', true);
        return studentService.getStudents({
            query, page, limit, sortBy, sortDesc
        }).then((res) => {
            commit('SET_STUDENT_COUNT', res.data.data.students.count);
            commit('SET_STUDENT_LIST', res.data.data.students.rows);
            return res.data
        }).catch((err) => {
            return err
        }).finally(() => {
            commit('SET_LOADING', false);
        })
    },


}
