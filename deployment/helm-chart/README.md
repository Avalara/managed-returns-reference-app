# managed-returns-reference-app

Service Description

## Parameters

### General

| Name              | Description                                                                                                                                                                                                                                         | Value               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `environment`     | The environment for the deployment. ex: dev, qa, prd                                                                                                                                                                                                | `dev`               |
| `teamName`        | The deploying team name. This value is included in labels for various kubernetes resources.                                                                                                                                                         | `default`           |
| `iamRoleARN`      | The ARN of an IAM role created with https://scm.platform.us-west-2.avalara.io/sre-public/tf-core-modules/-/tree/main/aws/iam/irsa-helper and with necessary permissions (e.g. to pull a secret). If null the service will not have AWS permissions. | `nil`               |
| `loggingEnabled`  | flag to enable/disable log collection for Sumo Logic                                                                                                                                                                                                | `false`             |
| `replicaCount`    | The number of replicas (pods) for the deployment. Ignored if autoscaling.enabled is set to true                                                                                                                                                     | `2`                 |
| `imagePullSecret` | the image pull secret used to fetch images from GitLab. A secret called raas-deploy-token is automatically created by RaaS service deployment pipelines                                                                                             | `raas-deploy-token` |

### Ingress

| Name                       | Description                                                                                                                                                                          | Value                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `ingress.enabled`          | flag to enable/disable ingress                                                                                                                                                       | `true`                                                         |
| `ingress.fqdn`             | The domain where the service will be available to access from outside the cluster. This must be a subdomain of the cluster's domain.                                                 | `managed-returns-reference-app.foundation.raas.dev.avalara.io` |
| `ingress.ingressClassName` | The IngressClass name. Will likely be "nginx" when deploying to clusters built from the terraform-aws-ekscluster module and either "private" or "public" for newer phoenix clusters. | `nginx`                                                        |
| `ingress.maxRequestSize`   | Sets the maximum allowed size of the client request body                                                                                                                             | `1m`                                                           |

### Environment Variables

| Name                                  | Description                   | Value          |
| ------------------------------------- | ----------------------------- | -------------- |
| `environmentVars.RAAS_SAMPLE_ENV_VAR` | a sample environment variable | `SAMPLE_VALUE` |

### Autoscaling

| Name                                         | Description                                       | Value   |
| -------------------------------------------- | ------------------------------------------------- | ------- |
| `autoscaling.enabled`                        | flag to enable/disable autoscaling                | `false` |
| `autoscaling.minReplicas`                    | min replicas                                      | `2`     |
| `autoscaling.maxReplicas`                    | max replicas                                      | `5`     |
| `autoscaling.targetCPUUtilizationPercentage` | target CPU utilization percentage to scale around | `80`    |

### Service Monitor

| Name                           | Description                              | Value      |
| ------------------------------ | ---------------------------------------- | ---------- |
| `serviceMonitor.enabled`       | flag to enable/disable service monitor   | `false`    |
| `serviceMonitor.interval`      | the interval for the monitoring requests | `30s`      |
| `serviceMonitor.path`          | path to the metrics                      | `/metrics` |
| `serviceMonitor.scrapeTimeout` | timeout for the monitoring requests      | `5s`       |

### Liveness Probe

| Name                                | Description                              | Value       |
| ----------------------------------- | ---------------------------------------- | ----------- |
| `livenessProbe.enabled`             | flag to enable/disable liveness probe    | `false`     |
| `livenessProbe.path`                | path to the service is available         | `/liveness` |
| `livenessProbe.initialDelaySeconds` | the initial delay for the liveness check | `30`        |
| `livenessProbe.periodSeconds`       | interval for the liveness check in sec   | `100`       |

### Readiness Probe

| Name                                 | Description                               | Value        |
| ------------------------------------ | ----------------------------------------- | ------------ |
| `readinessProbe.enabled`             | flag to enable/disable readiness probe    | `false`      |
| `readinessProbe.path`                | path to the readiness check               | `/readiness` |
| `readinessProbe.initialDelaySeconds` | the initial delay for the readiness check | `30`         |
| `readinessProbe.periodSeconds`       | interval for the readiness check in sec   | `100`        |

### Resource Limits

| Name                    | Description                            | Value    |
| ----------------------- | -------------------------------------- | -------- |
| `resourceLimits.cpu`    | limits for CPU resources in millicores | `500m`   |
| `resourceLimits.memory` | limits for Memory resources in bytes   | `1024Mi` |

### Resource Requests

| Name                      | Description                              | Value   |
| ------------------------- | ---------------------------------------- | ------- |
| `resourceRequests.cpu`    | requests for CPU resources in millicores | `100m`  |
| `resourceRequests.memory` | requests for Memory resources in bytes   | `128Mi` |

### Security Labels

| Name                       | Description                                                                                            | Value      |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | ---------- |
| `securityLabels.userdata`  | Identifies whether a resource contains PII. Can be either true or false.                               | `false`    |
| `securityLabels.dataclass` | Identifies the data classification of the resource. Can be public, internal, sensitive, or restricted. | `internal` |

### Chart Owner Parameters

| Name                            | Description                                                                                                                                                                                                                                  | Value                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `projectName`                   | The project name. This should generally match the GitLab project name containing the chart and service code. This value will be expanded to \<projectName\>-\<environment\> which will be included in many of the Kubernetes resource names. | `managed-returns-reference-app`                                                                       |
| `image`                         | The URL for the container registry. This is essentially the image URL but WITHOUT including the image version.                                                                                                                               | `docker.platform.avalara.io/good-returns/managed-returns-reference-app/managed-returns-reference-app` |
| `containerPort`                 | The port that the container listens on.                                                                                                                                                                                                      | `5000`                                                                                                |
| `servicePort`                   | The port for the Kubernetes service to listen on. This value is only important when accessing the service from within the cluster.                                                                                                           | `5000`                                                                                                |
| `servicePortName`               | a name for the service port                                                                                                                                                                                                                  | `service-port`                                                                                        |
| `imagePullPolicy`               | image pull policy for the given image                                                                                                                                                                                                        | `Always`                                                                                              |
| `terminationGracePeriodSeconds` | the grace period to force shutdown after the SIGTERM signal                                                                                                                                                                                  | `30`                                                                                                  |
