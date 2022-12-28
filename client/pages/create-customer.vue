<script setup>
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  isSpanishSpeaker: false,
};
const formState = ref(initialState);

const labelCol = ref({ style: { width: "150px" } });
const wrapperCol = ref({ span: 14 });
</script>

<template>
  <NuxtLayout name="app">
    <div class="box">
      <a-typography-title :level="3">Create Customer</a-typography-title>
      <a-form
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        autocomplete="off"
        validateTrigger="blur"
        @finish="onFinish"
      >
        <a-form-item
          name="firstName"
          label="First name"
          :rules="[{ required: true, message: 'First name is required' }]"
        >
          <a-input v-model:value="formState.firstName" />
        </a-form-item>
        <a-form-item
          name="lastName"
          label="Last name"
          :rules="[{ required: true, message: 'Last name is required' }]"
        >
          <a-input v-model:value="formState.lastName" />
        </a-form-item>
        <a-form-item
          name="email"
          label="Email"
          :rules="[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item
          name="isSpanishSpeaker"
          label="Spanish Speaker"
          :rules="[{ required: true, message: 'This question is required' }]"
        >
          <a-radio-group v-model:value="formState.isSpanishSpeaker">
            <a-radio :value="true">Yes</a-radio>
            <a-radio :value="false">No</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="loading"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
