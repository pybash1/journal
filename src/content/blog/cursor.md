---
title: Giving AI Another Chance
description: Test
pubDate: 'Aug 15 2024'
---

I have long been skeptical of AI copilot tools in my code editor. But recently, things took a turn. It all started off with Visual Studio Code becoming slower and hogging more ram day by day. It was quite frustrating. A kind soul, suggested me to try [Cursor](https://cursor.com) as it is exactly a replica of VSCode but with AI assistance built in, however it was much faster than VSCode.

Indeed first impressions, felt faster compared to VSCode. But I still wasn’t a fan of the AI bloat it shipped with, but as a more performant editor is more important to me, I put up with it.

## Getting Acquainted

So, days went by, and I hadn’t touched the AI copilot/chat. I had been working on refactoring the codebase for a project, when I was kinda tired of fixing and improving the same things again and again. This is when I decided to give the Cursor `Ctrl+K` a try. Pressing the shortcut opened up a completely unfamiliar UI, although it wasn’t too difficult to get a hang of.

My first prompt however was in vain. The project had been using [Jotai](https://jotai.dev) and the assistant kind of messed up there. In order to fix it, turns out I can feed custom documentation to the copilot? So, I do that, I feed it Jotai’s documentation, and then prompt it again. And, as much as it hurts me to say this, it did do pretty great. Yeah, I know it wasn’t building anything new, or fixing something broken, it just refactored existing code, but honestly, that isn’t easy either.

These results intrigued my interest and made me try the copilot more. And it has changed my outlook quite a bit.

## The Good

The last time I tried GitHub Copilot back when it released, I was kind of disappointed. It was almost unreliable and generated more often than not incorrect code. Further, the multi-line suggestions just felt annoying. However, Cursor improves in almost all of these aspects. It does not have the annoying multi-line suggestions. It has a rather unique approach to the AI autocomplete, which I rather like.

Also, back when GitHub Copilot launched, it used the GPT-3 model, which compared to today’s models was rather substandard at generating code. Cursor by default today, uses Anthropic’s Claude-3.5-Sonnet model, which gives much better results. Also, Copilot lacked the option to add documentations to its memory, etc.

Yet, another thing that is useful to me is that, the code generated is in the form of git diffs, so I can easily accept a part of an answer and reject the other, which is not possible with other such AI copilots.

## The Bad

However few pretty features aren’t enough to change my mind about AI in code editors. It’s a lot more than that.

Firstly, Cursor remaps the `Ctrl+K` key for AI autocomplete/generation which is actually the default shortcut for macros in VSCode. Thus it is unusual for me, many shortcuts which were accessible using `Ctrl+K` are now accessible through `Ctrl+M` which is a big dealbreaker for me. Further, it still has features like “AI Chat” and new UI elements to showcase the AI functionality which I still feel is just bloat.

Personally, I'd rather lose AI features than lose keybinds or other basic functionality which helps me stay productive and performant.

Also, I’m a sucker for minimalism and clean UI, which these AI elements hinder badly. It hasn’t been long since I’ve switched over to Cursor as my daily driver, but nevertheless it has been an interesting switch and quite not what I was expecting.