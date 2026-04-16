# Charts

Helm chart para desplegar ether-chat-web en Kubernetes, en `charts/ether-chat-web/`.

## Validar chart

```bash
just helm-lint
```

Equivale a `helm lint charts/ether-chat-web`.

## Valores configurables

Los valores principales del chart incluyen imagen, endpoints de backend,
recursos de CPU/memoria e ingress. Ver `charts/ether-chat-web/values.yaml`.

## Regla

No guardar secretos en values versionados.
Los tokens y credenciales se gestionan con Kubernetes Secrets o el sistema
de secretos de la plataforma de despliegue.
