import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../views/SignIn.vue';
import { useUserStore } from '@/stores/user-store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signIn',
      name: 'signIn',
      component: SignIn,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (!userStore.isUserLoggedIn) next();
        else next({ name: 'RoleManagement' });
      },
    },
    {
      path: '/roleManagement',
      name: 'RoleManagement',
      component: () => import('../views/RoleManagement.vue'),
    },
    {
      path: '/roles',
      name: 'Roles',
      component: () => import('../views/Roles.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.isAdmin) next();
        else next({ name: 'RoleManagement' });
      },
    },
    {
      path: '/createUser',
      name: 'CreateUser',
      component: () => import('../views/CreateUser.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (userStore.isAdmin) next();
        else next({ name: 'RoleManagement' });
      },
    },

    {
      // Wildcard! (like Angular '**' wildcard route)
      path: '/:pathMatch(.*)*',
      redirect: { name: 'RoleManagement' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.name !== 'signIn' && !userStore.isUserLoggedIn)
    next({ name: 'signIn' });
  else next();
});

export default router;
