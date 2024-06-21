<template>
  <v-card>
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search by first name"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      item-value="first_name"
      items-per-page="10"
      show-expand
      v-model:expanded="expanded"
    >
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            <v-list lines="two">
              <v-list-item
                v-for="(value, key) in item"
                :key="key"
                :title="key"
                :subtitle="
                  isImageUrl(value.toString()) ? undefined : value.toString()
                "
                :prepend-avatar="
                  isImageUrl(value.toString()) ? value.toString() : undefined
                "
              >
              </v-list-item>
            </v-list>
          </td>
        </tr>
      </template>
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-4">
          <v-btn
            v-if="userStore.isAdmin"
            color="indigo-darken-3"
            variant="elevated"
          >
            Edit
          </v-btn>
          <v-btn
            v-if="userStore.isAdmin"
            color="red-darken-3"
            variant="elevated"
            @click="deleteUser(item.id)"
          >
            Delete
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>

  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
        color="pink"
        @click="snackbar.visible = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { APP_ENDPOINTS } from '@/core/endpoints';
import type { User } from '@/core/interfaces/user';
import { useUserStore } from '@/stores/user-store';
import { onMounted, reactive, ref } from 'vue';
import { z } from 'zod';

const search = ref('');
const expanded = ref([]);
const users = ref<User[]>([]);

const snackbar = reactive({
  visible: false,
  text: '',
  timeout: 2000,
});

const headers = [
  {
    title: 'First Name',
    key: 'first_name',
  },
  { title: 'Last Name', key: 'last_name' },
  { title: 'Gender', key: 'gender' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const userStore = useUserStore();

function isImageUrl(value: string) {
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
  const imageUrlSchema = z
    .string()
    .regex(new RegExp(`(${imageFormats.join('|')})`, 'i'));
  return imageUrlSchema.safeParse(value).success;
}

async function deleteUser(id: number) {
  const response = await fetch(`${APP_ENDPOINTS.deleteOrEditUser}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  if (response.status === 204)
    activateSnackbar(`User ${id} deleted successfully!`);
}

async function fetchUsers() {
  const response = await fetch(APP_ENDPOINTS.getOrCreateUsers, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`,
    },
  });

  const data: User[] = await response.json();

  users.value = data;
  console.log(data);
}

function activateSnackbar(message: string) {
  snackbar.visible = true;
  snackbar.text = message;
}

onMounted(() => {
  fetchUsers();
});
</script>
