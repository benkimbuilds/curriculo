# Prepare your development environment

An editor in the browser is useful for a quick start, but a real development environment teaches you to organize files, install tools and run projects. Setup may be frustrating at first. Being able to reproduce a working environment is a practical skill you will use throughout your career.

## Supported paths in this adaptation

The original Odin lessons assume Unix tools and support macOS, Ubuntu and [official Ubuntu flavors](https://ubuntu.com/desktop/flavours). Ruta supports Windows and macOS. For Windows lab computers, use an Ubuntu **WSL2** environment prepared with lab support. You keep Windows and your existing applications. WSL2 is not WSL1, so verify the distribution version rather than assuming they are interchangeable.

Follow Microsoft's [official WSL installation guide](https://learn.microsoft.com/en-us/windows/wsl/install). The usual starting command in an administrator PowerShell window is `wsl --install`. Restart if requested, launch Ubuntu and create its Linux user. In PowerShell, `wsl --list --verbose` lets you verify version 2. Shared lab machines require staff to prepare and authorize system installation; students should not change partitions or bypass device controls.

After setup, run the Unix commands in the lessons **inside Ubuntu**, not PowerShell. Store repositories under the Linux home directory, such as `~/projects`, and install Git and Node in that distribution. Install VS Code on Windows and connect through its WSL extension. Chrome stays on Windows. This division avoids mixing executables, dependency trees and file permissions from two operating systems.

For the earliest HTML exercises, native Windows VS Code and Chrome also work. PowerShell commands are not interchangeable with Bash commands: use explicitly identified platform instructions. On macOS, open Terminal from Applications > Utilities or Spotlight and work natively. You do not need to install Linux on a Mac to follow the course.

## Understand the alternatives

A **virtual machine** emulates a computer inside another operating system. A Linux guest can provide a clearly separated environment without replacing Windows, but consumes memory and storage. See the [VirtualBox installation guide](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/virtual_machine.md) and [video introduction to virtual machines](https://youtu.be/yIVXjl4SwVo). If you choose this route, install the development tools inside the guest rather than only on the host.

**Dual booting** installs separate operating systems and lets you choose one at startup. It can use the machine's full resources, but partition changes can damage data if performed incorrectly. The [dual-boot guide](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/dual_boot.md) remains an alternative reference, not a Ruta requirement or an unsupervised lab task. Backups and appropriate authority are prerequisites for changing a computer's disk layout.

Some Chromebooks support a Linux development environment; see [ChromeOS and ChromeOS Flex guidance](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/chromeos.md). Odin's [WSL2 guide](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/linux/wsl2.md) explains the risks of confusing host and guest environments. The closer integration is convenient but means the terminal, file location and running tool must be checked deliberately.

If you already have a supported Ubuntu installation, do not install another system merely to complete a checklist. If you use macOS, keep its native environment. Choose one stable path and understand it before adding more tools.

## Community support boundaries

The original community limits the configurations it can troubleshoot. Its [explanation of native Windows support](https://github.com/TheOdinProject/blog/wiki/Why-We-Do-Not-Support-Windows) describes that separate project's decision. Ruta's Windows adaptation does not promise that Odin volunteers will support every lab configuration. Explain your actual environment when requesting help and use local lab support for its setup choices.

## Verify the Windows and Linux boundary

The first Ubuntu launch may ask for a Linux username and password. They can differ from your Windows account. A terminal password prompt may show no characters while you type; this is normal behavior, not necessarily a frozen terminal. Never publish that password in screenshots or repositories.

Inside Ubuntu, run `pwd` and recognize a path under `/home`. A path under `/mnt/c` accesses Windows files from Linux. That can be useful for copying a downloaded image, but keep projects with Linux dependencies in the Linux filesystem. When you open `code .`, confirm that VS Code shows the WSL connection and the same folder your terminal uses.

If WSL installation fails because of device policy or virtualization settings, preserve the error and ask lab staff to resolve the environment. Do not keep trying unrelated installation commands or change firmware on a machine you do not administer. Setup troubleshooting starts with the actual error and the environment where it occurred.

## Browser setup

Use Chrome for these exercises so DevTools names and screenshots align. Other browsers are important to test in real projects, but the shared instructional interface reduces unnecessary variation while learning. The [browser usage overview](https://en.wikipedia.org/wiki/Usage_share_of_web_browsers#Summary_tables) provides context rather than a rule about what future users must run.

Follow the appropriate Chrome guide for [macOS](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/macos.md), [Linux](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/linux.md), or [Windows with WSL2](https://github.com/TheOdinProject/curriculum/blob/main/foundations/installations/installation_guides/chrome/wsl2.md). WSL2 users normally do not need a second Linux Chrome installation. Review [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts) as needed.

## Assignment

1. Complete one appropriate setup path with lab support where required.
2. Open Chrome and your working terminal. Run `pwd`, identify the operating system receiving commands, and locate the intended projects folder.
3. Close and reopen the terminal and editor. Verify that you can return to the same environment and folder.
4. Record the selected setup and any unresolved installation error. Git, the editor and Node receive their own installation lessons; do not install every future tool now without a reason.

## Knowledge check

- Which systems does the original course support, and how does Ruta adapt Windows?
- How do WSL2, a conventional virtual machine and dual boot differ?
- Where will your files and each development tool live?
- Which browser do the exercises assume, and why?
