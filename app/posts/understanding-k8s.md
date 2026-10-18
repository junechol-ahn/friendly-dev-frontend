# Kubernetes 이해하기: 컨테이너 배포와 운영의 기본

Kubernetes(쿠버네티스, K8s)는 컨테이너로 만든 애플리케이션의 배포, 확장, 복구를 관리하는 오픈 소스 플랫폼입니다. 개발자가 원하는 실행 상태를 선언하면, Kubernetes는 실제 상태를 관찰하면서 그 상태에 맞추도록 동작합니다.

예를 들어 웹 서버를 세 개 실행하도록 설정했다면, 관리 대상 Pod가 사라졌을 때 필요한 수를 채우도록 새 Pod를 생성합니다. 다만 서버 자원이 부족하거나 이미지에 문제가 있으면 원하는 상태에 도달하지 못할 수 있습니다. 관련 개념은 [Kubernetes 공식 개요](https://kubernetes.io/docs/concepts/overview/)에서 확인할 수 있습니다.

## 컨테이너와 Kubernetes의 관계

컨테이너 이미지는 애플리케이션 코드와 실행에 필요한 파일을 묶은 배포 단위입니다. 컨테이너 런타임은 그 이미지를 실행합니다.

Kubernetes는 여러 서버에 걸쳐 컨테이너를 어디에 배치하고, 몇 개 유지하며, 어떻게 연결할지 관리합니다. 애플리케이션 소스를 자동으로 이미지로 만들어 주는 도구는 아니므로 이미지 빌드와 레지스트리 업로드는 별도로 준비합니다.

## 먼저 알아야 할 구성 요소

- **클러스터(Cluster)**: Kubernetes가 관리하는 서버와 제어 구성 요소의 집합입니다.
- **노드(Node)**: Pod가 실행되는 물리 서버 또는 가상 머신입니다.
- **컨트롤 플레인(Control Plane)**: API 요청을 처리하고, 상태를 관리하며, Pod 배치와 상태 조정을 담당합니다.
- **Pod**: Kubernetes에서 배포하고 관리하는 가장 작은 실행 단위입니다. 하나 이상의 컨테이너가 네트워크와 일부 저장 공간을 공유할 수 있습니다.

웹 애플리케이션 하나를 여러 개 실행하려면 일반적으로 한 Pod에 같은 컨테이너를 여러 개 넣기보다, 애플리케이션 Pod의 개수를 늘립니다.

## Deployment: 원하는 실행 상태 선언하기

Deployment는 Pod 템플릿과 복제본 수를 선언하는 리소스입니다. ReplicaSet을 통해 Pod 수를 유지하고, 템플릿이 바뀌면 새 버전으로 교체하는 과정을 관리합니다.

다음은 Nginx Pod 두 개를 실행하는 학습용 예제입니다. 아래 두 YAML 문서를 `web-demo.yaml`이라는 하나의 파일에 저장할 수 있습니다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web-demo
  template:
    metadata:
      labels:
        app: web-demo
    spec:
      containers:
        - name: nginx
          image: nginx:stable
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-demo
spec:
  selector:
    app: web-demo
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

`replicas: 2`는 유지할 Pod 수입니다. `template`은 생성할 Pod의 설계도이고, `selector.matchLabels`는 관리할 Pod를 식별합니다. 이 예제에서는 Pod의 `app: web-demo` 라벨과 일치합니다.

`nginx:stable`은 학습 편의를 위한 태그입니다. 재현 가능한 배포가 필요하다면 이미지 다이제스트처럼 변경되지 않는 식별자를 사용하는 편이 적절합니다. 업데이트 동작은 [Deployment 공식 문서](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)를 참고하세요.

## Service: 바뀌는 Pod에 안정적인 접점 제공하기

Pod가 교체되면 IP 주소가 달라질 수 있습니다. Service는 Pod 집합에 접근할 수 있는 안정적인 네트워크 접점을 제공합니다.

예제의 Service는 `app: web-demo` 라벨을 가진 Pod를 선택하고, Service의 80번 포트로 들어온 요청을 대상 Pod의 80번 포트로 전달합니다. `containerPort` 선언만으로 외부에 포트가 공개되는 것은 아닙니다.

`ClusterIP`는 클러스터 내부 접근을 위한 기본 Service 유형입니다. 인터넷 공개에는 별도의 구성이 필요합니다. 예를 들어 지원되는 환경에서는 `LoadBalancer` Service를 사용할 수 있고, HTTP 라우팅에는 컨트롤러를 갖춘 Ingress나 Gateway API 구성을 사용할 수 있습니다. 자세한 내용은 [Service 공식 문서](https://kubernetes.io/docs/concepts/services-networking/service/)에 설명되어 있습니다.

## 예제 실행하기

접속 가능한 Kubernetes 클러스터와 해당 클러스터를 바라보도록 설정된 `kubectl`이 필요합니다. 명령은 현재 컨텍스트의 기본 네임스페이스에 적용됩니다.

```bash
# 현재 연결 대상 확인
kubectl config current-context

# Deployment와 Service 생성 또는 갱신
kubectl apply -f web-demo.yaml

# 배포 진행 상태와 리소스 확인
kubectl rollout status deployment/web-demo
kubectl get pods -l app=web-demo
kubectl get service web-demo

# 로컬 8080 포트를 통해 애플리케이션에 접근
kubectl port-forward service/web-demo 8080:80
```

마지막 명령을 실행한 터미널을 유지한 상태에서 브라우저로 `http://localhost:8080`에 접속하면 됩니다. 포트 포워딩은 로컬 확인용이며, 인터넷에 서비스를 공개하는 설정은 아닙니다.

실습을 마치면 포트 포워딩을 `Ctrl+C`로 종료하고, 예제로 만든 리소스를 삭제합니다.

```bash
kubectl delete -f web-demo.yaml
```

## 실제 애플리케이션에 적용할 때

위 예제는 Deployment와 Service의 관계를 익히기 위한 최소 구성입니다. 실제 운영에서는 자원 요청량과 제한, 상태 점검, 설정과 비밀 정보 관리, 로그와 모니터링을 추가로 설계해야 합니다.

특히 애플리케이션 복제본이 여러 개라면 요청이 항상 같은 Pod에 도착한다고 가정하면 안 됩니다. 세션이나 업로드 파일처럼 공유해야 하는 데이터는 외부 저장소나 적절한 영구 스토리지에 보관하도록 설계해야 합니다.

Kubernetes는 여러 애플리케이션의 배포와 복구를 일관되게 관리할 때 유용합니다. 반면 작은 서비스 하나를 운영한다면 클러스터 관리 비용과 복잡성이 더 클 수 있으므로, 필요한 규모와 운영 역량을 함께 고려하는 것이 좋습니다.
