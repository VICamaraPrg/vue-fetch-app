<template>
  <v-list lines="two">
    <v-list-item
      v-for="(value, key) in roles"
      :key="key"
      :title="key"
      :subtitle="value"
    >
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { APP_ENDPOINTS } from '@/core/endpoints';
import { useUserStore } from '@/stores/user-store';
import { onMounted, ref } from 'vue';

const roles = ref([]);
const userStore = useUserStore();

async function fetchRoles() {
  const response = await fetch(APP_ENDPOINTS.roles, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userStore.token}`,
    },
  });
  const data = await response.json();
  roles.value = data;
}

onMounted(() => {
  fetchRoles();
});
</script>
