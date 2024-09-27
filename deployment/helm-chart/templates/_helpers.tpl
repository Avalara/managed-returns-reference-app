{{/*
Return base name 
*/}}
{{- define "common.basename" -}}
{{ print .Values.projectName "-" .Values.environment -}}
{{ end }}

{{/*
Return service port name 
*/}}
{{- define "common.servicePortName" -}}
{{ coalesce .Values.servicePortName "service-port" }}
{{ end }}

{{/*
Handle logging annotation 
*/}}
{{- define "common.loggingAnnotation" -}}
avalara.io/logging: {{ ternary "enabled" "disabled" .Values.loggingEnabled }}
{{- end }}

{{/* Required annotations for resources */}}
{{- define "common.requiredAnnotations" -}}
avalara.io/team: {{ .Values.teamName | quote }}
avalara.io/contact: {{ .Values.teamName | quote }}
avalara.io/department: {{ .Values.teamName | quote }}
reliability.avalara.io/escalation: "Good Returns Engineering"
security.avalara.io/user-data: {{ .Values.securityLabels.userdata | quote }}
security.avalara.io/data-class: {{ .Values.securityLabels.dataclass | quote }}
deployment.avalara.io/pipeline: "TODO"
inventory.avalara.io/appid: "APP-00702"
inventory.avalara.io/cmpid: "TODO"
{{- end }}

{{/* Labels applied to all resources */}}
{{- define "common.requiredLabels" -}}
avalara.io/version: {{ .Chart.Version | quote }}
avalara.io/component: "app"
avalara.io/managed-by: "helm"
avalara.io/environment: {{ .Values.environment | quote }}
avalara.io/contact: {{ .Values.teamName | quote }}
avalara.io/owner: {{ .Values.teamName | quote }}
avalara.io/group: "raas"
avalara.io/repo: {{ .Values.projectName | quote }}
avalara.io/part-of: {{ .Values.projectName | quote }}
security.avalara.io/user-data: {{ .Values.securityLabels.userdata | quote }}
security.avalara.io/data-class: {{ .Values.securityLabels.dataclass | quote }}
app.kubernetes.io/name: {{ template "common.basename" . }}
app.kubernetes.io/env: {{ .Values.environment | quote }}
app.kubernetes.io/version: {{ .Chart.Version | quote }}
app.kubernetes.io/component: "app"
app.kubernetes.io/part-of: {{ .Values.projectName | quote }}
app.kubernetes.io/managed-by: "helm"
{{- end }}