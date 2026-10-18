# Zustand 이해하기: React 컴포넌트 간 상태 공유

Zustand는 여러 컴포넌트가 사용할 상태와 변경 함수를 store에 모아 관리하는 라이브러리입니다. React에서는 hook으로 store의 필요한 값을 구독할 수 있습니다. 기본적인 전역 store 사용에는 별도의 Provider가 필요하지 않습니다. [Zustand 공식 저장소](https://github.com/pmndrs/zustand)

## 언제 공유 상태가 필요한가

여러 화면에서 함께 쓰는 필터, 장바구니, 편집 설정처럼 컴포넌트 경계를 넘는 상태에 사용할 수 있습니다. 한 컴포넌트의 입력값처럼 범위가 좁은 상태는 `useState`로 관리해도 충분합니다.

서버에서 가져온 데이터는 요청·캐시·재검증의 수명도 중요합니다. 모든 데이터를 store에 복사하기보다 라우터의 데이터 로딩이나 서버 상태 도구와 역할을 나누는 편이 관리하기 쉽습니다.

## 설치와 store 정의

React 프로젝트에서 패키지를 설치합니다.

```bash
npm install zustand
```

다음 코드를 `useCounterStore.ts`에 작성합니다. 예제는 브라우저에서 공유하는 카운터 상태를 가정합니다.

```ts
import { create } from 'zustand'

type CounterState = {
  count: number
  increment: () => void
  reset: () => void
}

export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

`create()`는 store와 연결된 React hook을 만듭니다. `set()`은 상태를 변경하며, 기본적으로 최상위 속성을 얕게 병합합니다. 이전 값에서 계산할 때는 `set((state) => ...)` 형태를 사용합니다.

## 컴포넌트에서 사용하기

같은 디렉터리의 `Counter.tsx`에서 hook을 불러옵니다.

```tsx
import { useCounterStore } from './useCounterStore'

export default function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const reset = useCounterStore((state) => state.reset)

  return (
    <section>
      <h1>Zustand 카운터</h1>
      <p>현재 값: {count}</p>
      <button onClick={increment}>증가</button>
      <button onClick={reset}>초기화</button>
    </section>
  )
}
```

버튼 클릭으로 store가 갱신되면 선택한 값이 바뀐 구독 컴포넌트에 변경이 반영됩니다. 다른 컴포넌트에서도 같은 hook을 사용하면 동일한 카운터를 읽습니다.

## selector로 구독 범위 정하기

`(state) => state.count` 같은 함수를 selector라고 부릅니다. 필요한 값만 선택하면 관련 없는 store 변경으로 인한 갱신을 줄일 수 있습니다.

`useCounterStore()`처럼 전체 상태를 구독하면 store의 다른 값이 바뀔 때도 영향을 받습니다. 여러 값을 객체로 묶어서 반환하는 selector를 사용할 때는 매번 새 객체가 생성되는 점을 고려하고, 필요하면 `useShallow`를 사용합니다.

## 중첩 객체와 서버 렌더링

얕은 병합은 중첩 객체 내부까지 자동으로 합치지 않습니다. 예를 들어 `profile`의 이름만 변경할 때는 기존 필드를 복사해 새 객체를 만듭니다.

```ts
// profile과 setName을 가진 별도 store의 액션 예시
setName: (name: string) =>
  set((state) => ({
    profile: { ...state.profile, name },
  }))
```

SSR 환경에서는 모듈 전역 store에 사용자별 서버 데이터를 저장하면 요청 간에 상태가 공유될 수 있습니다. 서버 요청별 store 생성과 클라이언트 초기 상태 일치를 설계해야 합니다. 또한 기본 store는 메모리에 있으므로 새로고침 후 자동 보존되지 않습니다. 보존이 필요하다면 persist 미들웨어와 저장할 상태의 범위를 별도로 검토하세요.
