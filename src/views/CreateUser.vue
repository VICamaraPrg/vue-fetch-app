<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          clearable
          v-model="createUserForm.first_name"
          label="First Name"
          :rules="rules.firstName"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          clearable
          v-model="createUserForm.last_name"
          label="Last Name"
          :rules="rules.lastName"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          clearable
          v-model="createUserForm.email"
          label="Email"
          :rules="rules.email"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-select
          v-model="createUserForm.gender"
          clearable
          label="Gender"
          :items="GENDERS"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          clearable
          v-model="createUserForm.phone"
          label="Phone"
          :rules="rules.phone"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          clearable
          v-model="createUserForm.image"
          label="Image"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          block
          color="primary"
          :disabled="!isFormValid"
          @click="createUser"
          >Create User</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { GENDERS } from '@/core/constants/gender';
import { APP_ENDPOINTS } from '@/core/endpoints';
import router from '@/router';
import { useUserStore } from '@/stores/user-store';
import { computed, reactive, ref } from 'vue';
import { z } from 'zod';

const userStore = useUserStore();

const createUserForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  gender: '',
  phone: '',
  image: '',
});

const userSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'E-mail must be valid' }),
  phone: z
    .string()
    .min(1, { message: 'Phone is required' })
    .regex(/^\+[1-9]\d{1,14}$/, {
      message: 'Phone must be in the format +1234567890',
    }),
});

const rules = {
  firstName: [
    (v: string) => {
      const result = userSchema.shape.first_name.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
  lastName: [
    (v: string) => {
      const result = userSchema.shape.last_name.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
  email: [
    (v: string) => {
      const result = userSchema.shape.email.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
  phone: [
    (v: string) => {
      const result = userSchema.shape.phone.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
};

const isFormValid = computed(
  () => userSchema.safeParse(createUserForm).success,
);

async function createUser() {
  try {
    const response = await fetch(APP_ENDPOINTS.getOrCreateUsers, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userStore.token}`,
      },
      body: JSON.stringify(createUserForm),
    });

    console.log(createUserForm);

    if (response.ok || response.status === 201) {
      router.push('/roleManagement');
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
