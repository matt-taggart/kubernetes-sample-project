<script setup>
import { HomeOutlined, UserAddOutlined } from "@ant-design/icons-vue";

const route = useRoute();
const onNavigate = (route) => {
  navigateTo(route);
};
const selectedSideMenuItem = ref([route.path]);
</script>

<template>
  <div>
    <div class="with-sidebar">
      <div>
        <a-menu
          class="fixed-nav"
          v-model:selectedKeys="selectedSideMenuItem"
          style="width: 256px"
          mode="vertical"
        >
          <a-menu-item key="/" @click="navigateTo('/')">
            <template #icon>
              <HomeOutlined />
            </template>
            Home
          </a-menu-item>
          <a-menu-item
            key="/create-customer"
            @click="navigateTo('/create-customer')"
          >
            <template #icon>
              <UserAddOutlined />
            </template>
            Add Customer
          </a-menu-item>
        </a-menu>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-nav {
  min-height: 100vh;
  position: sticky;
  top: 0;
}
</style>
