---
date: ""
layout: post
draft: true
title: ""
description: ""
tags:
category: blog
---

- Upgraded ruby
  - Why ruby first?
  - Which problems did we face?
  - Benchmarks
- Pushed to prod, waited for it to settle down, looked into metrics
  - Increased memory usage so reduced unicorn workers
- Upgraded dependencies
  - Which problems did we face?
  - Sunspot issues
- Pushed to prod, waited for it to settle down, looked into metrics
- Upgraded rails to 4.1
  - Benchmarks
  - Which problems did we face?
- Pushed to prod, waited for it to settle down, looked into metrics
- Upgraded rails to 4.2
  - activemodel serializer woes
  - Benchmarks
  - Which problems did we face?
- Updated delayed job usage to use activejob
- Canary builds
