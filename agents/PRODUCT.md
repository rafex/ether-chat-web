# PRODUCT.md

Fuente de verdad del producto.

## Problema

Los equipos que integran agentes de IA necesitan un chat web reutilizable
que pueda incrustarse o desplegarse sin depender desde el inicio de un
backend unico. El chat debe cubrir la experiencia de conversacion, la
configuracion visual y las necesidades particulares de agentes, como
mostrar u ocultar razonamiento tecnico en bloques `<tinker>`.

## Usuarios

- Integradores de producto:
  necesitan un widget configurable que pueda conectarse a sus servicios.
- Equipos de plataforma:
  necesitan empaquetado, CI y despliegue repetible en contenedor o Helm.
- Usuarios finales:
  necesitan conversar con un agente de IA desde una interfaz clara,
  responsive y confiable.

## Objetivos

- Objetivo principal: entregar un frontend PWA de chat generico para
  agentes de IA, configurable y listo para conectarse a backend real.
- Metricas de exito:
  - el chat compila y corre localmente con `just dev-mock`;
  - puede integrarse con REST y queda preparado para gRPC;
  - soporta autenticacion JWT o usuario/contrasena;
  - puede desplegarse por contenedor y Helm;
  - CI valida lint, tests y build.

## No objetivos

- Construir el backend real de conversaciones.
- Implementar un proveedor especifico de IA.
- Resolver analitica avanzada o administracion multi-tenant.
- Definir politicas de negocio ajenas al widget de chat.

## Valor diferencial

Ether Chat Web existe como una base frontend portable para agentes de IA:
combina experiencia de chat, PWA, configuracion visual y contratos de
integracion sin bloquear el proyecto a una sola plataforma backend.
