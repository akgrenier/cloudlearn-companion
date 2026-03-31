import type { Track } from "../types.js";

export const prometheusTrack: Track = {
  id: "prometheus",
  name: "Prometheus & Observability",
  description: "Monitoring, alerting, and metrics in cloud-native environments",
  icon: "📊",
  modules: [
    {
      id: "prom-basics",
      title: "Prometheus Fundamentals",
      description: "Understanding metrics, scrapes, and PromQL basics",
      concepts: [
        {
          id: "prom-intro",
          title: "What is Prometheus?",
          explanation:
            "Prometheus is an open-source monitoring system that pulls metrics from configured targets at regular intervals. It stores data as time-series identified by metric name and key-value labels. PromQL is its powerful query language.",
          commands: [
            {
              command: "promtool query instant 'up'",
              description: "Check which targets are up",
            },
            {
              command: "kubectl port-forward svc/prometheus 9090:9090 -n monitoring",
              description: "Access Prometheus UI locally",
            },
          ],
          yamlExample: `# prometheus.yml scrape config
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true`,
        },
        {
          id: "promql-basics",
          title: "PromQL Essentials",
          explanation:
            "PromQL queries can select instant vectors, range vectors, or scalars. Use rate() for counters, increase() for total increase, and histogram_quantile() for percentiles.",
          commands: [
            {
              command:
                'rate(http_requests_total{job="api"}[5m])',
              description: "Request rate over 5 minutes",
            },
            {
              command:
                'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))',
              description: "p99 latency",
            },
            {
              command:
                'sum by (status_code) (rate(http_requests_total[5m]))',
              description: "Request rate grouped by status code",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "prom-ex-1",
          type: "kubectl",
          title: "Query Metrics",
          prompt:
            "Write a PromQL query that shows the per-second rate of HTTP requests over the last 5 minutes for the 'web' job.",
          context: "Your app exposes http_requests_total counter metric.",
          hints: [
            "Use rate() for counters",
            "rate(metric[5m]) computes per-second rate",
            'Filter with {job="web"}',
          ],
          solution: 'rate(http_requests_total{job="web"}[5m])',
          validation: {
            type: "keyword",
            criteria: ["rate", "http_requests_total", "web", "5m"],
          },
        },
        {
          id: "prom-ex-2",
          type: "yaml",
          title: "Configure a Scrape Target",
          prompt:
            "Write a Prometheus scrape config section that monitors pods with the annotation 'prometheus.io/scrape: true' and scrapes port 9090 at the '/metrics' path.",
          context: "You're adding to an existing prometheus.yml config.",
          hints: [
            "Use kubernetes_sd_configs with role: pod",
            "relabel_configs filter by pod annotations",
            "metrics_path and port can be set in relabel_configs",
          ],
          solution: `scrape_configs:
  - job_name: 'annotated-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        target_label: __address__
        regex: (.+)
        replacement: $1:9090
    metrics_path: /metrics`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "kubernetes_sd_configs",
              "role: pod",
              "relabel_configs",
              "metrics_path: /metrics",
            ],
          },
        },
      ],
    },
    {
      id: "prom-alerts",
      title: "Alerting with Alertmanager",
      description: "Setting up alerts, routing, and notification channels",
      concepts: [
        {
          id: "prom-alerting",
          title: "Alert Rules",
          explanation:
            "Prometheus alert rules evaluate PromQL expressions. When a condition is true for longer than 'for', the alert fires. Alertmanager then routes, deduplicates, and sends notifications.",
          yamlExample: `groups:
  - name: service-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"`,
        },
      ],
      exercises: [
        {
          id: "prom-ex-3",
          type: "yaml",
          title: "Write an Alert Rule",
          prompt:
            "Write a Prometheus alert rule that fires when pod CPU usage exceeds 80% for more than 5 minutes. Name it 'HighCPUUsage' with severity 'warning'.",
          context: "Pod CPU metrics are available as container_cpu_usage_seconds_total.",
          hints: [
            "Use rate() on the counter metric",
            "avg by (pod) to get per-pod average",
            "Threshold 0.80 for 80%",
          ],
          solution: `groups:
  - name: resource-alerts
    rules:
      - alert: HighCPUUsage
        expr: avg by (pod) (rate(container_cpu_usage_seconds_total[5m])) > 0.80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.pod }}"`,
          validation: {
            type: "yaml_structure",
            criteria: [
              "alert: HighCPUUsage",
              "container_cpu_usage_seconds_total",
              "0.80",
              "for: 5m",
              "severity: warning",
            ],
          },
        },
      ],
    },
    {
      id: "prom-grafana",
      title: "Grafana Dashboards",
      description: "Visualizing metrics with Grafana",
      concepts: [
        {
          id: "prom-grafana-intro",
          title: "Dashboard Fundamentals",
          explanation:
            "Grafana connects to Prometheus as a data source and lets you build dashboards with panels. Each panel uses a PromQL query. Variables make dashboards dynamic. Alerts can be added to panels.",
          commands: [
            {
              command:
                "kubectl port-forward svc/grafana 3000:3000 -n monitoring",
              description: "Access Grafana UI (default: admin/admin)",
            },
          ],
        },
      ],
      exercises: [
        {
          id: "prom-ex-4",
          type: "kubectl",
          title: "Deploy Prometheus Stack",
          prompt:
            "Using Helm, install the kube-prometheus-stack into the 'monitoring' namespace with the release name 'monitoring'.",
          context: "Helm 3 is installed. The chart is at prometheus-community/kube-prometheus-stack.",
          hints: [
            "helm install <release> <chart> -n <namespace> --create-namespace",
          ],
          solution:
            "helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace",
          validation: {
            type: "command_match",
            criteria: [
              "helm install monitoring",
              "kube-prometheus-stack",
              "-n monitoring",
            ],
          },
        },
      ],
    },
  ],
};
