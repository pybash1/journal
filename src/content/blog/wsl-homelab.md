---
title: The WSL Homelab Experiment
description: Experimenting with a homelab running inside a WSL instance
pubDate: "Oct 1 2025"
---

I have wanted to build a homelab for as long as I can remember but I can’t buy a 1000$ PC just to turn on and off a couple of switches or view my room through an Android IP Cam, atleast not until I move out. So, for the meantime I had to settle with something close but not quite. I decided to repurpose an old laptop with 8 gigs of ram, a 1TB SSD, and an Intel Core i5 - which would be sufficient for a homelab.

## Problem #1: Can’t install Linux

Just as I was about to start the setup like every homelab tutorial ever - I hit a roadblock. My dad uses this laptop maybe once every 3 months so I have to keep windows on it. You’re probably not wondering ???? because of the article’s title. So, a… Windows…. homelab? Is that even a thing?

We are here:

- I want a homelab
- I can’t get a new machine
- Old laptop cannot be fully linux

So, partial linux it is, but how? Dual boot? Too complex for dad, also reduces storage space. WSL? Works but virtuallized and less memory and CPU. Also, WSL won’t stay running if I close the lid however it is my only option, I had to try and get past the other issues that came along with it.

I decided to go with Arch as my preferred distro because its simple and very small which I like. Installing arch was simple, all I had to do was install the official WSL image:

```sh
wsl --update
wsl --install archlinux
```

## Problem #2: WSL’s “idle” mode

Ok, we installed linux inside windows - is that it? Mostly, but not quite. I faced a number of other problems which I will document here so you don’t have to.

The first being, WSL’s sleep mode-like feature. WSL automatically after a threshold interval(default 60 seconds) timesout and goes into an “idle” of sorts which is not a full shutdown so the VM is still running but basically every process is in a suspended state of sorts so none of the services running inside WSL are accessible or usable.

Trying to keep WSL running forever, I stumbled upon [this thread](https://github.com/microsoft/WSL/issues/10138#issuecomment-1590076363). However, putting `vmIdleTimeout=-1` did not work for me and simply broke my WSL instance altogether as it would not start at all. So, I had to revert back to the default of 60s.

So, I dug deeper and found that I can run `dbus-launch true` to keep one session running in the background. So I used the `-e` flag to run it and then exit the terminal like so:

```sh
wsl -e dbus-launch true
```

and for me, this worked. The server stayed running and didn’t idle after 1 minute.

## Problem #3: Windows goes to sleep

Even though I was able to get WSL to stay running, there was another problem. I didn’t want to keep my laptop’s lid open at all times. But putting the lid down, meant Windows itself would go into sleep mode, thus, suspending all processes, including WSL.

I imagined this would be a simple toggle in the settings, but it turned out to be a lot more frustrating.

When I went into Windows’ battery settings, there weren’t many options but I disabled most of them, it still didn’t work completely. Closing the lid sometimes, put the device to sleep while sometimes it locked the device and at times it did nothing. And for a while couldn’t figure out how to fix this until I found power settings inside the “deprecated” control panel. Here I found clear options for what happens when I leave the lid open for a while on battery, or when plugged in, and for what happens when I close the lid. Changing all the options to “Nothing” worked perfectly. No more sleep mode unless I explicitly put it to sleep or lock it, and WSL keeps running too.

## Problem #4: Default resource limits

Everything was working pretty much perfect now until I started all my services. To understand better, here is a list of everything I run on my homelab, in no particular order:

- [Glance](https://github.com/glanceapp/glance)
- [Pi-Hole](https://pi-hole.net)
- [Immich](https://immich.app)
- [Home Assistant](https://home-assistant.io)
- [Traefik](htpps://traefik.io)
- [File Browser](https://filebrowser.org)
- [qBittorrent](https://hub.docker.com/r/linuxserver/qbittorrent)
- [Paperless](https://paperless-ngx.com)
- [StirlingPDF](https://stirlingpdf.com)
- [Adminer](https://www.adminer.org)
- [Tailscale](https://tailscale.com)
- [Monitee](https://monitee.app)

When I was starting the first few services, there were no problems, CPU usage was at around 1-2% on a 15 minute average and RAM usage was at 45% at idle. But when I finished starting up all the services, the CPU usage had gone up to 10-15% on a 15 minute average, which isn’t too bad however RAM was at 97% on idle with 100% swap usage. This didn’t look good and was also affecting the speed of the running services, like Pi-Hole which in turn affected my internet speed as DNS queries were taking longer to resolve than usual. Further, I have plans to run Jellyfin on this machine, which would definitely not work with these low resources.

If you’re running less services or you are fine with the default 4GB(50% of total memory) memory of WSL, but for me this clearly wasn’t enough so I had to increase it. I didn’t want to give WSL all 8 gigs of my RAM as it might cause problems with Windows, so I settled for 7GB. Updating this was actually really simple and also well documented. Following the official WSL [here](https://learn.microsoft.com/en-us/windows/wsl/wsl-config#main-wsl-settings) I updated my `.wslconfig` file to the following:

```toml
[wsl2]
memory=7516192768
swap=4294967296
vmIdleTimeout=60000
```

and then did `wsl --shutdown`, restarted WSL and voila! CPU usage is back to 1% and RAM is at 40% with 0 swap used.

> [!TIP]
> After finishing this article, I found out that in the latest versions of Windows and WSL2. There is a separate GUI application called “WSL settings”. You can use that to simply update the memory of your WSL instance using human readable numbers like 7 for 7 GB instead of `7340032000`

## It works?

For me, this was all the roadblocks I hit while trying to get my homelab inside WSL up and running. I did have other issues trying to get specific softwares running and configured properly but that has nothing to do with WSL so that’s not relevant for this article, maybe some other day?

This was definitely a fun experiment but it is also a feasible alternative to a small scale home server and I am using this for my home right now though I have plans to upgrade.

This setup isn’t perfect but with enough stubborness it can definitely run most self hosted services quite reliably.
