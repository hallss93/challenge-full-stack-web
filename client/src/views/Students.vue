<template>
  <v-app class="body-light">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="10">
          <v-text-field
            v-model="search"
            append-icon="fa-user"
            color="black"
            background-color="white"
            single-line
            hide-details
            label="Digite sua busca"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center justify-center">
          <v-btn icon color="success" @click="$router.push('/new')">
            <v-icon>fa-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div>
        <v-data-table
          dense
          :headers="headers"
          :items="list"
          item-key="id.value"
          class="elevation-1 mt-10"
          :options.sync="pagination"
          :server-items-length="count"
          :sort-desc="sortDesc"
          :sort-by="sortBy"
          @update:sort-by="updateSortBy"
          @update:sort-desc="updateSortDesc"
          @pagination="watchPagination"
        >
          <template v-slot:item.actions="{ item }">
            <div class="mt-2 mb-2">
              <v-btn color="primary" icon @click="openEditMode(item)">
                <v-icon>fa-edit</v-icon>
              </v-btn>
              <v-btn color="primary" icon @click="openDeleteMode(item)">
                <v-icon>fa-trash</v-icon>
              </v-btn>
            </div>
          </template>
          <template v-slot:item.name="{ item }">
            {{ item.name }}
          </template>
          <template v-slot:item.dob.date="{ item }">
            {{ item.dob.date | formatDate }}
          </template>
        </v-data-table>
      </div>
    </v-container>
    <v-dialog v-if="itemEdit" v-model="dialog" width="500" class="elevation-0">
      <v-row align="center" justify="center" class="avatar-container">
        <v-avatar color="orange" size="100" class="avatar-profile">
          <v-img :src="itemEdit.picture.medium"></v-img>
        </v-avatar>
      </v-row>
      <v-btn icon class="close-icon" @click="dialog = false">
        <v-icon>fa-times</v-icon>
      </v-btn>

      <v-card class="pt-15">
        <v-card-text>
          <h2 class="text-center mb-3">
            {{ itemEdit.name.first }} {{ itemEdit.name.last }}
          </h2>
          <h3 class="text-center">{{ itemEdit.email }}</h3>
          <h3 class="text-center">{{ itemEdit.gender }}</h3>
          <h3 class="text-center">{{ itemEdit.dob.date }}</h3>
          <h3 class="text-center">{{ itemEdit.phone }}</h3>
          <h3 class="text-center">{{ itemEdit.nat }}</h3>
          <h3 class="text-center">{{ itemEdit.id.value }}</h3>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteShow" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Exclusão </v-card-title>

        <v-card-text v-if="student">
          Deseja realmente excluir o Estudante
          <b>{{ student.name }} ({{ student.ra }})</b>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogDeleteShow = false"> Cancelar </v-btn>
          <v-btn color="primary" text > Excluir </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script lang="ts">
import moment from "moment";
import ResponseAPI from "@/interfaces/Response";
import { IPaginationStudents } from "@/interfaces/Response";
import { Nullable } from "@/interfaces/types";
import { IStateStudent, IStudent } from "@/store/students/state";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, State } from "vuex-class";
@Component({
  filters: {
    formatDate(value: string): string {
      return value ? moment(String(value)).format("MM/DD/YYYY hh:mm") : value;
    },
  },
})
export default class Students extends Vue {
  @Action("students/GET_STUDENTS")
  getStudents!: ({
    query,
    page,
    limit,
    sortBy,
    sortDesc,
  }: {
    query: string;
    page: number;
    limit: number;
    sortBy: string;
    sortDesc: boolean;
  }) => ResponseAPI<IPaginationStudents<IStudent[]>>;

  @State((state: IStateStudent) => state.students.studentList)
  studentList!: IStudent[];

  @State((state: IStateStudent) => state.students.count)
  count!: number;

  
  @Watch("studentList")
  watchstudentList(): void {
    this.requering = false;
    this.list = this.studentList;
  }

  @Watch("search")
  watchSearch(): void {
    this.getList();
  }

  @Watch("sortBy")
  watchSortBy(): void {
    this.getList();
  }

  @Watch("sortDesc")
  watchSortDesc(): void {
    this.getList();
  }

  @Watch("count")
  watchCount(value: number): void {
    this.pagination.itemsLength = value;
  }

  list: IStudent[] = [];
  sortBy = "ra";
  sortDesc = true;
  dialogDeleteShow = false;
  student: Nullable<IStudent> = null;
  search = "";
  size = 5;
  page = 1;
  pagination = {
    itemsLength: this.count,
    page: this.page,
    itemsPerPage: this.size,
  };
  headers = [
    {
      text: "Registro Acadêmico",
      align: "center",
      sortable: true,
      value: "ra",
    },

    {
      text: "Nome",
      align: "center",
      sortable: true,
      value: "name",
    },

    {
      text: "CPF",
      align: "center",
      sortable: true,
      value: "cpf",
    },

    {
      text: "Ações",
      align: "center",
      sortable: false,
      value: "actions",
    },
  ];
  requering = false;
  dialog = false;
  itemEdit: Nullable<IStudent> = null;

  getList(): void {
    this.getStudents({
      page: this.pagination.page,
      limit: this.pagination.itemsPerPage,
      query: this.search.trim(),
      sortBy: this.sortBy,
      sortDesc: this.sortDesc,
    });
    if (
      this.$route.query &&
      this.$route.query.page &&
      Number(this.$route.query.page) != this.page
    ) {
      this.$router.push({ path: "/", query: { page: String(this.page) } });
    }
  }

  openEditMode(item: IStudent): void {
    this.$router.push(`student/${item.ra}`);
  }

  openDeleteMode(item: IStudent): void {
    this.student = item;
    this.dialogDeleteShow = true;
  }

  updateSortBy(value: string): void {
    this.sortBy = value;
  }

  updateSortDesc(value: boolean): void {
    this.sortDesc = value;
  }

  watchPagination(value: {
    itemsLength: number;
    itemsPerPage: number;
    page: number;
    pageCount: number;
    pageStart: number;
    pageStop: number;
  }): void {
    console.log(value);
    this.page = value.page;
    this.size = value.itemsPerPage;
    this.getList();
  }

  created(): void {
    const query = this.$route.query;
    if (query && query.page) {
      this.page = Number(query.page);
      this.pagination = {
        itemsLength: this.count,
        page: this.page,
        itemsPerPage: this.size * this.page,
      };
    } else {
      this.getList();
    }
  }
}
</script>
