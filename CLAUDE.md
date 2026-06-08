# Regras do Projeto

## Animação
- Todo scroll usa Lenis. Nunca scroll nativo.
- Todo movimento usa GSAP. Nunca CSS transition em animações de entrada.
- Ease padrão do projeto: power3.out
- Duration mínima de entrada: 0.6s
- Nenhuma animação abaixo de 0.6s — sites cinematográficos são lentos com intenção.

## Lenis + ScrollTrigger
- Inicializar Lenis uma única vez no layout.tsx como Provider.
- Lenis deve alimentar o ScrollTrigger via lenis.on('scroll', ScrollTrigger.update).
- NUNCA usar window.addEventListener('scroll') quando Lenis estiver ativo.

## Componentes
- Um componente = um .tsx + um .module.css. Sem exceções.
- Sem Tailwind inline. Todo CSS em .module.css.
- Todo componente com GSAP: useGSAP do @gsap/react, cleanup no return.

## O que nunca fazer
- bounce ou elastic em qualquer animação
- ease-in-out (parece slideshow de PowerPoint)
- translateY menor que 20px em entradas (não tem peso visual)
- Duration round como 500ms ou 1000ms (parece relógio)
