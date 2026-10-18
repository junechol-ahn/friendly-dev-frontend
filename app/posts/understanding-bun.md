# Bun 이해하기: JavaScript 실행부터 패키지 관리까지

Bun은 JavaScript와 TypeScript 애플리케이션을 개발하기 위한 도구 모음입니다. 런타임, 패키지 관리자, 테스트 러너, 번들러를 제공하므로 여러 개발 작업을 같은 명령 도구로 수행할 수 있습니다. [Bun 공식 문서](https://bun.sh/docs)

## 런타임과 패키지 관리자는 역할이 다르다

런타임은 코드를 실행하고 파일 시스템이나 네트워크 같은 기능을 제공합니다. 패키지 관리자는 프로젝트의 의존성을 내려받고 버전을 관리합니다.

따라서 `bun install`로 패키지를 설치했다고 해서 애플리케이션의 실행 환경이 자동으로 Bun으로 바뀌는 것은 아닙니다. 실제 실행 명령과 스크립트를 확인해야 합니다.

## 기본 명령 익히기

Bun을 설치한 환경에서 새 실습 디렉터리를 만들고 다음 명령을 실행합니다. 운영체제별 설치 방법은 [공식 설치 안내](https://bun.sh/docs/installation)를 참고하세요.

```bash
mkdir bun-demo
cd bun-demo
bun init -y

# package.json에 선언된 의존성 설치
bun install

# TypeScript 파일 실행
bun run index.ts

# package.json의 dev 스크립트 실행: 해당 스크립트가 있을 때 사용
bun run dev

# 테스트 실행
bun test
```

TypeScript 파일 실행과 타입 검사는 구분해야 합니다. 코드가 실행된다는 사실만으로 타입 오류가 없다고 판단할 수 없으므로 프로젝트의 타입 검사도 별도로 수행합니다.

## 작은 HTTP 서버 만들기

`server.ts`에 다음 코드를 작성합니다. `Bun.serve()`는 HTTP 요청을 받아 응답을 반환하는 서버를 생성합니다. [HTTP 서버 문서](https://bun.sh/docs/runtime/http/server)

```ts
const server = Bun.serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' })
    }

    if (url.pathname === '/') {
      return new Response('Hello, Bun!')
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`Server: ${server.url}`)
```

다음 명령으로 실행한 뒤 `http://localhost:3000/health`에 접속하면 JSON 응답을 확인할 수 있습니다.

```bash
bun run server.ts
```

`fetch` 핸들러의 이름이 브라우저의 `fetch()`와 같지만 역할은 다릅니다. 여기서는 들어온 요청을 처리하고, 전역 `fetch()`는 다른 서버에 요청을 보낼 때 사용합니다.

## 기존 프로젝트에 도입할 때

Bun은 Node.js 생태계와의 호환성을 목표로 하지만, 모든 패키지와 실행 방식이 동일하게 동작한다고 가정하면 안 됩니다. 패키지 설치부터 적용하고, 빌드·테스트·실행을 확인한 뒤 런타임 전환을 검토할 수 있습니다.

팀에서는 사용할 패키지 관리자와 잠금 파일을 정해 의존성 설치 결과를 일관되게 유지하세요. 속도 개선 효과는 프로젝트와 환경에 따라 달라지므로 실제 작업 시간을 측정하는 편이 좋습니다.
