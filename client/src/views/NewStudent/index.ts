import chance from "chance";
import moment from "moment";
import ResponseAPI from "@/interfaces/Response";
import { Nullable } from "@/interfaces/types";
import { IStudent, IStateStudent } from "@/store/students/state";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";

import IValidationRules from "@/interfaces/IValidation";
import IValidable from "@/interfaces/IValidable";

function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[\s.-]*/gim, "");
  if (
    !cpf ||
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  ) {
    return false;
  }
  let sum = 0;
  let rest;
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(10, 11))) return false;
  return true;
}

@Component({
  filters: {
    formatDate(value: string): string {
      return value ? moment(String(value)).format("MM/DD/YYYY hh:mm") : value;
    },
    formatName(value: string): string {
      return value;
    },
  },
})
export default class Students extends Vue {
  id = 0;
  name = "";
  email = "";
  ra: Nullable<string> = "";
  cpf = "";
  rules: IValidationRules<string> = {
    name: [
      (v: Nullable<string>): boolean | string => {
        return !!v || `Name is required.`;
      },
    ],
    email: [
      (v: Nullable<string>): boolean | string => {
        return !!v || `E-mail is required.`;
      },

      (v: Nullable<string>): boolean | string => {
        return /.+@.+/.test(v || "") || `E-mail is invalid.`;
      },
    ],
    ra: [
      (v: Nullable<string>): boolean | string => {
        return !!v || `RA is required.`;
      },
    ],
    cpf: [
      (v: Nullable<string>): boolean | string => {
        return !!v || `CPF is required.`;
      },
      (v: Nullable<string>): boolean | string => {
        return isValidCPF(v || "") || `CPF is invalid.`;
      },
    ],
  };

  @Action("students/CREATE")
  create!: ({ student }: { student: IStudent }) => ResponseAPI<IStudent>;

  @Action("students/UPDATE")
  update!: ({
    student,
    ra,
  }: {
    student: IStudent;
    ra: Nullable<number>;
  }) => ResponseAPI<IStudent>;

  @Action("students/GET_STUDENT")
  getStudent!: ({ ra }: { ra: number }) => ResponseAPI<IStudent>;

  @State((state: IStateStudent) => state.students.student)
  student!: IStudent;

  @Watch("student")
  watchStudent(student: IStudent): void {
    this.name = student.name;
    this.email = student.email;
    this.ra = String(student.ra || "");
    this.cpf = student.cpf;
  }

  async save(): Promise<void> {
    const valid = await (this.$refs.form as IValidable).validate();
    if (valid) {
      if (this.id && this.id !== 0) {
        const { success } = await this.update({
          ra: Number(this.ra),
          student: {
            name: this.name,
            email: this.email,
            ra: String(this.ra),
            cpf: this.cpf,
          },
        });
        if (success) {
          this.$router.push("/");
        }
      } else {
        const { success } = await this.create({
          student: {
            name: this.name,
            email: this.email,
            ra: String(this.ra),
            cpf: this.cpf,
          },
        });
        if (success) {
          this.autoFill();
          // this.$router.push("/");
        }
      }
    }
  }

  autoFill(): void {
    const c = new chance();
    this.name = c.name();
    this.email = c.email();
    this.ra = String(c.integer({ min: 1000, max: 9999999 }));
    this.cpf = c.cpf();
  }

  created(): void {
    if (this.$route.params.ra) {
      this.id = Number(this.$route.params.ra);
      const ra = this.id;
      this.getStudent({ ra });
    }
  }
}
