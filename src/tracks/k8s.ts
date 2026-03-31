import type { Track } from "../types.js";

export const k8sTrack: Track = {
  id: "k8s",
  name: "Kubernetes Fundamentals",
  description: "Learn core Kubernetes concepts from pods to deployments",
  icon: "⎈",
  modules: [
    {
      id: "k8s-pods",
      title: "Pods & Containers",
      description: "Understanding the smallest deployable units in Kubernetes",
      concepts: [
        {
          id: "k8s-pods-intro",
          title: "What is a Pod?",
          explanation:
            "A Pod is the smallest deployable unit in Kubernetes. It wraps one or more containers with shared storage and network. Pods are ephemeral — they can be created, destroyed, and replaced at any time.",
          commands: [
            {
              command: "kubectl run nginx --image=nginx --port=80",
              description: "Create a pod running nginx",
            },
            {
              command: "kubectl get pods",
              description: "List all pods in the current namespace",
            },
            {
              command: "kubectl describe pod nginx",
              description: "Show detailed information about a pod",
            },
            {
              command: "kubectl logs nginx",
              description: "View logs from a pod",
            },
            {
              command: "kubectl exec -it nginx -- /bin/sh",
              description: "Open a shell inside a running pod",
            },
          ],
        },
        {
          id: "k8s-pods-lifecycle",
          title: "Pod Lifecycle",
          explanation:
            "Pods go through Pending → Running → Succeeded/Failed phases. Each container can have readiness and liveness probes. Readiness probes control traffic routing; liveness probes trigger restarts.",
          commands: [
            {
              command: "kubectl get pods -o wide",
              description: "Show pods with node placement and IPs",
            },
            {
              command: "kubectl get events --sort-by='.lastTimestamp'",
              description: "View cluster events sorted by time",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "k8s-ex-1",
          type: "kubectl",
          title: "Create Your First Pod",
          prompt:
            "Create a pod named 'web' using the 'nginx:1.25' image. Expose port 80.",
          context: "You have a fresh Kubernetes cluster with kubectl configured.",
          hints: [
            "Use kubectl run with --image and --port flags",
            "The command follows: kubectl run <name> --image=<image> --port=<port>",
          ],
          solution: "kubectl run web --image=nginx:1.25 --port=80",
          validation: {
            type: "command_match",
            criteria: ["kubectl run web", "nginx:1.25", "--port=80"],
          },
        },
        {
          id: "k8s-ex-2",
          type: "kubectl",
          title: "Inspect a Pod",
          prompt:
            "The pod 'api-server' is failing to start. Run the command to see detailed information about what went wrong.",
          context:
            "A pod named 'api-server' exists in the default namespace but is in CrashLoopBackOff state.",
          hints: [
            "kubectl describe shows events and conditions",
            "Look at the Events section for error messages",
          ],
          solution: "kubectl describe pod api-server",
          validation: {
            type: "command_match",
            criteria: ["kubectl describe pod api-server"],
          },
        },
        {
          id: "k8s-ex-3",
          type: "yaml",
          title: "Write a Pod Manifest",
          prompt:
            "Write a YAML manifest for a pod named 'redis-cache' that runs 'redis:7-alpine' and exposes port 6379. Set the restartPolicy to 'Always'.",
          context: "Create the manifest from scratch — no template provided.",
          hints: [
            "Start with apiVersion: v1, kind: Pod",
            "Container spec goes under spec.containers[]",
            "restartPolicy goes under spec (not containers)",
          ],
          solution: `apiVersion: v1
kind: Pod
metadata:
  name: redis-cache
spec:
  containers:
    - name: redis
      image: redis:7-alpine
      ports:
        - containerPort: 6379
  restartPolicy: Always`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "kind: Pod",
              "name: redis-cache",
              "redis:7-alpine",
              "containerPort: 6379",
              "restartPolicy: Always",
            ],
          },
        },
      ],
    },
    {
      id: "k8s-deployments",
      title: "Deployments & ReplicaSets",
      description:
        "Managing application lifecycle with declarative deployments",
      concepts: [
        {
          id: "k8s-deploy-intro",
          title: "What is a Deployment?",
          explanation:
            "A Deployment manages ReplicaSets which manage Pods. Deployments enable rolling updates, rollbacks, and scaling. You declare the desired state and Kubernetes maintains it.",
          commands: [
            {
              command:
                "kubectl create deployment web-app --image=nginx --replicas=3",
              description: "Create a deployment with 3 replicas",
            },
            {
              command: "kubectl get deployments",
              description: "List all deployments",
            },
            {
              command: "kubectl scale deployment web-app --replicas=5",
              description: "Scale a deployment to 5 replicas",
            },
            {
              command:
                "kubectl set image deployment/web-app nginx=nginx:1.26",
              description: "Update the container image (triggers rolling update)",
            },
            {
              command: "kubectl rollout history deployment/web-app",
              description: "View rollout history",
            },
            {
              command: "kubectl rollout undo deployment/web-app",
              description: "Rollback to previous revision",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "k8s-ex-4",
          type: "kubectl",
          title: "Create a Deployment",
          prompt:
            "Create a deployment called 'frontend' with 3 replicas of 'node:20-alpine'.",
          context: "You need to deploy a Node.js frontend app.",
          hints: [
            "Use kubectl create deployment with --image and --replicas flags",
          ],
          solution:
            "kubectl create deployment frontend --image=node:20-alpine --replicas=3",
          validation: {
            type: "command_match",
            criteria: [
              "kubectl create deployment frontend",
              "node:20-alpine",
              "--replicas=3",
            ],
          },
        },
        {
          id: "k8s-ex-5",
          type: "kubectl",
          title: "Rolling Update",
          prompt:
            "The deployment 'api' needs to be updated from 'api:v1' to 'api:v2'. Perform a rolling update.",
          context: "The deployment 'api' is currently running 4 replicas of api:v1.",
          hints: [
            "kubectl set image is the fastest way to trigger a rolling update",
            "Syntax: kubectl set image deployment/<name> <container>=<new-image>",
          ],
          solution: "kubectl set image deployment/api api=api:v2",
          validation: {
            type: "command_match",
            criteria: ["kubectl set image deployment/api", "api:v2"],
          },
        },
      ],
    },
    {
      id: "k8s-services",
      title: "Services & Networking",
      description: "Exposing applications and managing traffic",
      concepts: [
        {
          id: "k8s-svc-intro",
          title: "What is a Service?",
          explanation:
            "A Service provides a stable endpoint for a set of pods. Types include ClusterIP (internal), NodePort (node-level), LoadBalancer (cloud), and ExternalName (DNS alias).",
          commands: [
            {
              command: "kubectl expose deployment web-app --port=80 --type=ClusterIP",
              description: "Create a ClusterIP service",
            },
            {
              command: "kubectl get services",
              description: "List all services",
            },
            {
              command:
                "kubectl expose deployment web-app --port=80 --type=NodePort",
              description: "Expose via NodePort",
            },
          ],
          yamlExample: `apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  type: ClusterIP
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 8080`,
        },
      ],
      exercises: [
        {
          id: "k8s-ex-6",
          type: "yaml",
          title: "Write a Service Manifest",
          prompt:
            "Write a ClusterIP service named 'backend-svc' that selects pods with label 'app=backend' and routes port 80 to targetPort 3000.",
          context: "Your backend app listens on port 3000.",
          hints: [
            "Service selector matches pod labels",
            "port is the service port, targetPort is the container port",
          ],
          solution: `apiVersion: v1
kind: Service
metadata:
  name: backend-svc
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 3000`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "kind: Service",
              "name: backend-svc",
              "app: backend",
              "port: 80",
              "targetPort: 3000",
            ],
          },
        },
      ],
    },
  ],
};
