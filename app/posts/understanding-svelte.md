# Svelte 이해하기: 컴파일러와 반응형 상태

Svelte는 HTML, CSS, JavaScript로 작성한 컴포넌트를 화면 갱신 코드로 컴파일하는 UI 프레임워크입니다. 이 문서는 Svelte 5에서 도입된 runes 문법을 기준으로 설명합니다. [Svelte 공식 개요](https://svelte.dev/docs/svelte/overview)

컴파일 단계가 중요한 역할을 하지만, 브라우저에서 실행되는 JavaScript나 런타임 처리가 전혀 없다는 의미는 아닙니다.

## 컴포넌트 작성하기

`.svelte` 파일에는 로직, 마크업, 스타일을 함께 작성합니다. Svelte 5 빌드 환경에서 다음 코드를 `Counter.svelte`로 저장하고 부모 컴포넌트에서 불러올 수 있습니다.

```svelte
<script lang="ts">
  let count = $state(0)
  let doubled = $derived(count * 2)

  function increment() {
    count += 1
  }
</script>

<section class="counter">
  <h1>Svelte 카운터</h1>
  <p>현재 값: {count}</p>
  <p>두 배: {doubled}</p>
  <button onclick={increment}>증가</button>
</section>

<style>
  .counter {
    padding: 1.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }
</style>
```

부모에서는 다음처럼 사용합니다. 경로는 두 파일의 실제 위치에 맞춥니다.

```svelte
<script>
  import Counter from './Counter.svelte'
</script>

<Counter />
```

## $state: 화면과 연결된 상태

`$state(0)`은 반응형 상태를 선언합니다. `count += 1`처럼 값을 바꾸면 해당 값을 사용하는 화면이 갱신됩니다. 별도의 setter 함수를 호출하거나 `.value` 속성으로 접근하지 않습니다.

`$state`는 일반 라이브러리 함수가 아니라 컴파일러가 해석하는 rune이므로 import하지 않습니다. 일반 `.ts` 파일 어디에서나 사용할 수 있는 함수로 생각하면 안 됩니다. 컴포넌트 밖에서 runes를 사용하는 경우에는 `.svelte.ts` 또는 `.svelte.js` 모듈을 사용합니다. [상태 공식 문서](https://svelte.dev/docs/svelte/$state)

## $derived: 기존 상태에서 계산되는 값

`$derived(count * 2)`는 `count`에서 계산되는 값을 선언합니다. 원본 상태가 변경되면 파생 값도 그 변화에 맞게 갱신됩니다.

합계, 필터링된 목록, 입력 유효성처럼 계산으로 얻을 수 있는 값에 적합합니다. 파생 값을 계산하는 표현식에서는 다른 상태를 변경하는 부수 효과를 피해야 합니다. [파생 상태 공식 문서](https://svelte.dev/docs/svelte/$derived)

## 템플릿과 이벤트

`{count}`는 표현식의 값을 표시하고, `onclick={increment}`는 클릭 핸들러를 연결합니다. 입력값 연결에는 `bind:value`, 조건부 렌더링에는 `{#if}`, 목록에는 `{#each}`를 사용합니다.

```svelte
<script>
  let name = $state('')
</script>

<input bind:value={name} placeholder="이름" />

{#if name.trim()}
  <p>안녕하세요, {name}님!</p>
{:else}
  <p>이름을 입력해 주세요.</p>
{/if}
```

## Svelte와 SvelteKit의 역할

Svelte는 UI 컴포넌트와 반응성을 담당합니다. SvelteKit은 이를 기반으로 페이지 라우팅, 서버 데이터 로딩, SSR 등의 애플리케이션 기능을 제공합니다.

예전 자료에는 `on:click`이나 `$:` 같은 문법이 등장할 수 있습니다. 기존 문법과 runes 모드의 차이를 확인하고, 프로젝트가 사용하는 방식에 맞춰 예제를 적용하세요. 특히 runes 모드에서는 일반 `let` 선언만으로 반응형 상태가 되는 것으로 가정하면 안 됩니다.
