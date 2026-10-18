# Vue.js 이해하기: 반응형 상태와 컴포넌트

Vue.js는 사용자 인터페이스를 만드는 JavaScript 프레임워크입니다. 상태와 화면의 관계를 선언하면 상태 변화에 맞춰 화면을 갱신합니다. 이 문서는 Vue 3의 Composition API와 `<script setup>`을 기준으로 설명합니다. [Vue 공식 소개](https://vuejs.org/guide/introduction.html)

## 단일 파일 컴포넌트

Vue의 `.vue` 파일은 일반적으로 세 부분으로 구성됩니다.

- `<script setup>`: 상태와 함수 등 컴포넌트의 로직을 작성합니다.
- `<template>`: 화면 구조와 데이터 연결을 선언합니다.
- `<style scoped>`: 해당 컴포넌트에 범위가 지정된 스타일을 작성합니다.

Vue 빌드 환경의 `App.vue`에 다음 예제를 넣어 동작을 확인할 수 있습니다.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value += 1
}
</script>

<template>
  <section class="counter">
    <h1>Vue 카운터</h1>
    <p>현재 값: {{ count }}</p>
    <p>두 배: {{ doubled }}</p>
    <button @click="increment">증가</button>
  </section>
</template>

<style scoped>
.counter {
  padding: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
```

## ref와 computed의 차이

`ref(0)`은 반응형 값을 만듭니다. JavaScript에서는 `count.value`로 접근하지만, 위와 같이 템플릿에 노출된 최상위 ref는 자동으로 풀리므로 `{{ count }}`로 작성합니다. [반응형 기초](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)

`computed()`는 기존 상태에서 계산되는 값을 정의합니다. 예제의 `doubled`는 `count`에 의존하므로 별도로 값을 동기화할 필요가 없습니다. 계산 결과는 반응형 의존성이 바뀔 때까지 캐시됩니다. [계산된 속성](https://vuejs.org/guide/essentials/computed.html)

버튼을 클릭하면 `increment()`가 `count`를 변경하고, 이에 의존하는 표시 값이 갱신됩니다. DOM 요소를 직접 찾아 텍스트를 수정할 필요가 없습니다.

## 템플릿에서 자주 사용하는 문법

- `{{ value }}`: 값을 텍스트로 표시합니다.
- `:disabled="isLoading"`: 속성을 표현식과 연결합니다.
- `@click="save"`: 이벤트 핸들러를 연결합니다.
- `v-if="isVisible"`: 조건에 따라 요소를 렌더링합니다.
- `v-for="item in items"`: 목록을 렌더링합니다. 항목의 정체성을 나타내는 `:key`도 지정합니다.
- `v-model="name"`: 입력 요소와 상태를 연결합니다.

예를 들어 `const name = ref('')`을 선언했다면 `<input v-model="name" />`으로 입력값을 관리할 수 있습니다.

## 컴포넌트와 상태의 범위

부모는 props로 데이터를 전달하고, 자식은 이벤트로 변경 의도를 알리는 방식이 기본입니다. 자식이 부모의 props를 직접 수정하기보다 데이터 흐름을 명확하게 유지하세요.

한 컴포넌트에서만 사용하는 값은 지역 상태로 두고, 반복되는 상태 로직은 composable 함수로 추출할 수 있습니다. 페이지 이동에는 Vue Router, 여러 화면의 공유 상태에는 Pinia 같은 도구를 검토할 수 있습니다. SSR까지 필요한 애플리케이션에서는 Nuxt와 같은 프레임워크도 선택지입니다.
