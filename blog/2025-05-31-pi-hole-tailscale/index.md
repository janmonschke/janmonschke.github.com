---
title: Pi-hole & Tailscale, my gateway into self-hosting
permalink: pi-hole-tailscale-my-gateway-into-self-hosting/
tags: post
keywords: ["pi-hole", "tailscale", "raspberry pi", "self-hosting", "privacy", "ad-blocking"]
date: 2025-05-31
pomodoros: 9
---

### 👋 Personal context
I wouldn't call myself a homelab/self-hosting enthusiast. To me, these movements were always intertwined with setting up or interacting with "smart" devices. If you know me, you know that I've gone out of my way to make sure that none of our appliances at home are, in any way, "smart". Think internet-connected dishwasher. The idea that a broken OTA update or a shut-down activation server could brick my dish washer was never really appealing to me. And that's not taking into account the privacy implications with some of those devices.

However, in recent conversations with friends and coworkers, I was introduced to a different side of the self-hosting movement. The side that focuses on privacy and a sense of ownership. 

Around the same time was reading [this post by Matan Abudy](https://matanabudy.com/achieving-great-privacy-with-safari/) in which he describes how he set hardened his browser's privacy. Also, [this post by Emilio Coppola](https://coppolaemilio.com/entries/i-left-spotify-what-happened-next/) describing how he set up a private music streaming app sparked more interest. The latter one included a hat-tip to [Jeff Geerling](https://www.youtube.com/c/JeffGeerling) who's content I've been catching up since then.

I guess those blog posts then motivated me to excavate my old Raspberry Pi 3 (Model B) one early morning with the goal to install [Pi-hole](https://pi-hole.net/). Thus, starting a whole flurry of other self-hosting projects.

> 💡 **Info:** `Pi-hole` is a piece of software that blocks ads/trackers on DNS level which therefore does not require another extension to run in your browser/mobile device. When possible, I still use a browser extension to block unwanted content, so Pi-hole mostly helps me to stop tracking/ads on my mobile phone.
 
---

### 🥧 Preparing the Raspberry Pi

Luckily my Raspberry Pi still had an SD card inserted, so I didn't need to search for one in the depth of my tech storage box.

I used the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash Raspberry Pi OS Lite onto the card. In my case I didn't need a desktop environment for the OS, if you prefer that, select the regular Raspberry Pi OS instead.

Since I want to use SSH to setup the Pi later, I also selected `Enable SSH` in the `Advanced Settings` menu. You can enter a desired username and password and go back to the main settings. In case you want the Pi to connect via Wi-Fi, you need to set that up in the settings before flashing as well. However, it's advised to use a wired connection for Pi-Hole setups.

Once the image is written to the card, you can insert it into your Pi, connect connect your ethernet cable, a power source and you're ready to SSH into it:

```bash
ssh your-username@pihole.local
```

> 💡 **Tip:** `pihole.local` is the hostname that I chose, it might be different for you. If `.local` hostname resolution doesn’t work, check your router for the Pi’s IP address or use `nmap` to find it and use the ip to ssh into the Pi.

### 🥧🕳️ Installing Pi-hole

Before running the Pi-hole installer, I made sure the Pi had a static IP. I set a static IP for the Pi in my router's interface and followed [Jeff Gerling's guide on setting a static IP from the command line](https://www.jeffgeerling.com/blog/2024/set-static-ip-address-nmtui-on-raspberry-pi-os-12-bookworm.

```bash
curl -sSL https://install.pi-hole.net | bash
```

The Pi-hole installer walks you through a couple steps that are well explained. It helps you to choose an upstream DNS provider and configure the web admin interface.

Once the installer is finished, you will be able to access the web interface from `https://pihole.local/admin`. Your browser might complain about an invalid HTTPS certificate but you can ignore that. And that's already it, Pi-hole is running on the Pi and you can use the web interface to make changes to the setup.

 >💡 **Tip:** I noticed that Pi-hole was running much smoother (in my setup) when setting `MAXDBDAYS=1` in `/etc/pihole/pihole-FTL.conf` (might need to create the file before). Setting that var requires a restart of `pihole-FTL` with `sudo systemctl restart pihole-FTL`.

The usual next step is to change individual devices' DNS settings to use our Pi-hole server for DNS resolution in order to block ads/trackers. That's a very reasonable setup and if you're happy doing that, you can stop reading now. However, I wanted an "easier" way to use DNS blocking on all devices in my network AND outside my network. And that's where [Tailscale](https://tailscale.com) comes in.
### 🌐 Introducing Tailscale into the mix

Tailscale is a free-to-use mesh VPN software that allows you to connect to your registered machines no matter where you are in the world. It achieves this in a way that does not require you to enable port forwarding or opening up your router to requests from outside your network (this explanation contains a ton of shortcuts, I know).

More importantly, Tailscale allows you to define one of your connected machines as DNS servers. This means that all devices in your (mesh-) network will connect to the internet through this one machine. In our case, that will be the Pi-hole we just set up.

The first step in our setup is to install Tailscale on the Pi. Run the following command in your SSH session:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

That will install Tailscale and ask you to sign up for the service. It's free-to-use for personal use. With the personal account, you'll be able to set Tailscale up on up to 100 devices (they call them machines) and have 3 users access the network.

Now that you have your own Tailscale network with the Pi connected to it, you can set the define as your network's DNS server:

1. Log into the admin panel
2. Go to Machines and copy your Pi's Tailscale IP
3. Go to `DNS`
4. Make sure that `MagicDNS` is turned on
5. And then in `Nameservers`, past your Pi's IP into `Global nameservers` and enable `Override DNS servers`

And that is it. Go ahead and add install Tailscale on your phone, your computer, any device really. All connected devices now benefit from ad-/tracker-blocking of your Pi-hole server.

 >💡 **Tip:** If you ever encounter issues connecting to the internet from a Tailscale-connected device, make sure your Pi-hole server is okay. And if it's somehow in a weird state, disable Tailscale and your device's internet connection will work again (assuming the Pi-hole server was the culprit of course).

### ☕️ Final Thoughts

I’ve been running this setup for a few weeks now and I love it. I'm still using ad-blocker extensions where I can as another layer of protection (since Pi-hole cannot catch 'em all). One look at the Pi-hole dashboard however, shows me how many trackers/ads still get blocked. Most of them seem to come from mobile/desktop applications.

It was a fun weekend project setting up Pi-hole and Tailscale but it's only the beginning of the story. I went on to self-host an RSS reader, a password manager and a replacement for Google Photos. But those are stories for another time.