<template>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="blue"
        :rules="rules.email"
        v-model="signInForm.email"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password
      </div>

      <v-text-field
        type="password"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        color="blue"
        :rules="rules.password"
        v-model="signInForm.password"
      ></v-text-field>

      <v-card
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
      </v-card>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        :disabled="!isFormValid"
        @click="login()"
      >
        Log In
      </v-btn>
    </v-card>
  </div>

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
import type {
  AuthSignInRequest,
  AuthSignInResponse,
} from '@/core/interfaces/auth';
import router from '@/router';
import { useUserStore, type UserStoreState } from '@/stores/user-store';
import { computed, reactive, ref } from 'vue';
import { z } from 'zod';

const userState = useUserStore();

let snackbar = reactive({
  visible: false,
  text: '',
  timeout: 2000,
});

// I know this is wrong (should use reactive) but I have a nice explaination :D
const signInForm = ref({
  email: '',
  password: '',
});

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'E-mail must be valid' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

const rules = {
  email: [
    (v: string) => {
      const result = signInSchema.shape.email.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
  password: [
    (v: string) => {
      const result = signInSchema.shape.password.safeParse(v);
      return result.success
        ? true
        : result.error.issues[0]?.message || 'Invalid input';
    },
  ],
};

const isFormValid = computed(
  () => signInSchema.safeParse(signInForm.value).success,
);

async function login() {
  try {
    const signInRequest: AuthSignInRequest = {
      email: signInForm.value.email,
      password: signInForm.value.password,
    };

    const response = await fetch(APP_ENDPOINTS.signin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: signInRequest.email,
        password: signInRequest.password,
      }),
    });

    if (response.ok) {
      const token: AuthSignInResponse = await response.json();
      const user: UserStoreState = {
        ...token,
      };

      userState.loginUser(user);

      activateSnackbar('Login was successful! Redirecting...');

      // I know this is nasty AF but I'm tired and I want to go to bed
      setTimeout(() => {
        router.push('/roleManagement');
      }, 1000);
    } else {
      console.error('Error');
    }
  } catch (error) {
    console.error(error);
  }
}

function activateSnackbar(message: string) {
  snackbar.visible = true;
  snackbar.text = message;
}
</script>
