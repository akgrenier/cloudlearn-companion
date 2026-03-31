import type { Track } from "../types.js";

export const istioTrack: Track = {
  id: "istio",
  name: "Istio Service Mesh",
  description: "Master service mesh concepts: traffic management, security, observability",
  icon: "🔷",
  modules: [
    {
      id: "istio-basics",
      title: "Service Mesh Fundamentals",
      description: "Understanding sidecars, virtual services, and destination rules",
      concepts: [
        {
          id: "istio-intro",
          title: "What is Istio?",
          explanation:
            "Istio is a service mesh that transparently adds traffic management, security, and observability to microservices. It injects Envoy sidecar proxies alongside your pods to handle all network communication.",
          commands: [
            {
              command: "istioctl install --set profile=demo",
              description: "Install Istio with the demo profile",
            },
            {
              command: "kubectl label namespace default istio-injection=enabled",
              description: "Enable automatic sidecar injection",
            },
            {
              command: "kubectl get pods -n istio-system",
              description: "Check Istio control plane pods",
            },
            {
              command: "istioctl analyze",
              description: "Analyze Istio configuration for issues",
            },
          ],
        },
        {
          id: "istio-traffic",
          title: "Traffic Management",
          explanation:
            "VirtualServices define routing rules. DestinationRules define subsets and load balancing. Together they control how traffic flows between services.",
          yamlExample: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - match:
        - headers:
            end-user:
              exact: "test-user"
      route:
        - destination:
            host: reviews
            subset: v2
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 90
        - destination:
            host: reviews
            subset: v2
          weight: 10`,
        },
      ],
      exercises: [
        {
          id: "istio-ex-1",
          type: "kubectl",
          title: "Enable Sidecar Injection",
          prompt:
            "Enable automatic Istio sidecar injection for the 'production' namespace.",
          context: "Istio is installed. You need sidecars injected automatically.",
          hints: [
            "istioctl kube-inject is manual; labels enable automatic injection",
            "The label key is 'istio-injection'",
          ],
          solution:
            "kubectl label namespace production istio-injection=enabled",
          validation: {
            type: "command_match",
            criteria: ["kubectl label namespace production", "istio-injection=enabled"],
          },
        },
        {
          id: "istio-ex-2",
          type: "yaml",
          title: "Canary Deployment with VirtualService",
          prompt:
            "Write a VirtualService that sends 90% of traffic to 'reviews-v1' and 10% to 'reviews-v2' for the 'reviews' service.",
          context: "You have two versions of the reviews service running.",
          hints: [
            "VirtualService uses hosts to identify the service",
            "Weights in each route destination must sum to 100",
            "Define a DestinationRule with subsets v1 and v2 separately",
          ],
          solution: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 90
        - destination:
            host: reviews
            subset: v2
          weight: 10`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "kind: VirtualService",
              "hosts:",
              "reviews",
              "subset: v1",
              "subset: v2",
              "weight: 90",
              "weight: 10",
            ],
          },
        },
      ],
    },
    {
      id: "istio-security",
      title: "Security & mTLS",
      description: "Securing service-to-service communication",
      concepts: [
        {
          id: "istio-mtls",
          title: "Mutual TLS",
          explanation:
            "Istio automatically encrypts traffic between services using mutual TLS. PeerAuthentication policies control when mTLS is enforced. AuthorizationPolicies control which services can talk to each other.",
          commands: [
            {
              command:
                "istioctl x describe pod <pod-name> -n <namespace>",
              description: "Check mTLS mode for a specific pod",
            },
            {
              command: "kubectl get peerauthentication -A",
              description: "List all PeerAuthentication policies",
            },
          ],
          yamlExample: `apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT`,
        },
      ],
      exercises: [
        {
          id: "istio-ex-3",
          type: "yaml",
          title: "Enforce mTLS Cluster-wide",
          prompt:
            "Write a PeerAuthentication policy in the 'istio-system' namespace that enforces STRICT mTLS for the entire mesh.",
          context: "You want all service-to-service traffic encrypted.",
          hints: [
            "PeerAuthentication in istio-system namespace applies mesh-wide",
            "mode: STRICT rejects plaintext connections",
          ],
          solution: `apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: istio-system
spec:
  mtls:
    mode: STRICT`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "kind: PeerAuthentication",
              "namespace: istio-system",
              "mode: STRICT",
            ],
          },
        },
      ],
    },
  ],
};
