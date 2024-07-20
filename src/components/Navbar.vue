<template>
  <v-app-bar
    app
    dense
  >
    <v-toolbar-title>
      <span class="title">Fetch app</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu
      open-on-hover
      v-if="userStore.isUserLoggedIn"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          outlined
          density="default"
          icon="mdi-open-in-new"
          color="primary"
          v-bind="props"
        >
          {{ userStore.initials }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(value, key) in userStore.getAllInfo"
          :key="key"
          :title="key"
          :subtitle="value?.toString()"
        >
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn>
      <router-link
        class="router-link-custom"
        to="roleManagement"
        >Home</router-link
      >
    </v-btn>

    <v-btn>
      <router-link
        class="router-link-custom"
        to="shop"
        >Shop</router-link
      >
    </v-btn>

    <v-btn v-if="cartStore.cart.products.length">
      <router-link
        class="router-link-custom"
        to="checkout"
        >Checkout</router-link
      >
      <v-badge
        color="red"
        :content="cartStore.getTotalProductQuantity"
        offset-x="-12"
        offset-y="-12"
      >
      </v-badge>
    </v-btn>

    <!-- <v-btn>
      <router-link
        class="router-link-custom"
        to="createUser"
        >Create user</router-link
      >
    </v-btn> -->

    <v-btn v-if="userStore.isAdmin">
      <router-link
        class="router-link-custom"
        to="roles"
        >Roles</router-link
      >
    </v-btn>

    <v-btn
      outlined
      color="primary"
      @click="userStore.logout"
      v-show="userStore.isUserLoggedIn"
      >{{ userStore.isUserLoggedIn ? 'Logout' : 'Login' }}</v-btn
    >
  </v-app-bar>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart-store';
import { useUserStore } from '@/stores/user-store';

const userStore = useUserStore();
const cartStore = useCartStore();
</script>

<style scoped>
.router-link-custom {
  text-decoration: none;
  color: inherit;
}

.router-link-custom:hover {
  text-decoration: underline;
}
</style>
